import React from "react";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import ApiCustomer from "@/api";
import * as XLSX from "xlsx";
import { Button } from "./ui/button";

export const ExportExcel = ({ caseData }) => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      const res = await ApiCustomer.get("/api/case-information");
      const json = res.data
      console.log("JSON DATA FETCH CASE EXCEL : ",json);
      const transformed = json.data.map((c) => {
        // Get accessories string
        const accessories =
          c.caseinformation.accessory?.map((a) => a.Accessories).join(", ") || "N/A";

        // Calculate range in days between CreatedOn and CaseClosedDate
        let range = "N/A";
        if (
          c.caseinformation.CaseStatus === "Close" &&
          c.caseinformation.CreatedOn &&
          c.caseinformation.CaseClosedDate
        ) {
          const created = new Date(c.caseinformation.CreatedOn);
          const closed = new Date(c.caseinformation.CaseClosedDate);
          const diffTime = Math.abs(closed - created);
          range = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " days";
        }

        return {
          CaseID: c.caseinformation.CaseID,
          CaseID_Manual: c.caseinformation.CaseID_Manual,
          ProductTower: c.caseinformation.asset_information?.product_information?.product_type?.ProductTower,
          // Case_Notes:c.caseinformation.casenotes_caseinformation_CaseNoteTocasenotes?.Note,
          Case_Notes:c.caseinformation.CaseProductNote,
          ProductGroup: c.caseinformation.asset_information?.product_information?.product_type?.ProductGroup,     
          ProductLine: c.caseinformation.asset_information?.product_information?.ProductLine,     
          ProductType: c.caseinformation.asset_information?.product_information?.product_type?.ProductType,
          ProductNumber: c.caseinformation.asset_information?.ProductNumber,
          ProductName: c.caseinformation.asset_information?.product_information?.ProductName,
          SerialNumber: c.caseinformation.asset_information?.SerialNumber,
          WarrantyStatus: c.caseinformation.otcCodeTable?.Description,
          Company_Name: "PT. JAVA ABADI GEMILANG",
          CE_Name: c.caseinformation.workorder?.[0]?.owner?.Name,
          CaseType: c.caseinformation.CaseType,
          CaseStatus: c.caseinformation.CaseStatus,
          Customer_Company: c.caseinformation.contact_information?.site_account?.Company ?? null, 
          Customer_Name: `${
            c.caseinformation.contact_information?.FirstName ?? ""
          } ${c.caseinformation.contact_information?.LastName ?? ""}`,
          Customer_City : c.caseinformation.contact_information?.City,
          Received_Date: c.caseinformation.CreatedOn,
          Closed_Date: c.caseinformation.CaseClosedDate,
          //  NEW COLUMNS
          Accessories: accessories,
          DurationDays: range,
        };
      });
      setCases(transformed);
    };

    fetchCases();
  }, []);

  const labelCase = cases.map((items) => ({
    "ID Case" : items.CaseID,
    "Case ID Manual" : items.CaseID_Manual,
    "Case Note" : items.Case_Notes,
    "Product Tower" : items.ProductTower,
    "Product Group" : items.ProductGroup,
    "Product Line"  : items.ProductLine,
    "Product Type" : items.ProductType,
    "Product No" : items.ProductNumber,
    "Product Name" : items.ProductName,
    "Serial No" : items.SerialNumber,
    "Warranty Status" : items.WarrantyStatus,
    "Company Name" : items.Company_Name,
    "CE Name" : items.CE_Name,
    "Case Type" : items.CaseType,
    "Case Status" : items.CaseStatus,
    "Customer Company" : items.Customer_Company,
    "Customer Name" : items.Customer_Name,
    "Customer City" : items.Customer_City,  
    "Received Date" : new Date (items.Received_Date),
    "Closed Date" : new Date (items.Closed_Date),
    "Duration" : items.DurationDays
  }))

  const exportToExcel = () => {
    console.log(cases);
    const worksheet = XLSX.utils.json_to_sheet(labelCase);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");
    XLSX.writeFile(workbook, "Case Information.xlsx");
  };
  return (
    <div>
      <Button
        onClick={exportToExcel}
        className={"bg-blue-400 text-white hover:bg-blue-300 cursor-pointer"} 
      >
        Export to Excel
      </Button>
    </div>
  );
};

export const ExportExcelPart = ({}) => {
  const [MoData, setMoData] = useState([]);

  useEffect(() => {
    const fetchMo = async () => {
      const res = await ApiCustomer.get("/api/mo-detaill");
      const json = res.data
      console.log("Json MO Data : ", json)
      const transformed = json.data.map((m) => {
      return {
       Moid: m.MOID,
       PartNumber: m.materialorderlineitems?.[0]?.PartNumber,
       Description: m.materialorderlineitems?.[0]?.Description,
       SalesOrderNumber: m.SalesOrderNumber,
       RMANumber: m.RMANumber,
       OrderStatus: m.OrderStatus,
       AWB_InCode: m.AWB_InCode,
       AWB_OutCode: m.AWB_OutCode,
       ETA_Date : m.DeliveryRequestedDate ? new Date(m.DeliveryRequestedDate) : null
      }
      })
      setMoData(transformed)
    }

    fetchMo();
  }, []);

  const labelPart = MoData.map((items) => ({
    "ID Material Order": items.Moid,
    "Part Number" : items.PartNumber,
    "Description" : items.Description,
    "Sales Order Number" : items.SalesOrderNumber,
    "RMA Number" : items.RMANumber,
    "Order Status" : items.OrderStatus,
    "AWB In Code" : items.AWB_InCode,
    "AWB Out Code" : items.AWB_OutCode,
    "ETA Date" : items.ETA_Date
  }))

  const exportToExcelPart = () => {
    const worksheet = XLSX.utils.json_to_sheet(labelPart)
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sparepart");
    XLSX.writeFile(workbook, "Sparepart.xlsx")
  };
  return (
    <div>
      <Button
        onClick={exportToExcelPart}
        className={"bg-blue-400 text-white hover:bg-blue-300 cursor-pointer"}
      >
        Export to Excel
      </Button>
    </div>
  )
}