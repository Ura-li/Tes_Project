import { useServiceCaseStore } from "@/store/useServiceCaseStore";

export const TabsServiceCaseDetails = ({ initialCaseDetails }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    caseDetails,
    initFromCaseDetails,
    openWorkOrder,
    setOpenWorkOrder,
    serviceCatalogType,
    setOpenDialogQuotation,
    openDialogQuotation,
    setInvoiceDialogOpen,
    invoiceDialogOpen,
    saveAll,
  } = useServiceCaseStore();

  // Initialize store when component mounts / case changes
  useEffect(() => {
    if (initialCaseDetails) {
      initFromCaseDetails(initialCaseDetails);
    }
  }, [initialCaseDetails, initFromCaseDetails]);

  // use caseDetails from store going forward
  // (fallback to initialCaseDetails if you want)
  const effectiveCase = caseDetails || initialCaseDetails;

  const handleSave = (redirect = true) => saveAll({ redirect });

  const buttons = [
    {
      icon: CircleChevronLeft,
      label: "",
      onClick: () => navigate(`/app/viewcase`),
      roles: [
        "admin",
        "fd",
        "user",
        "apo",
        "ce",
        "lg",
        "celead",
        "spv",
        "ps",
        "cm",
      ],
    },
    {
      icon: Save,
      label: "Save",
      onClick: () => handleSave(),
      roles: ["admin", "fd", "user", "apo", "ce", "lg", "celead", "ps", "cm"],
    },
    {
      icon: FileSymlink,
      label: "Save & Close",
      onClick: () => handleSave().then(() => navigate(`/app/`)),
      roles: ["admin", "fd", "user", "apo", "ce", "lg", "celead", "ps", "cm"],
    },
    // ... rest of buttons, but they now call store actions instead of props
  ];

  const visibleButtons = buttons.filter((btn) => btn.roles.includes(user.role));

  return (
    <>
      <div className="flex items-center border-1 sticky top-15 z-5 bg-gray-50 overflow-auto">
        {visibleButtons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            hidden={btn.hidden}
            variant="link"
            className="rounded-none px-0 py-0 flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5"
          >
            <btn.icon className="w-4 h-4" />
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))}
        <BtnModalsServiceCatalog
          open={openWorkOrder}
          setOpen={setOpenWorkOrder}
          caseDetails={effectiveCase}
          serviceCatalogType={serviceCatalogType}
        />
      </div>
      {/* <div>
              <QuotationDialog
                open={openDialogQuotation}
                onOpenChange={handleQuotationOpenChange}
                materialItems={fieldMO(caseDetails)}
                caseId={caseDetails.CaseID}
                status={caseDetails.CaseStatus}
                initialData={quotationInitialData || {}}
                loading={quotationLoading}
                submitting={quotationSubmitting}
                onSubmit={handleQuotationSubmit}
                createdBy={user}
                signature={signature}
                caseDetails={caseDetails}
              />
            </div>
            <div>
              <InvoiceDialog
                open={invoiceDialogOpen}
                onOpenChange={handleInvoiceOpenChange}
                quotation={invoiceData?.quotation}
                invoice={invoiceData?.invoice}
                loading={invoiceLoading}
                submitting={invoiceSubmitting}
                onSubmit={handleInvoiceSubmit}
              />
            </div> */}

      <ServiceCase />
    </>
  );
};


import { useServiceCaseStore } from "@/store/useServiceCaseStore";

export const ServiceCase = () => {
  const { open } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    caseDetails,
    caseForm,
    gtcForm,
    csrForm,
    entitlementStatus,
    productForm,
    caseNoteFormData,
    notesList,
    customerData,
    assetInformation,
    ownerUserData,
    workOrders,
    materialOrders,
    actionLogs,
    otcCode,
    refreshFetchPage,
    invoiceData,
    invoiceLoading,

    // setters
    setCaseFormField,
    setGtcFormField,
    setCsrFormField,
    setEntitlementField,
    setProductFormField,
    setCaseNoteField,

    // fetchers
    fetchCustomerData,
    fetchAssetInformation,
    fetchCaseNotes,
    fetchOwnerUserData,
    fetchWorkOrders,
    fetchMaterialOrders,
    fetchGtc,
    fetchCsr,
    fetchCase,
    fetchActionLog,
    fetchOtcCode,
  } = useServiceCaseStore();

  const invoiceSummary = invoiceData?.invoice;
  const invoiceQuotation = invoiceData?.quotation;
  const invoiceNotificationLabel =
    [
      invoiceSummary?.sendInvoice && "Invoice",
      invoiceSummary?.sendWa && "WA",
      invoiceSummary?.sendEmail && "Email",
      invoiceSummary?.sendErf && "ERF",
    ]
      .filter(Boolean)
      .join(", ") || "-";

  // LOCAL UI STATE ONLY
  const [createdOn, setCreatedOn] = useState(null);
  const [caseClosedDate, setCaseClosedDate] = useState(null);
  const [submittedToBase, setSubmittedToBase] = useState(null);
  const [hideAsignTo, setHideAsignTo] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Initial effects – now just call store actions
  useEffect(() => {
    if (!caseDetails) return;
    fetchOtcCode();
    fetchCustomerData();
    fetchAssetInformation();
    fetchOwnerUserData();
    fetchWorkOrders();
    fetchCaseNotes();
    fetchGtc();
    fetchCsr();
    fetchCase();
    fetchActionLog();
  }, [caseDetails?.CaseID, refreshFetchPage]);

  useEffect(() => {
    if (caseDetails?.CreatedOn) {
      setCreatedOn(new Date(caseDetails.CreatedOn));
    }
    if (caseDetails?.CaseClosedDate) {
      setCaseClosedDate(new Date(caseDetails.CaseClosedDate));
    }
  }, [caseDetails]);

  useEffect(() => {
    if (workOrders.length > 0) {
      fetchMaterialOrders();
    }
  }, [workOrders]);

  // HP entitlement prefill (unchanged logic, uses store state now)
  useEffect(() => {
    if (
      otcCode.length > 0 &&
      assetInformation?.Warranty_Status
    ) {
      setEntitlementField("OTCCode")(assetInformation.Warranty_Status);
      setEntitlementField("EOW_Date")(
        assetInformation.EOW_Date ? new Date(assetInformation.EOW_Date) : null
      );
    }

    if (assetInformation?.asset_warranty?.length > 0) {
      const w = assetInformation.asset_warranty[0];
      setEntitlementField("needWarrantyApproval")(true);
      setEntitlementField("PurchaseDate")(
        w.PurchaseDate ? new Date(w.PurchaseDate) : null
      );
      setEntitlementField("WarrantyCardDate")(
        w.WarrantyCardDate ? new Date(w.WarrantyCardDate) : null
      );
      setEntitlementField("WarrantyApprovalStatus")(w.WarrantyApprovalStatus);
      setEntitlementField("EndUserName")(w.EndUserName);
      setEntitlementField("EndUserPhone")(w.EndUserPhone);
      setEntitlementField("EndUserAddress")(w.EndUserAddress);
      setEntitlementField("POPDocument")(w.POPDocument);
      setEntitlementField("WarrantyCard")(w.WarrantyCard);
      setEntitlementField("PhotoUnit")(w.PhotoUnit);
    }
  }, [otcCode, assetInformation, setEntitlementField]);
}
