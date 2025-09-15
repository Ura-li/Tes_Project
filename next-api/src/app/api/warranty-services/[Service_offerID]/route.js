import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET 
export async function GET(request, { params }) {
    const Service_offerID = String(params.Service_offerID);
  
    const warranty_service = await prisma.warranty_services.findUnique({
      where: { Service_offerID },
    });
  
    if (!warranty_service) {
      return NextResponse.json({
        success: false,
        message: "Detail Data Warranty Service Not Found!",
        data: null
      }, { status: 404 });
    }
  
    return NextResponse.json({
      success: true,
      message: "Detail Data Warranty Service",
      data: warranty_service
    }, { status: 200 });
  }

// UPDATE
// UPDATE
export async function PATCH(request, { params }) {
  const Service_offerID = String(params.Service_offerID);

  try {
    const body = await request.json();
    const {
      Service_description,
      CTat_RTime,
      Price,
      Shipping_Fee,
      qty_ws,
      Tax,
      Total,
      WarrantyCondition,
      CaseTypeServices,
    } = body;

    if (!Service_description || !CTat_RTime) {
      return NextResponse.json(
        { success: false, message: "Service description & TAT are required!" },
        { status: 400 }
      );
    }

    const updatedWarrantyServiceInformation =
      await prisma.warranty_services.update({
        where: { Service_offerID },
        data: {
          Service_description,
          CTat_RTime,
          Price: Price ?? 0,
          Shipping_Fee: Shipping_Fee ?? 0,
          qty_ws: qty_ws ?? 0,
          Tax: Tax ?? 0,
          Total: Total ?? 0,
          WarrantyCondition: WarrantyCondition || null,
          CaseTypeServices: CaseTypeServices || null,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Warranty Service updated successfully!",
        data: updatedWarrantyServiceInformation,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Warranty Service",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
  

// DELETE 
export async function DELETE(request, { params }) {
  const Service_offerID = (params.Service_offerID);

  try {
    const deletedWarrantyService = await prisma.warranty_services.delete({
      where: { Service_offerID },
    });

    return NextResponse.json({
      success: true,
      message: "Warranty Service deleted successfully",
      data: deletedWarrantyService
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Warranty Service not found or already deleted",
      error: error.message
    }, { status: 404 });
  }
}
