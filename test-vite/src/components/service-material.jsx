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
import { SelectBarRelated } from "./sc-select";
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
import { Link } from "react-router";
import { TabsServiceMO } from "./service-case";
import Swal from "sweetalert2";

import { useParams } from "react-router";

import ApiCustomer from "@/api";

function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const ServiceMaterial = () => {
  const { moid } = useParams();

  const [materialOrderInformation, setMaterialOrderInformation] = useState({
    MOID: '',
    orderNumber: '',
    serviceOfferID: '',
    serviceDescription: '',
    orderType: '',
    shippingPriority: '', // Enum: LOW | MEDIUM | HIGH | CRITICAL
    readyForClosureDate: '',
    caseID: '',
    contact: null, // Bisa objek: { firstName, lastName, email, ... }
    deliveryRequestedDateCustomerTime: '',
    collectionRequestedDate: '',
    promoCode: '',
    customerInducedDamage: false,
    accidentalDamageProtection: false,
    defectiveMediaRetention: false,
    notificationNumber: '',
    salesOrderNumber: '',
    resourceName: '', 
    resourceId: null,
    workOrder: '', // Bisa objek berisi info workorder
    parentMO: '', // Jika parent material order ada
    isBCPOrder: false,
    materialOrderType: '',
    eotOrderNumber: '',
  });
  

  const [materialOrders, setMaterialOrders] = useState([]);
  const [materialLineOrders, setMaterialLineOrders] = useState([]);

  const fetchMaterialOrder = async () => {
    try {
      const res = await ApiCustomer.get(`/api/material-order/${moid}`);
      const data = res.data.data;
  
      setMaterialOrders(data);
  
      setMaterialOrderInformation({
        MOID: data.MOID || '',
        orderNumber: data.MOID || '',
        serviceOfferID: data.ServiceOfferID || '',
        serviceDescription: data.ServiceDescription || '',
        orderType: data.OrderType || '',
        shippingPriority: data.ShippingPriority || '',
        readyForClosureDate: formatDateForInput(data.ReadyForClosureDate || ''),
        caseID: data.workorder?.CaseID || '',
        contact: data.workorder?.caseinformation?.contact_information
          ? `${data.workorder.caseinformation.contact_information.FirstName} ${data.workorder.caseinformation.contact_information.LastName}`
          : null,
        deliveryRequestedDateCustomerTime: formatDateForInput(data.DeliveryRequestedDate || ''),
        collectionRequestedDate: formatDateForInput(data.CollectionRequestedDate || ''),
        promoCode: data.PromoCode || '',
        customerInducedDamage: data.CustomerInducedDamage || false,
        accidentalDamageProtection: data.AccidentalDamageProtection || false,
        defectiveMediaRetention: data.DefectiveMediaRetention || false,
        notificationNumber: data.NotificationNumber || '',
        salesOrderNumber: data.SalesOrderNumber || '',
        resourceName: data.Resource?.Name || '',
        resourceId: data.Resource?.ResourceId || '',
        workOrder: data.WOID || null,
        parentMO: data.parentMO?.MOID || null,
        isBCPOrder: data.IsBCPOrder || false,
        materialOrderType: data.MaterialOrderType || '',
        eotOrderNumber: data.EOTOrderNumber || '',
      });
  
      console.log('Fetched Material Order:', data);
    } catch (err) {
      console.error('Failed to fetch material orders:', err);
    }
  };
  
  
  const fetchMaterialLineOrdersInMODetail = async () => {
    try{
      const res = await ApiCustomer.get(`/api/material-order/material-order-line-items?MOID=${moid}`)
      setMaterialLineOrders(res.data.data)
    }catch(err){
      console.error("Failed to fetch material line orders:", err);
    }
  }

  useEffect(() => {
    // Menampilkan SweetAlert2 loading indicator sebelum memulai fetch
    Swal.fire({
      title: 'Memuat Data...',
      text: 'Mohon tunggu sebentar...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      }
    });

    // Menjalankan kedua fungsi fetching data secara bersamaan
    Promise.all([fetchMaterialOrder(), fetchMaterialLineOrdersInMODetail()])
      .then(() => {
        Swal.close(); // Menutup SweetAlert2 setelah data berhasil diambil
      })
      .catch((err) => {
        Swal.close(); // Menutup SweetAlert2 jika ada error
        setError("Error fetching data");
      });
  }, []); 

  return (
    <div>
      {materialOrders.OrderStatus === 'Closed' && (
        <div className="p-4 my-2 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This material order is <strong>read-only</strong> because it is <strong>Closed</strong>.
        </div>
      )}
      <TabsServiceMO materialOrders={materialOrders}/>
    <Card className="mt-2 rounded-none h-[160px]">
      <CardHeader>
        <CardTitle className="text-xl ">{materialOrders.MOID} for {materialOrders.WOID}</CardTitle>
        <CardTitle className="text-sm">Material Order . Information</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs>
          <TabsList className="bg-white w-[760px]">
            <TabsTrigger variant={'underline'} value="mo_information" className="cursor-pointer">
              MO Information
            </TabsTrigger>
            <TabsTrigger variant={'underline'}
              value="mo_items"
              className="cursor-pointer white">
            MO Items & Message
            </TabsTrigger>
            <TabsTrigger variant={'underline'} value="entitlement_sla" className="cursor-pointer">
            Entitlement & SLA
            </TabsTrigger>
            <TabsTrigger variant={'underline'} value="billing_quotation" className="cursor-pointer">
            Billing & Quotation
            </TabsTrigger>
            <TabsTrigger variant={'underline'} value="notes_attaechment" className="cursor-pointer">
            Notes & Attachment
            </TabsTrigger>
            <SelectBarRelated></SelectBarRelated>
          </TabsList>

          <TabsContent value="mo_information">
            <Card className="rounded-md mt-7">
              <span className="ml-5 text-xl font-bold">Order Information</span>
              <CardContent className="grid grid-flow-col gap-5 grid-rows-8 h-115">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Order Number</span>
                  <span className="ml-40">{materialOrders.MOID}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Service Offer ID (Case)</span>
                  <span className="ml-[150px]">{materialOrderInformation.serviceOfferID}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Service Description (Case)</span>
                  <span className="ml-[124px]">{materialOrderInformation.serviceDescription}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Order Type</span>
                  <span className="ml-46.5">{materialOrders.OrderType}</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Shipping Priority</span>
                  <span className="ml-35.5">{materialOrders.ShippingPriority}</span>
                </div>

                <div className="flex font-bold">
                <Lock className="mr-2 size-5"></Lock>
                  <span>Ready For Closure Date</span>
                  <span className="ml-24">{materialOrders.ReadyForClosureDate}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Case ID</span>
                  <span className="ml-54">{materialOrders.workorder?.CaseID}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Contact</span>
                  <span className="ml-53">{materialOrders.workorder?.caseinformation?.contact_information?.Salutation} {materialOrders.workorder?.caseinformation?.contact_information?.FirstName} {materialOrders.workorder?.caseinformation?.contact_information?.LastName}</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Delivery Requested Date (Customer Time)</span>
                  <span className="ml-10 mr-16">...</span>
                  <CalendarDays></CalendarDays>
                </div>
                
                <div className="flex items-center font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Collection Requested Date (MO)</span>
                  <span className="ml-[156px] mr-16">
                    {materialOrderInformation.collectionRequestedDate
                      ? new Date(materialOrderInformation.collectionRequestedDate).toLocaleString()
                      : '-'}
                  </span>
                  <CalendarDays />
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Promo Code</span>
                  <span className="ml-[260px]">{materialOrderInformation.promoCode }</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Customer Induced Damage (MO)</span>
                  <span className="ml-[150px]">
                    {materialOrderInformation.customerInducedDamage ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Accidental Damage Protection (MO)</span>
                  <span className="ml-[128px]">
                    {materialOrderInformation.accidentalDamageProtection ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Defective Media Retention (MO)</span>
                  <span className="ml-[158px]">
                    {materialOrderInformation.defectiveMediaRetention ? 'Yes' : 'No'}
                  </span>

                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Notification Number (MO?)</span>
                  <span className="ml-[204px]">{materialOrderInformation.notificationNumber }</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Sales Order Number (MO?)</span>
                  <span className="ml-[208px]">{materialOrderInformation.salesOrderNumber }</span>
                </div>

                

                <div className="flex font-bold">
                  <span className="ml-7">Resource Name</span>
                  <span className="ml-40">{materialOrders.workorder?.bookings?.[0].bookingDetails?.[0].ResourceId}</span>
                </div>

                <div className="flex font-bold">
                <Lock className="mr-2 size-5"></Lock>
                    <span>Work Order</span>
                    <span className="ml-47">{materialOrders.WOID}</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Parent Mo</span>
                  <span className="ml-[200px]">
                    {materialOrderInformation.parentMO?.MOID }
                  </span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>BCP Order (MO?)</span>
                  <span className="ml-[200px]">
                    {materialOrderInformation.isBCPOrder ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Material Order Type</span>
                  <span className="ml-[128px]">
                    {materialOrderInformation.materialOrderType }
                  </span>
                </div>

                <div className="flex font-bold">
                  <span className="text-blue-500 ml-7">EOT Order Number</span>
                  <span className="ml-[136px]">
                    {materialOrderInformation.eotOrderNumber }
                  </span>
                </div>              
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mo_items">
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
                      <TableRow key={lineitem.LineItemID}>
                        <TableCell className="font-medium">
                        <Link to={`/mo_detail/${lineitem.LineItemID}`}>
                          {lineitem.MOID} - {lineitem.LineNumber}
                          </Link>
                          </TableCell>
                        <TableCell>{lineitem.Status}</TableCell>
                        <TableCell>{lineitem.ATPStatus}</TableCell>
                        <TableCell>{lineitem.PartNumber}</TableCell>
                        <TableCell>{lineitem.Description}</TableCell>

                      </TableRow>
                    ))}
                    {/* <TableRow>
                      <TableCell className="font-medium">
                       <Link to="/mo_detail">MO-8292819129-1</Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        Shipped
                      </TableCell>
                      <TableCell className="font-medium">
                        available
                      </TableCell>
                    </TableRow> */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

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
              <span className="ml-5 text-xl font-bold">Entitlement & SLA</span>
              <CardContent className="grid gap-5">
                <div className="flex font-bold">
                  <span>Entitlement & SLA</span>
                  <span className="ml-60">...</span>
                </div>
              </CardContent>
            </Card>

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
                    <TableRow>
                      <TableCell className="font-medium">
                        No data available
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
