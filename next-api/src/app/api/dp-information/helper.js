import { Prisma } from "@prisma/client";

export const decimalToString = (value) => {
  if (!value) return "0";
  return value.toString();
};

export const decimalToNumber = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  try {
    return Number(value.toString());
  } catch {
    return null;
  }
};

export const normaliseDecimalInput = (
  raw,
  { fieldName = "Nilai", allowNegative = false, defaultValue } = {}
) => {
  let value = raw;

  if (value === undefined || value === null || value === "") {
    if (defaultValue === undefined) {
      throw new Error(`${fieldName} wajib diisi.`);
    }
    value = defaultValue;
  }

  const parsed =
    typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));

  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} harus berupa angka yang valid.`);
  }

  if (!allowNegative && parsed < 0) {
    throw new Error(`${fieldName} tidak boleh negatif.`);
  }

  return {
    number: parsed,
    decimal: new Prisma.Decimal(parsed),
  };
};

export const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const mapDPPayload = (dp) => {
  if (!dp) return null;

  return {
    dpInvoiceNo: dp.DPInvoiceNo,
    caseId: dp.CaseID,
    dpAmount: decimalToString(dp.DPAmount),
    dpDate: dp.DPDate?.toISOString() ?? null,
    paymentType: dp.PaymentType,
    dpNote: dp.DPNote,
    createdBy: dp.CreatedBy,
  };
};
