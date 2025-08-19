import React, { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Swal from 'sweetalert2';
import ApiCustomer from '@/api'

// Initial form data
const initialFormData = {
  SerialNumber: "",
  ProductNumber: "",
  ProductName: "",
  ProductLine: "",
  ProductTower: "",
  ProductGroup: "",
  ProductType: "",
  ProductTypeID: "",
  SiteAccountID: "",
  ContactID: ""
}

// ⬇️ Put this OUTSIDE the SnInput component (top-level of the file)
const InputRow = React.memo(function InputRow({
  label,
  id,
  value,
  onChange,
  type = "text",
  disabled = false,
}) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className="col-span-3"
        type={type}
        disabled={disabled}
      />
    </div>
  );
});


export const SnInput = ({
  unownedAssets,
  setUnownedAssets,
  fetchUnownedAssets,
}) => {
  // Modal state
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState(initialFormData);

  // Product type selection state
  const [productTypeList, setProductTypeList] = useState([]);
  const [productResult, setProductResult] = useState([]);
  const [checkPNTerm, setCheckPNTerm] = useState("");

  // Handle input change for all fields
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === "ProductTower" || key === "ProductGroup") {
      setFormData(prev => ({
        ...prev,
        ProductTypeID: "",
        ProductType: ""
      }));
    }
  };

  // Clear all form data
  const handleClearAllFormData = () => {
    setFormData(initialFormData);
    setProductResult([]);
    setCheckPNTerm("");
    setProductTypeList([]);
  };

  // Fetch product types when tower/group changes
  useEffect(() => {
    if (formData.ProductTower && formData.ProductGroup) {
      fetchProductTypes(formData.ProductTower, formData.ProductGroup);
    } else {
      setProductTypeList([]);
    }
  }, [formData.ProductTower, formData.ProductGroup]);

  // Fetch product types from API
  const fetchProductTypes = async (tower, group) => {
    try {
      const response = await ApiCustomer.get(`/api/product-type`, {
        params: { ProductTower: tower, ProductGroup: group },
      });
      setProductTypeList(response.data.data || []);
    } catch (err) {
      setProductTypeList([]);
    }
  };

  // Handle Check PN search
  const handleCheckPN = async (e) => {
    const value = e.target.value;
    setCheckPNTerm(value);
    if (value.length > 2) {
      try {
        const response = await ApiCustomer.get(`/api/product-information?search=${value}`);
        setProductResult(response.data.data || []);
      } catch {
        setProductResult([]);
      }
    } else {
      setProductResult([]);
    }
  };

  // Handle selecting a product from PN search
  const handleSelectProduct = async (product) => {
    setCheckPNTerm(product.ProductTypeID || "");
    setProductResult([]);
    await fetchProductTypes(product.product_type?.ProductTower, product.product_type?.ProductGroup);

    setFormData(prev => ({
      ...prev,
      ProductNumber: product.ProductNumber,
      ProductName: product.ProductName,
      ProductLine: product.ProductLine,
      ProductTower: product.product_type?.ProductTower || "",
      ProductGroup: product.product_type?.ProductGroup || "",
      ProductType: product.product_type?.ProductType || "",
      ProductTypeID: product.ProductTypeID || "",
    }));
  };

  // Submit form data
  const handleSubmit = async () => {
    if (!formData.SerialNumber || !formData.ProductNumber) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan!',
        text: 'Serial Number dan Product Number harus diisi.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: { popup: 'z-[9999]' },
      });
      return;
    }

    Swal.fire({
      title: 'Menyimpan...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: { popup: 'z-[9999]' },
    });

    try {
      await ApiCustomer.post("/api/product-information", {
        ProductNumber: formData.ProductNumber,
        ProductName: formData.ProductName,
        ProductLine: formData.ProductLine,
        ProductTypeID: formData.ProductTypeID,
      });

      await ApiCustomer.post("/api/asset-information", {
        SerialNumber: formData.SerialNumber,
        ProductNumber: formData.ProductNumber,
        SiteAccountID: formData.SiteAccountID || null,
        ContactID: formData.ContactID || null,
      });

      setIsOpenModal(false);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Asset berhasil ditambahkan.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: { popup: 'z-[9999]' },
      });

      fetchUnownedAssets();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menambahkan asset. Silakan coba lagi.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: { popup: 'z-[9999]' },
      });
    }
  };



  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>
        <Button variant="link" className="ml-30">Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader className="flex flex-row justify-between">
          <DialogTitle className='mt-1 font-bold'>Add New Product</DialogTitle>
          <Button variant="link" onClick={handleClearAllFormData}>Clear All</Button>
        </DialogHeader>
        <div className="grid gap-4 py-4 grid-flow-col grid-rows-4">
          {/* Serial Number */}
          <InputRow
            label="Serial No"
            id="SerialNumber"
            value={formData.SerialNumber}
            onChange={e => handleChange("SerialNumber", e.target.value)}
          />

          {/* Check PN with dropdown */}
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="checkPN" className="text-right">Check P/N</Label>
            <div className="relative col-span-3">
              <Input
                id="checkPN"
                type="search"
                value={checkPNTerm}
                onChange={handleCheckPN}
                className="col-span-3"
              />
              {productResult.length > 0 && (
                <ul className="bg-white border border-gray-300 rounded-md absolute z-10 w-full">
                  {productResult.map(product => (
                    <li
                      key={product.ProductNumber}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectProduct(product)}
                    >
                      {product.ProductNumber} - {product.ProductName} ({product.product_type?.ProductType})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Product Tower */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ProductTower" className="text-right">Product tower</Label>
            <Select
              id="ProductTower"
              value={formData.ProductTower}
              onValueChange={value => handleChange("ProductTower", value)}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Product tower" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product tower</SelectLabel>
                  <SelectItem value="PSG">PSG</SelectItem>
                  <SelectItem value="IPG">IPG</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Product Group */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ProductGroup" className="text-right">Product group</Label>
            <Select
              id="ProductGroup"
              value={formData.ProductGroup}
              onValueChange={value => handleChange("ProductGroup", value)}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Product group" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product group</SelectLabel>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Product Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ProductType" className="text-right">Product type</Label>
            <Select
              id="ProductType"
              value={formData.ProductTypeID}
              onValueChange={value => handleChange("ProductTypeID", value)}
              disabled={!formData.ProductTower || !formData.ProductGroup}
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {productTypeList.length > 0 ? (
                    productTypeList.map(product => (
                      <SelectItem key={product.ProductTypeID} value={product.ProductTypeID}>
                        {product.ProductType}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No Product Types Available</SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Product Line */}
          <InputRow
            label="Product line"
            id="ProductLine"
            value={formData.ProductLine}
            onChange={e => handleChange("ProductLine", e.target.value)}
          />

          {/* Product Number */}
          <InputRow
            label="Product no."
            id="ProductNumber"
            value={formData.ProductNumber}
            onChange={e => handleChange("ProductNumber", e.target.value)}
          />

          {/* Product Name */}
          <InputRow
            label="Product name"
            id="ProductName"
            value={formData.ProductName}
            onChange={e => handleChange("ProductName", e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
