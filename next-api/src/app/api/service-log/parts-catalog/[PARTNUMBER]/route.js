import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

// Helper function to parse boolean values
const parseBool = (value) => {
    return value === 'true' || value === true;
};

// GET Part by PartNumber
export async function GET(request, { params }) {
    const { PartNumber } = await params;  // Awaiting params before using
    const partNumber = decodeURIComponent(PartNumber);

    if (!partNumber) {
        return NextResponse.json(
            { success: false, message: "Invalid Part Number" },
            { status: 400 }
        );
    }

    const part = await prisma.servicecatalog_parts.findUnique({
        where: { PartNumber: partNumber },
    });

    if (!part) {
        return NextResponse.json(
            { success: true, message: "Part not found", data: null },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { success: true, message: "Part detail fetched", data: part },
        { status: 200 }
    );
}

// UPDATE Part by PartNumber
export async function PATCH(request, { params }) {
    const { PartNumber } = await params;  // Awaiting params before using
    const partNumber = decodeURIComponent(PartNumber);

    const {
        Keyword,
        PartDescription,
        Orderability,
        RestrictionReason,
        CSR_Flag,
        ROHS_Flag,
        Returnable_Flag,
        HardRoll_Flag,
        DangerousGoods_Flag,
        LithiumBattery_Flag,
        Oversize_Flag,
        Heavy_Flag,
        Price,
        FreightPrice,
        Shipping_Fee,
        Tax,
        Total,
    } = await request.json();

    // Check if the part exists
    const existingPart = await prisma.servicecatalog_parts.findUnique({
        
        where: { PartNumber: partNumber },
    });

    if (!existingPart) {
        console.log("Part not found in database:", partNumber); 
        return NextResponse.json(
            {
                success: false,
                message: "Part not found for update",
            },
            { status: 404 }
        );
    }

    try {
        const updatedPart = await prisma.servicecatalog_parts.update({
            where: { PartNumber: partNumber },
            data: {
                Keyword,
                PartDescription,
                Orderability,
                RestrictionReason,
                CSR_Flag: parseBool(CSR_Flag),
                ROHS_Flag: parseBool(ROHS_Flag),
                Returnable_Flag: parseBool(Returnable_Flag),
                HardRoll_Flag: parseBool(HardRoll_Flag),
                DangerousGoods_Flag: parseBool(DangerousGoods_Flag),
                LithiumBattery_Flag: parseBool(LithiumBattery_Flag),
                Oversize_Flag: parseBool(Oversize_Flag),
                Heavy_Flag: parseBool(Heavy_Flag),
                Price: isNaN(Number(Price)) ? null : Number(Price),
                FreightPrice: isNaN(Number(FreightPrice)) ? null : Number(FreightPrice),
                Shipping_Fee: Shipping_Fee ? parseFloat(Shipping_Fee) : 0,
                Tax: isNaN(Number(Tax)) ? null : Number(Tax),
                Total: isNaN(Number(Total)) ? null : Number(Total),
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Part updated successfully!",
                data: updatedPart,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating part:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update part",
                error: error.message,
            },
            { status: 500 }
        );
    }
}


// DELETE Part by PartNumber
export async function DELETE(request, { params }) {
    const partNumber = decodeURIComponent(params.PartNumber);

    try {
        await prisma.servicecatalog_parts.delete({
            where: { PartNumber: partNumber },
        });

        return NextResponse.json(
            { success: true, message: "Part deleted successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting part:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete part",
                error: error.message,
            },
            { status: 500 }
        );
    }
}