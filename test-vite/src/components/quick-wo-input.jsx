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
import { SearchCommandBlock, SelectBarRelated } from "./sc-select";
import { Car, Lock, Plus, LockOpen } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { KeyRound } from "lucide-react";
import { twMerge } from "tailwind-merge";

//import API
import ApiCustomer from "@/api";
import DatePicker from "./date-picker";
import CaseField from "./CaseField";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/context/auth-context";
// import { CaseField } from "./service-case";
const spanMap = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};



export function QuickWOInput ({ 
  WOID, 
  workOrderData, 
  caseInformation,
  SLA,
  setSLA,
  WOGeneral,
  setWOGeneral
}) {
  // State untuk 8 field General
  const [tab, setTab] = useState("wo_input");
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
    setWOGeneral((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

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
  
  //SLA
  const handleChangeSLA = (field) => (e) => {
    setSLA((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

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

  const [mainAccount, setMainAccount] = useState({
    MainAccount: null,
    SiteAccount: null,
    Type: ""
  });
  // Fetch data awal
  useEffect(() => {
    if (!WOID) return;
    (async () => {
      const wo = workOrderData; 
      
      const contact = caseInformation.contact_information; 
      setMainAccount({
        MainAccount: contact,
      });

      const siteAccount = caseInformation.site_account;
      // Build the mainAccount object locally
      const newMainAccount = {
        MainAccount: contact,
        SiteAccount: siteAccount || null,
        Type: siteAccount ? "SiteAccount" : "Individual",
      };

      setGeneral(prev => ({
        ...prev,
        incomingChannel: prev.incomingChannel || wo.IncomingChannel || "...",
        workOrderNumber: wo.WorkOrderNumber || "...",
        workOrderType: wo.WorkOrderType || "...",
        systemStatus: wo.SystemStatus || "...",
        subStatus: wo.SubStatus || "...",
        partnerStatus: wo.PartnerStatus || "...",
        workOrderDescription: wo.WorkOrderDescription || "...",
        workOrderInstruction: wo.WorkOrderInstruction || "...",
      }));
      setMainAccount(newMainAccount);
      console.log("Main Account : ",mainAccount);

    // Now you can safely use newMainAccount
      setServiceDeliveryAddress({
        companyName: siteAccount?.Company || "---",
        contactFirstName: contact?.FirstName || "---",
        contactLastName: contact?.LastName || "---",
        phoneNumber: siteAccount?.PrimaryPhone || contact?.Phone || "---",
        email: siteAccount?.Email || contact?.Email || "---",
        addressLine1: siteAccount?.AddressLine1 || contact?.AddressLine1 || "---",
        addressLine2: siteAccount?.AddressLine2 || contact?.AddressLine2 || "---",
        addressLine3: "---",
        city: siteAccount?.City || contact?.City || "---",
        stateOrProvince: siteAccount?.StateProvince || contact?.StateProvince || "---",
        countryOrRegion: siteAccount?.Country || contact?.Country || "---",
        postalCode: siteAccount?.ZipPostalCode || contact?.ZipPostalCode || "---",
        timezone: "---",
        serviceTerritory: "---",
        businessSegment: "---",
        longitude: "---",
        latitude: "---",
      });

      setAddressID(siteAccount?.SiteAccountID || "---");
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

  // //   // Simpan Service Delivery Address
  // //   // await ApiCustomer.patch(`/api/workorder/${WOID}/service-address`, {
  // //   //   ContactFirstName: ServiceDeliveryAddress.contactFirstName,
  // //   //   PhoneNumber: ServiceDeliveryAddress.phoneNumber,
  // //   //   Email: ServiceDeliveryAddress.email,
  // //   //   City: ServiceDeliveryAddress.city,
  // //   // });
  // };
  const user = useAuth();
  let canEdit 
  const editrole = ['admin','ce','celead']

  if (workOrderData.SystemStatus !== "CLOSED_POSTED") {
    canEdit = editrole.includes(user?.role)
  }else {
    canEdit = true;
  }

  return (
    <div className="p-1">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsContent value="wo_input" >
            <Card className="flex-col" hidden>
              <CardHeader>
                <CardTitle className='text-lg '>General</CardTitle>
                <hr />
              </CardHeader>

            <CardContent className="flex gap-5">
              <div className="grid flex-1 grid-cols-6 gap-5">
                <div className="grid grid-cols-6 col-span-6 p-4 border-1">
                  <CaseField label="Incoming Channel" className={'col-span-2'} lock span={4}>
                    <Input variant={'invisible'} className="" 
                    value={WOGeneral.IncomingChannel} onChange={handleChangeGeneral('IncomingChannel')}/> </CaseField>
                </div>
                <CaseField label="Work Order Number" className={'col-span-2 '} lock span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.workOrderNumber}  /></CaseField>
                <CaseField label="Work Order Type" className={'col-span-2'} span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.workOrderType} onChange={handleChangeGeneral('workOrderType')} /> </CaseField>
                <CaseField label="System Status" className={'col-span-2'} span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.systemStatus}  /> </CaseField>
                <CaseField label="Sub Status" className={'col-span-2'} lock={KeyRound} span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.subStatus} onChange={handleChangeGeneral('subStatus')} /> </CaseField>
                <CaseField label="Partner Status" className={'col-span-2'} lock span={4}>
                  <Input variant={'invisible'} className="" 
                    value={general.partnerStatus} /> </CaseField>
              </div>

              <div className="grid items-start content-start justify-start flex-1 grid-cols-6 gap-5">
                <CaseField label="Work Order Description" className={'col-span-2'} lock span={4}>
                   <Input variant={'invisible'} className="" value={general.workOrderDescription}  /> </CaseField>
                <CaseField label="Work Order Instruction" className={'col-span-2'} lock span={4}>
                   <Input variant={'invisible'} className="" value={general.workOrderInstruction}  /> </CaseField>

              </div>
            </CardContent>
            </Card>

            {/* 
            TODO :
            Make this available in Contact Individual
            */}
            <Card className="flex-col">  
              <CardHeader>
                <CardTitle className='text-lg'>Service Delivery Address</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid grid-cols-6 gap-5 m-1">
                <CaseField label="Choose Address" className={''} lock ><Input variant={'invisible'} value="Site Account address"/></CaseField>
                <CaseField label="Address Line1" className={''}  lock> <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.addressLine1} readOnly/> </CaseField>
                <CaseField label="Postal Code" className={''}  lock> <Input variant={'invisible'}  className="" value={ServiceDeliveryAddress.postalCode} readOnly/> </CaseField>
                <CaseField label="Company Name" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.companyName} readOnly/> </CaseField>
                <CaseField label="Address Line2" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.addressLine2} readOnly/> </CaseField>
                <CaseField label="Timezone" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.timezone} readOnly/> </CaseField>
                <CaseField label="Contact First Name" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.contactFirstName} onChange={e => handleChangeServciceDeliveryAddress(e.target.value)} /> </CaseField>
                <CaseField label="Address Line3" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.addressLine3} onChange={e => handleChangeServciceDeliveryAddress(e.target.value)} /> </CaseField>
                <CaseField label="Service Territory" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.serviceTerritory} readOnly/> </CaseField>
                <CaseField label="Contact Last Name" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.contactLastName} readOnly/> </CaseField>
                <CaseField label="City" className={''}  lock> <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.city} readOnly/> </CaseField>
                <CaseField label="Business Segment" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.businessSegment} readOnly/> </CaseField>
                <CaseField label="Phone Number" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.phoneNumber} onChange={e => handleChangeServciceDeliveryAddress(e.target.value)} /> </CaseField>
                <CaseField label="State Or Province" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.stateOrProvince} readOnly/> </CaseField>
                <CaseField label="Longitude" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.longitude} readOnly/> </CaseField>
                <CaseField label="Email Address" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.email} onChange={e => handleChangeServciceDeliveryAddress(e.target.value)} /> </CaseField>
                <CaseField label="Country/Region" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.countryOrRegion} readOnly/> </CaseField>
                <CaseField label="Latitude" className={''} lock > <Input variant={'invisible'} className="" value={ServiceDeliveryAddress.latitude} readOnly/> </CaseField>
              </CardContent>
            </Card>

            <Card className="flex-col mt-7" hidden>
              <CardHeader>
                <CardTitle className='text-lg '>SLA in Customer Time Zone</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid grid-cols-6 gap-5 auto-rows-auto place-content-between">
                <CaseField label="SLA Jeopardy" className={''} lock > <Input className="" value={SLA.slaJeopardy} /> </CaseField>
                <CaseField star label="Requested Date Time (Customer)">
                  <DatePicker
                    value={SLA.requestedDateTimeCustomer ? new Date(SLA.requestedDateTimeCustomer) : null}
                    onChange={handleSLAChange("requestedDateTimeCustomer")}
                  />
                </CaseField>

                <CaseField label="SLA Reschedule" className={''} lock > <Input className="" value={SLA.slaReschedule} /> </CaseField>
                <CaseField label="Due Date (Customer)" className={''} lock >
                  <DatePicker></DatePicker>
                </CaseField>
                <CaseField label="Guaranteed Fix Time (Customer)" className={''} lock >
                  <DatePicker></DatePicker>
                </CaseField>
                <CaseField label="Active Schedule Date" className={''} lock > <Input className="" value={SLA.activeScheduleDate} /> </CaseField>
                <CaseField label="Coverage Window" className={''}  > <Input className="" value={SLA.coverageWindow} onChange={e => handleChangeServciceDeliveryAddress(e.target.value)} /> </CaseField>
                <CaseField label="Early Start Date Time (Customer)" className={''}  >
                  <DatePicker
                  value={SLA.earlyStartDateTimeCustomer ? new Date(SLA.earlyStartDateTimeCustomer) : null}
                  onChange={handleSLAChange("earlyStartDateTimeCustomer")}
                  ></DatePicker>
                </CaseField>
                <CaseField label="SLA Error Description" className={'row-span-2 items-start'} childClass={'row-span-2'} lock >
                   <textarea value={SLA.slaErrorDescription} className='border-0 ring-0 ring-gray-400 w-[100%] h-[100%] resize-none'></textarea>
                </CaseField>
                <CaseField label="Response" className={''}  > <Input className="" value={SLA.response} readOnly/> </CaseField>
                <CaseField label="Latest Start Date Time (Customer)" className={''}  > 
                  <DatePicker></DatePicker>
                </CaseField>
                <CaseField label="OTC Code" className={''}  > <Input className="" value={SLA.otcCode} onChange={e => handleChangeServciceDeliveryAddress(e.target.value)} /> </CaseField>
                <CaseField label="Case Priority Index" className={'col-start-5'} lock > <Input className="" value={SLA.casePriorityIndex} readOnly/> </CaseField>
              </CardContent>
            </Card>

            <Card className={"mt-5"}>
              <CardHeader>
                <CardTitle className={"text-lg"}>Repair Action</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className={"grid grid-cols-4 gap-2"}>
                <CaseField label={"Problem category"} star lock={canEdit}>
                  <SearchCommandBlock
                  options={[
                    "Hardware",
                    "Software"
                  ]}
                  />
                </CaseField>
                <CaseField label={"Delay code"} star lock={canEdit}>
                  <SearchCommandBlock

                  />
                </CaseField>
                <CaseField label={"Service type"} star lock={canEdit}>
                  <SearchCommandBlock
                  options={[
                    "Cancel Repair",
                    "CID (Customer Induce Damage)",
                    "DOA Remanufacture / Refurbishment",
                    "DOA Verified Defective",
                    "DOA Verified NTF",
                    "NFF (No Failure Found)",
                    "Rebuild Hardware",
                    "Rerepair",
                    "Standard Replacement / Failure (Part Used)",
                    "Third Part Related"
                  ]}
                  />
                </CaseField>
                <CaseField label={"NMU"} star lock={canEdit}>
                  <SearchCommandBlock
                  />
                </CaseField>
                <CaseField label={"NMU item"} star lock={canEdit}>
                  <SearchCommandBlock
                  />
                </CaseField>
                <CaseField label={"Defec desc"} star lock={canEdit}>
                  <Textarea/>
                </CaseField>
                <CaseField label={"CE analysis"} star lock={canEdit}>
                  <Textarea/>
                </CaseField>
                <CaseField label={"Repair Action"} star lock={canEdit}>
                  <Textarea/>
                </CaseField>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-end">
        </CardFooter>
        </div>
  );
};
