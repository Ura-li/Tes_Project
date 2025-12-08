// services/service-materialApo.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchCommandBlock } from "@/components/sc-select";
import { Lock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { TabsServiceMO } from "./service-case";
import DatePicker from "@/components/date-picker";
import { useDraft } from "@/components/DraftContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CaseField from "@/components/CaseField";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { useMaterialOrderStore } from "@/hooks/useMaterialOrderStore";
import { TabsServiceMO } from "./TabsServiceReimagined";
import { CardDescription } from "../../components/ui/card";

export const RMA_STATUS_OPTIONS = [
  { value: "InOutCE", label: "In & On Hand CE" },
  { value: "ReturnLogistic", label: "Return via Logistic" },
  { value: "ReturnDHL", label: "Return to DHL/SC" },
  { value: "FullCharge", label: "Full Charge" },
];

export const ServiceMaterialApo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateDraft } = useDraft();
  const materialOrder = useMaterialOrderStore((s) => s.materialOrder);
  const lineItems = useMaterialOrderStore((s) => s.lineItems);
  const materialInfo = useMaterialOrderStore((s) => s.materialInfo);
  const updatedLineItems = useMaterialOrderStore((s) => s.updatedLineItems);
  const setMaterialInfoField = useMaterialOrderStore(
    (s) => s.setMaterialInfoField
  );
  const setLineItemStatus = useMaterialOrderStore(
    (s) => s.setLineItemStatus
  );
  // ----- permissions -----
  const allowedRoles = ["apo", "lg", "admin"];
  let canEditapo = false;

  if (
    materialOrder?.OrderStatus === "Closed" ||
    materialOrder?.OrderStatus === "Cancelled"
  ) {
    canEditapo = false;
  } else {
    canEditapo = allowedRoles.includes(user?.role);
  }

  const tabs = [
    { value: "mo_info", label: "Mo Information"},
    { value: "mo_items", label: "Material Order Line Items"},
    { value: "entitlement_sla", label: "Entitlement & SLA", hidden: true },
    { value: "billing_quotation", label: "Billing & Quotation", hidden: true },
    { value: "notes_attaechment", label: "Notes & Attachment", hidden: true },
  ];

  // ----- helpers for form updates -----
  const handleInfoChange =
    (field) => (valueOrEvent) => {
      const value =
        valueOrEvent && valueOrEvent.target !== undefined
          ? valueOrEvent.target.value
          : valueOrEvent;
      setMaterialInfoField(field, value ?? "");
    };

  const handleDateChange =
    (field) => (date) => {
      setMaterialInfoField(field, date ? date.toISOString() : null);
    };

  const handleStatusChange = (lineItemID, newStatus) => {
    setLineItemStatus(lineItemID, newStatus);
  };

  // ----------------- RENDER -----------------
  return (
    <div>
      {/* Status banners */}
      {materialOrder?.OrderStatus === "Closed" ? (
        <div className="p-4 my-2 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This material order is <strong>read-only</strong> because it is{" "}
          <strong>Closed</strong>.
        </div>
      ) : materialOrder?.OrderStatus === "Cancelled" ? (
        <div className="p-4 my-2 text-red-700 bg-red-100 border-l-4 border-red-500">
          This material order is <strong>read-only</strong> because it is{" "}
          <strong>Cancelled</strong>.
        </div>
      ) : null}

      <TabsServiceMO />

      <Card className="mt-2 rounded-none">
        <CardContent className="p-0">
          <Tabs defaultValue="mo_info">
            {/* Header card */}
            <Card className="flex flex-row gap-3 p-4 h-25">
              <CardHeader>
                <CardTitle className="text-xl">
                  {materialOrder?.MOID} for {materialOrder?.WOID}
                </CardTitle>
                <CardDescription>
                  Material Order Details and Management Total Line Items:{" "}
                  <span className="font-semibold">{lineItems.length}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between w-full">
                <h1>{materialOrder?.Description}</h1>
                {/* <div>
                  <span className="font-semibold">Order Status:</span>
                  {lineItems.map((items) => (
                    <div
                      key={items.lineItemID}
     
                    >
                    <SearchCommandBlock
                      value={items.Status}
                      onChange={(newStatus) =>
                            handleStatusChange(
                              items.LineItemID,
                              newStatus
                            )
                          }
                      placeholder="Select status"
                      options={[
                        { value: "New", label: "New" },
                        { value: "Ordered", label: "Ordered" },
                        { value: "Shipped", label: "Shipped" },
                        { value: "BackOrdered", label: "BackOrdered" },
                        { value: "Closed", label: "Closed" },
                        { value: "Cancelled", label: "Cancelled" },
                      ]}
                      disabled={!canEditapo}
                    />
                </div>
              ))}
                </div> */}
              </CardContent>
            </Card>
              {/* <div className=" border-t bg-gray-50 w-full overflow-x-auto ">
              <TabsList className="sm:w-full w-fit flex gap-4 h-fit p-0  dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-800  dark:border-b-slate-600 dark:rounded-none">
                {tabs.map((tab, index) =>
                  tab.component ? (
                    <div key={index}>{tab.component}</div>
                  ) : (
                    <TabsTrigger
                      key={index}
                      variant="simple"
                      value={tab.value}
                      disabled={tab.disable}
                      hidden={tab.hidden}
                      className="text-sm font-medium dark:border-b-slate-500 dark:text-gray-300"
                    >
                      {tab.label}
                    </TabsTrigger>
                  )
                )}
              </TabsList>
            </div> */}

            {/* MAIN CONTENT */}
            <div className="p-2">
              {/* ========== ORDER INFO ========== */}
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                  <hr />
                </CardHeader>
                <CardContent className="grid items-center grid-cols-2 md:grid-cols-4 gap-5">
                  <CaseField label={"Case ID"} lock>
                    <Input
                      type="text"
                      value={materialOrder?.workorder?.CaseID || ""}
                      readOnly
                    />
                  </CaseField>

                  <CaseField label={"Resource Name"} lock>
                    <Input
                      type="text"
                      value={
                        materialOrder?.workorder?.bookings?.[0]
                          ?.bookingDetails?.[0]?.ResourceId || ""
                      }
                      readOnly
                    />
                  </CaseField>

                  <CaseField label={"Contact"} lock>
                    <Input
                      type="text"
                      value={
                        materialOrder?.workorder?.caseinformation
                          ?.contact_information
                          ? `${materialOrder.workorder.caseinformation.contact_information.Salutation} ${materialOrder.workorder.caseinformation.contact_information.FirstName} ${materialOrder.workorder.caseinformation.contact_information.LastName}`
                          : ""
                      }
                      readOnly
                    />
                  </CaseField>

                  <CaseField label={"Service Offer ID"} lock>
                    <Input
                      type="text"
                      value={
                        materialOrder?.workorder?.serviceCatalog
                          ?.warranty_services?.Service_offerID || ""
                      }
                      readOnly
                    />
                  </CaseField>

                  <CaseField label={"Work Order"} lock>
                    <Input
                      type="text"
                      value={materialOrder?.WOID || ""}
                      readOnly
                    />
                  </CaseField>

                  <CaseField label={"Service Description"} lock>
                    <Input
                      type="text"
                      value={
                        materialOrder?.workorder?.serviceCatalog
                          ?.warranty_services?.Service_description || ""
                      }
                      readOnly
                    />
                  </CaseField>

                  <CaseField label={"Order Number"} lock>
                    <Input
                      type="text"
                      value={materialOrder?.MOID || ""}
                      readOnly
                    />
                  </CaseField>

                  <CaseField
                    label={"Sales Order Number"}
                    star={user?.role === "apo"}
                    lock={!canEditapo}
                  >
                    <Input
                      type="text"
                      value={materialInfo.SalesOrderNumber}
                      placeholder="---"
                      onChange={handleInfoChange("SalesOrderNumber")}
                    />
                  </CaseField>

                  <CaseField label={"Order Type"} lock>
                    <Input
                      type="text"
                      value={materialOrder?.OrderType || ""}
                      readOnly
                    />
                  </CaseField>

                  <CaseField
                    label="RMA Number"
                    star={user?.role === "apo"}
                    lock={!canEditapo}
                  >
                    <Input
                      variant="invisible"
                      placeholder="---"
                      value={materialInfo.RMANumber}
                      onChange={handleInfoChange("RMANumber")}
                    />
                  </CaseField>

                  <CaseField
                    label="RMA Status"
                    lock={!canEditapo}
                    star={user?.role === "lg"}
                  >
                    <SearchCommandBlock
                      value={materialInfo.RMAStatus}
                      onChange={handleInfoChange("RMAStatus")}
                      placeholder="Select RMA Status"
                      options={RMA_STATUS_OPTIONS}
                    />
                  </CaseField>

                  <CaseField
                    label={"ETA Delivery Required Date (Customer Time)"}
                    lock={!canEditapo}
                    star={user?.role === "apo"}
                  >
                    <DatePicker
                      value={
                        materialInfo.DeliveryRequestedDate
                          ? new Date(materialInfo.DeliveryRequestedDate)
                          : null
                      }
                      onChange={handleDateChange("DeliveryRequestedDate")}
                    />
                  </CaseField>

                  <CaseField
                    label={"Part on Hand CE Date"}
                    star={user?.role === "lg"}
                    lock={!canEditapo}
                  >
                    <DatePicker
                      value={
                        materialInfo.CollectionRequestedDate
                          ? new Date(materialInfo.CollectionRequestedDate)
                          : null
                      }
                      onChange={handleDateChange("CollectionRequestedDate")}
                    />
                  </CaseField>

                  <CaseField
                    label={"Part OUT CE Ready For Closure Date"}
                    star={user?.role === "lg"}
                    lock={!canEditapo}
                  >
                    <DatePicker
                      value={
                        materialInfo.ReadyForClosureDate
                          ? new Date(materialInfo.ReadyForClosureDate)
                          : null
                      }
                      onChange={handleDateChange("ReadyForClosureDate")}
                    />
                  </CaseField>

                  <CaseField
                    label={"AWB no. in"}
                    star={user?.role === "lg"}
                    lock={!canEditapo}
                  >
                    <Input
                      variant="invisible"
                      placeholder="---"
                      value={materialInfo.AWB_InCode || ""}
                      onChange={handleInfoChange("AWB_InCode")}
                    />
                  </CaseField>

                  <CaseField
                    label={"AWB no. out"}
                    star={user?.role === "lg"}
                    lock={!canEditapo}
                  >
                    <Input
                      variant="invisible"
                      placeholder="---"
                      value={materialInfo.AWB_OutCode || ""}
                      onChange={handleInfoChange("AWB_OutCode")}
                    />
                  </CaseField>

                  {/* Accordion more detail */}
                  <Accordion
                    className="col-span-2 md:col-span-4"
                    type="single"
                    collapsible
                  >
                    <AccordionItem value="more-detail">
                      <AccordionTrigger>More Detail . . .</AccordionTrigger>
                      <AccordionContent className="p-2">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <CaseField label={"Notification Number"} icon>
                            <Input
                              type="text"
                              value={materialOrder?.NotificationNumber || "---"}
                              readOnly
                            />
                          </CaseField>
                          <CaseField label={"Shipping Priority"} icon>
                            <Input
                              type="text"
                              value={materialOrder?.ShippingPriority || "---"}
                              readOnly
                            />
                          </CaseField>
                          <CaseField label={"Promo Code"} icon>
                            <Input type="text" value={"---"} readOnly />
                          </CaseField>
                          <CaseField label={"Parent MO"} icon>
                            <Input
                              type="text"
                              value={materialInfo.parentMO || "---"}
                              readOnly
                            />
                          </CaseField>

                          <CaseField label={"Customer Induced Damage"} icon>
                            <Input
                              type="text"
                              value={
                                materialOrder?.CustomerInducedDamage
                                  ? "Yes"
                                  : "No"
                              }
                              readOnly
                            />
                          </CaseField>
                          <CaseField label={"BCP Order"} icon>
                            <Input
                              type="text"
                              value={materialInfo.isBCPOrder ? "Yes" : "No"}
                              readOnly
                            />
                          </CaseField>
                          <CaseField
                            label={"Accidental Damage Protection"}
                            icon
                          >
                            <Input
                              type="text"
                              value={
                                materialOrder?.AccidentalDamageProtection
                                  ? "Yes"
                                  : "No"
                              }
                              readOnly
                            />
                          </CaseField>
                          <CaseField label={"Material Order Type"} icon>
                            <Input
                              type="text"
                              value={materialOrder?.MaterialOrderType || "---"}
                              readOnly
                            />
                          </CaseField>
                          <CaseField label={"Defective Media Retention"} icon>
                            <Input
                              type="text"
                              value={
                                materialOrder?.DefectiveMediaRetention
                                  ? "Yes"
                                  : "No"
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

              {/* Booking summary table */}
              <Card className="flex-col mt-5">
                <span className="ml-5 text-xl font-bold">Booking</span>
                <CardContent className="grid">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          Order Number
                        </TableHead>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Order Type</TableHead>
                        <TableHead>Ready For Closure</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {materialOrder && (
                        <TableRow
                          key={materialOrder.MOID}
                          className={
                            materialOrder.OrderStatus === "New"
                              ? "cursor-pointer bg-green-100"
                              : materialOrder.OrderStatus === "Shipped"
                              ? "cursor-pointer bg-yellow-100"
                              : materialOrder.OrderStatus === "Ordered"
                              ? "cursor-pointer bg-blue-100"
                              : materialOrder.OrderStatus === "Closed"
                              ? "cursor-pointer bg-gray-100"
                              : materialOrder.OrderStatus === "BackOrdered"
                              ? "cursor-pointer bg-purple-100"
                              : "cursor-pointer bg-red-100"
                          }
                        >
                          <TableCell>{materialOrder.MOID}</TableCell>
                          <TableCell>
                            {materialOrder.workorder?.CaseID}
                          </TableCell>
                          <TableCell>
                            {formatDate(materialOrder.CreatedOn)}
                          </TableCell>
                          <TableCell>{materialOrder.OrderStatus}</TableCell>
                          <TableCell>{materialOrder.OrderType}</TableCell>
                          <TableCell>
                            {formatDate(materialOrder.ReadyForClosureDate)}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Material Order Line Items */}
              <Card className="flex-col mt-7">
                <span className="ml-5 text-xl font-bold">
                  Material Order Line Items
                </span>
                <CardContent className="grid">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          Mo Line Item
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>ATP</TableHead>
                        <TableHead>Part No</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Promise</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Tracking</TableHead>
                        <TableHead>Ship</TableHead>
                        <TableHead>Storage</TableHead>
                        <TableHead>Offered</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {lineItems.map((lineitem) => (
                        <TableRow
                          key={lineitem.LineItemID}
                          onClick={() =>
                            navigate(`/app/mo_detail/${lineitem.LineItemID}`)
                          }
                          className={
                            lineitem.Status === "New"
                              ? "cursor-pointer bg-green-100"
                              : lineitem.Status === "Shipped"
                              ? "cursor-pointer bg-yellow-100"
                              : lineitem.Status === "Ordered"
                              ? "cursor-pointer bg-blue-100"
                              : lineitem.Status === "Closed"
                              ? "cursor-pointer bg-gray-100"
                              : lineitem.Status === "BackOrdered"
                              ? "cursor-pointer bg-purple-100"
                              : "cursor-pointer bg-red-100"
                          }
                        >
                          <TableCell className="font-medium">
                            {lineitem.MOID} - {lineitem.LineNumber}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={lineitem.Status}
                              onValueChange={(newStatus) =>
                                handleStatusChange(
                                  lineitem.LineItemID,
                                  newStatus
                                )
                              }
                              disabled={!canEditapo}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Ordered">Ordered</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="BackOrdered">
                                  BackOrdered
                                </SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{lineitem.ATPStatus}</TableCell>
                          <TableCell>{lineitem.PartNumber}</TableCell>
                          <TableCell>{lineitem.Description}</TableCell>
                          <TableCell>---</TableCell>
                          <TableCell>---</TableCell>
                          <TableCell>---</TableCell>
                          <TableCell>---</TableCell>
                          <TableCell>---</TableCell>
                          <TableCell>---</TableCell>
                          <TableCell>---</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Other tabs remain the same as your existing JSX */}
            <TabsContent value="mo_info" />
            {/* ... keep your other TabsContent (mo_items, entitlement_sla, etc.) as-is ... */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

