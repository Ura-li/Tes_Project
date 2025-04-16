

import React, { useState, useEffect } from "react";

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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import { Plus,PhoneCall, Copy, ExternalLink, XIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { SelectBar3, SelectBarContact4 } from "./sc-select";
import { 
  SelectBarContact,
  SelectBarContact2,
  SelectBarContact3,
  SelectBar,
  SelectBar1,
  SelectBar2,
 } from "@/components/sc-select";
 import { 
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
  } from '@/components/ui/select'
 import { SnInput } from "./sn-input";

import { Pencil, Trash } from "lucide-react";
//import API
import ApiCustomer from "@/api";
import axios from "axios";
import Swal from "sweetalert2";
import { Textarea } from "./ui/textarea";


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// const assets = [
//   {
//     productname: "HP Victus 16 inch Gaming Laptop 16-r0555TX",
//     product: "9T92PA94-92",
//     HWPorfitCenter: "-",
//     contact: "Slamet Meisa Putra",
//   },
// ];

export function BtnModal({
  handleCreateCase,
  selectedAssetForCase,
  selectedContactForCase,
  caseType,
  setCaseType
}) {
  
  
  // console.log("This is  the data",selectedAssetForCase.AssetID);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={handleCreateCase}
          disabled={!selectedAssetForCase || !selectedContactForCase } // 🔥 Button disabled if no asset selected
          className={`mr-4${(!selectedAssetForCase || !selectedContactForCase) ? "bg-white cursor-not-allowed" : "bg-blue-500"}`}
        >
          <Plus></Plus>Create Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>Case Information</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-3">
          <div className="">
            <Label htmlFor="name" className="text-right">
              Case Subject
            </Label>
            <Input id="CaseSubject" className="col-span-3 border-b-black p-1" />
          </div>
          <div className="">
            <Label htmlFor="CaseType" className="text-right">
              Case Type
            </Label>
            <SelectBar3 value={caseType} onChange={setCaseType}></SelectBar3>
          </div>
          <div className="flex items-center space-x-2 mt-5">
            <Checkbox id="KCI_Flag" />
            <label
              htmlFor="KCI_Flag"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KCI For this case?
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateCase}>DONE</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BtnModalAccount({
  
})
{}
/**
 * TODO 
 * VALIDATION WHERE INPUTED CONTACT ALREADY AVAILABLE
 * CHECK EMAIL OR PHONE
 */

export function BtnModalContact({ 
  selectedCompany, 
  selectedContact, 
  setSelectedContact, 
  open : externalOpen, 
  onOpenChange : externalOnChange,
  companyData
  }) {
    console.log("CHECK DATA FORM BTN MOdAL",selectedContact)

  //set modal state 

  console.log("Company Data in Modal Contact : ",companyData)
  const [isModalContactSearchInput, setIsModalContactSearchInput] = useState(false);
  
  const open = externalOpen || isModalContactSearchInput;

  const handleChange = (value) => {
    if (externalOpen !== undefined) {
      externalOnChange?.(false);
    } else {
      setIsModalContactSearchInput(value);
    }
  };

   const [formDataContact, setFormDataContact] = useState({
      Salutation: '',
      FirstName: '',
      LastName: '',
      Email: '',
      PreferredLanguage: '',
      Phone: '',
      Mobile: '',
      WorkPhone: '',
      WorkExtension: '',
      OtherPhone: '',
      OtherExtension: '',
      Fax: '',
      AddressLine1: '',
      AddressLine2: '',
      City: '',
      StateProvince: '',
      Country: '',
      ZipPostalCode: '',
      SiteAccountID: typeof selectedCompany === "object" 
      ? selectedCompany.SiteAccountID ?? "" 
      : selectedCompany
    });
    
    
    //handle input
    const handlerInputContactChange = (e) => {
      const { id, value } = e.target;
      setFormDataContact((prev) => ({ ...prev, [id]: value }));
    };
    
    const handleClearAllContact = () => {
      setFormDataContact({
        Salutation: '',
        FirstName: '',
        LastName: '',
        Email: '',
        PreferredLanguage: '',
        Phone: '',
        Mobile: '',
        WorkPhone: '',
        WorkExtension: '',
        OtherPhone: '',
        OtherExtension: '',
        Fax: '',
        AddressLine1: '',
        AddressLine2: '',
        City: '',
        StateProvince: '',
        Country: '',
        ZipPostalCode: '',
      })
    }

  // Function to fetch updated contacts
  const fetchContacts = async (companyId) => {
    try {
      console.log("Fetching contacts for Company ID:", companyId); // ✅ Debugging
      const response = await ApiCustomer.get(`/api/contact-information?SiteAccountID=${companyId}`);
      console.log("response Fetch Contacts: ", response.data)
      return response.data.data; // ✅ Return updated contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  };
  // Handle form submission
  const handlerContactSubmit = async () => {
    console.log("formDataContact", formDataContact);
    try {
      let responseMessage = '';
  
      if (formDataContact.ContactID) {
        // ✅ Update existing contact
        await ApiCustomer.patch(`/api/contact-information/${formDataContact.ContactID}`, formDataContact);
        responseMessage = 'Kontak berhasil diperbarui!';
      } else {
        // ✅ Add new contact
        console.log("Selected Company in ModalContactSubmit : ", selectedCompany)
        await ApiCustomer.post("/api/contact-information", formDataContact);
        responseMessage = 'Kontak berhasil ditambahkan!';
      }
  
      // ✅ Tutup modal form input dulu
      setIsModalContactSearchInput(false);
  
      // ✅ Tunggu sebentar biar modal benar-benar hilang (hindari konflik z-index)
      setTimeout(async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: responseMessage,
          confirmButtonText: 'OK'
        });
  
        // ✅ Refresh data kontak setelah SweetAlert ditutup
        if (selectedCompany?.SiteAccountID) {
          const updatedContacts = await fetchContacts(selectedCompany.SiteAccountID);
          setSelectedContact(updatedContacts);
          console.log("Updated Selected Contacts:", updatedContacts);
        }
      }, 300); // delay kecil untuk pastikan modal tertutup
  
    } catch (error) {
      console.error("Error adding contact:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan kontak.',
      });
    }
  };

  // make the 'same in account information' button :
  const handleCopyFromAccount = () => {
    if (companyData == null) return;
  
    const fieldsToCopy = [
      "AddressLine1",
      "AddressLine2",
      "City",
      "StateProvince",
      "Country",
      "ZipPostalCode"
    ];
  
    fieldsToCopy.forEach((field) => {
      const value = companyData[field] || "";
      handlerInputContactChange({ target: { id: field, value } });
    });
  };
  

  // Edit function 

  // ✅ Function to open Edit Modal
  const openEditModal = (contact) => {
    setFormDataContact(contact);
  };


  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mt-0.5">
          New Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]  bg-white">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogDescription className="text-xl font-semibold text-black gap-2 flex"><PhoneCall></PhoneCall>Contact Information</DialogDescription>
            <Button 
            className="self-end mr-2" 
            variant="ghost"
            onClick={handleClearAllContact}
            >Clear All</Button>
          
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Basic Information</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 grid-cols-6">
          <div className="space-y-0.5 flex flex-col">
            <Label htmlFor="Salutation">Salutation</Label>
            <SelectBar1 value={formDataContact.Salutation} id="Salutation" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5 flex flex-col"> 
            <Label htmlFor="PreferredLanguage" >Preferred Language</Label>
            <SelectBar2 value={formDataContact.PreferredLanguage} id="PreferredLanguage" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5">
            <Label htmlFor="FirstName">First Name</Label>
            <Input value={formDataContact.FirstName} id="FirstName" type="text" className="border-b-black p-1 " onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5 ">
            <Label htmlFor="LastName">Last Name</Label>
            <Input value={formDataContact.LastName} id="LastName" type="text" className="border-b-black p-1 " onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5 col-span-2">
            <Label htmlFor="Email">Email</Label>
            <Input value={formDataContact.Email} id="Email" type="email" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          {/* <div className="space-y-0.4 ml-5">
            <Label htmlFor="new">EXTN</Label>
            <Input id="new" type="text" className="border-b-black p-1 w-73 h-8 text-sm" />
          </div> */}
        </div>

        <DialogHeader>
          <DialogTitle className="text-md">Phone preferences</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-2">
          <div className="space-y-0.4 col-span-2">
            <Label htmlFor="Phone">Phone</Label>
            <Input
             value={formDataContact.Phone} id="Phone" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 col-span-2">
            <Label htmlFor="Mobile">Mobile</Label>
            <Input
             value={formDataContact.Mobile} id="Mobile" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div> 
          <div className="space-y-0.4">
            <Label htmlFor="WorkPhone">Work</Label>
            <Input
             value={formDataContact.WorkPhone} id="WorkPhone" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4">
            <Label htmlFor="WorkExtension">Work EXTN</Label>
            <Input value={formDataContact.WorkExtension} id="WorkExtension" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4">
            <Label htmlFor="OtherPhone">Other</Label>
            <Input value={formDataContact.OtherPhone} id="OtherPhone" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div> 
          <div className="space-y-0.4 ">
            <Label htmlFor="OtherExtension"> Other EXTN</Label>
            <Input value={formDataContact.OtherExtension} id="OtherExtension" type="text" className="border-b-black p-1 text-sm" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 col-span-2">
            <Label htmlFor="Fax">FAX</Label>
            <Input value={formDataContact.Fax} id="Fax" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
        </div>

        <DialogHeader className="flex-row justify-between items-center">
          <DialogTitle className="text-md">Address</DialogTitle>
          <Button className="bg-white text-gray-400   " onClick={handleCopyFromAccount}><Copy></Copy>Same in Account Adress </Button>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-0.4">
            <Label htmlFor="AddressLine1">Address Line 1</Label>
            <Input id="AddressLine1" type="text" value={formDataContact.AddressLine1 || ""} className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 flex flex-col">
            <Label htmlFor="current">Country</Label>
            <SelectBar id="Country" value={formDataContact.Country || ""} onChange={handlerInputContactChange}/>
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="AddressLine2">Address Line 2</Label>
            <Input id="AddressLine2" value={formDataContact.AddressLine2 || ""} type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="ZipPostalCode">Zip/Postal Code</Label>
            <Input id="ZipPostalCode" value={formDataContact.ZipPostalCode || ""} type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="City">City</Label>
            <Input id="City" type="text" value={formDataContact.City || ""} className="border-b-black p-1 text-sm" onChange={handlerInputContactChange} />

            
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="StateProvince">State/Province</Label>
            <Input id="StateProvince" value={formDataContact.StateProvince || ""} type="text" className="border-b-black p-1 text-sm" onChange={handlerInputContactChange} />

            
                  {/* Hidden Input for SiteAccountID */}
                  <Input type="hidden" id="SiteAccountID" value={formDataContact.SiteAccountID || ""} onChange={handlerInputContactChange} />
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
        <Button variant="secondary" className="bg-white w-30 drop-shadow-md border-1 cursor-pointer text-xl" onClick={handlerContactSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


/**
 * TODO 
 * MAKE ROUTE FOR PRODUCT
 */
export function 
BtnModalAsset({
  typeSearch,
  contactID, 
  siteAccountID, 
  selectedContactForCase,
  selectedCompany,
  setSelectedAsset,
  selectedAsset,
  open : externalOpen,
  onOpenChange : externalOnChange,
}) {
  //set asset
  console.log("BtnModalAsset ContactID : ",contactID)
  const [assets, setAssets] = useState([])
  //prevent infinite loop of calling fetchDataAssets
  useEffect(() => {
    fetchDataAssets();
    fetchUnownedAssets();
  }, []); 

  //set search state
  const [searchAsset, setSearchAsset] = useState("");

  const [currentPage, setCurrentPage] = useState(null);

  const [totalPages, setTotalPages] = useState(null);

  //handle Change Input
  const handleSearchInputAssetsChange = (e) =>{
    const searchQuery = e.target.value;
    setSearchAsset(searchQuery);
  }
  const filteredAssets = searchAsset !== "" ? assets.filter(
    (asset) => 
      asset.SerialNumber?.toLowerCase().includes(searchAsset.toLowerCase()) || 
      asset.product_information?.ProductName?.toLowerCase().includes(searchAsset.toLowerCase()) || 
      asset.ProductNumber?.toLowerCase().includes(searchAsset.toLowerCase())
  ) : [];


  //handling dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAssetForCreatingAsset, setSelectedAssetForCreatingAsset] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 10;
  const [unownedAssets, setUnownedAssets] = useState([]);
  const [loadingUnowned, setLoadingUnowned] = useState(false);
  const [searchUnowned, setSearchUnowned] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const open = externalOpen || isOpen;

  const handleChange = (value) => {
    if (externalOpen !== undefined) {
      externalOnChange?.(false);
    } else {
      setIsOpen(value);
    }
  };
  
  useEffect(() => {
    if (!contactID) return;
    fetchUnownedAssets();
    fetchDataAssets();
    console.log("selectedContactForCase : ",selectedContactForCase)
    console.log('ContactIDFromSelectedContact')
  }, [contactID, currentPage, searchAsset]);

  const fetchDataAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get(`/api/asset-information/kepemilikan`, {
        params: { page: currentPage, limit: itemsPerPage, search: searchAsset, contactID },
      });

      setAssets(response.data.data);
      // setSelectedAsset(response.data.data);
      setTotalPages(response.data.totalPages);
      return response.data.data;
    } catch (error) {
      setError("Failed to load asset data.");
      console.error("Error fetching assets:", error);
      return []; // ✅ Return an empty array instead of `undefined`
    } finally{
      setLoading(false);
    }
  };

  const fetchAssetTable = async (companyID = null, contactID = null) => {
    try {
      let query = '';
      if(companyID !== null){
        query += `SiteAccountID=${companyID}`
      }
      if(contactID !== null){
        if(companyID !== null) query += `&`
        query += `ContactID=${contactID}`
      }
      const response = await ApiCustomer.get(`/api/asset-information?${query}`);
      console.log("response Fetch Contacts: ", response.data)
      return response.data.data; // ✅ Return updated contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  }
  
  
  const fetchUnownedAssets = async () => {
    setLoadingUnowned(true);
    try {
      console.log("Search Unowned : ",searchUnowned)
      const response = await ApiCustomer.get(`/api/asset-information/kepemilikan/unowned`, {
        params: {page: 1, limit: 10, search: searchUnowned},
      });
      setUnownedAssets(response.data.data);
    } catch (error) {
      console.error("Error fetching unowned assets:", error);
    }
    setLoadingUnowned(false);
  };

  const handleUpdateAsset = async () => {
    if (!selectedAssetForCreatingAsset) return;
    setIsUpdating(true);
    console.log(siteAccountID);
    
    try {
      const response = await ApiCustomer.patch(`/api/asset-information/kepemilikan/${selectedAssetForCreatingAsset.AssetID}`, {
        contactID,
        siteAccountID
      });
      
      if (response.status === 200) {
        const updatedAssets = await fetchAssetTable(siteAccountID, contactID);
        setSelectedAsset(updatedAssets);
        console.log("Selected Asset after Creating New One : ", updatedAssets);
        alert("Asset berhasil diperbarui!");

        setIsOpen(false);
        // fetchDataAssets();

        if(selectedAssetForCreatingAsset?.AssetID){
        }
      }
    } catch (error) {
      alert("Terjadi kesalahan saat memperbarui asset. ", error);
      console.error("Terjadi kesalahan : ", error)
    }
    setIsUpdating(false);
  };
  
  
  const handleSearch = async () => {
    setIsSearching(true);
    setCurrentPage(1);
    await fetchDataAssets();
    setIsSearching(false);
    await fetchUnownedAssets();
  };

  //handler check for creating product with frontdesk
  const [isCheckedForCreateProduct, setIsCheckedForCreateProduct] = useState(false);

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          // className="bg-white mt-0.5"
          className={`mt-0.5 ${(!selectedContactForCase && typeSearch !== 'individual') ? "bg-white cursor-not-allowed" : "bg-blue-500"}`} 
          onClick={() => setIsOpen(true)}
          disabled={!selectedContactForCase && typeSearch !== 'individual'} // 🔥 Button disabled if no contact selected
        >
          New Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Asset Information</DialogTitle>
          <DialogDescription>Add Asset</DialogDescription>
          <Button className="self-end mr-2" variant="ghost">Clear All</Button>
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Serial Number</DialogTitle>
        </DialogHeader>

        {/* <div className="flex gap-3">  
          <Input className="border-2 border-black rounded-2xl w-55 text-md h-10" type="Search" onChange={handleSearchInputAssetsChange}></Input>
          <Button variant="outline" className="w-30 rounded-2xl h-10 border-blue-600 border-2">Search</Button>
          
        </div> */}


        {/* <Table className="table-fixed border-spacing-0 mx-auto">
          <TableHeader>
            <TableRow className="bg-blue-200">
              <TableHead className="text-black">Product Name</TableHead>
              <TableHead className="text-black">Product Number</TableHead>
              <TableHead className="text-black">HW Profit Center</TableHead>
              <TableHead className="text-black" colSpan="2">Contact</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody >
            {assets.length > 0 ? ( assets.map((asset) => (
              <TableRow key={asset?.AssetID}>
                <TableCell className="whitespace-break-spaces ">{asset?.product_information?.ProductName}</TableCell>
                <TableCell>{asset?.product_information?.ProductNumber}</TableCell>
                <TableCell>{asset?.HWPorfitCenter ? asset?.HWPorfitCenter : '-' }</TableCell>
                <TableCell>{asset?.contact_information !== null ? asset?.contact_information?.FirstName + ' ' + asset?.contact_information?.LastName : '-'   }</TableCell>
              </TableRow>
             )) ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center font-medium whitespace-break-spaces"
                  >
                    Data Belum Tersedia
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table> */}

        {/* <h3 className="text-lg font-semibold mt-4">Unowned Assets</h3> */}
        
        <div className="flex gap-3 items-center">
          <Input
            className="border-2 border-black rounded-2xl w-55 text-md h-10 my-2"
            type="Search"
            value={searchUnowned}
            onChange={(e) => setSearchUnowned(e.target.value)}
          />
          <Button
            variant="search"
            className=""
            onClick={fetchUnownedAssets}
          >
            Search
          </Button>
          <div className="mt-2 flex items-center">
          <Checkbox id="terms" className="w-5 h-5 border-2 border-black" checked={isCheckedForCreateProduct} onCheckedChange={setIsCheckedForCreateProduct} />
            <label
              htmlFor="terms"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              Not Available
            </label>
          </div>
          {isCheckedForCreateProduct && 
            <SnInput 
              unownedAssets={unownedAssets}
              setUnownedAssets={setUnownedAssets}
              fetchUnownedAssets={fetchUnownedAssets}
            />
          }
        </div>

        <Table className="table-fixed border-spacing-0 mx-auto mt-2">
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead>Serial Number</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Number</TableHead>
              <TableHead>Product Line</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingUnowned ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : unownedAssets.length > 0 ? (
              unownedAssets.map((asset) => (
                <TableRow
                  key={asset.AssetID}
                  onClick={() => setSelectedAssetForCreatingAsset(asset)}
                  className={`cursor-pointer hover:bg-gray-200 ${
                    selectedAsset?.AssetID === asset.AssetID ? "bg-blue-300" : ""
                  }`}
                >
                  <TableCell>{asset.SerialNumber}</TableCell>
                  <TableCell className={'whitespace-break-spaces'}>{asset.product_information?.ProductName}</TableCell>
                  <TableCell>{asset.ProductNumber}</TableCell>
                  <TableCell>{asset.product_information?.ProductLine}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No Unowned Assets Available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="search"
            className=""
            onClick={handleUpdateAsset}
            disabled={isUpdating || !selectedAssetForCreatingAsset}
          >
            {isUpdating ? "Processing..." : "Select"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
};





//? MODAL FOR MASTER SITE

export function AssetEdit ({ assetId, onUpdate }) {
  const [asset, setAsset] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [productNumber, setProductNumber] = useState("");
  const [productLine, setProductLine] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchAsset = async () => {
    if (!assetId) return; // Cegah fetch jika assetId tidak ada
    try {
      const response = await ApiCustomer.get(`/api/asset-information/${assetId}`);
      const data = response.data.data;
      setAsset(data);
      setSerialNumber(data?.SerialNumber || "");
      setProductName(data?.ProductName || "");
      setProductNumber(data?.ProductNumber || "");
      setProductLine(data?.ProductLine || "");
    } catch (error) {
      console.error("Error fetching asset information:", error);
    }
  };

  useEffect(() => {
    if (assetId && isOpen) { 
      fetchAsset();
    }
  }, [assetId, isOpen]);

  // Reset state saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setSerialNumber("");
      setProductName("");
      setProductNumber("");
      setProductLine("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!serialNumber || !productName || !productNumber) {
      Swal.fire({
        icon: 'Incomplete Data',
        title: 'Warning!',
        text: 'Please fill in all fields before submitting.',
        time: 1100,
        timerProgressBar: false,
        showConfirmButton: false,
      })
      return;
    }

    try {
      await ApiCustomer.patch(`/api/asset-information/${assetId}`, {
        SerialNumber: serialNumber,
        ProductName: productName,
        ProductNumber: productNumber,
        ProductLine: productLine,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button  variant="outline" onClick={() => { setIsOpen(true); fetchAsset(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Asset Information</DialogTitle>
          <DialogDescription>
            Update the details of the asset. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Serial Number*" />
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name*" />
          <Input value={productNumber} onChange={(e) => setProductNumber(e.target.value)} placeholder="Product Number*" />
          <Input value={productLine} onChange={(e) => setProductLine(e.target.value)} placeholder="Product Line" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function AssetDelete ({ assetId }) {
  const handleDelete = async () => {
    try {
      await ApiCustomer.delete(`/api/asset-information/${assetId}`);
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-500 hover:text-red-700">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogDescription>
            Delete asset confirm. 
          </DialogDescription>
        </DialogHeader>
        <h1>Anda yakin ingin menghapus data ini?</h1>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function CompanyEdit({ siteAccountId, onUpdate }) {
  const [company, setCompany] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [country, setCountry] = useState("");
  const [zipPostalCode, setZipPostalCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchCompany = async () => {
    if (!siteAccountId) return;
    try {
      const response = await ApiCustomer.get(`/api/site_account/${siteAccountId}`);
      const data = response.data.data;
      setCompany(data);
      setCompanyName(data?.Company || "");
      setEmail(data?.Email || "");
      setPrimaryPhone(data?.PrimaryPhone || "");
      setAddressLine1(data?.AddressLine1 || "");
      setAddressLine2(data?.AddressLine2 || "");
      setCity(data?.City || "");
      setStateProvince(data?.StateProvince || "");
      setCountry(data?.Country || "");
      setZipPostalCode(data?.ZipPostalCode || "");
    } catch (error) {
      console.error("Error fetching company information:", error);
    }
  };

  useEffect(() => {
    if (siteAccountId && isOpen) {
      fetchCompany();
    }
  }, [siteAccountId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCompanyName("");
      setEmail("");
      setPrimaryPhone("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setStateProvince("");
      setCountry("");
      setZipPostalCode("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!companyName || !email || !primaryPhone || !addressLine1 || !city || !country || !zipPostalCode) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
      }); 
      return;
    }

    try {
      await ApiCustomer.patch(`/api/site_account/${siteAccountId}`, {
        Company: companyName,
        Email: email,
        PrimaryPhone: primaryPhone,
        AddressLine1: addressLine1,
        AddressLine2: addressLine2,
        City: city,
        StateProvince: stateProvince,
        Country: country,
        ZipPostalCode: zipPostalCode,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchCompany(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company Information</DialogTitle>
          <DialogDescription>
            Update the details of the company. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name *" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" />
          <Input value={primaryPhone} onChange={(e) => setPrimaryPhone(e.target.value)} placeholder="Primary Phone *" />
          <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Address Line 1 *" />
          <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Address Line 2" />
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City *" />
          <Input value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="State/Province" />
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country *" />
          <Input value={zipPostalCode} onChange={(e) => setZipPostalCode(e.target.value)} placeholder="Zip/Postal Code *" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function CompanyDelete ({ siteAccountId, isModalOpen, setIsModalOpen, onUpdate }) {
    //set modal
  const handleDelete = async () => {
    try {
      const response = await ApiCustomer.delete(`/api/site_account/${siteAccountId}`);
      
      console.log("Server Response:", response.data);
      if (response.status === 409 || response.data.success === false) {
        // 🚨 Restriction triggered - Show alert message
        alert(response.data.message || "Cannot delete this company due to restrictions.");
        return;
      }
      
      Swal.fire({
        icon: 'Success',
        title: 'Berhasil!',
        text: 'Company berhasil dihapus.',
        timer: 1100,  
        timerProgressBar: true,
        showConfirmButton: false,
      });
      // ✅ Close the modal if it's open
      setIsModalOpen(false);
      // ✅ Refresh the table by calling `onUpdate()`
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // 🚨 Handle 409 Conflict error from backend
        alert(error.response.data.message || "Cannot delete! This company has related Contacts or Assets.");
      } else {
        alert("Failed to delete site account. Please try again.");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-500 hover:text-red-700">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogDescription>
            Delete asset confirm. 
          </DialogDescription>
        </DialogHeader>
        <h1>Anda yakin ingin menghapus data ini?</h1>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ContactEdit({ contactID, onUpdate }) {
  const [contact, setContact] = useState(null);
  const [salutation, setSalutation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [workExtension, setWorkExtension] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [country, setCountry] = useState("");
  const [zipPostalCode, setZipPostalCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchContact = async () => {
    if (!contactID) return;
    try {
      const response = await ApiCustomer.get(`/api/contact-information/${contactID}`);
      const data = response.data.data;
      setContact(data);
      setSalutation(data?.Salutation || "");
      setFirstName(data?.FirstName || "");
      setLastName(data?.LastName || "");
      setEmail(data?.Email || "");
      setPreferredLanguage(data?.PreferredLanguage || "");
      setPhone(data?.Phone || "");
      setMobile(data?.Mobile || "");
      setWorkPhone(data?.WorkPhone || "");
      setWorkExtension(data?.WorkExtension || "");
      setAddressLine1(data?.AddressLine1 || "");
      setAddressLine2(data?.AddressLine2 || "");
      setCity(data?.City || "");
      setStateProvince(data?.StateProvince || "");
      setCountry(data?.Country || "");
      setZipPostalCode(data?.ZipPostalCode || "");
    } catch (error) {
      console.error("Error fetching contact information:", error);
    }
  };

  useEffect(() => {
    if (contactID && isOpen) {
      fetchContact();
    }
  }, [contactID, isOpen]);

  const handleUpdate = async () => {
    if (!firstName || !lastName || !email || !phone || !city || !country) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
      });  
      return;
    }

    try {
      await ApiCustomer.patch(`/api/contact-information/${contactID}`, {
        Salutation: salutation,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        PreferredLanguage: preferredLanguage,
        Phone: phone,
        Mobile: mobile,
        WorkPhone: workPhone,
        WorkExtension: workExtension,
        AddressLine1: addressLine1,
        AddressLine2: addressLine2,
        City: city,
        StateProvince: stateProvince,
        Country: country,
        ZipPostalCode: zipPostalCode,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchContact(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact Information</DialogTitle>
          <DialogDescription>
            Update the details of the contact. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={salutation} onChange={(e) => setSalutation(e.target.value)} placeholder="Salutation" />
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name *" />
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name *" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" />
          <Input value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} placeholder="Preferred Language" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone *" />
          <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" />
          <Input value={workPhone} onChange={(e) => setWorkPhone(e.target.value)} placeholder="Work Phone" />
          <Input value={workExtension} onChange={(e) => setWorkExtension(e.target.value)} placeholder="Work Extension" />
          <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Address Line 1" />
          <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Address Line 2" />
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City *" />
          <Input value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="State/Province" />
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country *" />
          <Input value={zipPostalCode} onChange={(e) => setZipPostalCode(e.target.value)} placeholder="Zip/Postal Code *" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ContactDelete ({ contactID }) {
  const [delecteContact, setDelecteContact] = useState(false)

  const handleDelete = async () => {
    try {
      await ApiCustomer.delete(`/api/contact-information/${contactID}`);
      setDelecteContact(!delecteContact);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <Dialog open={delecteContact}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={() => setDelecteContact(true)}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogDescription>
            Delete asset confirm. 
          </DialogDescription>
        </DialogHeader>
        <h1>Anda yakin ingin menghapus data ini?</h1>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ProductAdd () {
  // Form Product
   const [formDataProduct, setFormDataProduct] = useState({
      ProductNumber: '',
      ProductLine: '',
      ProductName: '',
    })
    
    // Make Handler Product
    const handlerInputProduct = (e) => {
      const { id, value } = e.target
      setFormDataProduct(prevState => ({
        ...prevState,
        [id]:value
      }));
    };

    // Handler Submit
    const handlerProduct = async () => {
      if (!formDataProduct.ProductNumber || !formDataProduct.ProductLine || !formDataProduct.ProductName) {
          Swal.fire({
          title: "Incomplete Data",
          text: "Please fill in all fields before submitting.",
          icon: "warning",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }
      try {
        const response = await ApiCustomer.post("/api/product-information", formDataProduct);
        console.log("Success:", response.data);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Product berhasil disimpan.',
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      } catch (err) {
        console.error("Error saving product: ", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to save Product. Please try again.",
          icon: "error",
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11 rounded-sm ml-2"> Product Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product Information</DialogTitle>
          <DialogDescription>
            Add the product Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Product Number</Label>
          <Input type="text" id="ProductNumber" value={formDataProduct.ProductNumber} onChange={handlerInputProduct} />
   
          <Label>Product Line</Label>
          <Input type="text" id="ProductLine" value={formDataProduct.ProductLine} onChange={handlerInputProduct} />
         
          <Label>Product Name</Label>
          <Input type="text" id="ProductName" value={formDataProduct.ProductName} onChange={handlerInputProduct} />
        </div>
        <DialogFooter>
          <Button onClick={handlerProduct}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ProductEdit({ ProductNumber, onUpdate }) {
  const [products, setProducts] = useState(null);
  const [productLine, setProductLine] = useState("");
  const [productName, setProductName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchProducts = async () => {
    if (!ProductNumber) return;
    try {
      const response = await ApiCustomer.get(`/api/product-information/${ProductNumber}`);
      const data = response.data.data;
      setProducts(data);
      setProductLine(data?.ProductLine || "");
      setProductName(data?.ProductName || "");
    } catch (error) {
      console.error("Error fetching company information:", error);
    }
  };

  useEffect(() => {
    if (ProductNumber && isOpen) {
      fetchProducts();
    }
  }, [ProductNumber, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setProductLine("");
      setProductName("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!productLine || !productName) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
      });  
      return;
    }

    try {
      await ApiCustomer.patch(`/api/product-information/${ProductNumber}`, {
        ProductLine: productLine,
        ProductName: productName,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchProducts(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product Information</DialogTitle>
          <DialogDescription>
            Update the details of the product Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={productLine} onChange={(e) => setProductLine(e.target.value)} placeholder="Product Line*" />
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name*" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ProductDelete ({ ProductNumber, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
const handleDelete = async () => {
  try {
    const response = await ApiCustomer.delete(`/api/product-information/${ProductNumber}`);
    
    console.log("Server Response:", response.data);
    if (response.status === 409 || response.data.success === false) {
      // 🚨 Restriction triggered - Show alert message
      alert(response.data.message || "Cannot delete this product due to restrictions.");
      return;
    }
    
    Swal.fire({
      icon: 'Success',
      title: 'Berhasil!',
      text: 'ProductType berhasil dihapus.',
      timer: 1100,  
      timerProgressBar: true,
      showConfirmButton: false,
    });
    // ✅ Close the modal if it's open
    setIsModalOpen(false);
    // ✅ Refresh the table by calling `onUpdate()`
    if (onUpdate) {
      onUpdate();
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // 🚨 Handle 409 Conflict error from backend
      alert(error.response.data.message || "Cannot delete! This product has related Product Type.");
    } else {
      alert("Failed to delete product. Please try again.");
    }
  }
};

return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="text-red-500 hover:text-red-700">
        <Trash />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogDescription>
          Delete Product confirm. 
        </DialogDescription>
      </DialogHeader>
      <h1>Anda yakin ingin menghapus data ini?</h1>
      <DialogFooter>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
};

export function ProductTypeAdd () {
  // Form ProductType
   const [formDataProductType, setFormDataProductType] = useState({
     ProductGroup: '',
     ProductTower: '',
     ProductType: '',
    })
    
    // Make Handler ProductType
    const handlerInputProductType = (e) => {
      const { id, value } = e.target
      setFormDataProductType(prevState => ({
        ...prevState,
        [id]:value
      }));
    };

    // Handler Submit
    const handlerProductType = async () => {
      const { ProductTower, ProductGroup, ProductType } = formDataProductType;
    
      if (!ProductTower || !ProductGroup || !ProductType) {
        Swal.fire({
          title: "Incomplete Data",
          text: "Please fill in all fields before submitting.",
          icon: "warning",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }
    
      try {
        const response = await ApiCustomer.post("/api/product-type", formDataProductType);
        console.log("Success:", response.data);
    
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Product Type berhasil disimpan.',
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });

      } catch (err) {
        console.error("Error saving product type: ", err);
    
        Swal.fire({
          title: "Error!",
          text: "Failed to save ProductType. Please try again.",
          icon: "error",
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11 rounded-sm ml-2"> ProductType Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add ProductType Information</DialogTitle>
          <DialogDescription>
            Add the productType Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
   
          <Label>Product Tower</Label>
          <Select  value={formDataProductType.ProductTower} onValueChange={(value) =>
    setFormDataProductType((prev) => ({ ...prev, ProductTower: value }))
  }>
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Product Tower"/>
                      </SelectTrigger>
                      <SelectContent >
                        <SelectGroup>
                          <SelectLabel>Product tower</SelectLabel>
                          {/* <SelectItem value="">.</SelectItem> */}
                          <SelectItem value="PSG">PSG</SelectItem>
                          <SelectItem value="IPG">IPG</SelectItem>
                        </SelectGroup>
                      </SelectContent>
            </Select>

          <Label>Product Group</Label>
          <Select   value={formDataProductType.ProductGroup}
  onValueChange={(value) =>
    setFormDataProductType((prev) => ({ ...prev, ProductGroup: value }))
  }>
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Product Group"/>
                      </SelectTrigger>
                      <SelectContent >
                        <SelectGroup>
                          <SelectLabel>Product group</SelectLabel>
                          {/* <SelectItem value="">.</SelectItem> */}
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Consumer">Consumer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
            </Select>

          <Label>Product Type</Label>
          <Input type="text" id="ProductType" className="p-2" value={formDataProductType.ProductType} onChange={handlerInputProductType} />
        </div>
        <DialogFooter>
          <Button onClick={handlerProductType}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ProductTypeEdit({ ProductTypeID, onUpdate }) {
  const [producttypes, setProductTypes] = useState(null);
  const [productTower, setProductTower] = useState("");
  const [productGroup, setProductGroup] = useState("");
  const [productType, setProductType] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchProductTypes = async () => {
    if (!ProductTypeID) return;
    try {
      const response = await ApiCustomer.get(`/api/product-type/${ProductTypeID}`);
      const data = response.data.data;
      setProductTypes(data);
      setProductTower(data?.ProductTower || "");
      setProductGroup(data?.ProductGroup || "");
      setProductType(data?.ProductType || "");
    } catch (error) {
      console.error("Error fetching productType information:", error);
    }
  };

  useEffect(() => {
    if (ProductTypeID && isOpen) {
      fetchProductTypes();
    }
  }, [ProductTypeID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setProductTower("");
      setProductGroup("");
      setProductType("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!productTower || !productGroup || !productType) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
      });  
      return;
    }

    try {
      await ApiCustomer.patch(`/api/product-type/${ProductTypeID}`, {
        ProductTower: productTower,
        ProductGroup: productGroup,
        ProductType: productType,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating productType:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchProductTypes(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit ProductType Information</DialogTitle>
          <DialogDescription>
            Update the details of the productType Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
   
        <Label>Product Tower</Label>
        <Select
  value={productTower}
  onValueChange={(value) => setProductTower(value)}
>
  <SelectTrigger className="col-span-3 w-full">
    <SelectValue placeholder="Product Tower" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Product Tower</SelectLabel>
      <SelectItem value="PSG">PSG</SelectItem>
      <SelectItem value="IPG">IPG</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

        <Label>Product Group</Label>
        <Select
  value={productGroup}
  onValueChange={(value) => setProductGroup(value)}
>
  <SelectTrigger className="col-span-3 w-full">
    <SelectValue placeholder="Product Tower" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Product Group</SelectLabel>
      <SelectItem value="Commercial">Commercial</SelectItem>
      <SelectItem value="Consumer">Consumer</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>


        <Label>Product Type</Label>
        <Input type="text" id="ProductType" value={productType} onChange={(e) => setProductType(e.target.value)} />
      </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ProductTypeDelete ({ ProductTypeID, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
const handleDelete = async () => {
  try {
    const response = await ApiCustomer.delete(`/api/product-type/${ProductTypeID}`);
    
    console.log("Server Response:", response.data);
    if (response.status === 409 || response.data.success === false) {
      // 🚨 Restriction triggered - Show alert message
      alert(response.data.message || "Cannot delete this product due to restrictions.");
      return;
    }
    Swal.fire({
      icon: 'Success',
      title: 'Berhasil!',
      text: 'ProductType berhasil dihapus.',
      timer: 1100,  
      timerProgressBar: true,
      showConfirmButton: false,
    });
    // ✅ Close the modal if it's open
    setIsModalOpen(false);
    // ✅ Refresh the table by calling `onUpdate()`
    if (onUpdate) {
      onUpdate();
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // 🚨 Handle 409 Conflict error from backend
      alert(error.response.data.message || "Cannot delete! This product has related Product Type.");
    } else {
      alert("Failed to delete productType. Please try again.");
    }
  }
};

return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="text-red-500 hover:text-red-700">
        <Trash />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete ProductType</DialogTitle>
        <DialogDescription>
          Delete ProductType confirm. 
        </DialogDescription>
      </DialogHeader>
      <h1>Anda yakin ingin menghapus data ini?</h1>
      <DialogFooter>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
};

export function WarrantyServiceAdd () {
  // Form ProductType
   const [formDataWarratyService, setFormDataWarrantyService] = useState({
    Service_offerID: '',
    Service_description: '',	
    CTat_RTime: '',
    Price: '',
    Shipping_Fee: '',
    qty_ws: '',
    Tax: '',
    Total: '',
    })
    
    // Make Handler ProductType
    const handlerInputWarrantyService = (e) => {
      const { id, value } = e.target
      setFormDataWarrantyService(prevState => ({
        ...prevState,
        [id]:value
      }));
    };

    // Handler Submit
    const handlerWarrantyService = async () => {
      const { 
        Service_offerID, Service_description, CTat_RTime, Price,
        Shipping_Fee, qty_ws, Tax, Total
      } = formDataWarratyService;
    
      if (!Service_offerID || !Service_description || !CTat_RTime || !Price || !Shipping_Fee || !qty_ws || !Tax || !Total) {
        Swal.fire({
          title: "Incomplete Data",
          text: "Please fill in all fields before submitting.",
          icon: "warning",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }
    
      try {
        const response = await ApiCustomer.post("/api/warranty-services", formDataWarratyService);
        console.log("Success:", response.data);
    
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Warranty Service berhasil disimpan.',
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });

      } catch (err) {
        console.error("Error saving warranty service: ", err);
    
        Swal.fire({
          title: "Error!",
          text: "Failed to save warranty service. Please try again.",
          icon: "error",
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11 rounded-sm ml-2"> Warranty Service Add</Button>
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Warranty Service Information</DialogTitle>
          <DialogDescription>
            Add the warranty service Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">

        <Label>Service Offer ID</Label>
        <Input type="text" id="Service_offerID" className="p-2" value={formDataWarratyService.Service_offerID} onChange={handlerInputWarrantyService} />
   
        <Label htmlFor="Service_description">Service Description</Label>
        <Textarea
          id="Service_description"
          placeholder="Masukkan deskripsi servis"
          className="mt-1"
          value={formDataWarratyService.Service_description}
          onChange={handlerInputWarrantyService}
        />

        <Label>Customer TAT / Response Time</Label>
        <Input type="text" id="CTat_RTime" className="p-2" value={formDataWarratyService.CTat_RTime} onChange={handlerInputWarrantyService} />

        <Label>Price</Label>
        <Input type="text" id="Price" className="p-2" value={formDataWarratyService.Price} onChange={handlerInputWarrantyService} />
        
        <Label>Shipping Fee</Label>
        <Input type="text" id="Shipping_Fee" className="p-2" value={formDataWarratyService.Shipping_Fee} onChange={handlerInputWarrantyService} />

        <Label>Quantity</Label>
        <Input type="number" id="qty_ws" className="p-2" value={formDataWarratyService.qty_ws} onChange={handlerInputWarrantyService} />
         
        <Label>Tax</Label>
        <Input type="text" id="Tax" className="p-2" value={formDataWarratyService.Tax} onChange={handlerInputWarrantyService} />

        <Label>Total</Label>
        <Input type="text" id="Total" className="p-2" value={formDataWarratyService.Total} onChange={handlerInputWarrantyService} />
        </div>
        <DialogFooter>
          <Button onClick={handlerWarrantyService}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export function WarrantyServiceEdit({ Service_offerID, onUpdate }) {
  const [WarrantyService, setWarrantyService] = useState(null);
  const [Service_offerIDState, setService_offerIDState] = useState("");
  const [Service_description, setService_description] = useState("");
  const [CTat_RTime, setCTat_RTime] = useState("");
  const [Price, setPrice] = useState("");
  const [Shipping_Fee, setShipping_Fee] = useState("");
  const [qty_ws, setQty_ws] = useState("");
  const [Tax, setTax] = useState("");
  const [Total, setTotal] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchWarrantyService = async () => {
    if (!Service_offerID) return;
    try {
      const response = await ApiCustomer.get(`/api/warranty-services/${Service_offerID}`);
      const data = response.data.data;
      setWarrantyService(data);
      setService_offerIDState(data?.Service_offerID || "");
      setService_description(data?.Service_description || "");
      setCTat_RTime(data?.CTat_RTime || "");
      setPrice(data?.Price || "");
      setShipping_Fee(data?.Shipping_Fee || "");
      setQty_ws(data?.qty_ws || "");
      setTax(data?.Tax || "");
      setTotal(data?.Total || "");

    } catch (error) {
      console.error("Error fetching Warranty Service information:", error);
    }
  };

  useEffect(() => {
    if (Service_offerID && isOpen) {
      fetchWarrantyService();
    }
  }, [Service_offerID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setWarrantyService("");
      setService_description("");
      setCTat_RTime("");
      setPrice("");
      setShipping_Fee("");
      setQty_ws("");
      setTax("");
      setTotal("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!Service_offerIDState || !Service_description || !CTat_RTime || !Price || !Shipping_Fee || !qty_ws || !Tax || !Total) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
      });  
      return;
    }

    try {
      await ApiCustomer.patch(`/api/warranty-services/${Service_offerID}`, {
        Service_description : Service_description,	
        CTat_RTime : CTat_RTime,
        Price : parseFloat(Price),
        Shipping_Fee : parseFloat(Shipping_Fee),
        qty_ws : parseInt(qty_ws),
        Tax : parseFloat(Tax),
        Total : parseFloat(Total)
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating Warranty Service:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchWarrantyService(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Warranty Service Information</DialogTitle>
          <DialogDescription>
            Update the details of the Warranty Service Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">

<Label htmlFor="Service_description">Service Description</Label>
<Textarea
  id="Service_description"
  placeholder="Masukkan deskripsi servis"
  className="mt-1"
  value={Service_description} onChange={(e) => setService_description(e.target.value)}
/>

<Label>Customer TAT / Response Time</Label>
<Input type="text" id="CTat_RTime" className="p-2"  value={CTat_RTime} onChange={(e) => setCTat_RTime(e.target.value)} />

<Label>Price</Label>
<Input type="text" id="Price" className="p-2"  value={Price} onChange={(e) => setPrice(e.target.value)} />

<Label>Shipping Fee</Label>
<Input type="text" id="Shipping_Fee" className="p-2"  value={Shipping_Fee} onChange={(e) => setShipping_Fee(e.target.value)} />

<Label>Quantity</Label>
<Input type="number" id="qty_ws" className="p-2"  value={qty_ws} onChange={(e) => setQty_ws(e.target.value)} />
 
<Label>Tax</Label>
<Input type="text" id="Tax" className="p-2"  value={Tax} onChange={(e) => setTax(e.target.value)} />

<Label>Total</Label>
<Input type="text" id="Total" className="p-2"  value={Total} onChange={(e) => setTotal(e.target.value)}/>
</div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function WarrantyServiceDelete ({ Service_offerID, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
const handleDelete = async () => {
  try {
    const response = await ApiCustomer.delete(`/api/warranty-services/${Service_offerID}`);
    
    console.log("Server Response:", response.data);
    if (response.status === 409 || response.data.success === false) {
      // 🚨 Restriction triggered - Show alert message
      alert(response.data.message || "Cannot delete this Warranty Service due to restrictions.");
      return;
    }
    Swal.fire({
      icon: 'Success',
      title: 'Berhasil!',
      text: 'Warranty Service dihapus.',
      timer: 1000,  
      timerProgressBar: true,
      showConfirmButton: false,
    });
    // ✅ Close the modal if it's open
    setIsModalOpen(false);
    // ✅ Refresh the table by calling `onUpdate()`
    if (onUpdate) {
      onUpdate();
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // 🚨 Handle 409 Conflict error from backend
      alert(error.response.data.message || "Cannot delete! This Warranty has related Warranty Service.");
    } else {
      alert("Failed to delete Warranty Service. Please try again.");
    }
  }
};

return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="text-red-500 hover:text-red-700">
        <Trash />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Warranty Service</DialogTitle>
        <DialogDescription>
          Delete Warranty Service confirm. 
        </DialogDescription>
      </DialogHeader>
      <h1>Anda yakin ingin menghapus data ini?</h1>
      <DialogFooter>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
};



//? Service Case Tab List


// export function BtnModalsWorkOrder(){
//   const [workOpen, setWorkOpen] = useState(false);

//   const SC = [
//     {
//       ServiceOfferID : "DEPOT2",
//       SeriviceDescription : "DEPOT REPAIR - 2DAY",
//       CostumerTAT:"002",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//     {
//       ServiceOfferID : "DEPOT1",
//       SeriviceDescription : "DEPOT REPAIR",
//       CostumerTAT:"001",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//     {
//       ServiceOfferID : "APBPRP",
//       SeriviceDescription : "SRS/CREW 1WDW DEF RETURN",
//       CostumerTAT:"001",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//     {
//       ServiceOfferID : "APBPRP",
//       SeriviceDescription : "SRS/CREW 1WDW DEF RETURN",
//       CostumerTAT:"003",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//   ]

//   return (
//     <>
//     <Dialog open={workOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogDescription>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
//         </DialogHeader>
//         <DialogTitle>Service Catalog</DialogTitle>
//         <div className="flex">
//           <DialogTitle>Select From List of Service Options</DialogTitle>
//           <div className="">
//             <p>Product Number</p>
//             <p>Product Name</p>
//             <p>Serial Number</p>
//             <p>Warranty Status</p>
//             <p>Currency</p>
//           </div>
//         </div>
//         <Table>
//           <TableCaption>Warrenty Services</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Select</TableHead>
//               <TableHead>Service OfferID</TableHead>
//               <TableHead>Service Description</TableHead>
//               <TableHead>Costumer TAT/ Response TIme</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Tax</TableHead>
//               <TableHead>Total</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//               {SC.map((service) => {
//             <TableRow>
//               <TableCell><Checkbox></Checkbox></TableCell>
//               <TableCell>{service.ServiceOfferID}</TableCell>
//               <TableCell>{service.SeriviceDescription}</TableCell>
//               <TableCell>{service.CostumerTAT}</TableCell>
//               <TableCell>{service.Price}</TableCell>
//               <TableCell>{service.Tax}</TableCell>
//               <TableCell>{service.Total}</TableCell>
//             </TableRow>
//               })}
//           </TableBody>
//         </Table>
//         <DialogFooter>
//               <button>Cancel</button>
//               <button>Next</button>
//         </DialogFooter>
//       </DialogContent>
//       <DialogContent>
//         <DialogHeader>
//           <DialogDescription>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
//         </DialogHeader>
//         <DialogTitle>Service Catalog</DialogTitle>
//         <div className="flex">
//           <DialogTitle>Select From List of Service Options</DialogTitle>
//           <div className="">
//             <p>Product Number</p>
//             <p>Product Name</p>
//             <p>Serial Number</p>
//             <p>Warranty Status</p>
//             <p>Currency</p>
//           </div>
//         </div>
//         <Table>
//           <TableCaption>Warrenty Services</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Select</TableHead>
//               <TableHead>Service OfferID</TableHead>
//               <TableHead>Service Description</TableHead>
//               <TableHead>Costumer TAT/ Response TIme</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Tax</TableHead>
//               <TableHead>Total</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//               {SC.map((service) => {
//             <TableRow>
//               <TableCell><Checkbox></Checkbox></TableCell>
//               <TableCell>{service.ServiceOfferID}</TableCell>
//               <TableCell>{service.SeriviceDescription}</TableCell>
//               <TableCell>{service.CostumerTAT}</TableCell>
//               <TableCell>{service.Price}</TableCell>
//               <TableCell>{service.Tax}</TableCell>
//               <TableCell>{service.Total}</TableCell>
//             </TableRow>
//               })}
//           </TableBody>
//         </Table>
//         <DialogFooter>
//           <button>Cancel</button>
//           <button>Next</button>
//         </DialogFooter>
//       </DialogContent>
//       <DialogContent>
//         <DialogHeader>
//           <DialogDescription>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
//         </DialogHeader>
//         <DialogTitle>Service Catalog</DialogTitle>
//         <div className="flex">
//           <DialogTitle>Select From List of Service Options</DialogTitle>
//           <div className="">
//             <p>Product Number</p>
//             <p>Product Name</p>
//             <p>Serial Number</p>
//             <p>Warranty Status</p>
//             <p>Currency</p>
//           </div>
//         </div>
//         <Table>
//           <TableCaption>Warrenty Services</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Select</TableHead>
//               <TableHead>Service OfferID</TableHead>
//               <TableHead>Service Description</TableHead>
//               <TableHead>Costumer TAT/ Response TIme</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Tax</TableHead>
//               <TableHead>Total</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//               {SC.map((service) => {
//             <TableRow>
//               <TableCell><Checkbox></Checkbox></TableCell>
//               <TableCell>{service.ServiceOfferID}</TableCell>
//               <TableCell>{service.SeriviceDescription}</TableCell>
//               <TableCell>{service.CostumerTAT}</TableCell>
//               <TableCell>{service.Price}</TableCell>
//               <TableCell>{service.Tax}</TableCell>
//               <TableCell>{service.Total}</TableCell>
//             </TableRow>
//               })}
//           </TableBody>
//         </Table>
//         <DialogFooter>
//           <button>Cancel</button>
//           <button>Cancel</button>
//           <button>AddPart</button> // open another dialogs modals
//           <button>Create Order</button> //submit
//         </DialogFooter>
//       </DialogContent>
      
//   </Dialog>
//     </>
//   )
// }

export function BtnModalsWorkOrder({ open, setOpen, caseDetails }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentStep, setCurrentStep] = useState(1);
  const [assetForWorkOrderCreation, setAssetForWorkOrderCreation] = useState([]);
  const [modalPart, setModalPart] = useState(false);
  //product information
  const fetchDataAssets = async () => {
    try {
      const response = await ApiCustomer.get(`/api/asset-information/${caseDetails.AssetID}`)
      // console.log("Response fetch Asset Modal Work Order :",response)
      return response.data.data
    }catch(e){
      console.error("error fetching Asset: ", e)
    }
  }
  //waranty
  //warranty state
  const [warrantyOffer, setWarrantyOffer] = useState([])
  //fetching data function
  const fetchDataServiceOffer = async () => {
    setLoading(true);
    setError(null);
    try{
      const response = await ApiCustomer.get(`/api/service-log/warranty-services `)
      return response.data.data;
    }catch(e){
      setError("Failed to load Warranty Service")
      console.error("error fetching Service Offer: ", e)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDataServiceOffer().then((data) => {
      if (data) setWarrantyOffer(data);
    });
    fetchDataAssets().then((data) => {
      if (data) setAssetForWorkOrderCreation(data);
    });
    fetchDataPartCatalog();
  }, [])
  // fetchDataServiceOffer().then((data) => {
  //   if (data) setWarrantyOffer(data);
  // });

  const [selected, setSelected] = useState("DepotRepair"); 

  //handles Warranty Service
  const [selectedWarrantyServices, setSelectedWarrantyServices] = useState([]);
  const handlerWarrantyServices = (service, checked) => {
    if (checked) {
      setSelectedWarrantyServices((prev) => [...prev, service])
    }else{
      setSelectedWarrantyServices((prev) => 
        prev.filter((item) => item.Service_offerID !==service.Service_offerID)
      )
    }
  }

  useEffect(() => {
    console.log("Selected Services:", selectedWarrantyServices);
  }, [selectedWarrantyServices]);
  


  //part
  //part state
  const [partCatalog, setPartCatalog] = useState([])
  //fetch data part catalog
  const fetchDataPartCatalog = async () => {
    try{
      const response = await ApiCustomer.get(`/api/service-log/parts-catalog`)
      setPartCatalog(response.data.data)
      return response.data.data
    }catch(e){

    }
  }

  //handler part
  const [selectedPartCatalog, setSelectedPartCatalog] = useState([])
  const handlerPartCatalog = (part, checked) => {
    if(checked){
      setSelectedPartCatalog((prev) => [...prev, part])
    }else{
      setSelectedPartCatalog((prev) => 
        prev.filter((item) => item.PartNumber !== part.PartNumber)
      )
    }
  }
  useEffect(() => {
    console.log("Selected Parts:", selectedPartCatalog);
    console.log("Selected Warranty:", selectedWarrantyServices);
  }, [selectedPartCatalog]);
  

  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return (
          <DialogContent className="sm:max-w-[fit] sm:min-h-[fit] flex flex-col justify-center gap-0 p-0 bg-white [&>button]:hidden" >
            <DialogHeader>
              <div className="flex items-end justify-end ">
                <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button>
                <DialogClose asChild>
                <Button type="button" variant="secondary" className={'hover:bg-gray-200 active:bg-gray-700'}>
                  <XIcon/>
                </Button>
                </DialogClose>
              </div>
              <DialogDescription className={'bg-red-200 p-3 font-bold '}>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
              <DialogTitle className={'text-blue-600 text-2xl'}>Service Catalog</DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 my-2 justify-between p-2">
              <DialogTitle>Step 1: Select From List of Service Options</DialogTitle>
              <div className="bg-gray-300 grid grid-cols-2 gap-x-10 p-2">
                
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
  
            {/* Table */}
            <Table>
              <TableCaption className={'caption-top bg-blue-500 p-2 text-2xl text-left text-black'}>Warranty Services</TableCaption>
              <TableHeader>
                <TableRow className={'bg-gray-300'}>
                  <TableHead className={'font-black text-black'}>Select</TableHead>
                  <TableHead className={'font-black text-black'}>Service OfferID</TableHead>
                  <TableHead className={'font-black text-black'}>Service Description</TableHead>
                  <TableHead className={'font-black text-black'}>Customer TAT</TableHead>
                  <TableHead className={'font-black text-black'}>Price</TableHead>
                  <TableHead className={'font-black text-black'}>Tax</TableHead>
                  <TableHead className={'font-black text-black'}>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warrantyOffer.map((service, index) => {
                  const isChecked = selectedWarrantyServices.some((item) => item.Service_offerID === service.Service_offerID)
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox 
                          checked={isChecked}
                          onCheckedChange={(checked) => handlerWarrantyServices(service, checked)}
                        />
                      </TableCell>
                      <TableCell>{service.Service_offerID}</TableCell>
                      <TableCell>{service.Service_description}</TableCell>
                      <TableCell>{service.CTat_RTime}</TableCell>
                      <TableCell>{service.Price}</TableCell>
                      <TableCell>{service.Tax}</TableCell>
                      <TableCell>{service.Total}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
  
            <DialogFooter className={'p-4'}>
              <Button variant={'search'} className="" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant={'search'} className="" onClick={() => setCurrentStep(2)}>Next</Button>
            </DialogFooter>
          </DialogContent>
        );
  
      case 2:
        return (
          <DialogContent className="sm:max-w-[fit] sm:min-h-[fit] flex flex-col  gap-0 p-0 bg-white [&>button]:hidden scale-95">
            <DialogHeader className={'gap-0'}>
              <div className="flex items-end justify-end">
                <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className={'hover:bg-gray-200 active:bg-gray-700'}>
                  <XIcon/>
                  </Button>
                </DialogClose>
              </div>
              <DialogTitle className={'text-blue-600 text-2xl'}>Service Catalog</DialogTitle>
              <DialogDescription>Select parts required for the repair.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-between items-start p-2">
              <div className="bg-gray-300 grid grid-cols-2 gap-x-10 p-2">
                <p>Service OfferID</p><p>: {selectedWarrantyServices[0].Service_offerID}</p>
                <p>Service Description</p><p>: {selectedWarrantyServices[0].Service_description}</p>
              </div>
              <div className="flex items-center space-x-2 scale-200 gap-2">
                <Label htmlFor="orderability">Orderability</Label>
                <Switch id="orderability" />
              </div>
              <div className="bg-gray-300 grid grid-cols-2 gap-x-10 p-2">
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
            {/* Your Custom Layout and Table for Step 2 */}

            <Tabs
            defaultValue="parts"
            >
              <TabsList className={'py-5 px-0 bg-white'}>
                <TabsTrigger variant={'fullsize'} value="parts" className={'cursor-pointer '}>Parts</TabsTrigger>
                <TabsTrigger variant={'fullsize'} value="snr" className={'cursor-pointer  text-blue-500'}>SNR</TabsTrigger>
              </TabsList>
              <TabsContent value="parts">
              <Table>
              <TableHeader>
                <TableRow className={'bg-gray-300'}>
                  <TableHead className={'font-black text-black'}>Select</TableHead>
                  <TableHead className={'font-black text-black p-2'}>
                    Parts #
                    <span className="flex items-center"><Input className={'bg-white'}/><XIcon/></span>
                    </TableHead>
                  <TableHead className={'font-black text-black'}>
                    Keyword
                    <span className="flex items-center"><Input className={'bg-white'}/><XIcon/></span>
                    </TableHead>
                  <TableHead className={'font-black text-black'}>
                    Part Description
                    <span className="flex items-center"><Input className={'bg-white'}/><XIcon/></span>
                  </TableHead>
                  <TableHead className={'font-black text-black'}>Orderability</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Restriction Reason</TableHead>
                  <TableHead className={'font-black text-black'}>CRS</TableHead>
                  <TableHead className={'font-black text-black'}>ROHS</TableHead>
                  <TableHead className={'font-black text-black'}>Retrunable</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Hard roll</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Dangerous Goods</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Lithium Battery</TableHead>
                  <TableHead className={'font-black text-black'}>Oversize</TableHead>
                  <TableHead className={'font-black text-black'}>Heavy</TableHead>
                  <TableHead className={'font-black text-black'}>Price</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Friegh Price</TableHead>
                  <TableHead className={'font-black text-black'}>Tax</TableHead>
                  <TableHead className={'font-black text-black'}>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partCatalog.map((part, index) => {
                  const isChecked = selectedPartCatalog.some((item) => item.PartNumber === part.PartNumber)
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox 
                          checked={isChecked}
                          onCheckedChange={(checked) => handlerPartCatalog(part, checked)}
                        />
                      </TableCell>
                      <TableCell>{part.PartNumber}</TableCell>
                      <TableCell>{part.Keyword}</TableCell>
                      <TableCell>{part.PartDescription}</TableCell>
                      <TableCell>{part.Orderability ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{part.ResistrictionReason}</TableCell>
                      <TableCell>{part.Csr ? 'Y' : 'N'}</TableCell>
                      <TableCell>{part.Rohs}</TableCell>
                      <TableCell>{part.Returnable ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Hardrolls}</TableCell>
                      <TableCell>{part.Dangerousgoods ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Lithiumbattry ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Oversize ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Heavy ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Price}</TableCell>
                      <TableCell>{part.Freightprice}</TableCell>
                      <TableCell>{part.Tax}</TableCell>
                      <TableCell>{part.Total}</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                    <TableCell colSpan={'100%'}>
                      <Pagination className={'flex justify-start'}>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>
                              2
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
              </TabsContent>
              <TabsContent value="snr">
                <p>tes</p>
              </TabsContent>
            </Tabs>
  
            <DialogFooter className={'p-4'}>
              <Button variant={'search'} className=""  onClick={() => setCurrentStep(1)}>Previous</Button>
              <Button variant={'search'} className=""  onClick={() => setCurrentStep(3)}>Next</Button>
            </DialogFooter>
          </DialogContent>
        );
  
      case 3:
        return (
          <DialogContent className="sm:max-w-[fit] sm:min-h-[fit] p-0 bg-white [&>button]:hidden ">
            <DialogHeader>
              <div className="flex items-end justify-end">
                <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className={'hover:bg-gray-200 active:bg-gray-700'}>
                  <XIcon/>
                  </Button>
                </DialogClose>
              </div>
              <DialogTitle className={'text-blue-600 text-2xl indent-5'}>Service Catalog</DialogTitle>
              <DialogDescription>SELECT PARTS REQUIRED FOR THE REPAIR.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 my-2 justify-end p-2">
              <div className="bg-gray-300 grid grid-cols-2 gap-x-10 p-2">
                <p>Product Number</p><p>: </p>
                <p>Product Name</p><p>: </p>
                <p>Serial Number</p><p>: </p>
                <p>Warranty Status</p><p>: </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className={'bg-blue-400'}>
                  <TableHead className={'font-bold text-black'}>Service OfferID</TableHead>
                  <TableHead className={'font-bold text-black'}>Description</TableHead>
                  <TableHead className={'font-bold text-black'}>Unit Price</TableHead>
                  <TableHead className={'font-bold text-black'}>Shipping Fee</TableHead>
                  <TableHead className={'font-bold text-black'}>Qty</TableHead>
                  <TableHead className={'font-bold text-black'}>Tax</TableHead>
                  <TableHead className={'font-bold text-black'}>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                </TableRow>
              </TableBody>
              <TableHeader>
                <TableRow className={'bg-blue-400'}>
                  <TableHead className={'font-bold text-black'}>Part #</TableHead>
                  <TableHead className={'font-bold text-black'}>Description</TableHead>
                  <TableHead className={'font-bold text-black'}>Unit Price</TableHead>
                  <TableHead className={'font-bold text-black'}>Shipping Fee</TableHead>
                  <TableHead className={'font-bold text-black'}>Qty</TableHead>
                  <TableHead className={'font-bold text-black'}>Tax</TableHead>
                  <TableHead className={'font-bold text-black'}>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell colSpan={2}>Sub Total</TableCell>
                  <TableCell>--</TableCell>
                </TableRow>
                <TableRow className={'bg-blue-400'}>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>--</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
  
            <DialogFooter className={' sm:justify-start p-2 items-center gap-10'}>
              <Button variant={'search'} className="" onClick={() => setCurrentStep(2)}>Previous</Button>
              <Button variant={'search'} className="" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant={'search'} className="" onClick={() => setModalPart(true)}>Add Part</Button>
              <Button variant={'search'} className="" onClick={() => alert('Creating order...')}>Create Order</Button>
              <Label htmlFor="incident" className={'font-bold '}>Incident Type</Label>
              <Select onChange={setSelected} defaultValue="DepotRepair">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="DepotRepair">DepotRepair</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </DialogFooter>
          </DialogContent>
        );
  
      default:
        return null;
    }
  }
  
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen} >
      {renderStepContent()}
    <BtnModalsPartAdd open2={modalPart} setOpen2={setModalPart}/>
    </Dialog>
    {/* <Button onClick={() => setWorkOpen(true)}>Open Work Order</Button> */}
  </>
  );
}

export function BtnModalsPartAdd({open2, setOpen2}){
  return(
    <>
    <Dialog open={open2} onOpenChange={setOpen2}>
      <DialogContent className={' sm:min-w-[58vw] sm:min-h-[fit-content] flex flex-col justify-center'}>
        <DialogHeader className={''}>
          <DialogTitle className={'text-blue-600 text-2xl '}>Add Part</DialogTitle>
        </DialogHeader>
          <div className="flex items-center justify-between sm:max-w-full">
            <span className="flex gap-2 items-center">
              <DialogDescription className={'whitespace-nowrap'}>Part Number</DialogDescription>
              <Input className={'ring-1 min-w-[10em] ring-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500'}></Input>
              <Button variant={'search'}>Search</Button>
            </span>
            <div className="bg-gray-300 flex gap-x-10 p-2 flex-1 max-w-[10em]">
                <p>Currency</p><p className="whitespace-nowrap">: </p>
            </div>
          </div>
          <div className="overflow-x-auto max-w-full">
            <Table className={' sm:min-w-[1000px]'}>
              <TableHeader>
                <TableRow>
                  <TableHead className={'text-black font-bold'}>Select</TableHead>
                  <TableHead className={'text-black font-bold'}>Part #</TableHead>
                  <TableHead className={'text-black font-bold'}>Keyword</TableHead>
                  <TableHead className={'text-black font-bold'}>Part Description</TableHead>
                  <TableHead className={'font-black text-black'}>Orderability</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Restriction Reason</TableHead>
                  <TableHead className={'font-black text-black'}>CRS</TableHead>
                  <TableHead className={'font-black text-black'}>ROHS</TableHead>
                  <TableHead className={'font-black text-black'}>Retrunable</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Hard roll</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Dangerous Goods</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Lithium Battery</TableHead>
                  <TableHead className={'font-black text-black'}>Oversize</TableHead>
                  <TableHead className={'font-black text-black'}>Heavy</TableHead>
                  <TableHead className={'font-black text-black'}>Price</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Friegh Price</TableHead>
                  <TableHead className={'font-black text-black'}>Tax</TableHead>
                  <TableHead className={'font-black text-black'}>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                    <TableCell className={'flex'}><Checkbox></Checkbox></TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                    <TableCell>---</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={'100%'}>
                      <Pagination className={'flex justify-start'}>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>
                              2
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter className={'sm:justify-start'}>
            <Button variant={'search'}>Add Part</Button>
            <Button variant={'search'}>Clear</Button>
            <Button variant={'search'}>Cancel</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}