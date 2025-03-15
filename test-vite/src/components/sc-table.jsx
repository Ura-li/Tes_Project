import React from "react";
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
import { BtnModal1 } from "./sc-modal";
import { BtnModal2 } from "./sc-modal";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { ContactRound, User,Search, Laptop } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const invoices = [
  {
    text: "Kb.Kk 36 No 15 Jakarta  Jakarta Pusat Jakarta Indonesia-10240 | Email: | PIN: |",
  },
  {
    text: "Phone: |  Account Type: Site Account | Parent Company: | Account Tier: | Source: CRM"
  },
];

// const contacts = [
//   {
//     firstname: "Slamet",
//     lastname: "Meisa",
//     email: "pakrt@gmail.com",
//     phone: "089677544227",
//     country: "indonesia",
//     source: "CRM",
//     hpID: "526291",
//   },
// ];

// const assets = [
//   {
//     productname: "HP Victus 16 inch Gaming Laptop 16-r0555TX",
//     product: "9T92PA94-92",
//     serialnumber: "892910312",
//     productline: "M7",
//     isparent: "-",
//     parentasset: "-",
//     source: "CRM",
  
//   },
// ];

export function TableCompany() {
  return (

      <Card className="m-0 p-0 gap-0">
        <CardHeader className="bg-blue-400 p-3 rounded-t-lg">
          <span className="flex items-center gap-2 text-xl">
            <Checkbox className="border-black border-3 w-7.5 h-7 "></Checkbox>
            PT KAPAL API SEJAHTERA
          </span>
        </CardHeader>
        <CardContent className=" p-3">
          {invoices.map((invoice) => (
          <div className="text-gray-500"key={invoice.text}>
              <p>{invoice.text}</p>
          </div>
          ))}
        </CardContent>
        <CardFooter className="p-0 flex flex-col">
            <div className=" bg-blue-200 p-3 text-black font-bold text-xl flex w-full justify-between  ">
              <div className="flex items-center gap-2">
                <User></User>
                Contact
                <span className="relative flex items-center">
                  <Search className="absolute right-1"/><Input className="bg-white ring-2 border-0 rounded-2xl pr-10"/>
                </span>
              </div>
              <BtnModal1 className=""></BtnModal1>
              </div>
          <Table> 
            <TableHeader className="bg-gray-400">
              <TableRow>
                <TableHead className=" text-black font-bold">First Name</TableHead>
                <TableHead className=" text-black font-bold">Last Name</TableHead>
                <TableHead className=" text-black font-bold">Email</TableHead>
                <TableHead className=" text-black font-bold">Phone</TableHead>
                <TableHead className=" text-black font-bold">Country</TableHead>
                <TableHead className=" text-black font-bold">HP ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              
            </TableBody>
          </Table>
            <div className=" bg-blue-200 p-3 text-black font-bold text-xl flex w-full justify-between">
              <div className="flex items-center gap-2">
                <Laptop></Laptop>
                Assets
                <span className="relative flex items-center">
                  <Search className="absolute right-1"/><Input className="bg-white ring-2 border-0 rounded-2xl pr-10"/>
                </span>
              </div>
              <BtnModal2></BtnModal2>
              </div>
          <Table> 
            <TableHeader className="bg-gray-400 text-black font-bold">
              <TableRow>
                <TableHead className=" text-black font-bold">Product Name</TableHead>
                <TableHead className=" text-black font-bold">Product #</TableHead>
                <TableHead className=" text-black font-bold">Serial Number</TableHead>
                <TableHead className=" text-black font-bold">Product Line</TableHead>
                <TableHead className=" text-black font-bold">Is Parent</TableHead>
                <TableHead className=" text-black font-bold">Parent Asset</TableHead>
                <TableHead className=" text-black font-bold">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              
            </TableBody>
          </Table>
        </CardFooter>
      </Card>
      // {/* <Table className="w-255 ml-7 flex-col justify-center items-center drop-shadow-md">
      //   <TableHeader className="bg-blue-400">
      //     <TableRow>
      //       <TableHead className="text-white text-xl ">
      //       <Checkbox className="border-black border-3 w-7.5 h-7 fixed"></Checkbox>
      //         PT KAPAL API SEJAHTERA
      //       </TableHead>
      //     </TableRow>
      //   </TableHeader>
      //   <TableBody className="bg-neutral-200">
      //     {invoices.map((invoice) => (
      //       <TableRow key={invoice.text}>
      //         <TableCell className="font-medium" colSpan={5}>{invoice.text}{invoice.text1}</TableCell>
      //       </TableRow>
      //     ))}
      //   </TableBody>
      // </Table> */}
    
  );
}

export function TableContact() {
  return (
    <div className="">
      {/* <Table className="w-255 ml-7 drop-shadow-md">
          <TableHeader className="bg-blue-400">
          <TableRow>
            <TableHead className="text-white h-12 text-xl">
             Contact
            <Input placeholder="Search..." className="border-2 w-50 h-8 mt-2 p-2 border-black rounded-md"></Input>
      
            
            </TableHead>
      
          </TableRow>
        </TableHeader>
        <TableHeader className="bg-neutral-300">
          <TableRow>
            <TableHead className="text-black">First Name</TableHead>
            <TableHead className="text-black">Last Name</TableHead>
            <TableHead className="text-black">Email</TableHead>
            <TableHead className="text-black">Phone</TableHead>
            <TableHead className="text-black">Country</TableHead>
            <TableHead className="text-black">Source</TableHead>
            <TableHead className="text-black">HP ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-neutral-100">
          {contacts.map((contact) => (
            <TableRow key={contact.firstname}>
              <TableCell>{contact.firstname}</TableCell>
              <TableCell>{contact.lastname}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.country}</TableCell>
              <TableCell>{contact.source}</TableCell>
              <TableCell>{contact.hpID}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  );
}

export function TableAsset() {
  return (
    <div className="">
      {/* <Table className="w-255 ml-7 drop-shadow-md">
          <TableHeader className="bg-blue-400">
          <TableRow>
            <TableHead className="text-white text-xl">
            Asset
            </TableHead>
      
          </TableRow>
      
        </TableHeader>
        <TableHeader className="bg-neutral-300">
          <TableRow>
            <TableHead className="text-black">Product Name</TableHead>
            <TableHead className="text-black">Product</TableHead>
            <TableHead className="text-black">Serial Number</TableHead>
            <TableHead className="text-black">Product Line</TableHead>
            <TableHead className="text-black">Is Parent</TableHead>
            <TableHead className="text-black">Parent Asset</TableHead>
            <TableHead className="text-black">Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-neutral-100">
          {assets.map((asset) => (
            <TableRow key={asset.productname}>
              <TableCell>{asset.productname}</TableCell>
              <TableCell>{asset.product}</TableCell>
              <TableCell>{asset.serialnumber}</TableCell>
              <TableCell>{asset.productline}</TableCell>
              <TableCell>{asset.isparent}</TableCell>
              <TableCell>{asset.parentasset}</TableCell>
              <TableCell>{asset.source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  );
}