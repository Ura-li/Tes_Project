import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

const CASE_STATUS_BY_ORDER_STATUS = {
  Ordered: "PartOrder",
  Shipped: "PartAvailable",
};

export async function PATCH(request) {
  try {
    const {
      updates = {},
      MOID,
      WOID,
      userId,
      SalesOrderNumber,
      RMANumber,
    } = await request.json();

    if (!MOID || !WOID) {
      return NextResponse.json(
        {
          success: false,
          message: "MOID and WOID are required for batch update",
        },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const [materialOrder, workOrder] = await Promise.all([
        tx.materialorder.findUnique({ where: { MOID } }),
        tx.workorder.findUnique({
          where: { WOID },
          include: { caseinformation: true },
        }),
      ]);

      if (!materialOrder) {
        throw new Error("Material Order not found");
      }

      if (!workOrder) {
        throw new Error("Work Order not found");
      }

      const originalOrderStatus = materialOrder.OrderStatus;
      const originalSalesOrder = materialOrder.SalesOrderNumber ?? null;
      const originalRmaNumber = materialOrder.RMANumber ?? null;

      const updateEntries = Object.entries(updates ?? {});
      if (updateEntries.length > 0) {
        for (const [lineItemID, status] of updateEntries) {
          await tx.materialorderlineitems.update({
            where: { LineItemID: Number(lineItemID) },
            data: { Status: status },
          });
        }
      }

      const lineItems = await tx.materialorderlineitems.findMany({ where: { MOID } });
      const allMatch = (status) =>
        lineItems.length > 0 && lineItems.every((item) => item.Status === status);

      const materialOrderUpdate = {};

      if (allMatch("Shipped")) {
        materialOrderUpdate.OrderStatus = "Shipped";
      } else if (allMatch("Ordered")) {
        materialOrderUpdate.OrderStatus = "Ordered";
      } else if (allMatch("Cancelled")) {
        materialOrderUpdate.OrderStatus = "Cancelled";
      } else if (allMatch("Closed")) {
        materialOrderUpdate.OrderStatus = "Closed";
      } else if (allMatch("Submitted")) {
        materialOrderUpdate.OrderStatus = "Submitted";
      } else if (allMatch("New")) {
        materialOrderUpdate.OrderStatus = "New";
      }

      if (
        SalesOrderNumber !== undefined &&
        (SalesOrderNumber || null) !== originalSalesOrder
      ) {
        materialOrderUpdate.SalesOrderNumber = SalesOrderNumber || null;
      }

      if (
        RMANumber !== undefined &&
        (RMANumber || null) !== originalRmaNumber
      ) {
        materialOrderUpdate.RMANumber = RMANumber || null;
      }

      let updatedOrder = materialOrder;
      if (Object.keys(materialOrderUpdate).length > 0) {
        updatedOrder = await tx.materialorder.update({
          where: { MOID },
          data: materialOrderUpdate,
        });
      }

      const derivedOrderStatus = updatedOrder.OrderStatus;
      const logsToCreate = [];

      if (updateEntries.length > 0) {
        const statusSummary =
          derivedOrderStatus !== originalOrderStatus
            ? `${originalOrderStatus ?? "Unknown"} -> ${derivedOrderStatus}`
            : derivedOrderStatus ?? originalOrderStatus ?? "Unknown";

        logsToCreate.push({
          CaseId: workOrder.caseinformation?.CaseID,
          ReferenceId: MOID,
          model: "Material Orders",
          dataOld: originalOrderStatus ?? "Unknown",
          dataNew: derivedOrderStatus ?? originalOrderStatus ?? "Unknown",
          changedBy: userId,
          logDescription: `Batch update MOLI for MO ${MOID}: ${updateEntries.length} item(s) updated. MO status: ${statusSummary}`,
        });
      }

      const targetCaseStatus = CASE_STATUS_BY_ORDER_STATUS[derivedOrderStatus];
      const currentCaseStatus = workOrder.caseinformation?.CaseStatus ?? null;

      let caseOwnerId = null;
      if (targetCaseStatus === "PartOrder") {
        let logisticUser = await tx.user.findUnique({ where: { Username: "logis" } });
        if (!logisticUser) {
          logisticUser = await tx.user.findFirst({
            where: { Role: { equals: "lg", mode: "insensitive" } },
            orderBy: { IDUser: "asc" },
          });
        }
        caseOwnerId = logisticUser?.IDUser ?? null;
      } else if (targetCaseStatus === "PartAvailable") {
        caseOwnerId = workOrder.OwnerID ?? null;
      }

      if (
        targetCaseStatus &&
        targetCaseStatus !== currentCaseStatus &&
        workOrder.caseinformation?.CaseID
      ) {
        const caseUpdateData = {
          CaseStatus: targetCaseStatus,
        };
        if (caseOwnerId) {
          caseUpdateData.Owner = caseOwnerId;
        }

        await tx.caseinformation.update({
          where: { CaseID: workOrder.caseinformation.CaseID },
          data: caseUpdateData,
        });

        const ownerChanged =
          caseOwnerId &&
          caseOwnerId !== (workOrder.caseinformation?.Owner ?? null);

        const ownerNote = ownerChanged
          ? targetCaseStatus === "PartOrder"
            ? " Owner reassigned to Logistic."
            : " Owner reassigned to CE."
          : "";

        logsToCreate.push({
          CaseId: `${workOrder.caseinformation.CaseID}`,
          model: "Case",
          dataOld: currentCaseStatus ?? "Unknown",
          dataNew: targetCaseStatus,
          changedBy: userId,
          logDescription: `Edit: change status from ${currentCaseStatus ?? "Unknown"} to ${targetCaseStatus}.${ownerNote}`,
        });
      }

      const identifiersChanged =
        (SalesOrderNumber !== undefined && (SalesOrderNumber || null) !== originalSalesOrder) ||
        (RMANumber !== undefined && (RMANumber || null) !== originalRmaNumber);

      if (identifiersChanged && updateEntries.length === 0) {
        const changes = [];
        if (SalesOrderNumber !== undefined && (SalesOrderNumber || null) !== originalSalesOrder) {
          changes.push(`SO: ${originalSalesOrder ?? "-"} -> ${SalesOrderNumber || "-"}`);
        }
        if (RMANumber !== undefined && (RMANumber || null) !== originalRmaNumber) {
          changes.push(`RMA: ${originalRmaNumber ?? "-"} -> ${RMANumber || "-"}`);
        }

        logsToCreate.push({
          CaseId: workOrder.caseinformation?.CaseID,
          ReferenceId: MOID,
          model: "Material Orders",
          dataOld: originalOrderStatus ?? "Unknown",
          dataNew: derivedOrderStatus ?? originalOrderStatus ?? "Unknown",
          changedBy: userId,
          logDescription: `Material Order ${MOID} identifiers updated (${changes.join(", ")})`,
        });
      }

      for (const log of logsToCreate) {
        await tx.actionLog.create({ data: log });
      }

      const updatedLineItems = await tx.materialorderlineitems.findMany({ where: { MOID } });

      return {
        materialOrder: {
          ...updatedOrder,
          materialorderlineitems: updatedLineItems,
        },
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Batch update success!",
        data: result.materialOrder,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Batch Material Order",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
