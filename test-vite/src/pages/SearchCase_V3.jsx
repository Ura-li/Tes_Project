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
import { SelectBarState } from "@/components/sc-select";
import { toast } from "sonner";



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
  const [caseSubject, setCaseSubject] = useState("");
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

  const [assetNotFound, setAssetNotFound] = useState(false);

  /** @type {[AssetInfo|null, (val: AssetInfo|null) => void]} */
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Lookup: Customer / Contact / Company
  const [customerQuery, setCustomerQuery] = useState("");

  /** @type {[ContactInfo[], (val: ContactInfo[]) => void]} */
  const [contactResults, setContactResults] = useState([]);

  const [contactNotFound, setContactNotFound] = useState(false);
  
  /** @type {[SiteAccount[], (val: SiteAccount[]) => void]} */
  const [companyResults, setCompanyResults] = useState([]);
  const [companyNotFound, setCompanyNotFound] = useState(false);

  /** @type {[ContactInfo|null, (val: ContactInfo|null) => void]} */
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactSalutation, setContactSalutation] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [contactAddressLine1, setContactAddressLine1] = useState("");
  const [contactStateProvince, setContactStateProvince] = useState("");
  const [contactCity, setContactCity] = useState("");
  const [contactCountry, setContactCountry] = useState("");
  const [contactZipPostalCode, setContactZipPostalCode] = useState("");
  
  const [provContact, setProvContact] = useState([]);
  const [cityContact, setCityContact] = useState([]);

  /** @type {[SiteAccount|null, (val: SiteAccount|null) => void]} */
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyWhatsapp, setCompanyWhatsapp] = useState("");
  const [companyAddressLine1, setCompanyAddressLine1] = useState("");
  const [companyStateProvince, setCompanyStateProvince] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [companyZipPostalCode, setCompanyZipPostalCode] = useState("");

  const [provCompany, setProvCompany] = useState([]);
  const [cityCompany, setCityCompany] = useState([]);


  // Product fields
  const [productQuery, setProductQuery] = useState("");

  /** @type {[ProductInfo[], (val: ProductInfo[]) => void]} */
  const [productResults, setProductResults] = useState([]);

  const [productTypeList, setProductTypeList] = useState([]);

  /** @type {[ProductInfo|null, (val: ProductInfo|null) => void]} */
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productTower, setProductTower] = useState(""); // IPG/PSG
  const [productGroup, setProductGroup] = useState(""); // Commercial/Consumer
  const [productTypeId, setProductTypeId] = useState(undefined);
  const [productLine, setProductLine] = useState("");
  const [productNo, setProductNo] = useState("");
  const [productName, setProductName] = useState("");
  const [vendor, setVendor] = useState("");

  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isNewAsset, setIsNewAsset] = useState(false);
  const [isNewContact, setIsNewContact] = useState(false);
  const [isNewCompany, setIsNewCompany] = useState(false);
  

  
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
        if (!q || q.length < 2) {
          setAssetResults([]);
          setAssetNotFound(false);
          return;
        }
        try {
          const res = await ApiCustomer.get(`/api/asset-information`, {
            params: { search: q },
          });
          const list = res.data?.data || [];
          setAssetResults(list);
          setAssetNotFound(list.length === 0);
          setShowProductCard(true);
        } catch (e) {
          console.error("Search asset failed",   e);
          setAssetResults([]);
          setAssetNotFound(true);
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

          setContactNotFound(false);
          setCompanyNotFound(false);
          return;
        }
        try {
          // Try both contact & company search
          const [contacts, companies] = await Promise.all([
            ApiCustomer.get(`/api/contact-information`, { params: { search: q } }),
            ApiCustomer.get(`/api/site_account`, { params: { search: q } }),
          ]);
          setContactResults(contacts.data?.data || []);
          setCompanyResults(companies.data?.data || []);

          const contactList = contacts.data?.data || [];
          const companyList = companies.data?.data || [];

          setContactResults(contactList);
          setCompanyResults(companyList);
          setContactNotFound(contactList.length === 0 && companyList.length === 0);
          setCompanyNotFound(companyList.length === 0);
        } catch (e) {
          console.error("Search customer failed", e);
          setContactResults([]);
          setCompanyResults([]);

          setContactNotFound(true);
          setCompanyNotFound(true);
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
            params: { search: q },
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

  /**
   * Search products type.
   * @param {string} q
   */

  // List ProductType untuk dropdown
  const [productTypes, setProductTypes] = useState([]);

  // Fetch product types when tower/group changes
  useEffect(() => {
    if (productTower && productGroup) {
      fetchProductTypes(productTower, productGroup);
    } else {
      setProductTypeList([]);
    }
  }, [productTower, productGroup]);

  // Fetch product types from API
  const fetchProductTypes = async (tower, group) => {
    try {
      const response = await ApiCustomer.get(`/api/product-type`, {
        params: { ProductTower: tower, ProductGroup: group },
      });
      console.log("Product Type List : ",response);
      setProductTypeList(response.data.data || []);
    } catch (err) {
      setProductTypeList([]);
    }
  };

    // ----------------------------
    // Effects
    // ----------------------------


    // Auto-fill company when company field selected
    useEffect(() => {
      if(selectedCompany?.Company){
        const cm = selectedCompany;
        setCompanyName(cm.Company);
        setCompanyEmail(cm.Email);
        setCompanyPhone(cm.PrimaryPhone);
        setCompanyWhatsapp(cm.WhatsappNo);
        setCompanyAddressLine1(cm.AddressLine1);
        
        //emsifa reverse engineer
        // Province (convert string -> object)
        const provObj = provCompany.find((p) => p.name === cm.StateProvince);
        setCompanyStateProvince(provObj ? provObj : { id: "", name: cm.StateProvince });

        // City (convert string -> object) -> city list harus sesuai province id
        if (provObj?.id) {
          (async () => {
            const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provObj.id}.json`);
            const cityList = await res.json();
            const cityObj = cityList.find((c) => c.name === cm.City);
            setCompanyCity(cityObj ? cityObj : { id: "", name: cm.City });
          })();
        } else {
          setCompanyCity({ id: "", name: cm.City });
        }

        setCompanyCountry(cm.Country);
        setCompanyZipPostalCode(cm.ZipPostalCode);
      }
    },[selectedCompany])

    // Auto-fill Contact when Company field selected 
    useEffect(() =>{
      (async () => {
        if (!selectedCompany) return;
        try {
          const resContactAffiliated = await ApiCustomer.get(`/api/contact-information?SiteAccountID=${selectedCompany.SiteAccountID}`);
          const listContactAffiliated = resContactAffiliated.data.data || []
          setContactResults(listContactAffiliated); 
        } catch (err) {
          console.error(err);
        }
      })();
    },[selectedCompany])

    // Auto-fill product when asset selected
    useEffect(() => {
      if (selectedAsset?.product_information) {
        console.log("selected asset ",selectedAsset)
        const p = selectedAsset.product_information;
        setSelectedProduct(p);
        setProductNo(p.ProductNumber);
        setProductName(p.ProductName);
        setProductLine(p.ProductLine || "");
        setVendor(p.vendor || "");
        if (p.product_type) {
          setProductTower(p.product_type.ProductTower || "");
          setProductGroup(p.product_type.ProductGroup || "");
          setProductTypeId(p.product_type.ProductTypeID?.toString() || "");
        } else {
          setProductTypeId(p.ProductTypeID?.toString() || "");
        }
        setShowProductCard(true);
      }
    }, [selectedAsset]);

    // Auto-fill customer when asset selected (if asset has owner)
    useEffect(() => {
      (async () => {
        if (!selectedAsset) return;
        if (selectedAsset?.ContactID) {
          try {
            const [cRes] = await Promise.all([
              ApiCustomer.get(`/api/contact-information/${selectedAsset.ContactID}`),
            ]);
            const c = cRes.data?.data;
            if (c) {
              setSelectedContact(c);
              if (c.SiteAccountID) {
                setShowCompanySection(true);
                const sa = await ApiCustomer.get(`/api/site_account/${c.SiteAccountID}`);
                const comp = sa.data?.data;
                
                if (comp) setSelectedCompany(comp);
              }else{
                setSelectedCompany([]);
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
    

    // Auto-fill customer when customer field selected
    useEffect(() =>{
      if(selectedContact?.ContactID){
        const ct = selectedContact;
        setContactSalutation(ct.Salutation);
        setContactFirstName(ct.FirstName);
        setContactLastName(ct.LastName);
        setContactEmail(ct.Email);
        setContactPhone(ct.Phone);
        setContactMobile(ct.Mobile);
        setContactAddressLine1(ct.AddressLine1);
      

        // setContactStateProvince(ct.StateProvince || "");
        // setContactCity(ct.City || "");

        const provObj = provContact.find((p) => p.name === ct.StateProvince);
        setContactStateProvince(provObj ? provObj : { id: "", name: ct.StateProvince });
        console.log(provObj)
        console.log(ct.StateProvince)

        // City (convert string -> object) -> city list harus sesuai province id
        if (provObj?.id) {
          (async () => {
            const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provObj.id}.json`);
            const cityList = await res.json();
            const cityObj = cityList.find((c) => c.name === ct.City);
            setContactCity(cityObj ? cityObj : { id: "", name: ct.City });
          })();
        } else {
          setContactCity({ id: "", name: ct.City });
        }

        
        setContactCountry(ct.Country);
        setContactZipPostalCode(ct.ZipPostalCode);
      }
    },[selectedContact])


    // Auto-fill Company when contact selected (if any)
    useEffect(() => {
      (async () => {
        if (!selectedContact) return;
        try { 
          if (selectedContact?.SiteAccountID) {
            setShowCompanySection(true);
            const sa = await ApiCustomer.get(`/api/site_account/${selectedContact.SiteAccountID}`);
            const comp = sa.data?.data;
            
            if (comp) setSelectedCompany(comp);
          }else{
            setSelectedCompany([]);
          }  
        } catch (err) {
          console.error(err);
          
        }
      })();
    }, [selectedContact])

    // Auto-fill product when contact selected (asset owned by contact)
    useEffect(() => {
      (async () => {
        if (!selectedContact) return;
        try {
          const checkAssetAffiliatedContact = await ApiCustomer.get(`/api/asset-information?ContactID=${selectedContact.ContactID}`)
          const listAffiliatedAsset = checkAssetAffiliatedContact.data.data || [];
          console.log(selectedContact, listAffiliatedAsset)
          setAssetResults(listAffiliatedAsset);
        } catch (err) {
          console.error(err);
        }
      })()
    }, [selectedContact]);

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
        const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
        const json = await res.json();
        setProvContact(json ?? []);
        setProvCompany(json ?? []);
        console.log("Province :",res)
        console.log("json :",json)
      } catch (e) {
        console.warn("EMSIFA provinces fetch failed");
      }
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      if (!contactStateProvince?.id) {
        setCityContact([]);
        return;
      }
      try {
        const res = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${contactStateProvince.id}.json`
        );
        const json = await res.json();
        setCityContact(json ?? []);
      } catch {
        setCityContact([]);
      }
    })();
  }, [contactStateProvince]);

  useEffect(() => {
    (async () => {
      if (!companyStateProvince?.id) {
        setCityCompany([]);
        return;
      }
      try {
        const res = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${companyStateProvince.id}.json`
        );
        const json = await res.json();
        setCityCompany(json ?? []);
      } catch {
        setCityCompany([]);
      }
    })();
  }, [companyStateProvince]);



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
    if ((!selectedAsset && !isNewAsset) || (!selectedContact && !isNewContact)) {
      alert("Please select or Create both an Asset and a Contact before creating a case.");
      return;
    }
    setLoading(true);
    try {
      const user = getUserFromTokenSafe();

      // Filter out empty accessories (all empty fields)
      const filteredAccessories = accessories.filter(
        (a) => a.name.trim() || a.note.trim() || a.code.trim()
      );

      let assetId = selectedAsset?.AssetID;
      let productId = selectedProduct?.ProductNumber;
      let companyId = selectedCompany?.SiteAccountID;
      let contactId = selectedContact?.ContactID;
      
      if(isNewProduct){
        const productRes = await ApiCustomer.post("/api/product-information",{
          ProductNumber: productNo,
          ProductName: productName,
          ProductLine: productLine,
          vendor: vendor,
          ProductTypeID: parseInt(productTypeId)
        })
        productId = productRes.data?.data?.ProductNumber
      }

      

      if(isNewContact && showCompanySection){
        const companyRes = await ApiCustomer.post("/api/site_account", {
          Company: companyName,
          Email: companyEmail,
          PrimaryPhone: companyPhone,
          WhatsappNo: companyWhatsapp,
          AddressLine1: companyAddressLine1,
          City: companyCity.name, // --> emsifa
          StateProvince: companyStateProvince.name, // --> emsifa
          Country: companyCountry,
          ZipPostalCode: companyZipPostalCode
        })
        companyId = companyRes.data?.data?.SiteAccountID;
      }

      

      if(isNewContact){
        const contactRes = await ApiCustomer.post("/api/contact-information",{
          SiteAccountID: companyId,
          Salutation: contactSalutation,
          FirstName: contactFirstName,
          LastName: contactLastName,
          Email: contactEmail,
          Phone: contactPhone,
          Mobile: contactMobile,
          AddressLine1: contactAddressLine1,
          City: contactCity.name, // --> emsifa
          StateProvince: contactStateProvince.name, // --> emsifa
          Country: contactCountry,
          ZipPostalCode: contactZipPostalCode
        })
        contactId = contactRes.data?.data?.ContactID;
      }

      if(isNewAsset){
        // const [assetContactId, setAssetContactId] = useState(null)
        // const [assetSiteAccountId, setAssetSiteAccountId] = useState(null)
        // if(showCompanySection && isNewContact) {
        //   setAssetSiteAccountId(companyId);
        // } else if(selectedCompany.SiteAccountID) { setAssetSiteAccountId(selectedCompany?.SiteAccountID) }

        // if(isNewContact) { 
        //   setAssetContactId(contactId); 
        // } else if(selectedContact.ContactID) { setAssetContactId(selectedContact?.ContactID) }
        const assetRes = await ApiCustomer.post("/api/asset-information", {
          SerialNumber: serialQuery,
          ProductNumber: productId,
          ContactID: contactId ?? null ,
          SiteAccountID: companyId ?? null
        })
        assetId = assetRes.data?.data?.AssetID
      }

      const payload = {
        AssetID: assetId,
        ContactID: contactId,
        SiteAccountID: companyId ?? null,
        CaseSubject: caseSubject,
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
      toast.warning(e.response.data.message, {
        position: "top-center",
        // className: "p-5"
      })
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------

  return (
    <div className="bg-[#F8F9FA] mx-auto  p-6 space-y-8">
      {/* Header */}
      {/* <div className="flex items-center justify-between pb-4 border-b"> */}
      <div className="sticky top-[3.25rem] z-30  bg-[#0077B6] rounded-b-xl border-b p-3 flex flex-wrap gap-2 justify-between">
        <h1 className="text-2xl font-bold ">Create Case </h1>
          <div className="flex gap-4">
            <a href="#case"><Badge className={'p-2 hover:bg-secondary  rounded-lg border border-cyan-400 px-4 py-2 font-semibold text-cyan-400'} variant="outline">Case</Badge></a>
            <a href="#customer"><Badge className={'p-2 hover:bg-secondary  rounded-lg border border-cyan-400 px-4 py-2 font-semibold text-cyan-400'} variant="outline">Customer</Badge></a>
            <a href="#product"><Badge className={'p-2 hover:bg-secondary  rounded-lg border border-cyan-400 px-4 py-2 font-semibold text-cyan-400'} variant="outline">Product</Badge></a>
            <a href="#warranty"><Badge className={'p-2 hover:bg-secondary  rounded-lg border border-cyan-400 px-4 py-2 font-semibold text-cyan-400'} variant="outline">Warranty</Badge></a>
            <a href="#accessories"><Badge className={'p-2 hover:bg-secondary  rounded-lg border border-cyan-400 px-4 py-2 font-semibold text-cyan-400'} variant="outline">Accessories</Badge></a>
            <a href="#photos"><Badge className={'p-2 hover:bg-secondary  rounded-lg border border-cyan-400 px-4 py-2 font-semibold text-cyan-400'} variant="outline">Photos</Badge></a>
            <a href="#notes"><Badge className={'p-2 hover:bg-secondary  rounded-lg border border-cyan-400 px-4 py-2 font-semibold text-cyan-400'} variant="outline">Notes</Badge></a>
          </div>
        </div>
      {/* </div> */}
      

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT MAIN FORM */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
          {/* Quick Search */}
          <Card>
            <CardHeader className="flex items-center gap-2 border-b pb-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">0</div>
              <div>
                <CardTitle>Quick Search</CardTitle>
                <CardDescription>Mulai dari Serial Number atau Customer untuk auto-fill.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
              {/* Serial Number Search */}
              <div className="space-y-2">
                <Label>Serial Number</Label>
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
                  <Button variant="outline" type="button" onClick={() => searchAsset.flush()}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Results */}
                {assetResults.length > 0 ? (
                  <div className="mt-2 divide-y rounded-md border bg-card max-h-40 overflow-auto">
                    {assetResults.map((a) => (
                      <button
                        key={a.AssetID}
                        type="button"
                        className={classNames(
                          "w-full text-left px-3 py-2 hover:bg-accent/40",
                          selectedAsset?.AssetID === a.AssetID && "bg-accent/70"
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
                ) : assetNotFound ? (
                  <div className="mt-2 text-sm text-muted-foreground">
                    ❌ Data asset tidak ditemukan
                  </div>
                ) : null}

                {/* Checkbox */}
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id="isNewAsset"
                    checked={isNewAsset}
                    onCheckedChange={(v) => {
                      setIsNewAsset(Boolean(v));
                      if (v) {
                        document.getElementById("product")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }
                    }
                  />
                  <Label htmlFor="isNewAsset">Buat Asset Baru</Label>
                </div>
              </div>

              {/* Customer Search */}
              <div className="space-y-2">
                <Label>Customer (name/email/phone/company)</Label>
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
                  <Button variant="outline" type="button" onClick={() => searchCustomer.flush()}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Results */}
                {(contactResults.length > 0 || companyResults.length > 0) ? (
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Contacts */}
                    <div className="rounded-md border bg-card max-h-40 overflow-auto divide-y">
                      <div className="px-2 py-1 text-xs font-medium">Contacts</div>
                      {contactResults.map((c) => (
                        <button
                          key={c.ContactID}
                          type="button"
                          className={classNames(
                            "w-full text-left px-3 py-2 hover:bg-accent/40",
                            selectedContact?.ContactID === c.ContactID && "bg-accent/70"
                          )}
                          onClick={() => setSelectedContact(c)}
                        >
                          <div className="font-medium">
                            {c.FirstName} {c.LastName}
                            {c.site_account?.Company && (
                              <span className="text-xs text-muted-foreground"> · {c.site_account.Company}</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{c.Email || c.Phone || "-"}</div>
                        </button>
                      ))}
                    </div>

                    {/* Companies */}
                    <div className="rounded-md border bg-card max-h-40 overflow-auto divide-y">
                      <div className="px-2 py-1 text-xs font-medium">Companies</div>
                      {companyResults.map((s) => (
                        <button
                          key={s.SiteAccountID}
                          type="button"
                          className={classNames(
                            "w-full text-left px-3 py-2 hover:bg-accent/40",
                            selectedCompany?.SiteAccountID === s.SiteAccountID && "bg-accent/70"
                          )}
                          onClick={() => setSelectedCompany(s)}
                        >
                          <div className="font-medium">{s.Company}</div>
                          <div className="text-xs text-muted-foreground">{s.City}, {s.Country}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ): contactNotFound ? (
                  <div className="mt-2 text-sm text-muted-foreground">
                    ❌ Customer / Company tidak ditemukan
                  </div>
                ): null}

                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id="createCustomer"
                    checked={isNewContact}
                    onCheckedChange={(v) => 
                    {
                      setIsNewContact(Boolean(v));
                      if (v) {
                        document.getElementById("customer")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
  }
                    }
                  />
                  <Label htmlFor="createCustomer">Buat customer baru (jika tidak ditemukan)</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1) Case Section */}
          <Card className="rounded-2xl p-[20px]  shadow-2xl col-span-3   scroll-mt-[120px]" id='case'>
            <CardHeader>
              <CardTitle>1) Case</CardTitle>
              <CardDescription>Diisi setelah pilih serial/customer.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Case Subject <Label className="text-red-600">*</Label></Label>
                <Input type="text" value={caseSubject} onChange={(e) => setCaseSubject(e.target.value)} />
              </div>
              <div>
                <Label>Received Date <Label className="text-red-600">*</Label></Label>
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
                <Label>Case Status <Label className="text-red-600">*</Label></Label>
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
                <Label>Case Type <Label className="text-red-600">*</Label></Label>
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
                  <p className="text-xs text-amber-600 mt-1">Ada case OPEN untuk asset ini. Case Type otomatis DOA dan tidak
                    bisa diubah.</p>
                )}
              </div>
              <div className="md:col-span-3">
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="kci" checked={kciFlag} onCheckedChange={(v) => setKciFlag(Boolean(v))} />
                  <Label htmlFor="kci">KCI Flag</Label>
                </div>
              </div>
              <div className="md:col-span-3">
                <Label>Problem Description <Label className="text-red-600">*</Label></Label>
                <Textarea rows={3} value={problemDesc} onChange={(e) => setProblemDesc(e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <Label>Case Note <Label className="text-red-600">*</Label></Label>
                <Textarea rows={3} value={caseNote} onChange={(e) => setCaseNote(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          {/* 2) Customer / Company */}
          <Card className="rounded-2xl p-[20px]  shadow-2xl col-span-3   scroll-mt-[120px]" id='customer'>
            <CardHeader>
              <CardTitle>2) Customer / Company</CardTitle>
              <CardDescription>Isi data customer baru. Centang untuk include ke Company.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">Salutation<Label className="text-red-600">*</Label></Label>
                    <div className="col-span-2">
                      <Select value={contactSalutation} onValueChange={setContactSalutation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Mr / Mrs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mr.">Mr</SelectItem>
                          <SelectItem value="Mrs.">Mrs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">Nama Customer<Label className="text-red-600">*</Label></Label>
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <Input placeholder="First Name" value={contactFirstName} onChange={(e) => setContactFirstName(e.target.value)} />
                      <Input placeholder="Last Name" value={contactLastName} onChange={(e) => setContactLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">No. Telepon<Label className="text-red-600">*</Label></Label>
                    <Input className="col-span-2" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">No. Whatsapp</Label>
                    <Input className="col-span-2" value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">Email<Label className="text-red-600">*</Label></Label>
                    <Input className="col-span-2" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                  </div>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">Alamat<Label className="text-red-600">*</Label></Label>
                    <Input className="col-span-2" value={contactAddressLine1} onChange={(e) => setContactAddressLine1(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">Country<Label className="text-red-600">*</Label></Label>
                    <Input className="col-span-2" placeholder="Indonesia / other" value={contactCountry} onChange={(e) => setContactCountry(e.target.value)} />
                  </div>
                  {/* Province/City (Indonesia via EMSIFA) */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">Province<Label className="text-red-600">*</Label></Label>
                    <div className="col-span-2">
                      <SelectBarState
                        id="contactStateProvince"
                        value={contactStateProvince}
                        onChange={setContactStateProvince}
                        options={provContact}
                        placeholder="Select a Province"
                      />

                      {/* <SelectBar
                            id="StateProvince"
                            value={contactStateProvince.name}
                            onChange={setContactStateProvince}
                            options={prov}
                            placeholder="Select a Province"
                          /> */}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">City<Label className="text-red-600">*</Label></Label>
                    <div className="col-span-2">
                      <SelectBarState
                        id="contactCity"
                        value={contactCity}
                        onChange={setContactCity}
                        options={cityContact}
                        placeholder="Select a City"
                        disabled={!contactStateProvince || cityContact.length === 0}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="col-span-1">Zip Code<Label className="text-red-600">*</Label></Label>
                    <Input className="col-span-2" value={contactZipPostalCode} onChange={(e) => setContactZipPostalCode(e.target.value)} />
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
                        <Label className="col-span-1">Nama Company<Label className="text-red-600">*</Label></Label>
                        <Input className="col-span-2" placeholder="Cari / isi nama company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">Email Company<Label className="text-red-600">*</Label></Label>
                        <Input className="col-span-2" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">Nomor Telepon<Label className="text-red-600">*</Label></Label>
                        <Input className="col-span-2" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">Nomor WA</Label>
                        <Input className="col-span-2" value={companyWhatsapp} onChange={(e) => setCompanyWhatsapp(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">Alamat<Label className="text-red-600">*</Label></Label>
                        <Input className="col-span-2" value={companyAddressLine1} onChange={(e) => setCompanyAddressLine1(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">Country<Label className="text-red-600">*</Label></Label>
                        <Input className="col-span-2" value={companyCountry} onChange={(e) => setCompanyCountry(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">Province (ID)<Label className="text-red-600">*</Label></Label>
                        <div className="col-span-2">
                          <SelectBarState
                            id="CompanyStateProvince"
                            value={companyStateProvince}
                            onChange={setCompanyStateProvince}
                            options={provCompany}
                            placeholder="Select a Province"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">City (ID)<Label className="text-red-600">*</Label></Label>
                        <div className="col-span-2">
                          <SelectBarState
                            id="CompanyCity"
                            value={companyCity}
                            onChange={setCompanyCity}
                            options={cityCompany}
                            placeholder="Select a City"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <Label className="col-span-1">Zip Code<Label className="text-red-600">*</Label></Label>
                        <Input className="col-span-2" value={companyZipPostalCode} onChange={(e) => setCompanyZipPostalCode(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* {showCustomerCard && (
              )} */}
          {/* 3) Product */}
          <Card className="rounded-2xl p-[20px]  shadow-2xl col-span-3   scroll-mt-[120px]" id='product'>
            <CardHeader>
              <CardTitle>3) Product</CardTitle>
              <CardDescription>
                Auto dari Asset; atau cari Product Number/Name jika tidak ada Asset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Serial No.<Label className="text-red-600">*</Label></Label>
                  <Input value={selectedAsset?.SerialNumber || serialQuery} readOnly={!!selectedAsset} onChange={(e) => setSerialQuery(e.target.value)} />
                  <Button variant="link" asChild>
                    <a
                      href="https://support.hp.com/id-en/check-warranty"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Check Warranty
                    </a>
                  </Button>

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
                  <div className="mt-2 flex items-center gap-2">
                    <Checkbox
                      id="isNewProduct"
                      checked={isNewProduct}
                      onCheckedChange={(v) => setIsNewProduct(Boolean(v))}
                    />
                    <Label htmlFor="isNewProduct">Buat Product Baru</Label>
                  </div>
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
                  <Label>Product Tower<Label className="text-red-600">*</Label></Label>
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
                  <Label>Product Group<Label className="text-red-600">*</Label></Label>
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
                {productTower && productGroup && (
                  <div>
                    <Label>Product Type *</Label>
                    <Select
                      value={productTypeId || null}
                      onValueChange={setProductTypeId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Product Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypeList.map((type) => (
                          <SelectItem key={type.ProductTypeID} value={type.ProductTypeID.toString()}>
                            {type.ProductType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Product Line<Label className="text-red-600">*</Label></Label>
                  <Input value={productLine} onChange={(e) => setProductLine(e.target.value)} />
                </div>
                <div>
                  <Label>Product No<Label className="text-red-600">*</Label></Label>
                  <Input value={productNo} onChange={(e) => setProductNo(e.target.value)} />
                </div>
                <div>
                  <Label>Product Name<Label className="text-red-600">*</Label></Label>
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
          <Card className="rounded-2xl p-[20px]  shadow-2xl col-span-3   scroll-mt-[120px]" id='warranty'>
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
          <Card className="rounded-2xl p-[20px]  shadow-2xl col-span-3   scroll-mt-[120px]" id='accessories'>
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
          <Card className="rounded-2xl p-[20px]  shadow-2xl col-span-3   scroll-mt-[120px]" id='photos'>
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
          <Card className="rounded-2xl p-[20px]  shadow-2xl col-span-3   scroll-mt-[120px]" id='notes'>
            <CardHeader>
              <CardTitle>7) Log Note</CardTitle>
              <CardDescription>Opsional.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea rows={3} placeholder="Additional log note (optional)" value={logNote} onChange={(e) => setLogNote(e.target.value)} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SUMMARY PANEL */}
        <aside className="hidden lg:block col-span-3 sticky top-30 h-fit space-y-4">
            {/* Show compact summary cards after selection */}
            {selectedCompany && (
              <Card>
                <CardHeader><CardTitle>Selected Company</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-medium">{selectedCompany.Company}</p>
                  <p className="text-xs text-muted-foreground">{selectedCompany.Email || selectedCompany.PrimaryPhone}</p>
                </CardContent>
              </Card>
            )}
            {selectedContact && (
              <Card>
                <CardHeader><CardTitle>Selected Customer</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-medium">{selectedContact.FirstName} {selectedContact.LastName}</p>
                  <p className="text-xs text-muted-foreground">{selectedContact.Email || selectedContact.Phone}</p>
                </CardContent>
              </Card>
            )}
            {selectedAsset && (
              <Card>
                <CardHeader><CardTitle>Selected Asset</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-medium">{selectedAsset.SerialNumber}</p>
                  <p className="text-xs text-muted-foreground">{selectedAsset.product_information?.ProductName}</p>
                </CardContent>
              </Card>
            )}
            {selectedProduct && (
              <Card>
                <CardHeader><CardTitle>Selected Product</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-medium">{selectedProduct.ProductName}</p>
                  <p className="text-xs text-muted-foreground">PN {selectedProduct.ProductNumber}</p>
                </CardContent>
              </Card>
            )}
        </aside>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background/90 backdrop-blur border-t py-3">
        <div className="max-w-7xl mx-auto flex justify-end gap-3 px-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onCreateCase} disabled={loading || (!selectedAsset && !isNewAsset) || (!selectedContact && !isNewContact)}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Create Case"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}