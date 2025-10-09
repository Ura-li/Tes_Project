import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET /api/NMU/[NMUId]
export async function GET(request, { params }) {
  const NMUId = Number(params.NMUId);

  if (!NMUId) {
    return NextResponse.json(
      { success: false, message: "Invalid NMU ID" },
      { status: 400 }
    );
  }

  const NMUData = await prisma.nMU.findUnique({
    where: { NMUId },
  });

  if (!NMUData) {
    return NextResponse.json(
      { success: false, message: "NMU ID not found", data: null },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, message: "NMU ID details retrieved", data: NMUData },
    { status: 200 }
  );
}

// PATCH /api/NMU/[NMUId]
export async function PATCH(request, { params }) {
  const NMUId = Number(params.NMUId);

  const { NMUDesc, ItemNeeded, VersionNeeded } = await request.json();

  if (!NMUDesc) {
    return NextResponse.json(
      { success: false, message: "NMU Description is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.nMU.update({
      where: { NMUId },
      data: { NMUDesc, ItemNeeded, VersionNeeded },
    });

    return NextResponse.json(
      { success: true, message: "NMU updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update NMU", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/NMU/[NMUId]
export async function DELETE(request, { params }) {
  const NMUId = Number(params.NMUId);

  try {
    const deleted = await prisma.nMU.delete({
      where: { NMUId },
    });

    return NextResponse.json(
      { success: true, message: "NMU deleted successfully", data: deleted },
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
