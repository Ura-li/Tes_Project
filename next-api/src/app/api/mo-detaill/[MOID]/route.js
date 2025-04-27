import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function GET(request, context) {
    const MOID = context.params.MOID;
    
    if (!MOID || typeof MOID !== 'string') {
        return NextResponse.json({
          success: false,
          message: "Invalid MO ID"
        }, { status: 400 });
      }

    const materialorder = await prisma.materialorder.findUnique({
        where: { MOID: MOID },
        include:
        {
            workorder: true
        }
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
}


// update data
/**
 * TODO 
 * MAKE UPDATE ASSET AND CREATE PRODUCT SEPARATELY
 */
export async function PATCH(request, { params }) {
    const MOID = params.MOID;

    try {
        const body = await request.json();
        const {
            WOID,
            OrderNumber,
            OrderStatus,
            OrderType,
            CreatedOn,
            SalesOrderNumber,
            RMANumber,
            ReadyForClosureDate,
            Owner
        } = body;

        // Validasi input tidak boleh kosong
        if (
            !WOID || !OrderNumber || !OrderStatus || !OrderType ||
            !CreatedOn || !SalesOrderNumber || !RMANumber || !ReadyForClosureDate || !Owner
        ) {
            return NextResponse.json({
                success: false,
                message: "All fields are required!"
            }, { status: 400 });
        }

        // Cek apakah Material Order ada
        const existingMaterialOrder = await prisma.materialorder.findUnique({
            where: { MOID: MOID }
        });

        if (!existingMaterialOrder) {
            return NextResponse.json({
                success: false,
                message: "Material Order not found!"
            }, { status: 404 });
        }

        // Update data
        const updatedMaterialOrder = await prisma.materialorder.update({
            where: { MOID: MOID },
            data: {
                WOID,
                OrderNumber,
                OrderStatus,
                OrderType,
                CreatedOn: new Date(CreatedOn),
                SalesOrderNumber,
                RMANumber,
                ReadyForClosureDate: new Date(ReadyForClosureDate),
                Owner
            }
        });

        return NextResponse.json({
            success: true,
            message: "Data Material Order Information Updated!",
            data: updatedMaterialOrder
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to update Material Order",
            error: error.message
        }, { status: 500 });
    }
}



//delete data
export async function DELETE(request, { params }) {
    const MOID = params.MOID ;

    try {
        const deletedMaterial = await prisma.materialorder.delete({
            where: {
                MOID: MOID,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Data Material Order Information deleted",
            data: deletedMaterial
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Material Order not found or already deleted",
            error: error.message
        }, { status: 404 });
    }
}
