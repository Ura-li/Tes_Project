import { React, useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { useNavigate } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

//importing API
import ApiCustomer from "./api";

import { Button } from "@/components/ui/button";
import {
  PanelRight,
  Plus,
  User2,
  PhoneCall,
  LucideLaptop,
  Clock,
  ChartCandlestickIcon,
  File,
  BadgeAlert,
  Copy,
  Search,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DialogCloseButton,
  DialogCompanyBtn,
  DialogContactBtn,
} from "./components/assets-modal";
import { SelectBar } from "./components/sc-select";
import { SelectBar1 } from "./components/sc-select";
import { SelectBar2 } from "./components/sc-select";
import { TableCompany, TableContact, TableAsset } from "./components/sc-table";
import {
  BtnModal,
  BtnModalContact,
  BtnModalAsset,
} from "./components/sc-modal";
import { Checkbox } from "./components/ui/checkbox";

import { InfoCase } from "@/components/info-case";

const data = {
  navModals: [
    {
      title: "Account Info",
      key: "account",
      icon: User2,
      
    },
    {
      title: "Contact Info",
      key: "contact",
      icon: PhoneCall,
      
    },
    {
      title: "Asset Info",
      key: "asset",
      icon: LucideLaptop,
      
    },
    {
      title: "Repair History",
      key: "repair",
      icon: Clock,
      
    },
  ],
  navMain: [
    {
      title: "Entitelement Info",
      url: "#",
      icon: ChartCandlestickIcon,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Cases",
      url: "#",
      icon: File,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Complaint",
      url: "#",
      icon: BadgeAlert,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
};

import ModalProvider from "./components/modal-provider";


const Search_case = () => {
  //create search state
  const [search, setSearch] = useState("");
  
  //creating Asset Data
  const [assets, setAssets] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [siteAccounts, setSiteAccounts] = useState([]);

  const [isModalAssetOpen, setIsModalAssetOpen] = useState(false);
  const [isModalCompanyOpen, setIsModalCompanyOpen] = useState(false);
  const [isModalContactOpen, setIsModalContactOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("search"); // Default active tab

  //show state condiition where search by email / phone for special condition
  const [searchByEmailPhoneForGlobalSearch, setSearchByEmailPhoneForGlobalSearch] = useState(false);

  const [activeModal, setActiveModal] = useState(null)

  const handleSearchClick = () => {
    let queryParams = [];
    console.log("BeforeChange" + activeTab);

    // this for switching tab
    if (search.SerialNumber !== "") {
      setIsModalAssetOpen(true); // Open modal
      setActiveTab("ci"); // Switch tab to target
    } else if (search.Company !== "") {
      setIsModalCompanyOpen(true);
      setActiveTab("ci"); // Switch tab to target
    }

    /**
     * if the query include email / phone, queryparam runned
     */
    if (search.Email) {
      queryParams.push(`email=${search.Email}`);
    }
    if (search.Phone) {
      queryParams.push(`phone=${search.Phone}`);
    }
    if (search.Country) {
      queryParams.push(`country=${search.Country}`);
    }

    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
    console.log("Query Parameter Search Contact : ",queryParams)
    console.log("Query String Search Contact : ",queryString)

    if (search.Email || search.Phone) {
      setActiveTab("ci");
      //set state to true 
      setSearchByEmailPhoneForGlobalSearch(true);
      fetchDataContacts(queryString);
      fetchDataSiteAccounts(queryString);
    }
  };
  useEffect(() => {
    console.log("Contacts Searched trhough Phone:", contacts);
  }, [contacts]); // This runs every time activeTab changes




  //define method
  const fetchDataAssets = async () => {
    //fetch data from API with Axios
    await ApiCustomer.get("/api/asset-information").then((response) => {
      //assign response data to state "asset"
      setAssets(response.data.data);
    });
  };

  const fetchDataContacts = async (query = '') => {
    //fetch data from API with Axios
    await ApiCustomer.get(`/api/contact-information${query}`).then(
      (response) => {
        setContacts(response.data.data);
      }
    );
  };

  const fetchDataSiteAccounts = async (query = '') => {
    //fetch data from API with Axios
    await ApiCustomer.get(`/api/site_account${query}`).then((response) => {
      setSiteAccounts(response.data.data);
    });
  };

  //run hook useEffect
  // useEffect(() => {
  //   //call method
  //   fetchDataAssets();
  //   fetchDataContacts();
  //   fetchDataSiteAccounts();
  // }, []);

  //resetData Search
  useEffect(() => {
    if (!isModalAssetOpen) {
      setSearch({
        Email: "",
        SerialNumber: "",
        Country: "",
        Company: "",
        ZipPostalCode: "",
        City: "",
        Phone: "",
        AssetTag: "",
        ContractID: "",
        TransactionType: "",
        TransactionID: "",
        Opsi: "",
        LicenseKey: "",
        PIN: "",
      });
    }
  }, [isModalAssetOpen]); // Runs whenever modal state changes
  useEffect(() => {
    if (!isModalCompanyOpen) {
      setSearch({
        Email: "",
        SerialNumber: "",
        Country: "",
        Company: "",
        ZipPostalCode: "",
        City: "",
        Phone: "",
        AssetTag: "",
        ContractID: "",
        TransactionType: "",
        TransactionID: "",
        Opsi: "",
        LicenseKey: "",
        PIN: "",
      });
    }
  }, [isModalCompanyOpen]); // Runs whenever modal state changes
  //filter item

  // const filteredAssets = assets.filter((asset) =>
  //   asset.SerialNumber?.toLowerCase().includes(search.toLowerCase()) ||
  //   asset.ProductName?.toLowerCase().includes(search.toLowerCase())
  // );
  // console.log("filtered Asset")
  // console.log(filteredAssets);

  //form section
  // section account
  //set Form Data
  const [formDataSiteAccount, setFormDataSiteAccount] = useState({
    Company: "",
    Email: "",
    PrimaryPhone: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    StateProvince: "",
    Country: "",
    ZipPostalCode: "",
  });

  //make handler
  const handlerInputSiteAccountChange = (e) => {
    const { id, value } = e.target;
    setFormDataSiteAccount((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleClearAllAcconunt = () => {
    setFormDataSiteAccount({
    Company: "",
    Email: "",
    PrimaryPhone: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    StateProvince: "",
    Country: "",
    ZipPostalCode: "",
    })
  }

  //handler submit
  // console.log(formData)
  const handlerSiteAccountSubmit = async () => {
    // console.log(formDataSiteAccount)
    try {
      const response = await ApiCustomer.post(
        "/api/site_account",
        formDataSiteAccount
      );
      console.log("Success:", response.data);
      alert("Customer Saved successfully");
    } catch (err) {
      console.error("Error saving customer: ", err);
      alert("Failed to save customer");
    }
  };

  const [formDataContact, setFormDataContact] = useState({
    Salutation: "",
    FirstName: "",
    LastName: "",
    Email: "",
    PreferredLanguage: "",
    Phone: "",
    Mobile: "",
    WorkPhone: "",
    WorkExtension: "",
    OtherPhone: "",
    OtherExtension: "",
    Fax: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    StateProvince: "",
    Country: "",
    ZipPostalCode: "",
  });

  const handlerInputContactChange = (e) => {
    const { id, value } = e.target;
    setFormDataContact((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleClearAllContact = () => {
    setFormDataContact({
    Salutation: "",
    FirstName: "",
    LastName: "",
    Email: "",
    PreferredLanguage: "",
    Phone: "",
    Mobile: "",
    WorkPhone: "",
    WorkExtension: "",
    OtherPhone: "",
    OtherExtension: "",
    Fax: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    StateProvince: "",
    Country: "",
    ZipPostalCode: "",
    });
  }

  const handlerContactSubmit = async () => {
    console.log(formDataContact);
    console.log("formDataContact");
    try {
      const response = await ApiCustomer.post(
        "/api/contact-information",
        formDataContact
      );
      console.log("Success:", response.data);
      alert("Contact Information Saved Successfully");
    } catch (err) {
      console.error("Error saving contact information: ", err);
      alert("Failed to save contact information");
    }
  };

  //handler table selected
  const [selectedAsset, setSelectedAsset] = useState([]); // Store selected asset data

  const handleSelectedAsset = (asset) => {
    if (Array.isArray(asset)) {
      setSelectedAsset(asset);
      setSelectedSiteAccounts(asset[0]?.site_account || null); // Update affiliated company
      setSelectedContact(asset[0]?.contact_information || null); // Update affiliated contact
    } else if (asset) {
      setSelectedAsset([asset]);
      setSelectedSiteAccounts(asset.site_account || null);
      setSelectedContact(asset.contact_information || null);
    } else {
      setSelectedAsset([]);
      setSelectedSiteAccounts(null);
      setSelectedContact(null);
    }
  };

  //handler site accunt
  const [selectedSiteAccounts, setSelectedSiteAccounts] = useState([]);

  const handleSelectedSiteAccount = (company) => {
    setSelectedSiteAccounts(company);
    console.log("Company Selected:", selectedSiteAccounts);
  };

  //todo : handler selected contact
  const [selectedContact, setSelectedContact] = useState([]);

  //handler for selected asset for creating case
  const [selectedAssetForCase, setSelectedAssetForCase] = useState(null);
  const [selectedContactForCase, setSelectedContactForCase] = useState(null);
  //state
  const [caseType, setCaseType] = useState(""); // ✅ Manage selected Case Type

  const navigate = useNavigate(); // ✅ Get the navigate function

  const handleCreateCase = async () => {
    if (!selectedAssetForCase || !selectedContactForCase) {
      alert("Please select an asset/contact before creating a case!"); // 🔥 Prevent case creation
      return;
    }

    // ✅ Extract SiteAccountID only if it exists
    const siteAccountID = selectedSiteAccounts
      ? selectedSiteAccounts.SiteAccountID
      : null;

    try {
      const newCase = {
        CaseID: Math.floor(Math.random() * 100000), // Example random ID
        AssetID: selectedAssetForCase.AssetID,
        ContactID: selectedContactForCase.ContactID,
        SiteAccountID: siteAccountID, // If company exists
        CaseSubject: document.getElementById("CaseSubject").value,
        CaseType: caseType,
        KCI_Flag: document.getElementById("KCI_Flag").checked,

        IncomingChannel: "Email",
        CaseStatus: "Open",
        CasePriority: "Medium",
        CustomerSeverity: "Normal",
        CaseClosedDate: null,
        CaseNote: "This is a sample case note.",
        SymptomCode: "General Issue",
        CaseResolution: "",
      };

      await ApiCustomer.post("/api/case-information", newCase);
      alert("Case Created Successfully!");
      navigate(`/case/${newCase.CaseID}`); // ✅ Redirect to case details page
    } catch (error) {
      console.error("Error creating case:", error);
    }
  };

  //selected company for case
  // const selectedCompanyForCase = companies ? companies[0] : null;

  const [selectedCompanyForCase, setSelectedCompanyForCase] = useState(null);

  /**
   * TODO :
   * Make the select is automatic when it's related
   * right now is not automated, so i skiped this part
   * but this is still used rn
   */
  const handleSelectedAssetForCaseRelated = (asset) => {
    setSelectedAssetForCase(asset);

    if (asset.contact_information) {
      setSelectedContactForCase(asset.contact_information); // 🔥 Auto-select related contact
    }

    if (asset.site_account) {
      setSelectedSiteAccounts(asset.site_account); // 🔥 Auto-select related company
    }
  };

  const updateFormFieldsInSearch = (fields) => {
    setSearch((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const handleInputChange = (e) => {
    // if (search.trim() !== "") {
    const { id, value } = e.target; // Get input field ID and value
    // setSearch((prev) => ({
    //   ...prev,
    //   [id]: value, // Update the corresponding field
    // }));
    updateFormFieldsInSearch({ [id]: value });
    console.log(`Updated searchData:`, search);
    // }
    // console.log(search)

    // }
    console.log(search);
  };

  // const initialSearchState = {
  //   Email: "",
  //   SerialNumber: "",
  //   Country: "",
  //   Company: "",
  //   ZipPostalCode: "",
  //   City: "",
  //   Phone: "",
  //   AssetTag: "",
  //   ContractID: "",
  //   TransactionType: "",
  //   TransactiontID: "",
  //   Opsi: "",
  // };
  
  // const [initial, setInitialsearch] = useState(initialSearchState);
  

  const handleClearAll = () => {
    updateFormFieldsInSearch({
      Email: "",
      SerialNumber: "",
      Country: "",
      Company: "",
      ZipPostalCode: "",
      City: "",
      Phone: "",
      AssetTag: "",
      ContractID: "",
      TransactionType: "",
      TransactiontID: "",
      Opsi: "",
      LicenseKey: "",
      PIN: "",
    });
  };
  

  return (
    <div className="flex flex-1 p-2 pt-0">
      <SidebarProvider className=" overflow-auto min-h-[full]">
        <div className="flex flex-1 rounded-xl md:min-h-min">
          <Tabs
            defaultValue="search"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="drop-shadow-xl bg-sky-700 w-full h-15 flex justify-between">
              <div className="w-2xs p-2 text-white ">
                <TabsTrigger value="search" className="cursor-pointer">
                  Search
                </TabsTrigger>
                <TabsTrigger value="ci" className="cursor-pointer">
                  Costumer Information
                </TabsTrigger>
              </div>
              {/* <Button className="ml-50 cursor-pointer "><span></span>Customer Complaint</Button>
            <Button className="cursor-pointer"><span></span>Customer Complaint Legal</Button> */}
              {/* <Button className="mr-1.5 cursor-pointer"><span><Plus></Plus></span>Create Case</Button> */}
              <div className="flex gap-2 items-center">
                <Button className="text-md rounded-2xl p-4 text-black bg-white font-bold">
                  Create Legal Complaint
                </Button>
                <Button className="text-md rounded-2xl p-4 bg-transparent border-black border-2">
                  Create Complaint
                </Button>
                <BtnModal
                  handleCreateCase={handleCreateCase}
                  selectedAssetForCase={selectedAssetForCase}
                  selectedContactForCase={selectedContactForCase}
                  caseType={caseType}
                  setCaseType={setCaseType}
                ></BtnModal>
                <SidebarTrigger
                  className="-ml-1 scale-125 mr-1"
                  icon={PanelRight}
                  color={"#ffffff"}
                />
              </div>
            </TabsList>

            {/* search tab */}
            <TabsContent value="search">
              <Card className="drop-shadow-md">
                <Button className="self-end mr-2" variant="ghost"
                onClick={handleClearAll}
                >
                  Clear All
                </Button>
                <CardContent className="grid gap-5 grid-cols-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      value={search.Email || ""}
                      onChange={handleInputChange}
                      className="border-b-black p-1 "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="SerialNumber">Serial Number</Label>
                    <Input
                      id="SerialNumber"
                      value={search.SerialNumber || ""}
                      onChange={handleInputChange}
                      className="border-b-black p-1"
                    />
                  </div>
                  <div className="space-y-0.5 flex flex-col">
                    <Label htmlFor="Country">Country</Label>
                    <SelectBar
                      id="Country"
                      value={search.Country || ""}
                      onChange={handleInputChange}
                    ></SelectBar>
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="Company">Company</Label>
                    <Input
                      id="Company"
                      value={search.Company || ""}
                      className="border-b-black p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="ZipPostalCode">Zip/Postal</Label>
                    <Input 
                      id="ZipPostalCode" 
                      value={search.ZipPostalCode || ""}
                      className="border-b-black p-1" 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="City">City</Label>
                    <Input 
                      id="City" 
                      value={search.City || ""}
                      className="border-b-black p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="Phone">Phone</Label>
                    <Input
                      id="Phone"
                      value={search.Phone || ""}
                      onChange={handleInputChange}
                      className="border-b-black p-1"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="AssetTag">Asset Tag</Label>
                    <Input 
                      id="AssetTag" 
                      value={search.AssetTag || ""}
                      className="border-b-black p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="ContractID">Contrack Id</Label>
                    <Input 
                      id="ContractID" 
                      value={search.ContractID || ""}
                      className="border-b-black p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="TransactionType">Transaction Type</Label>
                    <Input
                      id="TransactionType"
                      value={search.TransactionType || ""}
                      className="border-b-black p-1"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="TransactiontID">Transaction Id</Label>
                    <Input 
                    id="TransactiontID" 
                    value={search.TransactiontID || ""}
                    className="border-b-black p-1"
                    onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="Opsi">Opsi</Label>
                    <Input 
                    id="Opsi" 
                    value={search.Opsi || ""}
                    className="border-b-black p-1"
                    onChange={handleInputChange}
                    />
                  </div>
                  {/* <div className="space-y-0.5">
                  <Label htmlFor="LicenseKey">Lisense key</Label>
                  <Input id="LicenseKey" className="border-b-black p-1"  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="PIN">Pin</Label>
                  <Input id="PIN" className="border-b-black p-1" />
                </div> */}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="secondary"
                    className="bg-white drop-shadow-md border-1 cursor-pointer w-40 h-11"
                    onClick={handleSearchClick}
                  >
                    <p className="text-2xl mb-1">Search</p>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="ci" className="flex flex-col gap-1">
              <TabsList className="bg-white float-right mr-5 self-end">
                <TabsTrigger value="Account" className="cursor-pointer">
                  <span>
                    <Plus></Plus>
                  </span>
                  Create New
                </TabsTrigger>
                <DialogCloseButton
                  isModalAssetOpen={isModalAssetOpen}
                  setIsModalAssetOpen={setIsModalAssetOpen}
                  search={search}
                  setSearch={setSearch}
                  onSelectAsset={handleSelectedAsset}
                />
                <DialogCompanyBtn
                  isModalCompanyOpen={isModalCompanyOpen}
                  setIsModalCompanyOpen={setIsModalCompanyOpen}
                  search={search}
                  setSearch={setSearch}
                  onSelectCompany={handleSelectedSiteAccount}
                />
                <DialogContactBtn />
              </TabsList>
              <div className="mb-5">
                {/* TODO : Change this Variable Name */}
                <TableCompany
                  selectedAsset={selectedAsset}
                  selectedCompany={selectedSiteAccounts}
                  selectedContact={selectedContact}
                  setSelectedAsset={setSelectedAsset}
                  setSelectedSiteAccounts={setSelectedSiteAccounts}
                  setSelectedContact={setSelectedContact}
                  selectedAssetForCase={selectedAssetForCase}
                  setSelectedAssetForCase={setSelectedAssetForCase}
                  selectedContactForCase={selectedContactForCase}
                  setSelectedContactForCase={setSelectedContactForCase}
                  selectedCompanyForCase={selectedCompanyForCase}
                  setSelectedCompanyForCase={setSelectedCompanyForCase}
                  handleCreateCase={handleCreateCase}
                  handleSelectedAssetForCaseRelated={
                    handleSelectedAssetForCaseRelated
                  }
                  searchByEmailPhoneForGlobalSearch={searchByEmailPhoneForGlobalSearch}
                  setSearchByEmailPhoneForGlobalSearch={setSearchByEmailPhoneForGlobalSearch}
                  assetBasedOnContactsSearch={assets}
                  contactsBasedOnContactsSearch={contacts}
                  companyBasedOnContactsSearch={siteAccounts}
                />
              </div>
            </TabsContent>

            <TabsContent value="Account">
              <TabsList className="flex h-[3em] bg-white">
                <div className="w-2xs p-2 text-black">
                  <TabsTrigger value="Account" className="cursor-pointer">
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="Contact" className="ml-2 cursor-pointer">
                    Contact
                  </TabsTrigger>
                </div>
              </TabsList>
              <Card className="drop-shadow-md">
                {/* <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader> */}
                <CardHeader>
                  <CardTitle className="flex flex-col">
                    <span className="flex items-center">
                      <User2></User2>Basic Information
                    </span>
                    <Button className="self-end mr-2" variant="ghost" onClick={handleClearAllAcconunt}>
                      Clear All
                    </Button>
                    <Button className="bg-white text-gray-400  self-end ">
                      <Copy></Copy>Same in Account Adress{" "}
                    </Button>
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5 grid-cols-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="Company">Company</Label>
                    <Input
                      id="Company"
                      className="border-b-black p-1"
                      onChange={handlerInputSiteAccountChange}
                      value={formDataSiteAccount.Company}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      type="email"
                      className="border-b-black p-1"
                      onChange={handlerInputSiteAccountChange}
                      value={formDataSiteAccount.Email}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="PrimaryPhone">Primary Phone</Label>
                    <Input
                      id="PrimaryPhone"
                      type="text"
                      className="border-b-black p-1"
                      onChange={handlerInputSiteAccountChange}
                      value={formDataSiteAccount.PrimaryPhone}
                    />
                  </div>
                </CardContent>
                <CardHeader className="mt-4">
                  <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5 grid-cols-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="AddressLine1">Addres Line 1</Label>
                    <Input
                      id="AddressLine1"
                      type="email"
                      className="border-b-black p-1"
                      onChange={handlerInputSiteAccountChange}
                      value={formDataSiteAccount.AddressLine1}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="AddressLine2">Addres Line 2</Label>
                    <Input
                      id="AddressLine2"
                      type="email"
                      className="border-b-black p-1"
                      onChange={handlerInputSiteAccountChange}
                      value={formDataSiteAccount.AddressLine2}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="City">City</Label>
                    <Input
                      id="City"
                      type="text"
                      className="border-b-black p-1"
                      onChange={handlerInputSiteAccountChange}
                      value={formDataSiteAccount.City}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="StateProvince">State/Province</Label>
                    <Input
                      id="StateProvince"
                      type="text"
                      className="border-b-black p-1"
                      onChange={handlerInputSiteAccountChange}
                      value={formDataSiteAccount.StateProvince}
                    />
                  </div>
                  <div className="space-y-0.5 flex flex-col">
                    <Label htmlFor="current">Country</Label>
                    <SelectBar
                      id="Country"
                      value={formDataSiteAccount.Country}
                      onChange={handlerInputSiteAccountChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="ZipPostalCode">Zip/Postal Code</Label>
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
                    className="bg-white drop-shadow-md border-1 cursor-pointer"
                    onClick={handlerSiteAccountSubmit}
                  >
                    Verify & Save
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="Contact">
              <TabsList className="flex h-[3em] bg-white">
                <div className="w-2xs p-2 text-black">
                  <TabsTrigger value="Account" className="cursor-pointer">
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="Contact" className="ml-2 cursor-pointer">
                    Contact
                  </TabsTrigger>
                </div>
              </TabsList>
              <Card className="drop-shadow-md">
                <CardHeader className="flex-row justify-between">
                <CardTitle>
                 Basic Information
                  </CardTitle>
                  <div>
                    <Button className="bg-white text-gray-400  self-end "><Copy></Copy>Same in Account Adress </Button>
                    <Button 
                    className="self-end mr-2" 
                    variant="ghost"
                    onClick={handleClearAllContact}
                    >Clear All</Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-5 grid-cols-5">
                  <div className="space-y-0.5 grid grid-cols-2 gap-x-2.5 col-span-2">
                    <Label htmlFor="Salutation">Salutation</Label>
                    <Label htmlFor="PreferredLanguage">
                      Preferred Language
                    </Label>
                    <SelectBar1
                      id="Salutation"
                      value={formDataContact.Salutation}
                      onChange={handlerInputContactChange}
                    />
                    <SelectBar2
                      id="PreferredLanguage"
                      value={formDataContact.PreferredLanguage}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="FirstName">First Name</Label>
                    <Input
                      id="FirstName"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.FirstName}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="LastName">Last Name</Label>
                    <Input
                      id="LastName"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.LastName}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      type="email"
                      className="border-b-black p-1"
                      value={formDataContact.Email}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                </CardContent>
                <CardHeader className="mt-2">
                  <CardTitle>Phone Preferences</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5 grid-cols-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="Phone">Phone</Label>
                    <Input
                      id="Phone"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.Phone}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="Mobile">Mobile</Label>
                    <Input
                      id="Mobile"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.Mobile}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="WorkPhone">Work</Label>
                    <Input
                      id="WorkPhone"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.WorkPhone}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="WorkExtension">Work EXTN</Label>
                    <Input
                      id="WorkExtension"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.WorkExtension}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="OtherPhone">Other</Label>
                    <Input
                      id="OtherPhone"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.OtherPhone}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="OtherExtension">Other EXTN</Label>
                    <Input
                      id="OtherExtension"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.OtherExtension}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="Fax">FAX</Label>
                    <Input
                      id="Fax"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.Fax}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                </CardContent>
                <CardHeader className="mt-2">
                  <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5 grid-cols-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="AddressLine1">Address Line 1</Label>
                    <Input
                      id="AddressLine1"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.AddressLine1}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="AddressLine2">Address Line 2</Label>
                    <Input
                      id="AddressLine2"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.AddressLine2}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="City">City</Label>
                    <Input
                      id="City"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.City}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="StateProvince">State/Province</Label>
                    <Input
                      id="StateProvince"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.StateProvince}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5 flex flex-col">
                    <Label htmlFor="current">Country</Label>
                    <SelectBar
                      id="Country"
                      value={formDataContact.Country}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="ZipPostalCode">Zip/Postal Code</Label>
                    <Input
                      id="ZipPostalCode"
                      type="text"
                      className="border-b-black p-1"
                      value={formDataContact.ZipPostalCode}
                      onChange={handlerInputContactChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    className="bg-white drop-shadow-md border-1 cursor-pointer w-20"
                    onClick={handlerContactSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-white drop-shadow-md border-1 cursor-pointer"
                    onClick={handlerContactSubmit}
                  >
                    Verify & Save
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Sidebar side="right" className="relative h-full" collapsible="icon">
          <SidebarContent>
            <InfoCase items={data.navModals} items2={data.navMain} onModalClick={setActiveModal} />
          </SidebarContent>
        </Sidebar>
      <ModalProvider 
        selectedAssetForCase={selectedAssetForCase}
        selectedContactForCase={selectedContactForCase} 
        activeModal={activeModal} 
        setActiveModal={setActiveModal} />
      </SidebarProvider>
    </div>
  );
};

export default Search_case;
