import React from 'react'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { SearchCommandBlock, SelectBarRelated } from '../../components/sc-select'
import { CalendarDays,  Lock, PlusCircle } from 'lucide-react'

'use client'

import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import ApiCustomer from "@/api";
import debounce from 'lodash.debounce';
import Swal from 'sweetalert2';
import DatePicker from '../../components/date-picker';
import { TabsBooking } from '../../components/tests/tab';

import { getUserFromToken } from "@/lib/utils/auth";
import CaseField from '@/components/CaseField';
import { useAuth } from '@/context/auth-context';


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


export function ServiceBookingApo ({BookingId , woid}) {  
  const { user } = useAuth();
  const { bookingid } = useParams();
  const [tab, setTab] = useState("book_info");
  const [bookingData, setBookingData] = useState(null);
  const [resourceName, setResourceName] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [subkTechnicianName, setSubkTechnicianName] = useState("");
  const [subkTechnicianId, setSubkTechnicianId] = useState(null);
  
  const [subkEngineerName, setSubkEngineerName] = useState("");
  const [subkEngineerId, setSubkEngineerId] = useState(null);
  
  const [subkTechnicianLearnerName, setSubkTechnicianLearnerName] = useState("");
  const [subkTechnicianLearnerId, setSubkTechnicianLearnerId] = useState(null);
  

  const [bookingStatusId, setBookingStatusId] = useState("");
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
         Swal.fire({
      title: 'Memuat data booking...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
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
        
        setSubkEngineerName(data?.bookingDetails?.[0]?.engineer?.Name || "");
        setSubkEngineerId(data?.bookingDetails?.[0]?.engineer?.IDUser || "");
        
        setBookingStatusId(data?.BookingStatusId || "");
        setWorkOrderNumber(data?.workorder?.WorkOrderNumber || "");
        setRequestedDateTimeCustomer(new Date(data?.workorder?.RequestedDateTimeCustomer || ""));
        setGuaranteedFixTimeCustomer(new Date(data?.workorder?.GuaranteedFixTimeCustomer || ""));
        
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
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
        Swal.fire({
        icon: 'error',
        title: 'Gagal memuat data',
        text: error.message || 'Terjadi kesalahan saat mengambil data.',
      });
      }finally {
        Swal.close();
      }
    }
    
    if (bookingid) {
      fetchBooking();
    }
  }, []);

  if (!bookingData) {
     Swal.fire({
      title: 'Memuat data booking...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  const canCompleteBooking = () => {
    const role = (user?.role || '').toLowerCase();
    return role === 'ce' || role === 'apo' || role === 'admin';
  };

  const handleComplete = async () => {
    if (!canCompleteBooking()) {
      return Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'Only CE or APO can complete a Booking.',
      });
    }
    // Validate required customer-time fields
    if (!endTimeCustomerTime || !estimatedArrivalTimeCustomerTime || !actualArrivalTimeCustomerTime) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        text: 'Fill End Time, Estimated Arrival Time, and Actual Arrival Time (Customer Time) first.',
      });
    }
    // Save current fields first
    await handleUpdate(true);

    // If backend needs a specific BookingStatusId for Completed, it should be handled server-side or by mapping.
    // Here we just notify success of validation + save.
    Swal.fire({
      icon: 'success',
      title: 'Ready to Complete',
      text: 'Fields validated and saved. Booking can be set to Completed.',
    });
  };

  const handleUpdate = async (markCompleted = false) => {
    Swal.fire({
    title: 'Saving...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
    const updatedBookingData = {
      ...bookingData, // keep all original fields
      ResourceId: resourceId,
      ResourceAccountId: accountId,
      SubkTechnicianId: null,
      EngineerId: subkEngineerId,
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
    
    console.log("Booking Data : ",updatedBookingData)
    await setBookingData(updatedBookingData);
    try {
      await ApiCustomer.patch(`/api/bookings/${bookingid}`, {
        ChangedBy: changedBy,
        BookingStatusId: markCompleted ? 2 : parseInt(bookingStatusId),
        DoNotDisturb: doNotDisturb,
        CeScheduleChange: ceScheduleChange,
        ScheduleJeopardy: scheduleJeopardy,
        ScheduleJeopardyTime: scheduleJeopardyTime ? new Date(scheduleJeopardyTime) : null,
        TotalBillableDurationInMinutes: totalBillableDurationInMinutes,
        TotalInProgressDurationInMinutes: totalInProgressDurationInMinutes,
        TotalBreakDurationInMinutes: totalBreakDurationInMinutes,
        bookingDetailsData: updatedBookingData,
        bookingDetails2Data: bookingDetailsData
      });

      Swal.fire({
        title: 'Success',
        icon: "success",
        text: "Booking telah berhasil di simpan",
      }).then(() => {
        // if(redirect){

        // }
        window.location.href = `/app/work/${bookingData.WOID}`
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
  }, 500); 

  
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
  }, 500); 


  const handleSearchSubkTechnician = debounce(async (keyword) => {
    if (!keyword) {
      setSearchResultsSubkTechnician([]);
      return;
    }
  
    try {
      const response = await ApiCustomer.get(`/api/user?resource=${resourceId}`);
      console.log("SubukTechl : ",response.data);
      setSearchResultsSubkTechnician(response.data.data);
    } catch (error) {
      console.error("Error fetching Subk Technician search:", error);
    }
  }, 500); 

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

  useEffect(() =>{
   if (startTimeUserTime && endTimeUserTime) {
  const startTime = new Date(startTimeUserTime);
  const endTime = new Date(endTimeUserTime);

  if (!isNaN(startTime) && !isNaN(endTime)) {   // pastikan valid date
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = Math.max(diffMs / (1000 * 60 * 60), 0);

    setDurationInMinutesUserTime(diffHours);

    console.log("Start Time : ", startTime);
    console.log("End Time   : ", endTime);
    console.log("Duration   : ", diffHours, "menit");
  } else {
    console.warn("Invalid Date:", startTimeUserTime, endTimeUserTime);
  }
}
  }, [startTimeUserTime, endTimeUserTime])

  console.log("booking data is ther ",bookingData?.workorder?.caseinformation)


  let canEditapo;
  let canEditlg;
  let canEditce;

  if (user?.role === "admin") {
    canEditapo = true;
    canEditlg = true;
    canEditce = true;
  } else if (bookingData?.workorder?.caseinformation?.Owner) {
    canEditapo = true;
    canEditlg = true;
    canEditce = true;
    // canEditapo = bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "apo" || bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "lg" || bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "ce";
    // canEditlg = bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "lg" || bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "ce" || bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "apo";
    // canEditce = bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "ce" || bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "apo" || bookingData?.workorder?.caseinformation?.Owner === user?.id && user?.role === "lg";
  }

  const [bookingStatusOptions, setBookingStatusOptions] = useState([]);

  const fetchBookingStatusOptions = async () => {
    try {
      const response = await ApiCustomer.get('/api/booking-status');  

      const mapOptionbookingStatus = response.data.data.map((status) => ({
        value: status.BookingStatusId,
        label: status.Description,
      }));

      setBookingStatusOptions(mapOptionbookingStatus);
      console.log("Booking Status Options:", mapOptionbookingStatus);

    } catch (error) {
      console.error('Error fetching booking status options:', error);
    }
  };
  useEffect(() => {
    fetchBookingStatusOptions();
  }, []);

  

  return (
    <div>
      {/* Quick actions header */}
      <div className="flex items-center gap-2 mb-2">
        <Button variant="secondary" onClick={handleUpdate}>Save</Button>
        <Button variant="default" onClick={handleComplete} disabled={!canCompleteBooking()}>
          Mark Completed
        </Button>
      </div>
      <TabsBooking
        handleUpdate={handleUpdate}
        bookingData={bookingData}
      />
    <Card className="mt-2 rounded-none">
      {/* <Button onClick={handleUpdate}>Save</Button> */}
      
      <Tabs value={tab} onValueChange={setTab}>
        <CardHeader className={"flex flex-col border-2 p-2 gap-3 w-full"}>
          <CardTitle className="text-xl ">
            New Bookable Resource Booking
          </CardTitle>
          <CardTitle className="text-sm">
            Bookable Resource Booking . Information
          </CardTitle>
          <TabsList className="bg-white ">
            <TabsTrigger
              variant={"underline"}
              value="book_info"
              className="cursor-pointer"
              hidden={true}
            >
              Booking Information
            </TabsTrigger>
            <TabsTrigger
              variant={"underline"}
              value="field_service"
              className="cursor-pointer white"
              hidden={true}
            >
              Field Service
            </TabsTrigger>
            <TabsTrigger
              variant={"underline"}
              value="timeline"
              className="cursor-pointer"
              hidden={true}
            >
              Timeline
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <TabsContent value="book_info" className="columns-2 space-y-4">
          <Card className="">
            <CardContent className="grid grid-cols-2 gap-3">
              <CaseField label={"Name"} lock span={2}>
                <Input
                  variant={"invisible"}
                  placeholder="---"
                  value={
                    resourceId !== "" ||
                    bookingData?.bookingDetails?.[0]?.resource?.resourceId !==
                      ""
                      ? resourceName
                      : "---"
                  }
                />
              </CaseField>
              <CaseField label={"Resource"} span={2} lock={!canEditapo} star>
                <Input
                  variant={"invisible"}
                  placeholder="---"
                  value={resourceName}
                  onChange={(e) => {
                    setResourceName(e.target.value);
                    handleSearchResource(e.target.value);
                  }}
                />
                {searchResultsResource.length > 0 && (
                  <ul className="absolute z-10 w-[17em] mt-1 overflow-y-auto transition-all duration-200 bg-white border rounded shadow-lg max-h-60">
                    {searchResultsResource.map((res) => (
                      <li
                        key={res.ResourceId}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setResourceName(res.Name);
                          setResourceId(res.ResourceId);
                          setSearchResultsResource([]); // Clear suggestions
                          setBookingDetailsData((prev) => ({
                            ...prev,
                            resourceId: res.ResourceId,
                          }));

                          fetchResourceAccount(res.ResourceId);
                        }}
                      >
                        {res.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </CaseField>
                <CaseField label={"Account"} lock span={2}>
                  <Input
                    variant={"invisible"}
                    placeholder="---"
                    value={accountName}
                    onChange={(e) => {
                      setAccountName(e.target.value);
                      // handleSearchAccount(e.target.value);
                    }}
                    readOnly
                  />
                  {searchResultsAccount.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border">
                      {searchResultsAccount.map((acc) => (
                        <li
                          key={acc.id}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => {
                            setAccountName(acc.Name);
                            setAccountId(acc.ResourceAccountId);
                            setSearchResultsAccount([]); // Clear suggestions
                            setBookingDetailsData((prev) => ({
                              ...prev,
                              ResourceAccountId: acc.ResourceAccountId,
                            }));
                          }}
                        >
                          {acc.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </CaseField>
              
              <CaseField label={"Subk Technician Name"} span={2} lock={!canEditapo} star>
                <Input
                  variant={"invisible"}
                  placeholder="---"
                  value={subkEngineerName}
                  onChange={(e) => {
                    console.log("Subuk Tech Name in APO : ",e)
                    setSubkEngineerName(e.target.value);
                    handleSearchSubkTechnician(e.target.value);
                  }}
                />
                {searchResultsSubkTechnician.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border">
                    {searchResultsSubkTechnician.map((tech) => (
                      <li
                        key={tech.SubkTechnicianId}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          console.log("USER IN SUBK CLICK : ",tech);
                          setSubkEngineerName(tech.Name);
                          setSubkEngineerId(tech.IDUser);
                          setSearchResultsSubkTechnician([]); // Clear suggestions
                        }}
                      >
                        {tech.Name}
                      </li>
                    ))}
                  </ul>
                )}
              </CaseField>
              <CaseField label={"Subk Technician Learner ID"} lock={!canEditapo} span={2}>
                <Input
                  variant={"invisible"}
                  value={subkEngineerId}
                  placeholder="---"
                  onChange={(e) => setSubkEngineerId(e.target.value)}
                />
                {searchResultsSubkTechnicianLearner.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border">
                    {searchResultsSubkTechnicianLearner.map((learn) => (
                      <li
                        key={learn.id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
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
              </CaseField>
              <CaseField label={"Booking Status"} span={2} star>
                <Input
                  variant={"invisible"}
                  value={bookingStatusId}
                  onChange={(e) => setBookingStatusId(e.target.value)}
                  hidden
                /> 
                <SearchCommandBlock
                  value={bookingStatusId}          
                  onChange={setBookingStatusId}
                  options={bookingStatusOptions}
                >
                </SearchCommandBlock>
              </CaseField>
              <CaseField label={"Work Order"} lock span={2}>
                <Input variant={"invisible"} value={workOrderNumber} readOnly />
              </CaseField>
              <div className="grid items-center grid-cols-3 col-span-3 p-3 ring-1 gap-2">
                <CaseField
                  label={"Requested Date Time (costumer)"}
                  lock
                  span={2}
                >
                  <DatePicker
                    value={requestedDateTimeCustomer}
                    onChange={
                      setRequestedDateTimeCustomer
                    }
                    />
                </CaseField>
                <CaseField
                  label={"Guaranteed Fix Time (costumer)"}
                  lock
                  span={2}
                >
                  <DatePicker
                    value={guaranteedFixTimeCustomer}
                    onChange={setGuaranteedFixTimeCustomer}
                    />
                </CaseField>
              </div>
              <CaseField
                label={"Do not Distrub"}
                span={2}
                childClass={" justify-center place-content-center flex"}
                lock
              >
                <Select
                  className=""
                  value={doNotDisturb ? 'yes' : 'no'}
                  onValueChange={(value) => setDoNotDisturb(value === 'yes')}
                >
                  <SelectTrigger className={'w-full'}>
                    <SelectValue placeholder='---' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='yes'>Yes</SelectItem>
                    <SelectItem value='no'>No</SelectItem>
                  </SelectContent>
                </Select>
              </CaseField>
              <CaseField
                label={"Ce Schedule Change"}
                span={2}
                childClass={" justify-center place-content-center flex"}
                lock
              >
                <Select
                  className=""
                  value={ceScheduleChange ? 'yes' : 'no'}
                  onValueChange={(value) => setCeScheduleChange(value === 'yes')}
                >
                  <SelectTrigger className={'w-full'}>
                    <SelectValue placeholder='---' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='yes'>Yes</SelectItem>
                    <SelectItem value='no'>No</SelectItem>
                  </SelectContent>
                </Select>
              </CaseField>
            </CardContent>
          </Card>

           <Card className="">
            <CardHeader>
              <CardTitle className="text-lg ">Total Duration</CardTitle>
              <hr />
            </CardHeader>
            <CardContent className="grid items-center grid-cols-3 gap-5">
              <CaseField label={'Total Duration'} span={2} lock={!canEditce}>
                <Input
                    type="number"
                    value={totalBillableDurationInMinutes}
                    onChange={(e) =>
                      setTotalBillableDurationInMinutes(e.target.value ? parseInt(e.target.value, 10) : null)
                    }
                  />
              </CaseField>
              <CaseField label={'Total Duration in Progress'} span={2} lock={!canEditce}>
                <Input
                  type="number"
                  value={totalInProgressDurationInMinutes}
                  onChange={(e) =>
                    setTotalInProgressDurationInMinutes(e.target.value ? parseInt(e.target.value, 10) : null)
                  }
                />
              </CaseField>
              <CaseField label={'Total Break Duration'} span={2} lock={!canEditce}>
                <Input
                  type="number"
                  value={totalBreakDurationInMinutes}
                  onChange={(e) =>
                    setTotalBreakDurationInMinutes(e.target.value ? parseInt(e.target.value, 10) : null)
                  }
                />
              </CaseField>
            </CardContent>
          </Card>

          <Card className="break-inside-avoid-column flex gap-2">
            <CardHeader>
              <CardTitle className="text-lg ">
                Booking Dates in User Time
              </CardTitle>
              <hr />
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-6">
              <CaseField label={"Start Time"} span={2} star lock={!canEditapo}>
                <DatePicker
                  value={
                    startTimeUserTime ? new Date(startTimeUserTime) : ""
                  }
                  onChange={
                    setStartTimeUserTime
                  }
                ></DatePicker>
              </CaseField>
              <CaseField label={"End Time"} span={2}  lock={!canEditapo}>
                {/* {console.log("END TIME IN RETURN LOOPING", endTimeUserTime)} */}
                <DatePicker
                  value={endTimeUserTime ? new Date(endTimeUserTime) : ""}
                  onChange={
                    setEndTimeUserTime
                  }
                ></DatePicker>
              </CaseField>
              <CaseField label={"Duration"} span={2}  lock={!canEditapo}>
                <div className='flex flex-row gap-2'>
                <Input
                  type="number"
                  value={durationInMinutesUserTime}
                  onChange={(e) => {setDurationInMinutesUserTime(e.target.value ? parseInt(e.target.value, 10) : null)}}
                />
                <Label>Hours</Label>
                </div>
              </CaseField>
              <CaseField label={"Estimated Arrival Time"} span={2} lock={!canEditapo}>
                <DatePicker
                  value={
                    estimatedArrivalTimeUserTime
                      ? new Date(estimatedArrivalTimeUserTime)
                      : ""
                  }
                  onChange={
                    setEstimatedArrivalTimeUserTime
                  }
                ></DatePicker>
              </CaseField>
              <CaseField label={"Actual Arrival Time"} span={2}  lock={!canEditlg}>
                <DatePicker
                  
                  value={
                    actualArrivalTimeUserTime
                      ? new Date (actualArrivalTimeUserTime)
                      : ""
                  }
                  onChange={
                    setActualArrivalTimeUserTime
                  }
                ></DatePicker>
              </CaseField>
            </CardContent>
          </Card>

          <Card className="break-inside-avoid h-fit" hidden>
            <CardHeader>
              <CardTitle className="text-lg ">Timestamp</CardTitle>
              <hr />
            </CardHeader>
           
          </Card>

          <Card className="flex ">
            <CardHeader>
              <CardTitle className="text-lg ">
                Booking Dates in Customer Time Zone
              </CardTitle>
              <hr />
            </CardHeader>
            <CardContent className="grid items-center grid-cols-3 gap-6">
              <CaseField label={'Start Time (Customer)'} span={2}  lock={!canEditapo}>
                <DatePicker 
                  value={startTimeCustomerTime ? new Date(startTimeCustomerTime) : ""}
                  onChange={setStartTimeCustomerTime}
                />
              </CaseField>
              <CaseField label={'End TIme (Customer)'} span={2}  lock={!canEditapo}>
                <DatePicker 
                  value={endTimeCustomerTime ? new Date(endTimeCustomerTime) : ""}
                  onChange={setEndTimeCustomerTime}
                />
              </CaseField>
              <CaseField label={'Estimated Arrival Time (Customer)'} span={2}   lock={!canEditapo}>
                <DatePicker 
                  value={estimatedArrivalTimeCustomerTime ? new Date(estimatedArrivalTimeCustomerTime) : ""}
                  onChange={setEstimatedArrivalTimeCustomerTime}
                />
              </CaseField>
              <CaseField label={'Actual Arrival Time (Customer)'} span={2}  lock={!canEditlg}>
                <DatePicker 
                  value={actualArrivalTimeCustomerTime ? new Date(actualArrivalTimeCustomerTime) : ""}
                  onChange={setActualArrivalTimeCustomerTime}
                />
              </CaseField>
            </CardContent>
          </Card>

 <Card className=" ">
            <CardHeader>
              <CardTitle className="text-lg ">SLA Jeopardy</CardTitle>
              <hr />
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-6">
              <CaseField label={'Schedule Jeopardy'} span={2} lock>
              <Input
                  type="text"
                  value={scheduleJeopardy}
                  onChange={(e) => setScheduleJeopardy(e.target.value)}
                  readOnly
                />
              </CaseField>
              <CaseField label={'Schedule Jeopardy Time'} span={2} lock>
                <DatePicker value={
                    scheduleJeopardyTime
                      ? new Date(scheduleJeopardyTime)
                      : ""
                  }
                  onChange={setScheduleJeopardyTime}></DatePicker>
              </CaseField> 
            </CardContent>
          </Card>
         
        </TabsContent>

        <TabsContent value="field_service">
          <Card className="flex-col ">
            <CardContent className="grid gap-5.5">
              <div className="flex font-bold">
                <Lock className="mr-2 size-5"></Lock>
                <span>Field Service</span>
                <span className="ml-40">...</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card className="flex-col mt-7 w-[500px]">
            <CardContent className="grid gap-5.5">
              <div className="flex font-bold">
                <Lock className="mr-2 size-5"></Lock>
                <span>Timeline</span>
                <span className="ml-40">...</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
    </div>
  );
}

// Fungsi pengecekan format dan isi dari RequestedDateTimeCustomer
const CheckRequestedDateTimeCustomer = async (rawDateTime) => {
  try {
    if (!rawDateTime || 
      !(rawDateTime instanceof Date) || 
      isNaN(rawDateTime.getTime())) {
      await Swal.fire({
        icon: 'warning',
        title: "Gagal membuat booking",
        text: "RequestedDateTimeCustomer belum diisi.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      return false;
    }

    const formatted = formatDateForInput(rawDateTime);
    console.log('Formatted:', formatted); //  Debug output

    const isValidFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(formatted);
    if (!isValidFormat) {
      await Swal.fire({
        icon: 'warning',
        title: "Gagal membuat booking",
        text: "Format RequestedDateTimeCustomer tidak valid.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      window.location.reload();
      return false;
    }

    const dateObj = new Date(rawDateTime);
    if (isNaN(dateObj.getTime())) {
      await Swal.fire({
        icon: 'warning',
        title: "Gagal membuat booking",
        text: "Nilai RequestedDateTimeCustomer tidak valid.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      window.location.reload();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saat validasi tanggal:', error);
    await Swal.fire({
      icon: 'error',
      title: "Terjadi kesalahan",
      text: "Kesalahan saat validasi RequestedDateTimeCustomer.",
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    window.location.reload();
    return false;
  }
};


export function NewBookableResourceBooking({ CaseID, WOID, CreatedBy, RequestedDateTimeCustomer}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      
      const isValid = await CheckRequestedDateTimeCustomer(RequestedDateTimeCustomer);
      console.log("Validasi result:", isValid);
      if (!isValid) return;

      
      const data = {
        WOID: WOID,
        CreatedBy: CreatedBy,
        user: getUserFromToken()
      }
      const response = await ApiCustomer.post('/api/bookings', data);
      const updateWorkLog = await ApiCustomer.post("/api/actionlog",{
        CaseId: `${CaseID}`,
        ReferenceId: `${data.WOID}`,
        model: "Work",
        dataOld: "OPEN_UNSCHEDULED",
        dataNew: "OPEN_SCHEDULED",
        changedBy: data.user.id,
        logDescription: `Edit : change status from OPEN_UNSCHEDULED to OPEN_SCHEDULED`
      })
      if (response.status === 201) {
        const { BookingId } = response.data;
        navigate(`/app/bookings/${BookingId}`);
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
      <Label className="text-red-400">*</Label>
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
