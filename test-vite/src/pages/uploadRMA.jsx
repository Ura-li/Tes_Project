import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardHeader} from "../components/ui/card";
import CaseField from "../components/CaseField";
import { SearchCommandBlock } from "../components/sc-select";
import DatePicker from "../components/date-picker";
import { Input } from "../components/ui/input";
import { useTeam } from "../context/team-context";
import { SOImport, SOTemplateButton } from "../components/importFileComponent/SOUpdate";
import { se } from "date-fns/locale";

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
    console.log(resource)

    //SCB Company
    const [selectedTeam, setSelectedTeam] = useState("");
    // const [searchText, setSearchText] = useState("");

    //SCB STATUS
    const [selectedRMAStatus, setSelectedRMAStatus] = useState("");

    useEffect(()=>{
        if(ActiveResource) setSelectedTeam(ActiveResource)
    },[ActiveResource])

    //DATEPICKER
    const [dateRMA,setDateRMA] = useState(null);
    
    return (
        <>
        <div className="p-2 mt-2">
            <Card>
                <CardHeader>
                    <CardTitle>Update RMA status by export/import SO/RMA no.</CardTitle>
                <hr className="border-green-500 "/>
                </CardHeader>
                <CardContent className={"grid grid-cols-2 gap-2"}>
                    <CaseField label={"Company"} star>
                        <SearchCommandBlock
                            options={resource?.teams}
                            value={selectedTeam}
                            onChange={setSelectedTeam}
                            // onSearchInputChange={setSearchText}

                            getValue={(team) => team.id}

                            renderLabel={(team) => `${team.name} - ${team.plan ?? ""}`}
                            placeholder="Search Company"
                        />
                    </CaseField>
                    <CaseField label={"RMA Date"} star>
                        <DatePicker
                            value={dateRMA}
                            onChange={setDateRMA}
                        />
                        {console.log("WOI ", dateRMA)}
                    </CaseField>
                    <CaseField label={"RMA Status"} star>
                        <SearchCommandBlock
                            options={RMA_STATUS_OPTIONS}
                            value={selectedRMAStatus}
                            onChange={setSelectedRMAStatus}
                            getValue={(status) => status.value}
                            renderLabel={(status) => status.label}
                            placeholder="Search Status"
                        />
                    </CaseField>
                    {selectedRMAStatus !== "" && (
                        <>
                            <CaseField>
                                <SOTemplateButton
                                    target={selectedRMAStatus}
                                    />
                            </CaseField>
                            <CaseField label={"SO / RMA no"} star>
                                <SOImport
                                    target={selectedRMAStatus}
                                    dateRMA={dateRMA}

                                />
                            </CaseField>
                        </>
                    )}
                </CardContent>
                <CardContent className={"border-2 m-2 rounded-md p-2 space-y-2 text-sm"}>
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
        </>
    )
}