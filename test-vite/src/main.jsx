import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App';
import Landing from './landing';
import Lorem from './Lorem';
import Search_case from './Search_case';
import { Case } from './Case';
import { Work } from './work';
import { MaterialOrder, MoDetail } from './material_order';
import 
{ Company_table,
  Assets_table,
  Contact_table,
  Case_table,
  Product_table,
  ProductType_table,
  WarrantyService_table,
  Mo_table,
  Wo_table,
  SubkTechnician_table,
  SymptomCodeTable,
  BookingsTable,
  BookingDetailsTable,
  Resource_table,
  RepairClassCodeTable,
  ServiceCatalogTable,
  OTCCodeTable,
  CrsTable,
  FailureTable
 } from './master_table';
import { Bookings } from './bookings';
import { User_table } from './master_table';
import { Part_table } from './master_table';
import { Labor } from './labor';
// import { ModalContextProvider } from './components/modal-context';
import { ResourceAccountTable } from './master_table';

import { GateKeepingRouting } from './components/GateKeepingRouting';
import { Buffer } from 'buffer';
import { Auditwindows } from './components/audit-windows';
import { Home } from './Home';
window.Buffer = Buffer;
createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <BrowserRouter>
      {/* <ModalContextProvider> */}
        <Routes>
          {/* <Route path='/' element={<App />}> */}
          <Route path='/app' element={<GateKeepingRouting />}>
            <Route index element={<Landing />} />
            <Route path='/app/search_case' element={<Search_case />} />
            <Route path='/app/case/:caseId' element={<Case />} />
            <Route path='/app/work/:woid' element={<Work />}/>
            <Route path='/app/material-order/:moid' element={<MaterialOrder />}/>
            <Route path='/app/mo_detail/:lineItemID' element={<MoDetail />} />
            <Route path='/app/bookings' element={<Bookings />} />
            <Route path='/app/bookings/:bookingid' element={<Bookings />} />
            <Route path='/app/labor' element={<Labor />} />
            
            {/* <Route path='/app/master' element> */}
            <Route path='/app/master/Company_table' element={<Company_table />} />
            <Route path='/app/master/Assets_table' element={<Assets_table />} />
            <Route path='/app/master/Contact_table' element={<Contact_table />} />
            <Route path='/app/master/Case_table' element={<Case_table />} />
            <Route path='/app/master/Product_table' element={<Product_table/>}/>
            <Route path='/app/master/ProductType_table' element={<ProductType_table/>}/>
            {/* <Route path='/app/master/ServiceCatalogPartsTable' element={<ServiceCatalogPartsTable/>}/> */}
            {/* <Route path='/app/master/GlobalTradeCheckTable' element={<GlobalTradeCheckTable/>}/> */}
            <Route path='/app/master/WarrantyService_table' element={<WarrantyService_table/>}/>
            <Route path='/app/master/Mo_table' element={<Mo_table/>}/>
            <Route path='/app/master/Wo_table' element={<Wo_table/>}/>
            {/* <Route path='master/Resource' element={<ResourceTable/>}/> */}
            <Route path='/app/master/ResourceAccount' element={<ResourceAccountTable/>}/>
            <Route path='/app/master/SubkTechnician' element={<SubkTechnician_table/>}/>
            <Route path='/app/master/symptom_codes' element={<SymptomCodeTable/>}/>
            <Route path='/app/master/Bookings' element={<BookingsTable/>}/>
            <Route path='/app/master/BookingDetails' element={<BookingDetailsTable/>}/>
            <Route path='/app/master/User_table' element={<User_table/>}/>
            <Route path='/app/master/Part_table' element={<Part_table/>}/>
            <Route path='/app/master/Resource_table' element={<Resource_table/>} />
            <Route path='/app/master/repairClassCode' element={<RepairClassCodeTable/>} />
            <Route path='/app/master/ServiceCatalog' element={<ServiceCatalogTable/>} />
            <Route path='/app/master/OTC_Code' element={<OTCCodeTable/>}/>
            <Route path='/app/master/CrsTable' element={<CrsTable/>}/>
            <Route path='/app/master/Failure' element={<FailureTable/>}/>
            {/* </Route> */}
          </Route>
            {/* </Route> */}
          <Route path='/' element={<Home/>}/>
          <Route path='/auditwindows' element={<Auditwindows />} />
          <Route path="/lorem" element={<Lorem />}/>
        </Routes>
      {/* </ModalContextProvider> */}
  </BrowserRouter>
  </StrictMode>, 
)
