import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { mapDPPayload, normaliseDecimalInput, parseDate } from "./helper";
import { generateID } from "@/utils/generateID";

const DP_PREFIX = "DP-";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dpInvoiceNo = searchParams.get("dpInvoiceNo");
    const caseId = searchParams.get("caseId");

    if (!dpInvoiceNo && !caseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Gunakan dpInvoiceNo atau caseId untuk mencari DP.",
        },
        { status: 400 }
      );
    }

    if (dpInvoiceNo) {
      const dp = await prisma.down_payment_table.findUnique({
        where: { DPInvoiceNo: dpInvoiceNo },
      });

      if (!dp) {
        return NextResponse.json(
          { success: false, message: "DP tidak ditemukan." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: mapDPPayload(dp),
      });
    }

    // GET by caseId → fetch most recent DP
    if (caseId) {
      const dps = await prisma.down_payment_table.findMany({
        where: { CaseID: caseId },
        orderBy: { DPDate: "desc" },
      });

      return NextResponse.json({
        success: true,
        data: dps ? dps.map(mapDPPayload) : null,
      });
    }
  } catch (err) {
    console.error("GET DP Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      caseId,
      createdBy,
      dps
    } = body;

    if (!caseId) {
      return NextResponse.json(
        { success: false, message: "CaseID wajib diisi." },
        { status: 400 }
      );
    }

    const createdById = Number(createdBy);
    if (!createdById) {
      return NextResponse.json(
        { success: false, message: "CreatedBy tidak valid." },
        { status: 400 }
      );
    }

    if (!Array.isArray(dps) || dps.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data DP tidak boleh kosong." },
        { status: 400 }
      );
    }

    const caseRecord = await prisma.caseinformation.findUnique({
      where: { CaseID: caseId },
    });

    if (!caseRecord) {
      return NextResponse.json(
        { success: false, message: "Case tidak ditemukan." },
        { status: 404 }
      );
    }

    const createdDps = await prisma.$transaction(async (tx) => {
      const results = [];
      for(const item of dps){
        const {dpAmount, dpDate, paymentType, dpNote} = item
        const dpAmountNorm = normaliseDecimalInput(dpAmount, {
          fieldName: "DP Amount",
        });

        const dpInvoiceNo = await generateID(
          DP_PREFIX,
          "down_payment_table",
          "DPInvoiceNo"
        );

        const dp = await tx.down_payment_table.create({
          data: {
            DPInvoiceNo: dpInvoiceNo,
            CaseID: caseId,
            DPAmount: dpAmountNorm.decimal,
            DPDate: parseDate(dpDate) ?? new Date(),
            PaymentType: paymentType?.trim() || null,
            DPNote: dpNote?.trim() || null,
            CreatedBy: createdById,
          },
        });

        // LOG INTO CASE NOTES
        await tx.casenotes.create({
          data: {
            CaseID: caseId,
            LogType: "System DP",
            ActionType: "Action Plan",
            VisibleExternally: true,
            MinutesSpent: 0,
            Note: `[DP] DP Created\nInvoice No: ${dpInvoiceNo}\nAmount: ${dpAmount}\nPayment Type: ${paymentType}\nNote: ${dpNote}`,
            CreatedBy: createdById,
          },
        });  

        results.push(dp)
      }
      return results
    })

    return NextResponse.json(
      {
        success: true,
        message: "DP berhasil dibuat.",
        data: createdDps.map(mapDPPayload),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST DP Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
