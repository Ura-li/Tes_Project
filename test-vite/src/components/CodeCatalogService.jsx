import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectBarRelated } from "./sc-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export const CatalogService1 = () => {
  const [asset, setAsset] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [productNumber, setProductNumber] = useState("");
  const [tab, setTab] = useState("1");
  const [tab2, setTab2] = useState("parts");

  const fetchData = async () => {
      try {

        const response = await ApiCustomer.get(`/api/CatalogService?caseID=1`);
        const data = response.data.data;
        setAsset(data);
        setSerialNumber(data?.SerialNumber || "");
        setProductName(data?.ProductName || "");
        setProductNumber(data?.ProductNumber || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  const services = [
    {
      id: "DEPOT2",
      description: "DEPOT REPAIR - 2DAY",
      tat: "002",
    },
    {
      id: "DEPOT1",
      description: "Depot Repair",
      tat: "001",
    },
    {
      id: "APBRPR",
      description: "SRS/CREW 1WD W DEF RETURN",
      tat: "001",
    },
    {
      id: "APBPOP",
      description: "SRS/CREW 3WD W DEF RETURN",
      tat: "003",
    },
  ];

  const parts = [
    {
      partNumber: "N42547-001",
      keyword: "INTER CONNECT CABLE",
      description: "SPS-CABLE LCD FHD 40P",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "N",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "M91238-005",
      keyword: "WLAN WIRELESS ACCESS NETWORK E",
      description: "SKO-WLAN 6 RTK ax 2x2+BT RTL8852BE",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "A",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "M51850-001",
      keyword: "POWER CORD",
      description: "SKO-CORD C13 1.83M STKR CONV",
      orderability: "Yes",
      restriction: "",
      csr: "A",
      rohs: "A",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "M41711-005",
      keyword: "LITHIUM BATTERIES",
      description: "SKO-BATT 68C3Wh 3.59Ah LI WK06053XL",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "N",
      returnable: true,
      hardRoll: false,
      dangerous: true,
      lithium: true,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "N42541-001",
      keyword: "PLASTIC INJECTION MOLDINGS",
      description: "SPS-BEZEL LCD FHD",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "N",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Catalog</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsContent value="1">
            <Card>
              <CardContent>
                <div className="mb-4 text-sm text-muted-foreground">
                  Select from List of Service Options
                </div>

                <div className="grid grid-cols-2 gap-4 border p-4 bg-gray-50 rounded-md text-sm mb-6">
                  <div>
                    <div><strong>Product Number</strong>: 9T902PA#AR6</div>
                    <div><strong>Product Name</strong>: Victus by HP 16.1 inch Gaming Laptop PC 16-s1000 (90P65AV)</div>
                    <div><strong>Serial Number</strong>: CND40611LM</div>
                  </div>
                  <div>
                    <div><strong>Warranty Status</strong>: IW</div>
                    <div><strong>Currency</strong>: IDR</div>
                  </div>
                </div>

                <Table>
                  <TableHeader className="bg-blue-100">
                    <TableRow>
                      <TableHead>Select</TableHead>
                      <TableHead>Service OfferID</TableHead>
                      <TableHead>Service Description</TableHead>
                      <TableHead>Customer TAT / Response Time</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <input type="radio" name="service" />
                        </TableCell>
                        <TableCell>{service.id}</TableCell>
                        <TableCell>{service.description}</TableCell>
                        <TableCell>{service.tat}</TableCell>
                        <TableCell className="text-right">0.00</TableCell>
                        <TableCell className="text-right">0.00</TableCell>
                        <TableCell className="text-right">0.00</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

              <CardFooter className="justify-end gap-2">
                <TabsList className="mb-4">
                  <Button variant="secondary">Cancel</Button>
                  <Button><TabsTrigger value="2">Next</TabsTrigger> </Button>
                </TabsList>
              </CardFooter>  
            </Card>
          </TabsContent>

          <TabsContent value="2">
            <Tabs value={tab2} onValueChange={setTab2}>
              <TabsList className="mb-4">
                <TabsTrigger value="parts">Parts</TabsTrigger>
                <TabsTrigger value="snr">SNR</TabsTrigger>
              </TabsList>

              <TabsContent value="parts">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Catalog</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-md text-sm">
                      <div>
                        <div><strong>Service OfferID</strong>: DEPOT1</div>
                        <div><strong>Service Description</strong>: Depot Repair</div>
                      </div>
                      <div className="text-sm">
                        <div><strong>Product Number</strong>: 9T902PA#AR6</div>
                        <div><strong>Product Name</strong>: Victus by HP 16.1 inch Gaming Laptop PC 16-s1000 (90P65AV)</div>
                        <div><strong>Serial Number</strong>: CND40611LM</div>
                        <div><strong>Warranty Status</strong>: IW</div>
                        <div><strong>Currency</strong>: IDR</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>Orderability:</span>
                      {/* <Switch checked /> */}
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-100">
                            <TableHead>Select</TableHead>
                            <TableHead>Part #</TableHead>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Part Description</TableHead>
                            <TableHead>Orderability</TableHead>
                            <TableHead>Restriction</TableHead>
                            <TableHead>CSR</TableHead>
                            <TableHead>ROHS</TableHead>
                            <TableHead>Returnable</TableHead>
                            <TableHead>Hard Roll</TableHead>
                            <TableHead>Dangerous</TableHead>
                            <TableHead>Lithium</TableHead>
                            <TableHead>Oversize</TableHead>
                            <TableHead>Heavy</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Freight</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parts.map((part, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <input type="checkbox" />
                              </TableCell>
                              <TableCell>{part.partNumber}</TableCell>
                              <TableCell>{part.keyword}</TableCell>
                              <TableCell>{part.description}</TableCell>
                              <TableCell>{part.orderability}</TableCell>
                              <TableCell>{part.restriction}</TableCell>
                              <TableCell>{part.csr}</TableCell>
                              <TableCell>{part.rohs}</TableCell>
                              <TableCell>{String(part.returnable)}</TableCell>
                              <TableCell>{String(part.hardRoll)}</TableCell>
                              <TableCell>{String(part.dangerous)}</TableCell>
                              <TableCell>{String(part.lithium)}</TableCell>
                              <TableCell>{String(part.oversize)}</TableCell>
                              <TableCell>{String(part.heavy)}</TableCell>
                              <TableCell>{part.price.toFixed(2)}</TableCell>
                              <TableCell>{part.freight.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>

                  <CardFooter className="justify-between">
                    <Tabs value={tab} onValueChange={setTab}>
                      <TabsList>                     
                        <Button variant="secondary"><TabsTrigger value="1">Previous</TabsTrigger></Button>
                      </TabsList>
                    </Tabs>
                    <Button>Next</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="snr">
                <Card>
                  <CardHeader>
                    <CardTitle>SNR Tab (Coming Soon)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Content for SNR Tab will be added later.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

      </CardContent> 
    </Card>
  );
};

export const TabsPart = () => {
  const [tab, setTab] = useState("parts");

  const parts = [
    {
      partNumber: "N42547-001",
      keyword: "INTER CONNECT CABLE",
      description: "SPS-CABLE LCD FHD 40P",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "N",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "M91238-005",
      keyword: "WLAN WIRELESS ACCESS NETWORK E",
      description: "SKO-WLAN 6 RTK ax 2x2+BT RTL8852BE",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "A",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "M51850-001",
      keyword: "POWER CORD",
      description: "SKO-CORD C13 1.83M STKR CONV",
      orderability: "Yes",
      restriction: "",
      csr: "A",
      rohs: "A",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "M41711-005",
      keyword: "LITHIUM BATTERIES",
      description: "SKO-BATT 68C3Wh 3.59Ah LI WK06053XL",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "N",
      returnable: true,
      hardRoll: false,
      dangerous: true,
      lithium: true,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
    {
      partNumber: "N42541-001",
      keyword: "PLASTIC INJECTION MOLDINGS",
      description: "SPS-BEZEL LCD FHD",
      orderability: "Yes",
      restriction: "",
      csr: "N",
      rohs: "N",
      returnable: true,
      hardRoll: false,
      dangerous: false,
      lithium: false,
      oversize: false,
      heavy: false,
      price: 0,
      freight: 0,
    },
  ];

  return(    
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="parts">Parts</TabsTrigger>
        <TabsTrigger value="snr">SNR</TabsTrigger>
      </TabsList>

      <TabsContent value="parts">
        <Card>
          <CardHeader>
            <CardTitle>Service Catalog</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-md text-sm">
              <div>
                <div><strong>Service OfferID</strong>: DEPOT1</div>
                <div><strong>Service Description</strong>: Depot Repair</div>
              </div>
              <div className="text-sm">
                <div><strong>Product Number</strong>: 9T902PA#AR6</div>
                <div><strong>Product Name</strong>: Victus by HP 16.1 inch Gaming Laptop PC 16-s1000 (90P65AV)</div>
                <div><strong>Serial Number</strong>: CND40611LM</div>
                <div><strong>Warranty Status</strong>: IW</div>
                <div><strong>Currency</strong>: IDR</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>Orderability:</span>
              
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead>Select</TableHead>
                    <TableHead>Part #</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Part Description</TableHead>
                    <TableHead>Orderability</TableHead>
                    <TableHead>Restriction</TableHead>
                    <TableHead>CSR</TableHead>
                    <TableHead>ROHS</TableHead>
                    <TableHead>Returnable</TableHead>
                    <TableHead>Hard Roll</TableHead>
                    <TableHead>Dangerous</TableHead>
                    <TableHead>Lithium</TableHead>
                    <TableHead>Oversize</TableHead>
                    <TableHead>Heavy</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Freight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parts.map((part, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell>{part.partNumber}</TableCell>
                      <TableCell>{part.keyword}</TableCell>
                      <TableCell>{part.description}</TableCell>
                      <TableCell>{part.orderability}</TableCell>
                      <TableCell>{part.restriction}</TableCell>
                      <TableCell>{part.csr}</TableCell>
                      <TableCell>{part.rohs}</TableCell>
                      <TableCell>{String(part.returnable)}</TableCell>
                      <TableCell>{String(part.hardRoll)}</TableCell>
                      <TableCell>{String(part.dangerous)}</TableCell>
                      <TableCell>{String(part.lithium)}</TableCell>
                      <TableCell>{String(part.oversize)}</TableCell>
                      <TableCell>{String(part.heavy)}</TableCell>
                      <TableCell>{part.price.toFixed(2)}</TableCell>
                      <TableCell>{part.freight.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="justify-between">
            <Button variant="secondary">Previous</Button>
            <Button>Next</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="snr">
        <Card>
          <CardHeader>
            <CardTitle>SNR Tab (Coming Soon)</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content for SNR Tab will be added later.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};