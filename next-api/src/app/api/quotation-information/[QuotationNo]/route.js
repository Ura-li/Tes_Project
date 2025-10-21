import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import {
  calculateTotals,
  mapQuotationResponse,
  normalizeLineItemPayload,
  parseDate,
} from "../helpers";

export async function GET(_request, { params }) {
  const { QuotationNo } = params;

  try {
    const quotation = await prisma.quotationtable.findUnique({
      where: { QuotationNo },
      include: {
        quotation_lineitem: {
          include: { lineItem: true },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: mapQuotationResponse(quotation),
    });
  } catch (error) {
    console.error("Error fetching quotation detail:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data quotation.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const { QuotationNo } = params;

  try {
    const body = await request.json();
    const {
      status,
      quotationType,
      vatValue,
      quotationNote,
      laborFee,
      quotationDate,
      quoteApproveDate,
      quoteDecision,
      sendWa,
      sendEmail,
      userAssign,
      currency,
      lineItems = [],
    } = body;

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Line item wajib disertakan.",
        },
        { status: 400 },
      );
    }

    const requireApproval = status === "Pending_Quote";
    let normalizedLineItems;
    try {
      normalizedLineItems = lineItems.map((item) =>
        normalizeLineItemPayload(item, requireApproval),
      );
    } catch (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError.message,
        },
        { status: 400 },
      );
    }

    const lineItemIds = normalizedLineItems.map((item) => item.lineItemId);
    const uniqueLineItemIds = [...new Set(lineItemIds)];

    if (uniqueLineItemIds.length !== lineItemIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Terdapat line item duplikat pada permintaan.",
        },
        { status: 400 },
      );
    }

    const relatedLineItems = await prisma.materialorderlineitems.findMany({
      where: { LineItemID: { in: uniqueLineItemIds } },
      select: { LineItemID: true, Quantity: true },
    });

    if (relatedLineItems.length !== uniqueLineItemIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Beberapa line item tidak ditemukan di material order.",
        },
        { status: 404 },
      );
    }

    const quantityMap = new Map(
      relatedLineItems.map((item) => [item.LineItemID, item.Quantity ?? 1]),
    );

    const totals = calculateTotals(
      normalizedLineItems,
      quantityMap,
      laborFee,
      vatValue,
    );

    const normalizeDecisionValue = (value) => {
      if (value === null || value === undefined || value === "") return null;
      const lowered = String(value).toLowerCase();
      if (lowered === "approved" || lowered === "approve") return "Approved";
      if (lowered === "rejected" || lowered === "reject") return "Rejected";
      throw new Error("Nilai quoteDecision tidak valid. Gunakan approve atau reject.");
    };

    const hasDecisionInput = quoteDecision !== undefined;
    let decisionValue = null;
    if (hasDecisionInput) {
      try {
        decisionValue = normalizeDecisionValue(quoteDecision);
      } catch (validationError) {
        return NextResponse.json(
          {
            success: false,
            message: validationError.message,
          },
          { status: 400 },
        );
      }
    }

    if (requireApproval && !decisionValue) {
      return NextResponse.json(
        {
          success: false,
          message: "Quote decision wajib dipilih ketika status Pending Quote.",
        },
        { status: 400 },
      );
    }

    const quotation = await prisma.$transaction(async (tx) => {
      const existingLineItems = await tx.quotation_lineitem.findMany({
        where: { QuotationNo },
        select: { id: true, LineItemID: true },
      });

      const updated = await tx.quotationtable.update({
        where: { QuotationNo },
        data: {
          ...(quotationType && { QuotationType: quotationType }),
          ...(currency && { Currency: currency }),
          LaborFee: Number.parseInt(laborFee ?? 0, 10) || 0,
          VatValue: vatValue !== undefined && vatValue !== null && vatValue !== ""
            ? Number.parseInt(vatValue, 10)
            : null,
          Subtotal: totals.subtotal,
          VATAmount: totals.vatAmount,
          GrandTotal: totals.grandTotal,
          QuotationDate: parseDate(quotationDate) ?? new Date(),
          QuotationApprovedDate: parseDate(quoteApproveDate),
          ...(userAssign !== undefined && {
            UserAssign: Number.parseInt(userAssign, 10),
          }),
          QuotationNote: quotationNote ?? null,
          ...(sendWa !== undefined && { SendWa: Boolean(sendWa) }),
          ...(sendEmail !== undefined && { SendEmail: Boolean(sendEmail) }),
          ...(hasDecisionInput && { QuoteDecision: decisionValue }),
        },
      });

      const incomingIds = new Set(uniqueLineItemIds);

      await Promise.all(
        normalizedLineItems.map((item) =>
          tx.quotation_lineitem.upsert({
            where: {
              QuotationNo_LineItemID: {
                QuotationNo,
                LineItemID: item.lineItemId,
              },
            },
            update: {
              Price: item.price,
              Approved: item.approved,
            },
            create: {
              QuotationNo,
              LineItemID: item.lineItemId,
              Price: item.price,
              Approved: item.approved,
            },
          }),
        ),
      );

      const obsoleteIds = existingLineItems
        .filter((item) => !incomingIds.has(item.LineItemID))
        .map((item) => item.id);

      if (obsoleteIds.length > 0) {
        await tx.quotation_lineitem.deleteMany({
          where: { id: { in: obsoleteIds } },
        });
      }

      await Promise.all(
        normalizedLineItems.map((item) =>
          tx.materialorderlineitems.update({
            where: { LineItemID: item.lineItemId },
            data: { Price: item.price },
          }),
        ),
      );

      return tx.quotationtable.findUnique({
        where: { QuotationNo: updated.QuotationNo },
        include: {
          quotation_lineitem: {
            include: { lineItem: true },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Quotation berhasil diperbarui.",
      data: mapQuotationResponse(quotation),
    });
  } catch (error) {
    console.error("Error updating quotation:", error);
    const status = error.message?.includes("LineItemID")
      ? 400
      : 500;
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui quotation.",
        error: error.message,
      },
      { status },
    );
  }
}
