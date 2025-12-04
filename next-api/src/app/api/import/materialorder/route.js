import * as XLSX from "xlsx";
import fs from "fs";
import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};
function parseExcelDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value; // sudah Date
  if (typeof value === "number") {
    // Excel date serial (days since 1900-01-01)
    const excelEpoch = new Date(1900, 0, 1);
    return new Date(excelEpoch.getTime() + (value - 2) * 86400000);
  }
  // fallback: coba parse string
  const parsed = new Date(value);
  return isNaN(parsed) ? null : parsed;
}
function toDecimal(value) {
  if (value == null || value === "") return 0;
  const num = parseFloat(value.toString().replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
}

const TARGET_UPDATE_MAPPING = {
  InOutCE: (row) => ({
    RMANumber: row["RMA No."] || null,
    RemovedSerialNumber: row["CT Code New"] || null,
    AWB_InCode: row["AWB No."] || null,
  }),

  ReturnDHL: (row) => ({
    RMANumber: row["RMA No."] || null,
    AWB_OutCode: row["AWB Out No."] || null,
    RemovedPartNumber: row["CT Code Bad / Part SN"] || null,
  }),

  FullCharge: (row) => ({
    RMANumber: row["RMA No."] || null,
    AWB_OutCode: row["AWB Out No."] || null,
    RemovedPartNumber: row["CT Code Bad / Part SN"] || null,
  }),

  ReturnLogistic: (row) => ({
    RMANumber: row["RMA No."] || null,
    SalesOrderNumber: row["SO No."] || null,
  }),
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetStatus = searchParams.get("targetStatus");

    // return console.log(targetStatus)
    const HEADER_MAP = {
      InOutCE: ["SO No.", "RMA No.", "CT Code New", "AWB No."],

      ReturnDHL: ["SO No.", "RMA No.", "CT Code Bad / Part SN", "AWB Out No."],

      FullCharge: ["SO No.", "RMA No.", "CT Code Bad / Part SN", "AWB Out No."],

      ReturnLogistic: ["SO No.", "RMA No."],
    };
    const headers = HEADER_MAP[targetStatus] || ["SO No.", "RMA No."];

    const worksheetData = [headers];

    const dummyTargetMap = {
      InOutCE: ["0614890001", "0614890001010200", "3018436192", "251104060"],

      ReturnDHL: ["0614890001", "3018436192", "251104060"],

      FullCharge: ["0614890001", "3018436192", "251104060"],

      ReturnLogistic: ["0614890001"],
    };
    const dummyTarget = dummyTargetMap[targetStatus] || ["0614890001"];
    worksheetData.push(dummyTarget);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    const nameMap = {
      InOutCE: "In & Out CE",
      ReturnDHL: "Return To DHL",
      FullCharge: "Full Charge",
      ReturnLogistic: "Return To Logistic",
    };
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${nameMap[targetStatus] || ""} Template`
    );
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${targetStatus}_SO_Update_Template.xlsx"`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate template" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const targetStatus = formData.get("targetStatus");
    const dateRMA = formData.get("dateRMA");

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file uploaded.",
      });
    }

    if (!targetStatus) {
      return NextResponse.json({
        success: false,
        message: "Missing Target Status",
      });
    }

    if (!TARGET_UPDATE_MAPPING[targetStatus]) {
      return NextResponse.json({
        success: false,
        message: "Invalid Target Status",
      });
    }

    // 🔹 Konversi file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔹 Baca file Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let updatedCount = 0;
    const updateFn = TARGET_UPDATE_MAPPING[targetStatus];

    const successes = [];
    const errors = [];
    for (const row of sheet) {
      const soNumber = row["SO No."]?.toString().trim();
      if (!soNumber) continue;

      try {
        const updatedFields = updateFn(row);
        // Default empty objects
        let updatedFieldMOTarget = {};
        let updatedFieldMOLITarget = {};

        // Base fields common across cases
        const baseMOTarget = {
          RMANumber: String(updatedFields.RMANumber).trim(),
          RMAStatus: targetStatus,
        };

        // Mapping for special cases
        const mappings = {
          InOutCE: () => ({
            MOTarget: {
              ...baseMOTarget,
              AWB_InCode: String(updatedFields.AWB_InCode).trim(),
              CollectionRequestedDate: dateRMA,
              OrderStatus: "Shipped",
            },
            MOLITarget: {
              RemovedSerialNumber: String(updatedFields.RemovedSerialNumber).trim(),
              Status: "Shipped",
            },
          }),
          ReturnDHL: () => ({
            MOTarget: {
              ...baseMOTarget,
              AWB_OutCode: String(updatedFields.AWB_OutCode).trim(),
            },
            MOLITarget: {
              RemovedPartNumber: String(updatedFields.RemovedPartNumber).trim(),
            },
          }),
          FullCharge: () => ({
            MOTarget: {
              ...baseMOTarget,
              AWB_OutCode: String(updatedFields.AWB_OutCode).trim(),
            },
            MOLITarget: {
              RemovedPartNumber: String(updatedFields.RemovedPartNumber).trim(),
            },
          }),
          ReturnLogistic: () => ({
            MOTarget: {
              ...baseMOTarget,
              ReadyForClosureDate: dateRMA,
            },
            MOLITarget: {
              RemovedSerialNumber: String(updatedFields.RemovedSerialNumber).trim(),
            },
          }),
        };

        // Apply mapping if it exists
        if (mappings[targetStatus]) {
          const { MOTarget, MOLITarget } = mappings[targetStatus]();
          updatedFieldMOTarget = MOTarget;
          updatedFieldMOLITarget = MOLITarget;
        }
        // return console.log(updatedFieldMOLITarget, updatedFieldMOTarget);

        const result = await prisma.$transaction(async (tx) => {
          const mo = await tx.materialorder.findFirst({
            where: {
              SalesOrderNumber: soNumber,
            },
          });

          if (!mo) {
            /**
             * CAN I< INSTEAD OF RETURN ERROR, LOG THIS SO THE USER KNOW WHICH ONE IS SO NOT FOUND
             */
            errors.push({ soNumber, message: "SO Not Found" });
            return;
          }

          const moli = await tx.materialorderlineitems.findMany({
            where: {
              MOID: mo.MOID,
              materialorder: {
                RMANumber: updatedFields.RMANumber,
              },
            },
          });

          if (!moli.length === 0) {
            /**SAME LIKE MO */
            errors.push({ soNumber, message: "MO Not Available" });
            return;
          }

          const updateMo = await tx.materialorder.updateMany({
            where: {
              MOID: mo.MOID,
            },
            data: updatedFieldMOTarget,
          });
          /**
           * CHANGED TIS LATER IF THE CONFIRMATION ABOUT 1 SO Many RMA Correct
           */
          for (const item of moli) {
            const updatedMoli = await tx.materialorderlineitems.updateMany({
              where: {
                LineItemID: item.LineItemID,
              },
              data: updatedFieldMOLITarget,
            });
            console.log(`Updated LineItemID ${item.LineItemID}`);
          }

          successes.push({ soNumber, updatedLines: moli.length });
          
        });
      } catch (error) {
        console.log(error);
        errors.push({ soNumber, message: error.message });
      }
    }
    return NextResponse.json({
      success: errors.length === 0,
      message: `Processed ${sheet.length} rows.`,
      updated: successes,
      errors: errors,
    });
  } catch (error) {
    console.error("Import Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
