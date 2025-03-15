import React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { SelectBar3 } from "./sc-select";
import { SelectBarContact } from "@/components/sc-select";
import { SelectBarContact2 } from "@/components/sc-select";
import { SelectBarContact3 } from "@/components/sc-select";

const assets = [
  {
    productname: "HP Victus 16 inch Gaming Laptop 16-r0555TX",
    product: "9T92PA94-92",
    HWPorfitCenter: "-",
    contact: "Slamet",
  },
];

export function BtnModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mr-4">
          <Plus></Plus>Create Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>Case Information</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-3">
          <div className="w-55">
            <Label htmlFor="name" className="text-right">
              Case Subject
            </Label>
            <Input id="name" className="col-span-3 border-b-black p-1" />
          </div>
          <div className="">
            <Label htmlFor="name" className="text-right">
              Case Type
            </Label>
            <SelectBar3></SelectBar3>
          </div>
          <div className="flex items-center space-x-2 mt-5">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KCI For this case?
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">DONE</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BtnModalContact() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mt-0.5">
          New Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] h-145 bg-white">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle className="text-xl">Contact Information</DialogTitle>
            <DialogTitle className="flex justify-end text-sm mt-2.5">
              Clear All
            </DialogTitle>
          </div>
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Basic Information</DialogTitle>
        </DialogHeader>

        <div className="flex">
          <div className="space-y-0.4">
            <Label htmlFor="current">Salutation</Label>
            <SelectBarContact></SelectBarContact>
            <Label htmlFor="current" className="mt-1">
              Preferend Language
            </Label>
            <SelectBarContact2></SelectBarContact2>
          </div>
          <div className="space-y-0.4 absolute ml-40 w-42.5">
            <Label htmlFor="current">First Name</Label>
            <Input id="current" type="email" className="border-b-black p-1 h-8 text-sm" />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="current">Last Name</Label>
            <Input
              id="current"
              type="email"
              className="border-b-black p-1 w-71 h-8 text-sm"
            />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="new">EXTN</Label>
            <Input id="new" type="text" className="border-b-black p-1 w-73 h-8 text-sm" />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-md">Phone preferences</DialogTitle>
        </DialogHeader>

        <div className="flex">
          <div className="space-y-0.4">
            <Label htmlFor="current">Phone</Label>
            <Input
              id="current"
              type="email"
              className="border-b-black p-1 w-40 h-8 text-sm"
            />
            <Label htmlFor="current" className="mt-1">
              Other
            </Label>
            <Input
              id="current"
              type="text"
              className="border-b-black p-1 w-40 h-8 text-sm"
            />
          </div>
          <div className="space-y-0.4 ml-3">
            <Label htmlFor="current">Mobile</Label>
            <Input
              id="current"
              type="email"
              className="border-b-black p-1 w-40 h-8 text-sm"
            />
            <Label htmlFor="current" className="mt-1">
              EXTN
            </Label>
            <Input
              id="current"
              type="text"
              className="border-b-black p-1 w-40 h-8 text-sm"
            />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="new">Work</Label>
            <Input id="new" type="text" className="border-b-black p-1 w-71 h-8 text-sm" />
            <Label htmlFor="new" className="mt-1">
              FAX
            </Label>
            <Input id="new" type="text" className="border-b-black p-1 h-8 text-sm" />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="current">EXTN</Label>
            <Input
              id="current"
              type="text"
              className="border-b-black p-1 w-73 h-8 text-sm"
            />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-md">Address</DialogTitle>
        </DialogHeader>

        <div className="flex">
          <div className="space-y-0.4">
            <Label htmlFor="current">Addres Line 1</Label>
            <Input
              id="current"
              type="email"
              className="border-b-black p-1 w-83 h-8 text-sm"
            />
              <Label htmlFor="current" className="mt-1">Country</Label>
              <SelectBarContact3></SelectBarContact3>
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="current">Addres Line 2</Label>
            <Input
              id="current"
              type="email"
              className="border-b-black p-1 w-71 h-8 text-sm"
            />
             <Label htmlFor="new" className="mt-1">Zip/Postal Code</Label>
             <Input id="new" type="text" className="border-b-black p-1 h-8 text-sm" />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="new">City</Label>
            <Input id="new" type="text" className="border-b-black p-1 w-35 h-8 text-sm" />
          </div>
          <div className="space-y-0.4 ml-3">
            <Label htmlFor="current">State/Province</Label>
            <Input
              id="current"
              type="text"
              className="border-b-black p-1 w-35 h-8"/>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center space-x-2 ">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KCI For this contact?
            </label>
          </div>
        <Button variant="secondary" className="bg-white w-30 drop-shadow-md border-1 cursor-pointer text-xl">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BtnModalAsset() {
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="bg-white mt-0.5">
        New Asset
      </Button>
    </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle className="text-xl">Asset Information</DialogTitle>
            <DialogTitle className="flex justify-end text-sm mt-2.5">
              Clear All
            </DialogTitle>
          </div>
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Serial Number</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">  
          <Input className="border-2 border-black rounded-2xl w-55 text-md h-10" type="Search"></Input>
          <Button variant="outline" className="w-30 rounded-2xl h-10 border-blue-600 border-2">Search</Button>
          <div className="mt-2">
          <Checkbox id="terms" className="w-5 h-5 border-2 border-black"/>
            <label
              htmlFor="terms"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              Not Available
            </label>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-blue-200 ">
              <TableHead className="text-black">Product Name</TableHead>
              <TableHead className="text-black">Product Number</TableHead>
              <TableHead className="text-black">HW Profit Center</TableHead>
              <TableHead className="text-black">Contact</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.productname}>
              <TableCell>{asset.productname}</TableCell>
              <TableCell>{asset.product}</TableCell>
              <TableCell>{asset.HWPorfitCenter}</TableCell>
              <TableCell>{asset.contact}</TableCell>
            </TableRow>
             ))}
          </TableBody>
          </Table>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="w-20 border-2 border-blue-500">Back</Button>
            <Button variant="outline" className="w-20 bg-blue-700 text-white">Save</Button>
          </div>
      </DialogContent>
    </Dialog>
  )
}