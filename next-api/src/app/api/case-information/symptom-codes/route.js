import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request) {
    try{
        //ambil parameter
        const { searchParams } = new URL(request.url);
        const symptom_codes = await prisma.symptom_codes.findMany({
            orderBy: { SymptomCode : "asc" }
        })

        return NextResponse.json(
            {
                success: true,
                status: 200,
                message: "List Data Symptom Codes",
                data: symptom_codes
            }
        )
    }catch(e){
        console.error("🔥 ERROR in GET API:", e);

        return NextResponse.json(
          {
            success: false,
            message: "Failed to fetch data",
            error: e.message,
          },
          { status: 500 }
        );
    }
}

export async function POST(request) {
    // try{
    //     const {
    //         LogType,
    //         ActionType,
    //         Template,
    //         VisibleExternally,
    //         MinutesSpent,
    //         Note,
    //         CaseID
    //     } = await request.json()
    
    //     /**
    //      * TODO :
    //      * Make a validation for note, when it's available, it send to put path
    //      */
        
    //     const existingNote = await prisma.casenotes.findFirst({
    //         where: {CaseID: CaseID}
    //     })
    //     if(existingNote){
    //         const updatedNote = await prisma.casenotes.update({
    //             where: { NoteID: existingNote.NoteID },
    //             data: {
    //               Note: existingNote.Note + "\n" + Note, // append
    //               LogType,
    //               ActionType,
    //               Template,
    //               VisibleExternally,
    //               MinutesSpent,
    //             }
    //           });
        
    //           return NextResponse.json({
    //             success: true,
    //             message: "Case note updated successfully.",
    //             data: updatedNote,
    //           });
    //     }else{
    //         const casenotes = await prisma.casenotes.create({
    //             data:{
    //                 CaseID: CaseID,
    //                 LogType: LogType,
    //                 ActionType: ActionType,
    //                 Template: Template,
    //                 VisibleExternally: VisibleExternally,
    //                 MinutesSpent: MinutesSpent,
    //                 Note: Note,
    //             }
    //         })
        
    //         return NextResponse.json({
    //             success: true,
    //             message: "Case Created Successfully",
    //             data: casenotes
    //         },{
    //             status: 201
    //         })
    //     }
    // }catch(err){
    //     console.error("🔥 ERROR in Case Note POST:", err); // << log real error
    //     return NextResponse.json({
    //     success: false,
    //     message: "Internal Server Error",
    //     error: err.message,
    //     }, { status: 500 });
    // }
}