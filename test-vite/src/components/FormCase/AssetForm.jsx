import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AssetForm({ contactId, siteAccountId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    ContactID: contactId,
    SiteAccountID: siteAccountId,
    SerialNumber: "",
    ProductNumber: "",
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
        <CardTitle>Create New Asset</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-3">
          <div>
            <Label htmlFor="SerialNumber">Serial Number</Label>
            <Input id="SerialNumber" value={formData.SerialNumber} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="ProductNumber">Product Number</Label>
            <Input id="ProductNumber" value={formData.ProductNumber} onChange={handleChange} required />
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
