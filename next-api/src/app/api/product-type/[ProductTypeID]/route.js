import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET 
export async function GET(request, { params }) {
  const ProductTypeID = parseInt(params.ProductTypeID);

  if (isNaN(ProductTypeID)) {
    return NextResponse.json({
      success: false,
      message: "Invalid Product Type ID"
    }, { status: 400 });
  }

  const product_type = await prisma.product_type.findUnique({
    where: { ProductTypeID },
  });

  if (!product_type) {
    return NextResponse.json({
      success: false,
      message: "Detail Data Product Type Not Found!",
      data: null
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Detail Data Product Type",
    data: product_type
  }, { status: 200 });
}

// UPDATE
export async function PATCH(request, { params }) {
  const ProductTypeID = parseInt(params.ProductTypeID);

  try {
    const body = await request.json();
    const { ProductTower, ProductGroup, ProductType } = body;

    if (!ProductTower || !ProductGroup || !ProductType) {
      return NextResponse.json({
        success: false,
        message: "All fields are required!"
      }, { status: 400 });
    }
    
    const updatedProductTypeInformation = await prisma.product_type.update({
      where: { ProductTypeID },
      data: { ProductTower, ProductGroup, ProductType }
    });

    return NextResponse.json({
      success: true,
      message: "Data Product Type Information Updated!",
      data: updatedProductTypeInformation
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update Product Type",
      error: error.message
    }, { status: 500 });
  }
}

// DELETE 
export async function DELETE(request, { params }) {
  const ProductTypeID = parseInt(params.ProductTypeID);

  try {
    const deletedProductType = await prisma.product_type.delete({
      where: { ProductTypeID },
    });

    return NextResponse.json({
      success: true,
      message: "Product Type deleted successfully",
      data: deletedProductType
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Product Type not found or already deleted",
      error: error.message
    }, { status: 404 });
  }
}
