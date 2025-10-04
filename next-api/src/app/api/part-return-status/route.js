import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const quantityUsedParam = searchParams.get("quantityUsed");

    const where = {};
    if (quantityUsedParam !== null) {
      const normalized = quantityUsedParam.toLowerCase();
      if (["true", "false"].includes(normalized)) {
        where.StatusQuantityType = normalized === "true";
      }
    }

    const statuses = await prisma.partReturnStatus.findMany({
      where,
      orderBy: { StatusName: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: "List Part Return Status",
      data: statuses,
    });
  } catch (error) {
    console.error("Failed to fetch part return statuses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch part return statuses",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
