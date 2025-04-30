import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    const { IDUser } = await params
    const idUser = parseInt(IDUser)

    if (isNaN(idUser)) {
        return NextResponse.json({
            success: false,
            message: "Invalid ID User"
        }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { IDUser: idUser}
    })
    if(!user) {
        return NextResponse.json({
            success: false,
            message: "Detail Data User Not Found!",
            data: null
        }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        message: "Detail Data User Information",
        data: user
    }, { status: 200 });
}

export async function PATCH(request, { params }) {
    const { IDUser } = await params
    const idUser = parseInt(IDUser)

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