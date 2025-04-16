import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request) {
    try{
        //ambil parameter
        const { searchParams } = new URL(request.url);
        const warranty_services = await prisma.warranty_services.findMany({
            orderBy: { Service_offerID : "asc" }
        })

        return NextResponse.json(
            {
                success: true,
                status: 200,
                message: "List Data Service Catalog",
                data: warranty_services
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