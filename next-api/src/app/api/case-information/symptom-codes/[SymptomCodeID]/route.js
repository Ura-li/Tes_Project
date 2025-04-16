import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function GET(request, {params}) {
    //get params id
    const url = new URL(request.url)
    const symptomCodeID = parseInt(url.pathname.split("/").pop())

    if (isNaN(symptomCodeID)) {
        return NextResponse.json(
            { success: false, message: "Invalid Symptom Code ID" },
            { status: 400 }
        );
    }

    //get detail 
    const symptom_codes = await prisma.symptom_codes.findUnique({
        where: {
            SymptomCodeID: symptomCodeID,
        }
    })

    if(!symptom_codes){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Symptom Code Not Found!",
                data: null,
            },
            {
                status: 404,
            }
        );
    }
    return NextResponse.json(
        {
            success:true,
            message: "Detail Data Symptom Code",
            data: symptom_codes,
        },
        {
            status: 200,
        }
    );
}


export async function PATCH(request, { params }) {
    const symptomCodeID = parseInt(params.symptomCodeID);

    const symptom_codes = await prisma.symptom_codes.update({
        where: {
            SymptomCodeID: symptomCodeID
        },
        data : {
            // CaseID: CaseID,
            // LogType: LogType,
            // ActionType: ActionType,
            // Template: Template,
            // VisibleExternally: VisibleExternally,
            // MinutesSpent: MinutesSpent,
            // Note: updatedNote,
        }
    })
    return NextResponse.json(
        {
            success: true,
            message: "Case Note Information Updated!",
            data: symptom_codes,
        },
        {
            status: 200,
        }
    )
}