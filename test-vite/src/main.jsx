import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App';
import Landing from './landing';
import Lorem from './Lorem';
import Search_case from './search_case';
import { Case } from './Case';
import { Work } from './work';
import { MaterialOrder } from './material_order';
import { MoDetail } from './material_order';
import { Company_table} from './master_table';
import { Assets_table } from './master_table';
import { Contact_table } from './master_table';
import { Case_table } from './master_table';
import { Product_table } from './master_table';
import { Bookings } from './bookings';
import { ProductType_table } from './master_table';
import { ServiceCatalogPartsTable } from './master_table';

import { WarrantyService_table } from './master_table';
// import { ModalContextProvider } from './components/modal-context';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* <ModalContextProvider> */}
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Landing />} />
            <Route path='/search_case' element={<Search_case />} />
            <Route path='/case/:caseId' element={<Case />} />
            <Route path='/work/:woid' element={<Work />}/>
            <Route path='/material-order/:moid' element={<MaterialOrder />}/>
            <Route path='/mo_detail/:molineid' element={<MoDetail />}/>
            <Route path='/bookings' element={<Bookings/>}/>
            <Route path='/master/Company_table' element={<Company_table />} />
            <Route path='/master/Assets_table' element={<Assets_table />} />
            <Route path='/master/Contact_table' element={<Contact_table />} />
            <Route path='/master/Case_table' element={<Case_table />} />
            <Route path='/master/Product_table' element={<Product_table/>}/>
            <Route path='/master/ProductType_table' element={<ProductType_table/>}/>
            <Route path='/master/ServiceCatalogPartsTable' element={<ServiceCatalogPartsTable/>}/>
            {/* <Route path='/master/GlobalTradeCheckTable' element={<GlobalTradeCheckTable/>}/> */}
            <Route path='/master/WarrantyService_table' element={<WarrantyService_table/>}/>
          </Route>
          <Route path="/lorem" element={<Lorem />}/>
        </Routes>
      {/* </ModalContextProvider> */}
  </BrowserRouter>
  </StrictMode>,
)
