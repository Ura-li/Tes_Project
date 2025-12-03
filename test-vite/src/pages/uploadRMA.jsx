import React from "react";
import { Card, CardContent, CardTitle, CardHeader} from "../components/ui/card";
import CaseField from "../components/CaseField";
import { SearchCommandBlock } from "../components/sc-select";
import DatePicker from "../components/date-picker";
import { Input } from "../components/ui/input";

export const UploadRma = () => {
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
                            options={[
                                "Naruto",
                                "Sasuke",
                                "Kakasi",
                                "Beban",
                            ]}
                        />
                    </CaseField>
                    <CaseField label={"RMA Date"} star>
                        <DatePicker/>
                    </CaseField>
                    <CaseField label={"RMA Status"} star>
                        <SearchCommandBlock
                            options={[
                                "Naruto",
                                "Sasuke",
                                "Kakasi",
                                "Beban",
                            ]}
                        />
                    </CaseField>
                    <CaseField label={"SO / RMA no"} star>
                        <Input type={"file"}/>
                    </CaseField>
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