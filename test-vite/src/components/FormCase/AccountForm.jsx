import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectBar } from "../sc-select";
import { User2, Copy } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CreateAccountModal({
  formDataSiteAccount,
  setFormDataSiteAccount,
  handleClearAllAccount,
  cities,
  provinces,
}) {
  const handlerInputSiteAccountChange = (e) => {
    const { id, value } = e.target;
    setFormDataSiteAccount((prev) => ({ ...prev, [id]: value }));
  };

  const handlerSiteAccountSubmit = (e) => {
    e.preventDefault();
    console.log("submit site account", formDataSiteAccount);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+ Create Account</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <AccountForm
          formDataSiteAccount={formDataSiteAccount}
          handlerInputSiteAccountChange={handlerInputSiteAccountChange}
          handlerSiteAccountSubmit={handlerSiteAccountSubmit}
          handleClearAllAccount={handleClearAllAccount}
          cities={cities}
          provinces={provinces}
        />
      </DialogContent>
    </Dialog>
  );
}


export function AccountForm({
  formDataSiteAccount,
  handlerInputSiteAccountChange,
  handlerSiteAccountSubmit,
  handleClearAllAccount,
  cities,
  provinces,
}) {
  return (
    <Card className="drop-shadow-md">
      <CardHeader>
        <CardTitle className="flex flex-col">
          <span className="flex items-center">
            <User2 className="mr-2" /> Basic Information
          </span>
          <div className="flex gap-2 self-end mt-2">
            <Button variant="ghost" onClick={handleClearAllAccount}>
              Clear All
            </Button>
            <Button className="bg-white text-gray-400">
              <Copy className="mr-1" /> Same in Account Address
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-5 grid-cols-4">
        <div className="space-y-0.5">
          <Label htmlFor="Company">Company<span className="text-red-600">*</span></Label>
          <Input
            id="Company"
            className="border-b-black p-1"
            onChange={handlerInputSiteAccountChange}
            value={formDataSiteAccount.Company}
          />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="Email">Email<span className="text-red-600">*</span></Label>
          <Input
            id="Email"
            type="email"
            className="border-b-black p-1"
            onChange={handlerInputSiteAccountChange}
            value={formDataSiteAccount.Email}
          />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="PrimaryPhone">Primary Phone<span className="text-red-600">*</span></Label>
          <Input
            id="PrimaryPhone"
            type="text"
            className="border-b-black p-1"
            onChange={handlerInputSiteAccountChange}
            value={formDataSiteAccount.PrimaryPhone}
          />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="WhatsappNo">Whatsapp No</Label>
          <Input
            id="WhatsappNo"
            type="text"
            className="border-b-black p-1"
            onChange={handlerInputSiteAccountChange}
            value={formDataSiteAccount.WhatsappNo}
          />
        </div>
      </CardContent>

      <CardHeader className="mt-4">
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 grid-cols-3">
        <div className="space-y-0.5">
          <Label htmlFor="AddressLine1">Address Line 1<span className="text-red-600">*</span></Label>
          <Input
            id="AddressLine1"
            className="border-b-black p-1"
            onChange={handlerInputSiteAccountChange}
            value={formDataSiteAccount.AddressLine1}
          />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="AddressLine2">Address Line 2</Label>
          <Input
            id="AddressLine2"
            className="border-b-black p-1"
            onChange={handlerInputSiteAccountChange}
            value={formDataSiteAccount.AddressLine2}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="City">City<span className="text-red-600">*</span></Label>
          <SelectBar
            id="City"
            value={formDataSiteAccount.City}
            onChange={handlerInputSiteAccountChange}
            options={cities}
            placeholder="Select a City"
          />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="StateProvince">State/Province<span className="text-red-600">*</span></Label>
          <SelectBar
            id="StateProvince"
            value={formDataSiteAccount.StateProvince}
            onChange={handlerInputSiteAccountChange}
            options={provinces}
            placeholder="Select a Province"
          />
        </div>
        <div className="space-y-0.5 flex flex-col">
          <Label htmlFor="Country">Country<span className="text-red-600">*</span></Label>
          <SelectBar
            id="Country"
            value={formDataSiteAccount.Country}
            onChange={handlerInputSiteAccountChange}
            options={[
              { id: "id", name: "Indonesia" },
              { id: "my", name: "Malaysia" },
              { id: "sg", name: "Singapura" },
              { id: "uk", name: "Inggris" },
              { id: "cn", name: "Cina" }
            ]}
            placeholder="Select a Country"
          />
        </div>
        <div className="space-y-0.5">
          <Label htmlFor="ZipPostalCode">Zip/Postal Code<span className="text-red-600">*</span></Label>
          <Input
            id="ZipPostalCode"
            type="text"
            className="border-b-black p-1"
            onChange={handlerInputSiteAccountChange}
            value={formDataSiteAccount.ZipPostalCode}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          variant="secondary"
          className="bg-white drop-shadow-md border cursor-pointer"
          onClick={handlerSiteAccountSubmit}
        >
          Verify & Save
        </Button>
      </CardFooter>
    </Card>
  );
}
