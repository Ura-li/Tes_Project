export function BtnModalsServiceCatalog({ 
  open, 
  setOpen,  
  caseDetails,
  serviceCatalogType,
  WOID, // optional: when provided, create MO for existing WO
}) {
  
  const {user} = useAuth();

  // console.log("USer", user)
  // console.log("USer", caseDetails)
  useEffect(() => {
    // Resetting modal state when serviceCatalogType changes
    setCurrentStep(1);
    setStep(0);
    setSelectedWarrantyServices(null);
    setSelectedPartCatalog([]);
    setSubTotalConfirmServices(0);
    setTotalTaxConfirmServices(0);
    setTotalConfirmServices(0);
    setPartNumberSearch("");
    setKeywordSearch("");
    setDescriptionSearch("");

  }, [serviceCatalogType]);
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentStep, setCurrentStep] = useState(1);
  const [assetForWorkOrderCreation, setAssetForWorkOrderCreation] = useState([]);
  const [modalPart, setModalPart] = useState(false);
  const [roleAssign, setRoleAssign] = useState([]);
  const [assignApo, setAssignApo] = useState(null);
  //product information
  const fetchDataAssets = async () => {
    try {
      const assetId = caseDetails?.AssetID;
      if (!assetId) return null;
      const response = await ApiCustomer.get(`/api/asset-information/${assetId}`)
      return response.data.data
    }catch(e){
      console.error("error fetching Asset: ", e)
      return null;
    }
  }

  const fetchUserAssign = async (role) => {
    try {
      const res = await ApiCustomer.get(`/api/user?role=${role}`);
      setRoleAssign(res.data.data);
    } catch (err) {
      console.error("Error fetching role: ", err);
    }
  };


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
    fetchUserAssign('apo');
  }, [])

  const [selected, setSelected] = useState("DepotRepair"); 

  //handles Warranty Service
  // const [selectedWarrantyServices, setSelectedWarrantyServices] = useState([]);
  // const handlerWarrantyServices = (service, checked) => {
  //   if (checked) {
  //     setSelectedWarrantyServices((prev) => [...prev, service])
  //   }else{
  //     setSelectedWarrantyServices((prev) => 
  //       prev.filter((item) => item.Service_offerID !==service.Service_offerID)
  //     )
  //   }
  // }

  // useEffect(() => {
  //   console.log("Selected Services:", selectedWarrantyServices);
  // }, [selectedWarrantyServices]);
  
  const [selectedWarrantyServices, setSelectedWarrantyServices] = useState(null);

    const handlerWarrantyService = (service) => {
      setSelectedWarrantyServices(service);
    };

  useEffect(() => {
    console.log("Selected Services:", selectedWarrantyServices);
  }, [selectedWarrantyServices]);
  
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
      setSelectedPartCatalog((prev) => [
        ...prev,
        {
          ...part,
          qty: 1,
          Total: part.Price,
        }
      ])
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
          const parsedQty = parseInt(qty) || 1;
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
    let serviceTotal = selectedWarrantyServices ? (parseFloat(selectedWarrantyServices.Price) || 0) : 0;

  
    let partsTotal = selectedPartCatalog.reduce((acc, part) => {
      return acc + (parseFloat(part.Total) || 0);
    }, 0);
  
    if(assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty"){
      const subTotal = serviceTotal + partsTotal;
      console.log("SubTotal Confirm Services : ",subTotal)
      setSubTotalConfirmServices(subTotal.toFixed(2));
    }else{
      setSubTotalConfirmServices(0);
    }

  }

  //createorder
  const createOrder = async () => {
    if (!assignApo) {
      toast.warning("APO IS NOT ASSIGN YET", {
        description: "PLEASE CHOOSE THE APO PATNER BEFORE CREATING ORDER",
        position: 'top-center'
      })
    } else {
      try {
        Swal.fire({
          title: "Creating Order...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading()
        });
        const data = {
          user: getUserFromToken()
        }

        let noteCreateOrderLog = '';
        if(assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty"){
          noteCreateOrderLog = `[NOTICE] Order Part
Order Part : ${selectedPartCatalog?.[0]?.PartNumber} - ${selectedPartCatalog?.[0]?.PartDescription}
Harga : Rp. ${selectedPartCatalog?.[0]?.Price}
Requested to APO : ${assignApo}`;
        }else{
          noteCreateOrderLog = `[NOTICE] Order Part
Order Part : ${selectedPartCatalog?.[0]?.PartNumber} - ${selectedPartCatalog?.[0]?.PartDescription}
Requested to APO : ${assignApo}`;
        }
        console.log(noteCreateOrderLog);

        // If WOID present or special mode, create only MO for existing WO
        const isCreateMOOnly = !!WOID || serviceCatalogType === 'wo-add-mo';
        const res = isCreateMOOnly
          ? await ApiCustomer.post("/api/material-order", {
              WOID: WOID,
              selectedPartCatalog,
              OwnerID: data.user.id,
              assignApo: assignApo,
              notesLog: noteCreateOrderLog,
            })
          : await ApiCustomer.post("/api/service-log/create-order", {
              AssetID: assetForWorkOrderCreation.AssetID,
              CaseID: caseDetails.CaseID,
              selectedWarrantyServices,
              selectedPartCatalog,
              IncidentType: selected,
              OwnerID: data.user.id,
              assignApo: assignApo,
              notesLog: noteCreateOrderLog,
            });
        console.log(res)
      
        Swal.close(); 
      
        await Swal.fire({
          title: "Success!",
          text:  "Order added successfully!",
          icon:  "success",
          timer: 1500,
          showConfirmButton: false,
          allowEscapeKey: false,
        }).then(()=>{
          setOpen(false);
          const createdWOID = res.data.WOID
          const MOID = res.data.MOID
          if (isCreateMOOnly) {
            window.open(`/app/material-order/${MOID}`, '_blank');
          } else {
            switch (serviceCatalogType) {
              case "CSR":
                window.open(`/app/material-order/${MOID}`, '_blank');
                break;
              case "serviceorder":
                window.open(`/app/work/${createdWOID}`, '_blank');  
                break;
              default:
                break;
            }
          }
        });
    } catch (err) {
      console.error("Order Creation Failed:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to create order",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };
  
  function renderStepContent() {
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 6;
    const filteredPartCatalog = partCatalog.filter(part => {
      return (
        part.PartNumber?.toLowerCase().includes(partNumberSearch.toLowerCase()) &&
        part.Keyword?.toLowerCase().includes(keywordSearch.toLowerCase()) &&
        part.PartDescription?.toLowerCase().includes(descriptionSearch.toLowerCase())
      );
    });
    const totalPages = Math.ceil(filteredPartCatalog.length / PAGE_SIZE);
    const currentPageData = useMemo(() => {
      const start = (currentPage - 1) * PAGE_SIZE;
      return filteredPartCatalog.slice(start, start + PAGE_SIZE);
    }, [filteredPartCatalog, currentPage]);

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    switch (currentStep) {
      case 1:
        return (
          <DialogContent className="sm:max-w-[fit] sm:max-h-[100vh] flex flex-col justify-center gap-0 p-0 bg-white [&>button]:hidden" >
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
            <div className="flex justify-between gap-4 p-2 my-2">
              <DialogTitle>Step 1: Select From List of Service Options</DialogTitle>
              <div className="grid grid-cols-2 p-2 bg-gray-300 gap-x-10">
                
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: {assetForWorkOrderCreation?.Warranty_Status} - {assetForWorkOrderCreation?.WarrantyOTCCode?.Description} </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
  
            <Table>
              <TableCaption className="caption-top bg-blue-500 p-2 text-2xl text-left text-black">
                Warranty Services
              </TableCaption>

              <TableHeader>
                <TableRow className="bg-gray-300">
                  <TableHead className="font-black text-black">Select</TableHead>
                  <TableHead className="font-black text-black">Service OfferID</TableHead>
                  <TableHead className="font-black text-black">Service Description</TableHead>
                  <TableHead className="font-black text-black">Customer TAT</TableHead>
                  <TableHead className="font-black text-black">Price</TableHead>
                  <TableHead className="font-black text-black">Tax</TableHead>
                  <TableHead className="font-black text-black">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {warrantyOffer.map((service, index) => {
                  const selected =
                    selectedWarrantyServices?.Service_offerID === service.Service_offerID;

                  return (
                    <TableRow
                      key={service.Service_offerID ?? index}
                      onClick={() => handlerWarrantyService(service)}
                      onKeyDown={(e) => {
                        // allow Enter or Space to select row for keyboard users
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlerWarrantyService(service);
                        }
                      }}
                      tabIndex={0} // make TR focusable for keyboard users
                      aria-selected={selected}
                      className={`cursor-pointer ${selected ? "bg-blue-100" : ""}`}
                    >
                      <TableCell>
                        <input
                          type="radio"
                          name="warrantyService" // same name groups radios
                          id={`service-${index}`}
                          value={service.Service_offerID}
                          checked={selected}
                          onChange={() => handlerWarrantyService(service)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select service ${service.Service_offerID}`}
                        />
                      </TableCell>

                      <TableCell>{service.Service_offerID}</TableCell>
                      <TableCell>{service.Service_description}</TableCell>
                      <TableCell>{service.CTat_RTime}</TableCell>
                      <TableCell>{service.Price}</TableCell>
                      <TableCell>{service.Tax}</TableCell>
                      <TableCell>{service.Total}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

  
            <DialogFooter className={'p-4'}>
             <Button variant={'search'} className="" onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              variant={'search'} 
              onClick={() => setCurrentStep(2)} 
              disabled={!selectedWarrantyServices}
              className={!selectedWarrantyServices ? "opacity-50 cursor-not-allowed" : ""}
            >
              Next
            </Button>
            </DialogFooter>
          </DialogContent>
        );
  
      case 2:
       
       
        return (
          <DialogContent className="sm:max-w-[fit] sm:max-h-[fit] flex flex-col  gap-0 p-0 bg-white [&>button]:hidden ">
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
            <div className="flex items-start justify-between p-2">
              <div className="grid flex-1 grid-cols-2 p-2 bg-gray-300 gap-x-2">
                <p>Service OfferID</p><p>: {selectedWarrantyServices.Service_offerID}</p>
                <p>Service Description</p><p>: {selectedWarrantyServices.Service_description}</p>
              </div>
              <div className="flex items-center self-center justify-center flex-1 gap-2 space-x-2 ">
                <Label htmlFor="orderability">Orderability</Label>
                <Switch id="orderability" />
              </div>
              <div className="grid  grid-cols-2 p-2 bg-gray-300 gap-x-2">
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: {assetForWorkOrderCreation?.Warranty_Status} - {assetForWorkOrderCreation?.WarrantyOTCCode?.Description}</p>
                <p>Currency</p><p>: </p>
              </div>
            </div>

            <Tabs
            defaultValue="parts"
            className={'h-[50vh] '}
            >
              <TabsList className={'py-5 px-0 bg-white'}>
                <TabsTrigger variant={'fullsize'} value="parts" className={'cursor-pointer '}>Parts</TabsTrigger>
                <TabsTrigger variant={'fullsize'} value="snr" className={'cursor-pointer  text-blue-500'} hidden>SNR</TabsTrigger>
              </TabsList>
              <TabsContent value="parts"
                className={'overflow-y-auto'}
              > 
                <Table>
                  <TableHeader>
                    <TableRow className={'bg-gray-300'}>
                      <TableHead className={'font-black text-black'}>Select</TableHead>
                      <TableHead className={'font-black text-black p-2'}>
                        Parts #
                        <span className="flex items-center">
                          <Input
                            className={'bg-white font-medium'}
                            value={partNumberSearch}
                            onChange={(e) => setPartNumberSearch(e.target.value)}
                          />
                          <XIcon className="cursor-pointer" onClick={() => setPartNumberSearch("")} />
                        </span>
                      </TableHead>
                      <TableHead className={'font-black text-black'}>
                        Keyword
                        <span className="flex items-center">
                          <Input
                            className={'bg-white font-medium'}
                            value={keywordSearch}
                            onChange={(e) => setKeywordSearch(e.target.value)}
                          />
                          <XIcon className="cursor-pointer" onClick={() => setKeywordSearch("")} />
                        </span>
                      </TableHead>
                      <TableHead className={'font-black text-black'}>
                        Part Description
                        <span className="flex items-center">
                          <Input
                            className={'bg-white font-medium'}
                            value={descriptionSearch}
                            onChange={(e) => setDescriptionSearch(e.target.value)}
                          />
                          <XIcon className="cursor-pointer" onClick={() => setDescriptionSearch("")} />
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
                    {currentPageData.map((part, index) => {
                      const isChecked = selectedPartCatalog.some(
                        (item) => item.PartNumber === part.PartNumber
                      );

                      const toggleRow = () => {
                        handlerPartCatalog(part, !isChecked);
                      };

                      return (
                        <TableRow
                          key={index}
                          onClick={toggleRow}
                          className={`cursor-pointer ${isChecked ? "bg-blue-100" : ""
                            }`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handlerPartCatalog(part, checked)
                              }
                              onClick={(e) => e.stopPropagation()} // prevent double toggle
                            />
                          </TableCell>
                          <TableCell>{part.PartNumber}</TableCell>
                          <TableCell>{part.Keyword}</TableCell>
                          <TableCell>{part.PartDescription}</TableCell>
                          <TableCell>{part.Orderability ? "Yes" : "No"}</TableCell>
                          <TableCell>{part.ResistrictionReason}</TableCell>
                          <TableCell>{part.Csr ? "Y" : "N"}</TableCell>
                          <TableCell>{part.Rohs}</TableCell>
                          <TableCell>{part.Returnable_Flag ? "true" : "false"}</TableCell>
                          <TableCell>{part.Hardrolls}</TableCell>
                          <TableCell>{part.Dangerousgoods ? "true" : "false"}</TableCell>
                          <TableCell>{part.Lithiumbattry ? "true" : "false"}</TableCell>
                          <TableCell>{part.Oversize ? "true" : "false"}</TableCell>
                          <TableCell>{part.Heavy ? "true" : "false"}</TableCell>
                          <TableCell>{part.Price}</TableCell>
                          <TableCell>{part.Freightprice}</TableCell>
                          <TableCell>{part.Tax}</TableCell>
                          <TableCell>{part.Total}</TableCell>
                        </TableRow>
                      );
                    })}

                    {/* pagination row */}
                    <TableRow>
                      <TableCell colSpan="100%">
                        <Pagination className="flex justify-start">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(currentPage - 1);
                                }}
                              />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === i + 1}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(i + 1);
                                  }}
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(currentPage + 1);
                                }}
                              />
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
          <DialogContent className="sm:max-w-[fit] sm:max-h-[full] p-0 bg-white [&>button]:hidden ">
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
            <div className="flex justify-end gap-4 p-2 my-2">
              <div className="grid grid-cols-2 p-2 bg-gray-300 gap-x-10">
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: {assetForWorkOrderCreation?.Warranty_Status} - {assetForWorkOrderCreation?.WarrantyOTCCode?.Description} </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
            <div className="overflow-auto max-h-[30dvh]">
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
                  {/* {selectedWarrantyServices.map((service, index) => {
                    return ( */}
                      <TableRow>
                        <TableCell>{selectedWarrantyServices.Service_offerID}</TableCell>
                        <TableCell>{selectedWarrantyServices.Service_description}</TableCell>
                        <TableCell>{selectedWarrantyServices.CTat_RTime}</TableCell>
                        <TableCell>{selectedWarrantyServices.Shipping_Fee}</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>{selectedWarrantyServices.Tax}</TableCell>
                        <TableCell>{assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty" ? selectedWarrantyServices.Price : 0}</TableCell>
                      </TableRow>
                    {/* )
                  })} */}
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
                        <TableCell>{part.qty}
                        {/* <Input
                          placeholder="QTY"
                          min={1}
                          readOnly
                          type="number"
                          value={part.qty}
                          onChange={(e) => handleQtyChangePartsCatalog(part.PartNumber, e.target.value)}
                          className="w-16"
                        /> */}
                        </TableCell>
                        <TableCell>{part.Tax}</TableCell>
                        <TableCell>{assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty" ? part.Total : 0}</TableCell>
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
            </div>
            
  
            <DialogFooter className={' sm:justify-start p-2 items-center gap-10'}>
              <Button variant={'search'} className="" onClick={() => setCurrentStep(2)}>Previous</Button>
              <Button variant={'search'} className="" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant={'search'} className="" onClick={() => setModalPart(true)}>Add Part</Button>
              <Button variant={'search'} className="" onClick={createOrder}>Create Order</Button>
              
              <Label htmlFor="incident" className={'font-bold whitespace-nowrap'}>Incident Type</Label>
              
              <Select value={selected} onValueChange={setSelected} defaultValue="DepotRepair">
                <SelectTrigger className="w-fit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="CE Assist-APJ-Computing">CE Assist-APJ-Computing</SelectItem>
                    <SelectItem value="CE Assist-APJ-Printing">CE Assist-APJ-Printing</SelectItem>
                    <SelectItem value="Cust Sat-Issue-APJ-Computing">Cust Sat Issue-APJ-Computing</SelectItem>
                    <SelectItem value="Cust Sat-Issue-APJ-Printing">Cust Sat Issue-APJ-Printing</SelectItem>
                    <SelectItem value="IMACD-APJ-Computing">IMACD-APJ-Computing</SelectItem>
                    <SelectItem value="IMACD-APJ-Printing">IMACD-APJ-Printing</SelectItem>
                    <SelectItem value="Installation Only-APJ-Computing">Installation Only-APJ-Computing</SelectItem>
                    <SelectItem value="Installation Only-APJ-Printing">Installation Only-APJ-Printing</SelectItem>
                    <SelectItem value="PC Problem-APJ-Computing">PC Problem-APJ-Computing</SelectItem>
                    <SelectItem value="Print Problem-APJ-Printing">Print Problem-APJ-Printing</SelectItem>
                    <SelectItem value="Print Quality-APJ-Printing">Print Quality-APJ-Printing</SelectItem>
                    <SelectItem value="Prev Maint-APJ-Computing">Prev Maint-APJ-Computing</SelectItem>
                    <SelectItem value="Prev Maint-APJ-Printing">Prev Maint-APJ-Printing</SelectItem>
                    <SelectItem value="DepotRepair">Depot Repair</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label htmlFor="Assign_APO" className={'font-bold whitespace-nowrap'}>SELECT APO : </Label>
              <SearchCommandBlock 
                value={assignApo}
                onChange={(selectedID) =>{
                  if(selectedID === null) {
                    setAssignApo(null);
                    return;
                  }
                  const selectedUser = roleAssign.find(
                    (user) => user.IDUser === selectedID
                  );
                  if (selectedUser) {
                    setAssignApo(selectedUser.IDUser);
                  }
                }}
                placeholder="--Select--"
                options={roleAssign.map((user) =>({
                  label: user.Name,
                  value: user.IDUser,
                }))}
                renderLabel={(opt) => opt.label}
                getValue={(opt) => opt.value}
                className={'border-2 ring-1 ring-gray-200 bg-slate-100'}
              />
              
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
  </>
  );
}
}


