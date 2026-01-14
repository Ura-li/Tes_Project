// router.tsx
import React, { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { Loader2 } from "lucide-react";

// --- Lazy pages (same as you had) ---
const Landing = lazy(() => import("./pages/landing"));
const Lorem = lazy(() => import("./pages/Lorem"));
const Search_case = lazy(() => import("./pages/Search_case"));
const SearchCaseProto2 = lazy(() => import("./pages/SearchCase_V3"));
const Case = lazy(() => import("./pages/Case").then((m) => ({ default: m.Case })));
const Work = lazy(() => import("./pages/work").then((m) => ({ default: m.Work })));
const MaterialOrder = lazy(() =>
  import("./pages/material_order").then((m) => ({ default: m.MaterialOrder }))
);
const MoDetail = lazy(() =>
  import("./pages/material_order").then((m) => ({ default: m.MoDetail }))
);
const FlowCase = lazy(() =>
  import("./pages/FlowCase").then((m) => ({ default: m.FlowCase }))
);
const ErfCase = lazy(() =>
  import("./pages/ErfCase").then((m) => ({ default: m.ErfCase }))
);

const Bookings = lazy(() =>
  import("./bookings").then((m) => ({ default: m.Bookings }))
);
const Labor = lazy(() => import("./labor"));
const SignatureWrite = lazy(() => import("@/components/SignaturePad"));
const Auditwindows = lazy(() => import("./components/audit-windows"));
const Home = lazy(() => import("./Home").then((m) => ({ default: m.Home })));
const GateKeepingRouting = lazy(() =>
  import("./components/GateKeepingRouting").then((m) => ({
    default: m.GateKeepingRouting,
  }))
);
const MasterGateKeeping = lazy(() =>
  import("./components/MasterGateKeeping").then((m) => ({
    default: m.MasterGateKeeping,
  }))
);
const UserProfile = lazy(() =>
  import("./components/user-profile").then((m) => ({
    default: m.UserProfile,
  }))
);

const Forbidden = lazy(() => import("./pages/forbidden"));
const FrontDesk_Page = lazy(() => import("./layout/FrontDesk_Page"));
import { ViewCase } from "./pages/ViewCase";
import { UploadRma } from "./pages/uploadRMA";
const ErrorPage = lazy(() => import("./lib/error/Errorpage"))

// --- Master tables (same as before) ---
const masterTables = {
  Company_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Company_table }))
  ),
  Assets_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Assets_table }))
  ),
  Contact_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Contact_table }))
  ),
  Case_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Case_table }))
  ),
  Product_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Product_table }))
  ),
  ProductType_table: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.ProductType_table,
    }))
  ),
  WarrantyService_table: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.WarrantyService_table,
    }))
  ),
  Mo_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Mo_table }))
  ),
  Wo_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Wo_table }))
  ),
  ResourceAccountTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.ResourceAccountTable,
    }))
  ),
  SubkTechnician_table: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.SubkTechnician_table,
    }))
  ),
  SymptomCodeTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.SymptomCodeTable,
    }))
  ),
  BookingsTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.BookingsTable,
    }))
  ),
  BookingDetailsTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.BookingDetailsTable,
    }))
  ),
  User_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.User_table }))
  ),
  Part_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Part_table }))
  ),
  Resource_table: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.Resource_table }))
  ),
  RepairClassCodeTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.RepairClassCodeTable,
    }))
  ),
  ServiceCatalogTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.ServiceCatalogTable,
    }))
  ),
  ServiceTypeTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.ServiceTypeTable,
    }))
  ),
  OTCCodeTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.OTCCodeTable,
    }))
  ),
  CrsTable: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.CrsTable }))
  ),
  NmuTable: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.NmuTable }))
  ),
  NmuItemTable: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.NmuItemTable }))
  ),
  FailureTable: lazy(() =>
    import("./pages/master_table").then((m) => ({ default: m.FailureTable }))
  ),
  BookingStatusTable: lazy(() =>
    import("./pages/master_table").then((m) => ({
      default: m.BookingStatusTable,
    }))
  ),
};

const {
  Company_table,
  Assets_table,
  Contact_table,
  Case_table,
  Product_table,
  ProductType_table,
  WarrantyService_table,
  Mo_table,
  Wo_table,
  ResourceAccountTable,
  SubkTechnician_table,
  SymptomCodeTable,
  BookingsTable,
  BookingDetailsTable,
  User_table,
  Part_table,
  Resource_table,
  RepairClassCodeTable,
  ServiceCatalogTable,
  ServiceTypeTable,
  OTCCodeTable,
  CrsTable,
  NmuTable,
  NmuItemTable,
  FailureTable,
  BookingStatusTable,
} = masterTables;

// --- Simple components reused ---
const NotFound = () => (
  <div style={{ padding: 40, textAlign: "center" }}>
    <h2>404 - Page Not Found</h2>
  </div>
);

export const Loading = () => (
  <div
    style={{
      padding: 40,
      textAlign: "center",
      fontSize: 40,
    }}
  >
    <h2>Loading...</h2>
    <Loader2 className="h-20 w-50 animate-spin inline-block mr-2" />
  </div>
);

function WithSuspense({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}


// --- THE DATA ROUTER ---
export const router = createBrowserRouter([
  // /app layout and children
  {
    path: "/app",
    element: <GateKeepingRouting />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Landing /> },

      { path: "profiles", element: <UserProfile /> },
      { path: "frontdesk", element: <FrontDesk_Page /> },
      { path: "forbidden", element: <Forbidden /> },
      { path: "search_case", element: <Search_case /> },
      { path: "searchcaseproto2", element: <SearchCaseProto2 /> },
      { path: "case/:caseId", element: <Case /> },
      { path: "work/:woid", element: <Work /> },
      { path: "material-order/:moid", element: <MaterialOrder /> },
      { path: "mo_detail/:lineItemID", element: <MoDetail /> },
      { path: "bookings", element: <Bookings /> },
      { path: "bookings/:bookingid", element: <Bookings /> },
      { path: "labor", element: <Labor /> },
      { path: "flowcase", element: <FlowCase /> },
      { path: "ErfCase", element: <ErfCase /> },
      { path: "viewcase", element: <ViewCase /> },
      { path: "uploadRMA", element: <UploadRma /> },

      // --- Master routes (note: NO leading /app here, they are relative) ---
      {
        path: "master/Company_table",
        element: (
          <MasterGateKeeping allow={["admin", "fd"]}>
            <Company_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Assets_table",
        element: (
          <MasterGateKeeping allow={["admin", "fd"]}>
            <Assets_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Contact_table",
        element: (
          <MasterGateKeeping allow={["admin", "fd"]}>
            <Contact_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Case_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <Case_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Product_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <Product_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/ProductType_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <ProductType_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/WarrantyService_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <WarrantyService_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Mo_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <Mo_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Wo_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <Wo_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Resource_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <Resource_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/ResourceAccount",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <ResourceAccountTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/SubkTechnician",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <SubkTechnician_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/symptom_codes",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <SymptomCodeTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Bookings",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <BookingsTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/BookingDetails",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <BookingDetailsTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/BookingStatus",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <BookingStatusTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/User_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <User_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Part_table",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <Part_table />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/repairClassCode",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <RepairClassCodeTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/ServiceCatalog",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <ServiceCatalogTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/ServiceType",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <ServiceTypeTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/OTC_Code",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <OTCCodeTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/CrsTable",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <CrsTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/NmuTable",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <NmuTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/NmuItemTable",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <NmuItemTable />
          </MasterGateKeeping>
        ),
      },
      {
        path: "master/Failure",
        element: (
          <MasterGateKeeping allow={["admin"]}>
            <FailureTable />
          </MasterGateKeeping>
        ),
      },

      // catch-all under /app
      { path: "*", element: <NotFound /> },
    ],
  },

  // top-level routes
  { path: "/", element: <Home /> },
  { path: "/auditwindows", element: <Auditwindows /> },
  { path: "/lorem", element: <Lorem /> },
  { path: "/signature-pad", element: <SignatureWrite /> },

  // global catch-all
  { path: "*", element: <NotFound /> },
]);

