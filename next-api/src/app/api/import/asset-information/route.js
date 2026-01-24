import * as XLSX from "xlsx";
import fs from "fs";
import prisma from "../../../../../prisma/client";
import {formidable} from "formidable";
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



export async function GET() {
    try{
        const headers = [
            "SerialNumber",
            "ProductNumber",
            "Warranty_Status",
            "EOW_Date",
        ]

        const worksheetData = [headers];

        worksheetData.push([
            "CND4241G4S",
            "A4UA0PA",
            "In Warranty",
            new Date(2026, 7, 24)
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Template");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="Asset_Import_Template.xlsx"`,
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

        const uniqueProductNumbers = [...new Set(sheet.map((r) => r.ProductNumber?.trim()))].filter(Boolean)
        const existingProducts = await prisma.product_information.findMany({
            where: {ProductNumber: {in: uniqueProductNumbers}},
            select: {ProductNumber: true}
        })
        const validProductNumbers = new Set(existingProducts.map((p) => p.ProductNumber))

        // --- Step 3: Mapping Warranty_Status Excel → OTCCode
        const warrantyMapping = {
            "In Warranty": "02N",   // Normal Warranty
            "Out Warranty": "01T",  // Trade (Out Of Warranty)
        };

        
        const validData = sheet
            .map((r) => {
                const excelStatus = r.Warranty_Status?.trim();
                const mappedOTC = warrantyMapping[excelStatus] || null;
                return {
                    SerialNumber: r.SerialNumber?.toString().trim(),
                    ProductNumber: r.ProductNumber?.trim(),
                    // SiteAccountID: r.SiteAccountID || null,
                    // ContactID: r.ContactID || null,
                    Warranty_Status: mappedOTC, // langsung hasil mapping
                    // EOW_Date: parseExcelDate(r.EOW_Date),
                };
            })
            .filter((r) => r.SerialNumber && validProductNumbers.has(r.ProductNumber));

            if(validData.length === 0){
                return NextResponse.json({success: false, message:"No valid row found"})
            }


            // await prisma.$transaction(
            //     validData.map((asset) =>
            //         prisma.asset_information.upsert({
            //         where: { SerialNumber: asset.SerialNumber },
            //         update: {
            //             ProductNumber: asset.ProductNumber,
            //             // SiteAccountID: asset.SiteAccountID,
            //             // ContactID: asset.ContactID,
            //             Warranty_Status: asset.Warranty_Status,
            //             // EOW_Date: asset.EOW_Date,
            //         },
            //         create: asset,
            //         })
            //     )
            // );

            await prisma.asset_information.createMany({ data: validData, skipDuplicates: true })


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