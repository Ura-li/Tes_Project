import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

// Helper function to parse boolean values
const parseBool = (value) => value === "true" || value === true;

// GET Part by PartNumber
export async function GET(_, { params }) {
  const {PARTNUMBER} = await params
  const partNumber = decodeURIComponent(PARTNUMBER);

  if (!partNumber) {
    return NextResponse.json(
      { success: false, message: "Invalid Part Number" },
      { status: 400 }
    );
  }

  try {
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
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch part", error: error.message },
      { status: 500 }
    );
  }
}


export async function PATCH(request, { params }) {
  const {PARTNUMBER} = await params
  const partNumber = decodeURIComponent(PARTNUMBER);
  const body = await request.json();

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
  } = body;

  if (!partNumber || !Keyword || !PartDescription) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const existingPart = await prisma.servicecatalog_parts.findUnique({
      where: { PartNumber: partNumber },
    });

    if (!existingPart) {
      return NextResponse.json(
        { success: false, message: "Part not found for update" },
        { status: 404 }
      );
    }

    const updatedPart = await prisma.servicecatalog_parts.update({
      where: { PartNumber: partNumber },
      data: {
        Keyword,
        PartDescription,
        Orderability: parseBool(Orderability),
        RestrictionReason,
        CSR_Flag: parseBool(CSR_Flag),
        ROHS_Flag: parseBool(ROHS_Flag),
        Returnable_Flag: parseBool(Returnable_Flag),
        HardRoll_Flag: parseBool(HardRoll_Flag),
        DangerousGoods_Flag: parseBool(DangerousGoods_Flag),
        LithiumBattery_Flag: parseBool(LithiumBattery_Flag),
        Oversize_Flag: parseBool(Oversize_Flag),
        Heavy_Flag: parseBool(Heavy_Flag),
        Price: isNaN(Number(Price)) ? 0 : Number(Price),
        FreightPrice: isNaN(Number(FreightPrice)) ? 0 : Number(FreightPrice),
        Shipping_Fee: isNaN(Number(Shipping_Fee)) ? 0 : Number(Shipping_Fee),
        Tax: isNaN(Number(Tax)) ? 0 : Number(Tax),
        Total: isNaN(Number(Total)) ? 0 : Number(Total),
      },
    });

    return NextResponse.json(
      { success: true, message: "Part updated successfully!", data: updatedPart },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update part", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE Part by PartNumber
export async function DELETE(_, { params }) {
  const partNumber = decodeURIComponent(params?.PartNumber || "");

  if (!partNumber) {
    return NextResponse.json(
      { success: false, message: "Invalid Part Number" },
      { status: 400 }
    );
  }

  try {
    await prisma.servicecatalog_parts.delete({
      where: { PartNumber: partNumber },
    });

    return NextResponse.json(
      { success: true, message: "Part deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete part", error: error.message },
      { status: 500 }
    );
  }
}
