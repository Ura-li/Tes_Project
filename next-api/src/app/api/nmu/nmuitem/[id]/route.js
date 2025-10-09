import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET /api/NMU/[id]
export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Invalid NMU ID" },
      { status: 400 }
    );
  }

  const NMUData = await prisma.NMUItem.findUnique({
    where: { id },
  });

  if (!NMUData) {
    return NextResponse.json(
      {
        success: true,
        message: "NMU ID not found",
        data: null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "NMU ID details retrieved",
      data: NMUData,
    },
    { status: 200 }
  );
}

// PATCH /api/NMU/[id]
export async function PATCH(request, { params }) {
  const { id } = params;

  const { itemName, nmuId } = await request.json();

  if (!itemName) {
    return NextResponse.json(
      { success: false, message: "NMU Description is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.NMUItem.update({
      where: { id },
      data: { itemName, nmuId,},
    });

    return NextResponse.json(
      {
        success: true,
        message: "NMU updated successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update NMU",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/NMU/[id]
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const deleted = await prisma.NMUItem.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "NMU deleted successfully",
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete NMU. It may not exist.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}