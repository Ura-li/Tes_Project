import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function GET(request, {params }) {
    const {LineItemID } = await params
    const lineItemID = LineItemID
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

export async function PATCH(request, {params}) {
    const {LineItemID } = await params
    const lineItemID = LineItemID
    if (!lineItemID) {
        return NextResponse.json({
            success: false,
            message: "Invalid Material Order ID"
        }, { status: 400 });
    }
    try {
        const body = await request.json();
        // Cek apakah AssetID ada
        const existingMOLineItems = await prisma.materialorderlineitems.findUnique({
            where: { LineItemID: parseInt(lineItemID) }
        });
        
        
        if (!existingMOLineItems) {
            return NextResponse.json({
                success: false,
                message: "Line Items not found!"
            }, { status: 404 });
        }
        
        const { PartNumber, Description, ATPStatus, Price, Quantity, Status } = body;
        // Update data
        const updatedMOLineItems = await prisma.materialorderlineitems.update({
            where: { LineItemID: parseInt(lineItemID) },
            data: {
                PartNumber,
                Description,
                ATPStatus,
                Price,
                Quantity,
                Status
            }
        });

        return NextResponse.json({
            success: true,
            message: "Data Line Items Information Updated!",
            data: updatedMOLineItems
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to update Line Items",
            error: error.message
        }, { status: 500 });
    }
}