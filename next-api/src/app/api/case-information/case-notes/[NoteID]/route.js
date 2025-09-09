import { NextResponse } from "next/server";
import prisma, { setUserIdProvider } from "../../../../../../prisma/client";
import { getTokenUserId } from "@/app/middleware/auth";
export async function GET(request, {params}) {
    //get params id
    const url = new URL(request.url)
    const noteID = parseInt(url.pathname.split("/").pop())

    if (isNaN(noteID)) {
        return NextResponse.json(
            { success: false, message: "Invalid Note ID" },
            { status: 400 }
        );
    }

    //get detail 
    const casenotes = await prisma.casenotes.findUnique({
        where: {
            NoteID: noteID,
        },
        include: {
            caseinformation_casenotes_CaseIDTocaseinformation: true,
            createdByUser: { select: { IDUser: true, Name: true, Role: true, Email: true } },
        }
    })

    if(!casenotes){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Case Note Not Found!",
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
            message: "Detail Data Case Note",
            data: casenotes,
        },
        {
            status: 200,
        }
    );
}


export async function  PATCH(request, { params }) {
    setUserIdProvider(() => getTokenUserId(request))
    const noteID = parseInt(params.noteID);
    const { Note, append = false, ...rest } = await request.json();

    // Get existing note first
    const existing = await prisma.casenotes.findUnique({
        where: { NoteID: noteID },
    });

    const updatedNote = append && existing?.Note
    ? `${existing.Note}\n${Note}` // append with newline
    : Note;

    const {
        LogType,
        ActionType,
        Template,
        VisibleExternally,
        MinutesSpent,
        CaseID
    } = await request.json()

    const casenotes = await prisma.casenotes.update({
        where: {
            NoteID: noteID
        },
        data : {
            CaseID: CaseID,
            LogType: LogType,
            ActionType: ActionType,
            Template: Template,
            VisibleExternally: VisibleExternally,
            MinutesSpent: MinutesSpent,
            Note: updatedNote,
        }
    })
    return NextResponse.json(
        {
            success: true,
            message: "Case Note Information Updated!",
            data: casenotes,
        },
        {
            status: 200,
        }
    )
}
