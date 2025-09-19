import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectBarRelated } from "../../components/sc-select";
import { Car, Lock } from "lucide-react";
import { CalendarDays } from "lucide-react";
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
import { TabsServiceMO } from "./service-case";
import Swal from "sweetalert2";

import { useParams, useNavigate } from "react-router";
import ApiCustomer from "@/api";
import DatePicker from "../../components/date-picker";
import { Case } from "@/pages/Case";
import { useDraft } from "../../components/DraftContext";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import CaseField from "@/components/CaseField";
import { useAuth } from "@/context/auth-context";

export const ServiceMaterialApo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { moid } = useParams();
  const {updateDraft } = useDraft(); // Access updateDraft from the DraftContext
  const [materialOrders, setMaterialOrders] = useState([]);
  const [materialLineOrders, setMaterialLineOrders] = useState([]);
  const [MaterialOrder, setMaterialOrder] = useState([]);
  const [moForm, setMoForm] = useState({
    SalesOrderNumber: "",
    RMANumber: ""
  })
  const [materialOrderInformation, setMaterialOrderInformation] = useState({
    MOID: "",
    orderNumber: "",
    serviceOfferID: "",
    serviceDescription: "",
    orderType: "",
    shippingPriority: "",
    readyForClosureDate: "",
    caseID: "",
    contact: null,
    deliveryRequestedDateCustomerTime: "",
    collectionRequestedDate: "",
    promoCode: "",
    customerInducedDamage: false,
    accidentalDamageProtection: false,
    defectiveMediaRetention: false,
    notificationNumber: "",
    salesOrderNumber: "",
    resourceName: "",
    resourceId: "",
    workOrder: null,
    parentMO: null,
    isBCPOrder: false,
    materialOrderType: "",
    eotOrderNumber: "",
  });
  const [deliveryRequiredDate, setDeliveryRequiredDate] = useState(null);
  const [collectionRequestedDate, setCollectionRequestedDate] = useState(null);
  const [readyForClosureDate, setReadyForClosureDate] = useState(null);
  const [error, setError] = useState(null);

  const [updatedLineItems, setUpdatedLineItems] = useState({}); 

  const handleStatusChange = (lineItemID, newStatus) => {
    setUpdatedLineItems((prev) => ({
      ...prev,
      [lineItemID]: newStatus
    }));
    console.log("Handle Status Change ",lineItemID)
    console.log("Handle Status Change ",newStatus)
  };


  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // Get 'YYYY-MM-DDTHH:MM'
  };

  const handleMoFormChange = (field) => (e) => {
  const value = e.target.value;
  setMoForm((prev) => ({ ...prev, [field]: value }));
};


  // Fetch Material Order
  const fetchMaterialOrder = async () => {
    try {
      const res = await ApiCustomer.get(`/api/material-order/${moid}`);
      const data = res.data.data;

      setMaterialOrders(data);
    
      // Save the material order information to the state
      setMaterialOrderInformation({
        MOID: data.MOID || "",
        orderNumber: data.MOID || "",
        serviceOfferID: data.ServiceOfferID || "",
        serviceDescription: data.ServiceDescription || "",
        orderType: data.OrderType || "",
        shippingPriority: data.ShippingPriority || "",
        readyForClosureDate: formatDateForInput(data.ReadyForClosureDate || ""),
        caseID: data.workorder?.CaseID || "",
        contact: data.workorder?.caseinformation?.contact_information
          ? `${data.workorder.caseinformation.contact_information.FirstName} ${data.workorder.caseinformation.contact_information.LastName}`
          : null,
        deliveryRequestedDateCustomerTime: formatDateForInput(
          data.DeliveryRequestedDate || ""
        ),
        collectionRequestedDate: formatDateForInput(
          data.CollectionRequestedDate || ""
        ),
        promoCode: data.PromoCode || "",
        customerInducedDamage: data.CustomerInducedDamage || false,
        accidentalDamageProtection: data.AccidentalDamageProtection || false,
        defectiveMediaRetention: data.DefectiveMediaRetention || false,
        notificationNumber: data.NotificationNumber || "",
        salesOrderNumber: data.SalesOrderNumber || "",
        resourceName: data.Resource?.Name || "",
        resourceId: data.Resource?.ResourceId || "",
        workOrder: data.WOID || null,
        parentMO: data.parentMO?.MOID || null,
        isBCPOrder: data.IsBCPOrder || false,
        materialOrderType: data.MaterialOrderType || "",
        eotOrderNumber: data.EOTOrderNumber || "",
      });

      setMoForm((prev) => ({
      ...prev,
      SalesOrderNumber: data.SalesOrderNumber || "",
      RMANumber: data.RMANumber || ""
    }));

      console.log("Fetched Material Order:", data);

      // Update the draft with the fetched material order details
      updateDraft("moid", data.MOID); // Save the entire material order to the draft
    } catch (err) {
      console.error("Failed to fetch material orders:", err);
      setError("Failed to fetch material order data");
    }
  };

  const tabs = [
    { value: "mo_info", label: "Mo Information", hidden: true },
    { value: "mo_items", label: "Material Order Line Items", hidden: true },
    { value: "entitlement_sla", label: "Entitlement & SLA", hidden: true },
    { value: "billing_quotation", label: "Billing & Quotation", hidden: true },
    { value: "notes_attaechment", label: "Notes & Attachment", hidden: true },
  ];

  // Fetch Material Line Orders
  const fetchMaterialLineOrdersInMODetail = async () => {
    try {
      const res = await ApiCustomer.get(
        `/api/material-order/material-order-line-items?MOID=${moid}`
      );
      setMaterialLineOrders(res.data.data);
     
    } catch (err) {
      console.error("Failed to fetch material line orders:", err);
      setError("Failed to fetch material line orders");
    }
  };

  useEffect(() => {
    Swal.fire({
      title: "Memuat Data...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Run both fetch functions in parallel
    Promise.all([fetchMaterialOrder(), fetchMaterialLineOrdersInMODetail()])
      .then(() => {
        Swal.close();
      })
      .catch((err) => {
        Swal.close();
      });
  }, [moid]);

  // If error state is set, display error message to user
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const allowedRoles = ["apo", "lg", "admin"];
  const canEditapo = allowedRoles.includes(user?.role);

  console.log("tw", materialOrders?.workorder?.caseinformation?.Owner)
  // if (user?.role === "admin") {
  //   canEditapo = true;
  // } else if (materialOrders?.workorder?.caseinformation?.Owner) {
  //   canEditapo = materialOrders?.workorder?.caseinformation?.Owner === user?.id && allowedRoles.includes(user?.role); ;
  // }

  return (
    <div>
      {materialOrders.OrderStatus === "Closed" && (
        <div className="p-4 my-2 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This material order is <strong>read-only</strong> because it is{" "}
          <strong>Closed</strong>.
        </div>
      )}
      <TabsServiceMO 
        materialOrders={materialOrders} 
        updatedLineItems={updatedLineItems}
        moForm={moForm}
        setMoForm={setMoForm}
      />
      <Card className="mt-2 rounded-none">
        <CardContent className="p-0">
          <Tabs defaultValue="mo_info">
            <Card className="flex flex-col gap-3 p-4 h-25">
              <CardTitle className="text-xl">
                {materialOrders.MOID} for {materialOrders.WOID}
              </CardTitle>
              <CardTitle className="text-sm">
                Material Order . Informations
              </CardTitle>
              <TabsList className="bg-white ">
                {tabs.map((tab, index) =>
                  tab.component ? (
                    <div key={index}>{tab.component}</div>
                  ) : (
                    <TabsTrigger
                      key={index}
                      variant={"underline"}
                      value={tab.value}
                      disabled={tab.disable}
                      hidden={tab.hidden}
                      className={"font-normal"}
                    >
                      {tab.label}
                    </TabsTrigger>
                  )
                )}
                {/* <SelectBarRelated></SelectBarRelated> */}
              </TabsList>
            </Card>

            <div className="p-2">
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                  <hr />
                </CardHeader>
                <CardContent className="grid items-center grid-cols-4 gap-5">
                  <CaseField label={"Case ID"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={materialOrders.workorder?.CaseID}
                    />
                  </CaseField>

                  <CaseField label={"Resource Name"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={
                        materialOrders.workorder?.bookings?.[0]
                          ?.bookingDetails?.[0]?.ResourceId
                      }
                    />
                  </CaseField>

                  <CaseField label={"Contact"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={`${materialOrders.workorder?.caseinformation?.contact_information?.Salutation} ${materialOrders.workorder?.caseinformation?.contact_information?.FirstName} ${materialOrders.workorder?.caseinformation?.contact_information?.LastName}`}
                    />
                  </CaseField>

                  <CaseField label={"Service Offer ID"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={"---"}
                    />
                  </CaseField>

                  <CaseField label={"Work Order"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={materialOrders.WOID}
                    />
                  </CaseField>

                  <CaseField label={"Service Description"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={"---"}
                    />
                  </CaseField>

                  <CaseField label={"Order Number"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={materialOrders.MOID}
                    />
                  </CaseField>

                  <CaseField label={"Sales Order Number"} star={canEditapo} lock={!canEditapo}>
                    <Input
                      variant={"invisible"}
                      type="text"
                      value={moForm?.SalesOrderNumber || ""}
                      placeholder="---"
                      onChange={handleMoFormChange("SalesOrderNumber")}
                    />
                  </CaseField>

                  <CaseField label={"Order Type"} lock>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className=""
                      value={materialOrders.OrderType}
                    />
                  </CaseField>

                  <CaseField label="RMA Number" star={canEditapo} lock={!canEditapo}>
                    <Input variant="invisible" placeholder="---" 
                    value={moForm?.RMANumber || ""}
                    onChange={handleMoFormChange("RMANumber")}
                    />
                  </CaseField>  

                  <Accordion type="single" collapsible className="col-span-4 ">
                    <AccordionItem value="more-detail" >
                      <AccordionTrigger className="pl-8">More Detail</AccordionTrigger>
                      <AccordionContent className={"p-2"}>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <CaseField
                    label={"Delivery Required Date (Customer Time)"}
                    
                  >
                    <DatePicker
                      value={deliveryRequiredDate}
                      onChange={setDeliveryRequiredDate}
                    />
                  </CaseField>
                          <CaseField label={"Collection Requested Date"} icon>
                            <DatePicker
                              value={collectionRequestedDate}
                              onChange={setCollectionRequestedDate}
                            />
                          </CaseField>
                          <CaseField label={"Notification Number"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={"---"}
                            />
                          </CaseField>
                          <CaseField label={"Shipping Priority"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={materialOrders.ShippingPriority}
                            />
                          </CaseField>
                          <CaseField label={"Promo Code"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={"---"}
                            />
                          </CaseField>
                          <CaseField label={"Parent MO"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={"---"}
                            />
                          </CaseField>
                          <CaseField label={"Ready For Closure Date"} icon>
                            <DatePicker
                              value={readyForClosureDate}
                              onChange={setReadyForClosureDate}
                            />
                          </CaseField>
                          <CaseField label={"Customer Induced Damage"} icon >
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={materialOrders.ReadyForClosureDate}
                            />
                          </CaseField>
                          <CaseField label={"BCP Order"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={"---"}
                            />
                          </CaseField>
                          <CaseField label={"Accidental Damage Proctection"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={"---"}
                            />
                          </CaseField>
                          <CaseField label={"Material Order Type"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={"---"}
                            />
                          </CaseField>
                          <CaseField label={"Detective Media Retention"} icon>
                            <Input
                              variant={"invisible"}
                              type="text"
                              className=""
                              value={"---"}
                            />
                          </CaseField>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            
            {/* Booking */}
            <Card className="flex-col mt-5">
              <span className="ml-5 text-xl font-bold">Booking</span>
              <CardContent className="grid">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order Number</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Order Type</TableHead>
                      <TableHead>Ready For Closure</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow key={materialOrders.MOID}>
                      <TableCell>{materialOrders.MOID}</TableCell>
                      <TableCell>{materialOrders.workorder?.CaseID}</TableCell>
                      <TableCell>{formatDate(materialOrders.CreatedOn)}</TableCell>
                      <TableCell>{materialOrders.OrderStatus}</TableCell>
                      <TableCell>{materialOrders.OrderType}</TableCell>
                      <TableCell>{materialOrders.ReadyForClosureDate}</TableCell>
                    </TableRow>
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
                      <TableHead className="w-[100px]">Mo Line Item</TableHead>
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
                    {materialLineOrders.map((lineitem) => (
                      <TableRow 
                      key={lineitem.LineItemID}
                      onClick={() => navigate(`/app/mo_detail/${lineitem.LineItemID}`)}
                      className="cursor-pointer hover:bg-gray-300"
                      >
                        <TableCell className="font-medium">
                            {lineitem.MOID} - {lineitem.LineNumber}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={lineitem.Status}
                            onValueChange={(newStatus) => handleStatusChange(lineitem.LineItemID, newStatus)}
                            disabled={!canEditapo}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Ordered">Ordered</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              {/* <SelectItem value="Closed">Closed</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem> */}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        {/* <TableCell>{lineitem.Status}</TableCell> */}
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

            <TabsContent value="mo_info"></TabsContent>

            <TabsContent value="mo_items">
              <Card className="rounded-md mt-7">
                <span className="ml-5 text-xl font-bold">Failure Code</span>
                <CardContent className="grid grid-flow-col grid-rows-2 gap-5 h-25">
                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Category 1</span>
                    <span className="ml-40">...</span>
                  </div>

                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Failure code 1</span>
                    <span className="ml-35">...</span>
                  </div>

                  <div className="flex font-bold">
                    <span className="ml-7">Category 2</span>
                    <span className="ml-42">...</span>
                  </div>

                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Failure code 2</span>
                    <span className="ml-37">...</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-md mt-7">
                <span className="ml-5 text-xl font-bold">Security Check</span>
                <CardContent className="grid h-10 grid-flow-col grid-rows-2 gap-5">
                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Security Check</span>
                    <span className="ml-40">...</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-md mt-7">
                <span className="ml-5 text-xl font-bold">S4 Messages</span>
                <CardContent className="grid h-10 grid-flow-col grid-rows-2 gap-5">
                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>S4 Messages</span>
                    <span className="ml-40">...</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="entitlement_sla">
              <Card className="flex-col mt-5">
                <span className="ml-5 text-xl font-bold">
                  Entitlement & SLA
                </span>
                <CardContent className="grid gap-5">
                  <div className="flex font-bold">
                    <span>Entitlement & SLA</span>
                    <span className="ml-60">...</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-col mt-5">
                <span className="ml-5 text-xl font-bold">Actions</span>
                <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
                  <div className="flex font-bold">
                    <span className="ml-7">Action Booking</span>
                    <span className="ml-49.5">...</span>
                  </div>

                  <div className="flex font-bold">
                    <span className="ml-7">Action Booking Status</span>
                    <span className="ml-37">...</span>
                  </div>

                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Action Date</span>
                    <span className="ml-56.5">...</span>
                  </div>

                  <div className="flex font-bold">
                    <span className="ml-7">Action Count</span>
                    <span className="ml-50">...</span>
                  </div>

                  <div className="flex font-bold">
                    <span className="ml-7">Finished By</span>
                    <span className="ml-53.5">...</span>
                  </div>

                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Finished on Date</span>
                    <span className="ml-43.5">...</span>
                  </div>

                  <div className="flex font-bold">
                    <span>Partner Contact</span>
                    <span className="ml-40">...</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing_quotation">
              <Card className="flex-col mt-7">
                <span className="ml-5 text-xl font-bold">
                  Billing & Quotation
                </span>
                <CardContent className="grid">
                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span> Billing & Quotation</span>
                    <span className="ml-30">...</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes_attaechment">
              <Card className="flex-col mt-7">
                <span className="ml-5 text-xl font-bold">
                  Notes & Attachment
                </span>
                <CardContent className="grid">
                  <div className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Notes & Attachment</span>
                    <span className="ml-30">...</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
