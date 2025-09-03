import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectBarRelated, SelectYN, SearchCommandBlock, SelectBar } from "@/components/sc-select";
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
import {
  ArrowLeftFromLine,
  SquareArrowOutUpRight,
  Save,
  FileSymlink,
  RotateCw,
  StepBack,
  CalendarDays,
  Lock,
  LockOpen,
  UserPen,
  ArrowUp,
  ChevronDown,
  Smile,
  User,
  Calculator,
  CreditCard,
  Settings,
  Computer,
  NotepadText,
  FileSliders,
  Contact,
  Briefcase,
} from "lucide-react";
import { CircleChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ApiCustomer from "@/api";
import { getUserFromToken } from "@/lib/utils/auth";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import Swal from "sweetalert2";
import { BtnModalsServiceCatalog } from '@/components/model/sc-modal'
import DatePicker from '@/components/date-picker'
import { pdf } from '@react-pdf/renderer';
import ServiceRequestPDF from '@/components/service-request-form'; // adjust path if needed
import { Textarea } from "@/components/ui/textarea";
import CaseField from "@/components/CaseField";
import { Separator } from "@/components/ui/separator";

/**
 * TODO : 
 * ADDING THIS FUNCTION GLOBALLY OR MAKE THE CASE DETAIL INTO ONE
 */
const suffixToRoleMap = {
  CE: "ce",
  APO: "apo",
  Leader: "celead",
  PS: "ps",
  // Tambah sesuai kebutuhan
};

function extractRoleFromStatus(status) {
  const match = status.match(/^(NEW_Assign|Assign)([A-Za-z]+)/);
  if (match) {
    const suffix = match[2];
    return suffixToRoleMap[suffix] || null;
  }
  return null;
}


export const TabsServiceCaseDetails = ({ 
  caseDetails,
  setCaseDetails, 
  caseNote,
  caseNoteFormData,
  setCaseNoteFormData
}) => {
  
  
  const navigate = useNavigate();
  const [openWorkOrder, setOpenWorkOrder] = useState(false);

  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const { open } = useSidebar();
  const [entitlementStatus, setEntitlementStatus] = useState({
    OTCCode: ''
  })

  const [caseForm, setCaseForm] = useState({
    CaseType: "",
    CaseStatus: "",
    CaseSubject: "",
    Owner: "",
    CasePriority: "",
  });

  const [gtcForm, setGtcForm] = useState({
    global_trade_status: "",
    embargoed_country: "",
    gt_override_reason: "",
    gt_details: "",
    screening_id: "",
    gt_active_listening: "",
    gt_al_comments: "",
    });

   const [csrForm, setCsrForm] = useState({
    caseResolutionCode: "",
    autoClose: "",
    caseReadyForClosure: "",
    readyForCloseDays: "",
    readyForClosureDate: "",
    pendingCustomerAction: "",
    customerRequestedCloseDate: "",
  });

  const handleCaseDetails = (field) => (value) => {
    setCaseDetails((prev) => ({ ...prev, [field]: value }));
  }
  
  const handleCaseChange = (field) => (value) => {
    setCaseForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleCaseNoteChange = (key, value) => {
    setCaseNoteFormData((prev) => {
      const updated = { ...prev, [key]: value };
      console.log(" Updated Form:", updated); // Log on every change
      return updated;
    });
  };

  const handleGtcChange = (field) => (value) => {
    setGtcForm((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleEntitlementStatus = (field) => (value) => {
    setEntitlementStatus((prev) => ({ ...prev, [field]: value }));
  };

   const handleCsrChange = (field) => (value) => {
    setCsrForm((prev) => ({ ...prev, [field]: value }));
  };

 const handleSave = async (redirect = true) => {
  console.log("Form Data to Submit:", caseNoteFormData, gtcForm, entitlementStatus);
  console.log("CaseForm Data to Submit:", caseForm);

  try {
    Swal.fire({
      title: 'Saving Case...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const user = getUserFromToken();
    const timestamp = new Date().toLocaleString();
    const author = user?.name || user?.email || "Unknown User";
    const role = user?.role || "Unknown"; 

    const noteFilled = caseNoteFormData.Note && caseNoteFormData.Note.trim() !== "";
    const caseFilled = caseForm.CaseType && caseForm.CaseType.trim() !== "" ;
    const gtcEdited = gtcForm && Object.keys(gtcForm).length > 0;
    const entitlementEdited = entitlementStatus !== undefined;
    const csrEdited = csrForm && Object.keys(csrForm).length > 0;

    const hasIntentToSave = noteFilled || gtcEdited || entitlementEdited || csrEdited || caseFilled;

    if (!hasIntentToSave) {
      alert("Tidak ada data yang disimpan.");
      return;
    }

    let savedModules = [];
    const dataToUpdate = {};
    for (const target of ['NOTE', 'GTC', 'ENTITLEMENT', 'CSR', 'CASE']) {
      switch (target) {

       case 'NOTE':
  if (noteFilled) {
    const modifiedNote = `[@${timestamp}] by ${author} (${role})\n${caseNoteFormData.LogType} : ${caseNoteFormData.Note}`;

    const response = await ApiCustomer.post("/api/case-information/case-notes", {
      LogType: caseNoteFormData.LogType,
      ActionType: caseNoteFormData.ActionType,
      VisibleExternally: caseNoteFormData.VisibleExternally,
      Note: modifiedNote,
      CaseID: caseDetails.CaseID
    });
      dataToUpdate.CaseNote = response.data.data.NoteID;

    const NotedDisplay = `@Created On : ${response.data.data.CreatedOn}\n${response.data.data.Note}`;
    setCaseNotes({ NotesDisplay: NotedDisplay, 
          ActionType: caseNoteFormData.ActionType,
          LogType: caseNoteFormData.LogType,
          VisibleExternally: caseNoteFormData.VisibleExternally,});
    
     if (selectedSymptom) {
      dataToUpdate.SymptomCode = selectedSymptom.SymptomCodeID;
    }

    savedModules.push("Note");
  }
  break;

        case 'GTC':
          if (gtcEdited) {
            await ApiCustomer.patch("/api/case-information/global-trade-check", {
              ...gtcForm,
              screening_id: gtcForm.screening_id || "",
              CaseID: caseDetails.CaseID,
            });
            savedModules.push("GTC");
          }
          break;

        case 'ENTITLEMENT':
          if (entitlementEdited) {
            console.log(entitlementStatus);
            Object.assign(dataToUpdate, entitlementStatus); // includes OTCCo
            savedModules.push("Entitlement");
          }
          break;

        case 'CSR':
          if (csrEdited) {
            let response;
            if (caseDetails.id_csr) {
              response = await ApiCustomer.patch(`/api/caseResolution/${caseDetails.id_csr}`, {
                ...csrForm,
                caseResolutionCode: csrForm.caseResolutionCode || "",
              });
            } else {
              response = await ApiCustomer.post("/api/caseResolution", {
                ...csrForm,
                caseResolutionCode: csrForm.caseResolutionCode || "",
              });
              dataToUpdate.id_csr = response.data.data.id_csr;
            }
            savedModules.push("CSR");
          }
          break;

          case 'CASE':
          if (caseFilled) {
              try {
                console.log("CaseForm Data To Update: ", caseForm);
                const oldStatus = caseDetails.CaseStatus;
                let newStatus = caseForm.CaseStatus;
                
                // const isNewAssignStatus = newStatus.includes("NEW_Assign");
                savedModules.push("Case");
                if (oldStatus !== newStatus) {
                  // if(isNewAssignStatus) newStatus = "Open";
                   Object.assign(dataToUpdate, {
                    CaseType: caseForm.CaseType || "",
                    CaseStatus: newStatus || "",
                    Owner: caseForm.Owner || caseDetails.Owner
                  });
                  
                  const token = {
                    user: getUserFromToken()
                  }
                  await ApiCustomer.post("/api/actionlog", {
                    CaseId: `${caseDetails.CaseID}`,
                    ReferenceId: ``,
                    model: "Case",
                    dataOld: oldStatus,
                    dataNew: newStatus,
                    changedBy: token.user.id,
                    logDescription: `Edit : Change Case ${caseDetails.CaseID} Status from ${oldStatus} to ${newStatus}`,
                  });
                }
              } catch (err) {
                console.error("Gagal update case:", err);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Gagal menyimpan data case.",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                });
              }
          }
          break;
      }

      if (Object.keys(dataToUpdate).length > 0) {
        console.log("Data To Update: ", dataToUpdate);
        await ApiCustomer.patch(`/api/case-information/${caseDetails.CaseID}`, dataToUpdate);
      }
    }

    if (savedModules.length > 0) {
      if(redirect){
        await Swal.fire({
          icon: "success",
          title: "Berhasil Disimpan",
          // text: `Data berhasil disimpan: ${savedModules.join(", ")}`,
          text: "Data berhasil disimpan",
          timer: 2500,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        window.location.reload();
      }
      return true
    }

  } catch (error) {
    console.error("Save failed:", error);
    Swal.fire({
      icon: "error",
      title: error.message,
      text: error.response.data.message || "Something went wrong.",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      Swal.close();
    });
  }
};

const openPopup = () => {
  console.log("TeSPOP");
  const popup = window.open(
    '/auditwindows',
    'Popup Title',
    'width=600,height=400'
  );

  if (popup) {
    popup.focus();
  } else {
    alert('Popup blocked by browser. Please allow popups for this site.');
  }
};
  

  useEffect(() => {
    const loadNote = async () => {
      const noteDetail = caseNote;
      if(noteDetail ){
        const NotedDisplay = `@Created On : ${noteDetail.CreatedOn}\n${noteDetail.Note}`;
        setCaseNotes({
          NotesDisplay: NotedDisplay,
          ActionType: noteDetail.ActionType,
          LogType: noteDetail.LogType,
          VisibleExternally: noteDetail.VisibleExternally,
        })
      } 
    }
    loadNote()
  }, [])

  const [caseNotes, setCaseNotes] = useState([]);

  const buttons = [
    {
      icon: CircleChevronLeft,
      label: "",
      onClick: () => navigate(`/app/viewcase`),
    },
    { icon: SquareArrowOutUpRight, label: "",},
    { icon: Save, label: "Save", onClick: () => handleSave() },
    {
      icon: FileSymlink,
      label: "Save & Close",
      onClick: () => saveAndCloseCase(),
    },
    { icon: RotateCw, label: "Refresh", onClick: () => window.location.reload() },
    // { icon: StepBack, label: "Complaint",},
    { icon: StepBack, label: "SRF", onClick: async () => {
      const blob = await pdf(<ServiceRequestPDF caseDetails={caseDetails}  />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Service_Request_Form.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, },
    { icon: StepBack, label: "CSR", onClick: () => openServiceCatalog("CSR"), hidden: true },
    { icon: StepBack, label: "Service Order", onClick: () => openServiceCatalog("serviceorder"), hidden: true },
    { icon: StepBack, label: "Work Order", onClick: () => openServiceCatalog("workorder"), hidden:true },
    { icon: StepBack, label: "Sales Offer", hidden:true},
    { icon: StepBack, label: "Close Case", hidden:true },
    { icon: StepBack, label: "Pick", hidden:true },
    { icon: StepBack, label: "Queue Details", hidden:true},
    { icon: UserPen, label: "Assign", hidden:true },
    { icon: StepBack, label: "Add to Queue", hidden:true },
    { icon: StepBack, label: "Audit", onClick: () => openPopup(), hidden:true },
  ];
  console.log("TES CASE DETAILS VALUE",caseDetails);
  // const visibleButtons = open ? buttons.slice(0, -3) : buttons;
  // const hiddenButtons = open ? buttons.slice(-3) : [];
  const [serviceCatalogType, setServiceCatalogType] = useState("null");
  const openServiceCatalog = async (type) => {
    setOpenWorkOrder(true);
    setServiceCatalogType(type)
  };
  const saveAndCloseCase = async () => {

  //   if (!csrForm.caseResolutionCode || csrForm.caseResolutionCode.trim() === "") {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "Missing Case Resolution",
  //     text: "You must select a Case Resolution Code before closing the case.",
  //   });
  //   return;
  // }

    const confirmResult = await Swal.fire({
      title: "Confirm Save",
      text: "This will give the Case status as CLOSED. Are you sure you want to save changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it",
    });

    if (!confirmResult.isConfirmed) {
      return; 
    }
    try {
      
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we update the Case.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const success = await handleSave(false);
      if (!success) return; 
      const res = await ApiCustomer.patch(
        `/api/case-information/${caseDetails.CaseID}`,
        {
          CaseStatus: "Close",
          CaseClosedDate: new Date().toISOString(), 
        }
      );
      if (res.data.success) {
        const token = {
          user: getUserFromToken()
        }
        const updateLog = await ApiCustomer.post("/api/actionlog",{
          CaseId: `${caseDetails.CaseID}`,
          ReferenceId: ``,
          model: "Case",
          dataOld: caseDetails.CaseStatus,
          dataNew: res.data.data.CaseStatus,
          changedBy: token.user.id,
          logDescription: `Edit : Change Case ${caseDetails.CaseID} Status from ${caseDetails.CaseStatus} to ${res.data.data.CaseStatus}`
        })
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: res.data.message,
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          navigate(`/app/master/Case_table`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update!",
        text: error.message || "Something went wrong.",
      });
    }
  };
  return (
    <>
      <div className="flex items-center border-1 ">
        {/* {visibleButtons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            variant="link"
            className={`rounded-none px-0 py-0  flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5  `}
          >
            <btn.icon className="w-4 h-4" />
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))}

        {open && hiddenButtons.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="px-2 py-1 bg-gray-200 rounded-md">
              ...
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {hiddenButtons.map((btn, index) => (
                <DropdownMenuItem key={index} onClick={btn.onClick}>
                  <btn.icon className="inline-block w-4 h-4 mr-2" />
                  {btn.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}
        {buttons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            hidden={btn.hidden}
            variant="link"
            className={`rounded-none px-0 py-0  flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5  `}
          >
            <btn.icon/>
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))  }
        <BtnModalsServiceCatalog 
          open={openWorkOrder}
          setOpen={setOpenWorkOrder}
          caseDetails={caseDetails}
          serviceCatalogType={serviceCatalogType}
        />
      </div>
        <div>
          <ServiceCase
            caseDetails={caseDetails}
            formData={caseNoteFormData}
            setCaseNoteFormData={setCaseNoteFormData}
            formGtc={gtcForm}
            setFormGtc={setGtcForm}
            onChangeCase={handleCaseChange}
            caseForm={caseForm}
            setCaseForm={setCaseForm}
            onChangeGtc={handleGtcChange}
            onChange={handleCaseNoteChange}
            handleCaseDetails={handleCaseDetails}
            caseNotes={caseNotes}
            setCaseNotes={setCaseNotes}
            selectedSymptom={selectedSymptom}
            setSelectedSymptom={setSelectedSymptom}
            entitlementStatus={entitlementStatus}
            handleEntitlementStatus={handleEntitlementStatus}
            csrForm={csrForm}
            setCsrForm={setCsrForm}
            onChangeCsr={handleCsrChange}
          />
      </div>
    </>
  );
};








export const ServiceCase = ({
  caseDetails,
  formData,
  setCaseNoteFormData,
  onChange,
  caseNotes,
  setCaseNotes,
  handleCaseDetails,
  selectedSymptom,
  setSelectedSymptom,
  formGtc,
  setFormGtc,
  onChangeGtc,
  entitlementStatus,
  handleEntitlementStatus,
  csrForm,
  setCsrForm,
  onChangeCsr,
  caseForm,
  onChangeCase,
  setCaseForm,
}) => {
  const { open } = useSidebar();

  const [symptomSearchTerm, setSymptomSearchTerm] = useState("");
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);

  const [createdOn, setCreatedOn] = useState(null);
  const [caseClosedDate, setCaseClosedDate] = useState(null);
  const [submittedToBase, setsubmittedToBase] = useState(null);

  const [pendingCustomerAction, setPendingCustomerAction] = useState(null);
  const [customerRequestedCloseDate, setCustomerRequestedCloseDate] =
    useState(null);
  
  const [roleAssign, setRoleAssign] = useState([]);
  const [ReadyForClosureDate, setReadyForClosureDate] = useState(null);
  useEffect(() => {
    if (caseDetails?.CreatedOn) {
      setCreatedOn(new Date(caseDetails.CreatedOn)); // includes date + time
    }
  }, [caseDetails]);

  const tabs = [
    { value: "case_info", label: "Case & Customer", },
    { value: "customer,add,entitement", label: "Asset & Entitement", hidden: true },
    { value: "ci_notes", label: "Notes & Information", hidden: true },
    { value: "action_log", label: "Action Log", },
    { value: "ci_activitas", label: "Activities", disable: true, hidden: true },
    { value: "ci_actions", label: "Customer Interactions", disable: true, hidden: true},
    { value: "ci_wo", label: "Work Order Validation", disable: true ,hidden: true},
    { value: "ci_orders", label: "Orders",disable: true ,hidden: true},
    { value: "ci_salles", label: "Sales Offer", disable: true ,hidden: true},
    { value: "ci_knowledge", label: "Knowledge & Attachments", hidden: true},
    // { component: <SelectBarRelated />,},
  ];

  // const visibleTabs = open ? tabs.slice(0, -2) : tabs;
  // const hiddenTabs = open
  //   ? [
  //       { value: "ci_knowledge", label: "Knowledge & Attachments" },
  //       { component: <SelectBarRelated /> },
  //     ]
  //   : [];

  const [selected, setSelected] = useState("--Selected--"); 

  const [dataFetchCustomerData, setDataFetchCustomerData] = useState({
    MainAccount: null,
    SiteAccount: null,
    Type: null,
  });
  const [dataFetchAssetInformation, setDataFetchAssetInformation] = useState();
  const [ownerUserData, setOwnerUserData] = useState([]);

  const [workOrders, setWorkOrders] = useState([]);

  const [materialOrders, setMaterialOrders] = useState([]);

  const [actionLogs, setActionLogs] = useState([]);

  const fetchCustomerData = async () => {
    try {
      const resMainAccount = await ApiCustomer.get(
        `/api/contact-information/${caseDetails.ContactID}`
      );
      setDataFetchCustomerData({
        MainAccount: resMainAccount.data.data,
      });
      if (caseDetails.SiteAccountID !== null) {
        const resSiteAccount = await ApiCustomer.get(
          `/api/site_account/${caseDetails.SiteAccountID}`
        );
        setDataFetchCustomerData((prev) => ({
          ...prev,
          SiteAccount: resSiteAccount.data.data,
          Type: "SiteAccount",
        }));
      } else {
        setDataFetchCustomerData((prev) => ({
          ...prev,
          type: "Individual", 
        }));
      }
    } catch (err) {
      console.error("Error returning Customer Data : ", err);
      return null;
    }
  };

  const fetchAssetInformation = async () => {
    try {
      const resAsset = await ApiCustomer.get(
        `/api/asset-information/${caseDetails.AssetID}`
      );
      setDataFetchAssetInformation({
        AssetInformation: resAsset.data.data,
      });
    } catch (err) {
      console.error("Error returning Asset Data : ", err);
      return null;
    }
  };

  const fetchCaseNotes = async () => {
    try {
      const res = await ApiCustomer.get(`/api/case-information/case-notes`);
      const notes = res.data.data;

      const existingNote = notes.find(
        (note) => note.CaseID === caseDetails.CaseID
      );

      let noteID = null;

      if (existingNote) {
        noteID = existingNote.NoteID;
      } else {
        const createResponse = await ApiCustomer.post(
          `/api/case-information/case-notes`,
          {
            LogType: "NotesLog",
            ActionType: "",
            Template: "",
            VisibleExternally: false,
            MinutesSpent: 0,
            Note: "",
            CaseID: caseID,
          }
        );

        noteID = createResponse.data.data.NoteID;
      }

      const detailRes = await ApiCustomer.get(
        `/api/case-information/case-notes/${noteID}`
      );
      const noteDetail = detailRes.data.data;

      console.log("Case Note Detail:", noteDetail);
      return noteDetail;
    } catch (err) {
      console.error("Error in fetchCaseNotes:", err);
      return null;
    }
  };

  const fetchOwnerUserData = async () => {
    try {
      const response = await ApiCustomer.get(`/api/user/${caseDetails.Owner}`)
      setOwnerUserData(response.data.data)
    } catch (error) {
      
    }
  }

  const fetchWorkOrders = async () => {
    try {
      const res = await ApiCustomer.get(
        `/api/work-order?CaseID=${caseDetails.CaseID}`
      );
      setWorkOrders(res.data.data); // adjust based on API response shape
      console.log("Fetch Work Order: ", res.data.data);
    } catch (err) {
      console.error("Failed to fetch work orders:", err);
    }
  };

  const fetchMaterialOrders = async () => {
    try {
      if (!workOrders.length) return;

      const woidList = workOrders.map((wo) => wo.WOID).join(",");
      const res = await ApiCustomer.get(`/api/material-order?WOID=${woidList}`);
      setMaterialOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch Material orders:", err);
    }
  };

  const fetchGtc = async () => {
    try {
      const gtcData = caseDetails.global_trade_check;
      setFormGtc(gtcData ?? formGtc); 
    } catch (err) {
      console.error("Error fetching GTC:", err);
      setFormGtc(formGtc); 
    }
  };

  const [otcCode, setOtcCode] = useState([])
  
  const fetchOTCCode = async () => {
    try{
      const res = await ApiCustomer.get('/api/otc-code')
      setOtcCode(res.data.data)
    }catch(e){
      console.error("Failed to fetch OTC Code:", err);
    }
  }

  const [caseTipe, setCaseTipe] = useState([
    {
      CaseType : "Administrative"
    },
    {
      CaseType : "ASP/Reseller/GS1"
    },
    {
      CaseType : "Bench"
    },
    {
      CaseType : "Call to Repair"
    },
    {
      CaseType : "Complex T&M"
    },
    {
      CaseType : "Depot Repair"
    },
    {
      CaseType : "Electronic"
    },
    {
      CaseType : "HW Delivery"
    },
    {
      CaseType : "IMACD"
    },
    {
      CaseType : "Internal Service"
    },
    {
      CaseType : "Internal Support"
    },
    {
      CaseType : "Onsite"
    },
    {
      CaseType : "Proactive"
    },
    {
      CaseType : "Remote Services"
    },
    {
      CaseType : "Services (VAS)"
    },
    {
      CaseType : "SW Delivery"
    },
    {
      CaseType : "T&M"
    },
  ])

  const fetchCsr = async () => {
  try {
    const csrData = caseDetails.caseresolution;
    console.log("CSR Data: ", csrData);

    if (csrData) {
      setCsrForm({
        caseResolutionCode: csrData.caseResolutionCode || "",
        autoClose: csrData.autoClose || "",
        caseReadyForClosure: csrData.caseReadyForClosure || "",
        readyForCloseDays: csrData.readyForCloseDays || "",
        readyForClosureDate: csrData.readyForClosureDate ? new Date(csrData.readyForClosureDate) : "",
        pendingCustomerAction: csrData.pendingCustomerAction ? new Date(csrData.pendingCustomerAction) : "",
        customerRequestedCloseDate: csrData.customerRequestedCloseDate ? new Date(csrData.customerRequestedCloseDate) : "",
      });
    } else {
      setCsrForm(csrForm); 
    }
  } catch (err) {
    console.error("Error fetching CSR:", err);
    setCsrForm(csrForm); 
  }
};


  const statusEnumToLabel = {
    New: "New",
    Open: "Open",
    InActive: "Inactive",
    Close: "Closed",
    Active: "Active",
    Monitor: "Monitor",
    Pending_Customer_Action: "Pending Customer Action",
    Quote_Requested: "Quote Requested",
    Pending_Follow_Up: "Pending Follow Up",
    Pending_Order: "Pending Order",
    Escalated: "Escalated",
    Quote_Approved: "Quote Approved",
    Pending_Quote: "Pending Quote",
    NEW_AssignCE: "New Assign To CE",
    NEW_AssignLeader: "New Assign To Leader",
    NEW_AssignAPO: "New Assign To APO",
    NEW_AssignPS: "New Assign To Product Store",
    NEW_POPDoc: "New Needed POP Document",
    NEW_Warranty: "New Warranty Approval"
  };

  const assignToForm= true;
  // const assignToForm = statusEnumToLabel.startsWith("NEW_Assign");

  

// const labelToStatusEnum = Object.fromEntries(
//   Object.entries(statusEnumToLabel).map(([key, val]) => [val, key])
// );
const labelToStatusEnum = Object.entries(statusEnumToLabel).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {});


const fetchUserAssign = async (role) => {
  try {
    const res = await ApiCustomer.get(`/api/user?role=${role}`);
    setRoleAssign(res.data.data);
  } catch (err) {
    console.error("Error fetching role: ",err);    
  }
}



const fetchCase = async () => {
  try {
    const res = await ApiCustomer.get(`/api/case-information/${caseDetails.CaseID}`);
    setCaseForm(res.data.data);
  } catch (err) {
    console.error("Error fetching case:", err);
    setCaseForm(caseForm); // fallback jika error
  }
};

const fetchActionLog = async () => {
  try {
    const actionlog = await ApiCustomer.get(`/api/actionlog?caseId=${caseDetails.CaseID}`)
    setActionLogs(actionlog.data.data)
  } catch (error) {
    console.error("Error fetching ActionLog:", err);
  }
}

  //handler all case
  useEffect(() => {
    fetchCustomerData();
    fetchAssetInformation();
    fetchOwnerUserData();

    fetchWorkOrders();
    const loadNote = async () => {
      const noteDetail = await fetchCaseNotes();
      if (noteDetail) {
        setCaseNoteFormData((prev) => ({
          ...prev,
          NotesDisplay: noteDetail.Note,
          ActionType: noteDetail.ActionType,
          CreatedOn: noteDetail.CreatedOn,
          LogType: noteDetail.LogType,
          VisibleExternally: noteDetail.VisibleExternally,
        }));
      }
    };
    loadNote();
    fetchGtc(); 
    fetchOTCCode();
    fetchCsr();
    fetchCase();
    fetchActionLog();
  }, []);
  useEffect(() => {
    fetchUserAssign();
  }, [assignToForm]);

  useEffect(() => {
    if (otcCode.length > 0 && caseDetails?.OTCCode) {
      handleEntitlementStatus("OTCCode")(caseDetails.OTCCode)
    }
  }, [otcCode, caseDetails]);

  useEffect(() => {
    console.log("Data Asset Info : ", dataFetchAssetInformation);

    console.log("Fetch Data Customer Success : ", dataFetchCustomerData);
    console.log("Fetch Data User ", ownerUserData);
  }, [ownerUserData]);

  // console.log("Selected Symptopm ",selectedSymptom)

  // useEffect(() => {
  // }, selectedSymptom)

  //order section
  //workorder

  useEffect(() => {
    console.log("Work Orders Fetching L ", workOrders);
    if (workOrders.length > 0) {
      fetchMaterialOrders();
    }
  }, [workOrders]);

  const navigate = useNavigate();

  const handleClick = async () => {
    // await fetchOwnerUserData();
    // await fetchCustomerData();
    {
      workOrders.map((work) => {
        navigate(`/app/work/${work.WOID}`, {
          // state: { ownerUserData, dataFetchCustomerData }
        });
      });
    }
  };

useEffect(() =>{
  console.log("Data Asset Info : ",dataFetchAssetInformation)
  
  console.log("Fetch Data Customer Success : ",dataFetchCustomerData)
  console.log("Fetch Data User ", ownerUserData)
}, [ownerUserData])

const fetchSymptomCodes = async (term) => {
  try {
    const response = await ApiCustomer.get("/api/symptom-codes");
    const allCodes = response.data.data;

    const filtered = allCodes.filter((sym) =>
      sym.SymptomCode.toLowerCase().includes(term.toLowerCase())
    );

    setSymptomSuggestions(filtered);
  } catch (err) {
    console.error("Error fetching symptom codes", err);
  }
};



  return (
    <>
      {caseDetails.CaseStatus === "Close" && (
        <div className="p-4 mt-2 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This Case is <strong>read-only</strong> because it is
          <strong>Closed</strong>.
        </div>
      )}
      <Card className="border-0 w-full">
        <Tabs defaultValue="case_info">
          <CardHeader className="sticky flex flex-col w-full gap-3 p-2 border-2 ">
            <div className="flex justify-between">
              <CardTitle className="text-2xl pl-1">
                {caseDetails.CaseID}
                <span className="flex items-center text-sm">
                  Case .
                  <Select
                    onValueChange={setSelected}
                    defaultValue="case"
                    className="shadow-xl"
                  >
                    <SelectTrigger className="border-none shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="case">Case</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </span>
              </CardTitle>
              <CardTitle className="flex">
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <h1 className="text-blue-500">{ownerUserData.Name}</h1>
                  <p className="text-sm font-light ">Owner</p>
                </div>
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <h1 className="text-blue-500">---</h1>
                  <p className="text-sm font-light ">Queue</p>
                </div>
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <h1 className="text-blue-500">
                    {dataFetchCustomerData.MainAccount?.Salutation}
                    {dataFetchCustomerData.MainAccount?.FirstName}
                    {dataFetchCustomerData.MainAccount?.LastName}
                  </h1>
                  <p className="text-sm font-light ">Contact</p>
                </div>
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <Select onValueChange={setSelected} defaultValue="first">
                    <SelectTrigger className="p-0 text-blue-500 border-none shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="p-0">
                      <SelectGroup className="p-0">
                        <SelectItem value="first" className="p-0">
                          {dataFetchCustomerData.SiteAccount?.Company}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-sm font-light ">Site Account</p>
                </div>
                
              </CardTitle>
            </div>
            <TabsList className="bg-white">
            {tabs.map((tab,index) => (
              tab.component ? (
                <div key={index}>{tab.component}</div> 
              ) : (
                <TabsTrigger
                  key={index}
                  variant="underline"
                  value={tab.value}
                  disabled={tab.disable}
                  hidden={tab.hidden}
                  className="text-sm font-normal"
                >
                  {tab.label}
                </TabsTrigger>
              )
            ))}


            </TabsList>
          </CardHeader>

          <TabsContent value="case_info" className={"p-2 flex flex-col gap-5"}>
          <div  className={" grid lg:grid-cols-2 md:grid-cols-1 gap-4 "}>
            <Card className="flex-col">
              <CardHeader>
                <CardTitle className={"text-lg  flex gap-3"}><Briefcase/>Case Information</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <CaseField label="Case Subject" lock span={3}>
                    <Textarea
                     value={caseDetails?.CaseSubject}
                      onChange={e => handleCaseDetails("CaseSubject")(e.target.value)}
                     className="resize-none border-none italic text-2xl"
                    />
                </CaseField>
              
                <CaseField label="Case ID manual" className={"mt-2"} lock span={2}>  
                    <Input variant="invisible" placeholder="---"
                      value={caseDetails.CaseIdManual}
                      onChange={e => handleCaseDetails("CaseIdManual")(e.target.value)}
                    />                    
                </CaseField>

                {/* detail owner */}
                <CaseField label="Created By" className={"mt-2"} lock span={2}>  
                {/* {console.log("Bool to check wo owner aaliabe : ", caseDetails?.workorder[0]?.owner?.IDUser)} */}
                    <Input variant="invisible" placeholder="---" value={caseDetails.createdByUser.Name} readOnly/>                    
                </CaseField>
                {caseDetails?.workorder[0]?.owner?.IDUser && (
                  <CaseField label="Engineer name" className={"mt-2"} lock span={2}>  
                      <Input variant="invisible" placeholder="---" value={caseDetails.workorder[0].owner.Name} readOnly/>                    
                  </CaseField>
                )}
                {caseDetails?.workorder[0]?.materialorder[0]?.owner?.IDUser && (
                  <CaseField label="APO name" className={"mt-2"} lock span={2}>  
                      <Input variant="invisible" placeholder="---" value={caseDetails.workorder[0].materialorder[0].owner.Name} readOnly/>                    
                  </CaseField>
                )}
                
              
                <CaseField label="Case Status" className={"mt-2"}  span={2}>
                  <SearchCommandBlock
                      value={statusEnumToLabel[caseForm?.CaseStatus] || "--Select--"}
                      onChange={ async (label) => {
                        

                        const enumValue = labelToStatusEnum[label];
                        onChangeCase("CaseStatus")(enumValue);
                        console.log("Selected label:", label);
                        console.log("Mapped enum:", enumValue);
                        
                        if(enumValue.startsWith("NEW_Assign")) {
                          const role = extractRoleFromStatus(enumValue);
  // console.log("Extracted role:", role)
                          console.log("Mapped enum:", role);
                          
                          if(role) {
                            try {
                              fetchUserAssign(role);
                              console.log("Mapped enum:", roleAssign);
                            } catch (err) {
                              console.error("Error fetching role: ", err);
                            }
                          }
                        } else{
                          setRoleAssign([]);
                        }
                        
                      }}
                      placeholder="--Select--"
                      options={Object.values(statusEnumToLabel)}
                    />

                </CaseField>
                <CaseField label="Assign To" className={"mt-2"}  span={2} hide={!caseForm?.CaseStatus?.startsWith("NEW_Assign")}>
                    <SearchCommandBlock
                      value={caseForm?.Owner}
                      onChange={(selectedID) => {
                            if (selectedID === null) {
                          onChangeCase("AssignTo")(null); // Clear the value!
                          return;
                        }
                        const selectedUser = roleAssign.find(user => user.IDUser === selectedID);
                        if (selectedUser) {
                          onChangeCase("Owner")(selectedUser.IDUser);
                        }
                      }}
                      placeholder="--Select--"
                      options={roleAssign.map(user => ({ label: user.Name, value: user.IDUser }))}
                      renderLabel={(opt) => opt.label}
                      getValue={(opt) => opt.value}
                    />
                  </CaseField>
                {/* {assignToForm == true ?? (
                )} */}

                <CaseField label="Case Type" open className={"mt-2"} span={2}>
                  <SearchCommandBlock
                    value={caseForm?.CaseType}
                    onChange={onChangeCase("CaseType")}
                    placeholder="--Select--"
                    options={[
                    "Depot Repair",
                    "Onsite",
                    "Bench",
                    ]}
                    />
                </CaseField>

                 <CaseField label="Case Priority" className={"mt-2"} lock span={2}>
                  {/* <Input variant="invisible" value={caseDetails.CasePriority}/> */}
                  <SelectBar
                    id="Country"
                    value={caseDetails?.CasePriority}
                    onChange={e => handleCaseDetails("CasePriority")(e.target.value)}
                    options={[
                      { id: "low", name: "Low" },
                      { id: "medium", name: "Medium" },
                      { id: "important", name: "Important" },
                    ]}
                    placeholder="Select a Country"
                  />
                </CaseField>

                <CaseField label="Customer Severity" className={"mt-2"} lock span={2}>
                  <Input
                    variant="invisible"
                    value={caseDetails.CustomerSeverity}
                  />
                </CaseField>

                  <CaseField label="Incoming Channel" className={"mt-2"} lock span={2}>
                  <Input
                    variant="invisible"
                    value={caseDetails.IncomingChannel}
                  />
                </CaseField>

                <CaseField label="KCI For Case?" lock span={2}>
                     <Input 
                      variant="invisible"
                      value={caseDetails.KCI_Flag ? "Yes" : "No"}
                     />
                </CaseField>               
                <CaseField label="Created ON" span={2} lock>
                  <DatePicker
                    variant="icon"
                    value={createdOn}
                    onChange={setCreatedOn}
                    
                  ></DatePicker>
                </CaseField>

                <Accordion type="single" collapsible className="w-full col-span-2">
                  <AccordionItem value="more-details" className="pl-5">
                    <AccordionTrigger className={"decoration-transparent border-1 p-2 cursor-pointer"}>More Details</AccordionTrigger>
                    <AccordionContent className={"m-1"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CaseField label="Case Closed Date">
                        <span className="gap-[5em]">
                          {/* {caseClosedDate ? format(caseClosedDate, "dd/M/yyyy") : "---"} */}
                          <DatePicker
                            variant="icon"
                            value={caseClosedDate}
                            onChange={setCaseClosedDate}
                            readOnly
                          ></DatePicker>
                        </span>
                      </CaseField>

                      <CaseField label="Submitted To Base">
                        <span className="gap-[5em]">
                          <DatePicker
                            variant="icon"
                            value={submittedToBase}
                            onChange={setsubmittedToBase}
                            readOnly  
                          ></DatePicker>
                        </span>
                      </CaseField>
                      <CaseField label="Business Segment" >
                        <Input variant="invisible" placeholder="---"/>
                      </CaseField>          
                
                      <CaseField label="HPI Segment" >
                        <Input variant="invisible" placeholder="---"/>
                      </CaseField>
                  
                      <CaseField label="Customer Tracking Number" >
                        <Input variant="invisible" placeholder="---"/>
                      </CaseField>
                    
                      <CaseField label="Update Customer Tracking Number">
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>
                      <CaseField label="Alternate Customer Tracking Number" >
                        <Input variant="invisible" placeholder="---"/>
                      </CaseField>
                    
                      <CaseField label="Irrelevant" >
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>
                    
                        
                      <CaseField label="Email Status"  >
                        <Input variant="invisible" placeholder="---"/>
                      </CaseField>

                        <CaseField label="Case ID" lock  className={"hidden"}>
                        <Input
                          variant="invisible"
                          value={caseDetails.CaseID}
                          readOnly
                          hidden
                        />
                      </CaseField>
                    </div>
                  </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
                    
            <Card className="flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex gap-3"><Contact/>Customer Information</CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid items-center grid-cols-2 gap-3">
                <CaseField label="Customer Account"  lock>
                  <Input
                    variant="invisible"
                    value={
                      dataFetchCustomerData?.Type == "SiteAccount"
                        ? dataFetchCustomerData?.SiteAccount?.Company
                        : dataFetchCustomerData?.MainAccount?.FirstName +
                          " " +
                          dataFetchCustomerData?.MainAccount?.LastName
                    }
                    readOnly
                  />
                </CaseField>
                <CaseField label="Primary Contact" lock>
                  <Input
                    variant="invisible"
                    value={`${dataFetchCustomerData.MainAccount?.Salutation} ${dataFetchCustomerData.MainAccount?.FirstName} ${dataFetchCustomerData.MainAccount?.LastName}`}
                    readOnly
                  />
                </CaseField>
                 <CaseField label="Secondary Contact" lock>
                  <Input variant="invisible" placeholder="---" />
                </CaseField>
                <CaseField label=" Primary Email" lock>
                  <Input
                    variant="invisible"
                    value={dataFetchCustomerData.MainAccount?.Email}
                    placeholder="---"
                    readOnly
                  />
                </CaseField>
                <CaseField label="Country" lock>
                  <Input
                    variant="invisible"
                    value={
                      dataFetchCustomerData?.Type == "SiteAccount"
                        ? dataFetchCustomerData?.SiteAccount?.Country
                        : dataFetchCustomerData?.MainAccount?.Country
                    }
                    readOnly
                  />                  
                </CaseField>
                <CaseField label="Phone" lock>
                  <span className="pl-3">
                  {dataFetchCustomerData?.Type == "SiteAccount"
                    ? dataFetchCustomerData?.SiteAccount?.PrimaryPhone
                    : dataFetchCustomerData?.MainAccount?.Phone}
                  </span>
                </CaseField>
                <CaseField label="Region" lock>
                  <Input 
                  variant="invisible" 
                  placeholder="---" readOnly 
                  value={dataFetchCustomerData.SiteAccount?.City}/>
                </CaseField>
                <CaseField label="Is Partner" lock>
                  <Input variant="invisible" placeholder="---" readOnly/>
                </CaseField>
                <CaseField label="Partner & Customer" lock>
                  <Input variant="invisible" placeholder="---"  readOnly/>
                </CaseField>
                <Accordion type="single" collapsible className="col-span-2">
                  <AccordionItem value="more-details" className={"pl-5 "}>
                    <AccordionTrigger className={"decoration-transparent border p-2 cursor-pointer"}>More Details</AccordionTrigger>
                    <AccordionContent className="m-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                        <CaseField label="Submitted By">
                          <Input variant="invisible" placeholder="---"  />
                        </CaseField>
                        <CaseField label="HIPAA" >
                          <Input variant="invisible" placeholder="---" readOnly/>
                        </CaseField>
                        <CaseField label="PIN">
                          <Input variant="invisible" placeholder="---" />
                        </CaseField>              
                        <CaseField label="Parent Company">
                          <Input variant="invisible" placeholder="---" />
                        </CaseField>
                        <CaseField label="Parent Company Non-Latin">
                          <Input variant="invisible" placeholder="---" />
                        </CaseField>
                        <CaseField label="Customer Time Zone">
                          <Input variant="invisible" placeholder="---" readOnly/>
                        </CaseField>
                        <CaseField label="Account Tier">
                          <Input variant="invisible" placeholder="---"/>
                        </CaseField>
                      </div>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

          </div> 

            <Card className="flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex gap-3"><Computer/> Asset Information</CardTitle>
                <Separator />
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* LEFT COLUMN - Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                      <CaseField label="Assets" lock>
                        {dataFetchAssetInformation?.AssetInformation?.SerialNumber}
                      </CaseField>

                      <CaseField label="Product Number" lock>
                        {
                          dataFetchAssetInformation?.AssetInformation
                            ?.product_information?.ProductNumber
                        }
                      </CaseField>

                      <CaseField label="Asset Location" lock>
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>

                      <CaseField label="Serial Number" lock>
                        {dataFetchAssetInformation?.AssetInformation?.SerialNumber}
                      </CaseField>

                      <CaseField label="HWPC Code" lock>
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>

                      <CaseField label="SNIC - Count" lock>
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>

                      <CaseField label="Product Name" lock>
                        {
                          dataFetchAssetInformation?.AssetInformation
                            ?.product_information?.ProductName
                        }
                      </CaseField>

                      <CaseField label="MV Product Description" lock>
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>

                      <CaseField label="HW Profit Center" lock>
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>

                      <CaseField label="Device Properties" lock >
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>

                      <CaseField label="OTC Code"  star>
                        <SearchCommandBlock
                          options={otcCode}
                          value={entitlementStatus.OTCCode}
                          onChange={(value) => handleEntitlementStatus("OTCCode")(value)}
                          placeholder="---"
                          renderLabel={(opt) => `${opt.OTCCode} - ${opt.Description}`}
                          getValue={(opt) => opt.OTCCode}
                        />
                      </CaseField>
                    </div>
                  </div>

                  {/* RIGHT COLUMN - Accessory */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Accessory</h3>
                    <Separator className="my-4" />
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-4 py-2 border">No Accessories</th>
                            <th className="px-4 py-2 border hidden">Case ID</th>
                            <th className="px-4 py-2 border">Accessories</th>
                            <th className="px-4 py-2 border">Note</th>
                            <th className="px-4 py-2 border">CT / SN Code</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caseDetails.accessory?.length ? (
                            caseDetails.accessory.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{item.id}</td>
                                <td className="px-4 py-2 border hidden">{item.CaseID}</td>
                                <td className="px-4 py-2 border">{item.Accessories}</td>
                                <td className="px-4 py-2 border">{item.Note || "---"}</td>
                                <td className="px-4 py-2 border">{item.CT_SNCode || "---"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="px-4 py-2 border text-center" colSpan={5}>
                                No accessories found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Total Accessories: {caseDetails.accessory?.length || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* --- Card 23 
            `` Customer Issue & System Info --- */}
            <Card className="flex-col">
              <CardHeader>
                <CardTitle className="text-lg  flex gap-3">
                  <FileSliders/>
                  Customer Issue Description & System Information
                </CardTitle>
                <Separator />
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* LEFT COLUMN - Issue Description */}
                  <div className="space-y-6">
                    <textarea
                      className="w-full h-48 resize-none border rounded-md p-3 text-sm ring-1 ring-gray-300 bg-gray-50"
                      readOnly
                      value={caseDetails?.CaseProductNote}
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <CaseField label="Related Device" >
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>
                      <CaseField label="Device Manufacturer" >
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>
                      <CaseField label="Device Model" >
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>
                    </div>
                  </div>

                  {/* RIGHT COLUMN - System Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <CaseField label="Program/Category" >
                      <Input variant="invisible" placeholder="---" />
                    </CaseField>
                    <CaseField label="Operating System" >
                      <Input variant="invisible" placeholder="---" />
                    </CaseField>
                    <CaseField label="Version" >
                      <Input variant="invisible" placeholder="---" />
                    </CaseField>
                    <CaseField label="Remote Diag Code" >
                      <Input variant="invisible" placeholder="---" />
                    </CaseField>
                    <CaseField label="Application Information" >
                      <Input variant="invisible" placeholder="---" />
                    </CaseField>
                    <CaseField label="Provider / Platform" >
                      <Input variant="invisible" placeholder="---" />
                    </CaseField>
                    <CaseField label="Software Version" >
                      <Input variant="invisible" placeholder="---" />
                    </CaseField>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* --- Card 3: Case Notes --- */}
            <Card className="flex-col">
              <CardHeader>
                <CardTitle className="text-lg  flex gap-3"><NotepadText/>Case Notes</CardTitle>
                <Separator />
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* LEFT COLUMN - Input Fields */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <CaseField label="Log Type" >
                        <Select
                          value={formData?.LogType}
                          onValueChange={(val) => onChange("LogType", val)}
                        >
                          <SelectTrigger className="w-full p-3 border rounded-md hover:shadow">
                            <SelectValue placeholder="Log Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NotesLog">Notes Log</SelectItem>
                            <SelectItem value="PhoneLog">Phone Log</SelectItem>
                          </SelectContent>
                        </Select>
                      </CaseField>

                      <CaseField label="Action Type" >
                        <SearchCommandBlock
                          value={formData?.ActionType}
                          onChange={(val) => onChange("ActionType", val)}
                          placeholder="--Select--"
                          options={[
                            "Inbound Customer call",
                            "Action Plan",
                            "Administrative task",
                            "CE/Partner Assist",
                            "Customer Email",
                          ]}
                        />
                      </CaseField>

                      <CaseField label="Template" >
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>

                      <CaseField label="Visible Externally" >
                        <SelectYN
                          value={
                            formData?.VisibleExternally === undefined ||
                              formData?.VisibleExternally === null
                              ? ""
                              : formData?.VisibleExternally
                                ? "Yes"
                                : "No"
                          }
                          onValueChange={(val) =>
                            onChange("VisibleExternally", val === "Yes")
                          }
                        />
                      </CaseField>

                      <CaseField label="Number of Minutes Spent" >
                        <Input variant="invisible" placeholder="---" />
                      </CaseField>
                    </div>

                    <CaseField label="Notes"  star>
                      <textarea
                        className="w-full h-40 resize-none border rounded-md p-3 text-sm ring-1 ring-gray-300"
                        value={formData?.Note || ""}
                        onChange={(e) => onChange("Note", e.target.value)}
                      />
                    </CaseField>
                  </div>

                  {/* RIGHT COLUMN - Display Notes */}
                  <div>
                    <textarea
                      className="w-full h-full min-h-[300px] resize-none border rounded-md p-3 text-sm ring-1 ring-gray-300 bg-gray-50"
                      readOnly
                      value={formData?.NotesDisplay}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


          </TabsContent>

        <TabsContent value="action_log" >
          <div className="mt-2 p-1">
            <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">Action Log</CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">No</TableHead>
                          <TableHead>ReferenceId</TableHead>
                          <TableHead>Change By</TableHead>
                          <TableHead>Old Status</TableHead>
                          <TableHead>New Status</TableHead>
                          <TableHead>Change At</TableHead>
                          <TableHead>Log Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {actionLogs?.length > 0 ? (
                          actionLogs.map((log, index) => (
                            <TableRow key={log.id || index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{log.ReferenceId}</TableCell>
                              <TableCell>{log.changedByUser?.Name}</TableCell>
                              <TableCell>{log.dataOld}</TableCell>
                              <TableCell>{log.dataNew}</TableCell>
                              <TableCell>{new Date(log.ChangeAt).toLocaleString()}</TableCell>
                              <TableCell>{log.logDescription}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center italic">
                              No action logs available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
            </Card>
          </div>
        </TabsContent>

        </Tabs>
      </Card>
    </>
  );
};
  