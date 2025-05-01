import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
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
import { Car, Lock, Plus } from "lucide-react";
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
import Swal from "sweetalert2";
import { TabsServiceWO } from "./service-case";
import { KeyRound } from "lucide-react";

import { useParams } from "react-router";

import ApiCustomer from "@/api";

import { QuickWOInput } from "./quick-wo-input";
import { NewBookableResourceBooking } from "./service-booking";
import { getUserFromToken } from "@/lib/utils/auth";

import { useNavigate } from "react-router";

export const ServiceWork = () => {

  const user = getUserFromToken();
  const { woid } = useParams();

  const [workOrders, setWorkOrders] = useState([]);
  const fetchWorkOrders = async () => {
    try {
      const res = await ApiCustomer.get(`/api/work-order/${woid}`);
      setWorkOrders(res.data.data); // adjust based on API response shape
      console.log("Fetch Work Order: ",res)
    } catch (err) {
      console.error("Failed to fetch work orders:", err);
    }
  };

  const [materialOrders, setMaterialOrders] = useState([])
  const fetchMaterialOrders = async () => {
    try {
      const res = await ApiCustomer.get(`/api/material-order?WOID=${woid}`);
      console.log("Material Order in WO Detail : ", res)
      setMaterialOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch Material orders:", err);
    }
  }

  const [caseInformation, setCaseInformation] = useState([])
  const [bookings, setBookings] = useState([])
  

  useEffect(() => {
    const fetchAllData = async () => {
      Swal.fire({
        title: 'Please wait...',
        text: 'Loading Work Order Details...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
  
      try {
        
        const resWO = await ApiCustomer.get(`/api/work-order/${woid}`);
        const workOrderData = resWO.data.data;
        setWorkOrders(workOrderData);
  
        
        const resMO = await ApiCustomer.get(`/api/material-order?WOID=${woid}`);
        setMaterialOrders(resMO.data.data);
  
        
        if (workOrderData?.CaseID) {
          const resCI = await ApiCustomer.get(`/api/case-information/${workOrderData.CaseID}`);
          setCaseInformation(resCI.data.data);

          const resBooking = await ApiCustomer.get(`/api/bookings?WOID=${woid}`);
          setBookings(resBooking.data.data)
        }
  
        Swal.close(); 
  
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while loading data!',
        });
      }
    };
  
    if (woid) fetchAllData();
  }, [woid]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };
  

  // const fetchBookings = async () => {
  //   try {
  //     const response = await ApiCustomer.get('/api/bookings')
  //     setBookings(response.data.data)
  //   } catch (error) {
  //     console.error("Fetch error:", err);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Something went wrong while loading data!',
  //       });
  //   }
  // }
  
  // useEffect(() => {
  // }, [workOrders])

  const navigate = useNavigate();
  return (
    <div>
      {workOrders.SystemStatus === 'CLOSED_POSTED' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-2">
          This work order is <strong>read-only</strong> because it is <strong>Closed</strong>.
        </div>
      )}
    <TabsServiceWO workOrders={workOrders}/>
    <Card className="mt-2 rounded-none h-[160px]">
      <CardHeader>
        <CardTitle className="text-xl ">{woid}</CardTitle>
        <CardTitle className="text-sm">Work Order . Work Order</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="Quick_WO_Input" className="w-[760px]">
          <TabsList className="bg-white w-[760px]">
            <TabsTrigger variant="underline" value="wo_summary" className="cursor-pointer">
              WO Summary
            </TabsTrigger>
            <TabsTrigger variant="underline"
              value="wo_details"
              className="cursor-pointer white"
            >
              WO Details
            </TabsTrigger>
            <TabsTrigger variant="underline" value="wo_bookings" className="cursor-pointer">
              WO Bookings
            </TabsTrigger>
            <TabsTrigger variant="underline" value="wo_Notes_Timeline" className="cursor-pointer">
              WO Notes/Timeline
            </TabsTrigger>
            <TabsTrigger variant="underline" value="wo_Closure_Details" className="cursor-pointer">
              WO Closure Details
            </TabsTrigger>
            <TabsTrigger variant="underline" value="Quick_WO_Input" className="cursor-pointer">
              Quick WO Input
            </TabsTrigger>
            <SelectBarRelated></SelectBarRelated>
          </TabsList>

          <TabsContent value="wo_summary">
           <div className="flex gap-4">
            <Card className="w-[850px] mt-7 rounded-md">
              <span className="ml-5 font-bold text-xl">General</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-9 h-115">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Incoming Channel</span>
                  <span className="ml-40">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Work Order Number</span>
                  <span className="ml-35.5">{workOrders.WOID}</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Work Order Type</span>
                  <span className="ml-42">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Priority</span>
                  <span className="ml-60">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">System Status</span>
                  <span className="ml-48">{workOrders.SystemStatus}</span>
                </div>

                <div className="font-bold flex">
                  <KeyRound className="size-5 mr-2"></KeyRound>
                  <span>Sub-Status</span>
                  <span className="ml-54">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Bookable Resource Booking</span>
                  <span className="ml-22">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Service Offer ID</span>
                  <span className="ml-45">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Service Description</span>
                  <span className="ml-39">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Patner Case Id</span>
                  <span className="ml-50">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Patner Status</span>
                  <span className="ml-52">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Preferred Day</span>
                  <span className="ml-51">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Preferred Time</span>
                  <span className="ml-49">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Black Badged/Special Access</span>
                  <span className="ml-23">...</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Recommended Resource</span>
                  <span className="ml-31">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Shipment Country</span>
                  <span className="ml-42.5">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Shipment State</span>
                  <span className="ml-48">...</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <Card className="mt-7.5 rounded-sm h-19 w-96">
                <CardContent className="grid">
                  <div className="font-bold flex">
                    <span>Currently Worked By</span>
                    <span className="ml-18">...</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-3 rounded-md w-96">
                <span className="ml-5 font-bold text-xl">
                Entitlement and Modifier
                </span>
                <CardContent className="grid gap-5 grid-rows-3">
                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Entitlement</span>
                    <span className="ml-40">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Offer</span>
                    <span className="ml-52">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>OTC Code</span>
                    <span className="ml-43.5">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Authorizing Employee</span>
                    <span className="ml-20">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Coverage Window Used</span>
                    <span className="ml-17">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Coverage Window Value</span>
                    <span className="ml-16">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Response Time Value</span>
                    <span className="ml-22.5">...</span>
                  </div>

                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Repair Time Value</span>
                    <span className="ml-28.5">...</span>
                  </div>
                  
                  <div className="font-bold flex">
                    <Lock className="size-5 mr-2"></Lock>
                    <span>Case Priority Index</span>
                    <span className="ml-27">...</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            </div>

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">
                Service Delivery Address
              </span>
              <CardContent className="grid ">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Service Delivery Address</span>
                  <span className="ml-39">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">
                SLA in Customer Time Zone
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>SLA in Customer Time Zone</span>
                  <span className="ml-33">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">
                Part Order Information
              </span>
              <CardContent className="grid gap-5">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>EarliestDateAllPartsAvailable</span>
                  <span className="ml-30">...</span>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Order Type</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Ready For Closure Date</TableHead>
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

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Low Inventory</span>
                  <span className="ml-57">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">
              Material Order Information
              </span>
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
                    { materialOrders.length > 0 ? (materialOrders.map((material) => (
                      <TableRow key={material.MOID}>
                        <TableCell className="font-medium">
                          <Link to={`/material-order/${material.MOID}`}>
                          {material.MOID} on {material.WOID} 
                          </Link>
                          </TableCell>
                        <TableCell>{material.CaseID}</TableCell>
                        {/* <TableCell>{work.serviceaccount}</TableCell>
                        <TableCell>{work.substatus}</TableCell>
                        <TableCell>{work.systemstatus}</TableCell>
                        <TableCell>{work.priority}</TableCell>
                        <TableCell>{work.workorder}</TableCell>
                        <TableCell>{work.primaryincident}</TableCell>
                        <TableCell>{work.duedate}</TableCell>
                        <TableCell>{work.orion}</TableCell>
                        <TableCell>{work.owner}</TableCell>
                        <TableCell>{work.created}</TableCell> */}
                      </TableRow>
                    ))
                  ): (
                    <TableRow>
                      <TableCell className="font-medium">
                        No data available
                      </TableCell>
                    </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">
              Primary Incident
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Primary Incident</span>
                  <span className="ml-50">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wo_details">
            <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
                WO Details
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Customer Account</span>
                  <span className="ml-30">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wo_bookings" className="w-390">
            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">WO Bookings</span>
              <CardContent className="grid gap-5">
                <div className="font-bold flex">
                  <span>Requested Date Time (Customer)</span>
                  <span className="ml-50 mr-10">...</span>
                  <CalendarDays></CalendarDays>
                </div>

                <div className="font-bold flex">
                  <span>Guaranteed Fix Time (Customer)</span>
                  <span className="ml-51 mr-10">...</span>
                  <CalendarDays></CalendarDays>
                </div>

                <div className="font-bold flex">
                  <span>Due Date (Customer) </span>
                  <span className="ml-72.5 mr-10">...</span>
                  <CalendarDays></CalendarDays>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-5 flex-col">
              <span className="ml-5 font-bold text-xl">Booking </span>   
              <CardContent className="grid">
                {/* <Button variant="link" className="w-50 ml-250 "> */}
                {/* <Link 
                  to="/bookings"
                  state={{ WOID: workOrders.WOID }}
                >
                    + New Bookable Resource
                  </Link> */}
                  <NewBookableResourceBooking WOID={ workOrders.WOID } CreatedBy={user.id} />
                {/* </Button> */}
              <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Resource</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead>Reschedule</TableHead>
                      <TableHead>Reschedule Reason</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Estimated Arrival Time (ETA)</TableHead>
                      <TableHead>Actual Arrival Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Created By</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                  {bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                      <TableRow key={booking.BookingId || index} onClick={() => navigate(`/bookings`,{ state: { BookingId: booking.BookingId }})} >
                        <TableCell>{booking.workorder?.Owner || '-'}</TableCell>
                        <TableCell>{booking.workorder?.WorkOrderNumber || '-'}</TableCell>
                        <TableCell>{booking.BookingStatus || '-'}</TableCell>
                        <TableCell>{booking.CeScheduleChange ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{booking.ScheduleJeopardy ? 'Jeopardy' : '-'}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{formatDate(booking.CreatedAt)}</TableCell>
                        {/* <TableCell>{formatDate(booking.StartTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.EstimatedArrivalTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.ActualArrivalTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.EndTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.CreatedAt)}</TableCell> */}
                        <TableCell>{booking.createdByUser?.Name || '-'}</TableCell>
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

          <TabsContent value="wo_Notes_Timeline">
          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
                WO Notes / Timeline
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span> WO Notes / Timeline</span>
                  <span className="ml-30">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wo_Closure_Details">
          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Resolution Notes
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Resolution Notes/Diagnostics</span>
                  <span className="ml-30">...</span>
                </div>
              </CardContent>
            </Card>

          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Labor Types
              </span>
              <CardContent className="grid">
              <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Service</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Billable</TableHead>
                      <TableHead>Outside of Bussiness Hours</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Line Order</TableHead>
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

          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Miscellaneous Charges 
              </span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Product ID</span>
                  <span className="ml-50.5">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Product</span>
                  <span className="ml-55.5">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Quantity</span>
                  <span className="ml-54">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Total Amount</span>
                  <span className="ml-50">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Line Order</span>
                  <span className="ml-56">...</span>
                </div>
              </CardContent>
            </Card>

          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              DOA Letter (If DOA Case)
              </span>
              <CardContent className="grid">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Product ID</span>
                  <span className="ml-50">...</span>
                </div>
              </CardContent>
            </Card> 
  
          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Page Count Information
              </span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-3">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Meter Read Available</span>
                  <span className="ml-40">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Reason if Not Available</span>
                  <span className="ml-36.5">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Reason if Not Available</span>
                  <span className="ml-36">...</span>
                </div>
              </CardContent>
            </Card> 

          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Follow-Up
              </span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-4">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Follow Up Required</span>
                  <span className="ml-43">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Follow Up Reason Code</span>
                  <span className="ml-36">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Follow Up Completed </span>
                  <span className="ml-39.5">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Follow Up Note</span>
                  <span className="ml-51">...</span>
                </div>
              </CardContent>
            </Card> 

          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Closure Data
              </span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Finished By</span>
                  <span className="ml-62">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Finished on Date (Customer)</span>
                  <span className="ml-30">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Finished on Date </span>
                  <span className="ml-52">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Patner Contact</span>
                  <span className="ml-50">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Workorder Closed Date</span>
                  <span className="ml-34.5">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Customer Resolution Date</span>
                  <span className="ml-29.5">...</span>
                </div>
              </CardContent>
            </Card> 
    
          <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">
              Closure Codes
              </span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Delay Codes</span>
                  <span className="ml-50">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Repair Class Codes</span>
                  <span className="ml-38">...</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Travel Zone </span>
                  <span className="ml-51">...</span>
                </div>
              </CardContent>
            </Card> 
          </TabsContent>

          <TabsContent value="Quick_WO_Input" className="w-400">
            <QuickWOInput WOID={woid} caseInformation={caseInformation} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </div>
  );
};
