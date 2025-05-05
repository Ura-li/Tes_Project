import React from 'react'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from 'react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SelectBarRelated } from './sc-select'
import { CalendarDays,  Lock, PlusCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

'use client'

import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import ApiCustomer from "@/api";
import debounce from 'lodash.debounce';
import Swal from 'sweetalert2';

const workorder = [
  {
    workordernumber: "WO-027816939",
    caseid: "54165182991",
    serviceaccount: "Icon Plus",
    substatus: "Waiting",
    systemstatus: "Open",
    priority: "WO Priority",
    workorder: "In-Country",
    primaryincident: "Depot Repair",
    duedate: "21/03/2025 00.53",
    orion: "-",
    owner : "Jokowi",
    created: "Widodo",
  },
]

const partsorder = [
  {
    name: "Budiono",
    orderstatus: "-",
    workorder: "-",
    customerselfrepair: "-",
    owner: "Budiono",
    createdon: "W-",
    ordercloseddate: "-",
    createdby: "-",
  },
]

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


export function ServiceBooking ({BookingId , woid}) {  
  
  const { bookingid } = useParams();
  const [tab, setTab] = useState("book_info");
  const [bookingData, setBookingData] = useState(null);
  const [resourceName, setResourceName] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [subkTechnicianName, setSubkTechnicianName] = useState("");
  const [subkTechnicianId, setSubkTechnicianId] = useState(null);
  
  const [subkTechnicianLearnerName, setSubkTechnicianLearnerName] = useState("");
  const [subkTechnicianLearnerId, setSubkTechnicianLearnerId] = useState(null);
  

  const [bookingStatus, setBookingStatus] = useState("");
  const [workOrderNumber, setWorkOrderNumber] = useState("");
  const [requestedDateTimeCustomer, setRequestedDateTimeCustomer] = useState("");
  const [guaranteedFixTimeCustomer, setGuaranteedFixTimeCustomer] = useState("");

  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [ceScheduleChange, setCeScheduleChange] = useState(false);

  const [startTimeCustomerTime, setStartTimeCustomerTime] = useState("");
  const [endTimeCustomerTime, setEndTimeCustomerTime] = useState("");
  const [estimatedArrivalTimeCustomerTime, setEstimatedArrivalTimeCustomerTime] = useState("");
  const [actualArrivalTimeCustomerTime, setActualArrivalTimeCustomerTime] = useState("");

  const [startTimeUserTime, setStartTimeUserTime] = useState("");
  const [endTimeUserTime, setEndTimeUserTime] = useState("");
  const [durationInMinutesUserTime, setDurationInMinutesUserTime] = useState(0);
  const [estimatedArrivalTimeUserTime, setEstimatedArrivalTimeUserTime] = useState("");
  const [actualArrivalTimeUserTime, setActualArrivalTimeUserTime] = useState("");

  const [scheduleJeopardy, setScheduleJeopardy] = useState(false);
  const [scheduleJeopardyTime, setScheduleJeopardyTime] = useState("");

  const [totalBillableDurationInMinutes, setTotalBillableDurationInMinutes] = useState(0);
  const [totalInProgressDurationInMinutes, setTotalInProgressDurationInMinutes] = useState(0);
  const [totalBreakDurationInMinutes, setTotalBreakDurationInMinutes] = useState(0);  

  const [searchResultsResource, setSearchResultsResource] = useState([]);
  const [searchResultsAccount, setSearchResultsAccount] = useState([]);
  const [searchResultsSubkTechnician, setSearchResultsSubkTechnician] = useState([]);
  const [searchResultsSubkTechnicianLearner, setSearchResultsSubkTechnicianLearner] = useState([]);

  const [bookingDetailsData, setBookingDetailsData] = useState({
    resourceId: "",
    ResourceAccountId: "",
  });

  const [changedBy, setChangedBy] = useState(1);

  

  useEffect(() => {
    async function fetchBooking() {
      if (bookingid == ""){
        // try {
        //   const addData = await ApiCustomer.post(`/api/bookings`)
        //   console.log("ADDING BOOKING")
        // } catch (error) {
          
        // }
        return console.log('error')
      };
      try {
        const response = await ApiCustomer.get(`/api/bookings/${bookingid}`);
        const data = response.data; // <- Harusnya langsung .data, BUKAN .data.booking
        console.log("data fetch booking : ",data)
        setBookingData(response.data);
        
        // Set field-field yang kamu butuhkan
        setResourceName(data?.bookingDetails?.[0]?.resource?.Name || "");
        setResourceId(data?.bookingDetails?.[0]?.resource?.ResourceId || "");
        setAccountName(data?.bookingDetails?.[0]?.resourceaccount?.Name || "");
        setAccountId(data?.bookingDetails?.[0]?.resourceaccount?.ResourceAccountId || "");
        setSubkTechnicianName(data?.bookingDetails?.[0]?.subkTechnician?.Name || "");
        setSubkTechnicianId(data?.bookingDetails?.[0]?.subkTechnician?.SubkTechnicianId || "");
        
        setBookingStatus(data?.BookingStatus || "");
        setWorkOrderNumber(data?.workorder?.WorkOrderNumber || "");
        setRequestedDateTimeCustomer(formatDateForInput(data?.workorder?.RequestedDateTimeCustomer || ""));
        setGuaranteedFixTimeCustomer(formatDateForInput(data?.workorder?.GuaranteedFixTimeCustomer || ""));
        
        setDoNotDisturb(data?.DoNotDisturb || false);
        setCeScheduleChange(data?.CeScheduleChange || false);
        
        setStartTimeCustomerTime(formatDateForInput(data?.bookingDetails?.[0]?.StartTimeCustomerTime || ""));
        setEndTimeCustomerTime(formatDateForInput(data?.bookingDetails?.[0]?.EndTimeCustomerTime || ""));
        setEstimatedArrivalTimeCustomerTime(formatDateForInput(data?.bookingDetails?.[0]?.EstimatedArrivalTimeCustomerTime || ""));
        setActualArrivalTimeCustomerTime(formatDateForInput(data?.bookingDetails?.[0]?.ActualArrivalTimeCustomerTime || ""));
        
        setStartTimeUserTime(formatDateForInput(data?.bookingDetails?.[0]?.StartTimeUserTime || ""));
        setEndTimeUserTime(formatDateForInput(data?.bookingDetails?.[0]?.EndTimeUserTime || ""));
        setDurationInMinutesUserTime(data?.bookingDetails?.[0]?.DurationInMinutesUserTime || 0);
        setEstimatedArrivalTimeUserTime(formatDateForInput(data?.bookingDetails?.[0]?.EstimatedArrivalTimeUserTime || ""));
        setActualArrivalTimeUserTime(formatDateForInput(data?.bookingDetails?.[0]?.ActualArrivalTimeUserTime || ""));

        setScheduleJeopardy(data?.ScheduleJeopardy || false);
        setScheduleJeopardyTime(formatDateForInput(data?.ScheduleJeopardyTime || ""));
        
        setTotalBillableDurationInMinutes(data?.TotalBillableDurationInMinutes || 0);
        setTotalInProgressDurationInMinutes(data?.TotalInProgressDurationInMinutes || 0);
        setTotalBreakDurationInMinutes(data?.TotalBreakDurationInMinutes || 0);
        
        // const updatedBookingData = {
        //   ...bookingData, // keep all original fields
        //   ResourceId: resourceId,
        //   ResourceAccountId: accountId,
        //   SubkTechnicianId: subkTechnicianId,
        //   StartTimeCustomerTime: startTimeCustomerTime || null,
        //   EndTimeCustomerTime: endTimeCustomerTime || null,
        //   EstimatedArrivalTimeCustomerTime: estimatedArrivalTimeCustomerTime || null,
        //   ActualArrivalTimeCustomerTime: actualArrivalTimeCustomerTime || null,
        //   StartTimeUserTime: startTimeUserTime || null,
        //   EndTimeUserTime: endTimeUserTime || null,
        //   DurationInMinutesUserTime: durationInMinutesUserTime || null,
        //   EstimatedArrivalTimeUserTime: estimatedArrivalTimeUserTime || null,
        //   ActualArrivalTimeUserTime: actualArrivalTimeUserTime || null,
        // };
        
        // setBookingData(updatedBookingData);
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
      }
    }
    
    if (bookingid) {
      fetchBooking();
    }
  }, []);

  if (!bookingData) {
    return <div>Loadinsg...</div>;
  }

  const handleUpdate = async () => {
    console.log("Booking Data : ",bookingData)
    const updatedBookingData = {
      ...bookingData, // keep all original fields
      ResourceId: resourceId,
      ResourceAccountId: accountId,
      SubkTechnicianId: subkTechnicianId,
      StartTimeCustomerTime: startTimeCustomerTime || null,
      EndTimeCustomerTime: endTimeCustomerTime || null,
      EstimatedArrivalTimeCustomerTime: estimatedArrivalTimeCustomerTime || null,
      ActualArrivalTimeCustomerTime: actualArrivalTimeCustomerTime || null,
      StartTimeUserTime: startTimeUserTime || null,
      EndTimeUserTime: endTimeUserTime || null,
      DurationInMinutesUserTime: durationInMinutesUserTime || null,
      EstimatedArrivalTimeUserTime: estimatedArrivalTimeUserTime || null,
      ActualArrivalTimeUserTime: actualArrivalTimeUserTime || null,
    };
    
    await setBookingData(updatedBookingData);
    try {
      await ApiCustomer.patch(`/api/bookings/${bookingid}`, {
        ChangedBy: changedBy,
        BookingStatus: bookingStatus,
        DoNotDisturb: doNotDisturb,
        CeScheduleChange: ceScheduleChange,
        ScheduleJeopardy: scheduleJeopardy,
        ScheduleJeopardyTime: scheduleJeopardyTime ? new Date(scheduleJeopardyTime) : null,
        TotalBillableDurationInMinutes: totalBillableDurationInMinutes,
        TotalInProgressDurationInMinutes: totalInProgressDurationInMinutes,
        TotalBreakDurationInMinutes: totalBreakDurationInMinutes,
        bookingDetailsData: bookingData,
        bookingDetails2Data: bookingDetailsData
      });

      Swal.fire({
        title: 'Success',
        icon: "Success",
        text: "Booking telas berhasil di simpan",
      }).then(() => {
        window.location.href = `/work/${bookingData.WOID}`
      })
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleSearchResource = debounce(async (keyword) => {
    
    console.log('Debounced keyword:', keyword); // <-- ADD THIS
    if (!keyword) {
      setSearchResultsResource([]);
      return;
    }
  
    try {
      const response = await ApiCustomer.get(`/api/resources`, {
        params: { keyword }
      });
      setSearchResultsResource(response.data.data);
      console.log("Search Result Resource : ",response.data)
    } catch (error) {
      console.error("Error fetching Subk Technician search:", error);
    }
  }, 500); // 500ms delay

  
  const fetchResourceAccount = async (resourceId) => {
    try {
      const response = await ApiCustomer.get(`/api/resourceAccounts?resourceId=${resourceId}`);
      const data = response.data.data
      setAccountName(data.Name);
      setAccountId(data.ResourceAccountId);

      setBookingDetailsData((prev) =>({
        ...prev,
        ResourceAccountId: data.ResourceAccountId                            
      }))
      console.log("Accpunt : ",data)
    } catch (error) {
      console.error("Error fetching Subk Technician search:", error);
    }
  }
  
  


  const handleSearchAccount = debounce(async (keyword) => {
    if (!keyword) {
      setSearchResultsAccount([]);
      return;
    }
  
    try {
      const response = await ApiCustomer.get(`/api/accounts`, {
        params: { keyword }
      });
      setSearchResultsAccount(response.data);
      console.log("a")
    } catch (error) {
      console.error("Error fetching Subk Technician search:", error);
    }
  }, 500); // 500ms delay


  const handleSearchSubkTechnician = debounce(async (keyword) => {
    if (!keyword) {
      setSearchResultsSubkTechnician([]);
      return;
    }
  
    try {
      const response = await ApiCustomer.get(`/api/subktechnicians`, {
        params: { keyword }
      });
      console.log("SubukTech : ",response.data);
      setSearchResultsSubkTechnician(response.data.data);
    } catch (error) {
      console.error("Error fetching Subk Technician search:", error);
    }
  }, 500); // 500ms delay
  

  const handleSearchSubkTechnicianLearner = debounce(async (keyword) => {
    if (!keyword) {
      setSearchResultsSubkTechnicianLearner([]);
      return;
    }
  
    try {
      const response = await ApiCustomer.get(`/api/subktechnicianslearner`, {
        params: { keyword }
      });
      setSearchResultsSubkTechnicianLearner(response.data);
    } catch (error) {
      console.error("Error fetching Subk Technician search:", error);
    }
  }, 500); // 500ms delay


  

  return (
    <Card className="mt-2 rounded-none h-[160px]">
      <CardHeader>
        <CardTitle className="text-xl ">New Bookable Resource Booking</CardTitle>
        <CardTitle className="text-sm">Bookable Resource Booking . Information</CardTitle>
      </CardHeader>

      
                <Button onClick={handleUpdate}>Save</Button>

      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white w-[300px]">
            <TabsTrigger value="book_info" className="cursor-pointer">Booking Information</TabsTrigger>
            <TabsTrigger value="field_service" className="cursor-pointer white">Field Service</TabsTrigger>
            <TabsTrigger value="timeline" className="cursor-pointer">Timeline</TabsTrigger>

          </TabsList>

        <TabsContent value="book_info" className="grid grid-cols-3">
          <Card className="flex-col mt-7 w-[500px]">
            <CardContent className="grid gap-5.5">
        
                <div className='font-bold flex'>
                  <Lock className='size-5 mr-2'></Lock>
                  <span>Name </span>
                  {resourceId !== "" || bookingData?.bookingDetails?.[0]?.resource?.resourceId !== '' ? (
                    <span className='ml-50'>{resourceName}</span>
                  ) : (
                    <span className='ml-50'>...</span>
                  )}
                </div>

              <div className='font-bold flex flex-col relative ml-7 w-full'>
                <span className='ml-7'>Resource</span>
                <input
                  type="text"
                  className="ml-44"
                  value={resourceName}
                  onChange={(e) => {
                    setResourceName(e.target.value);
                    handleSearchResource(e.target.value);

                  }}
                />

                {/* Suggestion dropdown */}
                {searchResultsResource.length > 0 && (
                  <ul className="absolute bg-white border mt-1 w-full max-h-60 overflow-y-auto shadow-lg rounded z-10 transition-all duration-200">
                    {searchResultsResource.map((res) => (
                      <li
                        key={res.ResourceId}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setResourceName(res.Name);
                          setResourceId(res.ResourceId);
                          setSearchResultsResource([]); // Clear suggestions
                          setBookingDetailsData((prev) =>({
                            ...prev,
                            resourceId: res.ResourceId                            
                          }))

                          fetchResourceAccount(res.ResourceId)
                        }}
                      >
                        {res.Name}
                      </li>
                    ))}
                  </ul>
                )}
                {/* <span className='ml-44'>...</span> */}
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Account</span>
                <input
                  type="text"
                  className="ml-45.5"
                  value={accountName}
                  onChange={(e) => {
                    setAccountName(e.target.value);
                    // handleSearchAccount(e.target.value);
                  }}
                />

                {/* Suggestion dropdown */}
                {searchResultsAccount.length > 0 && (
                  <ul className="absolute bg-white border mt-1 w-full z-10">
                    {searchResultsAccount.map((acc) => (
                      <li
                        key={acc.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setAccountName(acc.Name);
                          setAccountId(acc.ResourceAccountId);
                          setSearchResultsAccount([]); // Clear suggestions
                          setBookingDetailsData((prev) =>({
                            ...prev,
                            ResourceAccountId: acc.ResourceAccountId                            
                          }))
                        }}
                      >
                        {acc.name}
                      </li>
                    ))}
                  </ul>
                )}
                {/* <span className='ml-45.5'>...</span> */}
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Subk Technician Name</span>
                {/* <input 
                  type="text" 
                  className='ml-30.5' 
                  value={subkTechnicianName} 
                  onChange={(e) => setSubkTechnicianName(e.target.value)} 
                /> */}
                <input
                  type="text"
                  className="ml-30.5"
                  value={subkTechnicianName}
                  onChange={(e) => {
                    setSubkTechnicianName(e.target.value);
                    handleSearchSubkTechnician(e.target.value);
                  }}
                />

                {/* Suggestion dropdown */}
                {searchResultsSubkTechnician.length > 0 && (
                  <ul className="absolute bg-white border mt-1 w-full z-10">
                    {searchResultsSubkTechnician.map((tech) => (
                      <li
                        key={tech.SubkTechnicianId}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSubkTechnicianName(tech.Name);
                          setSubkTechnicianId(tech.SubkTechnicianId);
                          setSearchResultsSubkTechnician([]); // Clear suggestions


                        }}
                      >
                        {tech.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Subk Technician Learner ID</span>
                <input 
                  type="text" 
                  className='ml-22.5' 
                  value={subkTechnicianId} 
                  onChange={(e) => setSubkTechnicianId(e.target.value)} 
                />
                {/* <input
                  type="text"
                  className="ml-22.5"
                  value={subkTechnicianId}
                  onChange={(e) => {
                    setSubkTechnicianId(e.target.value);
                    handleSearchSubkTechnicianLearner(e.target.value);
                  }}
                /> */}

                {/* Suggestion dropdown */}
                {searchResultsSubkTechnicianLearner.length > 0 && (
                  <ul className="absolute bg-white border mt-1 w-full z-10">
                    {searchResultsSubkTechnicianLearner.map((learn) => (
                      <li
                        key={learn.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSubkTechnicianLearnerName(learn.name);
                          setSubkTechnicianLearnerId(learn.id);
                          setSearchResultsSubkTechnicianLearner([]); // Clear suggestions
                        }}
                      >
                        {learn.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Booking Status</span>
                <input 
                  type="text" 
                  className='ml-33' 
                  value={bookingStatus} 
                  onChange={(e) => setBookingStatus(e.target.value)} 
                />
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Work Order</span>
                <span className='ml-40'>{workOrderNumber}</span>
              </div>

              <Card className="rounded-md p-2"> 
              <div className='font-bold flex'>
                <Lock className='size-5 mr-2' />
                <span>Requested Date Time (Customer)</span>
                <input
                  type="datetime-local"
                  className='ml-20'
                  value={requestedDateTimeCustomer}
                  onChange={(e) => setRequestedDateTimeCustomer(e.target.value)}
                />
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Guaranteed Fix Time (Customer)</span>
                <input
                  type="datetime-local"
                  className='ml-21'
                  value={guaranteedFixTimeCustomer  ? guaranteedFixTimeCustomer.slice(0, 16) : ""}
                  onChange={(e) => {
                    const dateTimeGuaranteed = e.target.value;
                    const isoDateTimeGuaranteed = new Date(dateTimeGuaranteed).toISOString();
                    setGuaranteedFixTimeCustomer(isoDateTimeGuaranteed);
                  }}
                />
              </div>
              </Card>

              <div className='font-bold flex'>
                <span className='ml-7'>Do not Disturb</span>
                <input
                  type="checkbox"
                  className='ml-30'
                  checked={doNotDisturb}
                  onChange={(e) => setDoNotDisturb(e.target.checked)}
                />
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>CE Schedule Change</span>
                <input
                  type="checkbox"
                  className='ml-20'
                  checked={ceScheduleChange}
                  onChange={(e) => setCeScheduleChange(e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-7 w-[350px] ml-25">
          <span className='ml-5 font-bold text-xl'>Booking Dates in User Time</span>
            <CardContent className="grid gap-6 ">
        
            <div className='font-bold flex'>
              <span className='ml-3'>Start Time</span>
              <input
                type="datetime-local"
                className='ml-40'
                value={startTimeUserTime  ? startTimeUserTime.slice(0, 16) : ""}
                onChange={(e) => {
                  const dateTimeStartUser = e.target.value;
                  const isoDateTimeStartUser = new Date(dateTimeStartUser).toISOString();
                  setStartTimeUserTime(isoDateTimeStartUser);
                }}
              />
            </div>

            <div className='font-bold flex'>
              <span className='ml-3'>End Time</span>
              <input
                type="datetime-local"
                className='ml-42'
                value={endTimeUserTime  ? endTimeUserTime.slice(0, 16) : ""}
                onChange={(e) => {
                  const dateTimeEndUser = e.target.value;
                  const isoDateTimeEndUser = new Date(dateTimeEndUser).toISOString();
                  setEndTimeUserTime(isoDateTimeEndUser);
                }}
              />
            </div>

            <div className='font-bold flex'>
              <span className='ml-3'>Duration</span>
              <input
                type="number"
                className='ml-43'
                value={durationInMinutesUserTime}
                onChange={(e) => setDurationInMinutesUserTime(e.target.value)}
              />
            </div>

            <div className='font-bold flex'>
              <span className='ml-3'>Estimated Arrival Time</span>
              <input
                type="datetime-local"
                className='ml-17.5'
                value={estimatedArrivalTimeUserTime  ? estimatedArrivalTimeUserTime.slice(0, 16) : ""}
                onChange={(e) => {
                  const dateTimeEstimatedUser = e.target.value;
                  const isoDateTimeEstmatedUser = new Date(dateTimeEstimatedUser).toISOString();
                  setEstimatedArrivalTimeUserTime(isoDateTimeEstmatedUser);
                }}
              />
            </div>

            <div className='font-bold flex'>
              <span className='ml-3'>Actual Arrival Time</span>
              <input
                type="datetime-local"
                className='ml-24'
                value={actualArrivalTimeUserTime  ? actualArrivalTimeUserTime.slice(0, 16) : ""}
                onChange={(e) => {
                  const dateTimeActualUser = e.target.value;
                  const isoDateTimeActualUser = new Date(dateTimeActualUser).toISOString();
                  setActualArrivalTimeUserTime(isoDateTimeActualUser);
                }}
              />
            </div>
            </CardContent>
          </Card>

          <Card className="mt-7 w-[370px] ml-13  ">
          <span className='ml-5 font-bold text-xl'>Booking Dates in Customer Time Zone</span>
            <CardContent className="grid gap-6">
              <div className='font-bold flex'>
                <span>Start Time (Customer)</span>
                <input
                  type="datetime-local"
                  className='ml-20 mr-9'
                  value={startTimeCustomerTime  ? startTimeCustomerTime.slice(0, 16) : ""}
                  onChange={(e) => {
                    const dateTimeStartCustomer = e.target.value;
                    const isoDateTimeStartCustomer = new Date(dateTimeStartCustomer).toISOString();
                    setStartTimeCustomerTime(isoDateTimeStartCustomer);
                  }}
                />
                <CalendarDays />
              </div>

              <div className='font-bold flex'>
                <span>End Time (Customer)</span>
                <input
                  type="datetime-local"
                  className='ml-22 mr-9'
                  value={endTimeCustomerTime  ? endTimeCustomerTime.slice(0, 16) : ""}
                  onChange={(e) => {
                    const dateTimeEndCustomer = e.target.value;
                    const isoDateTimeEndCustomer = new Date(dateTimeEndCustomer).toISOString();
                    setEndTimeCustomerTime(isoDateTimeEndCustomer);
                  }}
                />
                <CalendarDays />
              </div>

              <div className='font-bold flex'>
                <span>Estimated Arrival Time (Customer)</span>
                <input
                  type="datetime-local"
                  className='mr-6'
                  value={estimatedArrivalTimeCustomerTime  ? estimatedArrivalTimeCustomerTime.slice(0, 16) : ""}
                  onChange={(e) => {
                    const dateTimeEstimatedCustomer = e.target.value;
                    const isoDateTimeEstmatedCustomer = new Date(dateTimeEstimatedCustomer).toISOString();
                    setEstimatedArrivalTimeCustomerTime(isoDateTimeEstmatedCustomer);
                  }}
                />
                <CalendarDays />
              </div>

              <div className='font-bold flex'>
                <span>Actual Arrival Time (Customer)</span>
                <input
                  type="datetime-local"
                  className='ml-10 mr-10'
                  value={actualArrivalTimeCustomerTime  ? actualArrivalTimeCustomerTime.slice(0, 16) : ""}
                  onChange={(e) => {
                    const dateTimeActualCustomer = e.target.value;
                    const isoDateTimeActualCustomer = new Date(dateTimeActualCustomer).toISOString();
                    setActualArrivalTimeCustomerTime(isoDateTimeActualCustomer);
                  }}
                />
                <CalendarDays />
              </div>

            </CardContent>
          </Card>

          
          <Card className="flex-col mt-5 w-[500px] h-25">
          <span className='ml-5 font-bold text-xl'>Timestamp</span>
            <CardContent className="grid gap-4.5 grid-flow-col grid-rows-4">
            {/* <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Order Refere</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Service Status</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Submit</TableHead>
                  <TableHead>Date and Time</TableHead>
                  <TableHead>EMEA</TableHead>
                  <TableHead>Custom Owner</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created On</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">No data available</TableCell>
                  </TableRow>
              </TableBody>
            </Table> */}

            </CardContent>
          </Card>

          <Card className="flex-col mt-5 w-[350px] ml-25">
          <span className='ml-5 font-bold text-xl'>SLA Jeopardy</span>
            <CardContent className="grid gap-4.5">
              <div className='font-bold flex'>
                <span>Schedule Jeopardy</span>
                <input
                  type="text"
                  className='ml-35'
                  value={scheduleJeopardy}
                  onChange={(e) => setScheduleJeopardy(e.target.value)}
                />
              </div>

              <div className='font-bold flex'>
                <span>ScheduleJeopardyTim</span>
                <input
                  type="datetime-local"
                  className='ml-29'
                  value={scheduleJeopardyTime  ? scheduleJeopardyTime.slice(0, 16) : ""}
                  onChange={(e) => {
                    const dateTimeScheduleJeopardyTime = e.target.value;
                    const isoDateTimeScheduleJeopardyTime = new Date(dateTimeScheduleJeopardyTime).toISOString();
                    setScheduleJeopardyTime(isoDateTimeScheduleJeopardyTime);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-col mt-5 w-[370px] ml-13">
          <span className='ml-5 font-bold text-xl'>Total Duration</span>
            <CardContent className="grid gap-4.5 ">
            
              <div className='font-bold flex'>
                <span>Total Billable Duration</span>
                <input
                  type="number"
                  className='ml-37'
                  value={totalBillableDurationInMinutes}
                  onChange={(e) => setTotalBillableDurationInMinutes(e.target.value)}
                />
              </div>

              <div className='font-bold flex'>
                <span>Total Duration in Progress</span>
                <input
                  type="number"
                  className='ml-30'
                  value={totalInProgressDurationInMinutes}
                  onChange={(e) => setTotalInProgressDurationInMinutes(e.target.value)}
                />
              </div>

              <div className='font-bold flex'>
                <span>Total Break Duration</span>
                <input
                  type="number"
                  className='ml-40'
                  value={totalBreakDurationInMinutes}
                  onChange={(e) => setTotalBreakDurationInMinutes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="field_service">
          <Card className="flex-col mt-7 w-[500px]">
            <CardContent className="grid gap-5.5">
            <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
              <span>Field Service</span>
              <span className='ml-40'>...</span>
            </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="flex-col mt-7 w-[500px]">
            <CardContent className="grid gap-5.5">
            <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
              <span>Timeline</span>
              <span className='ml-40'>...</span>
            </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


export function NewBookableResourceBooking({ WOID, CreatedBy}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      const data = {
        WOID: WOID,
        CreatedBy: CreatedBy
      }
      const response = await ApiCustomer.post('/api/bookings', data);

      if (response.status === 201) {
        const { BookingId } = response.data;
        // Lanjut ke navigasi sambil bawa BookingId
        navigate(`/bookings/${BookingId}`);
      }
    } catch (error) {
      console.error('Gagal membuat booking:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-blue-600 hover:text-blue-800">
          <PlusCircle className="mr-2" />
          Tambah Booking Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>
            Booking baru akan dibuat dan Anda akan diarahkan ke halaman edit booking.
          </DialogDescription>
        </DialogHeader>
        <h1>Anda yakin ingin menambahkan booking baru?</h1>
        <DialogFooter>
          <Button onClick={handleCreateBooking} disabled={loading}>
            {loading ? 'Membuat...' : 'Ya, Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}