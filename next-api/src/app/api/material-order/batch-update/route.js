import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function PATCH(request, {params}) {
    const { updates, MOID, WOID, userId } = await request.json(); 

    try {
        // const authHeader = request.headers.get("authorization");
        // let userId = null;
        // if (authHeader?.startsWith("Bearer ")) {
        //     const token = authHeader.slice(7);
        //     try {
        //         const decoded = jwt.verify(token, JWT_SECRET);
        //         userId = decoded?.id; // sesuaikan field di token kamu
        //     } catch (e) {
        //         console.warn("JWT invalid:", e.message);
        //     }
        // }

        let oldOrderStatus = null;
        let newOrderStatus = null;

        
        await prisma.$transaction(async (tx) => {
        
            const oldMO = await tx.materialorder.findUnique({ where: { MOID } });
            oldOrderStatus = oldMO?.OrderStatus;

            // update line items
            for (const [lineItemID, newStatus] of Object.entries(updates)) {
                await tx.materialorderlineitems.update({
                    where: { LineItemID: Number(lineItemID) },
                    data: { Status: newStatus },
                });
            }

        // cek apakah semua MOLI sudah shipped
        const allItems = await tx.materialorderlineitems.findMany({ where: { MOID } });
        const allShipped = allItems.every((item) => item.Status === "Shipped");

        if (allShipped) {
            await tx.materialorder.update({
                where: { MOID },
                data: { OrderStatus: "Shipped" },
            });
        }
        
        const getWOID = await prisma.workorder.findUnique({
            where: { WOID},
            include: {
                caseinformation: true
            }
        })
        console.log(getWOID)
        //action log terkait MOID
        await tx.actionLog.create({
            data: {
                CaseId: getWOID?.caseinformation?.CaseID,
                ReferenceId: MOID,
                model: "Material Orders",
                dataOld: oldOrderStatus ?? "Unknown",
                dataNew: "Shipped",
                changedBy: userId,
                logDescription: `Batch update MOLI for MO ${MOID}: ${Object.keys(updates).length} item(s) updated. MO status: ${oldOrderStatus} → Shipped`,
            },
        });

        //action log case
        await tx.actionLog.create({
            data: {
                CaseId: `${getWOID?.caseinformation?.CaseID}`,
                model: "Case",
                dataOld: getWOID?.caseinformation?.CaseStatus,
                dataNew: "Part Available",
                changedBy: userId,
                logDescription: `Edit: change status from ${getWOID?.caseinformation?.CaseStatus} to Part Available`
            }
        })
        //pergantian case status ke part avilable
        await tx.caseinformation.update({
            where: { 
                CaseID: getWOID?.caseinformation.CaseID
            },
            data: {
                CaseStatus: "PartAvailable",
                Owner: getWOID?.OwnerID
            }
        })
        
        
    });
    const updatedMO = await prisma.materialorder.findUnique({
        where: { MOID },
        include: { materialorderlineitems: true },
    });
    return NextResponse.json(
        {
            success: true,
            message: "Batch update success!",
            data: updatedMO,
        },
        { status: 200 }
    );
    
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to update Batch Material Order",
            error: error.message
        }, { status: 500 });
    }
}
