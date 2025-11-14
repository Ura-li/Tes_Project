import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { generateID } from "@/utils/generateID";
import { parseDate, toBooleanFlag } from "../quotation-information/helpers";
import {
  decimalToNumber,
  mapInvoicePayload,
  normaliseDecimalInput,
  normaliseReason,
} from "./helpers";

const INVOICE_PREFIX = "INV-";

const collectLineItemIds = (caseRecord) => {
  if (!caseRecord) return [];
  const ids = new Set();
  caseRecord.workorder?.forEach((wo) => {
    wo.materialorder?.forEach((mo) => {
      mo.materialorderlineitems?.forEach((line) => {
        if (line.LineItemID !== null && line.LineItemID !== undefined) {
          ids.add(line.LineItemID);
        }
      });
    });
  });
  return Array.from(ids);
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceNo = searchParams.get("invoiceNo");
    const quotationNo = searchParams.get("quotationNo");
    const caseId = searchParams.get("caseId");

    if (!invoiceNo && !quotationNo && !caseId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Parameter pencarian tidak ditemukan. Gunakan invoiceNo, quotationNo, atau caseId.",
        },
        { status: 400 }
      );
    }

    if (invoiceNo) {
      const invoice = await prisma.invoicetable.findUnique({
        where: { InvoiceNo: invoiceNo },
        include: { quotation: true },
      });

      if (!invoice) {
        return NextResponse.json(
          { success: false, message: "Invoice tidak ditemukan." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: mapInvoicePayload(invoice, invoice.quotation),
      });
    }

    if (quotationNo) {
      const quotation = await prisma.quotationtable.findUnique({
        where: { QuotationNo: quotationNo },
        include: {
          invoicetable: {
            orderBy: { AmountReceiveDate: "desc" },
          },
        },
      });

      if (!quotation) {
        return NextResponse.json(
          { success: false, message: "Quotation tidak ditemukan." },
          { status: 404 }
        );
      }

      const invoiceRecord = quotation.invoicetable?.[0] ?? null;

      return NextResponse.json({
        success: true,
        data: mapInvoicePayload(invoiceRecord, quotation),
      });
    }

    const caseRecord = await prisma.caseinformation.findUnique({
      where: { CaseID: caseId },
      select: {
        CaseID: true,
        workorder: {
          select: {
            materialorder: {
              select: {
                materialorderlineitems: {
                  select: { LineItemID: true },
                },
              },
            },
          },
        },
      },
    });

    if (!caseRecord) {
      return NextResponse.json(
        { success: false, message: "Case tidak ditemukan." },
        { status: 404 }
      );
    }

    const lineItemIds = collectLineItemIds(caseRecord);

    if (lineItemIds.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    const quotation = await prisma.quotationtable.findFirst({
      where: {
        quotation_lineitem: {
          some: { LineItemID: { in: lineItemIds } },
        },
      },
      orderBy: {
        QuotationDate: "desc",
      },
      include: {
        invoicetable: {
          orderBy: { AmountReceiveDate: "desc" },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json({ success: true, data: null });
    }

    const invoiceRecord = quotation.invoicetable?.[0] ?? null;

    return NextResponse.json({
      success: true,
      data: mapInvoicePayload(invoiceRecord, quotation),
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data invoice.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      quotationNo,
      amountReceive,
      amountDiff,
      amountDiffReason,
      paymentType,
      amountReceiveDate,
      amountReceiveNote,
      sendWa,
      sendEmail,
      sendInvoice,
      sendErf,
      createdBy,
    } = body;

    if (!quotationNo) {
      return NextResponse.json(
        { success: false, message: "QuotationNo wajib diisi." },
        { status: 400 }
      );
    }

    const createdById = Number.parseInt(createdBy, 10);
    if (!Number.isInteger(createdById)) {
      return NextResponse.json(
        {
          success: false,
          message: "CreatedBy tidak valid.",
        },
        { status: 400 }
      );
    }

    const quotation = await prisma.quotationtable.findUnique({
      where: { QuotationNo: quotationNo },
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, message: "Quotation tidak ditemukan." },
        { status: 404 }
      );
    }

    const existingInvoice = await prisma.invoicetable.findFirst({
      where: { QuotationNo: quotationNo },
    });

    if (existingInvoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Quotation ini sudah memiliki invoice.",
        },
        { status: 409 }
      );
    }

    const receiveAmount = normaliseDecimalInput(amountReceive, {
      fieldName: "Amount receive",
    });

    let diffAmount;
    if (amountDiff !== undefined && amountDiff !== null && amountDiff !== "") {
      diffAmount = normaliseDecimalInput(amountDiff, {
        fieldName: "Amount difference",
        allowNegative: true,
      });
    } else {
      const grandTotalNumber = decimalToNumber(quotation.GrandTotal) ?? 0;
      diffAmount = normaliseDecimalInput(grandTotalNumber - receiveAmount.number, {
        fieldName: "Amount difference",
        allowNegative: true,
        defaultValue: 0,
      });
    }

    const reason = normaliseReason(amountDiffReason);
    if (diffAmount.number !== 0 && !reason) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Amount difference reason wajib diisi ketika terdapat selisih.",
        },
        { status: 400 }
      );
    }

    const invoiceNo = await generateID(
      INVOICE_PREFIX,
      "invoicetable",
      "InvoiceNo"
    );

    const invoice = await prisma.invoicetable.create({
      data: {
        InvoiceNo: invoiceNo,
        QuotationNo: quotationNo,
        AmountReceive: receiveAmount.decimal,
        AmountDiff: diffAmount.decimal,
        AmountDiffReason: reason,
        PaymentType: paymentType?.trim() || null,
        AmountReceiveDate: parseDate(amountReceiveDate) ?? new Date(),
        AmountReceiveNote: amountReceiveNote?.trim() || null,
        SendWa: Boolean(toBooleanFlag(sendWa)),
        SendEmail: Boolean(toBooleanFlag(sendEmail)),
        SendInvoice: Boolean(toBooleanFlag(sendInvoice)),
        SendERF: Boolean(toBooleanFlag(sendErf)),
        CreatedBy: createdById,
      },
      include: { quotation: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice berhasil dibuat.",
        data: mapInvoicePayload(invoice, invoice.quotation),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat invoice.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
