import React from "react";
import { ChartArea,ChartBar, ChartPie } from "./components/sc-chart";
import { Case_table } from "./master_table";
import ApiCustomer from "@/api"
import { parse } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { AppSidebar } from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";

// import { Link } from "react-router";

export default function Landing() {
const [caseData, setCaseData] = React.useState([]);
const [monthlyChartData, setMonthlyChartData] = React.useState([]);

const fetchCaseData = async () => {
  try {
    const response = await ApiCustomer.get("/api/case-information");
    if (response.data.data) {
      setCaseData(response.data.data);
    }
  } catch (err) {
    console.error("Failed fetching:", err);
  }
};

React.useEffect(() => {
  fetchCaseData();
}, []);

React.useEffect(() => {
  // Initialize all 12 months
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("en-US", { month: "long" }),
    open: 0,
    closed: 0,
  }));

  caseData.forEach((caseItem) => {
    // Parse CreatedOn string into Date
    const dateParts = caseItem.CreatedOn.split(",")[0].split("/"); // e.g. "10/5/2025"
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // 0-indexed
    const year = parseInt(dateParts[2]);

    const caseDate = new Date(year, month, day);

    const caseMonthIndex = caseDate.getMonth(); // 0 for Jan, 1 for Feb, etc.

    if (caseItem.CaseStatus.toLowerCase() === "open") {
      months[caseMonthIndex].open += 1;
    } else if (caseItem.CaseStatus.toLowerCase() === "close") {
      months[caseMonthIndex].closed += 1;
    }
  });

  setMonthlyChartData(months);
}, [caseData]);
// console.log(monthlyChartData);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-3">
        <div className="aspect-video rounded-xl bg-muted/50" >
          <ChartArea data={monthlyChartData}></ChartArea>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" > 
        <ChartBar accessibilityLayer data={monthlyChartData}></ChartBar>
          </div>
        <div className="aspect-video rounded-xl bg-muted/50" > 
        <ChartPie></ChartPie>
          </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
        <Case_table></Case_table>
      </div>
    </div>
  );
}
