import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { generateID } from "@/utils/generateID";
import { notifySocket } from "../../../../lib/SocketClient";

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
    const woidParamRaw = searchParams.get("WOID");

    if (!woidParamRaw || woidParamRaw.trim().length === 0) {
      return NextResponse.json({
        success: false,
        message: "Parameter 'WOID' tidak valid atau kosong",
        data: [],
      }, { status: 400 });
    }

    const woidList = woidParamRaw.split(",").map((id) => id.trim());

        // console.log("Query Params:", { search, page, limit });
         // Initialize search filters
         const materialOrders = await prisma.materialorder.findMany({
            where: {
              WOID: { in: woidList }
            },
            include: {
                workorder: {
                    include: {
                        caseinformation: {
                            include:{
                                site_account : true,
                                contact_information : true
                            }
                        },
                        bookings: {
                            include: {
                                bookingDetails: true
                            }
                        }
                    }
                },
                owner: true,
                // materialorderlineitems: true

            }
          });
          return NextResponse.json({
            success: true,
            message: "List Data Material Order",
            data: materialOrders,
          });

}catch (err) {
  console.error("🔥 ERROR in GET API:", err);

  return NextResponse.json({
    success: false,
    message: "Failed to fetch data",
    error: err.message,
  }, { status: 500 });
}
}

// Create a new Material Order for an existing Work Order (WO)
export async function POST(request) {
  try {
    const body = await request.json();
    const { WOID, selectedPartCatalog = [], OwnerID, assignApo, notesLog } = body;

    if (!WOID || typeof WOID !== "string") {
      return NextResponse.json({
        success: false,
        message: "Invalid or missing WOID",
      }, { status: 400 });
    }

    if (!Array.isArray(selectedPartCatalog) || selectedPartCatalog.length === 0) {
      return NextResponse.json({
        success: false,
        message: "selectedPartCatalog must contain at least one item",
      }, { status: 400 });
    }

    // Fetch related Work Order and Case for logging/notes context
    const workOrder = await prisma.workorder.findUnique({
      where: { WOID },
      include: {
        caseinformation: {
          select: { CaseID: true, Owner: true, CreatedBy: true }
        }
      }
    });

    if (!workOrder) {
      return NextResponse.json({
        success: false,
        message: "Work Order not found",
      }, { status: 404 });
    }

    const caseInfo = workOrder.caseinformation;
    const materialOrderOwnerID = assignApo ?? OwnerID ?? caseInfo?.Owner ?? workOrder.OwnerID ?? null;

    if (!materialOrderOwnerID) {
      return NextResponse.json({
        success: false,
        message: "OwnerID or assignApo is required",
      }, { status: 400 });
    }

    const { MOID, actionLog } = await prisma.$transaction(async (tx) => {
      const MOID = await generateID("MO-", "materialorder", "MOID", tx);

      await tx.materialorder.create({
        data: {
          MOID,
          WOID,
          OrderStatus: "New",
          OrderType: "Repair",
          OwnerID: materialOrderOwnerID,
        },
      });

      // Create Line Items
      await Promise.all(
        selectedPartCatalog.map((part, i) =>
          tx.materialorderlineitems.create({
            data: {
              LineNumber: i + 1,
              Description: part.PartDescription,
              Price: part.Price != null ? parseFloat(part.Price) : 0,
              Quantity: part.qty || 1,
              Status: "New",
              RemovedPartNumber: part.RemovedPartNumber ?? null,
              materialorder: { connect: { MOID } },
              servicecatalog_parts: part.PartNumber
                ? { connect: { PartNumber: part.PartNumber } }
                : undefined,
            },
          })
        )
      );

      // Optional Case Note for traceability
      if (caseInfo?.CaseID && notesLog) {
        await tx.casenotes.create({
          data: {
            CaseID: caseInfo.CaseID,
            LogType: "NotesLog",
            ActionType: "Action Plan",
            Template: "",
            VisibleExternally: true,
            MinutesSpent: 0,
            Note: notesLog,
            CreatedBy: OwnerID ?? caseInfo.CreatedBy ?? null,
          },
        });
      }

      // Action Log entry for new MO
      let actionLog = null;
      if (caseInfo?.CaseID) {
        actionLog = await tx.ActionLog.create({
          data: {
            CaseID_toActionLog: { connect: { CaseID: caseInfo.CaseID } },
            ReferenceId: MOID,
            model: "Material Order",
            dataOld: "New",
            dataNew: "New",
            changedByUser: OwnerID ? { connect: { IDUser: OwnerID } } : undefined,
            logDescription: `New Material Order : ${MOID}`,
          },
        });
      }

      return { MOID, actionLog };
    });

    // Notify listeners of created log
    if (actionLog && caseInfo) {
      await notifySocket("log:created", actionLog, {
        createdById: caseInfo.CreatedBy || null,
        ownerId: caseInfo.Owner || null,
        CaseId: caseInfo.CaseID,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Material Order created successfully",
      MOID,
    });
  } catch (err) {
    console.error("dY” ERROR Create Material Order:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to create material order",
      error: err.message,
    }, { status: 500 });
  }
}


// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const search = searchParams.get("search") || "";
//     const woidParam = searchParams.get("WOID");

//     // Validasi dan parsing WOID
//     const woidArray = woidParam
//       ? woidParam
//           .split(",")
//           .map(w => w.trim())
//           .filter(w => w.length > 0 && w.length <= 13) // Validasi maksimal 13 karakter
//       : [];

//     if (woidArray.length === 0) {
//       return NextResponse.json({
//         success: false,
//         message: "Parameter 'WOID' tidak valid atau kosong",
//         data: [],
//       }, { status: 400 });
//     }

//     // Ambil data materialorder yang sesuai
//     const materialOrders = await prisma.materialorder.findMany({
//       where: {
//         WOID: { in: woidArray },
//       },
//       orderBy: {
//         CreatedOn: "desc",
//       },
//       include: {
//         owner: true,
//         workorder: true,
//         materialorderlineitems: true,
//         childMOs: true,
//         parentMO: true,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "List Data Material Order",
//       data: materialOrders,
//     });

//   } catch (err) {
//     console.error("🔥 ERROR in GET API:", err);

//     return NextResponse.json({
//       success: false,
//       message: "Failed to fetch data",
//       error: err.message,
//     }, { status: 500 });
//   }
// }
