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
import { CaseField } from "./quick-wo-input";
import DatePicker from "./date-picker";
import { Case } from "@/Case";


export const ServiceMaterial = () => {
  const { moid } = useParams();
  
  const [materialOrders, setMaterialOrders] = useState([]);
  const [materialLineOrders, setMaterialLineOrders] = useState([]);
  
  const [deliveryRequiredDate, setDeliveryRequiredDate] = useState(null);
  const [collectionRequestedDate, setCollectionRequestedDate] = useState(null);
  const [ReadyForClosureDate, setReadyForClosureDate] = useState(null);
  const fetchMaterialOrder = async () => {
    try{
      const res = await ApiCustomer.get(`/api/material-order/${moid}`)
      setMaterialOrders(res.data.data)
    }catch(err){
      console.error("Failed to fetch material orders:", err);
    }
  }
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
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-2">
          This material order is <strong>read-only</strong> because it is <strong>Closed</strong>.
        </div>
      )}
      <TabsServiceMO materialOrders={materialOrders}/>
    <Card className="mt-2 rounded-none">

      <CardContent className="p-0">
        <Tabs defaultValue="mo_information">
          <Card className="flex flex-col gap-3 p-4 ">
            <CardTitle className="text-xl ">{materialOrders.MOID} for {materialOrders.WOID}</CardTitle>
            <CardTitle className="text-sm">Material Order . Information</CardTitle>
            <TabsList className="bg-white ">
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
          </Card>

          <TabsContent value="mo_information">
            <Card className="  rounded-md">
                <CardHeader>
                  <CardTitle className=" text-lg">Order Information</CardTitle>
                  <hr />
                </CardHeader>
              <CardContent className="grid gap-5 grid-cols-6 items-center">
                <CaseField label={'Order Number'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={materialOrders.MOID}
                    />
                </CaseField>
                <CaseField label={'Case ID'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={materialOrders.workorder?.CaseID}
                    />
                </CaseField>
                <CaseField label={'Notification Number'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField label={'Service Offer ID'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField label={'Contact'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={`${materialOrders.workorder?.caseinformation?.contact_information?.Salutation} ${materialOrders.workorder?.caseinformation?.contact_information?.FirstName} ${materialOrders.workorder?.caseinformation?.contact_information?.LastName}`}
                    />
                </CaseField>
                <CaseField label={'Sales Order Number'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField label={'Service Description'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField label={'Delivery Required Date (Customer Time)'}>
                  <DatePicker value={deliveryRequiredDate} onChange={setDeliveryRequiredDate}/>
                </CaseField>
                <CaseField label={'Resource Name'} >
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={materialOrders.workorder?.bookings?.[0].bookingDetails?.[0].ResourceId}
                    />
                </CaseField>
                <CaseField label={'Order Type'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={materialOrders.OrderType}
                    />
                </CaseField>
                <CaseField label={'Collection Requested Date'} icon>
                  <DatePicker value={collectionRequestedDate} onChange={setCollectionRequestedDate}/>
                </CaseField>
                <CaseField label={'Work Order'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={materialOrders.WOID}
                    />
                </CaseField>
                <CaseField label={'Shipping Priority'}>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={materialOrders.ShippingPriority}
                    />
                </CaseField>
                <CaseField label={'Promo Code'}>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField label={'Parent MO'}>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField label={'Ready For Closure Date'} icon>
                    <DatePicker value={ReadyForClosureDate} onChange={setReadyForClosureDate}/>
                </CaseField>
                <CaseField label={'Customer Induced Damage'} icon>
                  <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={materialOrders.ReadyForClosureDate}
                    />
                </CaseField>
                <CaseField label={'BCP Order'} icon>
                  <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField className={'col-start-3'} label={'Accidental Damage Proctection'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField label={'Material Order Type'}>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>
                <CaseField className={'col-start-3'} label={'Detective Media Retention'} icon>
                    <Input
                      variant={"invisible"}
                      type="text"
                      className="col-span-4"
                      value={"---"}
                    />
                </CaseField>

                {/* <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Order Number</span>
                  <span className="ml-40">{materialOrders.MOID}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Service Offer ID</span>
                  <span className="ml-37.5">...</span>
                </div>

                <div className="font-bold flex">
                <Lock className="size-5 mr-2"></Lock>
                  <span >Service Description</span>
                  <span className="ml-31">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Order Type</span>
                  <span className="ml-46.5">{materialOrders.OrderType}</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Shipping Priority</span>
                  <span className="ml-35.5">{materialOrders.ShippingPriority}</span>
                </div>

                <div className="font-bold flex">
                <Lock className="size-5 mr-2"></Lock>
                  <span>Ready For Closure Date</span>
                  <span className="ml-24">{materialOrders.ReadyForClosureDate}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Case ID</span>
                  <span className="ml-54">{materialOrders.workorder?.CaseID}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Contact</span>
                  <span className="ml-53">{materialOrders.workorder?.caseinformation?.contact_information?.Salutation} {materialOrders.workorder?.caseinformation?.contact_information?.FirstName} {materialOrders.workorder?.caseinformation?.contact_information?.LastName}</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Delivery Requested Date (Customer Time)</span>
                  <span className="ml-10 mr-16">...</span>
                  <CalendarDays></CalendarDays>
                </div>

                <div className="font-bold flex">
                <Lock className="size-5 mr-2"></Lock>
                  <span>Collection Requested Date</span>
                  <span className="ml-39 mr-16">...</span>
                  <CalendarDays></CalendarDays>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Promo Code</span>
                  <span className="ml-65">...</span>
                </div>

                <div className="font-bold flex">
                <Lock className="size-5 mr-2"></Lock>
                  <span >Customer Induced Damage</span>
                  <span className="ml-37.5">...</span>
                </div>

                <div className="font-bold flex">
                <Lock className="size-5 mr-2"></Lock>
                  <span >Accidental Damage Protection</span>
                  <span className="ml-32">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Defective Media Retention
                  </span>
                  <span className="ml-39.5">...</span>
                </div>

                <div className="font-bold flex">
                <Lock className="size-5 mr-2"></Lock>
                  <span >Notification Number</span>
                  <span className="ml-51">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Sales Order Number</span>
                  <span className="ml-52">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Resource Name</span>
                  <span className="ml-40">{materialOrders.workorder?.bookings?.[0].bookingDetails?.[0].ResourceId}</span>
                </div>

                <div className="font-bold flex">
                <Lock className="size-5 mr-2"></Lock>
                    <span>Work Order</span>
                    <span className="ml-47">{materialOrders.WOID}</span>
                  </div>

                  <div className="font-bold flex">
                    <span className="ml-7">Parent Mo</span>
                    <span className="ml-50">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>BCP Order</span>
                    <span className="ml-50">...</span>
                  </div>

                  <div className="font-bold flex">
                  
                    <span className="ml-7">Material Order Type</span>
                    <span className="ml-32">...</span>
                  </div>

                  <div className="font-bold flex">
                    
                    <span className="ml-7">EOT Order Number</span>
                    <span className="ml-34">...</span>
                  </div> */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mo_items">
            <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
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
                          {lineitem.MOID} - {lineitem.LineItemID}
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

            <Card className=" mt-7 rounded-md">
              <span className="ml-5 font-bold text-xl">Failure Code</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-2 h-25">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Category 1</span>
                  <span className="ml-40">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Failure code 1</span>
                  <span className="ml-35">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Category 2</span>
                  <span className="ml-42">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Failure code 2</span>
                  <span className="ml-37">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className=" mt-7 rounded-md">
              <span className="ml-5 font-bold text-xl">Security Check</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-2 h-10">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Security Check</span>
                  <span className="ml-40">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className=" mt-7 rounded-md">
              <span className="ml-5 font-bold text-xl">S4 Messages</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-2 h-10">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>S4 Messages</span>
                  <span className="ml-40">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entitlement_sla">
            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">Entitlement & SLA</span>
              <CardContent className="grid gap-5">
                <div className="font-bold flex">
                  <span>Entitlement & SLA</span>
                  <span className="ml-60">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">Booking</span>
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

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">Actions</span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
                <div className="font-bold flex">
                  <span className="ml-7">Action Booking</span>
                  <span className="ml-49.5">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Action Booking Status</span>
                  <span className="ml-37">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Action Date</span>
                  <span className="ml-56.5">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Action Count</span>
                  <span className="ml-50">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Finished By</span>
                  <span className="ml-53.5">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Finished on Date</span>
                  <span className="ml-43.5">...</span>
                </div>

                <div className="font-bold flex">
                  <span>Partner Contact</span>
                  <span className="ml-40">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing_quotation">
          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Billing & Quotation
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span> Billing & Quotation</span>
                  <span className="ml-30">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes_attaechment">
          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Notes & Attachment
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
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
