import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");

    const where = caseId ? { CaseID: caseId } : undefined;

    const casenotes = await prisma.casenotes.findMany({
      where,
      orderBy: { CreatedOn: "desc" },
      include: {
        createdByUser: {
          select: { IDUser: true, Name: true, Role: true, Email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "List Data Case Notes",
      data: casenotes,
    });
  } catch (e) {
    console.error("ERROR in Case Notes GET:", e);
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
  try {
    // setUserIdProvider(() => getTokenUserId(request));

    const {
      LogType,
      ActionType,
      Template,
      VisibleExternally,
      MinutesSpent,
      Note,
      CaseID,
      CreatedBy
    } = await request.json();

    // Always create a new case note (no longer append)
    const created = await prisma.casenotes.create({
      data: {
        CaseID,
        LogType,
        ActionType,
        Template,
        VisibleExternally,
        MinutesSpent,
        Note,
        CreatedBy,
        
      },
      include: {
        createdByUser: { select: { IDUser: true, Name: true, Role: true, Email: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Case note created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("ERROR in Case Note POST:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
