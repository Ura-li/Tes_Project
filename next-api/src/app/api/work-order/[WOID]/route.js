import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, {params}) {
    const woid = await params.WOID

    if (!woid) {
        return NextResponse.json({
            success: false,
            message: "Invalid Work Order ID"
        }, { status: 400 });
    }
    try{
        const workorder = await prisma.workorder.findUnique({
            where: { WOID: woid },
        });
    
        if (!workorder) {
            return NextResponse.json({
                success: false,
                message: "Detail Data Work Order Not Found!",
                data: null
            }, { status: 404 });
        }
    
        return NextResponse.json({
            success: true,
            message: "Detail Data Work Order",
            data: workorder
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