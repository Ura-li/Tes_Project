import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SearchCommandBlock,
  SelectBarRelated,
} from "../../components/sc-select";
import {
  ArrowDownNarrowWideIcon,
  Car,
  Lock,
  Plus,
  RotateCw,
  Search,
} from "lucide-react";
import { CalendarDays } from "lucide-react";
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
import { Link } from "react-router";
import Swal from "sweetalert2";

import { useParams } from "react-router";
// import Select from 'react-select';
import debounce from "lodash.debounce";
import ApiCustomer from "@/api";

import { TabsServiceMOLineItems } from "./service-case";
import { Description } from "@radix-ui/react-dialog";
import { useDraft } from "../../components/DraftContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CaseField from "@/components/CaseField";

export const ServiceMoDetailApo = () => {
  const { updateDraft } = useDraft(); // Access updateDraft from the DraftContext

  const { lineItemID } = useParams();

  const [moLineItems, setMoLineItems] = useState([]);

  const [MODetailInput, setMODetailInput] = useState({
    MOID: "",
    moOrderName: "",
    SalesOrderNumber: "",
    lineNumber: "",
    partNumber: "",
    description: "",
    rohs: false,
    returnabilityFlag: false,
    functionalEquivalence: "",
    mediaHandlingPart: "",
    pickPackInstructions: "",
    collectionInstructions: "",
    customerResponse: "",
    rejectedReason: "",
    otherReason: "",
    partAuthorizationReason: "",
    partAuthorizationDetail: "",
    originalPartNumber: "",
    offeredPartNumber: "",
    offeredPartDescription: "",
    mainComponent: "",
    gratisFlag: false,
    failureId: null,
    failureName: "",
    serialNumber: "",
    removedPartNumber: "",
    removedSerialNumber: "",
    removedPartDescription: "",
  });

  const fetchMoLineItems = async () => {
    try {
      // Tampilkan loading SweetAlert
      Swal.fire({
        title: "Loading...",
        text: "Please wait a moment",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
        customClass: {
          popup: "z-[9999]",
        },
      });

      const res = await ApiCustomer.get(
        `/api/material-order/material-order-line-items/${lineItemID}`
      );
      const data = res.data.data;

      setMoLineItems(data);
      console.log("Data lIne Items",data);

      // Isi state MODetailInput berdasarkan data yang diambil
      setMODetailInput({
        MOID: data.MOID,
        moOrderName: data ? `${data.MOID} - ${data.LineNumber}` : null,
        SalesOrderNumber: data.SalesOrderNumber || "",
        lineNumber: data.LineNumber?.toString() || "",
        partNumber: data.PartNumber || "",
        description: data.Description || "",
        rohs: data.servicecatalog_parts?.ROHS_Flag || false,
        returnabilityFlag: data.servicecatalog_parts?.Returnable_Flag || false,
        functionalEquivalence: data.FunctionalEquivalence || "",
        mediaHandlingPart: data.MediaHandlingPart || "",
        pickPackInstructions: data.PickPackInstructions || "",
        collectionInstructions: data.CollectionInstructions || "",
        customerResponse: data.CustomerResponse || "",
        rejectedReason: data.RejectedReason || "",
        otherReason: data.OtherReason || "",
        partAuthorizationReason: data.PartAuthorizationReason || "",
        partAuthorizationDetail: data.PartAuthorizationDetail || "",
        originalPartNumber: data.OriginalPartNumber || "",
        offeredPartNumber: data.OfferedPartNumber || "",
        offeredPartDescription: data.OfferedPartDescription || "",
        mainComponent: data.MainComponent || "",
        gratisFlag: data.GratisFlag || false,
        failureId: data.FailureId || null,
        failureName: data.Failure?.Name || "",
        atpStatus: data.ATPStatus || "",
        serialNumber: data.SerialNumber || "",
        removedPartNumber: data.RemovedPartNumber || "",
        removedSerialNumber: data.RemovedSerialNumber || "",
        removedPartDescription: data.RemovedPartDescription || "",
      });
      updateDraft("moliId", data.lineItemID);
    } catch (err) {
      console.error("Failed to fetch Material Line Items orders:", err);
      Swal.fire("Error", "Failed to fetch Material Line Items", "error");
    } finally {
      Swal.close();
    }
  };

  useEffect(() => {
    fetchMoLineItems();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setMODetailInput((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    console.log("Changed:", field, value);
    setMODetailInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await ApiCustomer.patch(
        `/api/material-order/material-order-line-items/${lineItemID}`,
        {
          Description: MODetailInput.description,
          PickPackInstructions: MODetailInput.pickPackInstructions,
          CollectionInstructions: MODetailInput.collectionInstructions,
          CustomerResponse: MODetailInput.customerResponse,
          RejectedReason: MODetailInput.rejectedReason,
          OtherReason: MODetailInput.otherReason,
        }
      );

      console.log("Material Order Line Item updated successfully.");
    } catch (error) {
      console.error("Error updating Material Order Line Item:", error);
    }
  };

  const tabs = [
    { value: "mo_details", label: "MO Details" },
    { value: "mo_failure", label: "Failure & Return Details" },
    { value: "mo_attachments", label: "Attachments" },
  ];

  return (
    <>
      {moLineItems.Status === "Closed" && (
        <div className="p-4 my-2 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This material order line item is <strong>read-only</strong> because it
          is <strong>Closed</strong>.
        </div>
      )}
      {moLineItems.MOID ? (
        <TabsServiceMOLineItems
          MOLineDetails={MODetailInput}
          LineItemID={lineItemID}
          moLineItems={moLineItems}
        />
      ) : (
        ""
      )}
      <Card className="mt-2 rounded-none">
        <CardContent className={"p-0"}>
          <Tabs defaultValue="mo_details">
            <Card className={"p-2"}>
              <CardTitle className="text-xl ">
                {moLineItems.MOID} - {moLineItems.LineItemID}
              </CardTitle>
              <CardTitle className="text-sm">
                Material Order Line Item . Information
              </CardTitle>
              <TabsList className="gap-2 bg-white">
                {tabs.map((tab, index) =>
                  tab.component ? (
                    <div key={index}>{tab.component}</div>
                  ) : (
                    <TabsTrigger
                      key={index}
                      variant={"underline"}
                      value={tab.value}
                      disabled={tab.disable}
                      hidden={tab.hidden}
                    >
                      {tab.label}
                    </TabsTrigger>
                  )
                )}
                {/* <SelectBarRelated></SelectBarRelated> */}
              </TabsList>
            </Card>

            <TabsContent
              value="mo_details"
              className={"p-2 flex flex-col"}
            >
              <Card className="rounded-md ">
                <CardHeader>
                  <CardTitle className={"text-lg "}>MO Order Details</CardTitle>
                  <hr />
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-5">
                  <CaseField label={"MO Order Name"} lock>
                    <Input
                      variant={"invisible"}
                      value={MODetailInput.moOrderName}
                      readOnly
                    />
                  </CaseField>

                  <CaseField label={"Part/Product Number"} lock>
                    <Input
                      variant={"invisible"}
                      value={MODetailInput.partNumber}
                    />
                  </CaseField>

                  <CaseField label={"Collection Instructions"} >
                    <SearchCommandBlock
                      value={MODetailInput.collectionInstructions}
                      onChange={handleChange("collectionInstructions")}
                      options={["None", "Pickup", "DropOff", "ThirdParty"]}
                    />
                  </CaseField>

                  <CaseField label={"Sales Order Number"} lock>
                    <Input
                      variant={"invisible"}
                      value={moLineItems?.materialorder?.SalesOrderNumber}
                      placeholder= "---"
                      readOnly
                    />
                  </CaseField>


                  <CaseField label={"RoHS"} lock>
                    <Input
                      value={MODetailInput.rohs ? "Yes" : "No"}
                      variant={"invisible"}
                    />
                  </CaseField>

                  <CaseField label={"Returnability Flag"} lock>
                    <Input
                      value={MODetailInput.returnabilityFlag ? "Yes" : "No"}
                      variant={"invisible"}
                    />
                  </CaseField>

                  
                  <CaseField label={"Description"}  lock span={3}>
                    <textarea
                      className="w-full h-10 pt-2 pl-3 resize-none border-none rounded-md focus:outline-none focus:ring-1"
                      name="description"
                      value={MODetailInput.description}
                      onChange={handleChange}
                      placeholder="Description"
                    />
                  </CaseField>

                  <Accordion type="Single" collapsible className="col-span-4">
                    <AccordionItem value="more-details">
                      <AccordionTrigger className={"decoration-transparent cursor-pointer pl-6"}>More Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-6 gap-4 p-4">
                          <CaseField label={"Media Handling Part"} lock>
                            <Input
                              value={MODetailInput.mediaHandlingPart}
                              variant={"invisible"}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Functional Equivalence"} lock>
                            <Input
                              value={MODetailInput.functionalEquivalence}
                              variant="invisible"
                              placeholder= '---'
                            />
                          </CaseField>

                          <CaseField label={"Line Number"} lock>
                            <Input
                              value={MODetailInput.lineNumber}
                              variant={"invisible"}
                              readOnly
                            />
                          </CaseField>

                          <CaseField label={"Pick Pack Instructions"} open>
                            <Input
                              name="pickPackInstructions"
                              value={MODetailInput.pickPackInstructions}
                              onChange={handleChange}
                              placeholder="---"
                              variant={"invisible"}
                            />
                          </CaseField>

                          <CaseField label={"Customer Response"} open>
                            <Input
                              name="customerResponse"
                              value={MODetailInput.customerResponse}
                              onChange={handleChange}
                              placeholder="---"
                              variant={"invisible"}
                            />
                          </CaseField>

                          <CaseField label={"Rejected Reason"} open>
                            <Input
                              name="rejectedReason"
                              value={MODetailInput.rejectedReason}
                              onChange={handleChange}
                              placeholder="---"
                              variant={"invisible"}
                            />
                          </CaseField>

                          <CaseField label={"Other Reason"} open>
                            <Input
                              variant={"invisible"}
                              name="otherReason"
                              value={MODetailInput.otherReason}
                              onChange={handleChange}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Part Authorization Reason"} lock>
                            <Input
                              value={MODetailInput.partAuthorizationReason}
                              variant={"invisible"}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Part Authorization Detail"} lock>
                            <Input
                              value={MODetailInput.partAuthorizationDetail}
                              variant={"invisible"}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Functional Equivalent"} lock>
                            <Input
                              variant={"invisible"}
                              value={MODetailInput.functionalEquivalence}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Original Part Number"} lock>
                            <Input
                              variant={"invisible"}
                              value={MODetailInput.originalPartNumber}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Offered Part Number"} lock>
                            <Input
                              value={MODetailInput.offeredPartNumber}
                              variant={"invisible"}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Offered Part Description"} lock>
                            <Input
                              value={MODetailInput.offeredPartDescription}
                              variant={"invisible"}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Main Component"} lock>
                            <Input
                              value={MODetailInput.mainComponent}
                              variant={"invisible"}
                              placeholder="---"
                            />
                          </CaseField>

                          <CaseField label={"Gratis Flag"} lock>
                            <Input
                              variant={"invisible"}
                              value={MODetailInput.gratisFlag ? "Yes" : "No"}
                            />
                          </CaseField>

                          <CaseField label={"ATP Status"} lock>
                            <Input
                              variant={"invisible"}
                              value={MODetailInput.atpStatus}
                              placeholder="---"
                            />
                          </CaseField>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="rounded-md " hidden>
                <span className="ml-5 text-xl font-bold">
                  Outbound to Customer
                </span>
                <CardContent className="grid h-10 grid-flow-col grid-rows-2 gap-5">
                  <Card className="flex font-bold">
                    <Lock className="mr-2 size-5"></Lock>
                    <span>Outbound to Customer</span>
                    <span className="ml-40">...</span>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="mo_failure"
              className={" flex flex-col gap-4 p-2"}
            >
              <Card className="flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Failure & Usage Details
                  </CardTitle>
                  <hr />
                </CardHeader>
                <CardContent className="grid items-center grid-cols-4 gap-6 m-1">
                  <CaseField label="Failure Analysis" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>
                  
                  <FailureSelect
                    failureId={MODetailInput.failureId}
                    setMODetailInput={setMODetailInput}
                    readOnly
                  />

                    <CaseField label="Return CT Key" star>
                    <Input
                      variant="invisible"
                      name="removedPartNumber"
                      value={MODetailInput.removedPartNumber}
                      onChange={handleChange('removedPartNumber')}
                      placeholder="---"
                      
                    />
                  </CaseField>
                  
                  <CaseField label="New CT Key" star>
                    <Input
                      variant="invisible"
                      name="removedSerialNumber"
                      value={MODetailInput.removedSerialNumber}
                      onChange={handleChange('removedSerialNumber')}
                      placeholder="---"
                     
                    />
                  </CaseField>

                  <CaseField label="Additional Failure Code" lock>
                    <Input variant="invisible" placeholder="---" 
                    />
                  </CaseField>

                

                  <CaseField label="Part Usage Code" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Part Consumption" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>                

                  <CaseField label="Part Order Consumption Comment" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Removed Part Desc" lock>
                    <Input
                      variant="invisible"
                      name="removedPartDescription"
                      value={MODetailInput.removedPartDescription}
                      onChange={handleChange}
                      placeholder="---"
                    />
                  </CaseField>
                </CardContent>
              </Card>

              <Card className="rounded-md ">
                <CardHeader>
                  <CardTitle className="text-lg">Part Return Details</CardTitle>
                  <hr />
                </CardHeader>
                <CardContent className="grid items-center grid-cols-6 gap-10 m-1">
                  <CaseField label="Returnable Code" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Return Type Code Identifier" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Return Instructions" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Return Tracking Number" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Return Override Flag" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Return Ovveride Reason" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>


                  <CaseField label="RMA Identifier" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>

                  <CaseField label="Return Deadline" lock>
                    <Input variant="invisible" placeholder="---" />
                  </CaseField>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mo_attachments">
              <Card className="flex-col mt-5">
                <CardContent className="grid gap-5">
                  <span className="text-xl font-bold">Timeline</span>
                  <CaseField className="flex font-bold">
                    <Input
                      placeholder="Search Timeline"
                      className="text-sm font-medium"
                    ></Input>
                  </CaseField>
                  <span className="text-xl font-bold">Create a note</span>
                  <CaseField className="">
                    <Input
                      type="text"
                      className="border-1"
                      placeholder="Tittle"
                    ></Input>
                    <textarea
                      placeholder="Note"
                      className="w-full h-20 pt-2 pl-3 mt-2 resize-none border-1"
                    ></textarea>
                    <Button variant="outline" className="mr-3">
                      Add note
                    </Button>
                    <Button variant="outline">Cancel</Button>
                  </CaseField>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

const FailureSelect = ({ failureId, setMODetailInput }) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // Track if input is focused

 useEffect(() => {
  ApiCustomer.get("/api/failure/options").then((res) => {
    const defaultOptions = res.data.map((f, index) => ({
      value: f.FailureId.toString(),
      label: (
        <div className="flex flex-col">
          <span className="font-medium">
            {`${index === 0 ? "55" : index === 1 ? "72" : index === 2 ? "73" : index + 1}`} - {f.Name}
          </span>
          <span className="text-xs text-gray-500">{f.Description ?? ""}</span>
        </div>
      ),
    }));
    setSearchResults(defaultOptions);
    });
    if (failureId) {
      // Ambil data failure berdasarkan ID yang sudah ada
      ApiCustomer.get(`/api/failure/${failureId}`)
        .then((res) => {
          const f = res.data.data;
          const label = `${f.Name} — ${f.Description ?? ""}`;
          setInputValue(f.FailureId);
        })
        .catch(() => {
          setInputValue(""); // Kosongkan jika tidak ditemukan
        });
    }
  }, [failureId]);

  const fetchFailures = debounce((query) => {
    if (!query || query.length < 2) return;
    ApiCustomer.get(`/api/failure/options?q=${query}`).then((res) => {
      const limited = res.data.slice(0, 3).map((f) => ({
        value: f.FailureId.toString(),
        label: `${f.Name} — ${f.Description ?? ""}`,
      }));
      setSearchResults(limited);
    });
  }, 300);

  const handleInputChange = (value) => {
    setInputValue(value);
    fetchFailures(value);
    setMODetailInput((prev) => ({
      ...prev,
      failureId: value,
    }));
  };

  const handleSelect = (selected) => {
    setInputValue(selected.label);
    setSearchResults([
      selected,
      ...searchResults.filter((opt) => opt.value !== selected.value),
    ]);
    setMODetailInput((prev) => ({
      ...prev,
      failureId: selected.value,
      failureName: selected.label,
    }));
    console.log("selected.value", selected.value);
  };

  // Handle focus and blur events
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150); // Delay to allow click on dropdown
  };

  return (
    <CaseField label={"Failure Code"} star open>
      <div className="relative w-full">
        <SearchCommandBlock
          name="failureId"
          value={String(inputValue)}
          onChange={handleInputChange}
          placeholder="Search Failure..."
          options={searchResults}
        />

        {/* Show dropdown only if results exist and input is focused */}
        {isFocused && (
          <ul className="absolute z-10 w-full mt-1 overflow-y-auto transition-all duration-200 bg-white border rounded shadow-lg ">
            {searchResults.length > 0 ? (
              searchResults.map((opt) => (
                <li
                  key={opt.value}
                  className="p-3 cursor-pointer hover:bg-gray-200"
                  onMouseDown={() => handleSelect(opt)} // Use onMouseDown to prevent blur before click
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </CaseField>
  );
};
