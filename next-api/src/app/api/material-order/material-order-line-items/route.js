import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request) {
    try{
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const moidParam = searchParams.get("MOID") || ""; // "wo1,wo2"
         const materialLineItems = await prisma.materialorderlineitems.findMany({
            where: {
              MOID: { contains: moidParam }
            },
          });

        return NextResponse.json({
            success: true,
            message: "List Data Material Order",
            data: materialLineItems
        });
    }catch(err){
        console.error("🔥 ERROR in GET API:", err);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: err.message
        }, { status: 500 });
    }
}