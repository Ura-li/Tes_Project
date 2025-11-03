import { Prisma } from "@prisma/client";

export const decimalToString = (value) => {
  if (value === null || value === undefined) return null;
  try {
    return value.toString();
  } catch (_err) {
    return String(value);
  }
};

export const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toBooleanFlag = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowered = value.toLowerCase();
    if (lowered === "true" || lowered === "yes" || lowered === "1") return true;
    if (lowered === "false" || lowered === "no" || lowered === "0") return false;
  }
  return Boolean(value);
};

export const normalizeLineItemPayload = (raw, requireApproval) => {
  const lineItemIdRaw = raw?.lineItemId ?? raw?.internalId ?? raw?.LineItemID;
  const lineItemId = Number.parseInt(lineItemIdRaw, 10);
  if (!Number.isInteger(lineItemId)) {
    throw new Error("Setiap line item wajib memiliki LineItemID yang valid.");
  }

  const price = raw?.price;
  if (price === undefined || price === null || price === "") {
    throw new Error("Price pada setiap line item wajib diisi.");
  }
  const priceNumber = Number(price);
  if (Number.isNaN(priceNumber)) {
    throw new Error("Price pada line item harus berupa angka.");
  }

  const partApprovedRaw =
    raw?.partApproved ?? raw?.approved ?? raw?.Approved ?? null;
  const partApproved =
    requireApproval && partApprovedRaw === null
      ? null
      : partApprovedRaw === null
        ? null
        : toBooleanFlag(partApprovedRaw);

  if (requireApproval && partApproved === null) {
    throw new Error("Part approved wajib dipilih untuk status Pending Quote.");
  }

  return {
    lineItemId,
    price: new Prisma.Decimal(priceNumber),
    approved: partApproved ?? false,
  };
};

export const calculateTotals = (lineItems, quantityMap, laborFeeValue, vatValue) => {
  const partsTotal = lineItems.reduce((acc, item) => {
    const quantity = quantityMap.get(item.lineItemId) ?? 1;
    const priceNumber = Number(item.price);
    return acc + priceNumber * quantity;
  }, 0);

  const laborFee =
    laborFeeValue === undefined || laborFeeValue === null || laborFeeValue === ""
      ? 0
      : Number(laborFeeValue);

  const subtotal = partsTotal + laborFee;
  const vatRate =
    vatValue === undefined || vatValue === null || vatValue === ""
      ? 0
      : Number(vatValue);
  const vatAmount = vatRate > 0 ? subtotal * (vatRate / 100) : 0;
  const grandTotal = subtotal + vatAmount;

  return {
    subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
    vatAmount: new Prisma.Decimal(vatAmount.toFixed(2)),
    grandTotal: new Prisma.Decimal(grandTotal.toFixed(2)),
    partsTotal,
    laborFee,
  };
};

export const mapQuotationResponse = (quotation) => {
  if (!quotation) return null;
  const { quotation_lineitem: lines = [], ...rest } = quotation;

  return {
    quotation: {
      quotationNo: rest.QuotationNo,
      quotationType: rest.QuotationType,
      currency: rest.Currency,
      laborFee: rest.LaborFee,
      vatValue: rest.VatValue,
      subtotal: decimalToString(rest.Subtotal),
      vatAmount: decimalToString(rest.VATAmount),
      grandTotal: decimalToString(rest.GrandTotal),
      quotationDate: rest.QuotationDate?.toISOString() ?? null,
      quoteApproveDate: rest.QuotationApprovedDate?.toISOString() ?? null,
      quotationNote: rest.QuotationNote,
      sendWa: rest.SendWa,
      sendEmail: rest.SendEmail,
      userAssign: rest.UserAssign,
      quoteDecision: rest.QuoteDecision ?? null,
    },
    lineItems: lines.map((item) => ({
      id: item.id,
      lineItemId: item.LineItemID,
      price: decimalToString(item.Price),
      approved: item.Approved,
      partNumber: item.lineItem?.PartNumber ?? null,
      description: item.lineItem?.Description ?? null,
      quantity: item.lineItem?.Quantity ?? null,
      moid: item.lineItem?.MOID ?? null,
    })),
  };
};
