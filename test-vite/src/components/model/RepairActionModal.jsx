import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "../ui/card";
import CaseField from "../CaseField";
import { Textarea } from "../ui/textarea";
import { debounce } from "lodash";
import { SearchCommandBlock } from "../sc-select";
import ApiCustomer from "@/api";
import { toast } from "sonner";
export const RepairActionDialog = ({ open, onOpenChange, onSubmit, canEdit, workOrders }) => {
  const [step, setStep] = useState("form");
  const [NMUList, setNMUList] = useState([]);
  const [NMUItemNeed, setNMUItemNeed] = useState(false);
  const [NMUVersionNeed, setNMUVersionNeed] = useState(false);
  const [nmuNotFound, setNMUNotFound] = useState(false)
  const [NMUItemList, setNMUItemList] = useState([]);
  const [nmuItemNotFound, setNMUItemNotFound] = useState(false)
  const [delayCodeList, setDelayCodeList] = useState(null);
  const [selectedNMU, setSelectedNMU] = useState("");
  const [selectedNMUItem, setSelectedNMUItem] = useState("");
  const [formData, setFormData] = useState({
    serviceType: "",
    nmu: null,
    nmuItem: null,
    Version: null,
    defectDesc: "",
    ceAnalysis: "",
    repairAction: "",
    delayCode : null,
  });

  const fetchNMU = async () =>{
    try {
      const res = await ApiCustomer.get(`/api/nmu`);
      const list = res.data?.data || [];
      setNMUList(list);
      setNMUNotFound(list.length === 0);
    } catch (e) {
      console.error("Search NMU failed", e);
      setNMUList([]);
      setNMUNotFound(true);
    }
  }

  const fetchNMUList = async () => {
    try {
      const res = await ApiCustomer.get(`/api/nmu/nmuitem`);
      const list = res.data?.data || [];
      console.log("NMU LIST : ",list)
      setNMUItemList(list);
      setNMUItemNotFound(list.length === 0);
    } catch (e) {
      console.error("Search NMU failed", e);
      setNMUItemList([]);
      setNMUItemNotFound(true);
    }
  }
  useEffect(()=>{
    fetchNMU();
    fetchNMUList();
  },[])
  useEffect(() => {
    setFormData(prev => ({ ...prev, nmuItem: "" }));
    setSelectedNMU(NMUList.find(item => item.NMUId === formData.nmu));
    
    if (selectedNMU) {
      setNMUItemNeed(selectedNMU.ItemNeeded)
      setNMUVersionNeed(selectedNMU.VersionNeeded)
    }
    // const nmuDesc = NMUList.find()
  }, [formData.nmu]);

  useEffect(()=>{
    setSelectedNMUItem(NMUItemList.find(item => item.id === formData.nmuItem));
  }, [formData.nmuItem])

  /**
   * TODO FOR SLAMET :
   * ENUM TO LABEL DELAY CODE
   */
  const delayCodeEnumToLabel = {
    PartBackOrder: "Part Back Order",
    IntermittentCase: "Intermitten Case",
    CustomerCausedDelay: "Customer Caused Delay",
    MultipleIssue: "Multiple Issue",
    WarrantySalesDelayApproval: "WarrantySalesDelayApproval",
    EscalationComplexIssue: "EscalationComplexIssue",
    WrongPartOrderorAnalysis: "WrongPartOrderorAnalysis",
    CaseHandlingDelay: "CaseHandlingDelay",
    PartDOA: "PartDOA",
    NOCEAvailable: "NOCEAvailable",
    CutOffTime: "CutOffTime",
    HPSystemDown: "HPSystemDown",
    ADPInvestigation: "ADPInvestigation",
    RecoveryOS: "RecoveryOS",
    UpdateWindows: "UpdateWindows",
    OfficeClosure: "OfficeClosure",
    AMRMonitor: "AMRMonitor",
    TravelDelay: "TravelDelay",
  };
  const labelToStatusEnum = Object.fromEntries(
    Object.entries(delayCodeEnumToLabel).map(([key, val]) => [val, key])
  );



  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitStep = (e) => {
    e?.preventDefault?.();
    const requiredFields = [
      { key: "defectDesc", label: "Defect Description" },
      { key: "ceAnalysis", label: "CE Analysis" },
      { key: "repairAction", label: "Repair Action" },
      { key: "delayCode", label: "Delay Code", 
        // condition: NMUVersionNeed 
      },
    ];

    const emptyFields = requiredFields.filter(field => {
      if (field.condition === false) return false; // skip if condition is false
      return !formData[field.key] || formData[field.key].toString().trim() === "";
    });

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(f => `- ${f.label}`).join("\n");
      toast.warning(`Mohon isi field berikut sebelum melanjutkan:\n\n${fieldNames}`,{
        position: 'top-center'
      });
      return;
    }
    setStep("confirm"); // go to confirmation screen
  };

  const handleConfirm = () => {
    onSubmit(formData); // send data
    setStep("form");
    onOpenChange(false); // close dialog
  };

  const handleCancelConfirm = () => {
    setStep("form"); // back to form
  };
  
console.log(formData);
  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!o) setStep("form"); // reset on close
      onOpenChange(o);
    }}>
      <DialogContent
        className={`transition-all duration-300 max-h-[90vh] bg-white ${
          step === "confirm" ? "sm:max-w-[700px]" : "sm:max-w-[900px]"
        }`}
      >
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? "Repair Action" : "Confirm Repair Action"}
          </DialogTitle>
          <DialogDescription>
            {step === "form"
              ? "Tambahkan tindakan perbaikan yang diperlukan untuk work order ini."
              : "Pastikan data berikut sudah benar sebelum disimpan."}
          </DialogDescription>
        </DialogHeader>

        {/* FORM VIEW */}
        {step === "form" && (
          <Card className="mt-2">
            <CardContent className="grid grid-cols-4 gap-3">
              <CaseField label="Problem category" lock>
                <Input
                  id="ProblemCategory"
                  value={workOrders?.WorkOrderType || ""}
                  onChange={(e) => handleChange("problemCategory", e.target.value)}
                />
              </CaseField>

              <CaseField label="Service type" lock>
                <Input
                  id="ServiceType"
                  value={workOrders?.serviceCatalog?.warranty_services?.Service_description || ""}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                />
              </CaseField>
              <CaseField label="Defec desc" star={canEdit} lock={!canEdit}>
                <Textarea
                  onChange={(e) => handleChange("defectDesc", e.target.value)}
                />
              </CaseField>

              <CaseField label="CE analysis" star={canEdit} lock={!canEdit}>
                <Textarea
                  onChange={(e) => handleChange("ceAnalysis", e.target.value)}
                />
              </CaseField>

              <CaseField label="Repair Action" star={canEdit} lock={!canEdit}>
                <Textarea
                  onChange={(e) => handleChange("repairAction", e.target.value)}
                />
              </CaseField>

              <CaseField label="NMU" lock={!canEdit}>
                {/* <Input
                  id="ServiceType"
                  onChange={(e) => handleChange("nmu", e.target.value)}
                  // value={workOrders?.serviceCatalog?.warranty_services?.Service_description || ""}
                  /> */}
                  <SearchCommandBlock
                    value={formData.nmu}
                    onChange={(selectedValue)=>{
                      handleChange("nmu", selectedValue)
                    }}
                    placeholder="Search NMU..."
                    options={NMUList.map((item) =>({
                      label: item.NMUDesc,
                      value: item.NMUId,
                    }))}
                    // onSearchInputChange={searchNMU}
                    readOnly={!canEdit}
                  />
              </CaseField>
              

              <CaseField label="NMU Item" lock={!canEdit} 
              // hide={!NMUItemNeed}
              >
                <SearchCommandBlock
                  value={formData.nmuItem}
                  onChange={(selectedValue)=>{
                    handleChange("nmuItem", selectedValue)
                  }}
                  placeholder="Search NMU Item..."
                  options={NMUItemList.map((item) =>({
                    label: item.itemName,
                    value: item.id,
                  }))}
                  // onSearchInputChange={searchNMU}
                  readOnly={!canEdit}
                />
              </CaseField>

              <CaseField label="Version" lock={!canEdit} 
              // hide={!NMUVersionNeed}
              >
                <Input
                  id="Version"
                  onChange={(e) => handleChange("Version", e.target.value)}
                  // value={workOrders?.serviceCatalog?.warranty_services?.Service_description || ""}
                />
              </CaseField>

              <CaseField label="Delay code" star={canEdit} lock={!canEdit}>
                <SearchCommandBlock
                  value={delayCodeEnumToLabel[formData.delayCode] || "Search Delay Code"}
                  onChange={(selectedValue)=>{
                    const enumValue = labelToStatusEnum[selectedValue]
                    handleChange("delayCode", enumValue)
                  }}
                  placeholder="Search Delay Code..."
                  options={Object.values(delayCodeEnumToLabel)}
                  // onSearchInputChange={searchNMU}
                  readOnly={!canEdit}
                />
              </CaseField>

              
            </CardContent>
          </Card>
        )}

        {/* CONFIRMATION VIEW */}
        {step === "confirm" && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
                <span className="text-red-600 font-semibold">⚠️ WARNING : Status Work Order akan berubah menjadi CLOSED_POSTED</span>
              <br />Berikut adalah data yang akan dikirim:
            </p>

            <div className="space-y-2 bg-gray-50 border rounded p-4 text-sm">
              <p><strong>Problem Category:</strong> {workOrders?.WorkOrderType || ""}</p>
              <p><strong>Delay Code:</strong> {formData.delayCode}</p>
              <p><strong>Service Type:</strong> {workOrders?.serviceCatalog?.warranty_services?.Service_description || ""}</p>
              <p><strong>NMU:</strong> {selectedNMU.NMUDesc}</p>
              <p><strong>NMU Item:</strong> {selectedNMUItem.itemName}</p>
              <p><strong>Version:</strong> {formData.Version}</p>
              <p><strong>Defect Desc:</strong> {formData.defectDesc}</p>
              <p><strong>CE Analysis:</strong> {formData.ceAnalysis}</p>
              <p><strong>Repair Action:</strong> {formData.repairAction}</p>
            </div>
          </div>
        )}

        {/* FOOTER BUTTONS */}
        <DialogFooter className="mt-4">
          {step === "form" ? (
            <>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmitStep}>Next</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCancelConfirm}>
                Back
              </Button>
              <Button onClick={handleConfirm}>Confirm & Submit</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RepairActionDialog;