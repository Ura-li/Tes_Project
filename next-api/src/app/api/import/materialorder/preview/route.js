import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

/**
 * Preview import payload without mutating data.
 * Accepts the same Excel file as the real import and returns:
 * - raw inputs from the sheet (SO, RMA, CT/part, AWB)
 * - matched MO / Case derived from SO or RMA when available
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const targetStatus = formData.get("targetStatus") || undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheet.length) {
      return NextResponse.json(
        { success: false, message: "Uploaded file has no data rows." },
        { status: 400 }
      );
    }

    const normalize = (value) =>
      value === null || value === undefined
        ? null
        : value?.toString().trim() || null;

    const rows = sheet.map((row, idx) => {
      const soNumber = normalize(row["SO No."]);
      const rmaNumber = normalize(row["RMA No."]);
      const awbIn = normalize(row["AWB In No."]);
      const awbOut = normalize(row["AWB Out No."]);
      const removedSerial = normalize(row["CT Code New"]);
      const removedPart = normalize(row["CT Code Bad / Part SN"]);

      return {
        index: idx + 2, // +2 to account for header row
        inputs: {
          soNumber,
          rmaNumber,
          awbIn,
          awbOut,
          removedSerial,
          removedPart,
        },
        targetStatus,
      };
    });

    const soNumbers = Array.from(
      new Set(rows.map((r) => r.inputs.soNumber).filter(Boolean))
    );
    const rmaNumbers = Array.from(
      new Set(rows.map((r) => r.inputs.rmaNumber).filter(Boolean))
    );

    const lookups = await prisma.materialorder.findMany({
      where: {
        OR: [
          ...(soNumbers.length ? [{ SalesOrderNumber: { in: soNumbers } }] : []),
          ...(rmaNumbers.length ? [{ RMANumber: { in: rmaNumbers } }] : []),
        ],
      },
      include: {
        workorder: {
          include: {
            caseinformation: true,
          },
        },
      },
    });

    const bySO = new Map();
    const byRMA = new Map();
    lookups.forEach((mo) => {
      if (mo.SalesOrderNumber) bySO.set(mo.SalesOrderNumber, mo);
      if (mo.RMANumber) byRMA.set(mo.RMANumber, mo);
    });

    const previewRows = rows.map((row) => {
      const matchBySO = row.inputs.soNumber
        ? bySO.get(row.inputs.soNumber)
        : null;
      const matchByRMA = row.inputs.rmaNumber
        ? byRMA.get(row.inputs.rmaNumber)
        : null;
      const match = matchBySO || matchByRMA;

      return {
        index: row.index,
        inputs: row.inputs,
        matchSource: matchBySO ? "SO" : matchByRMA ? "RMA" : null,
        matched: match
          ? {
              MOID: match.MOID,
              WOID: match.WOID,
              CaseID: match.workorder?.CaseID ?? null,
              CaseSubject: match.workorder?.caseinformation?.CaseSubject ?? null,
              OrderStatus: match.OrderStatus,
              RMAStatus: match.RMAStatus,
            }
          : null,
      };
    });

    const missing = previewRows.filter((r) => !r.matched).length;

    return NextResponse.json({
      success: true,
      targetStatus,
      totalRows: previewRows.length,
      matchedRows: previewRows.length - missing,
      missingRows: missing,
      rows: previewRows,
    });
  } catch (error) {
    console.error("Preview Import Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to preview import." },
      { status: 500 }
    );
  }
}
