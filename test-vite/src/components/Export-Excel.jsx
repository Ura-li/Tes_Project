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
      console.log(json);
      const transformed = json.data.map((c) => ({
        CaseID: c.caseinformation.CaseID,
        site_account: c.caseinformation.site_account?.Company ?? null,
        contact_information: `${
          c.caseinformation.contact_information?.FirstName ?? ""
        } ${c.caseinformation.contact_information?.LastName ?? ""}`,
        asset_information: `${
          c.caseinformation.asset_information?.product_information
            ?.ProductName ?? ""
        } - ${c.caseinformation.asset_information?.SerialNumber ?? ""}`,
        id_gtc: c.caseinformation.id_gtc,
        id_csr: c.caseinformation.id_csr,
        CaseSubject: c.caseinformation.CaseSubject,
        CaseType: c.caseinformation.CaseType,
        KCI_Flag: c.caseinformation.KCI_Flag,
        IncomingChannel: c.caseinformation.IncomingChannel,
        CaseStatus: c.caseinformation.CaseStatus,
        CasePriority: c.caseinformation.CasePriority,
        CustomerSeverity: c.caseinformation.CustomerSeverity,
        CreatedOn: c.caseinformation.CreatedOn,
        CaseClosedDate: c.caseinformation.CaseClosedDate,
        CaseNote: c.caseinformation.CaseNote,
        SymptomCode: c.caseinformation.SymptomCode,
        CaseResolution: c.caseinformation.CaseResolution,
        CreatedBy: c.caseinformation.CreatedBy,
        Owner: c.caseinformation.Owner,
        WorkGround: c.caseinformation.WorkGround,
        casenotes_caseinformation_CaseNoteTocasenotes: c.caseinformation.casenotes_caseinformation_CaseNoteTocasenotes?.Note,
        symptom_codes: null,
        workorder: null,
        createdByUser: `${c.caseinformation.createdByUser?.Name ?? ""} (${
          c.caseinformation.createdByUser?.Email ?? ""
        })`,
        ServiceCatalogID: c.caseinformation.ServiceCatalogID,
        servicecatalog: null,
        global_trade_check: null,
        caseresolution: null,
        OTCCode:  `${ c.caseinformation.otcCodeTable?.OTCCode ?? ""} - ${c.caseinformation.otcCodeTable?.Description ?? ""}`,
        otcCodeTable: null,
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
