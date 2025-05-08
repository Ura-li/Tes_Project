import React, { useState, useEffect } from "react";
import ApiCustomer from "@/api";
import { ContactEdit, ContactDelete } from "@/components/sc-modal";
import { CompanyEdit, CompanyDelete } from "@/components/sc-modal";
import { ProductAdd, ProductEdit, ProductDelete } from "@/components/sc-modal";
import { BtnModalAsset, AssetEdit, AssetDelete } from "@/components/sc-modal";
import {
  ProductTypeAdd,
  ProductTypeEdit,
  ProductTypeDelete,
} from "@/components/sc-modal";
import {
  WarrantyServiceAdd,
  WarrantyServiceEdit,
  WarrantyServiceDelete,
} from "@/components/sc-modal";
import { MaterialOrderEdit, MaterialOrderDelete } from "@/components/sc-modal";
import { WorkOrderDelete, WorkOrderEdit } from "@/components/sc-modal";
import { UserAdd, UserEdit, UserDelete } from "@/components/sc-modal";
import { PartAdd,PartEdit, PartDelete } from "@/components/sc-modal";
import { ResourceAdd, ResourceEdit, ResourceDelete } from "@/components/sc-modal";
import { ResourceAccountAdd, ResourceAccountEdit, ResourceAccountDelete } from "@/components/sc-modal";
import { SubkTechnicianAdd, SubkTechnicianEdit, SubkTechnicianDelete } from "@/components/sc-modal";
import { SymptomCodeAdd, SymptomCodeEdit, SymptomCodeDelete } from "@/components/sc-modal";
import { BookingsAdd, BookingsEdit, BookingsDelete } from "@/components/sc-modal";
import { BookingDetailsAdd, BookingDetailsEdit, BookingDetailsDelete } from "@/components/sc-modal";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export const Contact_table = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Fungsi untuk mengambil data dari API
  const fetchContacts = async () => {
    // Menampilkan indikator loading menggunakan SweetAlert2
    Swal.fire({
      title: "Memuat Data Kontak...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });

    setLoading(true);
    setError(null);

    try {
      const response = await ApiCustomer.get(
        `/api/contact-information?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setContacts(response.data.data); // Menyimpan data kontak ke state
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching contact data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchTerm]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contact Table</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Search contacts..."
        className="mb-4 p-2 border border-gray-300 rounded w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
      />

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-scroll ">
        <table className="border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">No</th>
              <th className="border p-2">Contact ID</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Salutation</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Preferred Language</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Work Phone</th>
              <th className="border p-2">Work Extension</th>
              <th className="border p-2">Other Phone</th>
              <th className="border p-2">Other Extension</th>
              <th className="border p-2">Fax</th>
              <th className="border p-2">Address Line 1</th>
              <th className="border p-2">Address Line 2</th>
              <th className="border p-2">City</th>
              <th className="border p-2">State/Province</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Zip/Postal Code</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr
                  key={contact.ContactID}
                  className="hover:bg-gray-100 text-center"
                >
                  <td className="border p-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border p-2">{contact.ContactID}</td>
                  <td className="border p-2">{contact.Company}</td>
                  <td className="border p-2">{contact.Salutation}</td>
                  <td className="border p-2">{contact.FirstName}</td>
                  <td className="border p-2">{contact.LastName}</td>
                  <td className="border p-2">{contact.Email}</td>
                  <td className="border p-2">{contact.PreferredLanguage}</td>
                  <td className="border p-2">{contact.Phone}</td>
                  <td className="border p-2">{contact.Mobile}</td>
                  <td className="border p-2">{contact.WorkPhone}</td>
                  <td className="border p-2">{contact.WorkExtension}</td>
                  <td className="border p-2">{contact.OtherPhone}</td>
                  <td className="border p-2">{contact.OtherExtension}</td>
                  <td className="border p-2">{contact.Fax}</td>
                  <td className="border p-2">{contact.AddressLine1}</td>
                  <td className="border p-2">{contact.AddressLine2}</td>
                  <td className="border p-2">{contact.City}</td>
                  <td className="border p-2">{contact.StateProvince}</td>
                  <td className="border p-2">{contact.Country}</td>
                  <td className="border p-2">{contact.ZipPostalCode}</td>
                  <td className="border p-2 flex space-x-2">
                    <ContactEdit
                      contactID={contact.ContactID}
                      onUpdate={fetchContacts}
                    />
                    <ContactDelete contactID={contact.ContactID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const Company_table = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  //set modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk mengambil data dari API
  const fetchCompanies = async () => {
    Swal.fire({
      title: "Memuat Data Company...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setError(null);

    try {
      const response = await ApiCustomer.get(
        `/api/site_account?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setCompanies(response.data.data);
      setTotalPages(response.data.totalPages);

      Swal.close();
    } catch (err) {
      console.error("Error fetching company data:", err);
      setError("Failed to fetch data");

      Swal.close(); // Tetap tutup loading walaupun error
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data perusahaan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchTerm]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Company Table</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Search companies..."
        className="mb-4 p-2 border border-gray-300 rounded w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
      />

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">No</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Primary Phone</th>
              <th className="border p-2">Whatsapp Number</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <tr key={company.SiteAccountID} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border p-2">{company.Company}</td>
                  <td className="border p-2">{company.Email}</td>
                  <td className="border p-2">{company.PrimaryPhone}</td>
                  <td className="border p-2">{company.WhatsappNo}</td>
                  <td className="border p-2">{company.City}</td>
                  <td className="border p-2">{company.Country}</td>
                  <td className="border p-2 flex space-x-2">
                    <CompanyEdit
                      siteAccountId={company.SiteAccountID}
                      onUpdate={fetchCompanies}
                    />
                    <CompanyDelete
                      siteAccountId={company.SiteAccountID}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchCompanies}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const Case_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [caseData, setCaseData] = useState([]);
  // const [casetable, setCaseTable] = useState([
  //   {
  //     CaseID: "51337",
  //     CreatedOn: "2025-03-20",
  //     CaseSubject: "ID/NBD/...",
  //     CustomerAccount: "Bank Indonesia",
  //     Primary: "Achnesia",
  //     HW: "PIL001",
  //     SerialNumber: "4CE310C...",
  //     ProductNumber: "4NF92AV",
  //     ProductName: "HP Z2 SE...",
  //     CreatedName: "Muhammad Arif",
  //     Owner: "Risa Martiana",
  //     WorkGroup: "IDY_SB Ja...",
  //   },
  //   {
  //     CaseID: "67890",
  //     CreatedOn: "2025-03-19",
  //     CaseSubject: "ID/NBD/...",
  //     CustomerAccount: "PT.JAVA ABADI",
  //     Primary: "Irma khainur",
  //     HW: "P5U00",
  //     SerialNumber: "1CZ9200",
  //     ProductNumber: "4HF92AV",
  //     ProductName: "HP ProDesk...",
  //     CreatedName: "Kamisyah...",
  //     Owner: "Kamisyah Ind...",
  //     WorkGroup: "IDY_SB Ja...",
  //   },
  // ]);

  const fetchCaseDataTable = async () => {
    Swal.fire({
      title: "Memuat Data Case....",
      text: "Mohon Tunggu Sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setError(null);

    try {
      const response = await ApiCustomer.get("/api/case-information");

      if (response.data.success) {
        setCaseData(response.data.data);
      } else {
        setError("Failed to fetch case data");
      }

      Swal.close(); // <-- Tambahkan Swal.close() setelah berhasil
    } catch (err) {
      console.error("Error fetching case data:", err);
      setError("Error fetching data");

      Swal.close(); // Tetap tutup loading jika error

      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data perusahaan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchCaseDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredCaseTable = caseData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredCaseTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredCaseTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ID Daily Aging Cases Javag FY</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🔹 Loading & Error Messages */}
      {loading && <p>Loading cases...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Case ID</th>
              <th className="border p-2">Created On</th>
              <th className="border p-2">Case Subject</th>
              <th className="border p-2">Customer Account</th>
              <th className="border p-2">Primary</th>
              <th className="border p-2">HW</th>
              <th className="border p-2">Serial Number</th>
              <th className="border p-2">Product Number</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Created Name</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">WorkGroup</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((caseItem) => (
              <tr
                key={caseItem.CaseID}
                className="hover:bg-gray-100 text-center"
              >
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/case/${caseItem.CaseID}`)}
                >
                  {caseItem.CaseID}
                </td>
                <td className="border p-2">{caseItem.CreatedOn}</td>
                <td className="border p-2">{caseItem.CaseSubject}</td>
                <td className="border p-2">{caseItem.CustomerAccount}</td>
                <td className="border p-2">{caseItem.Primary}</td>
                <td className="border p-2">{caseItem.HW}</td>
                <td className="border p-2">{caseItem.SerialNumber}</td>
                <td className="border p-2">{caseItem.ProductNumber}</td>
                <td className="border p-2">{caseItem.ProductName}</td>
                <td className="border p-2">{caseItem.CreatedName}</td>
                <td className="border p-2">{caseItem.Owner}</td>
                <td className="border p-2">{caseItem.WorkGroup}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCaseTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No cases found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Assets_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, [currentPage, searchTerm]);

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Asset...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get(
        `/api/asset-information?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setAssets(response.data.data);
      setTotalPages(response.data.totalPages);

      Swal.close(); // Tutup loading kalau berhasil
    } catch (err) {
      console.error("Error fetching asset data:", err);
      setError("Failed to fetch data");

      Swal.close(); // Tetap tutup loading walau error

      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data asset.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Asset Information Table</h2>
      <div className="space-x-2">
        {/* <BtnModalAsset /> */}
        {/* Input Pencarian */}
        <input
          type="text"
          placeholder="Search asset... "
          className="mb-4 p-2 border border-gray-300 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset ke halaman pertama saat mencari
          }}
        />
      </div>

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">No</th>
              <th className="border p-2">Asset ID</th>
              <th className="border p-2">Serial Number</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Product Number</th>
              <th className="border p-2">Product Line</th>
              <th className="border p-2">Site Account ID</th>
              <th className="border p-2">Contact ID</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset, index) => (
                <tr key={asset.AssetID} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border p-2">{asset.AssetID}</td>
                  <td className="border p-2">{asset.SerialNumber}</td>
                  <td className="border p-2">
                    {asset.product_information?.ProductName}
                  </td>
                  <td className="border p-2">{asset.ProductNumber}</td>
                  <td className="border p-2">
                    {asset.product_information?.ProductLine}
                  </td>
                  <td className="border p-2">{asset.SiteAccountID}</td>
                  <td className="border p-2">{asset.ContactID}</td>
                  <td className="border p-2 flex space-x-2">
                    <AssetEdit assetId={asset.AssetID} onUpdate={fetchAssets} />
                    <AssetDelete assetId={asset.AssetID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const Product_table = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  //set modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk mengambil data dari API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Produk...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get(
        `/api/product-information?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);

      Swal.close(); // Tutup loading Swal setelah sukses
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("Failed to fetch data");

      Swal.close(); // Tutup Swal kalau error juga

      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data produk.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Table</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Search product..."
        className="mb-4 p-2 border border-gray-300 rounded w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
      />

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      <ProductAdd></ProductAdd>
      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">No</th>
              <th className="border p-2">Product Number</th>
              <th className="border p-2">Product Line</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Product Type</th>
              <th className="border p-2">Product Group</th>
              <th className="border p-2">Product Tower</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.ProductNumber} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border p-2">{product.ProductNumber}</td>
                  <td className="border p-2">{product.ProductLine}</td>
                  <td className="border p-2">{product.ProductName}</td>
                  <td className="border p-2">
                    {product.product_type?.ProductType}
                  </td>
                  <td className="border p-2">
                    {product.product_type?.ProductGroup}
                  </td>
                  <td className="border p-2">
                    {product.product_type?.ProductTower}
                  </td>
                  <td className="border p-2">-</td>
                  <td className="border p-2 flex space-x-2">
                    <ProductEdit
                      ProductNumber={product.ProductNumber}
                      onUpdate={fetchProducts}
                    />
                    <ProductDelete
                      ProductNumber={product.ProductNumber}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchProducts}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const ProductType_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ProductTypeData, setProductTypeData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductTypeDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Tipe Produk...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/product-type");
      if (response.data.success) {
        setProductTypeData(response.data.data);
        Swal.close(); // Tutup Swal saat sukses
      } else {
        setError("Failed to fetch ProductType data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data tipe produk.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching ProductType data:", err);
      setError("Error fetching data");

      Swal.close(); // Tutup Swal saat error
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data tipe produk.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchProductTypeDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredProductTypeTable = ProductTypeData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredProductTypeTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredProductTypeTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ProductType Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ProductTypeAdd> </ProductTypeAdd>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">ProductType ID</th>
              <th className="border p-2">Product Tower</th>
              <th className="border p-2">Product Group</th>
              <th className="border p-2">Product Type</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ProductTypeItem) => (
              <tr
                key={ProductTypeItem.ProductTypeID}
                className="hover:bg-gray-100 text-center"
              >
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/case/${ProductTypeItem.ProductTypeID}`)
                  }
                >
                  {ProductTypeItem.ProductTypeID}
                </td>
                <td className="border p-2">{ProductTypeItem.ProductTower}</td>
                <td className="border p-2">{ProductTypeItem.ProductGroup}</td>
                <td className="border p-2">{ProductTypeItem.ProductType}</td>
                <td className="border p-2 flex space-x-2">
                  <ProductTypeEdit
                    ProductTypeID={ProductTypeItem.ProductTypeID}
                    onUpdate={fetchProductTypeDataTable}
                  />
                  <ProductTypeDelete
                    ProductTypeID={ProductTypeItem.ProductTypeID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchProductTypeDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProductTypeTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const WarrantyService_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [WarrantyServiceData, setWarrantyServiceData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWarrantyServiceDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Warranty Service...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/warranty-services");
      if (response.data.success) {
        setWarrantyServiceData(response.data.data);
        Swal.close(); // Tutup Swal kalau sukses
      } else {
        setError("Failed to fetch Warranty Service data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Warranty Service.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Warranty Service data:", err);
      setError("Error fetching data");

      Swal.close(); // Tutup Swal kalau error
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Warranty Service.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchWarrantyServiceDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredWarrantyServiceTable = WarrantyServiceData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(
    filteredWarrantyServiceTable.length / itemsPerPage
  );

  // Ambil data sesuai halaman saat ini
  const currentData = filteredWarrantyServiceTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Warranty Service Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <WarrantyServiceAdd></WarrantyServiceAdd>

      {/* 🔹 Loading & Error Messages */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Service offerID</th>
              <th className="border p-2">Service description</th>
              <th className="border p-2">Csutomer Tat</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Shipping Fee</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Tax</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((WarrantyServiceItem) => (
              <tr
                key={WarrantyServiceItem.Service_offerID}
                className="hover:bg-gray-100 text-center"
              >
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/case/${WarrantyServiceItem.Service_offerID}`)
                  }
                >
                  {WarrantyServiceItem.Service_offerID}
                </td>
                <td className="border p-2">
                  {WarrantyServiceItem.Service_description}
                </td>
                <td className="border p-2">{WarrantyServiceItem.CTat_RTime}</td>
                <td className="border p-2">{WarrantyServiceItem.Price}</td>
                <td className="border p-2">
                  {WarrantyServiceItem.Shipping_Fee}
                </td>
                <td className="border p-2">{WarrantyServiceItem.qty_ws}</td>
                <td className="border p-2">{WarrantyServiceItem.Tax}</td>
                <td className="border p-2">{WarrantyServiceItem.Total}</td>
                <td className="border p-2 flex space-x-2">
                  <WarrantyServiceEdit
                    Service_offerID={WarrantyServiceItem.Service_offerID}
                    onUpdate={fetchWarrantyServiceDataTable}
                  ></WarrantyServiceEdit>
                  <WarrantyServiceDelete
                    Service_offerID={WarrantyServiceItem.Service_offerID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchWarrantyServiceDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredWarrantyServiceTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Mo_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [MaterialOrderData, setMaterialOrderData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMaterialOrderDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Material Order...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/mo-detaill");
      if (response.data.success) {
        setMaterialOrderData(response.data.data);
        Swal.close(); // Tutup loading kalau sukses
      } else {
        setError("Failed to fetch Material Order data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Material Order.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Material Order data:", err);
      setError("Error fetching data");

      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Material Order.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchMaterialOrderDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredMaterialOrderTable = MaterialOrderData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(
    filteredMaterialOrderTable.length / itemsPerPage
  );

  // Ambil data sesuai halaman saat ini
  const currentData = filteredMaterialOrderTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Material Order Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">MO ID</th>
              <th className="border p-2">WOID</th>
              <th className="border p-2">Order Number</th>
              <th className="border p-2">Order Status</th>
              <th className="border p-2">Order Type</th>
              <th className="border p-2">Created On</th>
              <th className="border p-2">Sales Order Number</th>
              <th className="border p-2">RMANumber</th>
              <th className="border p-2">Ready For Closure Date</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((MaterialOrderItem) => (
              <tr
                key={MaterialOrderItem.MOID}
                className="hover:bg-gray-100 text-center"
              >
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/material-order/${MaterialOrderItem.MOID}`)
                  }
                >
                  {MaterialOrderItem.MOID}
                </td>
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/work/${MaterialOrderItem.WOID}`)}
                >
                  {MaterialOrderItem.WOID}
                </td>
                <td className="border p-2">{MaterialOrderItem.OrderNumber}</td>
                <td className="border p-2">{MaterialOrderItem.OrderStatus}</td>
                <td className="border p-2">{MaterialOrderItem.OrderType}</td>
                <td className="border p-2">{MaterialOrderItem.CreatedOn}</td>
                <td className="border p-2">
                  {MaterialOrderItem.SalesOrderNumber}
                </td>
                <td className="border p-2">{MaterialOrderItem.RMANumber}</td>
                <td className="border p-2">
                  {MaterialOrderItem.ReadyForClosureDate}
                </td>
                <td className="border p-2">{MaterialOrderItem.Owner}</td>
                <td className="border p-2 flex space-x-2">
                  {/* <WarrantyServiceEdit Service_offerID={WarrantyServiceItem.Service_offerID} onUpdate={fetchWarrantyServiceDataTable}></WarrantyServiceEdit>
                   */}

                  <MaterialOrderEdit
                    MOID={MaterialOrderItem.MOID}
                    onUpdate={fetchMaterialOrderDataTable}
                  />

                  <MaterialOrderDelete
                    MOID={MaterialOrderItem.MOID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchMaterialOrderDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMaterialOrderTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Wo_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [WorkOrderData, setWorkOrderData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorkOrderDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Work Order...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/work-order");
      if (response.data.success) {
        setWorkOrderData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Work Order data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Work Order.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Work Order data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Work Order.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchWorkOrderDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredWorkOrderTable = WorkOrderData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredWorkOrderTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredWorkOrderTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Work Order Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">WOID</th>
              <th className="border p-2">Case ID</th>
              <th className="border p-2">Work Order Type</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">System Status</th>
              <th className="border p-2">Sub Status</th>
              <th className="border p-2">Preferred Day</th>
              <th className="border p-2">Preferred Time</th>
              <th className="border p-2">Shipment Country</th>
              <th className="border p-2">Shipment State</th>
              <th className="border p-2">Created On</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">SLAJeopardy</th>
              <th className="border p-2">DueDate Customer</th>
              <th className="border p-2">Coverage Window</th>
              <th className="border p-2">Response</th>
              <th className="border p-2">OTCCode</th>
              <th className="border p-2">Requested DateTime Customer</th>
              <th className="border p-2">Guaranteed FixTime Customer</th>
              <th className="border p-2">Early Start DateTime Customer</th>
              <th className="border p-2">Latest Start DateTime Customer</th>
              <th className="border p-2">SLAReschedule</th>
              <th className="border p-2">Active Schedule Date</th>
              <th className="border p-2">SLA Error Description</th>
              <th className="border p-2">Case Priority Index</th>
              <th className="border p-2">Partner Status</th>
              <th className="border p-2">WorkOrder Description</th>
              <th className="border p-2">PartnerNotes</th>
              <th className="border p-2">Incoming Channel</th>
              <th className="border p-2">material order</th>
              <th className="border p-2">Case Information</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((WorkOrderItem) => (
              <tr
                key={WorkOrderItem.WOID}
                className="hover:bg-gray-100 text-center"
              >
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/work/${WorkOrderItem.WOID}`)}
                >
                  {WorkOrderItem.WOID}
                </td>
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/case/${WorkOrderItem.CaseID}`)}
                >
                  {WorkOrderItem.CaseID}
                </td>
                <td className="border p-2">{WorkOrderItem.WorkOrderType}</td>
                <td className="border p-2">{WorkOrderItem.Priority}</td>
                <td className="border p-2">{WorkOrderItem.SystemStatus}</td>
                <td className="border p-2">{WorkOrderItem.SubStatus}</td>
                <td className="border p-2">{WorkOrderItem.PreferredDay}</td>
                <td className="border p-2">{WorkOrderItem.PreferredTime}</td>
                <td className="border p-2">{WorkOrderItem.ShipmentCountry}</td>
                <td className="border p-2">{WorkOrderItem.ShipmentState}</td>
                <td className="border p-2">{WorkOrderItem.CreatedOn}</td>
                <td className="border p-2">{WorkOrderItem.Owner}</td>
                <td className="border p-2">{WorkOrderItem.SLAJeopardy}</td>
                <td className="border p-2">{WorkOrderItem.DueDateCustomer}</td>
                <td className="border p-2">{WorkOrderItem.CoverageWindow}</td>
                <td className="border p-2">{WorkOrderItem.Response}</td>
                <td className="border p-2">{WorkOrderItem.OTCCode}</td>
                <td className="border p-2">
                  {WorkOrderItem.RequestedDateTimeCustomer}
                </td>
                <td className="border p-2">
                  {WorkOrderItem.GuaranteedFixTimeCustomer}
                </td>
                <td className="border p-2">
                  {WorkOrderItem.EarlyStartDateTimeCustomer}
                </td>
                <td className="border p-2">
                  {WorkOrderItem.LatestStartDateTimeCustomer}
                </td>
                <td className="border p-2">{WorkOrderItem.SLAReschedule}</td>
                <td className="border p-2">
                  {WorkOrderItem.ActiveScheduleDate}
                </td>
                <td className="border p-2">
                  {WorkOrderItem.SLAErrorDescription}
                </td>
                <td className="border p-2">
                  {WorkOrderItem.CasePriorityIndex}
                </td>
                <td className="border p-2">{WorkOrderItem.PartnerStatus}</td>
                <td className="border p-2">
                  {WorkOrderItem.WorkOrderDescription}
                </td>
                <td className="border p-2">{WorkOrderItem.PartnerNotes}</td>
                <td className="border p-2">{WorkOrderItem.IncomingChannel}</td>
                <td className="border p-2">{WorkOrderItem.MaterialOrder}</td>
                <td className="border p-2">{WorkOrderItem.CaseInformation}</td>
                <td className="border p-2 flex space-x-2">
                  <WorkOrderEdit
                    WOID={WorkOrderItem.WOID}
                    onUpdate={fetchWorkOrderDataTable}
                  />
                  <WorkOrderDelete
                    MOID={WorkOrderItem.MOID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchWorkOrderDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredWorkOrderTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const User_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [UserData, setUserData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data User...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/user");
      if (response.data.success) {
        setUserData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Userr data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data User.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching User data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data User.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchUserDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredUserTable = UserData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredUserTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredUserTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <UserAdd></UserAdd>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">ID User</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Password</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Profil Photo</th>
              <th className="border p-2">CreatedAt</th>
              <th className="border p-2">UpdateAt</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((UserItem) => (
              <tr
                key={UserItem.IDUser}
                className="hover:bg-gray-100 text-center"
              >
                <td className="border p-2 text-blue-500 cursor-pointer hover:underline">
                  {UserItem.IDUser}
                </td>
                <td className="border p-2">{UserItem.Email}</td>
                <td className="border p-2">{UserItem.Username}</td>
                <td className="border p-2">{UserItem.Password}</td>
                <td className="border p-2">{UserItem.Name}</td>
                <td className="border p-2">{UserItem.Role}</td>
                <td className="border p-2">{UserItem.ProfilPhoto}</td>
                <td className="border p-2">{UserItem.CreatedAt}</td>
                <td className="border p-2">{UserItem.UpdatedAt}</td>
                <td className="border p-2 flex space-x-2">
                  <UserEdit
                    IDUser={UserItem.IDUser}
                    onUpdate={fetchUserDataTable}
                  ></UserEdit>
                  <UserDelete
                    IDUser={UserItem.IDUser}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchUserDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUserTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Part_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [PartData, setPartData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPartDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Part...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/service-log/parts-catalog");
      if (response.data.success) {
        setPartData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Part data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Part.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Part data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Part.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchPartDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredPartTable = PartData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredPartTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredPartTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Part Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <PartAdd/>
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">PartNumber</th>
              <th className="border p-2"> Keyword </th>
              <th className="border p-2">PartDescription </th>
              <th className="border p-2">Orderability</th>
              <th className="border p-2">RestrictionReason</th>
              <th className="border p-2">CSR_Flag</th>
              <th className="border p-2"> ROHS Flag </th>
              <th className="border p-2">Returnable Flag</th>
              <th className="border p-2">HardRoll Flag</th>
              <th className="border p-2">DangerousGoods Flag</th>
              <th className="border p-2">LithiumBattery Flag</th>
              <th className="border p-2">Oversize Flag </th>
              <th className="border p-2">Heavy Flag </th>
              <th className="border p-2">Price </th>
              <th className="border p-2">FreightPrice </th>
              <th className="border p-2">Tax</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Shipping_Fee</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((PartItem) => (
              <tr
                key={PartItem.PartNumber}
                className="hover:bg-gray-100 text-center"
              >
                <td className="border p-2 text-blue-500 cursor-pointer hover:underline">
                  {PartItem.PartNumber}
                </td>
                <td className="border p-2">{PartItem.Keyword}</td>
                <td className="border p-2">{PartItem.PartDescription}</td>
                <td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Orderability ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Orderability ? "Yes" : "No"}
  </span>
</td>
                <td className="border p-2">{PartItem.RestrictionReason}</td>
                 <td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.CSR_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.CSR_Flag ? "Yes" : "No"}
  </span>
</td>
                <td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.ROHS_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.ROHS_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Returnable_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Returnable_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.HardRoll_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.HardRoll_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.DangerousGoods_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.DangerousGoods_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.LithiumBattery_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.LithiumBattery_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Oversize_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Oversize_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="border p-2">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Heavy_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Heavy_Flag ? "Yes" : "No"}
  </span>
</td>
 <td className="border p-2">{PartItem.Price}</td>
                <td className="border p-2">{PartItem.FreightPrice}</td>
                <td className="border p-2">{PartItem.Tax}</td>
                <td className="border p-2">{PartItem.Total}</td>
                <td className="border p-2">{PartItem.Shipping_Fee}</td>
                <td className="border p-2 flex space-x-2">
                <PartEdit PartNumber={PartItem.PartNumber} onUpdate={fetchPartDataTable}></PartEdit>
                <PartDelete
                  PartNumber={PartItem.PartNumber}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onUpdate={fetchPartDataTable}
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPartTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Resource_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ResourceData, setResourceData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResourceDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Resource...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/resources");
      if (response.data.success) {
        setResourceData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Resource data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Resource.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Resource data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Resource.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchResourceDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredResourceTable = ResourceData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredResourceTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredResourceTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Resource Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ResourceAdd/>  
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Resource ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ResourceItem) => (
              <tr
                key={ResourceItem.ResourceId}
                className="hover:bg-gray-100 text-center"
              >
                <td className="border p-2 text-blue-500 cursor-pointer hover:underline">
                  {ResourceItem.ResourceId}
                </td>
                <td className="border p-2">{ResourceItem.Name}</td>
                <td className="border p-2 flex space-x-2">
                <ResourceEdit ResourceId={ResourceItem.ResourceId} onUpdate={fetchResourceDataTable}></ResourceEdit>
                <ResourceDelete
                  ResourceId={ResourceItem.ResourceId}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onUpdate={fetchResourceDataTable}                
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredResourceTable.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};  

export const ResourceAccountTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resourceAccounts, setResourceAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState([]);

const fetchResources = async () => {
  try {
    const response = await ApiCustomer.get("/api/resources"); // Adjust API endpoint if different
    if (response.data.success) {
      setResources(response.data.data);
    }
  } catch (err) {
    console.error("Error fetching resources:", err);
  }
};
  const fetchResourceAccounts = async () => {
    
    Swal.fire({
      title: "Memuat Data Resource Account...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });  

    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/resource-account");
      if (response.data.success) {
        setResourceAccounts(response.data.data);
      } else {
        setError("Failed to fetch resource accounts");
      }
    } catch (err) {
      console.error("Error fetching resource accounts:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchResources();
    fetchResourceAccounts();
  }, []);

  const filteredAccounts = resourceAccounts.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentData = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Resource Accounts</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ResourceAccountAdd onAdd={fetchResourceAccounts} />

      {loading && <p>Loading accounts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Resource Account ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Resource ID</th>
              {/* <th className="border p-2">SUbk Technicians</th>
              <th className="border p-2">Booking Details</th> */}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((account) => (
              <tr key={account.ResourceAccountId} className="hover:bg-gray-100 text-center">
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/resource-account/${account.ResourceAccountId}`)}
                >
                  {account.ResourceAccountId}
                </td>
                <td className="border p-2">{account.Name}</td>
                <td className="border p-2">{account.ResourceId || "-"}</td>
                <td className="border p-2 flex space-x-2 justify-center">
                  <ResourceAccountEdit
                    ResourceAccountId={account.ResourceAccountId}
                    resources={resources}
                    onUpdate={fetchResourceAccounts}
                  />
                  <ResourceAccountDelete
                    ResourceAccountId={account.ResourceAccountId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchResourceAccounts}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAccounts.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No accounts found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const SubkTechnician_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subkTechnicianData, setSubkTechnicianData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubkTechnicianData = async () => {
    Swal.fire({
      title: "Memuat Data Subk Technician...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/subk-technician");
      if (response.data.success) {
        setSubkTechnicianData(response.data.data);
      } else {
        setError("Failed to fetch SubkTechnician data");
      }
    } catch (err) {
      console.error("Error fetching SubkTechnician data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchSubkTechnicianData();
  }, []);

  const filteredData = subkTechnicianData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Subk Technician Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SubkTechnicianAdd onUpdate={fetchSubkTechnicianData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Subk Technician ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Resource Account ID</th>
              {/* <th className="border p-2">Booking Details</th> */}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.SubkTechnicianId} className="hover:bg-gray-100 text-center">
                <td className="border p-2 text-blue-500 cursor-pointer hover:underline" onClick={() => navigate(`/subk-technician/${item.SubkTechnicianId}`)}>
                  {item.SubkTechnicianId}
                </td>
                <td className="border p-2">{item.Name}</td>
                <td className="border p-2">{item.resourceAccount?.Name || "N/A"}</td>
                <td className="border p-2 flex space-x-2 justify-center">
                  <SubkTechnicianEdit SubkTechnicianId={item.SubkTechnicianId} onUpdate={fetchSubkTechnicianData} />
                  <SubkTechnicianDelete
                    SubkTechnicianId={item.SubkTechnicianId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchSubkTechnicianData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const SymptomCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptomCodeData, setSymptomCodeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSymptomCodeData = async () => {
    Swal.fire({
      title: "Memuat Data Symptom Codes...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/symptom-codes");
      if (response.data.success) {
        setSymptomCodeData(response.data.data);
      } else {
        setError("Failed to fetch SymptomCode data");
      }
    } catch (err) {
      console.error("Error fetching SymptomCode data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchSymptomCodeData();
  }, []);

  const filteredData = symptomCodeData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Symptom Code Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SymptomCodeAdd onUpdate={fetchSymptomCodeData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Symptom Code ID</th>
              <th className="border p-2">Symptom Code</th>
              <th className="border p-2">Top Category</th>
              <th className="border p-2">Sub Category</th>
              <th className="border p-2">Quality Codes</th>
              <th className="border p-2">Created On</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.SymptomCodeID} className="hover:bg-gray-100 text-center">
                <td className="border p-2 text-blue-500 cursor-pointer hover:underline" onClick={() => navigate(`/symptom-code/${item.SymptomCodeID}`)}>
                  {item.SymptomCodeID}
                </td>
                <td className="border p-2">{item.SymptomCode}</td>
                <td className="border p-2">{item.TopCategory}</td>
                <td className="border p-2">{item.SubCategory}</td>
                <td className="border p-2">{item.QualityCodes || "N/A"}</td>
                <td className="border p-2">
                  {new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="border p-2 flex space-x-2 justify-center">
                  <SymptomCodeEdit SymptomCodeID={item.SymptomCodeID} onUpdate={fetchSymptomCodeData} />
                  <SymptomCodeDelete
                    SymptomCodeID={item.SymptomCodeID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchSymptomCodeData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const BookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookingData = async () => {
    Swal.fire({
      title: "Memuat Data Bookings...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/booking");
      if (response.data.success) {
        setBookingData(response.data.data);
      } else {
        setError("Failed to fetch booking data");
      }
    } catch (err) {
      console.error("Error fetching booking data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  const filteredData = bookingData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bookings Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <BookingsAdd onUpdate={fetchBookingData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Booking ID</th>
              <th className="border p-2">WOID</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Schedule Jeopardy</th>
              <th className="border p-2">Jeopardy Time</th>
              <th className="border p-2">Do Not Disturb</th>
              <th className="border p-2">CE Schedule Change</th>
              <th className="border p-2">Durations (min)</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.BookingId} className="hover:bg-gray-100 text-center">
                <td
                  className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/bookings/${item.BookingId}`)}
                >
                  {item.BookingId}
                </td>
                <td className="border p-2">{item.WOID}</td>
                <td className="border p-2">{item.BookingStatus || "-"}</td>
                <td className="border p-2">{item.ScheduleJeopardy ? "Yes" : "No"}</td>
                <td className="border p-2">
                  {item.ScheduleJeopardyTime
                    ? new Date(item.ScheduleJeopardyTime).toLocaleString("id-ID")
                    : "-"}
                </td>
                <td className="border p-2">{item.DoNotDisturb ? "Yes" : "No"}</td>
                <td className="border p-2">{item.CeScheduleChange ? "Yes" : "No"}</td>
                <td className="border p-2">
                  Total Billable: {item.TotalBillableDurationInMinutes || 0} <br/> 
                  Total In Progress: {item.TotalInProgressDurationInMinutes || 0}  <br/>
                  Total Break: {item.TotalBreakDurationInMinutes || 0}
                </td>
                <td className="border p-2">{item.CreatedBy}</td>
                <td className="border p-2">
                  {new Date(item.CreatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="border p-2 flex space-x-2 justify-center">
                  <BookingsEdit BookingId={item.BookingId} onUpdate={fetchBookingData} />
                  <BookingsDelete
                    BookingId={item.BookingId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchBookingData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const BookingDetailsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingDetailsData, setBookingDetailsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchBookingDetails = async () => {
    Swal.fire({
      title: "Memuat Data Booking Details...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/bookingDetails");
      if (response.data.success) {
        setBookingDetailsData(response.data.data);
      } else {
        setError("Failed to fetch booking details data");
      }
    } catch (err) {
      console.error("Error fetching booking details data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const filteredData = bookingDetailsData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Booking Details Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <BookingDetailsAdd onUpdate={fetchBookingDetails} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm text-center">
              <th className="border p-2">Booking Detail ID</th>
              <th className="border p-2">Booking ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Customer Time</th>
              <th className="border p-2">User Time</th>
              <th className="border p-2">Changed By</th>
              <th className="border p-2">Changed At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.BookingDetailId} className="hover:bg-gray-100 text-center text-sm">
                <td className="border p-2 text-blue-500 cursor-pointer hover:underline"
                  onClick={() => navigate(`/booking-details/${item.BookingDetailId}`)}
                >
                  {item.BookingDetailId}
                </td>
                <td className="border p-2">{item.BookingId}</td>
                <td className="border p-2">{item.Name}</td>
                <td className="border p-2">{item.Status}</td>

                <td className="border p-2 text-left">
                  <div>Start: {item.StartTimeCustomerTime ? new Date(item.StartTimeCustomerTime).toLocaleString() : "-"}</div>
                  <div>End: {item.EndTimeCustomerTime ? new Date(item.EndTimeCustomerTime).toLocaleString() : "-"}</div>
                  <div>Est. Arrival: {item.EstimatedArrivalTimeCustomerTime ? new Date(item.EstimatedArrivalTimeCustomerTime).toLocaleString() : "-"}</div>
                  <div>Actual Arrival: {item.ActualArrivalTimeCustomerTime ? new Date(item.ActualArrivalTimeCustomerTime).toLocaleString() : "-"}</div>
                </td>

                <td className="border p-2 text-left">
                  <div>Start: {item.StartTimeUserTime ? new Date(item.StartTimeUserTime).toLocaleString() : "-"}</div>
                  <div>End: {item.EndTimeUserTime ? new Date(item.EndTimeUserTime).toLocaleString() : "-"}</div>
                  <div>Duration: {item.DurationInMinutesUserTime || 0} min</div>
                  <div>Est. Arrival: {item.EstimatedArrivalTimeUserTime ? new Date(item.EstimatedArrivalTimeUserTime).toLocaleString() : "-"}</div>
                  <div>Actual Arrival: {item.ActualArrivalTimeUserTime ? new Date(item.ActualArrivalTimeUserTime).toLocaleString() : "-"}</div>
                </td>

                <td className="border p-2">{item.ChangedBy}</td>
                <td className="border p-2">
                  {new Date(item.ChangedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="border p-2 flex justify-center gap-2">
                  <BookingDetailsEdit
                    BookingDetailId={item.BookingDetailId}
                    onUpdate={fetchBookingDetails}
                  />
                  <BookingDetailsDelete
                    BookingDetailId={item.BookingDetailId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchBookingDetails}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};