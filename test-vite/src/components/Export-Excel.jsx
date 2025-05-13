import React from "react";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import ApiCustomer from "@/api";

import * as XLSX from "xlsx";

export const ExportExcel = ({ caseData }) => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      const res = await ApiCustomer.get("/api/case-information");
      const json = res.data
      console.log("JSON DATA FETCH CASE EXCEL : ",json);
      const transformed = json.data.map((c) => ({
        CaseID: c.caseinformation.CaseID,
        site_account: c.caseinformation.contact_information?.site_account?.Company ?? null,
        contact_information: `${
          c.caseinformation.contact_information?.FirstName ?? ""
        } ${c.caseinformation.contact_information?.LastName ?? ""}`,
        asset_information: `${
          c.caseinformation.asset_information?.product_information
            ?.ProductName ?? ""
        } - ${c.caseinformation.asset_information?.SerialNumber ?? ""}`,
        global_trade_status: c.caseinformation.global_trade_check?.global_trade_status,
        gt_override_reason: c.caseinformation.global_trade_check?.gt_override_reason,
        gt_details: c.caseinformation.global_trade_check?.gt_details,
        CaseResolution: c.caseinformation.caseresolution?.caseResolutionCode,
        CaseSubject: c.caseinformation.CaseSubject,
        CaseType: c.caseinformation.CaseType,
        KCI_Flag: c.caseinformation.KCI_Flag,
        IncomingChannel: c.caseinformation.IncomingChannel,
        CaseStatus: c.caseinformation.CaseStatus,
        CasePriority: c.caseinformation.CasePriority,
        CustomerSeverity: c.caseinformation.CustomerSeverity,
        CreatedOn: c.caseinformation.CreatedOn,
        CaseClosedDate: c.caseinformation.CaseClosedDate,
        SymptomCode: c.caseinformation.SymptomCode,
        CaseResolution: c.caseinformation.CaseResolution,
        casenotes_caseinformation_CaseNoteTocasenotes: c.caseinformation.casenotes_caseinformation_CaseNoteTocasenotes?.Note,
        symptom_codes: null,
        workorder: c.caseinformation.workorder[0]?.WOID,
        createdByUser: `${c.caseinformation.createdByUser?.Name ?? ""} (${
          c.caseinformation.createdByUser?.Email ?? ""
        })`,
        servicecatalog: null,
        caseresolution: null,
        OTCCode:  `${ c.caseinformation.otcCodeTable?.OTCCode ?? ""} - ${c.caseinformation.otcCodeTable?.Description ?? ""}`,
        ProblemDescription: c.caseinformation.ProblemDescription,
        CaseProductNote: c.caseinformation.CaseProductNote,
      }));
      setCases(transformed);
    };

    fetchCases();
  }, []);

  const exportToExcel = () => {
    console.log(cases);
    const worksheet = XLSX.utils.json_to_sheet(cases);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");
    XLSX.writeFile(workbook, "Case_Information.xlsx");
  };
  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#2c3e50" }}>Export Asset Information to Excel</h2>
      <button
        onClick={exportToExcel}
        style={{
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          padding: "0.7rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "0.3rem",
          cursor: "pointer",
        }}
        aria-label="Export data to Excel"
      >
        Export to Excel
      </button>
    </div>
  );
};
