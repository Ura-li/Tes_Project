import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request) {
    try{
        //ambil parameter
        const { searchParams } = new URL(request.url);
        const caseId = searchParams.get("CaseID");

        const caseInfo = await prisma.caseinformation.findUnique({
            where: {
                CaseID: caseId,
            },
            include: {
                global_trade_check: true, // ambil data GTC yang terkait
            },
        });


        return NextResponse.json(
            {
                success: true,
                status: 200,
                message: "List Data Global Trade Check",
                data: gtc
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

export async function PATCH(request) {
    try {
      const {
        global_trade_status,
        embargoed_country,
        gt_override_reason,
        gt_details,
        screening_id,
        gt_active_listening,
        gt_al_comments,
        CaseID,
      } = await request.json();
  
      if (!CaseID) {
        return NextResponse.json({
          success: false,
          message: "Case ID is required.",
        }, { status: 400 });
      }
  
      // Cek apakah case ada
      const existingCase = await prisma.caseinformation.findUnique({
        where: { CaseID },
        include: {
          global_trade_check: true, // include relasi untuk cek id_gtc
        },
      });
  
      if (!existingCase) {
        return NextResponse.json({
          success: false,
          message: "Case ID not found.",
        }, { status: 404 });
      }
  
      let gtcData = {
        global_trade_status,
        embargoed_country,
        gt_override_reason,
        gt_details,
        screening_id,
        gt_active_listening,
        gt_al_comments
      };
  
      if (existingCase.id_gtc) {
        // Jika case sudah punya id_gtc, lakukan update
        await prisma.global_trade_check.update({
          where: { id_gtc: existingCase.id_gtc },
          data: gtcData,
        });
  
        return NextResponse.json({
          success: true,
          message: "Global Trade Check updated successfully.",
        }, { status: 200 });
  
      } else {
        // Jika belum punya, buat baru dan update caseinformation
        const newGtc = await prisma.global_trade_check.create({
          data: gtcData
        });
  
        await prisma.caseinformation.update({
          where: { CaseID },
          data: {
            id_gtc: newGtc.id_gtc, // langsung simpan ID baru
          }
        });
  
        return NextResponse.json({
          success: true,
          message: "Global Trade Check created and linked successfully.",
        }, { status: 201 });
      }
    } catch (err) {
      console.error("🔥 ERROR in Global Trade Check PATCH:", err);
      return NextResponse.json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      }, { status: 500 });
    }
  }