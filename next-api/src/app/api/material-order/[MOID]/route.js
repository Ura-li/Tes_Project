import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, {params}) {
    const moid = await params.MOID

    if (!moid) {
        return NextResponse.json({
            success: false,
            message: "Invalid Material Order ID"
        }, { status: 400 });
    }
    try{
        const materialorder = await prisma.materialorder.findUnique({
            where: { MOID: moid },
        });
    
        if (!materialorder) {
            return NextResponse.json({
                success: false,
                message: "Detail Data Material Order Not Found!",
                data: null
            }, { status: 404 });
        }
    
        return NextResponse.json({
            success: true,
            message: "Detail Data Material Order",
            data: materialorder
        }, { status: 200 });
    }catch(err){
        console.error("🔥 ERROR in GET API:", err);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: err.message
        }, { status: 500 });
    }
}