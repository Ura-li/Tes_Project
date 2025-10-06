import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function GET(request, { params }) {
  const { LineItemID } = params;

  const parsedLineItemID = parseInt(LineItemID, 10);

  if (Number.isNaN(parsedLineItemID)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Line Item ID or Line Number",
      },
      { status: 400 },
    );
  }

  try {
    const materialLineItem = await prisma.materialorderlineitems.findUnique({
      where: { LineItemID: parsedLineItemID },
      include: {
        servicecatalog_parts: true,
        materialorder: {
          include: {
            workorder: true,
          },
        },
        partReturnStatus: true,
        failure: true,
      },
    });

    if (!materialLineItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Detail Data Material Order Not Found!",
          data: null,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Detail Data Material Order",
        data: materialLineItem,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ERROR in GET material-order-line-items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch data",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const { LineItemID } = params;

  const parsedLineItemID = parseInt(LineItemID, 10);

  if (Number.isNaN(parsedLineItemID)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Line Item ID or Line Number",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const existingMOLineItems = await prisma.materialorderlineitems.findFirst({
      where: { LineItemID: parsedLineItemID },
    });

    if (!existingMOLineItems) {
      return NextResponse.json(
        {
          success: false,
          message: "Line Items not found!",
        },
        { status: 404 },
      );
    }

    const {
      PartNumber,
      Description,
      ATPStatus,
      Price,
      Quantity,
      Status,
      PickPackInstructions,
      CollectionInstructions,
      CustomerResponse,
      RejectedReason,
      OtherReason,
      FailureId,
      SerialNumber,
      RemovedPartNumber,
      RemovedSerialNumber,
      RemovedPartDescription,
      QuantityUsed,
      PartReturnStatusId,
      DOAReason,
      PhotoPartUnit,
      GoodReturnReason,
    } = body;

    const parseNullableInt = (value) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const normalizeBoolean = (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value === 1;
      }
      return Boolean(value);
    };

    const failureIdValue = parseNullableInt(FailureId);
    const partReturnStatusIdValue = parseNullableInt(PartReturnStatusId);

    const updateData = {
      PartNumber,
      Description,
      ATPStatus,
      Price,
      Quantity,
      Status,
      PickPackInstructions,
      CollectionInstructions,
      CustomerResponse,
      RejectedReason,
      OtherReason,
      SerialNumber,
      RemovedPartNumber,
      RemovedSerialNumber,
      RemovedPartDescription,
    };

    if (FailureId !== undefined) {
      updateData.FailureId = failureIdValue;
    }

    if (QuantityUsed !== undefined) {
      const quantityUsedBool = normalizeBoolean(QuantityUsed);
      updateData.QuantityUsed = quantityUsedBool;
      if (quantityUsedBool) {
        updateData.GoodReturnReason = null;
      }
    }

    if (PartReturnStatusId !== undefined) {
      updateData.PartReturnStatusId = partReturnStatusIdValue;
    }

    if (DOAReason !== undefined) {
      updateData.DOAReason = DOAReason ? DOAReason : null;
    }

    if (PhotoPartUnit !== undefined) {
      updateData.PhotoPartUnit = PhotoPartUnit || null;
    }

    if (GoodReturnReason !== undefined) {
      updateData.GoodReturnReason = GoodReturnReason ? GoodReturnReason : null;
    }

    const updatedMOLineItems = await prisma.materialorderlineitems.update({
      where: { LineItemID: parsedLineItemID },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Data Line Items Information Updated!",
        data: updatedMOLineItems,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("ERROR updating material-order-line-items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Line Items",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
