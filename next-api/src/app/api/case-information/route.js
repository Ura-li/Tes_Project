import { NextResponse } from "next/server";

import prisma  from "../../../../prisma/client";

export async function GET(request) {
    //get search parameter
    const { searchParams } = new URL(request.url);

    //extract query parameter
    const CaseStatus = searchParams.get("CaseStatus")

    //prisma query filter
    const filters = {};
    if(CaseStatus){
        filters.CaseStatus = { contains: CaseStatus }
    }
    //get all data
    const case_information = await prisma.caseinformation.findMany({
        where: Object.keys(filters).length > 0 ? filters : undefined
    });
    return NextResponse.json(
        {
            success: true,
            message: "List Data Case",
            data: case_information,
        },
        {
            status:200,
        }
    );
}

export async function POST(request) {
    //get all request
    const { 
        CaseID,
        SiteAccountID,
        ContactID,
        AssetID,
        CaseSubject,
        CaseType,
        KCI_Flag,
        IncomingChannel,
        CaseStatus,
        CasePriority,
        CustomerSeverity,
        CaseClosedDate,
        CaseNote,
        SymptomCode,
        CaseResolution
    } = await request.json();

    //create data 
    const case_information = await prisma.caseinformation.create({
        data:{
            CaseID: CaseID,
            SiteAccountID: SiteAccountID,
            ContactID: ContactID,
            AssetID: AssetID,
            CaseSubject: CaseSubject,
            CaseType: CaseType,
            KCI_Flag: KCI_Flag,
            IncomingChannel: IncomingChannel,
            CaseStatus: CaseStatus,
            CasePriority: CasePriority,
            CustomerSeverity: CustomerSeverity,
            CaseClosedDate: CaseClosedDate,
            CaseNote: CaseNote,
            SymptomCode: SymptomCode,
            CaseResolution: CaseResolution
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Case Created Successfully!",
            data: case_information,
        },
        { 
            status: 201
        }
    )
}