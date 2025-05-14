import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET: Get detail by ServiceCatalogID
export async function GET(request, { params }) {
  const serviceCatalogID = parseInt(params.ServiceCatalogID);

  if (isNaN(serviceCatalogID)) {
    return NextResponse.json(
      { success: false, message: "Invalid Service Catalog ID" },
      { status: 400 }
    );
  }

  const serviceCatalog = await prisma.servicecatalog.findUnique({
    where: {
      ServiceCatalogID: serviceCatalogID,
    },
    include: {
      asset_information: true,
      servicecatalog_parts: true,
      warranty_services: true,
      caseinformation: true,
      serviceCatalogManytoMany: true,
    },
  });

  if (!serviceCatalog) {
    return NextResponse.json(
      {
        success: false,
        message: "Service Catalog not found",
        data: null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Service Catalog details retrieved",
      data: serviceCatalog,
    },
    { status: 200 }
  );
}

// PATCH: Update service catalog
export async function PATCH(request, { params }) {
  const serviceCatalogID = parseInt(params.ServiceCatalogID);
  const {
    AssetID,
    Service_offerID,
    PartNumber,
    WarrantyStatus,
    Currency,
    Price,
    Tax,
    Total,
  } = await request.json();

  try {
    const updatedService = await prisma.servicecatalog.update({
      where: {
        ServiceCatalogID: serviceCatalogID,
      },
      data: {
        AssetID,
        Service_offerID,
        PartNumber,
        WarrantyStatus,
        Currency,
        Price,
        Tax,
        Total,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service Catalog updated successfully",
        data: updatedService,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Service Catalog",
        error: error.message,
      },
      { status: 400 }
    );
  }
}

// DELETE: Delete service catalog
export async function DELETE(request, { params }) {
  const serviceCatalogID = parseInt(params.ServiceCatalogID);

  try {
    const deletedService = await prisma.servicecatalog.delete({
      where: {
        ServiceCatalogID: serviceCatalogID,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service Catalog deleted successfully",
        data: deletedService,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete Service Catalog. It may not exist or has related data.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}
