import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import Landing from "./landing";
import Lorem from "./Lorem";
import Search_case from "./Search_case";
import { Case } from "./Case";
import { Work } from "./work";
import { MaterialOrder, MoDetail } from "./material_order";
import {
  Company_table,
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
  FailureTable,
} from "./master_table";
import { Bookings } from "./bookings";
import { User_table } from "./master_table";
import { Part_table } from "./master_table";
import { Labor } from "./labor";
// import { ModalContextProvider } from './components/modal-context';
import { ResourceAccountTable } from "./master_table";

import { GateKeepingRouting } from "./components/GateKeepingRouting";
import { Buffer } from "buffer";
import { Auditwindows } from "./components/audit-windows";
import { Home } from "./Home";
import { DraftProvider } from "./components/DraftContext";
import { MasterGateKeeping } from "./components/MasterGateKeeping";
import Forbidden from "./components/forbidden";
window.Buffer = Buffer;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <ModalContextProvider> */}
      <DraftProvider>
        <Routes>
          {/* <Route path='/' element={<App />}> */}
          <Route path="/app" element={<GateKeepingRouting />}>
            <Route index element={<Landing />} />
            <Route path="/app/forbidden" element={<Forbidden />} />
            <Route path="/app/search_case" element={<Search_case />} />
            <Route path="/app/case/:caseId" element={<Case />} />
            <Route path="/app/work/:woid" element={<Work />} />
            <Route
              path="/app/material-order/:moid"
              element={<MaterialOrder />}
            />
            <Route path="/app/mo_detail/:lineItemID" element={<MoDetail />} />
            <Route path="/app/bookings" element={<Bookings />} />
            <Route path="/app/bookings/:bookingid" element={<Bookings />} />
            <Route path="/app/labor" element={<Labor />} />

            {/* <Route path='/app/master' element> */}

            <Route
              path="/app/master/Company_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Company_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Assets_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Assets_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Contact_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Contact_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Case_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Case_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Product_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Product_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/ProductType_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <ProductType_table />
                </MasterGateKeeping>
              }
            />
            {/* <Route path='/app/master/ServiceCatalogPartsTable' element={ <MasterGateKeeping allow={["admin"]} > <ServiceCatalogPartsTable/> </MasterGateKeeping> }/> */}
            {/* <Route path='/app/master/GlobalTradeCheckTable' element={ <MasterGateKeeping allow={["admin"]} > <GlobalTradeCheckTable/> </MasterGateKeeping> }/> */}
            <Route
              path="/app/master/WarrantyService_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <WarrantyService_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Mo_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Mo_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Wo_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Wo_table />
                </MasterGateKeeping>
              }
            />
            {/* <Route path='master/Resource' element={ <MasterGateKeeping allow={["admin"]} > <ResourceTable/> </MasterGateKeeping> }/> */}
            <Route
              path="/app/master/ResourceAccount"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <ResourceAccountTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/SubkTechnician"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <SubkTechnician_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/symptom_codes"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <SymptomCodeTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Bookings"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <BookingsTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/BookingDetails"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <BookingDetailsTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/User_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <User_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Part_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Part_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Resource_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Resource_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/repairClassCode"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <RepairClassCodeTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/ServiceCatalog"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <ServiceCatalogTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/OTC_Code"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <OTCCodeTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/CrsTable"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <CrsTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Failure"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <FailureTable />
                </MasterGateKeeping>
              }
            />
            {/* </Route> */}
          </Route>
          {/* </Route> */}
          <Route path="/" element={<Home />} />
          <Route path="/auditwindows" element={<Auditwindows />} />
          <Route path="/lorem" element={<Lorem />} />
        </Routes>
      </DraftProvider>
      {/* </ModalContextProvider> */}
    </BrowserRouter>
  </StrictMode>
);
