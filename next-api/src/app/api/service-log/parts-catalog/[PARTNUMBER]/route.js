import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, {params}) {
    const { PARTNUMBER } = params
    const PartNumber = PARTNUMBER

    if (!PartNumber) {
        return NextResponse.json({
            success: false,
            message: "Invalid Part Number ID"
        }, { status: 400 });
    }
    try{
        const Part = await prisma.servicecatalog_parts.findUnique({
            where: { PARTNUMBER: PartNumber },
        });
    
        if (!Part) {
            return NextResponse.json({
                success: false,
                message: "Detail Data Part Not Found!",
                data: null
            }, { status: 404 });
        }
    
        return NextResponse.json({
            success: true,
            message: "Detail Data Part",
            data: Part
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

export async function PATCH(request, { params }) {
    const { PARTNUMBER } = params
    const PartNumber = PARTNUMBER

    try {
        const body = await request.json();
        const {
            PartNumber,
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
            Total,
            Shipping_Fee,
        } = body;

        if (
            !PartNumber || !Keyword || !PartDescription
        ) {
            return NextResponse.json({
                success: false,
                message: "All fields are required!"
            }, { status: 400 });
        }

        const existingPart = await prisma.servicecatalog_parts.findUnique({
            where: { PARTNUMBER:PARTNUMBER }
        });

        if (!existingPart) {
            return NextResponse.json({
                success: false,
                message: "Part not found!"
            }, { status: 404 });
        }

        // Update data
        const updatedPartInformation = await prisma.servicecatalog_parts.update({
          where: { PARTNUMBER },
          data: {
            PartNumber,
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
            Total,
            Shipping_Fee,
          }
        });
    
        return NextResponse.json({
          success: true,
          message: "Data Part Information Updated!",
          data: updatedPartInformation
        }, { status: 200 });
    
      } catch (error) {
        console.error(error);
        return NextResponse.json({
          success: false,
          message: "Failed to update Part",
          error: error.message
        }, { status: 500 });
      }
    }