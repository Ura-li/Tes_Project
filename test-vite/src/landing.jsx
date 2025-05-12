import {useState, useEffect, useMemo} from "react";
import { ChartArea,ChartBar, ChartPie } from "./components/sc-chart";
import { Case_table } from "./master_table";
import ApiCustomer from "@/api"
import { parse } from "date-fns";
import { Week } from "react-day-picker";
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
const [caseData, setCaseData] = useState([]);
const [monthlyChartData, setMonthlyChartData] = useState([]);
const [weeklyChartData, setWeeklyChartData] = useState([])
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

useEffect(() => {
  fetchCaseData();
}, []);

useEffect(() => {
  // Initialize all 12 months
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("en-US", { month: "long" }),
    open: 0,
    closed: 0,
  }));
  // const days = Array.from({ length: 7 }, (_, i) => ({
  //   week: new Date(0, i).toLocaleString("en-US", { weekday: "short" }),
  //   open: 0,
  //   closed: 0,
  // }));
    console.log("month",months);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => ({
      week: day,
      open: 0,
      closed: 0,
    }));
    console.log("days",days);

  const currentYear = new Date().getFullYear();

  caseData.forEach((caseItem) => {
    // Parse CreatedOn string into Date
    const dateParts = caseItem.CreatedOn.split(",")[0].split("/"); // e.g. "10/5/2025"
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // 0-indexed
    const year = parseInt(dateParts[2]);

    const caseDate = new Date(year, month, day);

    const caseMonthIndex = caseDate.getMonth(); // 0 for Jan, 1 for Feb, etc.
   const weekday = caseDate.toLocaleDateString("en-US", { weekday: "short" });
   const index = days.findIndex((d) => d.week === weekday);
   if (caseItem.CaseStatus.toLowerCase() === "open") {
     months[caseMonthIndex].open += 1;
     if (index !== -1)  days[index].open +=1 ;
    } else if (caseItem.CaseStatus.toLowerCase() === "close") {
      months[caseMonthIndex].closed += 1;
      if (index !== -1)  days[index].closed +=1 ;
    }
    
  });
  setWeeklyChartData(days);
  setMonthlyChartData(months);
}, [caseData]);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-3">
        <div className="aspect-video rounded-xl bg-muted/50" >
          <ChartArea data={monthlyChartData}></ChartArea>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" > 
        <ChartBar accessibilityLayer data={weeklyChartData}></ChartBar>
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
