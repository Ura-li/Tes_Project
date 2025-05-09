import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

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
    const symptomCodeID = parseInt(params.SymptomCodeID);
    const {
        SymptomCode,
        TopCategory,
        SubCategory,
        QualityCodes
    } = await request.json();

    const symptom_codes = await prisma.symptom_codes.update({
        where: {
            SymptomCodeID: symptomCodeID
        },
        data: {
            SymptomCode,
            TopCategory,
            SubCategory,
            QualityCodes
        }
    });

    return NextResponse.json(
        {
            success: true,
            message: "Symptom Code Updated!",
            data: symptom_codes,
        },
        {
            status: 200,
        }
    );
}

export async function DELETE(request, { params }) {
    const { SymptomCodeID } = params;
  
    try {
      const deletedSymptom = await prisma.symptom_codes.delete({
        where: {
          SymptomCodeID: parseInt(SymptomCodeID),
        },
      });
  
      return NextResponse.json({
        success: true,
        message: "Symptom Code deleted successfully",
        data: deletedSymptom,
      }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Failed to delete Symptom Code. It may not exist.",
        error: error.message,
      }, { status: 404 });
    }
  }