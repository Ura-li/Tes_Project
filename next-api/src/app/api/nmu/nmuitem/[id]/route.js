import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

// GET /api/nmu/nmuitem/[id]
export async function GET(request, { params }) {
  const { id } = params;
  const numericId = parseInt(id, 10); // ✅ convert to Int

  if (isNaN(numericId)) {
    return NextResponse.json(
      { success: false, message: "Invalid NMU Item ID" },
      { status: 400 }
    );
  }

  try {
    const NMUData = await prisma.NMUItem.findUnique({
      where: { id: numericId },
      include: { nmu: true },
    });

    if (!NMUData) {
      return NextResponse.json(
        { success: false, message: "NMU Item not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "NMU Item details retrieved", data: NMUData },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error in GET /nmuitem/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/nmu/nmuitem/[id]
export async function PATCH(request, { params }) {
  const { id } = params;
  const numericId = parseInt(id, 10); // ✅ convert to Int

  if (isNaN(numericId)) {
    return NextResponse.json(
      { success: false, message: "Invalid NMU Item ID" },
      { status: 400 }
    );
  }

  const { itemName, nmuId } = await request.json();

  if (!itemName) {
    return NextResponse.json(
      { success: false, message: "Item name is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.NMUItem.update({
      where: { id: numericId },
      data: {
        itemName,
        nmuId: Number(nmuId), // ✅ ensure this is also numeric
      },
    });

    return NextResponse.json(
      { success: true, message: "NMU Item updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error in PATCH /nmuitem/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update NMU Item", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/nmu/nmuitem/[id]
export async function DELETE(request, { params }) {
  const { id } = params;
  const numericId = parseInt(id, 10); // ✅ convert to Int

  if (isNaN(numericId)) {
    return NextResponse.json(
      { success: false, message: "Invalid NMU Item ID" },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.NMUItem.delete({
      where: { id: numericId },
    });

    return NextResponse.json(
      { success: true, message: "NMU Item deleted successfully", data: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error in DELETE /nmuitem/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete NMU Item. It may not exist.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}
