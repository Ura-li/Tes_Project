import React, { useState, useEffect } from "react";
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
import { KeyRound } from "lucide-react";
import { twMerge } from "tailwind-merge";

//import API
import ApiCustomer from "@/api";
const spanMap = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};
export const CaseField = ({ label, children, icon = false, span = 1, className, childClass }) => {
  // Determine which icon to use
  const IconComponent = icon === true ? Lock : icon || null;

  return (
    <>
      <CardTitle className={twMerge(
        `font-medium grid grid-cols-[1.25rem_auto] items-center gap-2 ${className}`
      )}>
        {IconComponent ? (
          <IconComponent className="size-4" />
        ) : (
          <div className="w-5" />
        )}
        {label}
      </CardTitle>
      <CardTitle className={twMerge(spanMap[span],childClass)}>
        {children}
      </CardTitle>
    </>
  );
};

export function QuickWOInput ({ WOID, caseInformation }) {
  // State untuk 8 field General
  // console.log('case_informtion in quick wo input : ', caseInformation)
  const [tab, setTab] = useState("Quick_WO_Input");
  const [incomingChannel, setIncomingChannel] = useState("");
  const [workOrderNumber, setWorkOrderNumber] = useState("");
  const [workOrderType, setWorkOrderType] = useState("");
  const [systemStatus, setSystemStatus] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [partnerStatus, setPartnerStatus] = useState("");
  const [workOrderDescription, setWorkOrderDescription] = useState("");
  const [workOrderInstruction, setWorkOrderInstruction] = useState("");

  //Service Delivery Address
  const [addressID, setAddressID] = useState(""); // nanti bisa jadi ID
  const [companyName, setCompanyName] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressLine3, setAddressLine3] = useState("");
  const [city, setCity] = useState("");
  const [stateOrProvince, setStateOrProvince] = useState("");
  const [countryOrRegion, setCountryOrRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [timezone, setTimezone] = useState("");
  const [serviceTerritory, setServiceTerritory] = useState("");
  const [businessSegment, setBusinessSegment] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  //SLA
  const [slaJeopardy, setSlaJeopardy] = useState("");
  const [dueDateCustomer, setDueDateCustomer] = useState("");
  const [coverageWindow, setCoverageWindow] = useState("");
  const [response, setResponse] = useState("");
  const [otcCode, setOtcCode] = useState("");
  const [requestedDateTimeCustomer, setRequestedDateTimeCustomer] = useState("");
  const [guaranteedFixTimeCustomer, setGuaranteedFixTimeCustomer] = useState("");
  const [earlyStartDateTimeCustomer, setEarlyStartDateTimeCustomer] = useState("");
  const [latestStartDateTimeCustomer, setLatestStartDateTimeCustomer] = useState("");
  const [slaReschedule, setSlaReschedule] = useState("");
  const [activeScheduleDate, setActiveScheduleDate] = useState("");
  const [slaErrorDescription, setSlaErrorDescription] = useState("");
  const [casePriorityIndex, setCasePriorityIndex] = useState("");

  //fetch data site_account
  const [siteAccountInformation, setSiteAccountInformation] = useState([])
  
  useEffect(() => {
    const fetchDataSiteAccounts = async () => {
      try {
        const res = await ApiCustomer.get(`/api/site_account/${caseInformation?.SiteAccountID}`)
        console.log('res in quick wo input : ',res)
        setSiteAccountInformation(res.data.data)
      } catch (error) {
        
      }
    }
    fetchDataSiteAccounts();
    console.log("Site Account Information : ",siteAccountInformation)
  }, [caseInformation?.SiteAccountID])

  // Fetch data awal
  useEffect(() => {
    if (!WOID) return;
    (async () => {
      const res = await ApiCustomer.get(`/api/work-order/${WOID}`);
      const wo = res.data.data; 
      setIncomingChannel(wo.IncomingChannel || "..."); 
      setWorkOrderNumber(wo.WorkOrderNumber || "...");
      setWorkOrderType(wo.WorkOrderType || "...");
      setSystemStatus(wo.SystemStatus || "...");
      setSubStatus(wo.SubStatus || "...");
      setPartnerStatus(wo.PartnerStatus || "...");
      setWorkOrderDescription(wo.WorkOrderDescription || "...");
      setWorkOrderInstruction(wo.WorkOrderInstruction || "...");

      //SLA
      setSlaJeopardy(wo.SLAJeopardy || "...");
      setDueDateCustomer(wo.DueDateCustomer || "...");
      setCoverageWindow(wo.CoverageWindow || "...");
      setResponse(wo.Response || "...");
      setOtcCode(wo.OTCCode || "...");
      setRequestedDateTimeCustomer(wo.RequestedDateTimeCustomer || "...");
      setGuaranteedFixTimeCustomer(wo.GuaranteedFixTimeCustomer || "...");
      setEarlyStartDateTimeCustomer(wo.EarlyStartDateTimeCustomer || "...");
      setLatestStartDateTimeCustomer(wo.LatestStartDateTimeCustomer || "...");
      setSlaReschedule(wo.SLAReschedule || "...");
      setActiveScheduleDate(wo.ActiveScheduleDate || "...");
      setSlaErrorDescription(wo.SLAErrorDescription || "...");
      setCasePriorityIndex(wo.CasePriorityIndex?.toString() || "...");

      //Service Delivery Address
      const res2 = await ApiCustomer.get(`/api/workorder/${WOID}/service-address`);
      const address = res2.data.data;

      setAddressID(address.AddressID || "");
      setCompanyName(address.CompanyName || "");
      setContactFirstName(address.ContactFirstName || "");
      setContactLastName(address.ContactLastName || "");
      setPhoneNumber(address.PhoneNumber || "");
      setEmail(address.Email || "");
      setAddressLine1(address.AddressLine1 || "");
      setAddressLine2(address.AddressLine2 || "");
      setAddressLine3(address.AddressLine3 || "");
      setCity(address.City || "");
      setStateOrProvince(address.StateOrProvince || "");
      setCountryOrRegion(address.CountryOrRegion || "");
      setPostalCode(address.PostalCode || "");
      setTimezone(address.TimeZone || "");
      setServiceTerritory(address.ServiceTerritory || "");
      setBusinessSegment(address.BusinessSegment || "");
      setLongitude(address.Longitude || "");
      setLatitude(address.Latitude || "");
    })();
  }, [WOID]);

  // Simpel update PATCH
  const handleSave = async () => {
    await ApiCustomer.patch(`/api/workorder/${WOID}`, {
      WorkOrderType: workOrderType,
      SubStatus: subStatus,
      PartnerStatus: partnerStatus,
      CoverageWindow: coverageWindow,
      OTCCode: otcCode,
      RequestedDateTimeCustomer: requestedDateTimeCustomer,
    });

    // Simpan Service Delivery Address
    await ApiCustomer.patch(`/api/workorder/${WOID}/service-address`, {
      ContactFirstName: contactFirstName,
      PhoneNumber: phoneNumber,
      Email: email,
      City: city,
    });
  };

  return (
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsContent value="Quick_WO_Input">
            <Card className="flex-col mt-7">
              <span className="ml-5 font-bold text-xl">General</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-4">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Incoming Channel</span>
                  <Input className="ml-40" value={incomingChannel} readOnly/>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Work Order Number</span>
                  <Input className="ml-40" value={WOID} readOnly/>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Work Order Type</span>
                  <Input className="ml-40" value={workOrderType} onChange={e => setWorkOrderType(e.target.value)} />
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>System Status</span>
                  <Input className="ml-40" value={systemStatus} readOnly/>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Sub Status</span>
                  <Input className="ml-40" value={subStatus} onChange={e => setSubStatus(e.target.value)} />
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Partner Status</span>
                  <Input className="ml-40" value={partnerStatus} onChange={e => setPartnerStatus(e.target.value)} />
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Work Order Description</span>
                  <Input className="ml-40" value={workOrderDescription} readOnly/>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Work Order Instruction</span>
                  <Input className="ml-40" value={workOrderInstruction} readOnly/>
                </div>
              </CardContent>
            </Card>

            {/* 
            TODO :
            Make this available in Contact Individual
            */}
            <Card className="flex-col mt-7">  
              <span className="ml-5 font-bold text-xl">Service Delivery Address</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-9">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Choose Address</span>
                  <span className="ml-45">Site Account address</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Company Name</span>
                  <span className="ml-45">{siteAccountInformation.Company}</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Contact First Name</span>
                  <Input className="ml-40" value={contactFirstName} onChange={e => setContactFirstName(e.target.value)}/>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Contact Last Name</span>
                  <span className="ml-40">{contactLastName}</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Phone Number</span>
                  <Input className="ml-47" value={siteAccountInformation.PrimaryPhone || siteAccountInformation.WhatsappNo} onChange={e => setPhoneNumber(e.target.value)}/>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Email Address</span>
                  <Input className="ml-49" value={siteAccountInformation.Email} onChange={e => setEmail(e.target.value)}/>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Address Line1</span>
                  <span className="ml-49">{siteAccountInformation.AddressLine1}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Address Line2</span>
                  <span className="ml-49">{siteAccountInformation.AddressLine2}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Address Line3</span>
                  <span className="ml-49">{addressLine3}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>City</span>
                  <span className="ml-70">{siteAccountInformation.City}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>State Or Province</span>
                  <span className="ml-44.5">{siteAccountInformation.StateProvince}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Country/Region</span>
                  <span className="ml-47">{siteAccountInformation.Country}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Postal Code</span>
                  <span className="ml-55">{siteAccountInformation.ZipPostalCode}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Timezone</span>
                  <span className="ml-59">{timezone}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Service Territory</span>
                  <span className="ml-46.5">{serviceTerritory}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Business Segment</span>
                  <span className="ml-42">{businessSegment}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Longitude</span>
                  <span className="ml-58.5">{longitude}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2" />
                  <span>Latitude</span>
                  <span className="ml-62">{latitude}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-col mt-7 ">
              <span className="ml-5 font-bold text-xl">SLA in Customer Time Zone</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-7">
                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>SLA Jeopardy</span>
                  <span className="ml-66">{slaJeopardy}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Due Date (Customer)</span>
                  <span className="ml-52">{dueDateCustomer}</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Coverage Window</span>
                  <Input className="ml-57" value={coverageWindow} onChange={e => setCoverageWindow(e.target.value)}/>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Response</span>
                  <span className="ml-74">{response}</span>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">OTC Code</span>
                  <Input className="ml-73.5" value={otcCode} onChange={e => setOtcCode(e.target.value)}/>
                </div>

                <div className="font-bold flex">
                  <span className="ml-7">Requested Date Time (Customer)</span>
                  <input 
                    type="datetime-local"
                    className="ml-6 p-2 rounded border border-gray-300" 
                    value={requestedDateTimeCustomer ? requestedDateTimeCustomer.slice(0, 16) : ""}
                    onChange={e => {
                      const localDateTime = e.target.value;
                      const isoDateTime = new Date(localDateTime).toISOString();
                      setRequestedDateTimeCustomer(isoDateTime);
                    }}
                  />
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Guaranteed Fix Time (Customer)</span>
                  <span className="ml-31">{guaranteedFixTimeCustomer}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Early Start Date Time (Customer)</span>
                  <span className="ml-32">{earlyStartDateTimeCustomer}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Latest Start Date Time (Customer)</span>
                  <span className="ml-30">{latestStartDateTimeCustomer}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>SLA Reschedule</span>
                  <span className="ml-64.5">{slaReschedule}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Active Schedule Date</span>
                  <span className="ml-54.5">{activeScheduleDate}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>SLA Error Description</span>
                  <span className="ml-54">{slaErrorDescription}</span>
                </div>

                <div className="font-bold flex">
                  <Lock className="size-5 mr-2"></Lock>
                  <span>Case Priority Index</span>
                  <span className="ml-59">{casePriorityIndex}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </CardContent>
  );
};
