// services/service-work.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useWorkOrderStore } from "@/hooks/useWorkOrderStore";
import { getUserFromToken } from "@/lib/utils/auth";
// import { TabsServiceWO } from "./service-case";
import { QuickWOInput } from "@/components/quick-wo-input";
import { BtnModalsServiceCatalog } from "@/components/model/sc-modal";
import { NewBookableResourceBooking } from "../services/service-booking";
// ...all your UI imports...
import { useDraft } from "@/components/DraftContext";
import DatePicker from "@/components/date-picker";
import CaseField from "@/components/CaseField";
import { Plus, RotateCw, Lock, KeyRound } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Command, CommandInput } from "@/components/ui/command";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";
import ApiCustomer from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "../../components/ui/input";
import { SearchCommandBlock } from "../../components/sc-select";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsServiceWO } from "./TabsServiceReimagined";

export const ServiceWork = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();

  const workOrder = useWorkOrderStore((s) => s.workOrder);
  const materialOrders = useWorkOrderStore((s) => s.materialOrders);
  const caseInformation = useWorkOrderStore((s) => s.caseInformation);
  const bookings = useWorkOrderStore((s) => s.bookings);
  const ownerWorkOrder = useWorkOrderStore((s) => s.ownerWorkOrder);
  const customerData = useWorkOrderStore((s) => s.customerData);
  const SLA = useWorkOrderStore((s) => s.SLA);
  const WOGeneral = useWorkOrderStore((s) => s.WOGeneral);
  const setSLAField = useWorkOrderStore((s) => s.setSLAField);
  const setWOGeneralField = useWorkOrderStore((s) => s.setWOGeneralField);
  const setSLA = useWorkOrderStore((s) => s.setSLA);
  const setWOGeneral = useWorkOrderStore((s) => s.setWOGeneral);

  // ---- local UI state only ----
  const [openAddMO, setOpenAddMO] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [selectedSiteOption, setSelectedSiteOption] = useState("first");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpCompleted, setFollowUpCompleted] = useState(false);
  const [meterReadAvailable, setMeterReadAvailable] = useState(false);
  const [finishedOnDateCustomer, setFinishedOnDateCustomer] = useState(null);
  const [finishedOnDate, setFinishedOnDate] = useState(null);


  const handleSLAChange =
    (field) =>
    (value) => {
      // Normalize dates to ISO string in store
      const normalized =
        value instanceof Date
          ? value.toISOString()
          : value ?? "";
      setSLAField(field, normalized);
    };

  const handleWOGeneral =
    (field) =>
    (eOrValue) => {
      const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
      setWOGeneralField(field, value);
    };

  const openServiceCatalog = () => {
    if (!caseInformation) return;
    setCaseDetails(caseInformation);
    setOpenAddMO(true);
  };

  // permissions
  const editRoles = ["apo", "admin", "ce", "celead"];
  let canEditapo = false;
  let canaddce = false;
  if (workOrder?.SystemStatus !== "CLOSED_POSTED") {
    canEditapo = editRoles.includes(user?.role);
    canaddce =
      ((user?.role === "ce" || user?.role === "celead") &&
        user?.id === workOrder?.OwnerID) ||
      user?.role === "admin";
  }

  const tabs = [
    { value: "wo_summary", label: "Wo Summary" },
    { value: "wo_bookings", label: "Wo Bookings" },
    { value: "wo_input", label: "Quick WO Input" },
  ];

  const statusEnumToLabelWO = {
    OPEN_UNSCHEDULED: "Open - Unscheduled",
    OPEN_SCHEDULED: "Open - Scheduled",
    REPAIR_PROGRESS: "Open - In Progress",
    OPEN_COMPLETED: "Open - Completed",
    CLOSED_POSTED: "Closed - Posted",
  };

  const statusOptions = Object.entries(statusEnumToLabelWO).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  const validateRequestedDateTimeCustomer = async () => {
    try {
      if (!SLA?.requestedDateTimeCustomer) {
        Swal.fire({
          icon: "warning",
          title: "Requested Date Time is missing",
          text: "Please save Requested Date Time (Customer) before creating a booking.",
        });
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error validating RequestedDateTimeCustomer:", err);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Failed to validate Requested Date Time.",
      });
      return false;
    }
  };

  return (
    <>
      {workOrder?.SystemStatus === "CLOSED_POSTED" && (
        <div className="p-4  text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This work order is <strong>read-only</strong> because it is{" "}
          <strong>Closed</strong>.
        </div>
      )}

      {workOrder?.WOID && caseInformation?.CaseID && <TabsServiceWO />}

      <Card className=" border-0 rounded-none bg-gradient-to-t  dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 dark:to-70% dark:via-6% dark:from-1%">
        <Tabs defaultValue="wo_summary">
          <CardHeader className="flex flex-col gap-3 border-2 w-full p-2 sticky z-30 top-22 bg-white dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-b-slate-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
              <CardTitle className="text-xl pl-2">
                {workOrder?.WOID || "---"}
                <span className="flex items-center text-sm">
                  For Case :{" "}
                  {workOrder?.CaseID && (
                    <Link to={`/app/case/${workOrder.CaseID}`}>
                      {workOrder.CaseID}
                    </Link>
                  )}
                </span>
              </CardTitle>
              <CardTitle className="flex flex-row gap-4 items-center">
                <div className="flex flex-col dark:text-gray-300">
                  <h1 className="text-blue-500 dark:text-white">
                    {ownerWorkOrder?.Name || "---"}
                  </h1>
                  <p className="text-sm font-light ">Owner Ce</p>
                </div>
                <div className="flex flex-col dark:text-gray-300">
                  <h1 className="text-blue-500 dark:text-white">---</h1>
                  <p className="text-sm font-light ">Queue</p>
                </div>
                <div className="flex flex-col dark:text-gray-300">
                  <h1 className="text-blue-500 dark:text-white">
                    {customerData.MainAccount?.Salutation}{" "}
                    {customerData.MainAccount?.FirstName}{" "}
                    {customerData.MainAccount?.LastName}
                  </h1>
                  <p className="text-sm font-light">Contact</p>
                </div>
                <div className="flex flex-col dark:text-gray-300">
                  <Select
                    onValueChange={setSelectedSiteOption}
                    defaultValue="first"
                  >
                    <SelectTrigger className="p-0 text-blue-500 border-none shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="p-0">
                      <SelectGroup className="p-0">
                        <SelectItem value="first" className="p-0">
                          {customerData.SiteAccount?.Company}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-sm font-light">Site Account</p>
                </div>
              </CardTitle>
            </div>
            
            <div>

            <TabsList className="border-t bg-gray-100 w-full flex gap-4 dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-800  dark:border-b-slate-600 dark:rounded-none">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  variant={"simple"}
                  value={tab.value}
                  className="text-sm font-medium dark:border-b-slate-500 dark:text-gray-300"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            </div>
          </CardHeader>

          {/* ========= TAB: WO SUMMARY ========= */}
          <TabsContent value="wo_summary" className="p-2 ">
            {/* ... your existing JSX (unchanged) ... */}
            {/* General + Entitlement + Material Orders + Modal */}
            {/* only change was openServiceCatalog and the handlers we already edited */}
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="rounded-md flex-1/3 dark:bg-gradient-to-tl dark:from-slate-600 dark:via-slate-800 dark:to-slate-800  dark:border-slate-700 dark:border-4">
                <CardHeader>
                  <CardTitle className="text-lg ">General</CardTitle>
                  <hr className="dark:bg-gray-400"/>
                </CardHeader>
                <CardContent className="grid items-center grid-cols-2 lg:grid-cols-4 gap-6">
                  <div
                    className="grid items-center grid-cols-2 col-span-2 p-4 ring-1"
                    hidden
                  >
                    <CaseField label="Incoming Channel" lock>
                      <Input
                        
                        className=""
                        value={WOGeneral.IncomingChannel}
                        onChange={handleWOGeneral("IncomingChannel")}
                      />
                    </CaseField>
                  </div>

                  <CaseField label="Work Order Description" lock span={3}>
                    <Input
                      
                      // value={WOGeneral.WorkOrderDescription}
                      // onChange={handleWOGeneral('WorkOrderDescription')}
                      // placeholder="---"
                      className={"dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"}
                      value={workOrder?.caseinformation?.CaseSubject}
                    />
                  </CaseField>

                  <CaseField label="Work Order Number" lock>
                    <Input
                      
                      className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                      value={WOGeneral.WorkOrderNumber || "---"}
                      readOnly
                    />
                  </CaseField>

                  <CaseField label="System Status" lock={!canaddce}>
                    <SearchCommandBlock
                    className={"dark:bg-transparent dark:ring-1 dark:ring-gray-400"}
                      value={WOGeneral?.SystemStatus}
                      onChange={(val) => handleWOGeneral("SystemStatus")(val)}
                      options={statusOptions}
                    />
                  </CaseField>

                  <CaseField label="Shipment Country" lock={!canaddce}>
                    <SearchCommandBlock
                      className={"dark:bg-transparent dark:ring-1 dark:ring-gray-400"}
                      value={WOGeneral.ShipmentCountry}
                      onChange={handleWOGeneral("ShipmentCountry")}
                      placeholder="---"
                      options={[
                        "USA",
                        "Canada",
                        "Indonesia",
                        "UK",
                        "Germany",
                        "France",
                        "Japan",
                        "China",
                        "India",
                        "Australia",
                        "Brazil",
                      ]}
                      readOnly={!canaddce || user?.role === "apo"}
                    />
                  </CaseField>

                  <CaseField label="Work Order Type" lock>
                    <Input
                      
                      className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                      value={WOGeneral.WorkOrderType || "---"}
                      onChange={handleWOGeneral("WorkOrderType")}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Shipment State" lock={!canaddce}>
                    <Input
                      
                      value={WOGeneral.ShipmentState}
                      onChange={handleWOGeneral("ShipmentState")}
                      placeholder="---"
                      className={"dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"}
                    />
                  </CaseField>

                  <CaseField label="Priority" lock>
                    <Input
                      
                      className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                      value={WOGeneral.Priority || "---"}
                      onChange={handleWOGeneral("Priority")}
                    />
                  </CaseField>

                  <CaseField label="Patner Case Id" lock>
                    <Input
                      
                      className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                      value={"---"}
                      readOnly
                    />
                  </CaseField>

                  <CaseField label="Recommended Resource" lock>
                    <Input
                      className={"dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"}
                      value={WOGeneral.RecommendedResource}
                      onChange={handleWOGeneral("RecommendedResource")}
                      placeholder="---"
                      readOnly
                    />
                  </CaseField>

                  <CaseField label="Patner Status" lock>
                    <Input
                      
                      className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                      value={"---"}
                      readOnly
                    />
                  </CaseField>

                  <CaseField label="Sub-Status" lock={KeyRound}>
                    <Input
                      
                      className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                      value={WOGeneral.SubStatus}
                      onChange={handleWOGeneral("SubStatus")}
                      placeholder="---"
                    />
                  </CaseField>
                  <CaseField label="Work Order Instruction" lock>
                    <Input  placeholder="---" readOnly className={"dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"}/>
                  </CaseField>

                  <Accordion
                    type="single"
                    collapsible
                    className="w-full col-span-2 lg:col-span-4"
                  >
                    <AccordionItem value="more-details" className="pl-5">
                      <AccordionTrigger className="cursor-pointer p-2">
                        More Details . . .
                      </AccordionTrigger>
                      <AccordionContent className={"m-2"}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CaseField label="Bookable Resource Booking" lock>
                            <Input
                              
                              className=""
                              value={WOGeneral.BookableResourceBooking || "---"}
                              readOnly
                            />
                          </CaseField>

                          <CaseField
                            label="Service Offer ID"
                            className={"col-start-1"}
                            lock
                          >
                            <Input
                              
                              className=""
                              value={
                                caseInformation.servicecatalog
                                  ?.Service_offerID || "---"
                              }
                              readOnly
                            />
                          </CaseField>

                          <CaseField
                            label="Service Description"
                            className={"col-start-1"}
                            lock
                          >
                            <Input
                              
                              className=""
                              value={
                                caseInformation.servicecatalog
                                  ?.warranty_services?.Service_description ||
                                "---"
                              }
                              readOnly
                            />
                          </CaseField>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <div className="flex flex-col flex-1 gap-4">
                <Card className="rounded-sm dark:bg-gradient-to-t dark:from-slate-600 dark:via-slate-800 dark:to-slate-800  dark:border-slate-700 dark:border-4">
                  <CardContent className="grid items-center grid-cols-2">
                    <CaseField label="Incoming Channel" lock>
                      <Input
                        
                        className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                        value={WOGeneral.IncomingChannel}
                        onChange={handleWOGeneral("IncomingChannel")}
                      />
                    </CaseField>
                    <CaseField
                      label="Currently Worked By"
                      className={"col-span-3 hidden"}
                    >
                      {" "}
                      <Input
                        
                        className=""
                        value={"---"}
                        readOnly
                        hidden
                      />
                    </CaseField>
                  </CardContent>
                </Card>

                <Card className="rounded-md dark:bg-gradient-to-tr dark:from-slate-600 dark:via-slate-800 dark:to-slate-800  dark:border-slate-700 dark:border-4">
                  <CardHeader>
                    <CardTitle className="text-lg ">
                      Entitlement and Modifier
                    </CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="grid items-center grid-cols-2 gap-5">
                    <CaseField label="Entitlement" lock>
                      <Input
                        
                        className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Offer" lock>
                      <Input
                        
                        className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Warranty Status" lock>
                      <Input
                        className={"dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"}
                        value={
                          workOrder.caseinformation?.otcCodeTable
                            ?.Description || "---"
                        }
                        placeholder="---"
                      />
                    </CaseField>
                    <CaseField label="Authorizing Employee" lock>
                      <Input
                        
                        className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Coverage Window Used" lock>
                      <Input
                        
                        className="dark:text-white dark:border-b-gray-400 dark:rounded-none dark:hover:border-transparent dark:focus:border-transparent dark:focus:rounded-lg dark:p-2"
                        value={"---"}
                        readOnly
                      />
                    </CaseField>

                    <Accordion
                      type="single"
                      collapsible
                      className="w-full col-span-2"
                    >
                      <AccordionItem value="more-details">
                        <AccordionTrigger>More Details . . .</AccordionTrigger>
                        <AccordionContent className={"m-1"}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <CaseField label="Coverage Window Value" lock>
                              <Input
                                
                                className=""
                                value={"---"}
                                readOnly
                              />
                            </CaseField>
                            <CaseField label="Response Time Value" lock>
                              <Input
                                
                                className=""
                                value={"---"}
                                readOnly
                              />
                            </CaseField>
                            <CaseField label="Repair Time Value" lock>
                              <Input
                                
                                className=""
                                value={"---"}
                                readOnly
                              />
                            </CaseField>
                            <CaseField label="Case Priority Index" lock>
                              <Input
                                
                                className=""
                                value={"---"}
                                readOnly
                              />
                            </CaseField>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="flex-col mt-5 dark:bg-gradient-to-bl dark:from-slate-600 dark:via-slate-800 dark:to-slate-700 dark:border-gray-700 dark:border-4">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg ">
                    Material Order Information
                  </CardTitle>
                  <Button
                    variant={"outline"}
                    size="sm"
                    onClick={openServiceCatalog}
                    disabled={!canaddce}
                    className={'cursor-pointer dark:text-white dark:bg-gradient-to-bl dark:from-slate-800 dark:via-slate-600 dark:to-slate-700 dark:border-b-slate-600 dark:to-60% dark:via-100% dark:from-50%'}
                  >
                    <Plus className="mr-2" size={16} /> 
                    Create Material Order
                  </Button>
                </div>
                <hr />
              </CardHeader>
              <CardContent className="grid">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] dark:text-white">Order Number</TableHead>
                      <TableHead className="dark:text-white">Case ID</TableHead>
                      <TableHead className="dark:text-white">Created On</TableHead>
                      <TableHead className="dark:text-white">Order Status</TableHead>
                      <TableHead className="dark:text-white">Order Type</TableHead>
                      <TableHead className="dark:text-white">Ready For Closure</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {materialOrders.length > 0
                      ? materialOrders.map((material) => (
                          <TableRow
                            key={material.MOID}
                            onClick={() =>
                              navigate(`/app/material-order/${material.MOID}`)
                            }
                            className={
                              material.OrderStatus === "New"
                                ? "cursor-pointer bg-green-100 dark:bg-green-600 dark:hover:bg-gray-500 dark:text-gray-300"
                                : material.OrderStatus === "Shipped"
                                ? "cursor-pointer bg-yellow-100 dark:bg-yellow-600 dark:hover:bg-gray-500 dark:text-gray-300"
                                : material.OrderStatus === "Ordered"
                                ? "cursor-pointer bg-blue-100 dark:bg-blue-600 dark:hover:bg-gray-500 dark:text-gray-300"
                                : material.OrderStatus === "Closed"
                                ? "cursor-pointer bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-300"
                                : material.OrderStatus === "BackOrdered"
                                ? "cursor-pointer bg-purple-100 dark:bg-purple-600 dark:hover:bg-gray-500 dark:text-gray-300"
                                : "cursor-pointer bg-red-100 dark:bg-red-600 dark:hover:bg-gray-500 dark:text-gray-300"
                            }
                          >
                            <TableCell className="font-medium">
                              {material.MOID} on {material.WOID}
                            </TableCell>
                            <TableCell>{material.workorder?.CaseID}</TableCell>
                            <TableCell>
                              {formatDate(material.CreatedOn)}
                            </TableCell>
                            <TableCell>{material.OrderStatus}</TableCell>
                            <TableCell>{material.OrderType}</TableCell>
                            <TableCell>
                              {formatDate(material.ReadyForClosureDate)}
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>{" "}
              </CardContent>
            </Card>

            <BtnModalsServiceCatalog
              open={openAddMO}
              setOpen={setOpenAddMO}
              caseDetails={caseDetails}
              serviceCatalogType="wo-add-mo"
              WOID={workOrder?.WOID}
            />
          </TabsContent>

          {/* ========= TAB: WO BOOKINGS ========= */}
          <TabsContent value="wo_bookings" className="p-1">
            <Card className="flex-col rounded-md dark:bg-gradient-to-tl dark:from-slate-600 dark:via-slate-800 dark:to-slate-800  dark:border-slate-700 dark:border-4">
              <CardHeader>
                <CardTitle>WO Bookings</CardTitle>
                <hr className="dark:border-gray-400"/>
              </CardHeader>
              <CardContent
                className={
                  "grid items-center grid-cols-2 lg:grid-cols-6 gap-10"
                }
              >
                <CaseField
                  label={"Requested Date Time (Customer)"}
                  lock={!canEditapo}
                  span={2}
                >
                  <DatePicker
                    variant="icon"
                    value={
                      SLA.requestedDateTimeCustomer
                        ? new Date(SLA.requestedDateTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("requestedDateTimeCustomer")}
                  ></DatePicker>
                </CaseField>

                <CaseField
                  label="Early Start Date Time (Customer)"
                  lock={!canEditapo}
                  span={2}
                >
                  <DatePicker
                    value={
                      SLA.earlyStartDateTimeCustomer
                        ? new Date(SLA.earlyStartDateTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("earlyStartDateTimeCustomer")}
                  ></DatePicker>
                </CaseField>

                <CaseField
                  label={"Guaranteed Fix Time (Customer)"}
                  lock={!canEditapo}
                  span={2}
                >
                  <DatePicker
                    variant="icon"
                    value={
                      SLA.guaranteedFixTimeCustomer
                        ? new Date(SLA.guaranteedFixTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("guaranteedFixTimeCustomer")}
                  ></DatePicker>
                </CaseField>

                <CaseField
                  label="Latest Start Date Time (Customer)"
                  lock={!canEditapo}
                  span={2}
                >
                  <DatePicker
                    value={
                      SLA.latestStartDateTimeCustomer
                        ? new Date(SLA.latestStartDateTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("latestStartDateTimeCustomer")}
                  ></DatePicker>
                </CaseField>

                <CaseField
                  label={"Due Date  (Customer)"}
                  lock={!canEditapo}
                  span={2}
                >
                  <DatePicker
                    variant="icon"
                    value={
                      SLA.dueDateCustomer ? new Date(SLA.dueDateCustomer) : null
                    }
                    onChange={handleSLAChange("dueDateCustomer")}
                  ></DatePicker>
                </CaseField>

                <CaseField
                  label="Active Schedule Date"
                  lock={!canEditapo}
                  span={2}
                >
                  <DatePicker
                    value={
                      SLA.activeScheduleDate
                        ? new Date(SLA.activeScheduleDate)
                        : null
                    }
                    onChange={handleSLAChange("activeScheduleDate")}
                  ></DatePicker>
                </CaseField>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5 rounded-md dark:bg-gradient-to-bl dark:from-slate-600 dark:via-slate-800 dark:to-slate-800  dark:border-slate-700 dark:border-4">
              <span className="ml-5 text-xl font-bold">Booking </span>
              <CardContent className="grid">
                {canEditapo || user.role === "admin" ? (
                  <NewBookableResourceBooking
                    CaseID={caseInformation?.CaseID}
                    WOID={workOrder.WOID}
                    CreatedBy={user.id}
                    RequestedDateTimeCustomer={
                      SLA.requestedDateTimeCustomer
                        ? new Date(SLA.requestedDateTimeCustomer)
                        : null
                    }
                    validateRequestedDateTimeCustomer={
                      validateRequestedDateTimeCustomer
                    }
                  />
                ) : null}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] dark:text-white">Resource</TableHead>
                      <TableHead className="dark:text-white">Account</TableHead>
                      <TableHead className="dark:text-white">Booking</TableHead>
                      <TableHead className="dark:text-white">Reschedule</TableHead>
                      <TableHead className="dark:text-white">Reschedule Reason</TableHead>
                      <TableHead className="dark:text-white">Start Time</TableHead>
                      <TableHead className="dark:text-white">Estimated Arrival Time (ETA)</TableHead>
                      <TableHead className="dark:text-white">Actual Arrival Time</TableHead>
                      <TableHead className="dark:text-white">End Time</TableHead>
                      <TableHead className="dark:text-white">Created On</TableHead>
                      <TableHead className="dark:text-white">Created By</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {bookings.length > 0 ? (
                      bookings.map((booking, index) => (
                        <TableRow
                          key={booking.BookingId || index}
                          onClick={() =>
                            navigate(`/app/bookings/${booking.BookingId}`)
                          }
                          className="cursor-pointer hover:bg-gray-700 dark:text-gray-400"
                        >
                          <TableCell>
                            {booking.bookingDetails?.[0].resource?.Name || "-"}
                          </TableCell>
                          <TableCell>
                            {booking.bookingDetails?.[0].resourceaccount
                              ?.Name || "-"}
                          </TableCell>
                          <TableCell>
                            {booking.BookingStatus?.Description || "-"}
                          </TableCell>
                          <TableCell>
                            {booking.CeScheduleChange ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {booking.ScheduleJeopardy ? "Jeopardy" : "-"}
                          </TableCell>
                          <TableCell>
                            {formatDate(
                              booking.bookingDetails?.[0].StartTimeUserTime
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(
                              booking.bookingDetails?.[0]
                                .EstimatedArrivalTimeUserTime
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(
                              booking.bookingDetails?.[0]
                                .ActualArrivalTimeUserTime
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(
                              booking.bookingDetails?.[0].EndTimeUserTime
                            )}
                          </TableCell>
                          <TableCell>{formatDate(booking.CreatedAt)}</TableCell>
                          {/* <TableCell>{formatDate(booking.StartTimeCustomerTime)}</TableCell>
                                      <TableCell>{formatDate(booking.EstimatedArrivalTimeCustomerTime)}</TableCell>
                                      <TableCell>{formatDate(booking.ActualArrivalTimeCustomerTime)}</TableCell>
                                      <TableCell>{formatDate(booking.EndTimeCustomerTime)}</TableCell>
                                      <TableCell>{formatDate(booking.CreatedAt)}</TableCell> */}
                          <TableCell>
                            {booking.createdByUser?.Name || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ========= TAB: QUICK WO INPUT ========= */}
          {workOrder?.WOID && caseInformation?.CaseID && (
            <TabsContent value="wo_input">
              <QuickWOInput
                WOID={workOrder?.WOID}
                workOrderData={workOrder}
                caseInformation={caseInformation}
                SLA={SLA}
                setSLA={setSLA}
                WOGeneral={WOGeneral}
                setWOGeneral={setWOGeneral}
              />
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </>
  );
};

