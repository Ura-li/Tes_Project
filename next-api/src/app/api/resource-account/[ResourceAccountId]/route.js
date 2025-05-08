import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
// GET: Fetch single ResourceAccount by ID
export async function GET(request, { params }) {
  const { ResourceAccountId } = params;

  try {
    const resourceAccount = await prisma.resourceAccount.findUnique({
      where: { ResourceAccountId },
    });

    if (!resourceAccount) {
      return NextResponse.json({
        success: false,
        message: "ResourceAccount not found",
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "ResourceAccount details retrieved successfully",
      data: resourceAccount,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch ResourceAccount",
      error: error.message,
    }, { status: 500 });
  }
}

// PATCH: Update ResourceAccount
export async function PATCH(request, { params }) {
  const { ResourceAccountId } = params;

  try {
    const body = await request.json();
    const { Name, ResourceId } = body;

    if (!Name) {
      return NextResponse.json({
        success: false,
        message: "Name is required",
      }, { status: 400 });
    }

    const updatedResourceAccount = await prisma.resourceAccount.update({
      where: { ResourceAccountId },
      data: {
        Name,
        ResourceId: ResourceId || null, // optional
      },
    });

    return NextResponse.json({
      success: true,
      message: "ResourceAccount updated successfully",
      data: updatedResourceAccount,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update ResourceAccount",
      error: error.message,
    }, { status: 500 });
  }
}

// DELETE: Delete ResourceAccount
export async function DELETE(request, { params }) {
  const { ResourceAccountId } = params;

  try {
    const deletedResourceAccount = await prisma.resourceAccount.delete({
      where: { ResourceAccountId },
    });

    return NextResponse.json({
      success: true,
      message: "ResourceAccount deleted successfully",
      data: deletedResourceAccount,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to delete ResourceAccount. It may not exist.",
      error: error.message,
    }, { status: 404 });
  }
}
