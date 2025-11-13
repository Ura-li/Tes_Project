import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, {params}) {
    const { WOID } = await params
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
            include: {
              caseinformation: {
                include: {
                  otcCodeTable: true,
                }
              },
              serviceCatalog: {
                include: {
                  warranty_services: true,
                  servicecatalog_parts: true,
                  asset_information: true,
                }
              },
              NMU: true,
              NMUItem: true,
              ServiceType: true,
            }
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
    const { WOID } = await params
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
        IncomingChannel,
        DelayCode,
        NMUId,
        VersionNMU,
        NMUItemId,
        CEAnalysis,
        DefectDesc,
        RepairAction,
        ServiceTypeId,
        CancelReason,
        IsCancel
        } = body;

        // if (
        //     !WorkOrderType || !Priority || !SystemStatus
        // ) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "All fields are required!"
        //     }, { status: 400 });
        // }

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
        const isValidDate = (val) => {
            const d = new Date(val);
            return !isNaN(d.getTime());
          };
          
          const fieldMap = {
            WorkOrderType: v => v,
            Priority: v => v,
            SystemStatus: v => v,
            SubStatus: v => v,
            PreferredDay: v => isValidDate(v) ? new Date(v) : undefined,
            PreferredTime: v => isValidDate(v) ? new Date(v) : undefined,
            ShipmentCountry: v => v,
            ShipmentState: v => v,
            CreatedOn: v => isValidDate(v) ? new Date(v) : undefined,
            Owner: v => v,
            SLAJeopardy: v => v,
            DueDateCustomer: v => isValidDate(v) ? new Date(v) : undefined,
            CoverageWindow: v => v,
            Response: v => v,
            OTCCode: v => v,
            RequestedDateTimeCustomer: v => isValidDate(v) ? new Date(v) : undefined,
            GuaranteedFixTimeCustomer: v => isValidDate(v) ? new Date(v) : undefined,
            EarlyStartDateTimeCustomer: v => isValidDate(v) ? new Date(v) : undefined,
            LatestStartDateTimeCustomer: v => isValidDate(v) ? new Date(v) : undefined,
            SLAReschedule: v => v,
            ActiveScheduleDate: v => isValidDate(v) ? new Date(v) : undefined,
            SLAErrorDescription: v => v,
            CasePriorityIndex: v => isNaN(parseInt(v, 10)) ? undefined : parseInt(v, 10),
            PartnerStatus: v => v,
            WorkOrderDescription: v => v,
            PartnerNotes: v => v,
            IncomingChannel: v => v,
            DelayCode: v => v,
            NMUId: v => v,
            VersionNMU: v => v,
            NMUItemId: v => v,
            CEAnalysis: v => v,
            DefectDesc: v => v,
            RepairAction: v => v,
            ServiceTypeId: v => v,
            CancelReason: v => v,
            IsCancel: v => v
          };
          
          
          const dataToUpdate = {};
          
          for (const [field, transform] of Object.entries(fieldMap)) {
            if (body[field] !== undefined) {
              dataToUpdate[field] = transform(body[field]);
            }
          }
          
    
          const updatedWorkOrderInformation = await prisma.workorder.update({
            where: { WOID: WOID },
            data: dataToUpdate
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
