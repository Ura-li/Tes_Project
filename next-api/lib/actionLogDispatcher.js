import prisma from "../prisma/client";
import { notifySocket } from "./SocketClient";
import { sendEmail, buildCaseOwnerChangeEmail } from "./email";

const CASE_INFO_SELECT = {
  CaseID: true,
  CaseSubject: true,
  Owner: true,
  CreatedBy: true,
  ownerUser: {
    select: {
      IDUser: true,
      Name: true,
      Email: true,
    },
  },
  createdByUser: {
    select: {
      IDUser: true,
      Name: true,
      Email: true,
    },
  },
};

const USER_SELECT = {
  IDUser: true,
  Name: true,
  Email: true,
};

function parseUserId(raw) {
  if (raw === null || raw === undefined) return null;
  const trimmed = String(raw).trim();
  if (trimmed.length === 0) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) && num > 0 ? num : null;
}

async function fetchCaseInfo(caseId) {
  if (!caseId) return null;
  return prisma.caseinformation.findUnique({
    where: { CaseID: caseId },
    select: CASE_INFO_SELECT,
  });
}

async function fetchUserById(id) {
  if (!id) return null;
  return prisma.user.findUnique({
    where: { IDUser: id },
    select: USER_SELECT,
  });
}

export async function handleActionLogNotifications({ actionLog, caseInfo }) {
  if (!actionLog) {
    throw new Error("handleActionLogNotifications requires an actionLog instance");
  }

  const caseId = actionLog.CaseId || actionLog.CaseID || null;
  const baseCaseInfo = caseInfo || (await fetchCaseInfo(caseId));

  let enrichedCaseInfo = baseCaseInfo ? { ...baseCaseInfo } : null;
  let ownerIdForNotify = enrichedCaseInfo?.Owner ?? null;
  let emailDispatched = false;
  let emailError = null;

  const modelName = actionLog.model ? actionLog.model.toLowerCase() : "";

  if (modelName === "caseowner") {
    const previousOwnerId = parseUserId(actionLog.dataOld);
    const newOwnerId = parseUserId(actionLog.dataNew);

    const [previousOwner, newOwner] = await Promise.all([
      fetchUserById(previousOwnerId),
      fetchUserById(newOwnerId),
    ]);

    const recipients = [];

    if (newOwner?.Email) {
      recipients.push(newOwner.Email);
    } else if (
      newOwnerId &&
      enrichedCaseInfo?.ownerUser?.IDUser === newOwnerId &&
      enrichedCaseInfo.ownerUser.Email
    ) {
      recipients.push(enrichedCaseInfo.ownerUser.Email);
    }

    if (
      previousOwner?.Email &&
      !recipients.includes(previousOwner.Email)
    ) {
      recipients.push(previousOwner.Email);
    }

    if (recipients.length > 0) {
      try {
        const { subject, text, html } = buildCaseOwnerChangeEmail({
          caseId: caseId,
          caseSubject: enrichedCaseInfo?.CaseSubject,
          newOwner,
          previousOwner,
          changedBy: actionLog.changedByUser,
          logDescription: actionLog.logDescription,
        });

        await sendEmail({
          to: recipients,
          subject,
          text,
          html,
        });
        emailDispatched = true;
      } catch (err) {
        emailError = err.message;
        console.error("handleActionLogNotifications email error:", err);
      }
    }

    if (newOwner) {
      ownerIdForNotify = newOwner.IDUser;
      if (enrichedCaseInfo) {
        enrichedCaseInfo = {
          ...enrichedCaseInfo,
          Owner: newOwner.IDUser,
          ownerUser: newOwner,
        };
      }
    } else if (newOwnerId) {
      ownerIdForNotify = newOwnerId;
      if (enrichedCaseInfo) {
        enrichedCaseInfo = {
          ...enrichedCaseInfo,
          Owner: newOwnerId,
        };
      }
    }
  }

  await notifySocket("log:created", actionLog, {
    createdById: enrichedCaseInfo?.CreatedBy ?? null,
    ownerId: ownerIdForNotify ?? enrichedCaseInfo?.Owner ?? null,
    CaseId: caseId,
  });

  return {
    emailDispatched,
    emailError,
    caseInfo: enrichedCaseInfo,
    ownerId: ownerIdForNotify ?? enrichedCaseInfo?.Owner ?? null,
  };
}
