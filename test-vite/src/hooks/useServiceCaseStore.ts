// useServiceCaseStore.ts
import { create } from "zustand";
import { toast } from "sonner";
import Swal from "sweetalert2";
import ApiCustomer from "../api";
import { getUserFromToken } from "../lib/utils/auth";

// --- small helper ---
const hasAnyNonEmptyValue = (obj: any = {}) =>
  Object.values(obj).some(
    (v) => v !== undefined && v !== null && String(v).trim() !== ""
  );

interface ServiceCaseState {
  // core
  caseDetails: any | null;

  // forms
  caseForm: any;
  gtcForm: any;
  csrForm: any;
  entitlementStatus: any;
  productForm: any;
  caseNoteFormData: any;
  dpDataForm: any;
  dpList: {
    tempId: string;           
    InvoiceNo: string | null; 
    DpAmount: string;
    DpDate: string | null;
    PaymentType: string;
    DpNote: string;
    isPersisted?: boolean;    
  }[];


  // other UI-ish state
  selectedSymptom: any | null;

  // fetched data
  notesList: any[];
  customerData: {
    MainAccount: any | null;
    SiteAccount: any | null;
    Type: string | null;
  };
  assetInformation: any | null;
  ownerUserData: any | null;
  workOrders: any[];
  materialOrders: any[];
  actionLogs: any[];
  otcCode: any[];

  // invoice / quotation
  invoiceData: any | null;
  invoiceLoading: boolean;
  quotationInitialData: any | null;

  dpLoading: boolean;

  // UI flags
  refreshFetchPage: boolean;
  openWorkOrder: boolean;
  serviceCatalogType: string;
  openDialogQuotation: boolean;
  invoiceDialogOpen: boolean;
  signature: string | null;

  // ---- actions ----
  initFromCaseDetails: (caseDetails: any) => void;

  setCaseFormField: (field: string, value: any) => void;
  setGtcFormField: (field: string, value: any) => void;
  setCsrFormField: (field: string, value: any) => void;
  setEntitlementField: (field: string, value: any) => void;
  setProductFormField: (field: string, value: any) => void;
  setCaseNoteField: (field: string, value: any) => void;
  
  
  setSelectedSymptom: (value: any) => void;

  setSignature: (sig: string | null) => void;
  toggleRefresh: () => void;
  setOpenWorkOrder: (open: boolean, type?: string) => void;
  setOpenDialogQuotation: (open: boolean) => void;
  setInvoiceDialogOpen: (open: boolean) => void;
  setOwnerUserData: (data: any) => void;
  
  setDpFormData: (field: string, value: any) => void;
  addDpRow: () => void;
  removeDpRow: (tempId: string) => void;
  setDpField: (tempId: string, field: string, value: any) => void;

  // fetchers
  fetchCustomerData: () => Promise<void>;
  fetchAssetInformation: () => Promise<void>;
  fetchCaseNotes: () => Promise<void>;
  fetchOwnerUserData: () => Promise<void>;
  fetchWorkOrders: () => Promise<void>;
  fetchMaterialOrders: () => Promise<void>;
  fetchGtc: () => Promise<void>;
  fetchCsr: () => Promise<void>;
  fetchCase: () => Promise<void>;
  fetchActionLog: () => Promise<void>;
  fetchOtcCode: () => Promise<void>;
  fetchInvoiceData: () => Promise<void>;
  fetchDPData: () => Promise<void>;

  // save
  saveAll: (opts?: { redirect?: boolean }) => Promise<boolean>;

  //DP 
}

export const useServiceCaseStore = create<ServiceCaseState>((set, get) => ({
  // ------------ initial state --------------
  caseDetails: null,

  caseForm: {
    CaseType: "",
    CaseStatus: "",
    CaseSubject: "",
    Owner: "",
    CasePriority: "",
    ProblemDescription: "",
    CaseID_Manual: "",
    CaseID_Manual_Date: null,
    CaseProductNote: "",
    StorageLocationStore: "",
  },
  gtcForm: {
    global_trade_status: "",
    embargoed_country: "",
    gt_override_reason: "",
    gt_details: "",
    screening_id: "",
    gt_active_listening: "",
    gt_al_comments: "",
  },
  csrForm: {
    caseResolutionCode: "",
    autoClose: "",
    caseReadyForClosure: "",
    readyForCloseDays: "",
    readyForClosureDate: "",
    pendingCustomerAction: "",
    customerRequestedCloseDate: "",
  },
  entitlementStatus: {
    OTCCode: "",
    PurchaseDate: "",
    WarrantyCardDate: "",
    EOW_Date: "",
    EndUserName: "",
    EndUserPhone: "",
    EndUserAddress: "",
    WarrantyApprovalStatus: "",
    needWarrantyApproval: false,
    POPDocument: "",
    WarrantyCard: "",
    PhotoUnit: "",
  },
  productForm: {
    HWPC: "",
    ProductTypeID: "",
  },

  caseNoteFormData: {
    LogType: "Notes Log",
    ActionType: "Inbound Customer call",
    Template: "",
    VisibleExternally: false,
    MinutesSpent: 0,
    Note: "",
  },

  selectedSymptom: null,

  notesList: [],
  customerData: {
    MainAccount: null,
    SiteAccount: null,
    Type: null,
  },
  assetInformation: null,
  ownerUserData: null,
  workOrders: [],
  materialOrders: [],
  actionLogs: [],
  otcCode: [],

  invoiceData: null,
  invoiceLoading: false,
  quotationInitialData: null,

  refreshFetchPage: false,
  openWorkOrder: false,
  serviceCatalogType: "null",
  openDialogQuotation: false,
  invoiceDialogOpen: false,
  signature: null,

  dpLoading: false,

  dpDataForm: {
    InvoiceNo: "",
    DpAmount: "",
    DpDate: null,
    PaymentType: "",
    DpNote: "",
  },

  dpList: [
    // SET TO NULL FIRST 

    // {
    //   tempId: `${Date.now()}-${Math.random()}`,
    //   InvoiceNo: null,
    //   DpAmount: "",
    //   DpDate: "",
    //   PaymentType: "",
    //   DpNote: "",
    //   isPersisted: false,
    // },
  ],
  // ------------ simple setters -------------
  initFromCaseDetails: (caseDetails) =>
    set((state) => ({
      caseDetails,
      caseForm: {
        ...state.caseForm,
        CaseStatus: caseDetails.CaseStatus,
        CaseType: caseDetails.CaseType,
        CaseSubject: caseDetails.CaseSubject,
        Owner: caseDetails.Owner,
        CasePriority: caseDetails.CasePriority,
        ProblemDescription: caseDetails.ProblemDescription,
        CaseID_Manual: caseDetails.CaseID_Manual,
        CaseID_Manual_Date: caseDetails.CaseID_Manual_Date,
        CaseProductNote: caseDetails.CaseProductNote,
        StorageLocationStore: caseDetails.StorageLocationStore,
      },
      productForm: {
        ...state.productForm,
        ProductTypeID:
          caseDetails.asset_information?.product_information?.ProductTypeID,
      },
    })),

  setCaseFormField: (field, value) =>
    set((state) => ({ caseForm: { ...state.caseForm, [field]: value } })),
  setGtcFormField: (field, value) =>
    set((state) => ({ gtcForm: { ...state.gtcForm, [field]: value } })),
  setCsrFormField: (field, value) =>
    set((state) => ({ csrForm: { ...state.csrForm, [field]: value } })),
  setEntitlementField: (field, value) =>
    set((state) => ({
      entitlementStatus: { ...state.entitlementStatus, [field]: value },
    })),
  setProductFormField: (field, value) =>
    set((state) => ({ productForm: { ...state.productForm, [field]: value } })),
  setCaseNoteField: (field, value) =>
    set((state) => ({
      caseNoteFormData: { ...state.caseNoteFormData, [field]: value },
    })),
  setDpFormData: (field, value) =>
    set((state) => ({
      dpDataForm: { ...state.dpDataForm, [field]: value },
    })),

  addDpRow: () =>
    set((state) => {
      const newRow = {
        tempId: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        InvoiceNo: null,
        DpAmount: "",
        DpDate: null,
        PaymentType: "",
        DpNote: "",
        isPersisted: false,
      };
      return { dpList: [...state.dpList, newRow] };
    }),

  removeDpRow: (tempId) =>
    set((state) => {
      // keep at least 1 row
      // if (state.dpList.length === 1) return state;
      return {
        dpList: state.dpList.filter((row) => row.tempId !== tempId),
      };
    }),

  totalDpAmount: () => {
    const { dpList } = get();
    return dpList.reduce((sum, row) => {
      const amt = parseFloat(row.DpAmount) || 0;
      console.log("TOTAL DP AMMOUNT ",sum, amt)
      return sum + amt;
    }, 0);
  },


  setDpField: (tempId, field, value) =>
    set((state) => ({
      dpList: state.dpList.map((row) =>
        row.tempId === tempId ? { ...row, [field]: value } : row
      ),
    })),

  setSelectedSymptom: (value) => set({ selectedSymptom: value }),

  setSignature: (sig) => set({ signature: sig }),

  toggleRefresh: () =>
    set((state) => ({ refreshFetchPage: !state.refreshFetchPage })),
  setOpenWorkOrder: (open, type = "null") =>
    set({ openWorkOrder: open, serviceCatalogType: type }),
  setOpenDialogQuotation: (open) => set({ openDialogQuotation: open }),
  setInvoiceDialogOpen: (open) => set({ invoiceDialogOpen: open }),
  setOwnerUserData: (data) => set({ ownerUserData: data }),

  

  // ------------- fetchers -----------------
  fetchCustomerData: async () => {
    const { caseDetails } = get();
    if (!caseDetails) return;
    try {
      const resMainAccount = await ApiCustomer.get(
        `/api/contact-information/${caseDetails.ContactID}`
      );
      const next: any = {
        MainAccount: resMainAccount.data.data,
        SiteAccount: null,
        Type: null,
      };
      if (caseDetails.SiteAccountID !== null) {
        const resSiteAccount = await ApiCustomer.get(
          `/api/site_account/${caseDetails.SiteAccountID}`
        );
        next.SiteAccount = resSiteAccount.data.data;
        next.Type = "SiteAccount";
      } else {
        next.Type = "Individual";
      }
      set({ customerData: next });
    } catch (err) {
      console.error("Error returning Customer Data : ", err);
      toast.error("Gagal mengambil data customer");
    }
  },

  fetchAssetInformation: async () => {
    const { caseDetails } = get();
    if (!caseDetails) return;
    try {
      const resAsset = await ApiCustomer.get(
        `/api/asset-information/${caseDetails.AssetID}`
      );
      set({ assetInformation: resAsset.data.data });
    } catch (err) {
      console.error("Error returning Asset Data : ", err);
      toast.error("Gagal mengambil data asset");
    }
  },

  fetchCaseNotes: async () => {
    const { caseDetails } = get();
    if (!caseDetails) return;
    try {
      const res = await ApiCustomer.get(
        `/api/case-information/case-notes?caseId=${caseDetails.CaseID}`
      );
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      set({ notesList: list });
    } catch (err) {
      console.error("Error in fetchCaseNotes:", err);
      set({ notesList: [] });
    }
  },

  fetchOwnerUserData: async () => {
    const { caseDetails } = get();
    if (!caseDetails?.Owner) return;
    try {
      const response = await ApiCustomer.get(`/api/user/${caseDetails.Owner}`);
      set({ ownerUserData: response.data.data });
    } catch (error) {
      console.error("WRONG THING IN FETCH OWNER", error);
    }
  },

  // fetchWorkOrders: async () => {
  //   const { caseDetails } = get();
  //   if (!caseDetails) return;
  //   try {
  //     const res = await ApiCustomer.get(
  //       `/api/work-order?CaseID=${caseDetails.CaseID}`
  //     );
  //     set({ workOrders: res.data.data || [] });
  //   } catch (err) {
  //     console.error("Failed to fetch work orders:", err);
  //   }
  // },

  fetchWorkOrders: async () => {
    const { caseDetails } = get();
    if (!caseDetails) return;
    try {
      const res = await ApiCustomer.get(
        `/api/work-order?CaseID=${caseDetails.CaseID}`
      );
      const data = res.data.data || [];
      set({ workOrders: data });

      // 👇 trigger material orders once we have work orders
      if (data.length) {
        const woidList = data.map((wo: any) => wo.WOID).join(",");
        const moRes = await ApiCustomer.get(
          `/api/material-order?WOID=${woidList}`
        );
        set({ materialOrders: moRes.data.data || [] });
      }
    } catch (err) {
      console.error("Failed to fetch work orders:", err);
    }
  },

  fetchMaterialOrders: async () => {
    const { workOrders } = get();
    if (!workOrders.length) return;
    try {
      const woidList = workOrders.map((wo: any) => wo.WOID).join(",");
      const res = await ApiCustomer.get(`/api/material-order?WOID=${woidList}`);
      set({ materialOrders: res.data.data || [] });
    } catch (err) {
      console.error("Failed to fetch Material orders:", err);
    }
  },

  fetchGtc: async () => {
    const { caseDetails, gtcForm } = get();
    try {
      const gtcData = caseDetails?.global_trade_check;
      set({ gtcForm: gtcData ?? gtcForm });
    } catch (err) {
      console.error("Error fetching GTC:", err);
    }
  },

  fetchCsr: async () => {
    const { caseDetails } = get();
    try {
      const csrData = caseDetails?.caseresolution;
      if (csrData) {
        set({
          csrForm: {
            caseResolutionCode: csrData.caseResolutionCode || "",
            autoClose: csrData.autoClose || "",
            caseReadyForClosure: csrData.caseReadyForClosure || "",
            readyForCloseDays: csrData.readyForCloseDays || "",
            readyForClosureDate: csrData.readyForClosureDate
              ? new Date(csrData.readyForClosureDate)
              : "",
            pendingCustomerAction: csrData.pendingCustomerAction
              ? new Date(csrData.pendingCustomerAction)
              : "",
            customerRequestedCloseDate: csrData.customerRequestedCloseDate
              ? new Date(csrData.customerRequestedCloseDate)
              : "",
          },
        });
      }
    } catch (err) {
      console.error("Error fetching CSR:", err);
    }
  },

  fetchCase: async () => {
    const { caseDetails, caseForm } = get();
    if (!caseDetails) return;
    try {
      const res = await ApiCustomer.get(
        `/api/case-information/${caseDetails.CaseID}`
      );
      set({ caseForm: { ...caseForm, ...res.data.data } });
    } catch (err) {
      console.error("Error fetching case:", err);
    }
  },

  fetchActionLog: async () => {
    const { caseDetails } = get();
    if (!caseDetails) return;
    try {
      const actionlog = await ApiCustomer.get(
        `/api/actionlog?caseId=${caseDetails.CaseID}`
      );
      set({ actionLogs: actionlog.data.data || [] });
    } catch (error) {
      console.error("Error fetching ActionLog:", error);
    }
  },

  fetchOtcCode: async () => {
    try {
      const res = await ApiCustomer.get("/api/otc-code");
      set({ otcCode: res.data.data || [] });
    } catch (err) {
      console.error("Failed to fetch OTC Code:", err);
    }
  },

  fetchInvoiceData: async () => {
    const { caseDetails } = get();
    if (!caseDetails?.CaseID) return;
    set({ invoiceLoading: true });
    try {
      const response = await ApiCustomer.get(
        `/api/invoice-information?caseId=${caseDetails.CaseID}`
      );
      const data = response.data?.data;
      set({ invoiceData: data ?? null });
      return data;
    } catch (error: any) {
      console.error("Failed to fetch invoice:", error);
      toast.error(
        error?.response?.data?.message ?? "Gagal mengambil data invoice."
      );
    } finally {
      set({ invoiceLoading: false });
    }
  },

    fetchDPData: async () =>{
      const { caseDetails } = get();
      if(!caseDetails?.CaseID) return
      set({dpLoading: true})
      try {
        const response = await ApiCustomer.get(
          `/api/dp-information?caseId=${caseDetails.CaseID}`
        )
        const data = response.data?.data;

        const arrayData = Array.isArray(data)
          ? data
          : data
          ? [data]
          : [];
        const mapped = arrayData.map((dp: any) => ({
          tempId: dp.dpInvoiceNo,           // stable key
          InvoiceNo: dp.dpInvoiceNo,
          DpAmount: dp.dpAmount ?? "",
          DpDate: dp.dpDate ?? null,        // string is fine, your DatePicker helper converts it
          PaymentType: dp.paymentType ?? "",
          DpNote: dp.dpNote ?? "",
          isPersisted: true,
        }));

        set({ dpList : mapped ?? null })
        return data;
      } catch (error: any) {
        console.error("Failed Fetch DP", error);
        toast.error(error?.response?.data?.message ?? "Gagal mengambil Data DP")
      } finally {
        set({dpLoading: false})
      }
    },

  // --------------- saveAll (replacement for handleSave) --------------
  saveAll: async ({ redirect = true } = {}) => {
    const {
      caseDetails,
      caseForm,
      gtcForm,
      csrForm,
      entitlementStatus,
      productForm,
      caseNoteFormData,
      selectedSymptom,
      ownerUserData,
      setOwnerUserData,
      toggleRefresh,
      dpList,
      dpDataForm
    } = get();
    // console.log(dpList, dpDataForm);
    // return false
    
    if (!caseDetails) return false;

    try {
      const user = getUserFromToken();
      const noteFilled =
        caseNoteFormData.Note && caseNoteFormData.Note.toString().trim() !== "";

      const caseEdited = hasAnyNonEmptyValue({
        CaseType: caseForm.CaseType,
        CaseStatus: caseForm.CaseStatus,
        CaseSubject: caseForm.CaseSubject,
        Owner: caseForm.Owner,
        CasePriority: caseForm.CasePriority,
        CaseProductNote: caseForm.CaseProductNote,
        ProblemDescription: caseForm.ProblemDescription,
        CaseID_Manual: caseForm.CaseID_Manual,
        CaseID_Manual_Date: caseForm.CaseID_Manual_Date,
        StorageLocationStore: caseForm.StorageLocationStore,
      });

      const entitlementEdited = hasAnyNonEmptyValue(entitlementStatus);
      // const gtcEdited = gtcForm && Object.keys(gtcForm).length > 0;
      // const csrEdited = csrForm && Object.keys(csrForm).length > 0;
      // const productEdited = productForm && Object.keys(productForm).length > 0;
      const gtcEdited = hasAnyNonEmptyValue(gtcForm);
      const csrEdited = hasAnyNonEmptyValue(csrForm);
      const productEdited = hasAnyNonEmptyValue(productForm);
      const dpEdited = dpList.some(
        (row) =>
          !row.isPersisted &&
          (
            row.DpAmount.trim() !== "" ||
            row.DpDate !== null ||
            row.PaymentType.trim() !== "" ||
            row.DpNote.trim() !== ""
          )
      );

      const hasIntentToSave =
        noteFilled ||
        gtcEdited ||
        entitlementEdited ||
        csrEdited ||
        caseEdited ||
        productEdited ||
        dpEdited;

        //fungsi not working
      if (!hasIntentToSave) {
        alert("Tidak ada data yang disimpan.");
        return false;
      }

      Swal.fire({
        title: "Saving Case...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const dataToUpdate: any = {};
      const savedModules: string[] = [];

      // --- same loop pattern as your original handleSave ---
      for (const target of [
        "NOTE",
        "GTC",
        "ENTITLEMENT",
        "CSR",
        "CASE",
        "PRODUCT",
        "PAYMENT"
      ] as const) {
        switch (target) {
          case "NOTE": {
            if (noteFilled) {
              const response = await ApiCustomer.post(
                "/api/case-information/case-notes",
                {
                  LogType: caseNoteFormData.LogType,
                  ActionType: caseNoteFormData.ActionType,
                  VisibleExternally: caseNoteFormData.VisibleExternally,
                  Note: caseNoteFormData.Note,
                  CaseID: caseDetails.CaseID,
                  CreatedBy: user?.id,
                }
              );
              dataToUpdate.CaseNote = response.data.data.NoteID;
              if (selectedSymptom) {
                dataToUpdate.SymptomCode = selectedSymptom.SymptomCodeID;
              }
              savedModules.push("Note");
            }
            break;
          }

          case "GTC": {
            if (gtcEdited) {
              await ApiCustomer.patch(
                "/api/case-information/global-trade-check",
                {
                  ...gtcForm,
                  screening_id: gtcForm.screening_id || "",
                  CaseID: caseDetails.CaseID,
                }
              );
              savedModules.push("GTC");
            }
            break;
          }

          case "ENTITLEMENT": {
            if (entitlementEdited) {
              const formData = new FormData();
              formData.append(
                "Warranty_Status",
                entitlementStatus.OTCCode || ""
              );
              formData.append(
                "EOW_Date",
                entitlementStatus.EOW_Date?.toISOString?.() || ""
              );
              formData.append(
                "PurchaseDate",
                entitlementStatus.PurchaseDate?.toISOString?.() || ""
              );
              formData.append(
                "WarrantyCardDate",
                entitlementStatus.WarrantyCardDate?.toISOString?.() || ""
              );
              formData.append(
                "EndUserName",
                entitlementStatus.EndUserName || ""
              );
              formData.append(
                "EndUserPhone",
                entitlementStatus.EndUserPhone || ""
              );
              formData.append(
                "EndUserAddress",
                entitlementStatus.EndUserAddress || ""
              );
              formData.append(
                "WarrantyApprovalStatus",
                entitlementStatus.WarrantyApprovalStatus || ""
              );
              formData.append(
                "needWarrantyApproval",
                entitlementStatus.needWarrantyApproval ? "true" : "false"
              );

              const maybeFile = (v: any) =>
                v instanceof File || typeof v === "string" ? v : null;

              const pop = maybeFile(entitlementStatus.POPDocument);
              if (pop) formData.append("POPDocument", pop);
              const card = maybeFile(entitlementStatus.WarrantyCard);
              if (card) formData.append("WarrantyCard", card);
              const photo = maybeFile(entitlementStatus.PhotoUnit);
              if (photo) formData.append("PhotoUnit", photo);

              await ApiCustomer.patch(
                `/api/asset-information/${caseDetails.AssetID}`,
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );

              if (entitlementStatus.needWarrantyApproval === true) {
                  const getAsset = await ApiCustomer.get(`/api/asset-information/${caseDetails.AssetID}`);
                  const fieldAsset = getAsset.data.data;
                  const status = fieldAsset.asset_warranty[0]?.WarrantyApprovalStatus;

                  let newOwner = null;

                  switch (status) {
                    case "Revision To WA":
                      newOwner = caseDetails.CreatedBy;
                      break;

                    case "Add Info By WA":
                    case "New":
                    default:
                      const userTarget = await ApiCustomer.get(`/api/user?role=apv`);
                      const OwnerApv = userTarget.data.data[0];
                      newOwner = OwnerApv?.IDUser;
                      break;
                  }

                  if (newOwner) {
                    await ApiCustomer.patch(`/api/case-information/${caseDetails.CaseID}`, {
                      Owner: newOwner
                    });
                  }
                }
              Object.assign(dataToUpdate, entitlementStatus);
              savedModules.push("Entitlement");
            }
            break;
          }

          case "CSR": {
            if (csrEdited) {
              let response;
              if (caseDetails.id_csr) {
                response = await ApiCustomer.patch(
                  `/api/caseResolution/${caseDetails.id_csr}`,
                  {
                    ...csrForm,
                    caseResolutionCode: csrForm.caseResolutionCode || "",
                  }
                );
              } else {
                response = await ApiCustomer.post("/api/caseResolution", {
                  ...csrForm,
                  caseResolutionCode: csrForm.caseResolutionCode || "",
                });
                dataToUpdate.id_csr = response.data.data.id_csr;
              }
              savedModules.push("CSR");
            }
            break;
          }

          case "PRODUCT": {
            if (productEdited) {
              await ApiCustomer.patch(
                `/api/product-information/${caseDetails.asset_information.product_information.ProductNumber}`,
                {
                  ...productForm,
                  HWPC: productForm.HWPC || "",
                  ProductTypeID: productForm.ProductTypeID,
                }
              );
              savedModules.push("PRODUCT");
            }
            break;
          }

          case "CASE": {
            if (caseEdited) {
              try {
                const oldStatus = caseDetails.CaseStatus;
                let newStatus = caseForm.CaseStatus;
                savedModules.push("Case");

                const originalOwnerId = caseDetails.Owner ?? null;
                const nextOwnerId = caseForm.Owner;

                const ownerChanged =
                  nextOwnerId !== undefined &&
                  nextOwnerId !== null &&
                  String(nextOwnerId).trim() !== "" &&
                  String(nextOwnerId) !== String(originalOwnerId ?? "");

                const caseUpdates: any = {};
                if (caseForm.CaseType?.trim()) {
                  caseUpdates.CaseType = caseForm.CaseType;
                }
                if (newStatus && String(newStatus).trim() !== "") {
                  caseUpdates.CaseStatus = newStatus;
                }
                if (ownerChanged) {
                  caseUpdates.Owner = nextOwnerId;
                }
                if (caseForm.CaseSubject?.trim()) {
                  caseUpdates.CaseSubject = caseForm.CaseSubject;
                }
                if (caseForm.CasePriority?.trim()) {
                  caseUpdates.CasePriority = caseForm.CasePriority;
                }
                if (caseForm.CaseProductNote?.trim()) {
                  caseUpdates.CaseProductNote = caseForm.CaseProductNote;
                }
                if (caseForm.ProblemDescription?.trim()) {
                  caseUpdates.ProblemDescription = caseForm.ProblemDescription;
                }
                if (caseForm.CaseID_Manual?.trim()) {
                  caseUpdates.CaseID_Manual = caseForm.CaseID_Manual;
                }
                if (caseForm.CaseID_Manual_Date) {
                  const dateVal = new Date(caseForm.CaseID_Manual_Date);
                  if (!isNaN(dateVal.getTime())) {
                    caseUpdates.CaseID_Manual_Date = dateVal.toISOString();
                  }
                }
                if (caseForm.StorageLocationStore?.trim()) {
                  caseUpdates.StorageLocationStore =
                    caseForm.StorageLocationStore;
                }

                await ApiCustomer.patch(
                  `/api/case-information/${caseDetails.CaseID}`,
                  caseUpdates
                );
                Object.assign(dataToUpdate, caseUpdates);

                const token = { user: getUserFromToken() };

                if (
                  newStatus &&
                  String(newStatus).trim() !== "" &&
                  oldStatus !== newStatus
                ) {
                  const actionlog = await ApiCustomer.post("/api/actionlog", {
                    CaseId: `${caseDetails.CaseID}`,
                    ReferenceId: ``,
                    model: "Case",
                    dataOld: oldStatus,
                    dataNew: newStatus,
                    changedBy: token.user.id,
                    logDescription: `Edit : Change Case ${caseDetails.CaseID} Status from ${oldStatus} to ${newStatus}`,
                  });
                  const dataActionlog = actionlog.data.data;
                  const subject = `[Case Update] Case #${caseDetails.CaseID} status berubah dari ${oldStatus} ke ${newStatus}`;
                  const caseLink = `${import.meta.env.VITE_BASE_URL}/app/case/${
                    caseDetails.CaseID
                  }`;

                  const html = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                      <h2 style="color: #2c3e50;">Notifikasi Perubahan Case</h2>
                      <p>Halo ${dataActionlog.ownerUser?.Name || "User"},</p>
                      <p>Case dengan ID: <b>${
                        caseDetails.CaseID
                      }</b> telah diperbarui.</p>
                      <table border="0" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
                        <tr><td><b>Status lama</b></td><td>${oldStatus}</td></tr>
                        <tr><td><b>Status baru</b></td><td>${newStatus}</td></tr>
                        <tr><td><b>Diedit oleh</b></td><td>${
                          token.user.name || token.user.id
                        }</td></tr>
                      </table>
                      <p><b>Deskripsi:</b><br>${
                        dataActionlog.logDescription
                      }</p>
                      <p style="margin-top: 20px;">
                        <a href="${caseLink}" style="display: inline-block; padding: 10px 16px; background: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">Lihat Case</a>
                      </p>
                      <p style="margin-top: 30px; font-size: 12px; color: #777;">Terima kasih,<br><i>System Notification</i></p>
                    </div>
                  `;
                  await ApiCustomer.post("/api/sendEmail", {
                    to: dataActionlog.ownerUser?.Email,
                    subject,
                    text: subject,
                    html,
                  });
                } else {
                  await ApiCustomer.post("/api/actionlog", {
                    CaseId: `${caseDetails.CaseID}`,
                    ReferenceId: ``,
                    model: "Case",
                    dataOld: oldStatus,
                    dataNew: newStatus,
                    changedBy: token.user.id,
                    logDescription: `Edit : Edit Case ${caseDetails.CaseID} Data`,
                  });
                }

                if (ownerChanged) {
                  try {
                    let newOwnerInfo = null;
                    try {
                      const newOwnerResponse = await ApiCustomer.get(
                        `/api/user/${nextOwnerId}`
                      );
                      newOwnerInfo = newOwnerResponse.data.data;
                    } catch (infoError) {
                      console.warn(
                        "Failed to fetch new owner info:",
                        infoError
                      );
                    }

                    const previousOwnerName =
                      ownerUserData?.Name || originalOwnerId || "Unknown";
                    const newOwnerName = newOwnerInfo?.Name || nextOwnerId;

                    await ApiCustomer.post("/api/actionlog", {
                      CaseId: `${caseDetails.CaseID}`,
                      ReferenceId: "",
                      model: "CaseOwner",
                      dataOld: String(originalOwnerId ?? ""),
                      dataNew: String(nextOwnerId ?? ""),
                      changedBy: user?.id,
                      logDescription: `Edit : Change Case ${caseDetails.CaseID} Owner from ${previousOwnerName} to ${newOwnerName}`,
                    });

                    if (newOwnerInfo) {
                      setOwnerUserData(newOwnerInfo);
                    }
                  } catch (ownerLogError) {
                    console.error(
                      "Failed to create owner change log:",
                      ownerLogError
                    );
                  }
                }
              } catch (err) {
                console.error("Gagal update case:", err);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "Gagal menyimpan data case.",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                });
              }
            }
            break;
          }

          case "PAYMENT":{
            const newRows = dpList.filter((row) => {
              const hasAnyField =
                (row.DpAmount && row.DpAmount.toString().trim() !== "") ||
                row.DpDate ||
                (row.PaymentType && row.PaymentType.toString().trim() !== "") ||
                (row.DpNote && row.DpNote.toString().trim() !== "");

              return !row.isPersisted && hasAnyField
            })

            if(newRows.length === 0) break;
            const user = getUserFromToken();

            const payload = {
              caseId: caseDetails.CaseID,
              createdBy: user?.id,
              dps: newRows.map((row) => ({
                dpAmount: row.DpAmount,
                dpDate: row.DpDate,       // make sure this is string / ISO or whatever parseDate expects
                paymentType: row.PaymentType,
                dpNote: row.DpNote,
              })),
            }
            const response = await ApiCustomer.post(`/api/dp-information`, payload);

            dataToUpdate.dp = response.data.data;
            savedModules.push("DP");
            break;
          }
        }
      }

      if (savedModules.length > 0 && redirect) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil Disimpan",
          text: "Data berhasil disimpan",
          timer: 2500,
          showConfirmButton: false,
        });
        toggleRefresh();
        return true;
      }

      Swal.close();
      return savedModules.length > 0;
    } catch (error: any) {
      console.error("failed:", error);
      Swal.fire({
        icon: "error",
        title: error.message,
        text: error.response?.data?.message || "Something went wrong.",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        Swal.close();
      });
      return false;
    }
  },
}));
