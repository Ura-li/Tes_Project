import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router";
import { Buffer } from "buffer";
import { DraftProvider } from "./components/DraftContext";
import { Loader2 } from "lucide-react";
import { ViewCase } from "./pages/ViewCase";
import { UploadRma } from "./pages/uploadRMA";
import { AuthProvider } from "./context/auth-context";
import { TeamProvider } from "./context/team-context";
import { router } from "./router";



// const Landing = lazy(() => import('./pages/landing'));
// const Lorem = lazy(() => import('./pages/Lorem'));
// const Search_case = lazy(() => import('./pages/Search_case'));
// const SearchCaseProto2 = lazy(() => import('./pages/SearchCase_V3'));
// const Case = lazy(() => import('./pages/Case').then(m => ({ default: m.Case })));
// const Work = lazy(() => import('./pages/work').then(m => ({ default: m.Work })));
// const MaterialOrder = lazy(() => import('./pages/material_order').then(m => ({ default: m.MaterialOrder })));
// const MoDetail = lazy(() => import('./pages/material_order').then(m => ({ default: m.MoDetail })));
// const FlowCase = lazy(() => import('./pages/FlowCase').then(m => ({ default: m.FlowCase })));
// const ErfCase = lazy(() => import('./pages/ErfCase').then(m => ({default: m.ErfCase})));
// 
// const masterTables = {
//   Company_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Company_table }))),
//   Assets_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Assets_table }))),
//   Contact_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Contact_table }))),
//   Case_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Case_table }))),
//   Product_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Product_table }))),
//   ProductType_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.ProductType_table }))),
//   WarrantyService_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.WarrantyService_table }))),
//   Mo_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Mo_table }))),
//   Wo_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Wo_table }))),
//   ResourceAccountTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.ResourceAccountTable }))),
//   SubkTechnician_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.SubkTechnician_table }))),
//   SymptomCodeTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.SymptomCodeTable }))),
//   BookingsTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.BookingsTable }))),
//   BookingDetailsTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.BookingDetailsTable }))),
//   User_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.User_table }))),
//   Part_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Part_table }))),
//   Resource_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Resource_table }))),
//   RepairClassCodeTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.RepairClassCodeTable }))),
//   ServiceCatalogTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.ServiceCatalogTable }))),
//   ServiceTypeTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.ServiceTypeTable }))),
//   OTCCodeTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.OTCCodeTable }))),
//   CrsTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.CrsTable }))),
//   FailureTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.FailureTable }))),
//   NmuTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.NmuTable }))),
//   NmuItemTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.NmuItemTable }))),
//   BookingStatusTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.BookingStatusTable }))),
// };
// 
// const {
//   Company_table,
//   Assets_table,
//   Contact_table,
//   Case_table,
//   Product_table,
//   ProductType_table,
//   WarrantyService_table,
//   Mo_table,
//   Wo_table,
//   ResourceAccountTable,
//   SubkTechnician_table,
//   SymptomCodeTable,
//   BookingsTable,
//   BookingDetailsTable,
//   User_table,
//   Part_table,
//   Resource_table,
//   RepairClassCodeTable,
//   ServiceCatalogTable,
//   ServiceTypeTable,
//   OTCCodeTable,
//   CrsTable,
//   NmuTable,
//   NmuItemTable,
//   FailureTable,
//   BookingStatusTable,
// } = masterTables;
// import { getUserFromToken } from "./lib/utils/auth";
// 
// 
// 
// 
// const Bookings = lazy(() => import('./bookings').then(m => ({ default: m.Bookings })));
// const Labor = lazy(() => import('./labor'));
// const SignatureWrite = lazy(() => import('@/components/SignaturePad'));
// const Auditwindows = lazy(() => import('./components/audit-windows'));
// const Home = lazy(() => import('./Home').then(m => ({ default: m.Home })));
// const GateKeepingRouting = lazy(() =>
//   import('./components/GateKeepingRouting').then(m => ({ default: m.GateKeepingRouting }))
// );const MasterGateKeeping = lazy(() => import('./components/MasterGateKeeping').then(m => ({ default: m.MasterGateKeeping })));
// const UserProfile = lazy(() => import('./components/user-profile').then(m => ({ default: m.UserProfile })));
// 
// const Forbidden = lazy(() => import('./pages/forbidden'));
// const FrontDesk_Page = lazy(() => import('./layout/FrontDesk_Page'));
// const NotFound = () => <div style={{ padding: 40, textAlign: 'center' }}><h2>404 - Page Not Found</h2></div>;
// const Loading = () => <div style={{ padding: 40, textAlign: 'center', fontSize: 40 }}><h2>Loading...</h2><Loader2 className="h-20 w-50 animate-spin inline-block mr-2"/></div>;
// 

window.Buffer = Buffer;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <TeamProvider>
      <DraftProvider>
    <RouterProvider router={router}/>
      </DraftProvider>
    </TeamProvider>
    </AuthProvider>
  </StrictMode>
);
