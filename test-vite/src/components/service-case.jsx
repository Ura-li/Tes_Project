import React from 'react'
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
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SelectBarRelated } from './sc-select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { 
  ArrowLeftFromLine,
  SquareArrowOutUpRight,
  Save,
  FileSymlink,
  RotateCw,
  StepBack,
  CalendarDays,
  Lock,
  UserPen,
  ArrowUp,
  ChevronDown
 } from 'lucide-react'

 import { useLocation, useNavigate } from "react-router-dom";
 import { useState, useEffect } from "react";
 import { useSidebar } from '@/components/ui/sidebar'
 import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import ApiCustomer from '@/api'

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { twMerge } from "tailwind-merge"
// const workorder = [
//   {
//     workordernumber: "WO-027816939",
//     caseid: "54165182991",
//     serviceaccount: "Icon Plus",
//     substatus: "Waiting",
//     systemstatus: "Open",
//     priority: "WO Priority",
//     workorder: "In-Country",
//     primaryincident: "Depot Repair",
//     duedate: "21/03/2025 00.53",
//     orion: "-",
//     owner : "Jokowi",
//     created: "Widodo",
//   },
// ]

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

import { BtnModalsWorkOrder } from './sc-modal'
import DatePicker from './date-picker'


export const TabsService = ({ caseDetails }) => {
  const [openWorkOrder, setOpenWorkOrder] = useState(false);

  const [selectedSymptom, setSelectedSymptom] = useState(null);


  const { open } = useSidebar();

  //casenote
  const [caseNoteFormData, setCaseNoteFormData] = useState({
    LogType: '',
    ActionType: '',
    Template: '',
    VisibleExternally: null,
    MinutesSpent: 0,
    Note: ''
  });

  const handleCaseNoteChange = (key, value) => {
    setCaseNoteFormData(prev => { 
      const updated = { ...prev, [key]: value };
      console.log("🔄 Updated Form:", updated); // ✅ Log on every change
      return updated;
     });
  };
  const saveCaseNote = async () => {
    
  console.log("📝 Form Data to Submit:", caseNoteFormData); // ✅ Log the form data
    try {
      const response = await ApiCustomer.post("/api/case-information/case-notes", {
        ...caseNoteFormData,
        CaseID: caseDetails.CaseID
      });
      console.log("Saved successfully:", response.data);
      alert("Case Note Saved!");
      setCaseNotes({
        NotesDisplay: response.data.data.Note
      })
      console.log("Case Notes Infor after save : ",caseNotes)
      console.log("Case Notes Display Infor after save : ",response)

      let dataUpdated = {
        CaseNote: response.data.data.NoteID
      };
      //symptom code
      if(selectedSymptom) {
        dataUpdated.SymptomCode = selectedSymptom.SymptomCodeID;
      }
      await ApiCustomer.patch(`/api/case-information/${caseDetails.CaseID}`, dataUpdated)

    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save note.");
    }
  };
  
  const checkOrCreateNote = async () => {
    const existing = await ApiCustomer.get(`/api/case-information/case-notes?caseId=${caseDetails.CaseID}`);
    
    if (existing.data.data.length > 0) {
      const noteID = existing.data.data[0].NoteID;
      await ApiCustomer.patch(`/api/case-information/case-notes/${noteID}`, {
        ...caseNoteFormData,
        Note: existing.data.data[0].Note + "\n" + caseNoteFormData.Note
      });
    } else {
      await ApiCustomer.post("/api/case-information/case-notes", {
        ...caseNoteFormData,
        CaseID: caseDetails.CaseID
      });
    }
  };
  
  const fetchCaseNotes = async () => {
    try{
      const res = await ApiCustomer.get(`/api/case-information/case-notes`)
      const notes = res.data.data
  
      const existingNote = notes.find(note=> note.CaseID === caseDetails.CaseID)
  
      let noteID = null
  
      if(existingNote){
        noteID = existingNote.NoteID
      }else{
        const createResponse = await ApiCustomer.post(`/api/case-information/case-notes`,{
          LogType: "NotesLog",
          ActionType: "Initial",
          Template: "",
          VisibleExternally: false,
          MinutesSpent: 0,
          Note: "",
          CaseID: caseID,
        })
        
        noteID = createResponse.data.data.NoteID;
      }
  
      const detailRes = await ApiCustomer.get(`/api/case-information/case-notes/${noteID}`)
      const noteDetail = detailRes.data.data;
  
      console.log("✅ Case Note Detail:", noteDetail);
      return noteDetail;
    }catch(err){
      console.error("Error in fetchCaseNotes:", err);
      return null;
    }
  }
  const fetchSymptomCodes = async () => {
    try{
      const res = await ApiCustomer.get(`/api/case-information/${caseDetails.CaseID}`)
      const caseData = res.data.data
      const symptomCode = caseData.SymptomCode

      const resSymptomCode = await ApiCustomer.get(`/api/case-information/symptom-codes/${symptomCode}`)
      return resSymptomCode.data.data
    }catch (err) {
      console.error("Error in fetchSymptomCodes:", err);
      return null;
    }
  }
  useEffect(() => {
    const loadNote = async () => {
      const noteDetail = await fetchCaseNotes();
      if(noteDetail ){
        setCaseNotes({
          NotesDisplay: noteDetail.Note
        })
      } 
      const symptomCodeDetail = await fetchSymptomCodes();
      if(symptomCodeDetail){
        setSelectedSymptom({
          TopCategory: symptomCodeDetail.TopCategory,
          SubCategory: symptomCodeDetail.SubCategory,
          SymptomCode: symptomCodeDetail.SymptomCode,
        })
      }
    }
    loadNote()
  }, [])

  const [caseNotes, setCaseNotes] = useState([])


  
  

  const buttons = [
    { icon: ArrowLeftFromLine, label: "", onClick: () => alert("not now") },
    { icon: SquareArrowOutUpRight, label: "", onClick: () => alert("not now") },
    { icon: Save, label: "Save", onClick: () => saveCaseNote() },
    { icon: FileSymlink, label: "Save & Close", onClick: () => alert("not now") },
    { icon: RotateCw, label: "Refresh", onClick: () => alert("not now") },
    { icon: StepBack, label: "Complaint", onClick: () => alert("not now") },
    { icon: StepBack, label: "CSR", onClick: () => alert("not now") },
    { icon: StepBack, label: "Service Order", onClick: () => alert("not now") },
    { icon: StepBack, label: "Work Order", onClick: () => setOpenWorkOrder(true) },
    { icon: StepBack, label: "Sales Offer", onClick: () => alert("not now") },
    { icon: StepBack, label: "Close Case", onClick: () => alert("not now") },
    { icon: StepBack, label: "Pick", onClick: () => alert("not now") },
    { icon: StepBack, label: "Queue Details", onClick: () => alert("not now") },
    { icon: UserPen, label: "Assign", onClick: () => alert("not now") },
    { icon: StepBack, label: "Add to Queue", onClick: () => alert("not now") },
  ];
  const visibleButtons = open ? buttons.slice(0, -3) : buttons;
  const hiddenButtons = open ? buttons.slice(-3) : [];
  return (
    <>
    <div className='border-1 flex items-center '>
       {visibleButtons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            variant="link"
            className={`rounded-none px-0 py-0  flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5  `}
            >
            <btn.icon className="h-4 w-4" />
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))}

{open && hiddenButtons.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 py-1 rounded-md bg-gray-200">...</DropdownMenuTrigger>
            <DropdownMenuContent>
              {hiddenButtons.map((btn, index) => (
                <DropdownMenuItem key={index}>
                  <btn.icon className="h-4 w-4 inline-block mr-2" />
                  {btn.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    <BtnModalsWorkOrder open={openWorkOrder} setOpen={setOpenWorkOrder} caseDetails={caseDetails}/>
    </div>
    <div>
    <ServiceCase 
      caseDetails={caseDetails}
      formData={caseNoteFormData}
      onChange={handleCaseNoteChange}
      caseNotes={caseNotes}
      setCaseNotes={setCaseNotes}
      selectedSymptom={selectedSymptom}
      setSelectedSymptom={setSelectedSymptom}
      />
    </div>
  </>
  )
}

const spanMap = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};

export const CaseField = ({ label, children, icon, span = 1, className }) => (
  <>
    <CardTitle
      className={twMerge(
        `relative font-medium flex items-center`,
        icon ? "pl-6" : "",
        className
      )}
    >
      {icon && (
        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      )}
      {label}
    </CardTitle>

    <CardTitle className={spanMap[span]}>
      {children}
    </CardTitle>
  </>
);


export const TabsServiceWO = () => {

  const buttons = [
    { icon: ArrowLeftFromLine, label: "", onClick: () => alert("not now") },
    { icon: SquareArrowOutUpRight, label: "", onClick: () => alert("not now") },
    { icon: Save, label: "Save", onClick: () => saveCaseNote() },
    { icon: FileSymlink, label: "Save & Close", onClick: () => alert("not now") },
    { icon: RotateCw, label: "Book", onClick: () => alert("not now") },
    { icon: StepBack, label: "Audit", onClick: () => alert("not now") },
    { icon: StepBack, label: "Pick", onClick: () => alert("not now") },
    { icon: StepBack, label: "Geo Code", onClick: () => alert("not now") },
    { icon: StepBack, label: "Refresh", onClick: () => alert("not now") },
    { icon: StepBack, label: "Process", onClick: () => alert("not now") },
    { icon: StepBack, label: "Reset RDT", onClick: () => alert("not now") },
    { icon: StepBack, label: "Add To Queue", onClick: () => alert("not now") },
    { icon: UserPen, label:  "Create Material Order", onClick: () => alert("not now") },
    { icon: StepBack, label: "Show Alerts", onClick: () => alert("not now") },
  ];
  const visibleButtons = open ? buttons.slice(0, -3) : buttons;
  const hiddenButtons = open ? buttons.slice(-3) : [];
  return (
    <>
    <div className='border-1 flex items-center '>
       {visibleButtons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            variant="link"
            className={`rounded-none px-0 py-0  flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5  `}
            >
            <btn.icon className="h-4 w-4" />
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))}

{open && hiddenButtons.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 py-1 rounded-md bg-gray-200">...</DropdownMenuTrigger>
            <DropdownMenuContent>
              {hiddenButtons.map((btn, index) => (
                <DropdownMenuItem key={index}>
                  <btn.icon className="h-4 w-4 inline-block mr-2" />
                  {btn.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    {/* <BtnModalsWorkOrder open={openWorkOrder} setOpen={setOpenWorkOrder} caseDetails={caseDetails}/> */}
    </div>
    <div>
    {/* <ServiceCase 
      caseDetails={caseDetails}
      formData={caseNoteFormData}
      onChange={handleCaseNoteChange}
      caseNotes={caseNotes}
      setCaseNotes={setCaseNotes}
      selectedSymptom={selectedSymptom}
      setSelectedSymptom={setSelectedSymptom}
      /> */}
    </div>
  </>
  )
}

export const TabsServiceMO = () => {

  const buttons = [
    { icon: ArrowLeftFromLine, label: "", onClick: () => alert("not now") },
    { icon: SquareArrowOutUpRight, label: "", onClick: () => alert("not now") },
    { icon: Save, label: "Save", onClick: () => saveCaseNote() },
    { icon: FileSymlink, label: "Save & Close", onClick: () => alert("not now") },
    { icon: RotateCw, label: "ATP", onClick: () => alert("not now") },
    { icon: StepBack, label: "Cancel Order", onClick: () => alert("not now") },
    { icon: StepBack, label: "Add To Queue", onClick: () => alert("not now") },
    { icon: StepBack, label: "Add Parts", onClick: () => alert("not now") },
    { icon: StepBack, label: "Pick", onClick: () => alert("not now") },
    { icon: StepBack, label: "Place Order", onClick: () => alert("not now") },
    { icon: StepBack, label: "Tax", onClick: () => alert("not now") },
    { icon: StepBack, label: "CustID Search", onClick: () => alert("not now") },
    { icon: UserPen, label:  "PUDO Search", onClick: () => alert("not now") },
    { icon: StepBack, label: "Audit", onClick: () => alert("not now") },
  ];
  const visibleButtons = open ? buttons.slice(0, -3) : buttons;
  const hiddenButtons = open ? buttons.slice(-3) : [];
  return (
    <>
    <div className='border-1 flex items-center '>
       {visibleButtons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            variant="link"
            className={`rounded-none px-0 py-0  flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5  `}
            >
            <btn.icon className="h-4 w-4" />
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))}

{open && hiddenButtons.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 py-1 rounded-md bg-gray-200">...</DropdownMenuTrigger>
            <DropdownMenuContent>
              {hiddenButtons.map((btn, index) => (
                <DropdownMenuItem key={index}>
                  <btn.icon className="h-4 w-4 inline-block mr-2" />
                  {btn.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    {/* <BtnModalsWorkOrder open={openWorkOrder} setOpen={setOpenWorkOrder} caseDetails={caseDetails}/> */}
    </div>
    <div>
    {/* <ServiceCase 
      caseDetails={caseDetails}
      formData={caseNoteFormData}
      onChange={handleCaseNoteChange}
      caseNotes={caseNotes}
      setCaseNotes={setCaseNotes}
      selectedSymptom={selectedSymptom}
      setSelectedSymptom={setSelectedSymptom}
      /> */}
    </div>
  </>
  )
}

export const ServiceCase = ({ 
  caseDetails, 
  formData, 
  onChange,
  caseNotes,
  setCaseNotes,
  selectedSymptom,
  setSelectedSymptom
}) => {
  const { open } = useSidebar();

  
const [symptomSearchTerm, setSymptomSearchTerm] = useState("");
const [symptomSuggestions, setSymptomSuggestions] = useState([]);

const [caseClosedDate, setCaseClosedDate] = useState(null);

  

  const tabs = [
    { value: "case_info", label: "Case Information" },
    { value: "customer,add,entitement", label: "Customer, Asset & Entitement" },
    { value: "ci_notes", label: "Notes & Information" },
    { value: "ci_activitas", label: "Activities" },
    { value: "ci_actions", label: "Customer Interactions" },
    { value: "ci_wo", label: "Work Order Validation" },
    { value: "ci_orders", label: "Orders" },
    { value: "ci_salles", label: "Sales Offer" },
    { value: "ci_knowledge", label: "Knowledge & Attachments" },
    { component: <SelectBarRelated /> },
  ];

  const visibleTabs = open ? tabs.slice(0, -2) : tabs;
  const hiddenTabs = open
    ? [
        { value: "ci_knowledge", label: "Knowledge & Attachments" },
        { component: <SelectBarRelated /> },
      ]
    : [];


    const [selected, setSelected] = useState("apple"); // Default to 'apple'

    


  //customer, asset, entitlement
  //customer
  const [dataFetchCustomerData, setDataFetchCustomerData] = useState({
    MainAccount: null,
    SiteAccount: null,
    Type: null,
  });
  const fetchCustomerData = async () => {
    try{
      // console.log("Case Detail : ", caseDetails);
      const resMainAccount = await ApiCustomer.get(`/api/contact-information/${caseDetails.ContactID}`)
      setDataFetchCustomerData({
        MainAccount: resMainAccount.data.data
      })
      if(caseDetails.SiteAccountID !== null) {
        const resSiteAccount = await ApiCustomer.get(`/api/site_account/${caseDetails.SiteAccountID}`)
        setDataFetchCustomerData((prev) => ({
          ...prev,
          SiteAccount: resSiteAccount.data.data,
          Type: "SiteAccount"
        }));
        
      }else{
        setDataFetchCustomerData((prev) => ({
          ...prev,
          type: "Individual", // fallback if no site account
        }));
      }

      // const res = await ApiCustomer.get(`/api/`)
    }catch(err){
      console.error("Error returning Customer Data : ",err)
      return null
    }
  }
  //asset
  const [dataFetchAssetInformation, setDataFetchAssetInformation] = useState();
  const fetchAssetInformation = async () => {
    try{
      const resAsset = await ApiCustomer.get(`/api/asset-information/${caseDetails.AssetID}`)
      setDataFetchAssetInformation({
        AssetInformation: resAsset.data.data
      })
    }catch(err){
      console.error("Error returning Asset Data : ",err)
      return null
    }
  }



//notes handler
const fetchCaseNotes = async () => {
  try{
    // console.log("Case Details : ", caseDetails)
    const res = await ApiCustomer.get(`/api/case-information/case-notes`)
    const notes = res.data.data

    const existingNote = notes.find(note=> note.CaseID === caseDetails.CaseID)

    let noteID = null

    if(existingNote){
      noteID = existingNote.NoteID
    }else{
      const createResponse = await ApiCustomer.post(`/api/case-information/case-notes`,{
        LogType: "NotesLog",
        ActionType: "Initial",
        Template: "",
        VisibleExternally: false,
        MinutesSpent: 0,
        Note: "",
        CaseID: caseID,
      })
      
      noteID = createResponse.data.data.NoteID;
    }

    const detailRes = await ApiCustomer.get(`/api/case-information/case-notes/${noteID}`)
    const noteDetail = detailRes.data.data;

    console.log("✅ Case Note Detail:", noteDetail);
    return noteDetail;
  }catch(err){
    console.error("Error in fetchCaseNotes:", err);
    return null;
  }
}
useEffect(() => {
  fetchCustomerData();
  fetchAssetInformation();
  fetchOwnerUserData();
  
  fetchWorkOrders();
  const loadNote = async () => {
    const noteDetail = await fetchCaseNotes();
    if(noteDetail ){
      setCaseNotes({
        NotesDisplay: noteDetail.Note
      })
    }
  }
  loadNote()
}, [])

//data for upper style
const [ownerUserData, setOwnerUserData ] = useState([])
// const []
const fetchOwnerUserData = async () => {
  try {
    const response = await ApiCustomer.get(`/api/user/${caseDetails.CreatedBy}`)
    setOwnerUserData(response.data.data)
  } catch (error) {
    
  }
}


useEffect(() =>{
  console.log("Data Asset Info : ",dataFetchAssetInformation)
  
  console.log("Fetch Data Customer Success : ",dataFetchCustomerData)
  console.log("Fetch Data User ", ownerUserData)
}, [ownerUserData])

// useEffect(() =>{
//   console.log("Data Asset Info : ",dataFetchAssetInformation)
// }, dataFetchAssetInformation)

const fetchSymptomCodes = async (term) => {
  try {
    const response = await ApiCustomer.get("/api/case-information/symptom-codes");
    const allCodes = response.data.data;

    const filtered = allCodes.filter((sym) =>
      sym.SymptomCode.toLowerCase().includes(term.toLowerCase())
    );

    setSymptomSuggestions(filtered);
  } catch (err) {
    console.error("Error fetching symptom codes", err);
  }
};
// console.log("Selected Symptopm ",selectedSymptom)

// useEffect(() => {
// }, selectedSymptom)


//order section
//workorder
const [workOrders, setWorkOrders] = useState([]);
const fetchWorkOrders = async () => {
  try {
    const res = await ApiCustomer.get(`/api/work-order?CaseID=${caseDetails.CaseID}`);
    setWorkOrders(res.data.data); // adjust based on API response shape
    // console.log("Fetch Work Order: ",res)
  } catch (err) {
    console.error("Failed to fetch work orders:", err);
  }
};

const [materialOrders, setMaterialOrders] = useState([]);
const fetchMaterialOrders = async () => {
  try {
    if (!workOrders.length) return;

    const woidList = workOrders.map((wo) => wo.WOID).join(',');
    const res = await ApiCustomer.get(`/api/material-order?WOID=${woidList}`);
    setMaterialOrders(res.data.data);
  } catch (err) {
    console.error("Failed to fetch Material orders:", err);
  }
}


useEffect(() => {
  console.log("Work Orders Fetching L ",workOrders)
  if (workOrders.length > 0) {
    fetchMaterialOrders();
  }
}, [workOrders]);

const navigate = useNavigate();

const handleClick = async () => {
  // await fetchOwnerUserData();
  // await fetchCustomerData(); 
  {workOrders.map((work) => {
  navigate(`/work/${work.WOID}`, {
    state: { ownerUserData, dataFetchCustomerData }
  });
  })}
};


  return (
    <>
    <Card className="mt-2 rounded-none p-0 border-0">
      
        <Tabs defaultValue="case_info"> 
          
          <CardHeader className="flex flex-col gap-3 border-2 w-full p-2 sticky">
            <div className="flex justify-between">
              <CardTitle className="text-xl ">
                {caseDetails.CaseID}
                <span className="text-sm flex items-center">Case .
                  <Select onValueChange={setSelected} defaultValue="case" className="shadow-xl">
                  <SelectTrigger className="shadow-none border-none">
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectGroup>
                      <SelectItem value="case">Case</SelectItem>
                      <SelectItem value="??">??</SelectItem>
                      <SelectItem value="!!">!!</SelectItem>
                      <SelectItem value="**">**</SelectItem>
                      <SelectItem value="&&">&&</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                  </Select>
                </span>
              </CardTitle>
              <CardTitle className="flex">
                <div className="px-2 flex flex-col item-center justify-center border-r-2">
                  <h1 className='text-blue-500'>{ownerUserData.Name}</h1>
                  <p className="text-sm font-light ">Owner</p>
                </div>
                <div className="px-2 flex flex-col item-center justify-center border-r-2">
                  <h1 className='text-blue-500'>---</h1>
                  <p className="text-sm font-light ">Queue</p>
                </div>
                <div className="px-2 flex flex-col item-center justify-center border-r-2">
                  <h1 className='text-blue-500'>{dataFetchCustomerData.MainAccount?.Salutation} {dataFetchCustomerData.MainAccount?.FirstName} {dataFetchCustomerData.MainAccount?.LastName}</h1>
                  <p className="text-sm font-light ">Contact</p>
                </div>
                <div className="px-2 flex flex-col item-center justify-center border-r-2">
                <Select onValueChange={setSelected} defaultValue="first" >
                  <SelectTrigger className="shadow-none border-none text-blue-500 p-0">
                    <SelectValue  />
                  </SelectTrigger>
                  <SelectContent className="p-0">
                    <SelectGroup className="p-0">
                    <SelectItem value="first" className="p-0">{dataFetchCustomerData.SiteAccount?.Company}</SelectItem>
                    <SelectItem value="??">??</SelectItem>
                      <SelectItem value="!!">!!</SelectItem>
                      <SelectItem value="**">**</SelectItem>
                      <SelectItem value="&&">&&</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                  </Select>
                  <p className="text-sm font-light ">Site Account</p>
                </div>
              </CardTitle>
            </div>
            <TabsList className="bg-white">
            {visibleTabs.map((tab, index) => tab.component ? (
            <div key={index}>{tab.component}</div> // Ensure SelectBarRelated renders properly
          ) : (
            <TabsTrigger key={index} variant="underline" value={tab.value}>
              {tab.label}
            </TabsTrigger>
          )
        )}
              {/* <TabsTrigger variant="underline" value="case_info" className=" ">Case Information</TabsTrigger>
              <TabsTrigger variant="underline" value="customer,add,entitement" className="">Customer, Asset & Entitement</TabsTrigger>
              <TabsTrigger variant="underline" value="ci_notes" className="">Notes & Information</TabsTrigger>
              <TabsTrigger variant="underline" value="ci_activitas" className="">Activities</TabsTrigger>
              <TabsTrigger variant="underline" value="ci_actions" className="">Costumer Interactions</TabsTrigger>
              <TabsTrigger variant="underline" value="ci_wo" className="">Work Order Validation</TabsTrigger>
              <TabsTrigger variant="underline" value="ci_orders" className="">Orders</TabsTrigger>
              <TabsTrigger variant="underline" value="ci_salles" className="">Sales Offer</TabsTrigger>
              <TabsTrigger variant="underline" value="ci_knowledge" className="">Knowledge & Attachments</TabsTrigger>
              <SelectBarRelated></SelectBarRelated> */}
              {open && (
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 py-1 rounded-md bg-gray-200">...</DropdownMenuTrigger>
            <DropdownMenuContent>
              {hiddenTabs.map((tab, index) =>
                tab.component ? (
                  <DropdownMenuItem key={index}>{tab.component}</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={index}>
                    <TabsTrigger variant="underline" value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
            </TabsList>
          </CardHeader>
      
          <TabsContent value="case_info" className={'p-2'}>
            <Card className="flex-row">
              <CardContent className="grid gap-10 items-center grid-cols-6 p-3 ">  
                <CaseField label="Case ID" icon >{caseDetails.CaseID}</CaseField>
                <CaseField label="Case Subject"  span={3} >{caseDetails.CaseSubject}</CaseField>
                <CaseField label="Incoming Channel"  icon >{caseDetails.IncomingChannel}</CaseField>
                <CaseField label="Business Segment"  >---</CaseField>
                <CaseField label="Email Status" >---</CaseField>
                <CaseField label="Case Status"  >{caseDetails.CaseStatus}</CaseField>
                <CaseField label="Case Type"  >{caseDetails.CaseType}</CaseField>
                <CaseField label="KCI For Case?"  >{caseDetails.KCI_Flag ? "Yes" : "No"}</CaseField>
                <CaseField label="Case Priority"  >{caseDetails.CasePriority}</CaseField>
                <CaseField label="HPI Segment"  >---</CaseField>
                <CaseField label="Customer Tracking Number"  icon >---</CaseField>
                <CaseField label="Customer Severity"  >{caseDetails.CustomerSeverity}</CaseField>
                <CaseField label="Update Customer Tracking Number"  span={3} >---</CaseField>
                <CaseField label="Created ON" icon span={3}>
                  <span className="flex gap-[5em]">
                    {new Date(caseDetails.CreatedOn).toLocaleDateString('id-ID')}
                        <DatePicker variant='icon'></DatePicker>
                    {new Date(caseDetails.CreatedOn).toLocaleTimeString('id-ID', { hour12: true, hour: "2-digit", minute: "2-digit" })}
                  </span>
                </CaseField>
                <CaseField label="Alternate Customer Tracking Number"> ---  </CaseField>
                <CaseField label="Case Closed Date" icon span={3} > 
                  <span className="flex gap-[5em]">
                      {/* {caseClosedDate ? format(caseClosedDate, "dd/M/yyyy") : "---"} */}
                      <DatePicker variant='icon' value={caseClosedDate} onChange={setCaseClosedDate}></DatePicker>
                      ---
                    </span>
                </CaseField>
                <CaseField label="Irrelevant"  icon >
                  --- 
                </CaseField> 
                <CaseField label="Submitted To Base" icon span={3}>
                    <span className="flex gap-[5em]">
                     
                      <DatePicker variant='icon'></DatePicker>
                      ---
                    </span>
                </CaseField>

              </CardContent>
            </Card>

            <Card className="mt-5 flex-col">
            <span className='ml-5 font-bold text-xl'>Global Trade Check</span>
              <CardContent className="grid gap-10  grid-cols-6 p-3">
                <CaseField label="Global Trade Status" > --- </CaseField>
                <CaseField label="GT Override Reason" >--- </CaseField>
                <CaseField label="GT Active Listening" > ---</CaseField>
                <CaseField label="Embargoed Country" icon>--- </CaseField>
                <CaseField label="GT Details" >--- </CaseField>
                <CaseField label="GT All Comments" > ---</CaseField>
                <CaseField >--- </CaseField>
                <CaseField label="Screening ID" > ---</CaseField>
                <CaseField>--- </CaseField>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent  value="customer,add,entitement">
          <Card className="flex-col mt-7">
            <span className='ml-5 font-bold text-xl'>Customer Information</span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-6">
              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Customer Account</span>
                <span className='ml-30'>{dataFetchCustomerData?.Type == "SiteAccount" ? dataFetchCustomerData?.SiteAccount?.Company : dataFetchCustomerData?.MainAccount?.FirstName + " " + dataFetchCustomerData?.MainAccount?.LastName}</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Is Partner</span>
                <span className='ml-47'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>HIPAA</span>
                <span className='ml-53'>...</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>PIN</span>
                <span className='ml-58.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Customer Time Zone</span>
                <span className='ml-26.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Primary Contact</span>
                <span className='ml-35'>{dataFetchCustomerData.MainAccount?.Salutation} {dataFetchCustomerData.MainAccount?.FirstName} {dataFetchCustomerData.MainAccount?.LastName}</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Primary Email</span>
                <span className='ml-35'>{dataFetchCustomerData?.Type == "SiteAccount" ? dataFetchCustomerData?.SiteAccount?.Email : dataFetchCustomerData?.MainAccount?.Email}</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Phone</span>
                <span className='ml-49.5'>{dataFetchCustomerData?.Type == "SiteAccount" ? dataFetchCustomerData?.SiteAccount?.PrimaryPhone: dataFetchCustomerData?.MainAccount?.Phone}</span>
              </div>
    
              <div className='font-bold flex'>
                <span className='ml-7'>Secondary Contact</span>
                <span className='ml-26'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Country</span>
                <span className='ml-46'>{dataFetchCustomerData?.Type == "SiteAccount" ? dataFetchCustomerData?.SiteAccount?.Country : dataFetchCustomerData?.MainAccount?.Country}</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Submitted By</span>
                <span className='ml-36'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Partner & Customer</span>
                <span className='ml-24'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Region</span>
                <span className='ml-58'>...</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Parent Company</span>
                <span className='ml-40'>...</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Parent Company Non-Latin</span>
                <span className='ml-20'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Account Tier</span>
                <span className='ml-47.5'>...</span>
              </div>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
            <span className='ml-5 font-bold text-xl'>Asset Information</span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-4">
              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Asset</span>
                <span className='ml-56'>{dataFetchAssetInformation?.AssetInformation?.SerialNumber}</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Serial Number</span>
                <span className='ml-39'>{dataFetchAssetInformation?.AssetInformation?.SerialNumber}</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Product Name</span>
                <span className='ml-39'>{dataFetchAssetInformation?.AssetInformation?.product_information?.ProductName}</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Device Properties</span>
                <span className='ml-33'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className=' size-5 mr-2'></Lock>
                <span>Product Number</span>
                <span className='ml-30'>{dataFetchAssetInformation?.AssetInformation?.ProductNumber}</span>
              </div>

              <div className='font-bold flex'>
                <Lock className=' size-5 mr-2'></Lock>
                <span>HW Profit Center</span>
                <span className='ml-29'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className=' size-5 mr-2'></Lock>
                <span>HWPC Code</span>
                <span className='ml-38.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className=' size-5 mr-2'></Lock>
                <span>Asset Location</span>
                <span className='ml-34'>...</span>
              </div>
    
              <div className='font-bold flex'>
                <span className='ml-8'>SNIC - Count</span>
                <span className='ml-44'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>MV Product Description </span>
                <span className='ml-24'>...</span>
              </div>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
            <span className='ml-5 font-bold text-xl'>SLA Information</span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Latest Start Date (Cust Time)</span>
                <span className='ml-35'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Guaranteed Fix Date(Cust Time)</span>
                <span className='ml-29'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Case Priority Index</span>
                <span className='ml-53.5'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Coverage Window Used</span>
                <span className='ml-30'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className=' size-5 mr-2'></Lock>
                <span>Coverage Window Value</span>
                <span className='ml-29'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className=' size-5 mr-2'></Lock>
                <span>Case Priority Rule</span>
                <span className='ml-41.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className=' size-5 mr-2'></Lock>
                <span>Response Time Value</span>
                <span className='ml-35'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className=' size-5 mr-2'></Lock>
                <span>Repair Time Value</span>
                <span className='ml-41'>...</span>
              </div>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
            <span className='ml-5 font-bold text-xl'>Entitlement Information</span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
              <div className='ml-7 font-bold flex'>
                <span>Case Entitlement</span>
                <span className='ml-48'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Entitlement Status</span>
                <span className='ml-45'>...</span>
              </div>

              <div className='ml-7 font-bold flex'>
                <span>Selected Entitlement Offer </span>
                <span className='ml-30'>...</span>
              </div>

              <div className='ml-2 font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Start Date</span>
                <span className='ml-38'>...</span>
                <CalendarDays className='w-5 ml-5'></CalendarDays>
              </div>

              <div className='ml-2 font-bold flex'>
              <Lock className=' size-5 mr-2'></Lock>
                <span>End Date</span>
                <span className='ml-40'>...</span>
                <CalendarDays className='w-5 ml-5' ></CalendarDays>
              </div>

              <div className='ml-2 font-bold flex'>
                <Lock className=' size-5 mr-2'></Lock>
                <span>Days Left</span>
                <span className='ml-40'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>OTC Code</span>
                <span className='ml-51'>...</span>
              </div>

              <div className='ml-7 font-bold flex'>
                <span>Entitlement Override</span>
                <span className='ml-30'>...</span>
              </div>

              <div className='ml-7 font-bold flex'>
                <span>Authorizing Employee</span>
                <span className='ml-28'>...</span>
              </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ci_notes" className={'p-2 flex flex-col gap-4'} >
          <Card className="flex-col p-2  ">
            <CardHeader>
              <CardTitle className=' text-lg'>Customer Issue Description & System Information</CardTitle>
              <hr />
            </CardHeader>
              <CardContent className="flex gap-x-5 p-4">
                <div className="flex-1 grid grid-row-7 grid-cols-6 items-center gap-y-7">
                  <div className='row-span-4 col-span-full'>
                    <textarea className='border-2 ring-1 ring-gray-400 w-[100%] h-[12em] resize-none'></textarea>
                  </div>
                  <CaseField label="Related Device" className={'col-span-3'}  span={3}>--- </CaseField>
                  <CaseField label="Device Manufacturer" className={'col-span-3'}  span={3} icon>--- </CaseField>
                  <CaseField label="Device Model" className={'col-span-3'}  span={3}>--- </CaseField>
                </div>

                <div className="flex-1 grid-flow-row gap-y-7 grid grid-cols-6">
                  <CaseField label="Program/Category" className={'col-span-3'}  span={2}>---</CaseField>
                  <CaseField label="Operating System" className={'col-span-3'}  span={3}>---</CaseField>
                  <CaseField label="Version" className={'col-span-3'}  span={3} >---</CaseField>
                  <CaseField label="Remote Diag Code" className={'col-span-3'}  span={3} >---</CaseField>
                  <CaseField label="Applicsation Information" className={'col-span-3'}  span={3}>---</CaseField>
                  <CaseField label="Provider / Platform" className={'col-span-3'}  span={3}>---</CaseField>
                  <CaseField label="Software Version" className={'col-span-3'}  span={3}>---</CaseField>
                </div>
              </CardContent>
          </Card>

          <Card className="flex-col p-2  ">
            <CardHeader>
              <CardTitle className=' text-lg'>Case Notes</CardTitle>
              <hr />
            </CardHeader>
              <CardContent className="flex gap-4">
                <div className="grid grid-cols-6 gap-y-7 flex-1">

                  <CaseField label="Log Type" className={'col-span-2'} span={4}>
                    <Select onValueChange={(val) => onChange("LogType", val)}>
                        <SelectTrigger className={'w-[100%] hover:shadow-lg border-b-0'}>
                          <SelectValue placeholder="Log Type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NotesLog">Notes Log</SelectItem>
                          <SelectItem value="PhoneLog">Phone Log</SelectItem>
                        </SelectContent>
                    </Select>
                  </CaseField>

                  <CaseField label="Action Type" className={'col-span-2'}  span={4}>---</CaseField>

                  <CaseField label="Template" className={'col-span-2'} span={4}>---</CaseField>

                  <CaseField label="Visible Externally" className={'col-span-2'} span={4}>
                    <Select
                      value={
                        formData?.VisibleExternally === undefined || formData?.VisibleExternally === null
                          ? ""
                          : formData?.VisibleExternally
                            ? "1"
                            : "0"
                      }
                      onValueChange={(val) => onChange("VisibleExternally", val === "1")}
                    >
                      <SelectTrigger className={'w-[100%] hover:shadow-lg border-b-0'}>
                        <SelectValue placeholder="---" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </CaseField>

                  <CaseField label="Number of Minutes Spent" className={'col-span-2'}  icon span={3} >---</CaseField>

                  <CaseField label="Notes" className={'col-span-2 self-start'} span={4}>
                    <textarea
                      className='h-[10em] w-[100%] resize-none p-2 border-2 ring-1 ring-gray-500'
                      value={formData?.Note || ''}
                      onChange={(e) => onChange("Note", e.target.value)}
                    />
                  </CaseField>
                  {/* <textarea
                      className='h-[10em] w-[100%] resize-none p-2 border-2 ring-1 ring-gray-500'
                      value={formData?.Note || ''}
                      onChange={(e) => onChange("Note", e.target.value)}
                    /> */}
                    
                  
                  {/* <div className='font-bold flex'>
                    <span>Log Type</span>
                      <Select onValueChange={(val) => onChange("LogType", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Log Type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NotesLog">Notes Log</SelectItem>
                          <SelectItem value="PhoneLog">Phone Log</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>

                  <div className='font-bold flex'>
                    <span>Action Type</span>
                    <span className=''>...</span>
                  </div>

                  <div className='font-bold flex'>
                    <span>Template </span>
                    <span className=''>...</span>
                  </div>

                  <div className='font-bold flex'>
                    <span>Visible Externally</span>
                    <span className=''>
                    <Select onValueChange={(val) => onChange("VisibleExternally", val === "1")}>
                        <SelectTrigger>
                          <SelectValue placeholder="---"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Yes</SelectItem>
                          <SelectItem value="0">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </span>
                  </div>

                  <div className='font-bold flex '>
                    <span>Number of Minutes Spent</span>
                    <span className=''>...</span>
                  </div>

                  <div className='flex'>
                    <span className='font-bold'>Notes</span>
                    <textarea className=' w-80 h-40 resize-none p-2 border-2 border-black ' value={formData?.Note || ''} onChange={(e) => onChange("Note", e.target.value)}></textarea>
                  </div> */}

                </div>

                <div className='flex flex-1'>
                  <textarea className='w-[100%] h-[100%] resize-none p-2 ring-1 ring-gray-500' readOnly value={caseNotes?.NotesDisplay}> </textarea>
                </div>
              </CardContent>
          </Card>

          <Card className="mt-5 flex-col">
          <CardHeader>
              <CardTitle className=' text-lg'>Symtome Description / CardTitle</CardTitle>
              <hr />
            </CardHeader>
              <CardContent className="flex gap-6">

                <div className="grid grid-cols-5 gap-y-7 gap-x-2 flex-1">
                  <CaseField label="Keyword Search" className={'col-span-2'} span={3}>
                    <Input
                        placeholder="..."
                        type="search"
                        className=""
                        value={symptomSearchTerm}
                        onChange={(e) => {
                          const value = e.target.value
                          setSymptomSearchTerm(value)
                          if (value.length >= 2) fetchSymptomCodes(value)
                            else setSymptomSuggestions([])
                        }}
                    />
                  </CaseField>

                  {/* <div className='font-bold flex'>
                    <span>Keyword Search</span>
                    <Input
                    placeholder="..."
                      type="search"
                      className=""
                      value={symptomSearchTerm}
                      onChange={(e) => {
                        const value = e.target.value
                        setSymptomSearchTerm(value)
                        if (value.length >= 2) fetchSymptomCodes(value)
                          else setSymptomSuggestions([])
                      }}
                    />
                  </div> */}

                  {symptomSuggestions.length > 0 && (
                    <ul className="bg-white border mt-1 max-h-40 overflow-y-auto absolute z-10">
                      {symptomSuggestions.map((sym) => (
                        <li
                          key={sym.SymptomCodeID}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedSymptom(sym);
                            setSymptomSearchTerm(sym.SymptomCode);
                            setSymptomSuggestions([]);
                          }}
                        >
                          {sym.SymptomCode}
                        </li>
                      ))}
                    </ul>
                  )}

                  <CaseField label="Top Category" className={'col-span-2'}  span={3} >{selectedSymptom?.TopCategory}</CaseField>
                  <CaseField label="Sub Category" className={'col-span-2'}  span={3} >{selectedSymptom?.SubCategory}</CaseField>
                  <CaseField label="Spesific Symptom" className={'col-span-2'}  span={3} >{selectedSymptom?.SymptomCode}</CaseField>
                  
                  {/* <div className='font-bold flex'>
                    <span>Top Category</span>
                    <span className=''>...{selectedSymptom?.TopCategory}</span>
                  </div>
                  <div className='font-bold flex'>
                    <span>Sub Category</span>
                    <span className=''>...{selectedSymptom?.SubCategory}</span>
                  </div>
                  <div className='font-bold flex'>
                    <span>Spesific Symptom</span>
                    <span className=''>...{selectedSymptom?.SymptomCode}</span>
                  </div> */}
                </div>

                <div className='font-bold flex flex-1'>
                  <Table className=""  >
                    <TableCaption className={"caption-top justify-between flex items-end "}>
                    <span className=''>Quality Codes</span>
                    <span className=''>Add Existing QA Code</span>  
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>QA Level 1 <ArrowUp/> <ChevronDown/> </TableHead>
                        <TableHead>QA Level 2 <ArrowUp/> <ChevronDown/> </TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                  
                </div>
              </CardContent>
          </Card>

          <Card className="mt-5 flex-col">
            <span className='ml-5 font-bold text-xl'>Case Resolution</span>
            <CardContent className="grid gap-5 grid-flow-col grid-rows-3">

              <div className='font-bold flex'>
                <span className='ml-7'>Case Resolution Code</span>
                <span className='ml-32'>...</span>
              </div>
              
              <div className='font-bold flex'>
                <span className='ml-7'>Auto Close</span>
                <Select className='ml-52' onValueChange={(val) => onChange("VisibleExternally", val === "1")}>
                    <SelectTrigger>
                      <SelectValue placeholder="---"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Case Ready for Closure</span>
                <span className='ml-29.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Ready for Close Days</span>
                <span className='ml-32'>...</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Ready for Closure Date</span>
                <span className='ml-28.5'>...</span>
              </div>

              <div className='font-bold flex'>
              <Lock className='size-5 mr-2'></Lock>
                <span>Pending Customer Action</span>
                <span className='ml-24'>...</span>
              </div>

              <div className='font-bold flex'>
                <span>Customer Requested Close Date</span>
                <span className='ml-30'>...</span>
              </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ci_activitas" >
            <Card className="mt-7">
              <CardHeader>Hello Word</CardHeader>
              {/* <DatePicker icon={<Calendar>}></DatePicker> */}
            </Card>
          </TabsContent>

          <TabsContent value="ci_actions" >
            <Card className="mt-7">
              <CardHeader>Hello Word</CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="ci_wo" >
            <Card className="mt-7">
              <CardHeader>Hello Word</CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="ci_orders" >
          <Card className="flex-col mt-7">
            <span className='ml-5 font-bold text-xl'>Shipment Information</span>
              <CardContent className="grid gap-5 grid-flow-col grid-rows-3">
          
              <div className='font-bold flex'>
                <span className='ml-7'>Shipment Country</span>
                <span className='ml-40'>...</span>
              </div>

              <div className='font-bold flex'>
                <Lock className='size-5 mr-2'></Lock>
                <span>Shipment State</span>
                <span className='ml-45.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <span className='ml-7'>Major Account Id</span>
                <span className='ml-41.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <span>Exception Order</span>
                <span className='ml-40'>...</span>
              </div>

              <div className='font-bold flex'>
                <span >SBD Ovveride</span>
                <span className='ml-44.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <span>Currency</span>
                <span className='ml-53.5'>...</span>
              </div>

              <div className='font-bold flex'>
                <span>Promo Code</span>
                <span className='ml-40'>...</span>
              </div>
              </CardContent>
            </Card>

          <Card className="flex-col mt-7">
            <span className='ml-5 font-bold text-xl'>Work Order</span>
              <CardContent className="grid gap-5">
          
              <div className='font-bold flex'>
                <span>Incident Type</span>
                <span className='ml-50'>...</span>
              </div>

              <div className='font-bold flex'>
                <span>Work Order Description</span>
                <span className='ml-30.5'>...</span>
              </div>

                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Work Order Number</TableHead>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Service Account</TableHead>
                    <TableHead >Sub-Status</TableHead>
                    <TableHead>System Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Work Order</TableHead>
                    <TableHead>Primary Incident</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Orion</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((work) => (
                    <TableRow key={work.WOID} className="hover:bg-gray-500 cursor-pointer">
                      <TableCell className="font-medium " onClick={handleClick}>
                        {/* <Link to={`/work/${work.WOID}`}> */}
                        {work.WOID}
                        {/* </Link> */}
                        </TableCell>
                      <TableCell>{work.CaseID}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
              </CardContent>
            </Card>

          <Card className="flex-col mt-7">
            <span className='ml-5 font-bold text-xl'>Parts Order </span>
              <CardContent className="grid gap-5">
    
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Work Order</TableHead>
                    <TableHead>Customer Self Repair (CSR)</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Order Closed Date</TableHead>
                    <TableHead>Created By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partsorder.map((parts) => (
                    <TableRow key={parts.name}>
                      <TableCell className="font-medium">{parts.name}</TableCell>
                      <TableCell>{parts.orderstatus}</TableCell>
                      <TableCell>{parts.workorder}</TableCell>
                      <TableCell>{parts.customerselfrepair}</TableCell>
                      <TableCell>{parts.owner}</TableCell>
                      <TableCell>{parts.createdon}</TableCell>
                      <TableCell>{parts.ordercloseddate}</TableCell>
                      <TableCell>{parts.createdby}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </CardContent>
            </Card>

          <Card className="flex-col mt-7">
            <span className='ml-5 font-bold text-xl'>Service Order </span>
              <CardContent className="grid gap-5">
    
                <Table>
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
              </Table>
              </CardContent>
            </Card>

          <Card className="flex-col mt-7">
            <span className='ml-5 font-bold text-xl'>Material Order </span>
              <CardContent className="grid gap-5">
    
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
                  {materialOrders.map((material) => (
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
                    ))}
                    {/* <TableRow>
                      <TableCell className="font-medium">
                        <Link to="/material_order">
                        
                        </Link>
                      </TableCell>
                    </TableRow> */}
                </TableBody>
              </Table>
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="ci_salles" >
            <Card className="mt-7">
              <CardHeader>Hello Word</CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="ci_knowledge" >
            <Card className="mt-7">
              <CardHeader>Hello Word</CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="ci_related" >
            <Card className="mt-7">
              <CardHeader>Hello Word</CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      
    </Card>
    </>            
  )
}
