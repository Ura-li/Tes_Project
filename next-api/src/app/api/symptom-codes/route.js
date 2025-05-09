import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
    try{
        //ambil parameter
        const { searchParams } = new URL(request.url);
        const symptom_codes = await prisma.symptom_codes.findMany({
            orderBy: { SymptomCodeID : "asc" }
        })

        return NextResponse.json(
            {
                success: true,
                status: 200,
                message: "List Data Symptom Codes",
                data: symptom_codes
            }
        )
    }catch(e){
        console.error("🔥 ERROR in GET API:", e);

        return NextResponse.json(
          {
            success: false,
            message: "Failed to fetch data",
            error: e.message,
          },
          { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const {
            SymptomCode,
            TopCategory,
            SubCategory,
            QualityCodes
        } = await request.json();

        // Validasi minimal
        if (!SymptomCode || !TopCategory || !SubCategory) {
            return NextResponse.json({
                success: false,
                message: "SymptomCode, TopCategory, dan SubCategory wajib diisi."
            }, {
                status: 400
            });
        }

        // Cek apakah sudah ada SymptomCode yang sama
        const existingCode = await prisma.symptom_codes.findFirst({
            where: { SymptomCode: SymptomCode }
        });

        if (existingCode) {
            // Update jika sudah ada
            const updated = await prisma.symptom_codes.update({
                where: { SymptomCodeID: existingCode.SymptomCodeID },
                data: {
                    TopCategory,
                    SubCategory,
                    QualityCodes
                }
            });

            return NextResponse.json({
                success: true,
                message: "Symptom code updated successfully.",
                data: updated
            });
        } else {
            // Buat baru jika belum ada
            const created = await prisma.symptom_codes.create({
                data: {
                    SymptomCode,
                    TopCategory,
                    SubCategory,
                    QualityCodes
                }
            });

            return NextResponse.json({
                success: true,
                message: "Symptom code created successfully.",
                data: created
            }, {
                status: 201
            });
        }
    } catch (err) {
        console.error("🔥 ERROR in Symptom Code POST:", err);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        }, { status: 500 });
    }
}