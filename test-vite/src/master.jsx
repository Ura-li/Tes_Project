import { Navigate } from "react-router";

export const MasterRoute = () => (
  <>
    <Route path="/Company_table" element={<Company_table />} />
    <Route path="/Assets_table" element={<Assets_table />} />
    <Route path="/Contact_table" element={<Contact_table />} />
    <Route path="/Case_table" element={<Case_table />} />
    <Route path="/Product_table" element={<Product_table />} />
    <Route path="/ProductType_table" element={<ProductType_table />} />
    <Route
      path="/WarrantyService_table"
      element={<WarrantyService_table />}
    />
  </>
);
