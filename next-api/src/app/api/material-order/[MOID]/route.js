import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// export async function GET(request, {params}) {
//     // const moid = await params.MOID
//     const { MOID } = await params;
//     const moid = MOID

//     if (!moid) {
//         return NextResponse.json({
//             success: false,
//             message: "Invalid Material Order ID"
//         }, { status: 400 });
//     }
//     try{
//         const materialorder = await prisma.materialorder.findUnique({
//             where: { MOID: moid },
//         });
    
//         if (!materialorder) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Detail Data Material Order Not Found!",
//                 data: null
//             }, { status: 404 });
//         }
    
//         return NextResponse.json({
//             success: true,
//             message: "Detail Data Material Order",
//             data: materialorder
//         }, { status: 200 });
//     }catch(err){
//         console.error("🔥 ERROR in GET API:", err);

//         return NextResponse.json({
//             success: false,
//             message: "Failed to fetch data",
//             error: err.message
//         }, { status: 500 });
//     }
// }

// export async function PATCH(request, {params}) {
//     const { MOID } = await params;
//     const moid = MOID

//     if (!moid) {
//         return NextResponse.json({
//             success: false,
//             message: "Invalid Material Order ID"
//         }, { status: 400 });
//     }
//     try {
//         const body = await request.json();
//         // Cek apakah AssetID ada
//         const existingMaterialOrder = await prisma.materialorder.findUnique({
//             where: { MOID: moid }
//         });
        
        
//         if (!existingMaterialOrder) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Material Order not found!"
//             }, { status: 404 });
//         }
        
//         const { OrderNumber, OrderStatus, OrderType, CreatedOn, SalesOrderNumber, RMANumber, ReadyForClosureDate, Owner } = body;
//         // Update data
//         const updatedMaterialOrder = await prisma.materialorder.update({
//             where: { MOID: moid },
//             data: {
//                 OrderNumber, 
//                 OrderStatus, 
//                 OrderType, 
//                 CreatedOn, 
//                 SalesOrderNumber, 
//                 RMANumber, 
//                 ReadyForClosureDate, 
//                 Owner
//             }
//         });

//         return NextResponse.json({
//             success: true,
//             message: "Data Material Order Information Updated!",
//             data: updatedMaterialOrder
//         }, { status: 200 });

//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: "Failed to update Material Order",
//             error: error.message
//         }, { status: 500 });
//     }
// }


export async function GET(request, { params }) {
  const { MOID: moid } = params;

  if (!moid || typeof moid !== "string" || moid.length > 13) {
    return NextResponse.json({
      success: false,
      message: "Invalid Material Order ID",
    }, { status: 400 });
  }

  try {
    const materialorder = await prisma.materialorder.findUnique({
      where: { MOID: moid },
      include: {
        // owner: true,
        materialorderlineitems: true,
        // parentMO: true,
        // childMOs: true,
        // Resource: true,
        workorder: {
          include: {
            caseinformation: {
              include: {
                contact_information: true,
              },
            },
          },
        },
      },
    });

    if (!materialorder) {
      return NextResponse.json({
        success: false,
        message: "Detail Data Material Order Not Found!",
        data: null,
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Detail Data Material Order",
      data: materialorder,
    });

  } catch (err) {
    console.error("🔥 ERROR in GET API:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      error: err.message,
    }, { status: 500 });
  }
}


// ======================= PATCH =======================
export async function PATCH(request, { params }) {
  const { MOID: moid } = params;

  if (!moid || typeof moid !== "string" || moid.length > 13) {
    return NextResponse.json({
      success: false,
      message: "Invalid Material Order ID",
    }, { status: 400 });
  }

  try {
    const body = await request.json();

    const existingMaterialOrder = await prisma.materialorder.findUnique({
      where: { MOID: moid },
    });

    if (!existingMaterialOrder) {
      return NextResponse.json({
        success: false,
        message: "Material Order not found!",
      }, { status: 404 });
    }

    const {
      OrderNumber,
      OrderStatus,
      OrderType,
      CreatedOn,
      SalesOrderNumber,
      RMANumber,
      ReadyForClosureDate,
      OwnerID,
      ShippingPriority,
      CustomerInducedDamage,
      AccidentalDamageProtection,
      DefectiveMediaRetention,
      DeliveryRequestedDate,
      CollectionRequestedDate,
      PromoCode,
      NotificationNumber,
      ParentMOID,
      IsBCPOrder,
      MaterialOrderType,
      EOTOrderNumber,
    //   ResourceId,
    } = body;

    const updatedMaterialOrder = await prisma.materialorder.update({
      where: { MOID: moid },
      data: {
        OrderNumber,
        OrderStatus,
        OrderType,
        CreatedOn,
        SalesOrderNumber,
        RMANumber,
        ReadyForClosureDate,
        OwnerID,
        ShippingPriority,
        CustomerInducedDamage,
        AccidentalDamageProtection,
        DefectiveMediaRetention,
        DeliveryRequestedDate,
        CollectionRequestedDate,
        PromoCode,
        NotificationNumber,
        ParentMOID,
        IsBCPOrder,
        MaterialOrderType,
        EOTOrderNumber,
        // ResourceId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data Material Order Information Updated!",
      data: updatedMaterialOrder,
    });

  } catch (error) {
    console.error("🔥 ERROR in PATCH API:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update Material Order",
      error: error.message,
    }, { status: 500 });
  }
}
