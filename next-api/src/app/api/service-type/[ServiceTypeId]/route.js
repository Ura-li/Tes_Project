import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET /api/ServiceType/[ServiceTypeId]
export async function GET(request, { params }) {
  const ServiceTypeId = Number(params.ServiceTypeId);

  if (!ServiceTypeId) {
    return NextResponse.json(
      { success: false, message: "Invalid ServiceType ID" },
      { status: 400 }
    );
  }

  const ServiceTypeData = await prisma.ServiceType.findUnique({
    where: { ServiceTypeId },
  });

  if (!ServiceTypeData) {
    return NextResponse.json(
      { success: false, message: "ServiceType ID not found", data: null },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, message: "ServiceType ID details retrieved", data: ServiceTypeData },
    { status: 200 }
  );
}

// PATCH /api/ServiceType/[ServiceTypeId]
export async function PATCH(request, { params }) {
  const ServiceTypeId = Number(params.ServiceTypeId);

  const { ServiceTypeName, ProblemCategory } = await request.json();

  if (!ServiceTypeName) {
    return NextResponse.json(
      { success: false, message: "ServiceType Description is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.ServiceType.update({
      where: { ServiceTypeId },
      data: { ServiceTypeName, ProblemCategory },
    });

    return NextResponse.json(
      { success: true, message: "ServiceType updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update ServiceType", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/ServiceType/[ServiceTypeId]
export async function DELETE(request, { params }) {
  const ServiceTypeId = Number(params.ServiceTypeId);

  try {
    const deleted = await prisma.ServiceType.delete({
      where: { ServiceTypeId },
    });

    return NextResponse.json(
      { success: true, message: "ServiceType deleted successfully", data: deleted },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete ServiceType. It may not exist.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}
