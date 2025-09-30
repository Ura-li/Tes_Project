import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { handleActionLogNotifications } from "../../../../lib/actionLogDispatcher";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const caseId = searchParams.get("caseId");

        const actionlog = await prisma.actionLog.findMany({
            where: caseId ? { CaseId: caseId } : undefined,
            include: {
                changedByUser: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "List Data Action Log Information",
            data: actionlog,
        });
    } catch (error) {
        console.error("Error in actionlog GET API:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: error.message,
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const {
            model,
            dataOld,
            dataNew,
            changedBy,
            logDescription,
            ReferenceId,
            CaseId,
        } = await request.json();

        const parsedChangedBy = Number(changedBy);
        const changedById = Number.isFinite(parsedChangedBy) ? parsedChangedBy : null;

        const actionLog = await prisma.ActionLog.create({
            data: {
                CaseID_toActionLog: {
                    connect: {
                        CaseID: CaseId,
                    },
                },
                model,
                dataOld,
                dataNew,
                logDescription,
                ReferenceId,
                ...(changedById && {
                    changedByUser: {
                        connect: {
                            IDUser: changedById,
                        },
                    },
                }),
            },
            include: {
                changedByUser: {
                    select: {
                        IDUser: true,
                        Name: true,
                        Email: true,
                    },
                },
            },
        });

        const caseInfo = await prisma.caseinformation.findUnique({
            where: { CaseID: CaseId },
            select: {
                CaseID: true,
                CaseSubject: true,
                Owner: true,
                CreatedBy: true,
                ownerUser: {
                    select: {
                        IDUser: true,
                        Name: true,
                        Email: true,
                    },
                },
                createdByUser: {
                    select: {
                        IDUser: true,
                        Name: true,
                        Email: true,
                    },
                },
            },
        });

        const { emailDispatched, emailError, caseInfo: enrichedCaseInfo } =
            await handleActionLogNotifications({ actionLog, caseInfo });

        return NextResponse.json({
            success: true,
            message: "ActionLog Created Successfully",
            data: {
                ...actionLog,
                createdById: enrichedCaseInfo?.CreatedBy ?? null,
                createdByUser: enrichedCaseInfo?.createdByUser ?? null,
                ownerUser: enrichedCaseInfo?.ownerUser ?? null,
                ownerId: enrichedCaseInfo?.Owner ?? null,
                CaseId: CaseId,
                emailDispatched,
                ...(emailError ? { emailError } : {}),
            },
        }, {
            status: 201,
        });

    } catch (error) {
        console.error("Error in actionlog POST API:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: error.message,
        }, { status: 500 });
    }
}
