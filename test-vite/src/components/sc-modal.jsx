import React, { useState} from 'react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'
 
export function BtnModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mr-4"><Plus></Plus>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-3">
        <div className="">
            <Label htmlFor="name" className="text-right">
            Case Subject
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export const BMCCompany = () => {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [country, setCountry] = useState("");
  const [zipPostalCode, setZipPostalCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic (e.g., send data to API)
    const formData = {
      company,
      email,
      primaryPhone,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      country,
      zipPostalCode,
    };
    console.log("Submitted Data:", formData);
    // Reset form
    setCompany("");
    setEmail("");
    setPrimaryPhone("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setStateProvince("");
    setCountry("");
    setZipPostalCode("");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mr-4"><Plus></Plus>
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <Label htmlFor="company" className="text-right">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="primaryPhone" className="text-right">Primary Phone</Label>
              <Input
                id="primaryPhone"
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="addressLine1" className="text-right">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="addressLine2" className="text-right">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="city" className="text-right">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="stateProvince" className="text-right">State/Province</Label>
              <Input
                id="stateProvince"
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="country" className="text-right">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="zipPostalCode" className="text-right">Zip/Postal Code</Label>
              <Input
                id="zipPostalCode"
                value={zipPostalCode}
                onChange={(e) => setZipPostalCode(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
