import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CompanyForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    Company: "",
    Email: "",
    PrimaryPhone: "",
    AddressLine1: "",
    City: "",
    Country: "",
    ZipPostalCode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Create New Company</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-3">
          <div>
            <Label htmlFor="Company">Company Name</Label>
            <Input id="Company" value={formData.Company} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="Email">Email</Label>
            <Input id="Email" value={formData.Email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="PrimaryPhone">Phone</Label>
            <Input id="PrimaryPhone" value={formData.PrimaryPhone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="AddressLine1">Address</Label>
            <Input id="AddressLine1" value={formData.AddressLine1} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="City">City</Label>
            <Input id="City" value={formData.City} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="Country">Country</Label>
            <Input id="Country" value={formData.Country} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="ZipPostalCode">Zip/Postal Code</Label>
            <Input id="ZipPostalCode" value={formData.ZipPostalCode} onChange={handleChange} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
