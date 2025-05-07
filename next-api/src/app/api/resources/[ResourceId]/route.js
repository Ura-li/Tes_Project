import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// ========== GET: Ambil resource berdasarkan ID ==========
export async function GET(request, { params }) {
  const { ResourceId } = params;

  if (!ResourceId) {
    return NextResponse.json({
      success: false,
      message: "ResourceId is required",
    }, { status: 400 });
  }

  try {
    const resource = await prisma.resource.findUnique({
      where: { ResourceId },
    });

    if (!resource) {
      return NextResponse.json({
        success: false,
        message: "Resource not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch resource",
      error: error.message,
    }, { status: 500 });
  }
}

// ========== PATCH: Edit resource ==========
export async function PATCH(request, { params }) {
  const { ResourceId } = params;
  const { Name } = await request.json();

  if (!ResourceId || !Name) {
    return NextResponse.json({
      success: false,
      message: "ResourceId and Name are required",
    }, { status: 400 });
  }

  try {
    const updatedResource = await prisma.resource.update({
      where: { ResourceId },
      data: { Name },
    });

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully",
      data: updatedResource,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update resource",
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { ResourceId } = params;

  try {
    const deletedResource = await prisma.resource.delete({
      where: { ResourceId },
    });

    return NextResponse.json({
      success: true,
      message: "Resource deleted successfully",
      data: deletedResource,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Resource not found or already deleted",
      error: error.message,
    }, { status: 404 });
  }
}
