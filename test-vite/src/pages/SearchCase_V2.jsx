import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { AccountForm } from "@/components/FormCase/AccountForm";


import Swal from "sweetalert2";
import ApiCustomer from "@/api";

/** ----------------------------------------------------------------------
 *  Small utilities
 *  ---------------------------------------------------------------------- */
const byId = (arr, key = "SiteAccountID") => {
  const map = new Map();
  for (const item of arr || []) {
    if (item?.[key] != null) map.set(item[key], item);
  }
  return map;
};

/** ----------------------------------------------------------------------
 *  Result tables (modular, dumb components)
 *  ---------------------------------------------------------------------- */
export function CompanySearchResult({ 
  companies = [], 
  onSelectCompany,
  formDataSiteAccount,
  handlerInputSiteAccountChange,
  handlerSiteAccountSubmit, 
  loading 
}) {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const handleSelect = (company) =>{
    if(selectedCompanyId === company.SiteAccountID){
      setSelectedCompanyId(null);
      onSelectCompany(null);
    }else{
      setSelectedCompanyId(company.SiteAccountID);
      onSelectCompany(company);
    }
  }
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Companies ({companies.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading companies…</TableCell>
            </TableRow>
          ) : companies.length === 0 ? (
          <div className="p-4 text-gray-600">
            <p>Tidak ada company yang ditemukan</p>
            <Tabs defaultValue="Account">
              <TabsList>
                <TabsTrigger value="Account">Create Account</TabsTrigger>
              </TabsList>
              <TabsContent value="Account">
                {/* <AccountForm
                  formData={formDataSiteAccount}
                  onChange={handlerInputSiteAccountChange}
                  onSubmit={handlerSiteAccountSubmit}
                /> */}
              </TabsContent>
            </Tabs>
          </div>
        ): (
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-200">
                <TableHead>Account Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Zip</TableHead>
                <TableHead>Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading companies…</TableCell>
                </TableRow>
              ) : companies.length > 0 ? (
                companies.map((c) => (
                  <TableRow
                    key={c.SiteAccountID}
                    onClick={() => handleSelect(c)}
                    className={`cursor-pointer ${ selectedCompanyId == c.SiteAccountID ? "bg-blue-100" : " hover:bg-gray-100" }`}
                  >
                    <TableCell className="whitespace-break-spaces">{c.Company}</TableCell>
                    <TableCell>{c.City || "-"}</TableCell>
                    <TableCell>{c.ZipPostalCode || "-"}</TableCell>
                    <TableCell>{c.Country || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No companies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export function ContactSearchResult({ contacts = [], onSelectContact, title = "Contacts", loading }) {
  const [selectedContactId, setSelectedContactId] = useState(null);

  const handleSelect = (contact) => {
    if (selectedContactId === contact.ContactID) {
      setSelectedContactId(null);
      onSelectContact(null);
    } else {
      setSelectedContactId(contact.ContactID);
      onSelectContact(contact);
    }
  };
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title} ({contacts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-200">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading contacts…</TableCell>
              </TableRow>
            ) : contacts.length > 0 ? (
              contacts.map((p) => (
                <TableRow
                  key={p.ContactID}
                  onClick={() => handleSelect(p)}
                  className={`
                    cursor-pointer
                    ${ selectedContactId == p.ContactID ? "bg-blue-100" : "hover:bg-gray-100"}
                    `}
                >
                  <TableCell>{`${p.FirstName ?? ""} ${p.LastName ?? ""}`.trim()}</TableCell>
                  <TableCell>{p.Email || "-"}</TableCell>
                  <TableCell>{p.Phone || p.Mobile || "-"}</TableCell>
                  <TableCell>{p.Country || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AssetSearchResult({ assets = [], onSelectAsset, loading }) {
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const handleSelect = (asset) => {
    console.log(asset)
    if (selectedAssetId === asset.AssetID) {
      setSelectedAssetId(null);
      onSelectAsset(null);
    } else {
      setSelectedAssetId(asset.AssetID);
      onSelectAsset(asset);
    }
  };
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Assets ({assets.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-200">
              <TableHead>Product Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Product #</TableHead>
              <TableHead>Product Line</TableHead>
              <TableHead>Account</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading assets…</TableCell>
              </TableRow>
            ) : assets.length > 0 ? (
              assets.map((a) => (
                <TableRow
                  key={a.AssetID}
                  onClick={() => handleSelect(a)}
                  className={`cursor-pointer
                    ${selectedAssetId == a.AssetID ? "bg-blue-100" :"hover:bg-gray-100"}
                    `}
                >
                  <TableCell className="whitespace-break-spaces">{a.product_information?.ProductName || "-"}</TableCell>
                  <TableCell>{a.SerialNumber}</TableCell>
                  <TableCell>{a.ProductNumber}</TableCell>
                  <TableCell>{a.product_information?.ProductLine || "-"}</TableCell>
                  <TableCell>{a.site_account?.Company || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No assets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/** ----------------------------------------------------------------------
 *  High-level container that owns the flow & API calls
 *  ---------------------------------------------------------------------- */
export default function CaseSearchRefactor() {
  // form state
  const [search, setSearch] = useState({
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
  });

  // selected/current context
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // fetched lists
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [assets, setAssets] = useState([]);

  // derived lists for email/phone mode: split contacts by link
  const contactsLinked = useMemo(
    () => contacts.filter((c) => c.SiteAccountID != null),
    [contacts]
  );
  const contactsUnlinked = useMemo(
    () => contacts.filter((c) => !c.SiteAccountID),
    [contacts]
  );

  // loading flags
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // which path user is in
  const [mode, setMode] = useState("idle"); // idle | company | asset | emailphone

  const updateForm = (fields) => setSearch((prev) => ({ ...prev, ...fields }));

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateForm({ [id]: value });
  };

  const handleClearAll = () => {
    setSelectedCompany(null);
    setSelectedContact(null);
    setSelectedAsset(null);
    setCompanies([]);
    setContacts([]);
    setAssets([]);
    setMode("idle");
    updateForm({
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
    });
  };

  /** --------------------------------------------------------------
   * Search click → route to one of 3 primary modes
   * -------------------------------------------------------------- */
  const handleSearchClick = async () => {
    const { SerialNumber, Company, Email, Phone, Country } = search;

    if (!SerialNumber && !Company && !Email && !Phone) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        text: "Harap isi minimal satu field untuk pencarian.",
      });
      return;
    }

    setSelectedCompany(null);
    setSelectedContact(null);
    setSelectedAsset(null);

    // 1) SerialNumber path → show assets first
    if (SerialNumber) {
      setMode("asset");
      setLoadingAssets(true);
      try {
        const res = await ApiCustomer.get("/api/asset-information");
        const list = (res.data?.data || []).filter(
          (a) =>
            a.SerialNumber?.toLowerCase().includes(SerialNumber.toLowerCase()) ||
            a.product_information?.ProductName?.toLowerCase().includes(SerialNumber.toLowerCase())
        );
        setAssets(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAssets(false);
      }
      return;
    }

    // 2) Company path → show companies first
    if (Company) {
      setMode("company");
      setLoadingCompanies(true);
      try {
        const res = await ApiCustomer.get("/api/site_account");
        const list = (res.data?.data || []).filter((c) =>
          c.Company?.toLowerCase().includes(Company.toLowerCase())
        );
        setCompanies(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingCompanies(false);
      }
      return;
    }

    // 3) Email / Phone path → decide 3 sub-cases
    if (Email || Phone) {
      setMode("emailphone");
      const q = new URLSearchParams();
      if (Email) q.append("email", Email);
      if (Phone) q.append("phone", Phone);
      if (Country) q.append("country", Country);

      setLoadingContacts(true);
      setLoadingCompanies(true);
      try {
        const [c1, c2] = await Promise.all([
          ApiCustomer.get(`/api/contact-information?${q.toString()}`),
          ApiCustomer.get(`/api/site_account?${q.toString()}`),
        ]);
        setContacts(c1.data?.data || []);
        setCompanies(c2.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingContacts(false);
        setLoadingCompanies(false);
      }
      return;
    }
  };

  /** --------------------------------------------------------------
   * Selection handlers (cascade down/up)
   * -------------------------------------------------------------- */
  const onSelectCompany = async (company) => {
    setSelectedCompany(company);
    setSelectedContact(null);
    setSelectedAsset(null);

    // fetch affiliations: contacts + assets under this company
    setLoadingContacts(true);
    setLoadingAssets(true);
    try {
      const res = await ApiCustomer.get(
        `/api/site_account/check-company-affiliations?siteAccountId=${company.SiteAccountID}`
      );
      const { contacts: cts = [], assets: asts = [] } = res.data?.data || {};
      setContacts(cts);
      setAssets(asts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingContacts(false);
      setLoadingAssets(false);
    }
  };

  const onSelectContact = async (contact) => {
    setSelectedContact(contact);
    setSelectedAsset(null);

    // If contact linked to company but we don't have it selected yet, set it
    if (contact.SiteAccountID && !selectedCompany) {
      const map = byId(companies, "SiteAccountID");
      const maybeCompany = map.get(contact.SiteAccountID);
      if (maybeCompany) setSelectedCompany(maybeCompany);
    }

    // fetch contact affiliations → assets (+ maybe company)
    setLoadingAssets(true);
    try {
      const res = await ApiCustomer.get(
        `/api/contact-information/check-contacts-affiliation?contactID=${contact.ContactID}`
      );
      const { assets: asts = [], site_account: sa } = res.data?.data || {};
      setAssets(asts);
      if (sa && !selectedCompany) setSelectedCompany(sa);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAssets(false);
    }
  };

  const onSelectAsset = async (asset) => {
    setSelectedAsset(asset);

    // fetch asset details to auto-fill contact & company
    try {
      const res = await ApiCustomer.get(`/api/asset-information/${asset.AssetID}`);
      const data = res.data?.data;
      if (data?.contact_information) setSelectedContact(data.contact_information);
      if (data?.site_account) setSelectedCompany(data.site_account);
    } catch (e) {
      console.error(e);
    }
  };

  /** --------------------------------------------------------------
   * Render: Search form + Results hub
   * -------------------------------------------------------------- */
  return (
    <>
    <Tabs defaultValue="search" className="w-full">
      {/* SEARCH FORM */}
      <TabsContent value="search">
        <Card className="drop-shadow-md">
          <Button className="self-end mr-2" variant="ghost" onClick={handleClearAll}>
            Clear All
          </Button>
          <CardContent className="grid gap-5 grid-cols-3">
            <div className="space-y-0.5">
              <Label htmlFor="Email">Email</Label>
              <div className="relative flex items-center">
                <Search className="absolute right-2" />
                <Input id="Email" value={search.Email} onChange={handleInputChange} className="border-b-black p-1 pr-9" />
              </div>
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="SerialNumber">Serial Number</Label>
              <Input id="SerialNumber" value={search.SerialNumber} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="Phone">Phone</Label>
              <Input id="Phone" value={search.Phone} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5 flex flex-col">
              <Label htmlFor="Country">Country</Label>
              <Input id="Country" value={search.Country} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="Company">Company</Label>
              <Input id="Company" value={search.Company} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="City">City</Label>
              <Input id="City" value={search.City} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="ZipPostalCode">Zip/Postal</Label>
              <Input id="ZipPostalCode" value={search.ZipPostalCode} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            {/* Optional fields (kept for parity) */}
            <div className="space-y-0.5">
              <Label htmlFor="AssetTag">Asset Tag</Label>
              <Input id="AssetTag" value={search.AssetTag} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="ContractID">Contract Id</Label>
              <Input id="ContractID" value={search.ContractID} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="TransactionType">Transaction Type</Label>
              <Input id="TransactionType" value={search.TransactionType} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="TransactiontID">Transaction Id</Label>
              <Input id="TransactiontID" value={search.TransactiontID} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
            <div className="space-y-0.5">
              <Label htmlFor="Opsi">Opsi</Label>
              <Input id="Opsi" value={search.Opsi} onChange={handleInputChange} className="border-b-black p-1" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="secondary" className="bg-white drop-shadow-md border cursor-pointer w-40 h-11" onClick={handleSearchClick}>
              <p className="text-2xl mb-1">Search</p>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* RESULTS AREA */}
      {mode === "idle" ? (
        <p className="text-center mt-10">Fill the form and click Search</p>
      ) : (
        <div className="mt-4">
          {/* A. Company-first flow */}
          {mode === "company" && (
            <>
              <CompanySearchResult companies={companies} onSelectCompany={onSelectCompany} loading={loadingCompanies} />
              {selectedCompany && (
                <>
                  <ContactSearchResult contacts={contacts} onSelectContact={onSelectContact} loading={loadingContacts} />
                  <AssetSearchResult assets={assets} onSelectAsset={onSelectAsset} loading={loadingAssets} />
                </>
              )}
            </>
          )}

          {/* B. Asset-first flow */}
          {mode === "asset" && (
            <>
              <AssetSearchResult assets={assets} onSelectAsset={onSelectAsset} loading={loadingAssets} />
              {(selectedContact || selectedCompany) && (
                <>
                  {selectedCompany && (
                    <CompanySearchResult companies={[selectedCompany]} onSelectCompany={() => {}} />
                  )}
                  {selectedContact && (
                    <ContactSearchResult contacts={[selectedContact]} onSelectContact={onSelectContact} />
                  )}
                </>
              )}
            </>
          )}

          {/* C. Email/Phone flow */}
          {mode === "emailphone" && (
            <>
              {/* Case 1: email/phone belongs to a company */}
              {companies.length > 0 && (
                <CompanySearchResult companies={companies} onSelectCompany={onSelectCompany} loading={loadingCompanies} />
              )}

              {/* Case 2: email/phone belongs to contact with company → show companies (if any) and linked contacts */}
              {contactsLinked.length > 0 && (
                <ContactSearchResult title="Linked Contacts" contacts={contactsLinked} onSelectContact={onSelectContact} loading={loadingContacts} />
              )}

              {/* Case 3: email/phone belongs to contact w/o company → show the unlinked contacts and their assets on click */}
              {contactsUnlinked.length > 0 && (
                <ContactSearchResult title="Unlinked Contacts" contacts={contactsUnlinked} onSelectContact={onSelectContact} loading={loadingContacts} />
              )}

              {/* If a company/contact is chosen from above, also show their assets */}
              {(selectedCompany || selectedContact) && (
                <AssetSearchResult assets={assets} onSelectAsset={onSelectAsset} loading={loadingAssets} />)
              }
            </>
          )}
        </div>
      )}
      </Tabs>
    </>
  );
}
