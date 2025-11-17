import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { parseDate, toBooleanFlag } from "../../quotation-information/helpers";
import {
  decimalToNumber,
  mapInvoicePayload,
  normaliseDecimalInput,
  normaliseReason,
} from "../helpers";

export async function PATCH(request, { params }) {
  return NextResponse.json(
    { success: false, message: "Belum ada patch. heheh" },
    { status: 402 }
  );
  // return console.log("PATCH",request)
  try {
    const invoiceNo = params?.InvoiceNo;
    if (!invoiceNo) {
      return NextResponse.json(
        { success: false, message: "InvoiceNo tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.invoicetable.findUnique({
      where: { InvoiceNo: invoiceNo },
      include: { quotation: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Invoice tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = {};

    if (body.amountReceive !== undefined) {
      const receiveAmount = normaliseDecimalInput(body.amountReceive, {
        fieldName: "Amount receive",
      });
      data.AmountReceive = receiveAmount.decimal;

      if (body.amountDiff === undefined) {
        const grandTotalNumber =
          decimalToNumber(existing.quotation?.GrandTotal) ?? 0;
        const autoDiff = normaliseDecimalInput(
          grandTotalNumber - receiveAmount.number,
          {
            fieldName: "Amount difference",
            allowNegative: true,
          }
        );
        data.AmountDiff = autoDiff.decimal;
      }
    }

    if (body.amountDiff !== undefined) {
      const diffAmount = normaliseDecimalInput(body.amountDiff, {
        fieldName: "Amount difference",
        allowNegative: true,
      });
      data.AmountDiff = diffAmount.decimal;
    }

    if (body.amountReceiveDate !== undefined) {
      data.AmountReceiveDate = parseDate(body.amountReceiveDate) ?? new Date();
    }

    if (body.paymentType !== undefined) {
      data.PaymentType = body.paymentType?.trim() || null;
    }

    if (body.amountReceiveNote !== undefined) {
      data.AmountReceiveNote = body.amountReceiveNote?.trim() || null;
    }

    const booleanFields = [
      ["SendWa", "sendWa"],
      ["SendEmail", "sendEmail"],
      ["SendInvoice", "sendInvoice"],
      ["SendERF", "sendErf"],
    ];

    booleanFields.forEach(([field, key]) => {
      if (key in body) {
        data[field] = Boolean(toBooleanFlag(body[key]));
      }
    });

    let reasonCandidate =
      body.amountDiffReason !== undefined
        ? normaliseReason(body.amountDiffReason)
        : existing.AmountDiffReason;

    const nextDiffDecimal =
      data.AmountDiff !== undefined ? data.AmountDiff : existing.AmountDiff;
    const nextDiffNumber = decimalToNumber(nextDiffDecimal) ?? 0;

    if (nextDiffNumber !== 0 && !reasonCandidate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Amount difference reason wajib diisi ketika terdapat selisih.",
        },
        { status: 400 }
      );
    }

    if (nextDiffNumber === 0) {
      data.AmountDiffReason = null;
    } else if (body.amountDiffReason !== undefined) {
      data.AmountDiffReason = reasonCandidate;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada perubahan yang dikirim.",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.invoicetable.update({
      where: { InvoiceNo: invoiceNo },
      data,
      include: { quotation: true },
    });

    return NextResponse.json({
      success: true,
      message: "Invoice berhasil diperbarui.",
      data: mapInvoicePayload(updated, updated.quotation),
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui invoice.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
