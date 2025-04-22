import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function GET(request, {params }) {
    const lineItemID = await params.LineItemID
    if (!lineItemID) {
        return NextResponse.json({
            success: false,
            message: "Invalid Material Order ID"
        }, { status: 400 });
    }
    try{
        const materialLineItems = await prisma.materialorderlineitems.findUnique({
            where: {LineItemID: parseInt(lineItemID) }
        })
        if (!materialLineItems) {
            return NextResponse.json({
                success: false,
                message: "Detail Data Material Order Not Found!",
                data: null
            }, { status: 404 });
        }
    
        return NextResponse.json({
            success: true,
            message: "Detail Data Material Order",
            data: materialLineItems
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