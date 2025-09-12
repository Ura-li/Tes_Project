import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET /api/otccodes/[OTCCode]
export async function GET(request, { params }) {
  const { OTCCode } = await params;

  if (!OTCCode) {
    return NextResponse.json(
      { success: false, message: "Invalid OTC Code" },
      { status: 400 }
    );
  }

  const otcCodeData = await prisma.oTCCodeTable.findUnique({
    where: { OTCCode },
  });

  if (!otcCodeData) {
    return NextResponse.json(
      {
        success: true,
        message: "OTC Code not found",
        data: null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "OTC Code details retrieved",
      data: otcCodeData,
    },
    { status: 200 }
  );
}

// PATCH /api/otccodes/[OTCCode]
export async function PATCH(request, { params }) {
  const { OTCCode } = params;

  const { Description, WarrantyCondition } = await request.json();

  if (!Description) {
    return NextResponse.json(
      { success: false, message: "Description is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.oTCCodeTable.update({
      where: { OTCCode },
      data: { Description, WarrantyCondition,},
    });

    return NextResponse.json(
      {
        success: true,
        message: "OTC Code updated successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update OTC Code",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/otccodes/[OTCCode]
export async function DELETE(request, { params }) {
  const { OTCCode } = params;

  try {
    const deleted = await prisma.oTCCodeTable.delete({
      where: { OTCCode },
    });

    return NextResponse.json(
      {
        success: true,
        message: "OTC Code deleted successfully",
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete OTC Code. It may not exist.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}