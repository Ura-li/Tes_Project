import React, { useEffect, useMemo, useState } from "react";
import ApiCustomer from "@/api";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash-es";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Image as ImageIcon, Search } from "lucide-react";
import { format } from "date-fns";


// ----------------------------
// Typedefs
// ----------------------------

/**
 * @typedef {Object} ProductInfo
 * @property {string} ProductNumber
 * @property {string} ProductName
 * @property {string} [ProductLine]
 * @property {string} [vendor]
 * @property {number} [ProductTypeID]
 */

/**
 * @typedef {Object} AssetInfo
 * @property {number} AssetID
 * @property {string} SerialNumber
 * @property {string} ProductNumber
 * @property {ProductInfo} [product_information]
 * @property {number|null} [ContactID]
 * @property {number|null} [SiteAccountID]
 */

/**
 * @typedef {Object} ContactInfo
 * @property {number} ContactID
 * @property {string} FirstName
 * @property {string} LastName
 * @property {string|null} [Email]
 * @property {string|null} [Phone]
 * @property {string|null} [Mobile]
 * @property {string|null} [Country]
 * @property {string|null} [StateProvince]
 * @property {string|null} [City]
 * @property {string|null} [ZipPostalCode]
 * @property {number|null} [SiteAccountID]
 * @property {{Company:string}|null} [site_account]
 */

/**
 * @typedef {Object} SiteAccount
 * @property {number} SiteAccountID
 * @property {string} Company
 * @property {string|null} [Email]
 * @property {string|null} [PrimaryPhone]
 * @property {string|null} [WhatsappNo]
 * @property {string} AddressLine1
 * @property {string|null} [AddressLine2]
 * @property {string} City
 * @property {string|null} [StateProvince]
 * @property {string} Country
 * @property {string} ZipPostalCode
 */

/**
 * @typedef {Object} AccessoryRow
 * @property {string} id
 * @property {string} name
 * @property {string} note
 * @property {string} code
 */



// ----------------------------
// Types (Work on TSX Only)
// ----------------------------

// type ProductInfo = {
//   ProductNumber: string;
//   ProductName: string;
//   ProductLine?: string;
//   vendor?: string;
//   ProductTypeID?: number;
// };

// type AssetInfo = {
//   AssetID: number;
//   SerialNumber: string;
//   ProductNumber: string;
//   product_information?: ProductInfo;
//   ContactID?: number | null;
//   SiteAccountID?: number | null;
// };

// type ContactInfo = {
//   ContactID: number;
//   FirstName: string;
//   LastName: string;
//   Email?: string | null;
//   Phone?: string | null;
//   Mobile?: string | null;
//   Country?: string | null;
//   StateProvince?: string | null;
//   City?: string | null;
//   ZipPostalCode?: string | null;
//   SiteAccountID?: number | null;
//   site_account?: { Company: string } | null;
// };

// type SiteAccount = {
//   SiteAccountID: number;
//   Company: string;
//   Email?: string | null;
//   PrimaryPhone?: string | null;
//   WhatsappNo?: string | null;
//   AddressLine1: string;
//   AddressLine2?: string | null;
//   City: string;
//   StateProvince?: string | null;
//   Country: string;
//   ZipPostalCode: string;
// };

// type AccessoryRow = { id: string; name: string; note: string; code: string };

// ----------------------------
// Constants (Business Rules)
// ----------------------------

const CASE_TYPES = ["Bench", "Onsite", "DOA"];
const CASE_STATUS = [
  "NEW Assign to CE",
  "NEW Assign to Product Store",
  "New Assign to API",
  "Open",
  "Close",
  "InActive",
];
const WARRANTY_STATUS = ["In Warranty", "Out Warranty"];

// ----------------------------
// Helpers
// ----------------------------

/**
 * Join class names, filtering falsy values.
 * @param {...(string|false|undefined)} s
 * @returns {string}
 */
function classNames(...s) {
  return s.filter(Boolean).join(" ");
}

/**
 * Safely parse user id from JWT stored in localStorage under 'token'.
 * Returns null if token absent/invalid.
 * @returns {{id: any}|null}
 */
function getUserFromTokenSafe() {
  try {
    const raw = localStorage.getItem("token");
    if (!raw) return null;
    const payload = JSON.parse(atob(raw.split(".")[1]));
    return { id: payload?.id ?? payload?.userId };
  } catch {
    return null;
  }
}

// ----------------------------
// Component
// ----------------------------

/**
 * NewCaseForm component - one page create-case form with auto-fill from asset/customer/product.
 * @returns {JSX.Element}
 */
export default function NewCaseForm() {
  const navigate = useNavigate();

  // Global state
  const [loading, setLoading] = useState(false);

  // Step toggles (cards on a single page)
  const [showCustomerCard, setShowCustomerCard] = useState(false);
  const [showCompanySection, setShowCompanySection] = useState(false);
  const [showProductCard, setShowProductCard] = useState(false);
  const [showWarrantyCard, setShowWarrantyCard] = useState(false);
  const [showAccessoryCard, setShowAccessoryCard] = useState(false);
  const [showPhotoCard, setShowPhotoCard] = useState(false);
  const [showLogCard, setShowLogCard] = useState(false);

  // Case fields
  const [receivedDate, setReceivedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [caseIdManual, setCaseIdManual] = useState("");
  const [caseIdManualDate, setCaseIdManualDate] = useState("");
  const [referenceCase, setReferenceCase] = useState("");
  const [caseStatus, setCaseStatus] = useState("Open");
  const [caseType, setCaseType] = useState("Bench");
  const [problemDesc, setProblemDesc] = useState("");
  const [caseNote, setCaseNote] = useState("");
  const [kciFlag, setKciFlag] = useState(false);

  // Lookup: Asset by serial
  /** @type {[string, (val: string) => void]} */
  const [serialQuery, setSerialQuery] = useState("");

  /** @type {[AssetInfo[], (val: AssetInfo[]) => void]} */
  const [assetResults, setAssetResults] = useState([]);

  /** @type {[AssetInfo|null, (val: AssetInfo|null) => void]} */
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Lookup: Customer / Contact / Company
  const [customerQuery, setCustomerQuery] = useState("");

  /** @type {[ContactInfo[], (val: ContactInfo[]) => void]} */
  const [contactResults, setContactResults] = useState([]);

  /** @type {[SiteAccount[], (val: SiteAccount[]) => void]} */
  const [companyResults, setCompanyResults] = useState([]);

  /** @type {[ContactInfo|null, (val: ContactInfo|null) => void]} */
  const [selectedContact, setSelectedContact] = useState(null);

  /** @type {[SiteAccount|null, (val: SiteAccount|null) => void]} */
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Product fields
  const [productQuery, setProductQuery] = useState("");

  /** @type {[ProductInfo[], (val: ProductInfo[]) => void]} */
  const [productResults, setProductResults] = useState([]);

  /** @type {[ProductInfo|null, (val: ProductInfo|null) => void]} */
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productTower, setProductTower] = useState(""); // IPG/PSG
  const [productGroup, setProductGroup] = useState(""); // Commercial/Consumer
  const [productTypeId, setProductTypeId] = useState(undefined);
  const [productLine, setProductLine] = useState("");
  const [productNo, setProductNo] = useState("");
  const [productName, setProductName] = useState("");
  const [vendor, setVendor] = useState("");
  
  // Warranty
  const [warrantyStatus, setWarrantyStatus] = useState("");
  const [eowDate, setEowDate] = useState("");

  // Accessories
  /** @type {[AccessoryRow[], (val: AccessoryRow[]) => void]} */
  const [accessories, setAccessories] = useState([
    { id: crypto.randomUUID(), name: "", note: "", code: "" },
  ]);


  // Photos
  /** @type {[File[], (val: File[]) => void]} */
  const [photos, setPhotos] = useState([]);

  // Log notes (optional extra note besides CaseNote)
  const [logNote, setLogNote] = useState("");

  // ----------------------------
  // Debounced search handlers
  // ----------------------------

  /**
   * Search asset by serial (debounced).
   * Will set assetResults and show product card on success.
   * @param {string} q
   */
  const searchAsset = useMemo(
    () =>
      debounce(async (q) => {
        if (!q || q.length < 3) {
          setAssetResults([]);
          return;
        }
        try {
          const res = await ApiCustomer.get(`/api/asset-information`, {
            params: { serial: q },
          });
          const list = res.data?.data || [];
          setAssetResults(list);
          setShowProductCard(true);
        } catch (e) {
          console.error("Search asset failed", e);
          setAssetResults([]);
        }
      }, 400),
    []
  );

  /**
   * Search contacts and companies (debounced).
   * @param {string} q
   */
  const searchCustomer = useMemo(
    () =>
      debounce(async (q) => {
        if (!q || q.length < 2) {
          setContactResults([]);
          setCompanyResults([]);
          return;
        }
        try {
          // Try both contact & company search
          const [contacts, companies] = await Promise.all([
            ApiCustomer.get(`/api/contact-information`, { params: { q } }),
            ApiCustomer.get(`/api/site_account`, { params: { q } }),
          ]);
          setContactResults(contacts.data?.data || []);
          setCompanyResults(companies.data?.data || []);
        } catch (e) {
          console.error("Search customer failed", e);
          setContactResults([]);
          setCompanyResults([]);
        }
      }, 400),
    []
  );

  /**
   * Search products (debounced).
   * @param {string} q
   */
  const searchProduct = useMemo(
    () =>
      debounce(async (q) => {
        if (!q || q.length < 2) {
          setProductResults([]);
          return;
        }
        try {
          const res = await ApiCustomer.get(`/api/product-information`, {
            params: { q },
          });
          const list = res.data?.data || [];
          setProductResults(list);
        } catch (e) {
          console.error("Search product failed", e);
          setProductResults([]);
        }
      }, 400),
    []
  );

  // ----------------------------
  // Effects
  // ----------------------------

  // Auto-fill product when asset selected
  useEffect(() => {
    if (selectedAsset?.product_information) {
      const p = selectedAsset.product_information;
      setSelectedProduct(p);
      setProductNo(p.ProductNumber);
      setProductName(p.ProductName);
      setProductLine(p.ProductLine || "");
      setVendor(p.vendor || "");
      setProductTypeId(p.ProductTypeID);
      setShowProductCard(true);
    }
  }, [selectedAsset]);

  // Auto-fill customer when asset selected (if asset has owner)
  useEffect(() => {
    (async () => {
      if (selectedAsset?.ContactID) {
        try {
          const [cRes] = await Promise.all([
            ApiCustomer.get(`/api/contact-information`, {
              params: { id: selectedAsset.ContactID },
            }),
          ]);
          const c = cRes.data?.data?.[0];
          if (c) {
            setSelectedContact(c);
            if (c.SiteAccountID) {
              const sa = await ApiCustomer.get(`/api/site_account`, {
                params: { id: c.SiteAccountID },
              });
              const comp = sa.data?.data?.[0];
              if (comp) setSelectedCompany(comp);
            }
          }
        } catch (e) {
          console.error("Autofill customer failed", e);
        }
      }
    })();
  }, [selectedAsset]);

  // Enforce DOA case-type if another open case exists for the same asset
  const [mustDOA, setMustDOA] = useState(false);
  useEffect(() => {
    (async () => {
      if (!selectedAsset) return;
      try {
        const res = await ApiCustomer.get(`/api/case-information`, {
          params: { CaseStatus: "Open" },
        });
        const list = res.data?.data ?? [];
        const hasOpen = list.some((c) => c?.caseinformation?.AssetID === selectedAsset.AssetID);
        if (hasOpen) {
          setMustDOA(true);
          setCaseType("DOA");
        } else {
          setMustDOA(false);
        }
      } catch (e) {
        console.error("Check open case failed", e);
      }
    })();
  }, [selectedAsset]);

  // ----------------------------
  // EMSIFA Province / City (ID only)
  // ----------------------------
  /** @type {[any[], (val: any[]) => void]} */
  const [prov, setProv] = useState([]);

  /** @type {[any[], (val: any[]) => void]} */
  const [city, setCity] = useState([]);

  const [selectedProvId, setSelectedProvId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://dev.farizdotid.com/api/daerahindonesia/provinsi");
        const json = await res.json();
        setProv(json?.provinsi ?? []);
      } catch (e) {
        console.warn("EMSIFA provinces fetch failed");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedProvId) return;
      try {
        const res = await fetch(
          `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${selectedProvId}`
        );
        const json = await res.json();
        setCity(json?.kota_kabupaten ?? []);
      } catch (e) {
        console.warn("EMSIFA cities fetch failed");
      }
    })();
  }, [selectedProvId]);

  // ----------------------------
  // Accessory handlers
  // ----------------------------

  /**
   * Add an empty accessory row.
   */
  const addAccessory = () =>
    setAccessories((s) => [...s, { id: crypto.randomUUID(), name: "", note: "", code: "" }]);

  /**
   * Remove accessory row by id. Keeps at least one row.
   * @param {string} id
   */
  const removeAccessory = (id) =>
    setAccessories((s) => (s.length === 1 ? s : s.filter((r) => r.id !== id)));
  
  /**
   * Update accessory field.
   * @param {string} id
   * @param {"id"|"name"|"note"|"code"} key
   * @param {string} val
   */
  const updateAccessory = (id, key, val) =>
    setAccessories((s) => s.map((r) => (r.id === id ? { ...r, [key]: val } : r)));

  // ----------------------------
  // Photo handlers
  // ----------------------------

  /**
   * Handle file input change for photos.
   * @param {FileList|null} files
   */
  const onPickPhotos = (files) => {
    if (!files) return;
    setPhotos(Array.from(files));
  };

  // ----------------------------
  // Create Case
  // ----------------------------

  /**
   * Create a new case using selected asset/contact and other form fields.
   * Performs optional photo upload and action log creation.
   */
  const onCreateCase = async () => {
    if (!selectedAsset || !selectedContact) {
      alert("Please select both an Asset and a Contact before creating a case.");
      return;
    }
    setLoading(true);
    try {
      const user = getUserFromTokenSafe();

      // Filter out empty accessories (all empty fields)
      const filteredAccessories = accessories.filter(
        (a) => a.name.trim() || a.note.trim() || a.code.trim()
      );

      const payload = {
        AssetID: selectedAsset.AssetID,
        ContactID: selectedContact.ContactID,
        SiteAccountID: selectedCompany?.SiteAccountID ?? null,
        CaseSubject: problemDesc?.slice(0, 100) || "New Case",
        CaseType: caseType,
        KCI_Flag: kciFlag,
        IncomingChannel: "Email",
        CaseStatus: "Open",
        CasePriority: "Medium",
        CustomerSeverity: "Normal",
        CaseClosedDate: null,
        CaseNote: null,
        SymptomCode: null,
        CaseResolution: null,
        CreatedBy: user?.id,
        ProblemDescription: problemDesc,
        CaseNoteProduct: caseNote,
        ...(filteredAccessories.length > 0 && { accessories: filteredAccessories }),
      };

      const res = await ApiCustomer.post("/api/case-information", payload);
      const caseId = res.data?.data?.CaseID;

      // Optional: upload photos to a local endpoint if present
      if (photos.length > 0) {
        try {
          const fd = new FormData();
          photos.forEach((f) => fd.append("files", f));
          fd.append("caseId", caseId);
          await ApiCustomer.post("/api/uploads", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (e) {
          console.warn("Photo upload skipped/failed", e);
        }
      }

      // ActionLog
      try {
        await ApiCustomer.post("/api/actionlog", {
          CaseId: `${caseId}`,
          ReferenceId: `${caseId}`,
          model: "Case",
          dataOld: "New",
          dataNew: res.data?.data?.CaseStatus,
          changedBy: user?.id,
          logDescription: `New Case : ${caseId}`,
        });
      } catch (e) {
        console.warn("ActionLog failed", e);
      }

      // Navigate detail
      navigate(`/app/case/${caseId}`);
    } catch (e) {
      console.error(e);
      alert("There was an error creating the case.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Case</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">One-page</Badge>
          <Badge variant="secondary">Auto-fill</Badge>
          <Badge variant="outline">shadcn</Badge>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Search</CardTitle>
          <CardDescription>
            Mulai dari Serial Number atau Customer untuk auto-fill.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">Serial Number</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Type serial number..."
                value={serialQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setSerialQuery(v);
                  searchAsset(v);
                }}
              />
              <Button type="button" variant="outline" onClick={() => searchAsset.flush()}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {assetResults.length > 0 && (
              <div className="mt-2 rounded-xl border p-2 max-h-40 overflow-auto">
                {assetResults.map((a) => (
                  <button
                    key={a.AssetID}
                    type="button"
                    className={classNames(
                      "w-full text-left px-2 py-1.5 rounded hover:bg-muted",
                      selectedAsset?.AssetID === a.AssetID && "bg-muted"
                    )}
                    onClick={() => setSelectedAsset(a)}
                  >
                    <div className="font-medium">{a.SerialNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.product_information?.ProductName} · PN {a.ProductNumber}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="mb-1 block">Customer (name/email/phone/company)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Search customer or company..."
                value={customerQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setCustomerQuery(v);
                  searchCustomer(v);
                }}
              />
              <Button type="button" variant="outline" onClick={() => searchCustomer.flush()}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {(contactResults.length > 0 || companyResults.length > 0) && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded-xl border p-2 max-h-40 overflow-auto">
                  <div className="text-xs font-medium mb-1">Contacts</div>
                  {contactResults.map((c) => (
                    <button
                      key={c.ContactID}
                      type="button"
                      className={classNames(
                        "w-full text-left px-2 py-1.5 rounded hover:bg-muted",
                        selectedContact?.ContactID === c.ContactID && "bg-muted"
                      )}
                      onClick={() => setSelectedContact(c)}
                    >
                      <div className="font-medium">
                        {c.FirstName} {c.LastName}
                        {c.site_account?.Company ? (
                          <span className="text-xs text-muted-foreground"> · {c.site_account.Company}</span>
                        ) : null}
                      </div>
                      <div className="text-xs text-muted-foreground">{c.Email || c.Phone || c.Mobile || "-"}</div>
                    </button>
                  ))}
                </div>
                <div className="rounded-xl border p-2 max-h-40 overflow-auto">
                  <div className="text-xs font-medium mb-1">Companies</div>
                  {companyResults.map((s) => (
                    <button
                      key={s.SiteAccountID}
                      type="button"
                      className={classNames(
                        "w-full text-left px-2 py-1.5 rounded hover:bg-muted",
                        selectedCompany?.SiteAccountID === s.SiteAccountID && "bg-muted"
                      )}
                      onClick={() => setSelectedCompany(s)}
                    >
                      <div className="font-medium">{s.Company}</div>
                      <div className="text-xs text-muted-foreground">{s.City}, {s.Country}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Checkbox
                id="createCustomer"
                checked={showCustomerCard}
                onCheckedChange={(v) => setShowCustomerCard(Boolean(v))}
              />
              <Label htmlFor="createCustomer">Buat customer baru (jika tidak ditemukan)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1) Case Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>1) Case</CardTitle>
          <CardDescription>Diisi setelah pilih serial/customer.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Received Date</Label>
            <Input type="date" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
          </div>
          <div>
            <Label>Case ID Manual</Label>
            <Input value={caseIdManual} onChange={(e) => setCaseIdManual(e.target.value)} />
          </div>
          <div>
            <Label>Case ID Manual Date</Label>
            <Input type="date" value={caseIdManualDate} onChange={(e) => setCaseIdManualDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Reference Case</Label>
            <Input value={referenceCase} onChange={(e) => setReferenceCase(e.target.value)} />
          </div>
          <div>
            <Label>Case Status</Label>
            <Select value={caseStatus} onValueChange={setCaseStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select Case Status" />
              </SelectTrigger>
              <SelectContent>
                {CASE_STATUS.map((s) => (
                  <SelectItem value={s} key={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Case Type</Label>
            <Select value={caseType} onValueChange={setCaseType} disabled={mustDOA}>
              <SelectTrigger>
                <SelectValue placeholder="Select Case Type" />
              </SelectTrigger>
              <SelectContent>
                {CASE_TYPES.map((t) => (
                  <SelectItem value={t} key={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {mustDOA && (
              <p className="text-xs text-amber-600 mt-1">Ada case OPEN untuk asset ini. Case Type otomatis DOA dan tidak bisa diubah.</p>
            )}
          </div>
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mt-2">
              <Checkbox id="kci" checked={kciFlag} onCheckedChange={(v) => setKciFlag(Boolean(v))} />
              <Label htmlFor="kci">KCI Flag</Label>
            </div>
          </div>
          <div className="md:col-span-3">
            <Label>Problem Description</Label>
            <Textarea rows={3} value={problemDesc} onChange={(e) => setProblemDesc(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <Label>Case Note</Label>
            <Textarea rows={3} value={caseNote} onChange={(e) => setCaseNote(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* 2) Customer / Company */}
      {showCustomerCard && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>2) Customer / Company</CardTitle>
            <CardDescription>Isi data customer baru. Centang untuk include ke Company.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">Salutation</Label>
                  <div className="col-span-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Mr / Mrs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">Nama Customer</Label>
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">No. Telepon</Label>
                  <Input className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">No. Whatsapp</Label>
                  <Input className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">Email</Label>
                  <Input className="col-span-2" type="email" />
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">Alamat</Label>
                  <Input className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">Country</Label>
                  <Input className="col-span-2" placeholder="Indonesia / other" />
                </div>
                {/* Province/City (Indonesia via EMSIFA) */}
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">Province</Label>
                  <div className="col-span-2">
                    <Select onValueChange={(v) => setSelectedProvId(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province (ID)" />
                      </SelectTrigger>
                      <SelectContent>
                        {prov.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">City</Label>
                  <div className="col-span-2">
                    <Select onValueChange={(v) => setSelectedCityId(v)} disabled={!selectedProvId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {city.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <Label className="col-span-1">Zip Code</Label>
                  <Input className="col-span-2" />
                </div>
              </div>

              {/* Company (optional) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="incCompany"
                    checked={showCompanySection}
                    onCheckedChange={(v) => setShowCompanySection(Boolean(v))}
                  />
                  <Label htmlFor="incCompany">Termasuk dalam company</Label>
                </div>
                {showCompanySection && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Nama Company</Label>
                      <Input className="col-span-2" placeholder="Cari / isi nama company" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Email Company</Label>
                      <Input className="col-span-2" type="email" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Nomor Telepon</Label>
                      <Input className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Nomor WA</Label>
                      <Input className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Alamat</Label>
                      <Input className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Country</Label>
                      <Input className="col-span-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Province (ID)</Label>
                      <div className="col-span-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {prov.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.nama}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">City (ID)</Label>
                      <div className="col-span-2">
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="-">-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-center">
                      <Label className="col-span-1">Zip Code</Label>
                      <Input className="col-span-2" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3) Product */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>3) Product</CardTitle>
          <CardDescription>
            Auto dari Asset; atau cari Product Number/Name jika tidak ada Asset.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Serial No.</Label>
              <Input value={selectedAsset?.SerialNumber || serialQuery} readOnly={!!selectedAsset} onChange={(e) => setSerialQuery(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Check Product (Number/Name)</Label>
              <Input
                placeholder="Type product number or name..."
                value={productQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setProductQuery(v);
                  searchProduct(v);
                }}
              />
              {productResults.length > 0 && (
                <div className="mt-2 rounded-xl border p-2 max-h-40 overflow-auto">
                  {productResults.map((p) => (
                    <button
                      key={p.ProductNumber}
                      type="button"
                      className={classNames(
                        "w-full text-left px-2 py-1.5 rounded hover:bg-muted",
                        selectedProduct?.ProductNumber === p.ProductNumber && "bg-muted"
                      )}
                      onClick={() => {
                        setSelectedProduct(p);
                        setProductNo(p.ProductNumber);
                        setProductName(p.ProductName);
                        setProductLine(p.ProductLine || "");
                        setVendor(p.vendor || "");
                        setProductTypeId(p.ProductTypeID);
                      }}
                    >
                      <div className="font-medium">{p.ProductName}</div>
                      <div className="text-xs text-muted-foreground">PN {p.ProductNumber} · {p.ProductLine || "-"}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Product Tower</Label>
              <Select value={productTower} onValueChange={setProductTower}>
                <SelectTrigger>
                  <SelectValue placeholder="IPG / PSG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IPG">IPG</SelectItem>
                  <SelectItem value="PSG">PSG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Product Group</Label>
              <Select value={productGroup} onValueChange={setProductGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Commercial / Consumer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Product Line</Label>
              <Input value={productLine} onChange={(e) => setProductLine(e.target.value)} />
            </div>
            <div>
              <Label>Product No</Label>
              <Input value={productNo} onChange={(e) => setProductNo(e.target.value)} />
            </div>
            <div>
              <Label>Product Name</Label>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div>
              <Label>Vendor</Label>
              <Input value={vendor} onChange={(e) => setVendor(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4) Warranty */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>4) Warranty</CardTitle>
          <CardDescription>
            Mengikuti Asset Information; jika tidak ada, isi manual.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Warranty Status</Label>
            <Select value={warrantyStatus} onValueChange={setWarrantyStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select warranty status" />
              </SelectTrigger>
              <SelectContent>
                {WARRANTY_STATUS.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>EOW Date</Label>
            <Input type="date" value={eowDate} onChange={(e) => setEowDate(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* 5) Accessory */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>5) Accessory</CardTitle>
          <CardDescription>Opsional. Tambahkan baris sesuai kebutuhan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {accessories.map((row, idx) => (
            <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 md:col-span-4">
                <Label className="text-xs">Accessory Name</Label>
                <Input
                  value={row.name}
                  onChange={(e) => updateAccessory(row.id, "name", e.target.value)}
                  placeholder={`Accessory #${idx + 1}`}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <Label className="text-xs">Note</Label>
                <Input
                  value={row.note}
                  onChange={(e) => updateAccessory(row.id, "note", e.target.value)}
                />
              </div>
              <div className="col-span-10 md:col-span-1">
                <Label className="text-xs">CT/SN</Label>
                <Input value={row.code} onChange={(e) => updateAccessory(row.id, "code", e.target.value)} />
              </div>
              <div className="col-span-2 flex justify-end pt-5">
                <Button type="button" variant="ghost" size="icon" onClick={() => removeAccessory(row.id)} disabled={accessories.length === 1}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addAccessory}>
            <Plus className="w-4 h-4 mr-2" /> Add Row
          </Button>
        </CardContent>
      </Card>

      {/* 6) Photos */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>6) Foto</CardTitle>
          <CardDescription>Opsional. Disimpan lokal via endpoint upload.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input type="file" multiple accept="image/*" onChange={(e) => onPickPhotos(e.target.files)} />
            <Badge variant="outline" className="flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> {photos.length} selected
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 7) Log Note */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>7) Log Note</CardTitle>
          <CardDescription>Opsional.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea rows={3} placeholder="Additional log note (optional)" value={logNote} onChange={(e) => setLogNote(e.target.value)} />
        </CardContent>
      </Card>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur border-t py-3">
        <div className="max-w-6xl mx-auto flex justify-end gap-2 px-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="button" onClick={onCreateCase} disabled={loading || !selectedAsset || !selectedContact}>
            {loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
            ) : (
              "Create Case"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
