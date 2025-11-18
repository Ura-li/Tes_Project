import { Prisma } from "@prisma/client";
import { decimalToString } from "../quotation-information/helpers";

export const AMOUNT_DIFF_REASONS = [
  "Cancellation Fee (part mahal)",
  "Discount",
  "Free absorb by HP",
  "Free cancel (Onsite)",
  "Free EOS/Not support ID",
  "Free harga tidak ekonomis",
  "Free rerepair",
  "Free unit Nexgen",
  "Free void warranty",
  "Partial part",
  "PPh23 / VAT",
  "Service Fee / Labor only",
  "Warranty approved",
];

export const decimalToNumber = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isNaN(value) ? null : value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value.toString === "function") {
    const parsed = Number(value.toString());
    return Number.isNaN(parsed) ? null : parsed;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const normaliseDecimalInput = (
  rawValue,
  { fieldName = "Nilai", allowNegative = false, defaultValue } = {}
) => {
  let value = rawValue;
  const hasValue =
    value !== undefined && value !== null && value !== "" && value !== false;

  if (!hasValue) {
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
    throw new Error(`${fieldName} tidak boleh bernilai negatif.`);
  }

  return {
    number: parsed,
    decimal: new Prisma.Decimal(parsed),
  };
};

export const normaliseReason = (value) => {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed;
};

export const mapInvoicePayload = (invoiceRecord, quotationRecord) => {
  const invoice = invoiceRecord
    ? {
        invoiceNo: invoiceRecord.InvoiceNo,
        quotationNo: invoiceRecord.QuotationNo,
        amountReceive: decimalToString(invoiceRecord.AmountReceive),
        amountDiff: decimalToString(invoiceRecord.AmountDiff),
        amountDiffReason: invoiceRecord.AmountDiffReason,
        paymentType: invoiceRecord.PaymentType,
        amountReceiveDate:
          invoiceRecord.AmountReceiveDate?.toISOString() ?? null,
        amountReceiveNote: invoiceRecord.AmountReceiveNote,
        sendWa: invoiceRecord.SendWa,
        sendEmail: invoiceRecord.SendEmail,
        sendInvoice: invoiceRecord.SendInvoice,
        sendErf: invoiceRecord.SendERF,
        createdBy: invoiceRecord.CreatedBy,
      }
    : null;

  const quotation = quotationRecord
    ? {
        quotationNo: quotationRecord.QuotationNo,
        subtotal: decimalToString(quotationRecord.Subtotal),
        vatAmount: decimalToString(quotationRecord.VATAmount),
        grandTotal: decimalToString(quotationRecord.GrandTotal),
        vatValue: quotationRecord.VatValue ?? null,
        laborFee: quotationRecord.LaborFee ?? null,
        currency: quotationRecord.Currency ?? "IDR",
      }
    : null;

  return { invoice, quotation };
};
