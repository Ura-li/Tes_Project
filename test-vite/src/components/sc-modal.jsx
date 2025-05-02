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
        timer: 1500,
        showConfirmButton: false,
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
export function BtnModalAsset({
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
  
    // Tampilkan loading menggunakan SweetAlert2
    Swal.fire({
      title: 'Memperbarui asset...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const response = await ApiCustomer.patch(`/api/asset-information/kepemilikan/${selectedAssetForCreatingAsset.AssetID}`, {
        contactID,
        siteAccountID
      });
  
      if (response.status === 200) {
        const updatedAssets = await fetchAssetTable(siteAccountID, contactID);
        setSelectedAsset(updatedAssets);
        setIsOpen(false);
  
        // Tutup loading dan tampilkan alert sukses
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Asset berhasil diperbarui!',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      // Tutup loading dan tampilkan alert error
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat memperbarui asset.',
        timer: 2000,
        showConfirmButton: false
      });
      console.error("Terjadi kesalahan : ", error);
    }
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
  const [whatsappNo, setWhatsappNo] = useState("");
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
      setWhatsappNo(data?.WhatsappNo || "");
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
      setWhatsappNo("");
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
        WhatsappNo: whatsappNo,
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
          <Input value={whatsappNo} onChange={(e) => setWhatsappNo(e.target.value)} placeholder="Whatsapp No *" />
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

export function MaterialOrderEdit({ MOID, onUpdate }) {
  const [MaterialOrder, setMaterialOrder] = useState(null);
  const [WOID,  setWOID] = useState("");
  const [OrderNumber,  setOrderNumber ] = useState("");
  const [OrderStatus, setOrderStatus] = useState("");
  const [OrderType, setOrderType] = useState("");
  const [CreatedOn, setCreatedOn] = useState("");
  const [SalesOrderNumber, setSalesOrderNumber] = useState("");
  const [RMANumber, setRMANumber] = useState("");
  const [ReadyForClosureDate,  setReadyForClosureDate] = useState("");
  const [Owner,  setOwner] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchMaterialOrder = async () => {
    if (!MOID) return;
    try {
      const response = await ApiCustomer.get(`/api/mo-detaill/${MOID}`);
      const data = response.data.data;
  
      // Fungsi bantu untuk konversi ke yyyy-MM-dd
      const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      };
  
      setMaterialOrder(data);
      setWOID(data?.WOID || "");
      setOrderNumber(data?.OrderNumber || "");
      setOrderStatus(data?.OrderStatus || "");
      setOrderType(data?.OrderType || "");
      setCreatedOn(formatDate(data?.CreatedOn));
      setSalesOrderNumber(data?.SalesOrderNumber || "");
      setRMANumber(data?.RMANumber || "");
      setReadyForClosureDate(formatDate(data?.ReadyForClosureDate));
      setOwner(data?.Owner || "");
  
    } catch (error) {
      console.error("Error fetching Material Order information:", error);
    }
  };
  

  useEffect(() => {
    if (MOID && isOpen) {
      fetchMaterialOrder();
    }
  }, [MOID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setMaterialOrder("");
      setWOID("");
      setOrderNumber("");
      setOrderStatus("");
      setOrderType("");
      setCreatedOn("");
      setSalesOrderNumber("");
      setRMANumber("");
      setReadyForClosureDate("");
      setOwner("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!WOID || !OrderNumber || !OrderStatus || !OrderType || !CreatedOn || !SalesOrderNumber || !RMANumber || !ReadyForClosureDate || !Owner) {
      Swal.fire({
        title: "Incomplete Data",
        text:  "Please fill in all fields before submitting.",
        icon:  "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
      });  
      return;
    }

    try {
      await ApiCustomer.patch(`/api/mo-detaill/${MOID}`, {
        WOID : WOID,
        OrderNumber : OrderNumber, 
        OrderStatus : OrderStatus,
        OrderType   : OrderType,
        CreatedOn   : CreatedOn,
        SalesOrderNumber : SalesOrderNumber,
        RMANumber : RMANumber,
        ReadyForClosureDate : ReadyForClosureDate,
        Owner : Owner,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating Material Order:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchMaterialOrder(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Material Order Information</DialogTitle>
          <DialogDescription>
            Update the details of the Material Order Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">


<Label>Order Number</Label>
<Input type="text" id="Order Number" className="p-2"  value={OrderNumber} onChange={(e) => setOrderNumber(e.target.value)} />

<Label>Order Status</Label>
<Input type="text" id="Order Status" className="p-2"  value={OrderStatus} onChange={(e) => setOrderStatus(e.target.value)} />

<Label>Order Type</Label>
<Input type="text" id="Order Type" className="p-2"  value={OrderType} onChange={(e) => setOrderType(e.target.value)} />
 
<Label>Created On</Label>
<Input type="date" id="Created On" className="p-2"  value={CreatedOn} onChange={(e) => setCreatedOn(e.target.value)} />

<Label>Sales Order Number</Label>
<Input type="text" id="Sales Order Number" className="p-2"  value={SalesOrderNumber} onChange={(e) => setSalesOrderNumber(e.target.value)}/>

<Label>RMANumber</Label>
<Input type="text" id="RMANumber" className="p-2"  value={RMANumber} onChange={(e) => setRMANumber(e.target.value)}/>

<Label>Ready For Closure Date</Label>
<Input type="date" id="Ready For Closure Date" className="p-2"  value={ReadyForClosureDate} onChange={(e) => setReadyForClosureDate(e.target.value)}/>

<Label>Owner</Label>
<Input type="text" id="Owner" className="p-2"  value={Owner} onChange={(e) => setOwner(e.target.value)}/>
</div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function MaterialOrderDelete ({ MOID, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
const handleDelete = async () => {
  try {
    const response = await ApiCustomer.delete(`/api/mo-detaill/${MOID}`);
    
    console.log("Server Response:", response.data);
    if (response.status === 409 || response.data.success === false) {
      // 🚨 Restriction triggered - Show alert message
      alert(response.data.message || "Cannot delete this Material Order due to restrictions.");
      return;
    }
    Swal.fire({
      icon: 'Success',
      title: 'Berhasil!',
      text: 'Material Order dihapus.',
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
      alert("Failed to delete Material Order. Please try again.");
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
        <DialogTitle>Delete Material Order</DialogTitle>
        <DialogDescription>
          Delete Material Order confirm. 
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

export function WorkOrderEdit({ WOID, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const defaultFormData = {
    WorkOrderType: "",
    Priority: "",
    SystemStatus: "",
    SubStatus: "",
    PreferredDay: "",
    PreferredTime: "",
    ShipmentCountry: "",
    ShipmentState: "",
    CreatedOn: "",
    Owner: "",
    SLAJeopardy: "",
    DueDateCustomer: "",
    CoverageWindow: "",
    Response: "",
    OTCCode: "",
    RequestedDateTimeCustomer: "",
    GuaranteedFixTimeCustomer: "",
    EarlyStartDateTimeCustomer: "",
    LatestStartDateTimeCustomer: "",
    SLAReschedule: "",
    ActiveScheduleDate: "",
    SLAErrorDescription: "",
    CasePriorityIndex: "",
    PartnerStatus: "",
    WorkOrderDescription: "",
    PartnerNotes: "",
    IncomingChannel: "",
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const fetchWorkOrder = async () => {
    if (!WOID) return;
    try {
      const response = await ApiCustomer.get(`/api/work-order/${WOID}`);
      const data = response.data.data || {};

      setFormData({
        WorkOrderType: data.WorkOrderType || "",
        Priority: data.Priority || "",
        SystemStatus: data.SystemStatus || "",
        SubStatus: data.SubStatus || "",
        PreferredDay: formatDate(data.PreferredDay),
        PreferredTime: formatDate(data.PreferredTime),
        ShipmentCountry: data.ShipmentCountry || "",
        ShipmentState: data.ShipmentState || "",
        CreatedOn: formatDate(data.CreatedOn),
        Owner: data.Owner || "",
        SLAJeopardy: data.SLAJeopardy || "",
        DueDateCustomer: formatDate(data.DueDateCustomer),
        CoverageWindow: data.CoverageWindow || "",
        Response: data.Response || "",
        OTCCode: data.OTCCode || "",
        RequestedDateTimeCustomer: formatDate(data.RequestedDateTimeCustomer),
        GuaranteedFixTimeCustomer: formatDate(data.GuaranteedFixTimeCustomer),
        EarlyStartDateTimeCustomer: formatDate(data.EarlyStartDateTimeCustomer),
        LatestStartDateTimeCustomer: formatDate(data.LatestStartDateTimeCustomer),
        SLAReschedule: data.SLAReschedule || "",
        ActiveScheduleDate: formatDate(data.ActiveScheduleDate),
        SLAErrorDescription: data.SLAErrorDescription || "",
        CasePriorityIndex: data.CasePriorityIndex || "",
        PartnerStatus: data.PartnerStatus || "",
        WorkOrderDescription: data.WorkOrderDescription || "",
        PartnerNotes: data.PartnerNotes || "",
        IncomingChannel: data.IncomingChannel || "",
      });
    } catch (error) {
      console.error("Error fetching Work Order information:", error);
    }
  };

  const resetForm = () => setFormData(defaultFormData);

  useEffect(() => {
    if (WOID && isOpen) {
      fetchWorkOrder();
    }
  }, [WOID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target ? e.target.value : e,
    }));
  };

  const handleUpdate = async () => {
    const { WorkOrderType, Priority, SystemStatus } = formData;
  
    if (!WorkOrderType || !Priority || !SystemStatus) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all required fields.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
  
    try {
      await ApiCustomer.patch(`/api/work-order/${WOID}`, formData);
  
      Swal.fire({
        title: "Success!",
        text: "Data berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
  
      onUpdate();      // Refresh data
      setIsOpen(false); // Tutup modal atau form
    } catch (error) {
      console.error("Error updating Work Order:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data!",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchWorkOrder(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Work Order Information</DialogTitle>
          <DialogDescription>
            Update the details of the Work Order. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {[
            { label: "Work Order Type", id: "WorkOrderType", type: "text" },
            { label: "Priority", id: "Priority", type: "select", options: ["High", "Medium", "Low"] },
            { label: "System Status", id: "SystemStatus", type: "select", options: ["Open", "In Progress", "Closed"] },
            { label: "Sub Status", id: "SubStatus", type: "select", options: ["Pending", "Resolved", "Escalated"] },
            { label: "Preferred Day", id: "PreferredDay", type: "date" },
            { label: "Preferred Time", id: "PreferredTime", type: "datetime-local" },
            { label: "Shipment Country", id: "ShipmentCountry", type: "select", options: ["USA", "Canada", "Indonesia", "UK", "Germany", "France", "Japan", "China", "India", "Australia", "Brazil"] },
            { label: "Shipment State", id: "ShipmentState", type: "select", options: ["California", "Texas", "New York", "Florida"] },
            { label: "Created On", id: "CreatedOn", type: "date" },
            { label: "Owner", id: "Owner", type: "text" },
            { label: "SLA Jeopardy", id: "SLAJeopardy", type: "select", options: ["Yes", "No"] },
            { label: "Due Date Customer", id: "DueDateCustomer", type: "date" },
            { label: "Coverage Window", id: "CoverageWindow", type: "text" },
            { label: "Response", id: "Response", type: "text" },
            { label: "OTC Code", id: "OTCCode", type: "text" },
            { label: "Requested Date Time Customer", id: "RequestedDateTimeCustomer", type: "date" },
            { label: "Guaranteed Fix Time Customer", id: "GuaranteedFixTimeCustomer", type: "date" },
            { label: "Early Start Date Time Customer", id: "EarlyStartDateTimeCustomer", type: "date" },
            { label: "Latest Start Date Time Customer", id: "LatestStartDateTimeCustomer", type: "date" },
            { label: "SLA Reschedule", id: "SLAReschedule", type: "text" },
            { label: "Active Schedule Date", id: "ActiveScheduleDate", type: "date" },
            { label: "SLA Error Description", id: "SLAErrorDescription", type: "text" },
            { label: "Case Priority Index", id: "CasePriorityIndex", type: "text" },
            { label: "Partner Status", id: "PartnerStatus", type: "text" },
            { label: "Work Order Description", id: "WorkOrderDescription", type: "textarea" },
            { label: "Partner Notes", id: "PartnerNotes", type: "textarea" },
            { label: "Incoming Channel", id: "IncomingChannel", type: "select", options: ["Email", "Phone", "Chat"] },
          ].map(({ label, id, type, options }) => (
            <div key={id}>
              <Label>{label}</Label>
              {type === "select" ? (
                <Select onValueChange={handleChange(id)} value={formData[id]}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "textarea" ? (
                <Textarea id={id} className="p-2" value={formData[id]} onChange={handleChange(id)} />
              ) : (
                <Input type={type} id={id} className="p-2" value={formData[id]} onChange={handleChange(id)} />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkOrderDelete ({ WOID, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
const handleDelete = async () => {
  try {
    const response = await ApiCustomer.delete(`/api/work-order/${WOID}`);
    
    console.log("Server Response:", response.data);
    if (response.status === 409 || response.data.success === false) {
      // 🚨 Restriction triggered - Show alert message
      alert(response.data.message || "Cannot delete this Work Order due to restrictions.");
      return;
    }
    Swal.fire({
      icon: 'Success',
      title: 'Berhasil!',
      text: 'Work Order dihapus.',
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
      alert(error.response.data.message || "Cannot delete! This Waork has related Work Order.");
    } else {
      alert("Failed to delete Work Order. Please try again.");
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
        <DialogTitle>Delete Work Order</DialogTitle>
        <DialogDescription>
          Delete Work Order confirm. 
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

export function UserEdit({ IDUser, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const defaultFormData = {
    Email: "",
    Username: "",
    Password: "",
    Name: "",
    Role: "",
    ProfilePhoto: "",
  };

  const fetchUser = async () => {
    if (!IDUser) return;
    try {
      const response = await ApiCustomer.get(`/api/user/${IDUser}`);
      const data = response.data.data || {};

      setFormData({
        Email: data.Email || "",
        Username: data.Username || "",
        Password: "",
        Name: data.Name || "",
        Role: data.Role || "",
        ProfilePhoto: data.ProfilePhoto || "",
      });

      setPreviewPhoto(data.ProfilePhoto || null);
    } catch (error) {
      console.error("Error fetching User information:", error);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setPreviewPhoto(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    if (IDUser && isOpen) fetchUser();
  }, [IDUser, isOpen]);

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) return formData.ProfilePhoto;

    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFile);

    try {
      const res = await ApiCustomer.post("/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url; // Asumsikan API mengembalikan URL foto
    } catch (error) {
      console.error("Image upload failed:", error);
      return formData.ProfilePhoto; // fallback
    }
  };

  const handleUpdate = async () => {
    const { Email, Username, Password, Name, Role } = formData;

    if (!Email || !Username || !Name) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all required fields.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const uploadedPhotoURL = await uploadImage();

      const updatedData = {
        Email,
        Username,
        Name,
        Role,
        ProfilePhoto: uploadedPhotoURL,
      };

      if (Password) updatedData.Password = Password;

      await ApiCustomer.patch(`/api/user/${IDUser}`, updatedData);

      Swal.fire({
        title: "Success!",
        text: "Data berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data!",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchUser(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
          <DialogDescription>
            Update the details of the user. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Email*</Label>
            <Input type="email" value={formData.Email} onChange={handleChange("Email")} />
          </div>
          <div>
            <Label>Username*</Label>
            <Input type="text" value={formData.Username} onChange={handleChange("Username")} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={formData.Password} onChange={handleChange("Password")} placeholder="Kosongkan jika tidak ingin mengubah" />
          </div>
          <div>
            <Label>Name*</Label>
            <Input type="text" value={formData.Name} onChange={handleChange("Name")} />
          </div>
          <div>
            <Label>Role</Label>
            <Input type="text" value={formData.Role} onChange={handleChange("Role")} />
          </div>

          <div>
            <Label>Profile Photo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {previewPhoto && (
              <img src={previewPhoto} alt="Preview" className="mt-2 h-24 w-24 rounded-md object-cover" />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserDelete ({ IDUser, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
const handleDelete = async () => {
  try {
    const response = await ApiCustomer.delete(`/api/user/${IDUser}`);
    
    console.log("Server Response:", response.data);
    if (response.status === 409 || response.data.success === false) {
      // 🚨 Restriction triggered - Show alert message
      alert(response.data.message || "Cannot delete this User due to restrictions.");
      return;
    }
    Swal.fire({
      icon: 'Success',
      title: 'Berhasil!',
      text: 'User dihapus.',
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
      alert(error.response.data.message || "Cannot delete! This User has related User.");
    } else {
      alert("Failed to delete User. Please try again.");
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          Delete User confirm. 
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

export function PartEdit({ PartNumber, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const defaultFormData = {
    PartNumber: "",
    Keyword: "",
    PartDescription: "",
    Orderability: "",
    RestrictionReason: "",
    CSR_Flag: false,
    ROHS_Flag: false,
    Returnable_Flag: false,
    HardRoll_Flag: false,
    DangerousGoods_Flag: false,
    LithiumBattery_Flag: false,
    Oversize_Flag: false,
    Heavy_Flag: false,
    Price: "",
    Total: "",
    Shipping_Fee: "",
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const fetchPart = async () => {
    if (!PartNumber) return;
    try {
      const response = await ApiCustomer.get(`/api/service-log/parts-catalog/${PartNumber}`);
      const data = response.data.data || {};

      setFormData({
        PartNumber: data.PartNumber || "",
        Keyword: data.Keyword || "",
        PartDescription: data.PartDescription || "",
        Orderability: data.Orderability || "",
        RestrictionReason: data.RestrictionReason || "",
        CSR_Flag: data.CSR_Flag || false,
        ROHS_Flag: data.ROHS_Flag || false,
        Returnable_Flag: data.Returnable_Flag || false,
        HardRoll_Flag: data.HardRoll_Flag || false,
        DangerousGoods_Flag: data.DangerousGoods_Flag || false,
        LithiumBattery_Flag: data.LithiumBattery_Flag || false,
        Oversize_Flag: data.Oversize_Flag || false,
        Heavy_Flag: data.Heavy_Flag || false,
        Price: data.Price || "",
        FreightPrice: data.FreightPrice || "",
        Tax: data.Tax || "",
        Total: data.Total || "",
        Shipping_Fee: data.Shipping_Fee || "",
      });
    } catch (error) {
      console.error("Error fetching Parts information:", error);
    }
  };

  const resetForm = () => setFormData(defaultFormData);

  useEffect(() => {
    if (PartNumber && isOpen) {
      fetchPart();
    }
  }, [PartNumber, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target ? e.target.type === "checkbox" ? e.target.checked : e.target.value : e,
    }));
  };

  const handleUpdate = async () => {
    const { 
      PartNumber,
      Keyword,
      PartDescription,
      Orderability,
      RestrictionReason,
      CSR_Flag,
      ROHS_Flag,
      Returnable_Flag,
      HardRoll_Flag,
      DangerousGoods_Flag,
      LithiumBattery_Flag,
      Oversize_Flag,
      Heavy_Flag,
      Price,
      Total,
      Shipping_Fee,
    } = formData;

    if (!PartNumber || !Keyword || !PartDescription) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all required fields.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    // Convert form data for flags to boolean
    const updatedData = {
      ...formData,
      CSR_Flag: CSR_Flag === "true" || CSR_Flag === true ? true : false,
      ROHS_Flag: ROHS_Flag === "true" || ROHS_Flag === true ? true : false,
      Returnable_Flag: Returnable_Flag === "true" || Returnable_Flag === true ? true : false,
      HardRoll_Flag: HardRoll_Flag === "true" || HardRoll_Flag === true ? true : false,
      DangerousGoods_Flag: DangerousGoods_Flag === "true" || DangerousGoods_Flag === true ? true : false,
      LithiumBattery_Flag: LithiumBattery_Flag === "true" || LithiumBattery_Flag === true ? true : false,
      Oversize_Flag: Oversize_Flag === "true" || Oversize_Flag === true ? true : false,
      Heavy_Flag: Heavy_Flag === "true" || Heavy_Flag === true ? true : false,
      Price: Price ? Number(Price) : null,
      FreightPrice: FreightPrice ? Number(FreightPrice) : null,
      Tax: Tax ? Number(Tax) : null,
      Total: Total ? Number(Total) : null,
      Shipping_Fee: Shipping_Fee ? parseFloat(Shipping_Fee) : 0,
    };

    try {
      await ApiCustomer.patch(`/api/service-log/parts-catalog/${PartNumber}`, updatedData);

      Swal.fire({
        title: "Success!",
        text: "Data berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      onUpdate(); // Refresh data
      setIsOpen(false); // Close modal or form
    } catch (error) {
      console.error("Error updating Parts:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data!",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchPart(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
          <DialogDescription>
            Update the details of the User. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {[ 
            { label: "Part Number", id: "PartNumber", type: "text", required: true, readonly: true  },
            { label: "Keyword", id: "Keyword", type: "text" },
            { label: "Part Description", id: "PartDescription", type: "textarea" },
            { label: "Orderability", id: "Orderability", type: "checkbox" },
            { label: "Restriction Reason", id: "RestrictionReason", type: "textarea" },
            { label: "CSR Flag", id: "CSR_Flag", type: "checkbox" },
            { label: "ROHS Flag", id: "ROHS_Flag", type: "checkbox" },
            { label: "Returnable Flag", id: "Returnable_Flag", type: "checkbox" },
            { label: "Hard Roll Flag", id: "HardRoll_Flag", type: "checkbox" },
            { label: "Dangerous Goods Flag", id: "DangerousGoods_Flag", type: "checkbox" },
            { label: "Lithium Battery Flag", id: "LithiumBattery_Flag", type: "checkbox" },
            { label: "Oversize Flag", id: "Oversize_Flag", type: "checkbox" },
            { label: "Heavy Flag", id: "Heavy_Flag", type: "checkbox" },
            { label: "Price", id: "Price", type: "number" },
            { label: "Freight Price", id: "FreightPrice", type: "number" },
            { label: "Tax", id: "Tax", type: "number" },
            { label: "Total", id: "Total", type: "number" },
            { label: "Shipping Fee", id: "Shipping_Fee", type: "number" },
          ].map(({ label, id, type, required, readonly }) => (
            <div key={id}>
              <Label htmlFor={id}>
                {label} {required ? <span className="text-red-500">*</span> : ""}
              </Label>
              {type === "textarea" ? (
                <Textarea
                  id={id}
                  className="p-2"
                  value={formData[id] || ""}
                  onChange={handleChange(id)}
                />
              ) : type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={id}
                    checked={!!formData[id]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [id]: e.target.checked }))} />
                  <label htmlFor={id}>{label}</label>
                </div>
              ) : (
                <Input
                  type={type}
                  id={id}
                  className="p-2"
                  value={formData[id] || ""}
                  onChange={handleChange(id)}
                  readOnly={readonly}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PartDelete ({ PartNumber, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
const handleDelete = async () => {
  try {
    const response = await ApiCustomer.delete(`/api/service-log/parts-catalog/${PartNumber}`);
    
    console.log("Server Response:", response.data);
    if (response.status === 409 || response.data.success === false) {
      // 🚨 Restriction triggered - Show alert message
      alert(response.data.message || "Cannot delete this Part due to restrictions.");
      return;
    }
    Swal.fire({
      icon: 'Success',
      title: 'Berhasil!',
      text: 'User dihapus.',
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
      alert(error.response.data.message || "Cannot delete! This Part has related User.");
    } else {
      alert("Failed to delete User. Please try again.");
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
        <DialogTitle>Delete Part</DialogTitle>
        <DialogDescription>
          Delete User confirm. 
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
      const response = await ApiCustomer.get(`/api/service-log/warranty-services`)
      console.log("Warranty Service Response:", response.data);
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
      console.log("Data received for warrantyOffer:", data);
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
      console.log("output of respone part-catelog: ",response.data)
      console.log("response.data.data: ", response.data.data); 
      setPartCatalog(response.data.data)
      return response.data.data
    }catch(e){

    }
  }

  //search part handler
  const [partNumberSearch, setPartNumberSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [descriptionSearch, setDescriptionSearch] = useState("");




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
    
    handlerPriceConfirmServices();
  }, [selectedPartCatalog]);
  

  
  //hanlder confirm
  //handler qty price parts
  const handleQtyChangePartsCatalog = (partNumber, qty) => {
    setSelectedPartCatalog((prev) =>
      prev.map((item) => {
        if (item.PartNumber === partNumber) {
          const parsedQty = parseInt(qty) || 0;
          const price = parseFloat(item.Price) || 0;
          return {
            ...item,
            qty: parsedQty,
            Total: (parsedQty * price).toFixed(2)
          };
        }
        return item;
      })
    );
  };

  //handle add part in confirm services
  const [tempSelectedParts, setTempSelectedParts] = useState([]);
  

  //handler Total Subtotal Confirm Services
  const [subTotalConfirmServices, setSubTotalConfirmServices] = useState(0)
  const [TotalTaxConfirmServices, setTotalTaxConfirmServices] = useState(0)
  const [totalConfirmServices, setTotalConfirmServices] = useState(0)
  const handlerPriceConfirmServices = () =>{
    let serviceTotal = selectedWarrantyServices.reduce((acc, service) => {
      return acc + (parseFloat(service.Price) || 0);
    }, 0);
  
    let partsTotal = selectedPartCatalog.reduce((acc, part) => {
      return acc + (parseFloat(part.Total) || 0);
    }, 0);
  
    const subTotal = serviceTotal + partsTotal;
    console.log("SubTotal Confirm Services : ",subTotal)
    setSubTotalConfirmServices(subTotal.toFixed(2));

  }

  //createorder
  const createOrder = async () => {
    try {
      const res = await ApiCustomer.post("/api/service-log/create-order", {
        AssetID: assetForWorkOrderCreation.AssetID,
        CaseID: caseDetails.CaseID,
        selectedWarrantyServices,
        selectedPartCatalog,
        IncidentType: selected
      });
  
      await Swal.fire({
        title: "Success!",
        text: "Order added successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(()=>{
        setOpen(false);
        const WOID = res.data.WOID
        window.open(`/work/${WOID}`, '_blank');
      });
    } catch (err) {
      console.error("❌ Order Creation Failed:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to create order",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  


  

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
              <Button variant={'search'} onClick={() => setCurrentStep(2)} disabled={selectedWarrantyServices.length === 0} className={selectedWarrantyServices.length === 0 ? "opacity-50 cursor-not-allowed" : ""}>Next</Button>
            </DialogFooter>
          </DialogContent>
        );
  
      case 2:
        const filteredPartCatalog = partCatalog.filter(part => {
          return (
            part.PartNumber?.toLowerCase().includes(partNumberSearch.toLowerCase()) &&
            part.Keyword?.toLowerCase().includes(keywordSearch.toLowerCase()) &&
            part.PartDescription?.toLowerCase().includes(descriptionSearch.toLowerCase())
          );
        });
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
              <div className="bg-gray-300 grid grid-cols-2 gap-x-2 p-2 flex-1">
                <p>Service OfferID</p><p>: {selectedWarrantyServices[0].Service_offerID}</p>
                <p>Service Description</p><p>: {selectedWarrantyServices[0].Service_description}</p>
              </div>
              <div className="flex items-center space-x-2 gap-2 flex-1 self-center justify-center ">
                <Label htmlFor="orderability">Orderability</Label>
                <Switch id="orderability" />
              </div>
              <div className="bg-gray-300 grid grid-cols-2 gap-x-2 p-2 flex-1">
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
                    <span className="flex items-center">
                      <Input 
                        className={'bg-white'}
                        value={partNumberSearch}
                        onChange={(e) => setPartNumberSearch(e.target.value)}
                      />
                      <XIcon className="cursor-pointer" onClick={() => setPartNumberSearch("")}/>
                    </span>
                    </TableHead>
                  <TableHead className={'font-black text-black'}>
                    Keyword
                    <span className="flex items-center">
                      <Input 
                        className={'bg-white'}
                        value={keywordSearch}
                        onChange={(e) => setKeywordSearch(e.target.value)}
                      />
                      <XIcon className="cursor-pointer" onClick={() => setKeywordSearch("")}/>
                    </span>
                    </TableHead>
                  <TableHead className={'font-black text-black'}>
                    Part Description
                    <span className="flex items-center">
                      <Input 
                        className={'bg-white'}
                        value={descriptionSearch}
                        onChange={(e) => setDescriptionSearch(e.target.value)}
                      />
                      <XIcon className="cursor-pointer" onClick={() => setDescriptionSearch("")}/>
                    </span>
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
                {filteredPartCatalog.map((part, index) => {
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
                      <TableCell>{part.Returnable_Flag ? 'true' : 'false'}</TableCell>
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
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
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
                {selectedWarrantyServices.map((service, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{service.Service_offerID}</TableCell>
                      <TableCell>{service.Service_description}</TableCell>
                      <TableCell>{service.CTat_RTime}</TableCell>
                      <TableCell>{service.Shipping_Fee}</TableCell>
                      {/* <TableCell>{service.Price}</TableCell> */}
                      <TableCell>1</TableCell>
                      <TableCell>{service.Tax}</TableCell>
                      <TableCell>{service.Price}</TableCell>
                    </TableRow>
                  )
                })}
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
                {selectedPartCatalog.map((part, index) => {
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
                      <TableCell>{part.PartDescription}</TableCell>
                      <TableCell>{part.Shipping_Fee}</TableCell>
                      <TableCell>
                      <Input
                        placeholder="QTY"
                        type="number"
                        value={part.qty || ''}
                        onChange={(e) => handleQtyChangePartsCatalog(part.PartNumber, e.target.value)}
                        className="w-16"
                      />
                      </TableCell>
                      <TableCell>{part.Tax}</TableCell>
                      <TableCell>{part.Total}</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell colSpan={2}>Sub Total</TableCell>
                  <TableCell>{subTotalConfirmServices}</TableCell>
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
              <Button variant={'search'} className="" onClick={createOrder}>Create Order</Button>
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
    <BtnModalsPartAdd 
      open2={modalPart} 
      setOpen2={setModalPart}
      partCatalog={partCatalog}
      selectedPartCatalog={selectedPartCatalog}
      setSelectedPartCatalog={setSelectedPartCatalog}
    />
    </Dialog>
    {/* <Button onClick={() => setWorkOpen(true)}>Open Work Order</Button> */}
  </>
  );
}

export function BtnModalsPartAdd({
  open2, 
  setOpen2,
  partCatalog,
  selectedPartCatalog,
  setSelectedPartCatalog
}){
  const [tempSelectedParts, setTempSelectedParts] = useState([]);
  const handlerPartCatalog = (part, checked) => {
    if (checked) {
      setTempSelectedParts((prev) => [...prev, part]);
    } else {
      setTempSelectedParts((prev) =>
        prev.filter((item) => item.PartNumber !== part.PartNumber)
      );
    }
  };

  //search
  const [partNumberInput, setPartNumberInput] = useState("");
  const [partNumberSearch, setPartNumberSearch] = useState("");

  const filteredPartCatalog = partCatalog.filter(part => {
    return (
      part.PartNumber?.toLowerCase().includes(partNumberSearch.toLowerCase())
    );
  });
  
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
              <Input 
                className={'ring-1 min-w-[10em] ring-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500'}
                value={partNumberInput}
                onChange={(e) => setPartNumberInput(e.target.value)}
              />
              <Button 
                variant={'search'}
                onClick={(e) => setPartNumberSearch(partNumberInput)}
              >Search</Button>
            </span>
            <div className="bg-gray-300 flex gap-x-10 p-2 flex-1 max-w-[10em]">
                <p>Currency</p><p className="whitespace-nowrap">: </p>
            </div>
          </div>
          <div className="overflow-x-auto max-w-full">
            <Table className={''}>
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
              {
              filteredPartCatalog
              .filter(part => !selectedPartCatalog.some(selected => selected.PartNumber === part.PartNumber))
              .map((part, index) => {
                  const isChecked = tempSelectedParts.some((item) => item.PartNumber === part.PartNumber)
                  return (
                    <TableRow key={index}>
                      <TableCell className="flex">
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
                      <TableCell>{part.Returnable_Flag ? 'true' : 'false'}</TableCell>
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
          </div>
          <DialogFooter className={'sm:justify-start'}>
            <Button 
              variant={'search'}
              onClick={() => {
                setSelectedPartCatalog((prev) => [
                  ...prev,
                  ...tempSelectedParts.filter(
                    (part) => !prev.some((p) => p.PartNumber === part.PartNumber)
                  ),
                ]);
                setTempSelectedParts([]); // ✅ clear after adding
                Swal.fire({
                  title: "Success!",
                  text: "Part(s) added successfully!",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                }).then(()=>{
                  setOpen2(false);
                });

              }}
            >Add Part</Button>
            <Button variant={'search'} onClick={() => { setTempSelectedParts([]); 
    setPartNumberInput("");
    setPartNumberSearch(""); }}>Clear</Button>
            <Button variant={'search'} onClick={() => setOpen2(false)}>Cancel</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}