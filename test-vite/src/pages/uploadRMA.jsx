import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardHeader} from "../components/ui/card";
import CaseField from "../components/CaseField";
import { SearchCommandBlock } from "../components/sc-select";
import DatePicker from "../components/date-picker";
import { useTeam } from "../context/team-context";
import { SOImport, SOTemplateButton } from "../components/importFileComponent/SOUpdate";

export const RMA_STATUS_OPTIONS = [
  { value: "InOutCE", label: "In & On Hand CE" },
  { value: "ReturnLogistic", label: "Return via Logistic" },
  { value: "ReturnDHL", label: "Return to DHL/SC" },
  { value: "FullCharge", label: "Full Charge" },
];

export const UploadRma = () => {
    /**
     * THIS FOR LATER
     * FOR NOW, UPDATE ALL DATA
     */
    const resource = useTeam();
    const ActiveResource = resource.activeTeam?.id
    

    //SCB Company
    const [selectedTeam, setSelectedTeam] = useState("");

    //SCB STATUS
    const [selectedRMAStatus, setSelectedRMAStatus] = useState("");

    useEffect(()=>{
        if(ActiveResource) setSelectedTeam(ActiveResource)
    },[ActiveResource])

    //DATEPICKER
    const [dateRMA,setDateRMA] = useState(null);
    
    return (
        <div className="bg-gradient-to-t dark:from-slate-800 dark:via-slate-600 dark:to-slate-800 dark:to-70% dark:via-6% dark:from-1% h-full">
        <div className="p-2 mt-2" id='rma-guide'>
            <Card id='rma-page' className={"bg-gradient-to-t dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 dark:border-2 dark:border-gray-600"}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                    <CardTitle>Update RMA status by export/import SO/RMA no.</CardTitle>
                    {selectedRMAStatus !== "" && (
                        <SOTemplateButton
                            target={selectedRMAStatus}
                        />
                    )}
                    </div>
                <hr className="border-green-500 "/>
                </CardHeader>
                <CardContent className={"grid grid-cols-2 gap-2 "}> 
                    <CaseField label={"Company"} star labelId={"rma-company-label"} fieldId={"rma-company"}>
                        <SearchCommandBlock
                            options={resource?.teams}
                            value={selectedTeam}
                            onChange={setSelectedTeam}

                            getValue={(team) => team.id}

                            renderLabel={(team) => `${team.name} - ${team.plan ?? ""}`}
                            placeholder="Search Company"
                            className={"dark:bg-transparent dark:border-gray-500 dark:border-2"}
                        />
                    </CaseField>
                    <CaseField id='rma-date' label={"RMA Date"} star labelId={"rma-date-label"} fieldId={"rma-date"}>
                        <DatePicker
                            value={dateRMA}
                            onChange={setDateRMA}
                            className={"dark:bg-transparent dark:border-gray-500 dark:border-2 dark:rounded-md"}
                        />
                    </CaseField>
                    <CaseField label={"RMA Status"} star labelId={"rma-status-label"} fieldId={"rma-status"}>
                        <SearchCommandBlock
                            options={RMA_STATUS_OPTIONS}
                            value={selectedRMAStatus}
                            onChange={setSelectedRMAStatus}
                            getValue={(status) => status.value}
                            renderLabel={(status) => status.label}
                            placeholder="Search Status"
                            className={"dark:bg-transparent dark:border-gray-500 dark:border-2 dark:rounded-md"}
                        />
                    </CaseField>
                    {selectedRMAStatus !== "" && (
                        <>
                        <div className="ml-9 col-span-2">
                        <span>SO / RMA NO <label className="text-red-500">*</label></span>
                        <SOImport
                            target={selectedRMAStatus}
                            dateRMA={dateRMA}
                        />
                        </div>
                        </>
                    )}
                </CardContent>
                <CardContent className={"border-2 m-2 rounded-md p-2 space-y-2 text-sm dark:border-gray-400"}>
                    <div className="flex flex-col italic">
                    <span className="uppercase">format for part in & on hand ce</span>
                    <span className="uppercase">column a so no.</span>
                    <span className="uppercase">column b rma no.</span>
                    <span className="uppercase">column c ct code new</span>
                    <span className="uppercase">column d awb no.</span>
                    </div>
                    <div className="flex flex-col italic">
                    <span className="uppercase">format for return to warehouse / full charge</span>
                    <span className="uppercase">column a so no.</span>
                    <span className="uppercase">column b ct code bad / part s/n</span>
                    <span className="uppercase">column c awb out no.</span>
                    </div>
                    <div className="flex flex-col italic">
                    <span className="uppercase">format for return to logistic</span>
                    <span className="uppercase">column a so no.</span>
                    </div>
                    <div className="flex flex-col text-red-500 font-bold">
                    <span className="uppercase">Warehouse untuk pengembalian part/unit</span>
                    <span className="uppercase">1. pengembalian sparepart 
                    </span>
                    <span className="uppercase indent-4">
                         ke pt. hewlett packard indonesia c/o : pt dhl supply chain indonesia
                        </span>   

                    <span className="uppercase">2. Consumer printer dan tablet, (b-xxxx-xxxxxxx) ke </span>
                    <span className="indent-4 uppercase">account name : dhl supply chain indonesia </span>
                    <span className="indent-4 uppercase">
                        account number : 540289093 
                    </span>
                    <span className="uppercase ">3. Consumer desktop, (odm) ke jne
                    </span>
                        <span className="uppercase indent-4"> 
                            account name : pt sinar elok abadi 
                        </span>
                        <span className="uppercase indent-4">
                        account name : cpc warehouse

                        </span>
                        <span className="uppercase indent-4">
                        account number : 80099804
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
        </div>
    )
}
