import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    try {
        const workOrderID = parseInt(params.WOID);

        if (isNaN(workOrderID)) {
            return NextResponse.json(
                { success: false, message: "Invalid WorkOrder ID" },
                { status: 400 }
            );
        }

        const workorder = await prisma.workorder.findUnique({
            where: { WOID: workOrderID },
            include: {
                caseinformation: true,
                materialorder: true
            }
        });

        if (!workorder) {
            return NextResponse.json(
                { success: false, message: "Workorder not found!", data: null },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Workorder data retrieved", data: workorder },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

// UPDATE DATA
export async function PATCH(request, { params }) {
    try {
        const workOrderID = parseInt(params.WOID);
        if (isNaN(workOrderID)) {
            return NextResponse.json(
                { success: false, message: "Invalid WorkOrder ID" },
                { status: 400 }
            );
        }

        const data = await request.json();

        const allowedFields = [
            "WorkOrderNumber", "WorkOrderType", "Priority", "SystemStatus", "SubStatus",
            "PreferredDay", "PreferredTime", "ShipmentCountry", "ShipmentState", "Owner",
            "SLAInCustomerTimeZone", "SLAJeopardy", "DueDateCustomer", "CoverageWindow",
            "Response", "OTCCode", "RequestedDateTimeCustomer", "GuaranteedFixTimeCustomer",
            "EarlyStartDateTimeCustomer", "LatestStartDateTimeCustomer", "SLAReschedule",
            "ActiveScheduleDate", "SLAErrorDescription", "CasePriorityIndex",

            // Tambahan untuk section General
            "IncomingChannel", "PartnerStatus", "WorkOrderDescription", "WorkOrderInstruction"
        ];

        const updateData = {};
        for (const field of allowedFields) {
            if (field in data) {
                updateData[field] = data[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: "No fields to update!" },
                { status: 400 }
            );
        }

        const updated = await prisma.workorder.update({
            where: { WOID: workOrderID },
            data: updateData,
        });

        return NextResponse.json(
            { success: true, message: "Workorder updated successfully", data: updated },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error updating workorder", error: error.message },
            { status: 500 }
        );
    }
}


// DELETE DATA
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const workOrderID = parseInt(url.pathname.split("/").pop(), 10);

        if (isNaN(workOrderID)) {
            return NextResponse.json(
                { success: false, message: "Invalid WorkOrder ID" },
                { status: 400 }
            );
        }

        // Cek apakah workorder memiliki relasi materialorder
        const relatedMaterials = await prisma.materialorder.count({
            where: { WorkOrderWOID: workOrderID }
        });

        if (relatedMaterials > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cannot delete WorkOrder. It has related material orders.",
                    relatedMaterials
                },
                { status: 409 }
            );
        }

        // Delete
        await prisma.workorder.delete({
            where: { WOID: workOrderID },
        });

        return NextResponse.json(
            { success: true, message: "Workorder successfully deleted!" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error deleting workorder", error: error.message },
            { status: 500 }
        );
    }
}

