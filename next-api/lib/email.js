import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const REQUIRED_VARS = [
  "OAUTH_EMAIL",
  "OAUTH_CLIENT_ID",
  "OAUTH_CLIENT_SECRET",
  "OAUTH_REFRESH_TOKEN",
];

function ensureEmailConfig() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(", ")}`);
  }
}

function normaliseRecipients(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function sendEmail({ to, cc, subject, text, html }) {
  const recipients = normaliseRecipients(to);
  const ccRecipients = normaliseRecipients(cc);

  if (recipients.length === 0) {
    throw new Error("Email recipient is required");
  }

  ensureEmailConfig();

  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const { token } = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.OAUTH_EMAIL,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      accessToken: token,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.OAUTH_EMAIL,
    to: recipients.join(", "),
    subject,
    text,
    html,
  };

  if (ccRecipients.length > 0) {
    mailOptions.cc = ccRecipients.join(", ");
  }

  return transporter.sendMail(mailOptions);
}

function resolveCaseLink(caseId) {
  const baseUrl =
    process.env.APP_BASE_URL ||
    process.env.CLIENT_APP_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const normalisedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalisedBase}/app/case/${caseId}`;
}

export function buildCaseOwnerChangeEmail({
  caseId,
  caseSubject,
  newOwner,
  previousOwner,
  changedBy,
  logDescription,
  caseLink,
}) {
  const link = caseLink || resolveCaseLink(caseId);
  const subject = `[Case Update] Case #${caseId} owner changed`;
  const newOwnerName = newOwner?.Name || "New owner";
  const previousOwnerName = previousOwner?.Name || "Previous owner";
  const changedByName = changedBy?.Name || "System";

  const textParts = [
    `Case ${caseId}${caseSubject ? ` (${caseSubject})` : ""} owner changed.`,
    `Previous owner: ${previousOwnerName}`,
    `New owner: ${newOwnerName}`,
    `Changed by: ${changedByName}`,
    logDescription ? `Details: ${logDescription}` : null,
    `Open case: ${link}`,
  ].filter(Boolean);

  const text = textParts.join("\n");

  const descriptionBlock = logDescription
    ? `<p style="margin: 12px 0;"><strong>Details:</strong><br>${logDescription}</p>`
    : "";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2933;">
      <h2 style="color: #0b7285; margin-bottom: 8px;">Case Owner Changed</h2>
      <p style="margin: 0 0 12px;">Case <strong>${caseId}</strong>${
        caseSubject ? ` &mdash; ${caseSubject}` : ""
      } has a new owner.</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; margin: 16px 0;">
        <tbody>
          <tr>
            <td style="font-weight: bold; padding-right: 16px;">Previous Owner</td>
            <td>${previousOwnerName}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-right: 16px;">New Owner</td>
            <td>${newOwnerName}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-right: 16px;">Changed By</td>
            <td>${changedByName}</td>
          </tr>
        </tbody>
      </table>
      ${descriptionBlock}
      <p style="margin: 24px 0;">
        <a href="${link}" style="display: inline-block; padding: 10px 18px; background: #0b7285; color: #fff; text-decoration: none; border-radius: 4px;">
          View Case
        </a>
      </p>
      <p style="font-size: 12px; color: #6c757d; margin-top: 24px;">This message was generated automatically.</p>
    </div>
  `.trim();

  return { subject, text, html, link };
}
