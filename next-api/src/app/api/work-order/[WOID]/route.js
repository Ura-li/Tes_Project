import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, {params}) {
    const { WOID } = params
    const woid = WOID

    if (!woid) {
        return NextResponse.json({
            success: false,
            message: "Invalid Work Order ID"
        }, { status: 400 });
    }
    try{
        const workorder = await prisma.workorder.findUnique({
            where: { WOID: woid },
        });
    
        if (!workorder) {
            return NextResponse.json({
                success: false,
                message: "Detail Data Work Order Not Found!",
                data: null
            }, { status: 404 });
        }
    
        return NextResponse.json({
            success: true,
            message: "Detail Data Work Order",
            data: workorder
        }, { status: 200 });
    }catch(err){
        console.error("🔥 ERROR in GET API:", err);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: err.message
        }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const { WOID } = params
    const woid = WOID

    try {
        const body = await request.json();
        const {
        WorkOrderType, 
        Priority,
        SystemStatus,
        SubStatus,
        PreferredDay,
        PreferredTime, 
        ShipmentCountry,
        ShipmentState,
        CreatedOn,
        Owner,
        SLAJeopardy,
        DueDateCustomer,
        CoverageWindow ,
        Response,
        OTCCode,
        RequestedDateTimeCustomer,
        GuaranteedFixTimeCustomer,
        EarlyStartDateTimeCustomer,
        LatestStartDateTimeCustomer,
        SLAReschedule,
        ActiveScheduleDate,
        SLAErrorDescription,
        CasePriorityIndex,
        PartnerStatus,
        WorkOrderDescription,
        PartnerNotes,
        IncomingChannel
        } = body;

        if (
            !WorkOrderType || !Priority || !SystemStatus
        ) {
            return NextResponse.json({
                success: false,
                message: "All fields are required!"
            }, { status: 400 });
        }

        // Cek apakah Material Order ada
        const existingWorkOrder = await prisma.workorder.findUnique({
            where: { WOID:WOID }
        });

        if (!existingWorkOrder) {
            return NextResponse.json({
                success: false,
                message: "Work Order not found!"
            }, { status: 404 });
        }

        // Update data
        const casePriorityIndexFormatted = CasePriorityIndex ? parseInt(CasePriorityIndex, 10) : null;
        const preferredDayFormatted = PreferredDay ? new Date(PreferredDay) : null;
        const preferredTimeFormatted = PreferredTime ? new Date(PreferredTime) : null;
        const createdOnFormatted = CreatedOn ? new Date(CreatedOn) : new Date();
        const dueDateCustomerFormatted = DueDateCustomer ? new Date(DueDateCustomer) : null;
        const requestedDateTimeCustomerFormatted = RequestedDateTimeCustomer ? new Date(RequestedDateTimeCustomer) : null;
        const guaranteedFixTimeCustomerFormatted = GuaranteedFixTimeCustomer ? new Date(GuaranteedFixTimeCustomer) : null;
        const earlyStartDateTimeCustomerFormatted = EarlyStartDateTimeCustomer ? new Date(EarlyStartDateTimeCustomer) : null;
        const latestStartDateTimeCustomerFormatted = LatestStartDateTimeCustomer ? new Date(LatestStartDateTimeCustomer) : null;
        const activeScheduleDateFormatted = ActiveScheduleDate ? new Date(ActiveScheduleDate) : null;
    
        const updatedWorkOrderInformation = await prisma.workorder.update({
          where: { WOID },
          data: {
            WorkOrderType,
            Priority,
            SystemStatus,
            SubStatus,
            PreferredDay: preferredDayFormatted,
            PreferredTime: preferredTimeFormatted,
            ShipmentCountry,
            ShipmentState,
            CreatedOn: createdOnFormatted,
            Owner,
            SLAJeopardy,
            DueDateCustomer: dueDateCustomerFormatted,
            CoverageWindow,
            Response,
            OTCCode,
            RequestedDateTimeCustomer: requestedDateTimeCustomerFormatted,
            GuaranteedFixTimeCustomer: guaranteedFixTimeCustomerFormatted,
            EarlyStartDateTimeCustomer: earlyStartDateTimeCustomerFormatted,
            LatestStartDateTimeCustomer: latestStartDateTimeCustomerFormatted,
            SLAReschedule,
            ActiveScheduleDate: activeScheduleDateFormatted,
            SLAErrorDescription,
            CasePriorityIndex: casePriorityIndexFormatted,
            PartnerStatus,
            WorkOrderDescription,
            PartnerNotes,
            IncomingChannel
          }
        });
    
        return NextResponse.json({
          success: true,
          message: "Data Work Order Information Updated!",
          data: updatedWorkOrderInformation
        }, { status: 200 });
    
      } catch (error) {
        console.error(error);
        return NextResponse.json({
          success: false,
          message: "Failed to update Work Order",
          error: error.message
        }, { status: 500 });
      }
    }