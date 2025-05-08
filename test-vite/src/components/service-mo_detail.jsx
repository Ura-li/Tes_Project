import React, {useEffect, useState} from "react";
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
import { ArrowDownNarrowWideIcon, Car, Lock, Plus, RotateCw, Search } from "lucide-react";
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

import { useParams } from "react-router";
import ApiCustomer from "@/api";

import { TabsServiceMOLineItems } from "./service-case";
import { Description } from "@radix-ui/react-dialog";

export const ServiceMoDetail = () => {

  const { lineItemID, lineNumber } = useParams();

  const [moLineItems, setMoLineItems] = useState([])

  const [MODetailInput, setMODetailInput] = useState({
    moOrderName: '',
    salesOrderNumber: '',
    lineNumber: '',
    partNumber: '',
    description: '',
    rohs: false,
    returnabilityFlag: false,
    functionalEquivalence: '',
    mediaHandlingPart: '',
    pickPackInstructions: '',
    collectionInstructions: '',
    customerResponse: '',
    rejectedReason: '',
    otherReason: '',
    partAuthorizationReason: '',
    partAuthorizationDetail: '',
    originalPartNumber: '',
    offeredPartNumber: '',
    offeredPartDescription: '',
    mainComponent: '',
    gratisFlag: false,
    atpStatus: ''
  })
    
  const fetchMoLineItems = async () => {
    try {
      const res = await ApiCustomer.get(`/api/material-order/material-order-line-items/${lineItemID}?lineNumber=${lineNumber}`);
      const data = res.data.data;
  
      setMoLineItems(data);
  
      // Isi state MODetailInput berdasarkan data yang diambil
      setMODetailInput({
        moOrderName: data
          ? `${data.MOID} - ${data.LineNumber}`
          : null,
        salesOrderNumber: data.SalesOrderNumber || '',
        lineNumber: data.LineNumber?.toString() || '',
        partNumber: data.PartNumber || '',
        description: data.Description || '',
        rohs: data.servicecatalog_parts?.ROHS_Flag || false,
        returnabilityFlag: data.servicecatalog_parts?.Returnable_Flag || false,
        functionalEquivalence: data.FunctionalEquivalence || '',
        mediaHandlingPart: data.MediaHandlingPart || '',
        pickPackInstructions: data.PickPackInstructions || '',
        collectionInstructions: data.CollectionInstructions || '',
        customerResponse: data.CustomerResponse || '',
        rejectedReason: data.RejectedReason || '',
        otherReason: data.OtherReason || '',
        partAuthorizationReason: data.PartAuthorizationReason || '',
        partAuthorizationDetail: data.PartAuthorizationDetail || '',
        originalPartNumber: data.OriginalPartNumber || '',
        offeredPartNumber: data.OfferedPartNumber || '',
        offeredPartDescription: data.OfferedPartDescription || '',
        mainComponent: data.MainComponent || '',
        gratisFlag: data.GratisFlag || false,
        atpStatus: data.ATPStatus || ''
      });
  
    } catch (err) {
      console.error("Failed to fetch Material Line Items orders:", err);
    }
  };
  
  useEffect(() => {
    fetchMoLineItems()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMODetailInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleUpdate = async () => {
    try {
      await ApiCustomer.patch(`/api/material-order/material-order-line-items/${lineItemID}?lineNumber=${lineNumber}`, {
        Description: MODetailInput.description,
        PickPackInstructions: MODetailInput.pickPackInstructions,
        CollectionInstructions: MODetailInput.collectionInstructions,
        CustomerResponse: MODetailInput.customerResponse,
        RejectedReason: MODetailInput.rejectedReason,
        OtherReason: MODetailInput.otherReason,
      });
  
      console.log("Material Order Line Item updated successfully.");
    } catch (error) {
      console.error("Error updating Material Order Line Item:", error);
    }
  };
  
  
  return (
    <>
    {moLineItems.Status === 'Closed' && (
        <div className="p-4 my-2 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This material order line item is <strong>read-only</strong> because it is <strong>Closed</strong>.
        </div>
      )}
      <TabsServiceMOLineItems MOLineDetails={moLineItems}/>
    <Card className="mt-2 rounded-none h-[160px]">
      <CardHeader>
        <CardTitle className="text-xl ">{moLineItems.MOID} - {moLineItems.LineItemID}</CardTitle>
        <CardTitle className="text-sm">Material Order Line Item . Information</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs>
          <TabsList className="bg-white w-[440px] gap-2">
            <TabsTrigger value="mo_details" className="cursor-pointer">
            MO Details
            </TabsTrigger>
            <TabsTrigger
              value="mo_failure"
              className="cursor-pointer white">
             Failure & Return Details
            </TabsTrigger>
            <TabsTrigger value="mo_attachments" className="cursor-pointer">
            Attachments
            </TabsTrigger>
            <SelectBarRelated></SelectBarRelated>
          </TabsList>

          <TabsContent value="mo_details">
            <Card className="rounded-md mt-7">
              <span className="ml-5 text-xl font-bold">MO Order Details</span>
              <CardContent className="grid grid-flow-col gap-5 grid-rows-8 ">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>MO Order Name</span>
                  <span className="ml-31">{MODetailInput.moOrderName}</span>
                </div>
                
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Sales Order Number</span>
                  <span className="ml-30.5">{MODetailInput.salesOrderNumber}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Line Number</span>
                  <span className="ml-37">{MODetailInput.lineNumber}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Part/Product Number</span>
                  <span className="ml-20">{MODetailInput.partNumber}</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Description</span>
                  {/* <span className="ml-39">{MODetailInput.description}</span> */}
                  <textarea
                    className="ml-39"
                    name="description"
                    value={MODetailInput.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>RoHS</span>
                  <span className="ml-50">{MODetailInput.rohs ? 'Yes' : 'No'}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Returnability Flag</span>
                  <span className="ml-27">{MODetailInput.returnabilityFlag ? 'Yes' : 'No'}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-blue-500 ml-7">Functional Equivalence</span>
                  <span className="ml-18">{MODetailInput.functionalEquivalence}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-yellow-500">Media Handling Part</span>
                  <span className="ml-30">{MODetailInput.mediaHandlingPart}</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Pick Pack Instructions</span>
                  {/* <span className="ml-28">{MODetailInput.pickPackInstructions}</span> */}
                  <input
                    type="text"
                    className="ml-28"
                    name="pickPackInstructions"
                    value={MODetailInput.pickPackInstructions}
                    onChange={handleChange}
                    placeholder="---"
                  />
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Collection Instructions</span>
                  {/* <span className="ml-27">{MODetailInput.collectionInstructions}</span> */}
                  <select
                    className="ml-27"
                    name="collectionInstructions"
                    value={MODetailInput.collectionInstructions}
                    onChange={handleChange}
                  >
                    <option value="None">None</option>
                    <option value="PickUp">Pick Up</option>
                    <option value="DropOff">Drop Off</option>
                    <option value="ThirdParty">Third Party</option>
                  </select>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Customer Response</span>
                  {/* <span className="ml-33">{MODetailInput.customerResponse}</span> */}
                  <input
                    type="text"
                    className="ml-33"
                    name="customerResponse"
                    value={MODetailInput.customerResponse}
                    onChange={handleChange}
                    placeholder="---"
                  />
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Rejected Reason</span>
                  {/* <span className="ml-39">{MODetailInput.rejectedReason}</span> */}
                  <input
                    type="text"
                    className="ml-39"
                    name="rejectedReason"
                    value={MODetailInput.rejectedReason}
                    onChange={handleChange}
                    placeholder="---"
                  />
                </div>

                <div className="flex font-bold">
                  <span className="text-red-500 ml-7">Other Reason</span>
                  {/* <span className="ml-44">{MODetailInput.otherReason}</span> */}
                  <input
                    type="text"
                    className="ml-44"
                    name="otherReason"
                    value={MODetailInput.otherReason}
                    onChange={handleChange}
                    placeholder="---"
                  />
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Part Authorization Reason</span>
                  <span className="ml-20">{MODetailInput.partAuthorizationReason}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>Part Authorization Detail</span>
                  <span className="ml-23">{MODetailInput.partAuthorizationDetail}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-red-500 ml-7">Functional Equivalent</span>
                  <span className="ml-30">{MODetailInput.functionalEquivalence}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-blue-500 ml-7">Original Part Number</span>
                  <span className="ml-30">{MODetailInput.originalPartNumber}</span>
                </div>
                
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-blue-500 ml-7">Offered Part Number</span>
                  <span className="ml-31">{MODetailInput.offeredPartNumber}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-blue-500 ml-7">Offered Part Description</span>
                  <span className="ml-25">{MODetailInput.offeredPartDescription}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-blue-500 ml-7">Main Component</span>
                  <span className="ml-38.5">{MODetailInput.mainComponent}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span className="text-orange-500 ml-7">Gratis Flag</span>
                  <span className="ml-51.5">{MODetailInput.gratisFlag ? 'Yes' : 'No'}</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5" />
                  <span>ATP Status</span>
                  <span className="ml-51.5">{MODetailInput.atpStatus}</span>
                </div>
                
                <div className="flex font-bold">
                  <Button onClick={handleUpdate}>Save</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md mt-7">
              <span className="ml-5 text-xl font-bold">Outbound to Customer</span>
              <CardContent className="grid h-10 grid-flow-col grid-rows-2 gap-5">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Outbound to Customer</span>
                  <span className="ml-40">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mo_failure">
          <Card className="rounded-md mt-7">
              <span className="ml-5 text-xl font-bold">Failure & Usage Details
              </span>
              <CardContent className="grid grid-flow-col grid-rows-5 gap-5 h-70">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Failure Analysis
                  </span>
                  <span className="ml-40">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Failure Code</span>
                  <span className="ml-46">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Additional Failure Code</span>
                  <span className="ml-25">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Serial Number </span>
                  <span className="ml-42">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Part Usage Code
                  </span>
                  <span className="ml-38">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Part Consumption
                  </span>
                  <span className="ml-51">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Part Order Consumption Comment
                  </span>
                  <span className="ml-20">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Removed Part Number
                  </span>
                  <span className="ml-43">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Removed Serial Number
                  </span>
                  <span className="ml-41">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Removed Part Desc
                  </span>
                  <span className="ml-50">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md mt-7"> 
              <span className="ml-5 text-xl font-bold">Part Return Details</span>
              <CardContent className="grid grid-flow-col grid-rows-5 gap-5 h-80">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Returnable Code</span>
                  <span className="ml-40">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Return Type Code Identifier</span>
                  <span className="ml-20">...</span>
                </div>

                <div className="flex font-bold">
                <Lock className="mr-2 size-5"></Lock>
                  <span>Return_Instructions</span>
                  <span className="ml-35">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Return Tracking Number</span>
                  <span className="ml-25">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Return Override Flag</span>
                  <span className="ml-32">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Return Ovveride Reason</span>
                  <span className="ml-30">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">RMA</span>
                  <span className="ml-66">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>RMA Identifier</span>
                  <span className="ml-48">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Return Deadline</span>
                  <span className="ml-45.5">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mo_attachments">
            <Card className="flex-col mt-5">
              <CardContent className="grid gap-5">
                <span className="text-xl font-bold">Timeline</span>
                <div className="flex font-bold">
                  <Input placeholder="Search Timeline" className="text-sm font-medium"></Input>
                </div>
                <span className="text-xl font-bold">Create a note</span>
                <div className="">
                    <Input type="text" className="border-1" placeholder="Tittle" ></Input>
                    <textarea placeholder="Note" className="w-full h-20 pt-2 pl-3 mt-2 resize-none border-1"></textarea>
                    <Button variant="outline" className="mr-3">Add note</Button>
                    <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    
    </>
  );
};
