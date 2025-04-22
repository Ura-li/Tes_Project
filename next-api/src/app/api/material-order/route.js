import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
    try{
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const woidParam = searchParams.get("WOID"); // "wo1,wo2"
        
        const woidArray = woidParam?.split(",") || [];
        
        // const page = parseInt(searchParams.get("page")) || 1;
        // const limit = parseInt(searchParams.get("limit")) || 10;

        // console.log("Query Params:", { search, page, limit });
         // Initialize search filters
         const materialOrders = await prisma.materialorder.findMany({
            where: {
              WOID: { in: woidArray }
            },
          });

        return NextResponse.json({
            success: true,
            message: "List Data Material Order",
            data: materialOrders
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