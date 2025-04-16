/**
 * TODO LIST
 * Change the Part Catalog to Main Feature for MO
 * Now is being used for catalog Only.
 */
import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request) {
    try{
        //ambil parameter
        const { searchParams } = new URL(request.url);
        const servicecatalog_parts = await prisma.servicecatalog_parts.findMany({
            orderBy: { PartNumber : "asc" }
        })

        return NextResponse.json(
            {
                success: true,
                status: 200,
                message: "List Data Parts Catalog",
                data: servicecatalog_parts
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