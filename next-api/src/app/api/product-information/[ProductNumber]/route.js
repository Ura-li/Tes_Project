import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET - Ambil detail product
export async function GET(request, { params }) {
  const productNumber = params.ProductNumber;

  if (!productNumber) {
    return NextResponse.json({
      success: false,
      message: "Product number is required",
    }, { status: 400 });
  }

  try {
    const product = await prisma.product_information.findUnique({
      where: { ProductNumber: productNumber },
      include: { product_type: true },
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch product data",
      error: error.message,
    }, { status: 500 });
  }
}

// PATCH - Update Product (ProductNumber bisa diubah)
export async function PATCH(request, { params }) {
  const { ProductNumber } = params; // ProductNumber lama dari URL
  const { newProductNumber, ProductLine, ProductName, ProductTypeID } = await request.json();

  try {
    const updatedProduct = await prisma.product_information.update({
      where: { ProductNumber },
      data: {
        ProductNumber: newProductNumber, // update PK
        ProductLine,
        ProductName,
        ProductTypeID: parseInt(ProductTypeID),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Hapus Product
export async function DELETE(request, { params }) {
  const productNumber = params.ProductNumber;

  try {
    const deletedProductInformation = await prisma.product_information.delete({
      where: { ProductNumber: productNumber },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted",
      data: deletedProductInformation,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Product not found or already deleted",
      error: error.message,
    }, { status: 404 });
  }
}