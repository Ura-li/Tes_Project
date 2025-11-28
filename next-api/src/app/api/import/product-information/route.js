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

export async function GET() {
    try{
        const productTypes = await prisma.product_type.findMany({
            select:{
                ProductType: true,
                ProductTower: true,
                ProductGroup: true,
            }
        })

        const headers = [
            "ProductNumber",
            "ProductLine",
            "ProductName",
            "ProductType",
            "ProductTower",
            "ProductGroup",
            "HWPC",
        ]

        const worksheetData = [headers];

        worksheetData.push([
            "0001IO",
            "AK7",
            "HP EliteBook 840",
            "Laptop",
            "IPG",
            "Consumer",
            "0823907",
        ]);

        worksheetData.push([]);
        worksheetData.push(["Available Product Types ↓"]);
        worksheetData.push(["ProductType", "ProductTower", "ProductGroup"]);

        for (const pt of productTypes) {
            worksheetData.push([pt.ProductType, pt.ProductTower, pt.ProductGroup]);
        }
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Product Template");
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Disposition": `attachment; filename="Product_Import_Template.xlsx"`,
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
            .map((row) => ({
                ProductNumber: row.ProductNumber?.toString().trim(),
                ProductName: row.ProductName?.trim(),
                ProductLine: row.ProductLine?.trim() || null,
                ProductType: row.ProductType?.trim(),
                ProductTower: row.ProductTower?.trim(),
                ProductGroup: row.ProductGroup?.trim(),
                HWPC: row.HWPC?.trim() || null
            }))
            .filter((row) => row.ProductNumber && row.ProductNumber && row.ProductLine);

            if(validData.length === 0){
                return NextResponse.json({success: false, message:"No valid row found"})
            }

            const uniqueTypes = [
                ...new Map(
                    validData.map((r) => [
                    `${r.ProductType}|${r.ProductTower}|${r.ProductGroup}`,
                    {
                        ProductType: r.ProductType,
                        ProductTower: r.ProductTower,
                        ProductGroup: r.ProductGroup,
                    },
                    ])
                ).values(),
            ];
            const productTypes = await prisma.product_type.findMany({
                where: {
                    OR: uniqueTypes.map((t) => ({
                    ProductType: t.ProductType,
                    ProductTower: t.ProductTower,
                    ProductGroup: t.ProductGroup,
                    })),
                },
            });

            // Map type key → ProductTypeID
            const typeMap = new Map(
                productTypes.map((t) => [
                    `${t.ProductType}|${t.ProductTower}|${t.ProductGroup}`,
                    t.ProductTypeID,
                ])
            );

            const productsToInsert = validData
                .map((r) => {
                    const key = `${r.ProductType}|${r.ProductTower}|${r.ProductGroup}`;
                    const ProductTypeID = typeMap.get(key);
                    if (!ProductTypeID) return null; // skip unknown type
                    return {
                    ProductNumber: r.ProductNumber,
                    ProductName: r.ProductName,
                    ProductLine: r.ProductLine,
                    HWPC: r.HWPC,
                    ProductTypeID,
                    };
                })
                .filter(Boolean);

            if (productsToInsert.length === 0) {
                return NextResponse.json({
                    success: false,
                    message: "No valid ProductType matches found.",
                });
            }

            await prisma.product_information.createMany({
                data: productsToInsert,
                skipDuplicates: true,
            })

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