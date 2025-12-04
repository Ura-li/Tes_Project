import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import {
  mapDPPayload,
  normaliseDecimalInput,
  parseDate,
} from "../helper";

export async function PATCH(request, { params }) {
  try {
    const dpInvoiceNo = params.dpInvoiceNo;

    const existing = await prisma.down_payment_table.findUnique({
      where: { DPInvoiceNo: dpInvoiceNo },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "DP tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = {};

    if (body.dpAmount !== undefined) {
      const dpAmount = normaliseDecimalInput(body.dpAmount, {
        fieldName: "DP Amount",
      });
      data.DPAmount = dpAmount.decimal;
    }

    if (body.dpDate !== undefined) {
      data.DPDate = parseDate(body.dpDate) ?? new Date();
    }

    if (body.paymentType !== undefined) {
      data.PaymentType = body.paymentType?.trim() || null;
    }

    if (body.dpNote !== undefined) {
      data.DPNote = body.dpNote?.trim() || null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "Tidak ada perubahan." },
        { status: 400 }
      );
    }

    data.ChangedOn = new Date();

    const dp = await prisma.down_payment_table.update({
      where: { DPInvoiceNo: dpInvoiceNo },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "DP berhasil diperbarui.",
      data: mapDPPayload(dp),
    });
  } catch (err) {
    console.error("PATCH DP Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
