import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

import { generateID } from "@/utils/generateID";
import { notifySocket } from "../../../../../lib/SocketClient";

export async function POST(request) {
    try{
        const body = await request.json()
        const { AssetID, CaseID, selectedWarrantyServices, selectedPartCatalog, IncidentType, OwnerID, assignApo, notesLog } = body;

        //validate owner
        const materialOrderOwnerID = assignApo ?? OwnerID;

        // opt : get case info 
        const caseInfo = await prisma.caseinformation.findUnique({
            where: { CaseID: CaseID },
            select: { 
                CaseStatus: true,
                Owner: true, 
                CreatedBy: true 
            }  
        })

        if(!caseInfo) throw new Error("Case not found");
        
        const previousCaseStatus = caseInfo.CaseStatus;

        // start atomic transaction
        const { WOID, MOIDs, actionLogs } = await prisma.$transaction(async (tx) => {
            //Generate ID
            const WOID = await generateID("WO-", "workorder", "WOID", tx); 
            console.log("Generated ID:", WOID, typeof WOID);

            // 1. Create Work Order
            await tx.workorder.create({
                data: {
                    WOID,
                    CaseID,
                    WorkOrderType: IncidentType,
                    WorkOrderNumber: WOID,
                    SystemStatus: "OPEN_UNSCHEDULED",
                    OwnerID: OwnerID 
                }
            });

            // 2. Create ServiceCatalog for each selected warranty
            const createdServiceCatalog = await tx.servicecatalog.create({
                data: {
                    AssetID,
                    Service_offerID: selectedWarrantyServices.Service_offerID,
                    Price: selectedWarrantyServices.Price,
                    Tax: selectedWarrantyServices.Tax,
                    Total: selectedWarrantyServices.Total
                },
                select: { ServiceCatalogID: true }
            });

            // Link the chosen warranty service to this Work Order
            await tx.workorder.update({
                where: { WOID },
                data: { ServiceCatalogID: createdServiceCatalog.ServiceCatalogID }
            });

            // 3. Create Multiple Material Orders: one per selected part
            const createdMOIDs = [];
            const perMologs = [];
            let lineNumber = 1;
            for (const part of selectedPartCatalog) {
                const MOID = await generateID("MO-", "materialorder", "MOID", tx);
                console.log("MOID : ",MOID)
                await tx.materialorder.create({
                    data: {
                        MOID,
                        WOID,
                        OrderStatus: "New",
                        OrderType: "Repair",
                        OwnerID: materialOrderOwnerID,
                    }
                });

                await tx.materialorderlineitems.create({
                    data: {
                        LineNumber: lineNumber++,
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
                });

                // Per-MO case note
                const noteText = `[NOTICE] Order Part\n` +
                  `Order Part : ${part.PartNumber ?? "-"} - ${part.PartDescription ?? "-"}\n` +
                  `${part.Price ? `Harga : Rp. ${part.Price}\n` : ""}` +
                  `${part.RemovedPartNumber ? `Return CT Key : ${part.RemovedPartNumber}\n` : ""}` +
                  `Requested to APO : ${assignApo ?? materialOrderOwnerID ?? "-"}`;
                await tx.casenotes.create({
                    data:{
                        CaseID,
                        LogType: "NotesLog",
                        ActionType: "Action Plan",
                        Template: "",
                        VisibleExternally: true,
                        MinutesSpent: 0,
                        Note: noteText,
                        CreatedBy: OwnerID
                    }
                });

                // Per-MO action log
                const perMoLog = await tx.ActionLog.create({
                    data:{
                        CaseID_toActionLog:{
                            connect:{ CaseID }
                        },
                        ReferenceId: MOID,
                        model: "Material Order",
                        dataOld: "New",
                        dataNew: "New",
                        changedByUser: {
                            connect: { IDUser: OwnerID },
                        },
                        logDescription: `New Material Order : ${MOID}`
                    }
                });

                perMologs.push(perMoLog);
                createdMOIDs.push(MOID);
            }
            // for (const [i, part] of selectedPartCatalog.entries()) {
            //     await tx.materialorderlineitems.create({
            //     data: {
            //         LineNumber: i + 1,
            //         Description: part.PartDescription,
            //         Price: parseFloat(part.Price),
            //         Quantity: part.qty || 1,
                    
            //         materialorder: {
            //             connect: { MOID: MOID }
            //         },   
            //         servicecatalog_parts: {
            //             connect: { 
            //                 PartNumber: part.PartNumber,
            //             }
            //         },
            //         Status: "New"
            //     }
            //     });
            // }

            // 5. (Optional) Global log note if provided
            if (notesLog) {
                await tx.casenotes.create({
                    data:{
                        CaseID,
                        LogType: "NotesLog",
                        ActionType: "Action Plan",
                        Template: "",
                        VisibleExternally: true,
                        MinutesSpent: 0,
                        Note: notesLog,
                        CreatedBy: OwnerID
                    }
                })
            }
            
            // 6. Change Case Status to Part Request
            const caseUpdateData = {
                CaseStatus: "PartRequest"
            };
    
            if (assignApo !== null && assignApo !== undefined) {
                caseUpdateData["Owner"] = assignApo;
            }
    
            await tx.caseinformation.update({
                where: { CaseID: CaseID },
                data: caseUpdateData
            });

            // 7. Action Log changed case Status
            const log1 = await tx.ActionLog.create({
                data:{
                    CaseID_toActionLog:{
                        connect:{
                            CaseID: CaseID
                        }
                    },
                    model: "Case",
                    dataOld: previousCaseStatus,
                    dataNew: "Part Request",
                    changedByUser: {
                        connect: { IDUser: OwnerID },
                    },
                    logDescription: `Edit: change status from ${previousCaseStatus} to Part Request`
                }
            })
            
            // 8. Action Log create new Work Order
            const log2 = await tx.ActionLog.create({
                data:{
                    CaseID_toActionLog:{
                        connect:{
                            CaseID: CaseID
                        }
                    },
                    ReferenceId: WOID,
                    model: "Work",
                    dataOld: "OPEN_UNSCHEDULED",
                    dataNew: "OPEN_UNSCHEDULED",
                    changedByUser: {
                        connect: { IDUser: OwnerID },
                    },
                    logDescription: `New Work Order : ${WOID}`
                }
            })
            
            // 9. Action Logs for Material Orders already created per part

            return { WOID, MOIDs: createdMOIDs, actionLogs: [log1, log2, ...perMologs] };
        }, { timeout: 20000 })

        const { Owner, CreatedBy } = caseInfo;

        //Notify Socket
        for (const log of actionLogs) {
            await notifySocket("log:created", log, {
                createdById: CreatedBy || null,
                ownerId: Owner || null,
                CaseId: CaseID,
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Order created successfully", 
            WOID,
            MOID: (MOIDs && MOIDs.length > 0) ? MOIDs[MOIDs.length - 1] : undefined,
            MOIDs,
            many: Array.isArray(MOIDs) && MOIDs.length > 1
        });



    }catch(err){
        console.error("🔥 ERROR Create Order:", err);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to create order", 
            error: err.message 
        }, { 
            status: 500 
        });
    }
}
