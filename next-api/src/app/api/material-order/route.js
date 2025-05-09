import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

// export async function GET(request) {
//     try{
//         const { searchParams } = new URL(request.url);
//         const search = searchParams.get("search") || "";
//         const woidParam = searchParams.get("WOID"); // "wo1,wo2"
        
//         const woidArray = woidParam?.split(",") || [];
        
//         // const page = parseInt(searchParams.get("page")) || 1;
//         // const limit = parseInt(searchParams.get("limit")) || 10;

//         // console.log("Query Params:", { search, page, limit });
//          // Initialize search filters
//          const materialOrders = await prisma.materialorder.findMany({
//             where: {
//               WOID: { in: woidArray }
//             },
//           });

//         return NextResponse.json({
//             success: true,
//             message: "List Data Material Order",
//             data: materialOrders
//         });
//     }catch(err){
//         console.error("🔥 ERROR in GET API:", err);

//         return NextResponse.json({
//             success: false,
//             message: "Failed to fetch data",
//             error: err.message
//         }, { status: 500 });
//     }
// }

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const woidParam = searchParams.get("WOID");

    // Validasi dan parsing WOID
    const woidArray = woidParam
      ? woidParam
          .split(",")
          .map(w => w.trim())
          .filter(w => w.length > 0 && w.length <= 13) // Validasi maksimal 13 karakter
      : [];

    if (woidArray.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Parameter 'WOID' tidak valid atau kosong",
        data: [],
      }, { status: 400 });
    }

    // Ambil data materialorder yang sesuai
    const materialOrders = await prisma.materialorder.findMany({
      where: {
        WOID: { in: woidArray },
      },
      orderBy: {
        CreatedOn: "desc",
      },
      include: {
        owner: true,
        workorder: true,
        materialorderlineitems: true,
        childMOs: true,
        parentMO: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "List Data Material Order",
      data: materialOrders,
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
