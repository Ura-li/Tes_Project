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
import DatePicker from "./date-picker";
// import { CaseField } from "./service-case";
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
  const readOnly = icon === "lock";
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


export function QuickWOInput ({ 
  WOID, 
  workOrderData, 
  caseInformation,
  SLA,
  setSLA
}) {
  // State untuk 8 field General
  // console.log('case_informtion in quick wo input : ', caseInformation)
  const [tab, setTab] = useState("Quick_WO_Input");
  const [general, setGeneral] = useState({
    incomingChannel: "",
    workOrderNumber: "",
    workOrderType: "",
    systemStatus: "",
    subStatus: "",
    partnerStatus: "",
    workOrderDescription: "",
    workOrderInstruction: "",
  });

  const handleChangeGeneral = (field) => (e) => {
    setGeneral((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  // const [incomingChannel, setIncomingChannel] = useState("");
  // const [workOrderNumber, setWorkOrderNumber] = useState("");
  // const [workOrderType, setWorkOrderType] = useState("");
  // const [systemStatus, setSystemStatus] = useState("");
  // const [subStatus, setSubStatus] = useState("");
  // const [partnerStatus, setPartnerStatus] = useState("");
  // const [workOrderDescription, setWorkOrderDescription] = useState("");
  // const [workOrderInstruction, setWorkOrderInstruction] = useState("");

  //Service Delivery Address
  const [addressID, setAddressID] = useState(""); // nanti bisa jadi ID

  const [ServiceDeliveryAddress, setServiceDeliveryAddress] = useState({
    companyName: "",
    contactFirstName: "",
    contactLastName: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    stateOrProvince: "",
    countryOrRegion: "",
    postalCode: "",
    timezone: "",
    serviceTerritory: "",
    businessSegment: "",
    longitude: "",
    latitude: "",
  });

  const handleChangeServciceDeliveryAddress = (field) => (e) => {
    setServiceDeliveryAddress((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }
  
  // const [companyName, setCompanyName] = useState("");
  // const [contactFirstName, setContactFirstName] = useState("");
  // const [contactLastName, setContactLastName] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [email, setEmail] = useState("");
  // const [addressLine1, setAddressLine1] = useState("");
  // const [addressLine2, setAddressLine2] = useState("");
  // const [addressLine3, setAddressLine3] = useState("");
  // const [city, setCity] = useState("");
  // const [stateOrProvince, setStateOrProvince] = useState("");
  // const [countryOrRegion, setCountryOrRegion] = useState("");
  // const [postalCode, setPostalCode] = useState("");
  // const [timezone, setTimezone] = useState("");
  // const [serviceTerritory, setServiceTerritory] = useState("");
  // const [businessSegment, setBusinessSegment] = useState("");
  // const [longitude, setLongitude] = useState("");
  // const [latitude, setLatitude] = useState("");

  //SLA
  

  const handleChangeSLA = (field) => (e) => {
    setSLA((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  // const [slaJeopardy, setSlaJeopardy] = useState("");
  // const [dueDateCustomer, setDueDateCustomer] = useState("");
  // const [coverageWindow, setCoverageWindow] = useState("");
  // const [response, setResponse] = useState("");
  // const [otcCode, setOtcCode] = useState("");
  // const [requestedDateTimeCustomer, setRequestedDateTimeCustomer] = useState("");
  // const [guaranteedFixTimeCustomer, setGuaranteedFixTimeCustomer] = useState("");
  // const [earlyStartDateTimeCustomer, setEarlyStartDateTimeCustomer] = useState("");
  // const [latestStartDateTimeCustomer, setLatestStartDateTimeCustomer] = useState("");
  // const [slaReschedule, setSlaReschedule] = useState("");
  // const [activeScheduleDate, setActiveScheduleDate] = useState("");
  // const [slaErrorDescription, setSlaErrorDescription] = useState("");
  // const [casePriorityIndex, setCasePriorityIndex] = useState("");

  //fetch data site_account
  const [siteAccountInformation, setSiteAccountInformation] = useState([])
  
  useEffect(() => {
    const fetchDataSiteAccounts = async () => {
      try {
        
        console.log('res in quick wo input : ',caseInformation.site_account)
        setSiteAccountInformation(caseInformation.site_account)
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
      const wo = workOrderData; 
      const siteAccount = caseInformation.site_account;
      const contact = caseInformation.contact_information; 
      setGeneral({
        incomingChannel: wo.IncomingChannel || "...",
        workOrderNumber: wo.WorkOrderNumber || "...",
        workOrderType: wo.WorkOrderType || "...",
        systemStatus: wo.SystemStatus || "...",
        subStatus: wo.SubStatus || "...",
        partnerStatus: wo.PartnerStatus || "...",
        workOrderDescription: wo.WorkOrderDescription || "...",
        workOrderInstruction: wo.WorkOrderInstruction || "...",
      })
      // setIncomingChannel(wo.IncomingChannel || "..."); 
      // setWorkOrderNumber(wo.WorkOrderNumber || "...");
      // setWorkOrderType(wo.WorkOrderType || "...");
      // setSystemStatus(wo.SystemStatus || "...");
      // setSubStatus(wo.SubStatus || "...");
      // setPartnerStatus(wo.PartnerStatus || "...");
      // setWorkOrderDescription(wo.WorkOrderDescription || "...");
      // setWorkOrderInstruction(wo.WorkOrderInstruction || "...");

      //SLA
      // setSLA({
      //   slaJeopardy: wo.SLAJeopardy || "...",
      //   dueDateCustomer: wo.DueDateCustomer || "...",
      //   coverageWindow: wo.CoverageWindow || "...",
      //   response: wo.Response || "...",
      //   otcCode: wo.OTCCode || "...",
      //   requestedDateTimeCustomer: wo.RequestedDateTimeCustomer || "...",
      //   guaranteedFixTimeCustomer: wo.GuaranteedFixTimeCustomer || "...",
      //   earlyStartDateTimeCustomer: wo.EarlyStartDateTimeCustomer || "...",
      //   latestStartDateTimeCustomer: wo.LatestStartDateTimeCustomer || "...",
      //   slaReschedule: wo.SLAReschedule || "...",
      //   activeScheduleDate: wo.ActiveScheduleDate || "...",
      //   slaErrorDescription: wo.SLAErrorDescription || "...",
      //   casePriorityIndex: wo.CasePriorityIndex?.toString() || "...",
      // })

      // setSlaJeopardy(wo.SLAJeopardy || "...");
      // setDueDateCustomer(wo.DueDateCustomer || "...");
      // setCoverageWindow(wo.CoverageWindow || "...");
      // setResponse(wo.Response || "...");
      // setOtcCode(wo.OTCCode || "...");
      // setRequestedDateTimeCustomer(wo.RequestedDateTimeCustomer || "...");
      // setGuaranteedFixTimeCustomer(wo.GuaranteedFixTimeCustomer || "...");
      // setEarlyStartDateTimeCustomer(wo.EarlyStartDateTimeCustomer || "...");
      // setLatestStartDateTimeCustomer(wo.LatestStartDateTimeCustomer || "...");
      // setSlaReschedule(wo.SLAReschedule || "...");
      // setActiveScheduleDate(wo.ActiveScheduleDate || "...");
      // setSlaErrorDescription(wo.SLAErrorDescription || "...");
      // setCasePriorityIndex(wo.CasePriorityIndex?.toString() || "...");

      //Service Delivery Address
      // const res2 = await ApiCustomer.get(`/api/workorder/${WOID}/service-address`);
      // const address = res2.data.data;


      // setAddressID(siteAccount.SiteAccountID || "---");
      // setCompanyName(siteAccount.Company || "---");
      // setContactFirstName(contact.FirstName || "---");
      // setContactLastName(contact.LastName || "---");
      // setPhoneNumber(siteAccount.PrimaryPhone || contact.Phone || "---");
      // setEmail(siteAccount.Email || contact.Email || "---");
      // setAddressLine1(siteAccount.AddressLine1 || contact.AddressLine1 || "---");
      // setAddressLine2(siteAccount.AddressLine2 || contact.AddressLine2 || "---");
      // setAddressLine3("---");
      // setCity(siteAccount.City || contact.City || "---");
      // setStateOrProvince(siteAccount.StateProvince || contact.StateProvince || "---");
      // setCountryOrRegion(siteAccount.Country || contact.Country || "---");
      // setPostalCode(siteAccount.ZipPostalCode || contact.ZipPostalCode || "---");
      // setTimezone("---");
      // setServiceTerritory("---");
      // setBusinessSegment("---");
      // setLongitude("---");
      // setLatitude( "---");
      setServiceDeliveryAddress({
        companyName: siteAccount.Company || "---",
        contactFirstName: contact.FirstName || "---",
        contactLastName: contact.LastName || "---",
        phoneNumber: siteAccount.PrimaryPhone || contact.Phone || "---",
        email: siteAccount.Email || contact.Email || "---",
        addressLine1: siteAccount.AddressLine1 || contact.AddressLine1  || "---",
        addressLine2: siteAccount.AddressLine2 || contact.AddressLine2  || "---",
        addressLine3: "---",
        city: siteAccount.City || contact.City || "---",
        stateOrProvince: siteAccount.StateProvince || contact.StateProvince || "---",
        countryOrRegion: siteAccount.Country || contact.Country || "---",
        postalCode: siteAccount.ZipPostalCode || contact.ZipPostalCode || "---",
        timezone: "---",
        serviceTerritory:  "---",
        businessSegment: "---",
        longitude:  "---",
        latitude: "---",
      })

      setAddressID(siteAccount.SiteAccountID || "---" );
      // setCompanyName(address.CompanyName || "---");
      // setContactFirstName(address.ContactFirstName || "---");
      // setContactLastName(address.ContactLastName || "---");
      // setPhoneNumber(address.PhoneNumber || "---");
      // setEmail(address.Email || "---");
      // setAddressLine1(address.AddressLine1 || "---");
      // setAddressLine2(address.AddressLine2 || "---");
      // setAddressLine3(address.AddressLine3 || "---");
      // setCity(address.City || "---");
      // setStateOrProvince(address.StateOrProvince || "---");
      // setCountryOrRegion(address.CountryOrRegion || "---");
      // setPostalCode(address.PostalCode || "---");
      // setTimezone(address.TimeZone || "---");
      // setServiceTerritory(address.ServiceTerritory || "---");
      // setBusinessSegment(address.BusinessSegment || "---");
      // setLongitude(address.Longitude || "---");
      // setLatitude(address.Latitude || "---");
    })();
  }, [WOID]);

  const handleSLAChange = (field) => (value) => {
    setSLA((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  console.log("SLA IN QUICK WO INPUT : ",SLA)
  // Simpel update PATCH
  // const handleSave = async () => {
  //   await ApiCustomer.patch(`/api/work-order/${WOID}`, {
  //     WorkOrderType: general.workOrderType,
  //     SubStatus: general.subStatus,
  //     PartnerStatus: general.partnerStatus,
  //     CoverageWindow: SLA.coverageWindow,
  //     OTCCode: SLA.otcCode,
  //     RequestedDateTimeCustomer: SLA.requestedDateTimeCustomer,
  //   });

  //   // Simpan Service Delivery Address
  //   // await ApiCustomer.patch(`/api/workorder/${WOID}/service-address`, {
  //   //   ContactFirstName: ServiceDeliveryAddress.contactFirstName,
  //   //   PhoneNumber: ServiceDeliveryAddress.phoneNumber,
  //   //   Email: ServiceDeliveryAddress.email,
  //   //   City: ServiceDeliveryAddress.city,
  //   // });
  // };

  return (
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsContent value="Quick_WO_Input">
            <Card className="flex-col ">
              <CardHeader>
                <CardTitle className=' text-lg'>General</CardTitle>
                <hr />
              </CardHeader>

            <CardContent className="flex gap-5">
              <div className="grid grid-cols-6 gap-5 flex-1">
                <div className="border-1 col-span-6 grid grid-cols-6 p-4">
                  <CaseField label="Incoming Channel" className={'col-span-2'} icon span={4}>
                    <Input variant={'invisible'} className="" 
                    value={general.incomingChannel} onChange={handleChangeGeneral('incomingChannel')} readOnly/> </CaseField>
                </div>
                <CaseField label="Work Order Number" className={'col-span-2 '} icon span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.workOrderNumber} readOnly /></CaseField>
                <CaseField label="Work Order Type" className={'col-span-2'} span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.workOrderType} onChange={handleChangeGeneral('workOrderType')} /> </CaseField>
                <CaseField label="System Status" className={'col-span-2'} span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.systemStatus} readOnly /> </CaseField>
                <CaseField label="Sub Status" className={'col-span-2'} icon={KeyRound} span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.subStatus} onChange={handleChangeGeneral('subStatus')} /> </CaseField>
                <CaseField label="Partner Status" className={'col-span-2'} icon span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.partnerStatus} readOnly/> </CaseField>
              </div>

              <div className="grid grid-cols-6 items-start justify-start flex-1 content-start gap-5">
                <CaseField label="Work Order Description" className={'col-span-2'} icon span={4}>
                   <Input variant={'invisible'} className="" value={general.workOrderDescription} readOnly /> </CaseField>
                <CaseField label="Work Order Instruction" className={'col-span-2'} icon span={4}>
                   <Input variant={'invisible'} className="" value={general.workOrderInstruction} readOnly /> </CaseField>

              </div>
            </CardContent>
            </Card>

            {/* 
            TODO :
            Make this available in Contact Individual
            */}
            <Card className="flex-col mt-7">  
              <CardHeader>
                <CardTitle className=' text-lg'>Service Delivery Address</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid gap-5 grid-cols-6">
                <CaseField label="Choose Address" className={''}  >Site Account address</CaseField>
                <CaseField label="Address Line1" className={''}  > <Input variant={'invisible'} className=" " value={ServiceDeliveryAddress.addressLine1} readOnly/> </CaseField>
                <CaseField label="Postal Code" className={''}  > <Input variant={'invisible'}  className="" value={ServiceDeliveryAddress.postalCode} readOnly/> </CaseField>
                <CaseField label="Company Name" className={''}  > <Input variant={'invisible'} className="" value={siteAccountInformation.Company} readOnly/> </CaseField>
                <CaseField label="Address Line2" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.addressLine2} readOnly/> </CaseField>
                <CaseField label="Timezone" className={''} icon > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.timezone} readOnly/> </CaseField>
                <CaseField label="Contact First Name" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.contactFirstName} onChange={e => setContactFirstName(e.target.value)} /> </CaseField>
                <CaseField label="Address Line3" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.addressLine3} onChange={e => setAddressLine3(e.target.value)} /> </CaseField>
                <CaseField label="Service Territory" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.serviceTerritory} readOnly/> </CaseField>
                <CaseField label="Contact Last Name" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.contactLastName} readOnly/> </CaseField>
                <CaseField label="City" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.city} readOnly/> </CaseField>
                <CaseField label="Business Segment" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.businessSegment} readOnly/> </CaseField>
                <CaseField label="Phone Number" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.phoneNumber} onChange={e => setPhoneNumber(e.target.value)} /> </CaseField>
                <CaseField label="State Or Province" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.stateOrProvince} readOnly/> </CaseField>
                <CaseField label="Longitude" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.longitude} readOnly/> </CaseField>
                <CaseField label="Email Address" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.email} onChange={e => setEmail(e.target.value)} /> </CaseField>
                <CaseField label="Country/Region" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.countryOrRegion} readOnly/> </CaseField>
                <CaseField label="Latitude" className={''}  > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.latitude} readOnly/> </CaseField>
              </CardContent>
            </Card>

            <Card className="flex-col mt-7 ">
              <CardHeader>
                <CardTitle className=' text-lg'>SLA in Customer Time Zone</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid gap-5 auto-rows-auto grid-cols-6 place-content-between">
                <CaseField label="SLA Jeopardy" className={''} icon > <Input className="" value={SLA.slaJeopardy} readOnly/> </CaseField>
                <CaseField label="Requested Date Time (Customer)" className={''}>
                  <DatePicker
                    value={SLA.requestedDateTimeCustomer ? new Date(SLA.requestedDateTimeCustomer) : null}
                    onChange={handleSLAChange("requestedDateTimeCustomer")}
                  />
                </CaseField>

                <CaseField label="SLA Reschedule" className={''} icon > <Input className="" value={SLA.slaReschedule} readOnly/> </CaseField>
                <CaseField label="Due Date (Customer)" className={''} icon >
                  <DatePicker></DatePicker>
                </CaseField>
                <CaseField label="Guaranteed Fix Time (Customer)" className={''} icon >
                  <DatePicker></DatePicker>
                </CaseField>
                <CaseField label="Active Schedule Date" className={''} icon > <Input className="" value={SLA.activeScheduleDate} readOnly/> </CaseField>
                <CaseField label="Coverage Window" className={''}  > <Input className="" value={SLA.coverageWindow} onChange={e => setCoverageWindow(e.target.value)} /> </CaseField>
                <CaseField label="Early Start Date Time (Customer)" className={''}  >
                  <DatePicker
                  value={SLA.earlyStartDateTimeCustomer ? new Date(SLA.earlyStartDateTimeCustomer) : null}
                  onChange={handleSLAChange("earlyStartDateTimeCustomer")}
                  ></DatePicker>
                </CaseField>
                <CaseField label="SLA Error Description" className={'row-span-2 items-start'} childClass={'row-span-2'} icon >
                   <textarea value={SLA.slaErrorDescription} className='border-0 ring-0 ring-gray-400 w-[100%] h-[100%] resize-none'></textarea>
                </CaseField>
                <CaseField label="Response" className={''}  > <Input className="" value={SLA.response} readOnly/> </CaseField>
                <CaseField label="Latest Start Date Time (Customer)" className={''}  > 
                  <DatePicker></DatePicker>
                </CaseField>
                <CaseField label="OTC Code" className={''}  > <Input className="" value={SLA.otcCode} onChange={e => setOtcCode(e.target.value)} /> </CaseField>
                <CaseField label="Case Priority Index" className={'col-start-5'} icon > <Input className="" value={SLA.casePriorityIndex} readOnly/> </CaseField>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-end">
          {/* <Button onClick={handleSave}>Save</Button> */}
        </CardFooter>
      </CardContent>
  );
};
