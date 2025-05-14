import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET detail repairClassCode by Code
export async function GET(request, { params }) {
  const { Code } = params;

  if (!Code || typeof Code !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid Code" },
      { status: 400 }
    );
  }

  const repairClassCode = await prisma.repairClassCode.findUnique({
    where: {
      Code,
    },
  });

  if (!repairClassCode) {
    return NextResponse.json(
      {
        success: false,
        message: "Repair Class Code Not Found",
        data: null,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Detail Repair Class Code",
      data: repairClassCode,
    },
    {
      status: 200,
    }
  );
}

// PATCH update repairClassCode by Code
export async function PATCH(request, { params }) {
  const { Code } = params;

  const { Description, Definition, PaymentEligibility } = await request.json();

  try {
    const updated = await prisma.repairClassCode.update({
      where: {
        Code,
      },
      data: {
        Description,
        Definition,
        PaymentEligibility,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Repair Class Code Updated!",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Repair Class Code",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE repairClassCode by Code
export async function DELETE(request, { params }) {
  const { Code } = params;

  try {
    const deleted = await prisma.repairClassCode.delete({
      where: {
        Code,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Repair Class Code deleted successfully",
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete Repair Class Code. It may not exist.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}