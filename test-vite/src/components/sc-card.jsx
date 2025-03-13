import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input';
import { Label } from "@/components/ui/label";
import { SelectBar } from '@/components/sc-select'
import { SelectBar1 } from '@/components/sc-select'
import { SelectBar2 } from '@/components/sc-select'


export function CardContact() {
  return (
    <Card className="drop-shadow-md h-100">
    {/* <CardHeader>
      <CardTitle>Password</CardTitle>
      <CardDescription>
        Change your password here. After saving, you'll be logged out.
      </CardDescription>
    </CardHeader> */}
    
    <CardHeader>
    <CardTitle className="flex justify-end">
        Clear All
      </CardTitle>  
      <CardTitle>
        Basic Information
      </CardTitle>
    </CardHeader>

    <CardContent className="grid gap-5 grid-cols-3">
    <div className="space-y-0.5">
        <Label htmlFor="current">Salutation</Label>
        <SelectBar1></SelectBar1>
        <Label htmlFor="current" className="mt-2">Preferend Language</Label>
        <SelectBar2></SelectBar2>
      </div>
      <div className="space-y-0.5 absolute ml-30">
        <Label htmlFor="current">First Name</Label>
        <Input id="current" type="email"className="border-b-black p-1 w-20"/>
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Last Name</Label>
        <Input id="current" type="email"className="border-b-black p-1"/>
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="new">EXTN</Label>
        <Input id="new" type="text" className="border-b-black p-1"/>
      </div>
    </CardContent>
    
    <CardHeader className="mt-2">
      <CardTitle>
      Phone preferences
      </CardTitle>
    </CardHeader>

    <CardContent className="grid gap-5 grid-cols-3">
    <div className="space-y-0.5">
        <Label htmlFor="current">Phone</Label>
        <Input id="current" type="email" className="border-b-black p-1" />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Mobile</Label>
        <Input id="current" type="email" className="border-b-black p-1" />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="new">Work</Label>
        <Input id="new" type="text" className="border-b-black p-1 w-38.5"/>
      </div>
      <div className="space-y-0.5 absolute ml-215">
        <Label htmlFor="current">EXTN</Label>
        <Input id="current" type="text" className="border-b-black p-1 w-38.5" />
      </div>  
      <div className="space-y-0.5">
        <Label htmlFor="current">Other</Label>
        <Input id="current" type="text" className="border-b-black p-1 w-38"/>
      </div>
      <div className="space-y-0.5 absolute mt-18 ml-43">
        <Label htmlFor="current">EXTN</Label>
        <Input id="current" type="text" className="border-b-black p-1 w-38" />
      </div> 
      <div className="space-y-0.5">
        <Label htmlFor="new">FAX</Label>
        <Input id="new" type="text" className="border-b-black p-1" />
      </div>
    </CardContent>

    <CardHeader className="mt-2">
      <CardTitle>
      Address
      </CardTitle>
    </CardHeader>

    <CardContent className="grid gap-5 grid-cols-3">
      <div className="space-y-0.5">
        <Label htmlFor="current">Addres Line 1</Label>
        <Input id="current" type="email" className="border-b-black p-1"  />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Addres Line 2</Label>
        <Input id="current" type="email" className="border-b-black p-1" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new">City</Label>
        <Input id="new" type="text" className="border-b-black p-1"  />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">State/Province</Label>
        <Input id="current" type="text" className="border-b-black p-1" />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Country</Label>
        <SelectBar></SelectBar>
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="new">Zip/Postal Code</Label>
        <Input id="new" type="text" className="border-b-black p-1" />
      </div>
    </CardContent>

    <CardFooter className="flex justify-end gap-4">
      <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer w-20">Save</Button>
      <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer">Verify & Save</Button>
    </CardFooter>
  </Card>
  )
}

export function CardAsset() {
  return (
    <Card className="drop-shadow-md">
    {/* <CardHeader>
      <CardTitle>Password</CardTitle>
      <CardDescription>
        Change your password here. After saving, you'll be logged out.
      </CardDescription>
    </CardHeader> */}
    
    <CardHeader>
    <CardTitle className="flex justify-end">
        Clear All
      </CardTitle>  
      <CardTitle>
        Basic Information
      </CardTitle>
    </CardHeader>

    <CardContent className="grid gap-5 grid-cols-3">
    <div className="space-y-0.5">
        <Label htmlFor="current">Salutation</Label>
        <SelectBar1></SelectBar1>
        <Label htmlFor="current" className="mt-2">Preferend Language</Label>
        <SelectBar2></SelectBar2>
      </div>
      <div className="space-y-0.5 absolute ml-42">
        <Label htmlFor="current">First Name</Label>
        <Input id="current" type="email"className="border-b-black p-1 w-40.5"/>
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Last Name</Label>
        <Input id="current" type="email"className="border-b-black p-1"/>
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="new">EXTN</Label>
        <Input id="new" type="text" className="border-b-black p-1"/>
      </div>
    </CardContent>
    
    <CardHeader className="mt-2">
      <CardTitle>
      Phone preferences
      </CardTitle>
    </CardHeader>

    <CardContent className="grid gap-5 grid-cols-3">
    <div className="space-y-0.5">
        <Label htmlFor="current">Phone</Label>
        <Input id="current" type="email" className="border-b-black p-1" />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Mobile</Label>
        <Input id="current" type="email" className="border-b-black p-1" />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="new">Work</Label>
        <Input id="new" type="text" className="border-b-black p-1 w-38.5"/>
      </div>
      <div className="space-y-0.5 absolute ml-215">
        <Label htmlFor="current">EXTN</Label>
        <Input id="current" type="text" className="border-b-black p-1 w-38.5" />
      </div>  
      <div className="space-y-0.5">
        <Label htmlFor="current">Other</Label>
        <Input id="current" type="text" className="border-b-black p-1 w-38"/>
      </div>
      <div className="space-y-0.5 absolute mt-18 ml-43">
        <Label htmlFor="current">EXTN</Label>
        <Input id="current" type="text" className="border-b-black p-1 w-38" />
      </div> 
      <div className="space-y-0.5">
        <Label htmlFor="new">FAX</Label>
        <Input id="new" type="text" className="border-b-black p-1" />
      </div>
    </CardContent>

    <CardHeader className="mt-2">
      <CardTitle>
      Address
      </CardTitle>
    </CardHeader>

    <CardContent className="grid gap-5 grid-cols-3">
      <div className="space-y-0.5">
        <Label htmlFor="current">Addres Line 1</Label>
        <Input id="current" type="email" className="border-b-black p-1"  />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Addres Line 2</Label>
        <Input id="current" type="email" className="border-b-black p-1" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new">City</Label>
        <Input id="new" type="text" className="border-b-black p-1"  />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">State/Province</Label>
        <Input id="current" type="text" className="border-b-black p-1" />
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="current">Country</Label>
        <SelectBar></SelectBar>
      </div>
      <div className="space-y-0.5">
        <Label htmlFor="new">Zip/Postal Code</Label>
        <Input id="new" type="text" className="border-b-black p-1" />
      </div>
    </CardContent>

    <CardFooter className="flex justify-end gap-4">
      <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer w-20">Save</Button>
      <Button variant="secondary" className="bg-white drop-shadow-md border-1 cursor-pointer">Verify & Save</Button>
    </CardFooter>
  </Card>
  )
}
