import * as XLSX from "xlsx";
import fs from "fs";
import prisma from "../../../../../prisma/client";
import { NextResponse } from "next/server";

export const config = {
    api: {
        bodyParser: false,
    }
}
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



export async function GET() {
    try{
        const headers = [
            "Sales Order",
            "RMA",
            "CT Code New",
            "AWB"
        ]

        const worksheetData = [headers];

        worksheetData.push([
            "0614890001",
            "0614890001010200",
            "3018436192",
            "251104060",
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "UPDATE SO Template");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="SO_Update_Template.xlsx"`,
                "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    }catch(error){
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

        if (!file) {
            return NextResponse.json({
                success: false,
                message: "No file uploaded.",
            });
        }

        // 🔹 Konversi file ke buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 🔹 Baca file Excel
        const workbook = XLSX.read(buffer, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);


        
        const validData = sheet
            .map((r) => {
                const partNum = r.PartNumber?.toString().trim();
                if (!partNum) return null; // skip kalau gak ada PartNumber
                return {
                    PartNumber: partNum,
                    VendorPartNumber: r.VendorPartNumber ? String(r.VendorPartNumber).trim() : null,
                    ProductType: r.ProductTower ? String(r.ProductTower).trim() : null,
                    Orderability: true,
                    Keyword: r.Category ? String(r.Category).trim() : null,
                    PartDescription: r.PartName ? String(r.PartName).trim() : null,
                    Price: toDecimal(r.HPOriginalPrice),
                    Shipping_Fee: toDecimal(r.Shipping_Fee),
                    PartLaborToPatner: toDecimal(r.PartLaborToPatner),
                    ODMOriginalPrice: toDecimal(r.ODMOriginalPrice),
                    ODMPatnerPrice: toDecimal(r.ODMPatnerPrice),
                    ODMUserPrice: toDecimal(r.ODMUserPrice),
                };
            })
            .filter(Boolean)

            if(validData.length === 0){
                return NextResponse.json({success: false, message:"No valid row found"})
            }


            await prisma.servicecatalog_parts.createMany({ data: validData, skipDuplicates: true })



            return NextResponse.json({
                success:true,
                message: `Successfully imported ${validData.length} products.`,
            })

    } catch (error) {
        console.error("Import Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );

    }
}