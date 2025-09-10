import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

import { generateID } from "@/utils/generateID";

export async function POST(request) {
    try{
        const body = await request.json()
        const { AssetID, CaseID, selectedWarrantyServices, selectedPartCatalog, IncidentType, OwnerID, assignApo, notesLog } = body;

        //validate owner
        const materialOrderOwnerID = assignApo ?? OwnerID;

        // opt : get case info 
        const caseInfo = await prisma.caseinformation.findUnique({
            where: { CaseID: CaseId },
            select: { Owner: true, CreatedBy: true }  
        })
        
         // 1. Create Work Order
        const WOID = await generateID("WO-", "workorder", "WOID"); 
        console.log("Generated ID:", WOID, typeof WOID);
        const workorder = await prisma.workorder.create({
            data: {
                WOID: WOID,
                CaseID,
                WorkOrderType: IncidentType,
                WorkOrderNumber: WOID,
                SystemStatus: "OPEN_UNSCHEDULED",
                OwnerID: OwnerID 
            }
        });

         // 2. Create ServiceCatalog for each selected warranty
        await prisma.servicecatalog.create({
            data: {
                AssetID,
                Service_offerID: selectedWarrantyServices.Service_offerID,
                Price: selectedWarrantyServices.Price,
                Tax: selectedWarrantyServices.Tax,
                Total: selectedWarrantyServices.Total
            }
        });
    
        // 3. Create Material Order (One only)
        const MOID = await generateID("MO-", "materialorder", "MOID");
        await prisma.materialorder.create({
            data: {
            MOID,
            WOID,
            OrderStatus: "New",
            OrderType: "Repair",
            OwnerID: materialOrderOwnerID
            }
        });

         // 4. Create MaterialOrderLineItems
        for (const [i, part] of selectedPartCatalog.entries()) {
            await prisma.materialorderlineitems.create({
            data: {
                LineNumber: i + 1,
                Description: part.PartDescription,
                Price: parseFloat(part.Price),
                Quantity: part.qty || 1,
                
                materialorder: {
                    connect: { MOID: MOID }
                },   
                servicecatalog_parts: {
                    connect: { 
                        PartNumber: part.PartNumber,
                    }
                },
                Status: "New"
            }
            });
        }

        // 5. Log Note inform Part Order
        await prisma.casenotes.create({
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

        // 6. Change Case Status to Part Request
        const caseUpdateData = {
            CaseStatus: "PartRequest"
        };

        if (assignApo !== null && assignApo !== undefined) {
            caseUpdateData["Owner"] = assignApo;
        }

        await prisma.caseinformation.update({
            where: { CaseID: CaseID },
            data: caseUpdateData
        });


        // 7. Action Log changed case Status
        await prisma.ActionLog.create({
            data:{
                CaseID_toActionLog:{
                    connect:{
                        CaseID: CaseID
                    }
                },
                model: "Case",
                dataOld: caseInfo?.CaseStatus,
                dataNew: "Part Request",
                changedBy: OwnerID,
                logDescription: `Edit: change status from ${caseInfo?.CaseStatus} to Part Request`
            }
        })
        
        // 8. Action Log create new Work Order
        await prisma.ActionLog.create({
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
                changedBy: OwnerID,
                logDescription: `New Work Order : ${WOID}`
            }
        })
        
        // 9. Action Log create Material Order 
        await prisma.ActionLog.create({
            data:{
                CaseID_toActionLog:{
                    connect:{
                        CaseID: CaseID
                    }
                },
                ReferenceId: MOID,
                model: "Material Order",
                dataOld: "New",
                dataNew: "New",
                changedBy: OwnerID,
                logDescription: `New Material Order : ${MOID}`
            }
        })
        



        return NextResponse.json({ 
            success: true, 
            message: "Order created successfully", 
            WOID, 
            MOID 
        });



    }catch(err){
        return NextResponse.json({ 
            success: false, 
            message: "Failed to create order", 
            error: err.message 
        }, { 
            status: 500 
        });
    }
}