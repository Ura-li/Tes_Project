import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm({ siteAccountId = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    SiteAccountID: siteAccountId, // null kalau standalone
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Country: "",
    City: "",
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
        <CardTitle>Create New Contact</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-3">
          <div>
            <Label htmlFor="FirstName">First Name</Label>
            <Input id="FirstName" value={formData.FirstName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="LastName">Last Name</Label>
            <Input id="LastName" value={formData.LastName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="Email">Email</Label>
            <Input id="Email" value={formData.Email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="Phone">Phone</Label>
            <Input id="Phone" value={formData.Phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="City">City</Label>
            <Input id="City" value={formData.City} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="Country">Country</Label>
            <Input id="Country" value={formData.Country} onChange={handleChange} />
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
