import React, { useState, useEffect , useMemo} from "react";
import ApiCustomer from "@/api";
import { ContactEdit, ContactDelete } from "@/components/model/sc-modal";
import { CompanyEdit, CompanyDelete } from "@/components/model/sc-modal";
import { ProductAdd, ProductEdit, ProductDelete } from "@/components/model/sc-modal";
import { BtnModalAsset, AssetEdit, AssetDelete } from "@/components/model/sc-modal";
import {
  ProductTypeAdd,
  ProductTypeEdit,
  ProductTypeDelete,
} from "@/components/model/sc-modal";
import {
  WarrantyServiceAdd,
  WarrantyServiceEdit,
  WarrantyServiceDelete,
} from "@/components/model/sc-modal";
import { MaterialOrderEdit, MaterialOrderDelete } from "@/components/model/sc-modal";
import { WorkOrderDelete, WorkOrderEdit } from "@/components/model/sc-modal";
import { UserAdd, UserEdit, UserDelete } from "@/components/model/sc-modal";
import { PartAdd,PartEdit, PartDelete } from "@/components/model/sc-modal";
import { ResourceAdd, ResourceEdit, ResourceDelete } from "@/components/model/sc-modal";
import { ResourceAccountAdd, ResourceAccountEdit, ResourceAccountDelete } from "@/components/model/sc-modal";
import { SubkTechnicianAdd, SubkTechnicianEdit, SubkTechnicianDelete } from "@/components/model/sc-modal";
import { SymptomCodeAdd, SymptomCodeEdit, SymptomCodeDelete } from "@/components/model/sc-modal";
import { BookingsAdd, BookingsEdit, BookingsDelete } from "@/components/model/sc-modal";
import { BookingDetailsAdd, BookingDetailsEdit, BookingDetailsDelete } from "@/components/model/sc-modal";
import { RepairClassCodeAdd, RepairClassCodeEdit, RepairClassCodeDelete } from "@/components/model/sc-modal";
import { ServiceCatalogAdd, ServiceCatalogEdit, ServiceCatalogDelete } from "@/components/model/sc-modal";
import { OTCAdd, OTCEdit, OTCDelete} from "@/components/model/sc-modal";
import { CrsAdd, CrsEdit, CrsDelete } from "@/components/model/sc-modal";
import { FailureAdd, 
  FailureEdit, 
  FailureDelete } from "@/components/model/sc-modal";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ExportExcel } from "@/components/Export-Excel";

import { Select, SelectItem, SelectTrigger, SelectContent, SelectGroup, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
// import PDFButton from "./components/PDFButton";
// import ServiceRequestPDF from "./components/service-request-form";
export const Contact_table = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goToPageInput, setGoToPageInput] = useState("");
  // Ubah dari konstanta menjadi state agar bisa diubah
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // Sort config (pakai style BookingsTable)
  const [sortConfig, setSortConfig] = useState({
    key: "ContactID",
    direction: "asc",
  });

  // Filters
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSalutation, setSelectedSalutation] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZipCode, setSelectedZipCode] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch all contacts
  const fetchContacts = async () => {
    Swal.fire({
      title: "Memuat Data Kontak...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    setLoading(true);
    setError(null);

    try {
      const response = await ApiCustomer.get(`/api/contact-information`);
      setContacts(response.data.data || []);
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
  }, []);

  // Dropdown options
  const uniqueCompanies = useMemo(() => ["", ...new Set(contacts.map(c => c.Company).filter(Boolean).sort())], [contacts]);
  const uniqueSalutations = useMemo(() => ["", ...new Set(contacts.map(c => c.Salutation).filter(Boolean).sort())], [contacts]);
  const uniqueLanguages = useMemo(() => ["", ...new Set(contacts.map(c => c.PreferredLanguage).filter(Boolean).sort())], [contacts]);
  const uniqueCountries = useMemo(() => ["", ...new Set(contacts.map(c => c.Country).filter(Boolean).sort())], [contacts]);

  const uniqueStates = useMemo(() => {
    const states = contacts.filter(c =>
      !selectedCountry || c.Country === selectedCountry
    ).map(c => c.StateProvince).filter(Boolean);
    return ["", ...new Set(states.sort())];
  }, [contacts, selectedCountry]);

  const uniqueCities = useMemo(() => {
    const cities = contacts.filter(c =>
      (!selectedCountry || c.Country === selectedCountry) &&
      (!selectedState || c.StateProvince === selectedState)
    ).map(c => c.City).filter(Boolean);
    return ["", ...new Set(cities.sort())];
  }, [contacts, selectedCountry, selectedState]);

  const uniqueZipCodes = useMemo(() => {
    const zips = contacts.filter(c =>
      (!selectedCountry || c.Country === selectedCountry) &&
      (!selectedState || c.StateProvince === selectedState) &&
      (!selectedCity || c.City === selectedCity)
    ).map(c => c.ZipPostalCode).filter(Boolean);
    return ["", ...new Set(zips.sort())];
  }, [contacts, selectedCountry, selectedState, selectedCity]);

  // Filtering (search + dropdown)
  const filteredData = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = Object.values(contact).some((val) =>
        val?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

      return (
        matchesSearch &&
        (!selectedCompany || contact.Company === selectedCompany) &&
        (!selectedSalutation || contact.Salutation === selectedSalutation) &&
        (!selectedLanguage || contact.PreferredLanguage === selectedLanguage) &&
        (!selectedCountry || contact.Country === selectedCountry) &&
        (!selectedState || contact.StateProvince === selectedState) &&
        (!selectedCity || contact.City === selectedCity) &&
        (!selectedZipCode || contact.ZipPostalCode === selectedZipCode)
      );
    });
  }, [
    debouncedSearchTerm,
    contacts,
    selectedCompany,
    selectedSalutation,
    selectedLanguage,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedZipCode,
  ]);

  // Sorting (pakai sortConfig)
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";

        // cek apakah numeric
        if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
          aVal = Number(aVal);
          bVal = Number(bVal);
        } else {
          aVal = aVal.toString().toLowerCase();
          bVal = bVal.toString().toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedData, currentPage, itemsPerPage]); // Tambahkan itemsPerPage di dependency array

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Ubah fungsi getSortSymbol menjadi getSortIcon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  // Tambahkan handler untuk Go to Page
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Contact Management</h2>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between w-full">
        <input
          type="text"
          placeholder="🔍 Search contacts..."
          className="w-full sm:w-1/3 lg:w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
        {/* Dropdown filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 w-full">
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="p-2 border rounded-lg shadow-sm">
          <option value="">All Companies</option>
          {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedSalutation} onChange={(e) => setSelectedSalutation(e.target.value)} className="p-2 border rounded-lg shadow-sm">
          <option value="">All Salutations</option>
          {uniqueSalutations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="p-2 border rounded-lg shadow-sm">
          <option value="">All Languages</option>
          {uniqueLanguages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(""); setSelectedCity(""); setSelectedZipCode(""); }} className="p-2 border rounded-lg shadow-sm">
          <option value="">All Countries</option>
          {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); setSelectedZipCode(""); }} className="p-2 border rounded-lg shadow-sm" disabled={!selectedCountry}>
          <option value="">All States</option>
          {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedZipCode(""); }} className="p-2 border rounded-lg shadow-sm" disabled={!selectedState}>
          <option value="">All Cities</option>
          {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedZipCode} onChange={(e) => setSelectedZipCode(e.target.value)} className="p-2 border rounded-lg shadow-sm" disabled={!selectedCity}>
          <option value="">All Zip Codes</option>
          {uniqueZipCodes.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-scroll max-h-[70vh] w-full">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead className="sticky z-10 top-0 bg-gray-100 text-xs sm:text-sm">
            <tr>
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ContactID")}>
                Contact ID {getSortIcon("ContactID")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Company")}>
                Company {getSortIcon("Company")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Salutation")}>
                Salutation {getSortIcon("Salutation")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("FirstName")}>
                First Name {getSortIcon("FirstName")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("LastName")}>
                Last Name {getSortIcon("LastName")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Email")}>
                Email {getSortIcon("Email")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("PreferredLanguage")}>
                Preferred Language {getSortIcon("PreferredLanguage")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Phone")}>
                Phone {getSortIcon("Phone")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Mobile")}>
                Mobile {getSortIcon("Mobile")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("WorkPhone")}>
                Work Phone {getSortIcon("WorkPhone")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("WorkExtension")}>
                Work Extension {getSortIcon("WorkExtension")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("OtherPhone")}>
                Other Phone {getSortIcon("OtherPhone")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("OtherExtension")}>
                Other Extension {getSortIcon("OtherExtension")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Fax")}>
                Fax {getSortIcon("Fax")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("AddressLine1")}>
                Address Line 1 {getSortIcon("AddressLine1")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("AddressLine2")}>
                Address Line 2 {getSortIcon("AddressLine2")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("City")}>
                City {getSortIcon("City")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("StateProvince")}>
                State/Province {getSortIcon("StateProvince")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Country")}>
                Country {getSortIcon("Country")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ZipPostalCode")}>
                Zip/Postal Code {getSortIcon("ZipPostalCode")}
              </th>
              <th className="p-3 text-sm font-semibold text-center border">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {currentData.length > 0 ? (
              currentData.map((contact, index) => (
                <tr key={contact.ContactID} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-3 border">{contact.ContactID}</td>
                  <td className="p-3 border">{contact.Company}</td>
                  <td className="p-3 border">{contact.Salutation}</td>
                  <td className="p-3 border">{contact.FirstName}</td>
                  <td className="p-3 border">{contact.LastName}</td>
                  <td className="p-3 border">{contact.Email}</td>
                  <td className="p-3 border">{contact.PreferredLanguage}</td>
                  <td className="p-3 border">{contact.Phone}</td>
                  <td className="p-3 border">{contact.Mobile}</td>
                  <td className="p-3 border">{contact.WorkPhone}</td>
                  <td className="p-3 border">{contact.WorkExtension}</td>
                  <td className="p-3 border">{contact.OtherPhone}</td>
                  <td className="p-3 border">{contact.OtherExtension}</td>
                  <td className="p-3 border">{contact.Fax}</td>
                  <td className="p-3 border">{contact.AddressLine1}</td>
                  <td className="p-3 border">{contact.AddressLine2}</td>
                  <td className="p-3 border">{contact.City}</td>
                  <td className="p-3 border">{contact.StateProvince}</td>
                  <td className="p-3 border">{contact.Country}</td>
                  <td className="p-3 border">{contact.ZipPostalCode}</td>
                  <td className="flex items-center justify-center gap-2 p-3 border">
                    <ContactEdit contactID={contact.ContactID} onUpdate={fetchContacts} />
                    <ContactDelete contactID={contact.ContactID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="22" className="p-6 text-center text-gray-500">No data found 🚫</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:items-center sm:justify-between w-full">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600 text-center sm:text-left">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> contacts
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Company_table = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");

  // sort
  const [sortConfig, setSortConfig] = useState({ key: "Company", direction: "asc" });

  // filter
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZipCode, setSelectedZipCode] = useState("");

  const uniqueCountries = useMemo(() => {
    const countries = companies.map((c) => c.Country).filter(Boolean);
    return ["", ...new Set(countries.sort())];
  }, [companies]);

  const uniqueStates = useMemo(() => {
    const states = companies
      .filter((c) => !selectedCountry || c.Country === selectedCountry)
      .map((c) => c.StateProvince)
      .filter(Boolean);
    return ["", ...new Set(states.sort())];
  }, [companies, selectedCountry]);

  const uniqueCities = useMemo(() => {
    const cities = companies
      .filter((c) => (!selectedCountry || c.Country === selectedCountry) && (!selectedState || c.StateProvince === selectedState))
      .map((c) => c.City)
      .filter(Boolean);
    return ["", ...new Set(cities.sort())];
  }, [companies, selectedCountry, selectedState]);

  const uniqueZipCodes = useMemo(() => {
    const zipCodes = companies
      .filter((c) => (!selectedCountry || c.Country === selectedCountry) && (!selectedState || c.StateProvince === selectedState) && (!selectedCity || c.City === selectedCity))
      .map((c) => c.ZipPostalCode)
      .filter(Boolean);
    return ["", ...new Set(zipCodes.sort())];
  }, [companies, selectedCountry, selectedState, selectedCity]);

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // fetch
  const fetchCompanies = async () => {
    setError(null);
    setLoading(true);
    Swal.fire({
      title: "Memuat Data Company...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const res = await ApiCustomer.get(`/api/site_account`);
      setCompanies(res.data.data);
      Swal.close();
    } catch (err) {
      console.error("Error fetching company data:", err);
      setError("Failed to fetch data");
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data perusahaan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // filter + search
  const filteredData = companies.filter((c) => {
    const matchesSearch = Object.values(c).some((val) =>
      val?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    const matchesCountry = !selectedCountry || c.Country === selectedCountry;
    const matchesState = !selectedState || c.StateProvince === selectedState;
    const matchesCity = !selectedCity || c.City === selectedCity;
    const matchesZipCode = !selectedZipCode || c.ZipPostalCode === selectedZipCode;
    return matchesSearch && matchesCountry && matchesState && matchesCity && matchesZipCode;
  });

  // sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal == null) aVal = "";
        if (bVal == null) bVal = "";
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedZipCode("");
    setSortConfig({ key: "Company", direction: "asc" });
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Company Management</h2>

      {/* Kontainer Flexbox untuk pencarian dan tombol reset */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search companies..."
          className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      
      {/* Filters */}
      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState("");
            setSelectedCity("");
            setSelectedZipCode("");
            setCurrentPage(1);
          }}
        >
          <option value="">🌍 All Countries</option>
          {uniqueCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
            setSelectedZipCode("");
            setCurrentPage(1);
          }}
          disabled={!selectedCountry && companies.length > 0}
        >
          <option value="">🗺 All States</option>
          {uniqueStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedZipCode("");
            setCurrentPage(1);
          }}
          disabled={(!selectedCountry && companies.length > 0) || (!selectedState && companies.length > 0)}
        >
          <option value="">🏙 All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedZipCode}
          onChange={(e) => {
            setSelectedZipCode(e.target.value);
            setCurrentPage(1);
          }}
          disabled={(!selectedCountry && companies.length > 0) || (!selectedState && companies.length > 0) || (!selectedCity && companies.length > 0)}
        >
          <option value="">📪 All Zip Codes</option>
          {uniqueZipCodes.map((zip) => (
            <option key={zip} value={zip}>
              {zip}
            </option>
          ))}
        </select>
        {/* Reset Filter Button */}
        <div className="flex items-center">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Reset Filters
        </button>
        </div>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Table */}
      <div className=" bg-white rounded-2xl shadow overflow-scroll max-h-150">
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0 bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("Company")}>
                Company {getSortIcon("Company")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("Email")}>
                Email {getSortIcon("Email")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("PrimaryPhone")}>
                Primary Phone {getSortIcon("PrimaryPhone")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("WhatsappNo")}>
                Whatsapp {getSortIcon("WhatsappNo")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("AddressLine1")}>
                Address Line 1 {getSortIcon("AddressLine1")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("AddressLine2")}>
                Address Line 2 {getSortIcon("AddressLine2")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("Country")}>
                Country {getSortIcon("Country")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("StateProvince")}>
                State/Province {getSortIcon("StateProvince")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("City")}>
                City {getSortIcon("City")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer"
                  onClick={() => handleSort("ZipPostalCode")}>
                Zip/Postal Code {getSortIcon("ZipPostalCode")}
              </th>
              <th className="p-3 text-sm font-semibold text-center border">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {currentData.length > 0 ? (
              currentData.map((c, i) => (
                <tr key={c.SiteAccountID}
                    className={`hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="p-3 border">{c.Company}</td>
                  <td className="p-3 border">{c.Email}</td>
                  <td className="p-3 border">{c.PrimaryPhone}</td>
                  <td className="p-3 border">{c.WhatsappNo}</td>
                  <td className="p-3 border">{c.AddressLine1}</td>
                  <td className="p-3 border">{c.AddressLine2}</td>
                  <td className="p-3 border">{c.Country}</td>
                  <td className="p-3 border">{c.StateProvince}</td>
                  <td className="p-3 border">{c.City}</td>
                  <td className="p-3 border">{c.ZipPostalCode}</td>
                  <td className="flex items-center justify-center gap-2 p-3 border">
                    <CompanyEdit siteAccountId={c.SiteAccountID} onUpdate={fetchCompanies}/>
                    <CompanyDelete siteAccountId={c.SiteAccountID}
                                   isModalOpen={isModalOpen}
                                   setIsModalOpen={setIsModalOpen}
                                   onUpdate={fetchCompanies}/>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="p-6 text-center text-gray-500">No data found 🚫</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> companies
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Case_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // ⬅️ Tambahan fitur 1
  const [goToPageInput, setGoToPageInput] = useState(""); // ⬅️ Tambahan fitur 2
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [caseData, setCaseData] = useState([]);
  const [openClose, setOpenClose] = useState("Open");

  // 🔹 Filter states
  const [selectedHW, setSelectedHW] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [selectedCreatedName, setSelectedCreatedName] = useState("All");
  const [selectedOwner, setSelectedOwner] = useState("All");
  const [selectedWorkGroup, setSelectedWorkGroup] = useState("All");

  // 🔹 Sort state
  const [sortConfig, setSortConfig] = useState({
    key: "CaseID",
    direction: "asc",
  });

  // 🔹 Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔹 Fetch data
  const fetchCaseDataTable = async () => {
    const baseurl = `/api/case-information`;
    const url =
      openClose === "All"
        ? baseurl
        : `/api/case-information?CaseStatus=${openClose}`;

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
      const response = await ApiCustomer.get(url);
      if (response.data.success) {
        setCaseData(response.data.data);
      } else {
        setError("Failed to fetch case data");
      }
      Swal.close();
    } catch (err) {
      console.error("Error fetching case data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data perusahaan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchCaseDataTable();
  }, [openClose]);

  // 🔹 Unique dropdown values
  const uniqueHW = ["All", ...new Set(caseData.map((c) => c.HW))];
  const uniqueProduct = ["All", ...new Set(caseData.map((c) => c.ProductName))];
  const uniqueCreatedName = ["All", ...new Set(caseData.map((c) => c.CreatedName))];
  const uniqueOwner = ["All", ...new Set(caseData.map((c) => c.Owner))];
  const uniqueWorkGroup = ["All", ...new Set(caseData.map((c) => c.WorkGroup))];

  // 🔹 Filtering
  const filteredData = caseData
    .filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    )
    .filter((item) => (selectedHW === "All" ? true : item.HW === selectedHW))
    .filter((item) =>
      selectedProduct === "All" ? true : item.ProductName === selectedProduct
    )
    .filter((item) =>
      selectedCreatedName === "All" ? true : item.CreatedName === selectedCreatedName
    )
    .filter((item) => (selectedOwner === "All" ? true : item.Owner === selectedOwner))
    .filter((item) =>
      selectedWorkGroup === "All" ? true : item.WorkGroup === selectedWorkGroup
    );
  
    // 🔹 Parser khusus tanggal format "dd/MM/yyyy, HH.mm.ss"
  const parseCustomDate = (dateStr) => {
    if (!dateStr) return null;
    const [datePart, timePart] = dateStr.split(", ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(".").map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  // 🔹 Sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";

        // ✅ Khusus CreatedOn: parse manual
        if (sortConfig.key === "CreatedOn") {
          const dateA = parseCustomDate(aVal);
          const dateB = parseCustomDate(bVal);
          if (dateA && dateB) {
            return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
          }
        }

        // coba numeric dulu
        const numA = parseFloat(aVal);
        const numB = parseFloat(bVal);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        }

        // fallback string
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  // 🔹 Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // 🔹 Reset filters
  const resetFilters = () => {
    setSelectedHW("All");
    setSelectedProduct("All");
    setSelectedCreatedName("All");
    setSelectedOwner("All");
    setSelectedWorkGroup("All");
  };

  // 🔹 Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  // 🔹 Handle Go to Page
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };
const { user } = useAuth();

  return (
    <div className="flex flex-col gap-2 p-4">
      {user?.role === 'admin' ? 
      <ExportExcel caseData={caseData} />
      : null}
      <h2 className="mb-4 text-xl font-bold">ID Daily Aging Cases Javag FY</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-4">
        {/* HW */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Filter by HW</label>
          <select
            value={selectedHW}
            onChange={(e) => setSelectedHW(e.target.value)}
            className="p-2 border rounded"
          >
            {uniqueHW.map((hw) => (
              <option key={hw} value={hw}>
                {hw}
              </option>
            ))}
          </select>
        </div>
        {/* Product */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Filter by Product Name</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="p-2 border rounded"
          >
            {uniqueProduct.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>
        {/* Created Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Filter by Created Name</label>
          <select
            value={selectedCreatedName}
            onChange={(e) => setSelectedCreatedName(e.target.value)}
            className="p-2 border rounded"
          >
            {uniqueCreatedName.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {/* Owner */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Filter by Owner</label>
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="p-2 border rounded"
          >
            {uniqueOwner.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>
        {/* WorkGroup */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Filter by WorkGroup</label>
          <select
            value={selectedWorkGroup}
            onChange={(e) => setSelectedWorkGroup(e.target.value)}
            className="p-2 border rounded"
          >
            {uniqueWorkGroup.map((wg) => (
              <option key={wg} value={wg}>
                {wg}
              </option>
            ))}
          </select>
        </div>
        {/* Reset */}
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Toggle status */}
      <div className="flex items-center gap-3 mb-4">
        <Label htmlFor="status">Toggle Status Of Case :</Label>
        <Select defaultValue="All" value={openClose} onValueChange={setOpenClose}>
          <SelectTrigger id="status">
            <SelectValue>{openClose}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Open">Open Case Status</SelectItem>
              <SelectItem value="Close">Close Case Status</SelectItem>
              <SelectItem value="InActive">InActive Case Status</SelectItem>
              <SelectItem value="All">ALL Case Status</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Loading & Error */}
      {loading && <p>Loading cases...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CaseID")}>
                Case ID {getSortSymbol("CaseID")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CreatedOn")}>
                Created On {getSortSymbol("CreatedOn")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CaseSubject")}>
                Case Subject {getSortSymbol("CaseSubject")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CustomerAccount")}>
                Customer Account {getSortSymbol("CustomerAccount")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Primary")}>
                Primary {getSortSymbol("Primary")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("HW")}>
                HW {getSortSymbol("HW")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SerialNumber")}>
                Serial Number {getSortSymbol("SerialNumber")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductNumber")}>
                Product Number {getSortSymbol("ProductNumber")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductName")}>
                Product Name {getSortSymbol("ProductName")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CreatedName")}>
                Created Name {getSortSymbol("CreatedName")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Owner")}>
                Owner {getSortSymbol("Owner")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("WorkGroup")}>
                WorkGroup {getSortSymbol("WorkGroup")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CaseStatus")}>
                Case Status {getSortSymbol("CaseStatus")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((caseItem, index) => (
              <tr key={caseItem.CaseID} className="text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/app/case/${caseItem.CaseID}`)}
                >
                  {caseItem.CaseID}
                </td>
                <td className="p-2 border">{caseItem.CreatedOn}</td>
                <td className="p-2 border">{caseItem.CaseSubject}</td>
                <td className="p-2 border">{caseItem.CustomerAccount}</td>
                <td className="p-2 border">{caseItem.Primary}</td>
                <td className="p-2 border">{caseItem.HW}</td>
                <td className="p-2 border">{caseItem.SerialNumber}</td>
                <td className="p-2 border">{caseItem.ProductNumber}</td>
                <td className="p-2 border">{caseItem.ProductName}</td>
                <td className="p-2 border">{caseItem.CreatedName}</td>
                <td className="p-2 border">{caseItem.Owner}</td>
                <td className="p-2 border">{caseItem.WorkGroup}</td>
                <td
                  className={cn(
                    "bg-emerald-300",
                    caseItem.CaseStatus === "Close"
                      ? "bg-red-300"
                      : caseItem.CaseStatus === "InActive"
                        ? "bg-sky-300"
                        : ""
                  )}
                >
                  {caseItem.CaseStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No cases found.</p>
        )}
      </div>
      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> cases
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Assets_table = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [goToPageInput, setGoToPageInput] = useState("");

  // dropdown filters
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductNumber, setSelectedProductNumber] = useState("");
  const [selectedProductLine, setSelectedProductLine] = useState("");

  // sorting
  const [sortConfig, setSortConfig] = useState({ key: "AssetID", direction: "asc" });

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // fetch ALL assets
  const fetchAllAssets = async () => {
    Swal.fire({
      title: "Memuat Data Asset...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    setLoading(true);
    setError(null);

    try {
      const LIMIT = 1000;
      const first = await ApiCustomer.get(`/api/asset-information?page=1&limit=${LIMIT}`);
      const firstData = first?.data?.data || [];
      const totalPages = first?.data?.totalPages ?? 1;

      let all = [...firstData];
      for (let p = 2; p <= totalPages; p++) {
        const res = await ApiCustomer.get(`/api/asset-information?page=${p}&limit=${LIMIT}`);
        all = all.concat(res?.data?.data || []);
      }
      if (totalPages === 1 && Array.isArray(first?.data) && !first?.data?.data) {
        all = first.data;
      }

      console.log("All assets fetched:", all);
      setAssets(all);
      setFilteredAssets(all);
    } catch (err) {
      console.error("Error fetching asset data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchAllAssets();
  }, []);

  // unique filters
  const uniqueProductNames = useMemo(
    () => ["", ...new Set(assets.map(a => a?.product_information?.ProductName).filter(Boolean).sort())],
    [assets]
  );
  const uniqueProductNumbers = useMemo(
    () => ["", ...new Set(assets.map(a => a?.ProductNumber).filter(Boolean).sort())],
    [assets]
  );
  const uniqueProductLines = useMemo(
    () => ["", ...new Set(assets.map(a => a?.product_information?.ProductLine).filter(Boolean).sort())],
    [assets]
  );

  // filtering (search + dropdowns)
  useEffect(() => {
    const q = debouncedSearchTerm.trim().toLowerCase();
    const next = assets.filter(a => {
      const pn = a?.product_information?.ProductName ?? "";
      const pl = a?.product_information?.ProductLine ?? "";
      const num = a?.ProductNumber ?? "";

      const fName   = !selectedProductName  || pn === selectedProductName;
      const fNumber = !selectedProductNumber|| num === selectedProductNumber;
      const fLine   = !selectedProductLine  || pl === selectedProductLine;
      if (!(fName && fNumber && fLine)) return false;

      if (!q) return true;
      const haystack = [a?.AssetID, a?.SerialNumber, a?.SiteAccountID, a?.ContactID,       a?.product_information?.ProductName,
      a?.product_information?.ProductLine,
      a?.ProductNumber,
      a?.site_account?.Company, `${a?.contact_information?.FirstName ?? ""} ${a?.contact_information?.LastName ?? ""}` ,pn, pl, num]
        .map(v => (v ?? "").toString().toLowerCase()).join(" ");
      return haystack.includes(q);
    });
    setFilteredAssets(next);
    setCurrentPage(1);
  }, [debouncedSearchTerm, assets, selectedProductName, selectedProductNumber, selectedProductLine]);

  // sorting function
  const sortedAssets = useMemo(() => {
    if (!sortConfig.key) return filteredAssets;
    return [...filteredAssets].sort((a, b) => {
      let valA, valB;
      switch (sortConfig.key) {
        case "ProductName":
          valA = a?.product_information?.ProductName ?? "";
          valB = b?.product_information?.ProductName ?? "";
          break;
        case "ProductLine":
          valA = a?.product_information?.ProductLine ?? "";
          valB = b?.product_information?.ProductLine ?? "";
          break;
        default:
          valA = a?.[sortConfig.key] ?? "";
          valB = b?.[sortConfig.key] ?? "";
      }

      const numA = Number(valA);
      const numB = Number(valB);
      const bothNumeric = !isNaN(numA) && !isNaN(numB);

      if (bothNumeric) {
        if (numA < numB) return sortConfig.direction === "asc" ? -1 : 1;
        if (numA > numB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }

      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredAssets, sortConfig]);

  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAssets.slice(start, start + itemsPerPage);
  }, [sortedAssets, currentPage, itemsPerPage]);

  // handle sort
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    if (sortConfig.direction === "asc") return <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />;
    return <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />;
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  const resetFilters = () => {
    setSelectedProductName("");
    setSelectedProductNumber("");
    setSelectedProductLine("");
    setSearchTerm("");
    setCurrentPage(1);
    setSortConfig({ key: "AssetID", direction: "asc" });
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📦 Asset Information</h2>

      {/* Search + Reset */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search asset..."
          className="p-2 border border-gray-300 rounded min-w-[300px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select className="p-2 border rounded" value={selectedProductName} onChange={(e) => setSelectedProductName(e.target.value)}>
          <option value="">Filter by Product Name</option>
          {uniqueProductNames.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded" value={selectedProductNumber} onChange={(e) => setSelectedProductNumber(e.target.value)}>
          <option value="">Filter by Product Number</option>
          {uniqueProductNumbers.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded" value={selectedProductLine} onChange={(e) => setSelectedProductLine(e.target.value)}>
          <option value="">Filter by Product Line</option>
          {uniqueProductLines.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
          <button
          onClick={resetFilters}
          className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >Reset Filter</button>
      </div>

      {error && <p className="mb-2 text-red-500">{error}</p>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-scroll max-h-150">
        <table className="w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th className="p-2 border">No</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("AssetID")}>
                Asset ID {renderSortIcon("AssetID")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SerialNumber")}>
                Serial Number {renderSortIcon("SerialNumber")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductName")}>
                Product Name {renderSortIcon("ProductName")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductNumber")}>
                Product Number {renderSortIcon("ProductNumber")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductLine")}>
                Product Line {renderSortIcon("ProductLine")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SiteAccountID")}>
                Site Account ID {renderSortIcon("SiteAccountID")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ContactID")}>
                Contact ID {renderSortIcon("ContactID")}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="p-4 text-center">Loading...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((a, idx) => (
                <tr key={a.AssetID} className="hover:bg-gray-50">
                  <td className="p-2 text-center border">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="p-2 border">{a.AssetID}</td>
                  <td className="p-2 border">{a.SerialNumber}</td>
                  <td className="p-2 border">{a?.product_information?.ProductName}</td>
                  <td className="p-2 border">{a?.ProductNumber}</td>
                  <td className="p-2 border">{a?.product_information?.ProductLine}</td>
                  <td className="p-2 border">{a?.site_account?.Company}</td>
                  <td className="p-2 border">{a?.contact_information?.FirstName} {a?.contact_information?.LastName}</td>
                  <td className="flex p-2 gap-2 border">
                    <AssetEdit assetId={a.AssetID} onUpdate={fetchAllAssets} />
                    <AssetDelete assetId={a.AssetID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="p-4 text-center text-gray-500">No data found 🚫</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedAssets.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedAssets.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> – {" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedAssets.length)}</b> of {" "}
          <b>{sortedAssets.length}</b> assets
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >⬅ Prev</button>

            <span className="px-3 py-1 text-sm">Page <b>{currentPage}</b> of {totalPages}</span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >Next ➡</button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >Go</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Product_table = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // search + pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState("");

  // filters
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTower, setSelectedTower] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // sorting → default ProductNumber ASC
  const [sortConfig, setSortConfig] = useState({ key: "ProductNumber", direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc"
      ? <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
      : <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />;
  };

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // fetch ALL products once
  const fetchAllProducts = async () => {
    Swal.fire({
      title: "Memuat Data Produk...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    setLoading(true);
    setError(null);

    try {
      const LIMIT = 1000;
      const first = await ApiCustomer.get(`/api/product-information?page=1&limit=${LIMIT}`);
      const firstData = first?.data?.data ?? [];
      const totalPagesFromApi = first?.data?.totalPages ?? 1;

      let all = [...firstData];
      for (let p = 2; p <= totalPagesFromApi; p++) {
        const res = await ApiCustomer.get(`/api/product-information?page=${p}&limit=${LIMIT}`);
        all = all.concat(res?.data?.data ?? []);
      }

      if (totalPagesFromApi === 1 && Array.isArray(first?.data) && !first?.data?.data) {
        all = first.data;
      }

      setProducts(all);
      setFilteredProducts(all);
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // unique filters
  const uniqueLines = useMemo(() => ["", ...new Set(products.map(p => p?.ProductLine).filter(Boolean)).values()].sort(), [products]);
  const uniqueTypes = useMemo(() => ["", ...new Set(products.map(p => p?.product_type?.ProductType).filter(Boolean)).values()].sort(), [products]);
  const uniqueGroups = useMemo(() => ["", ...new Set(products.map(p => p?.product_type?.ProductGroup).filter(Boolean)).values()].sort(), [products]);
  const uniqueTowers = useMemo(() => ["", ...new Set(products.map(p => p?.product_type?.ProductTower).filter(Boolean)).values()].sort(), [products]);

  // apply filters + search
  useEffect(() => {
    const q = debouncedSearchTerm.trim().toLowerCase();

    const next = products.filter(p => {
      const line = p?.ProductLine ?? "";
      const name = p?.ProductName ?? "";
      const number = p?.ProductNumber ?? "";
      const type = p?.product_type?.ProductType ?? "";
      const group = p?.product_type?.ProductGroup ?? "";
      const tower = p?.product_type?.ProductTower ?? "";

      const fLine  = !selectedLine  || line === selectedLine;
      const fType  = !selectedType  || type === selectedType;
      const fGroup = !selectedGroup || group === selectedGroup;
      const fTower = !selectedTower || tower === selectedTower;
      if (!(fLine && fType && fGroup && fTower)) return false;

      if (!q) return true;
      const haystack = [number, name, line, type, group, tower].join(" ").toLowerCase();
      return haystack.includes(q);
    });

    setFilteredProducts(next);
    setCurrentPage(1);
  }, [products, debouncedSearchTerm, selectedLine, selectedType, selectedGroup, selectedTower]);

  // sorting applied here
  const sortedProducts = useMemo(() => {
    let sortable = [...filteredProducts];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a?.[sortConfig.key] ?? a?.product_type?.[sortConfig.key] ?? "";
        const bVal = b?.[sortConfig.key] ?? b?.product_type?.[sortConfig.key] ?? "";

        if (!isNaN(aVal) && !isNaN(bVal)) {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return sortable;
  }, [filteredProducts, sortConfig]);

  // pagination
  const totalPagesLocal = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSelectedLine("");
    setSelectedType("");
    setSelectedGroup("");
    setSelectedTower("");
    setSearchTerm("");
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPagesLocal) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Product Management</h2>

      {/*search + reset */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
          type="text"
          placeholder="🔍 Search products..."
          className=" p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ProductAdd onAdded={fetchAllProducts} />
      </div>
      {/* Filters */}
      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
       <select className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" value={selectedLine} onChange={(e) => {setSelectedLine(e.target.value); setCurrentPage(1)}}>
          <option value="">All Product Line</option>
          {uniqueLines.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" value={selectedType} onChange={(e) => {setSelectedType(e.target.value); setCurrentPage(1)}}>
          <option value="">All Product Type</option>
          {uniqueTypes.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" value={selectedGroup} onChange={(e) => {setSelectedGroup(e.target.value); setCurrentPage(1)}}>
          <option value="">All Product Group</option>
          {uniqueGroups.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400" value={selectedTower} onChange={(e) => {setSelectedTower(e.target.value); setCurrentPage(1)}}>
          <option value="">All Product Tower</option>
          {uniqueTowers.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <button onClick={resetFilters} className="px-3 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500">Reset Filter</button>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}
      

      {/* Table */}
      <div className=" bg-white rounded-2xl shadow overflow-scroll max-h-150 mt-4">
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0 bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ProductNumber")}>
                Product Number {getSortIcon("ProductNumber")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ProductLine")}>
                Product Line {getSortIcon("ProductLine")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ProductName")}>
                Product Name {getSortIcon("ProductName")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ProductType")}>
                Product Type {getSortIcon("ProductType")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ProductGroup")}>
                Product Group {getSortIcon("ProductGroup")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("ProductTower")}>
                Product Tower {getSortIcon("ProductTower")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border">Vendor</th>
              <th className="p-3 text-sm font-semibold text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((p, idx) => (
                <tr key={p.ProductNumber} className={`hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="p-3 border">{p.ProductNumber}</td>
                  <td className="p-3 border">{p.ProductLine}</td>
                  <td className="p-3 border">{p.ProductName}</td>
                  <td className="p-3 border">{p.product_type?.ProductType}</td>
                  <td className="p-3 border">{p.product_type?.ProductGroup}</td>
                  <td className="p-3 border">{p.product_type?.ProductTower}</td>
                  <td className="p-3 border">-</td>
                  <td className="flex items-center justify-center gap-2 p-3 border">
                    <ProductEdit ProductNumber={p.ProductNumber} onUpdate={fetchAllProducts} />
                    <ProductDelete ProductNumber={p.ProductNumber} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onUpdate={fetchAllProducts}/>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="p-6 text-center text-gray-500">No data found 🚫</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedProducts.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedProducts.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedProducts.length)}</b> of{" "}
          <b>{sortedProducts.length}</b> products
        </div>

        {/* Pagination + Go to page */}
        {totalPagesLocal > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPagesLocal}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPagesLocal))}
              disabled={currentPage === totalPagesLocal}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPagesLocal}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductType_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // ✅ MODIFIED: Dari const ke state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ProductTypeData, setProductTypeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState(""); // ✅ ADDED: State untuk input "Go to page"

  // ✅ Default sort langsung ke ProductTypeID asc
  const [sortConfig, setSortConfig] = useState({
    key: "ProductTypeID",
    direction: "asc",
  });

  const fetchProductTypeDataTable = async () => {
    setLoading(true);
    setError(null);
    Swal.fire({
      title: "Memuat Data Tipe Produk...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await ApiCustomer.get("/api/product-type");
      if (response.data.success) {
        setProductTypeData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch ProductType data");
        Swal.fire("Error!", "Gagal mengambil data tipe produk.", "error");
      }
    } catch (err) {
      console.error("Error fetching ProductType data:", err);
      setError("Error fetching data");
      Swal.fire("Error!", "Gagal mengambil data tipe produk.", "error");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchProductTypeDataTable();
  }, []);

  const filteredProductTypeTable = ProductTypeData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredProductTypeTable].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;
    let aValue = a[key];
    let bValue = b[key];
    if (!isNaN(aValue) && !isNaN(bValue)) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else {
      aValue = aValue?.toString().toLowerCase();
      bValue = bValue?.toString().toLowerCase();
    }
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  // ✅ ADDED: Handler untuk "Go to page"
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setGoToPageInput("");
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Product Type Table</h2>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Kembali ke halaman 1 saat search
          }}
        />
        <ProductTypeAdd onUpdate={fetchProductTypeDataTable} />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ MODIFIED: Table wrapper for scrolling */}
      <div className="bg-white rounded-lg shadow overflow-scroll max-h-[60vh]">
        <table className="w-full border-collapse">
          {/* ✅ MODIFIED: Sticky header */}
          <thead className="sticky top-0 z-10">
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-3 font-semibold text-center border">No</th> {/* ✅ ADDED: Kolom Nomor */}
              <th
                className="p-3 font-semibold text-left border cursor-pointer"
                onClick={() => requestSort("ProductTypeID")}
              >
                ProductType ID {renderSortArrow("ProductTypeID")}
              </th>
              <th
                className="p-3 font-semibold text-left border cursor-pointer"
                onClick={() => requestSort("ProductTower")}
              >
                Product Tower {renderSortArrow("ProductTower")}
              </th>
              <th
                className="p-3 font-semibold text-left border cursor-pointer"
                onClick={() => requestSort("ProductGroup")}
              >
                Product Group {renderSortArrow("ProductGroup")}
              </th>
              <th
                className="p-3 font-semibold text-left border cursor-pointer"
                onClick={() => requestSort("ProductType")}
              >
                Product Type {renderSortArrow("ProductType")}
              </th>
              <th className="p-3 font-semibold text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.ProductTypeID}
                  className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td
                    className="p-3 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/case/${item.ProductTypeID}`)}
                  >
                    {item.ProductTypeID}
                  </td>
                  <td className="p-3 border">{item.ProductTower}</td>
                  <td className="p-3 border">{item.ProductGroup}</td>
                  <td className="p-3 border">{item.ProductType}</td>
                  <td className="flex items-center justify-center gap-2 p-3 border">
                    <ProductTypeEdit
                      ProductTypeID={item.ProductTypeID}
                      onUpdate={fetchProductTypeDataTable}
                    />
                    <ProductTypeDelete
                      ProductTypeID={item.ProductTypeID}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchProductTypeDataTable}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ MODIFIED: Pagination controls yang lebih lengkap */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> entries
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>
            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const WarrantyService_table = () => {
  // === State Management ===
  const [WarrantyServiceData, setWarrantyServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [goToPageInput, setGoToPageInput] = useState("");

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "Service_offerID",
    direction: "asc",
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === Data Fetching ===
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
      } else {
        setError("Failed to fetch Warranty Service data");
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
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Warranty Service.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchWarrantyServiceDataTable();
  }, []);

  // === Filtering & Sorting Logic ===
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortedData = useMemo(() => {
    const filteredData = WarrantyServiceData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (!isNaN(valA) && !isNaN(valB)) {
          return sortConfig.direction === "asc"
            ? Number(valA) - Number(valB)
            : Number(valB) - Number(valA);
        }
        return sortConfig.direction === "asc"
          ? valA?.toString().localeCompare(valB?.toString())
          : valB?.toString().localeCompare(valA?.toString());
      });
    }
    return sorted;
  }, [WarrantyServiceData, searchTerm, sortConfig]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  // === Pagination Logic ===
  const totalPages = Math.ceil(getSortedData.length / itemsPerPage) || 1;
  const currentData = getSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  // === Render Section ===
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Warranty Service Table</h2>

      {/* Search and Add Button */}
      <div className="flex flex-warp items-center gap-2 mb-4"> {/* Mengubah mb-6 di sini */}
        <input
          type="text"
          placeholder="🔍 Search..."
          className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400" // Menggunakan flex-grow agar input mengambil sisa ruang
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <WarrantyServiceAdd /> {/* Tombol Add di samping input search */}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded-2xl shadow overflow-scroll max-h-[300px]">
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0 bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("Service_offerID")}
              >
                Service offerID {renderSortIcon("Service_offerID")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("Service_description")}
              >
                Service description {renderSortIcon("Service_description")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("CTat_RTime")}
              >
                Customer Tat {renderSortIcon("CTat_RTime")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("Price")}
              >
                Price {renderSortIcon("Price")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("Shipping_Fee")}
              >
                Shipping Fee {renderSortIcon("Shipping_Fee")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("qty_ws")}
              >
                Quantity {renderSortIcon("qty_ws")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("Tax")}
              >
                Tax {renderSortIcon("Tax")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-left border cursor-pointer"
                onClick={() => handleSort("Total")}
              >
                Total {renderSortIcon("Total")}
              </th>
              <th className="p-3 text-sm font-semibold text-center border">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((WarrantyServiceItem, i) => (
                <tr
                  key={WarrantyServiceItem.Service_offerID}
                  className={`hover:bg-blue-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-3 border text-blue-500 cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/app/case/${WarrantyServiceItem.Service_offerID}`)
                    }
                  >
                    {WarrantyServiceItem.Service_offerID}
                  </td>
                  <td className="p-3 border">
                    {WarrantyServiceItem.Service_description}
                  </td>
                  <td className="p-3 border">{WarrantyServiceItem.CTat_RTime}</td>
                  <td className="p-3 border">{WarrantyServiceItem.Price}</td>
                  <td className="p-3 border">{WarrantyServiceItem.Shipping_Fee}</td>
                  <td className="p-3 border">{WarrantyServiceItem.qty_ws}</td>
                  <td className="p-3 border">{WarrantyServiceItem.Tax}</td>
                  <td className="p-3 border">{WarrantyServiceItem.Total}</td>
                  <td className="flex p-3 space-x-2 border justify-center">
                    <WarrantyServiceEdit
                      Service_offerID={WarrantyServiceItem.Service_offerID}
                      onUpdate={fetchWarrantyServiceDataTable}
                    />
                    <WarrantyServiceDelete
                      Service_offerID={WarrantyServiceItem.Service_offerID}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchWarrantyServiceDataTable}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === getSortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(getSortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing{" "}
          <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, getSortedData.length)}</b>{" "}
          of <b>{getSortedData.length}</b> services
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Mo_table = () => {
  const [MaterialOrderData, setMaterialOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [goToPageInput, setGoToPageInput] = useState("");

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "MOID",
    direction: "asc",
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === Data Fetching ===
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
      } else {
        setError("Failed to fetch Material Order data");
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
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Material Order.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchMaterialOrderDataTable();
  }, []);

  // === Filtering & Sorting Logic ===
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={16} />;
    if (sortConfig.direction === "asc") return <ArrowUp size={16} />;
    return <ArrowDown size={16} />;
  };

  const getSortedData = useMemo(() => {
    const filteredData = MaterialOrderData.filter((item) => {
      const matchesSearch = Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = selectedStatus ? item.OrderStatus === selectedStatus : true;
      const matchesType = selectedType ? item.OrderType === selectedType : true;
      return matchesSearch && matchesStatus && matchesType;
    });

    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (!isNaN(valA) && !isNaN(valB)) {
          return sortConfig.direction === "asc"
            ? Number(valA) - Number(valB)
            : Number(valB) - Number(valA);
        }
        return sortConfig.direction === "asc"
          ? valA?.toString().localeCompare(valB?.toString())
          : valB?.toString().localeCompare(valA?.toString());
      });
    }
    return sorted;
  }, [MaterialOrderData, searchTerm, selectedStatus, selectedType, sortConfig]);

  // Dropdown values
  const uniqueStatuses = useMemo(() => [
    ...new Set(MaterialOrderData.map((item) => item.OrderStatus)),
  ].filter(Boolean).sort(), [MaterialOrderData]);
  
  const uniqueTypes = useMemo(() => [
    ...new Set(MaterialOrderData.map((item) => item.OrderType)),
  ].filter(Boolean).sort(), [MaterialOrderData]);

  // === Pagination Logic ===
  const totalPages = Math.ceil(getSortedData.length / itemsPerPage) || 1;
  const currentData = getSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedType("");
    setCurrentPage(1);
  };

  // === Render Section ===
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Material Order Table</h2>

      {/* Filters */}
      <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Order Status</option>
          {uniqueStatuses.map((status, idx) => (
            <option key={idx} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Order Types</option>
          {uniqueTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-sm hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Table with Sticky Header and Scroll */}
      <div className="bg-white rounded-2xl shadow overflow-scroll max-h-[400px]">
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0 bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("MOID")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>MO ID</span> {renderSortIcon("MOID")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("WOID")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>WO ID</span> {renderSortIcon("WOID")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("OrderNumber")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Order Number</span> {renderSortIcon("OrderNumber")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("OrderStatus")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Order Status</span> {renderSortIcon("OrderStatus")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("OrderType")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Order Type</span> {renderSortIcon("OrderType")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("CreatedOn")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Created On</span> {renderSortIcon("CreatedOn")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("SalesOrderNumber")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Sales Order Number</span> {renderSortIcon("SalesOrderNumber")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("RMANumber")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>RMA Number</span> {renderSortIcon("RMANumber")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("ReadyForClosureDate")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Ready For Closure Date</span> {renderSortIcon("ReadyForClosureDate")}
                </div>
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("Owner")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Owner</span> {renderSortIcon("Owner")}
                </div>
              </th>
              <th className="p-3 text-sm font-semibold text-center border">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((MaterialOrderItem, i) => (
                <tr
                  key={MaterialOrderItem.MOID}
                  className={`text-center hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-3 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/app/material-order/${MaterialOrderItem.MOID}`)
                    }
                  >
                    {MaterialOrderItem.MOID}
                  </td>
                  <td
                    className="p-3 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/app/work/${MaterialOrderItem.WOID}`)
                    }
                  >
                    {MaterialOrderItem.WOID}
                  </td>
                  <td className="p-3 border">{MaterialOrderItem.OrderNumber}</td>
                  <td className="p-3 border">{MaterialOrderItem.OrderStatus}</td>
                  <td className="p-3 border">{MaterialOrderItem.OrderType}</td>
                  <td className="p-3 border">{MaterialOrderItem.CreatedOn}</td>
                  <td className="p-3 border">
                    {MaterialOrderItem.SalesOrderNumber}
                  </td>
                  <td className="p-3 border">{MaterialOrderItem.RMANumber}</td>
                  <td className="p-3 border">
                    {MaterialOrderItem.ReadyForClosureDate}
                  </td>
                  <td className="p-3 border">{MaterialOrderItem.Owner}</td>
                  <td className="flex items-center justify-center p-3 space-x-2 border">
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
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === getSortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(getSortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing{" "}
          <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, getSortedData.length)}</b>{" "}
          of <b>{getSortedData.length}</b> orders
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>
            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Wo_table = () => {
  const [WorkOrderData, setWorkOrderData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");

  // 🔹 filter states
  const [filterWorkOrderType, setFilterWorkOrderType] = useState("");
  const [filterSystemStatus, setFilterSystemStatus] = useState("");
  const [filterShipmentCountry, setFilterShipmentCountry] = useState("");
  const [filterShipmentState, setFilterShipmentState] = useState("");
  const [filterOwner, setFilterOwner] = useState("");

  // 🔹 sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "WOID",
    direction: "asc",
  });

  const navigate = useNavigate();

  // Ambil unique values untuk dropdown filter, menggunakan useMemo untuk performa
  const uniqueWorkOrderType = useMemo(
    () => [
      "",
      ...new Set(WorkOrderData.map((d) => d.WorkOrderType).filter(Boolean)),
    ],
    [WorkOrderData]
  );
  const uniqueSystemStatus = useMemo(
    () => [
      "",
      ...new Set(WorkOrderData.map((d) => d.SystemStatus).filter(Boolean)),
    ],
    [WorkOrderData]
  );
  const uniqueShipmentCountry = useMemo(
    () => [
      "",
      ...new Set(WorkOrderData.map((d) => d.ShipmentCountry).filter(Boolean)),
    ],
    [WorkOrderData]
  );
  const uniqueShipmentState = useMemo(
    () => [
      "",
      ...new Set(WorkOrderData.map((d) => d.ShipmentState).filter(Boolean)),
    ],
    [WorkOrderData]
  );
  const uniqueOwner = useMemo(
    () => [
      "",
      ...new Set(WorkOrderData.map((d) => d.Owner).filter(Boolean)),
    ],
    [WorkOrderData]
  );

  // 🔹 Debounce untuk search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
      Swal.close();
    }
  };

  useEffect(() => {
    fetchWorkOrderDataTable();
  }, []);

  // 🔹 Filter & Search logic, menggunakan useMemo
  const filteredWorkOrderTable = useMemo(() => {
    return WorkOrderData.filter((item) => {
      const matchSearch = Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      const matchWorkOrderType = filterWorkOrderType ? item.WorkOrderType === filterWorkOrderType : true;
      const matchSystemStatus = filterSystemStatus ? item.SystemStatus === filterSystemStatus : true;
      const matchShipmentCountry = filterShipmentCountry ? item.ShipmentCountry === filterShipmentCountry : true;
      const matchShipmentState = filterShipmentState ? item.ShipmentState === filterShipmentState : true;
      const matchOwner = filterOwner ? item.Owner === filterOwner : true;

      return (
        matchSearch &&
        matchWorkOrderType &&
        matchSystemStatus &&
        matchShipmentCountry &&
        matchShipmentState &&
        matchOwner
      );
    });
  }, [
    WorkOrderData,
    debouncedSearchTerm,
    filterWorkOrderType,
    filterSystemStatus,
    filterShipmentCountry,
    filterShipmentState,
    filterOwner,
  ]);

  // 🔹 Sorting logic, menggunakan useMemo
  const sortedData = useMemo(() => {
    const sorted = [...filteredWorkOrderTable];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        if (String(aVal) < String(bVal)) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (String(aVal) > String(bVal)) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [filteredWorkOrderTable, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Work Order Table</h2>

      {/* 🔹 Search & Filters */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="p-2 border rounded-lg shadow-sm w-full md:w-1/3 focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <select
            className="p-2 border rounded-lg shadow-sm"
            value={filterWorkOrderType}
            onChange={(e) => {
              setFilterWorkOrderType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Work Order Types</option>
            {uniqueWorkOrderType.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-lg shadow-sm"
            value={filterSystemStatus}
            onChange={(e) => {
              setFilterSystemStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All System Status</option>
            {uniqueSystemStatus.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-lg shadow-sm"
            value={filterShipmentCountry}
            onChange={(e) => {
              setFilterShipmentCountry(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Shipment Countries</option>
            {uniqueShipmentCountry.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-lg shadow-sm"
            value={filterShipmentState}
            onChange={(e) => {
              setFilterShipmentState(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Shipment States</option>
            {uniqueShipmentState.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-lg shadow-sm"
            value={filterOwner}
            onChange={(e) => {
              setFilterOwner(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Owners</option>
            {uniqueOwner.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* 🔹 Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("WOID")}
              >
                WOID {getSortIcon("WOID")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("CaseID")}
              >
                Case ID {getSortIcon("CaseID")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("WorkOrderType")}
              >
                Work Order Type {getSortIcon("WorkOrderType")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Priority")}
              >
                Priority {getSortIcon("Priority")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SystemStatus")}
              >
                System Status {getSortIcon("SystemStatus")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SubStatus")}
              >
                Sub Status {getSortIcon("SubStatus")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("PreferredDay")}
              >
                Preferred Day {getSortIcon("PreferredDay")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("PreferredTime")}
              >
                Preferred Time {getSortIcon("PreferredTime")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("ShipmentCountry")}
              >
                Shipment Country {getSortIcon("ShipmentCountry")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("ShipmentState")}
              >
                Shipment State {getSortIcon("ShipmentState")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("CreatedOn")}
              >
                Created On {getSortIcon("CreatedOn")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Owner")}
              >
                Owner {getSortIcon("Owner")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SLAJeopardy")}
              >
                SLAJeopardy {getSortIcon("SLAJeopardy")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("DueDateCustomer")}
              >
                DueDate Customer {getSortIcon("DueDateCustomer")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("CoverageWindow")}
              >
                Coverage Window {getSortIcon("CoverageWindow")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Response")}
              >
                Response {getSortIcon("Response")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("OTCCode")}
              >
                OTCCode {getSortIcon("OTCCode")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("RequestedDateTimeCustomer")}
              >
                Requested DateTime Customer {getSortIcon("RequestedDateTimeCustomer")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("GuaranteedFixTimeCustomer")}
              >
                Guaranteed FixTime Customer {getSortIcon("GuaranteedFixTimeCustomer")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("EarlyStartDateTimeCustomer")}
              >
                Early Start DateTime Customer {getSortIcon("EarlyStartDateTimeCustomer")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("LatestStartDateTimeCustomer")}
              >
                Latest Start DateTime Customer {getSortIcon("LatestStartDateTimeCustomer")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SLAReschedule")}
              >
                SLAReschedule {getSortIcon("SLAReschedule")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("ActiveScheduleDate")}
              >
                Active Schedule Date {getSortIcon("ActiveScheduleDate")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SLAErrorDescription")}
              >
                SLA Error Description {getSortIcon("SLAErrorDescription")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("CasePriorityIndex")}
              >
                Case Priority Index {getSortIcon("CasePriorityIndex")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("PartnerStatus")}
              >
                Partner Status {getSortIcon("PartnerStatus")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("WorkOrderDescription")}
              >
                WorkOrder Description {getSortIcon("WorkOrderDescription")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("PartnerNotes")}
              >
                PartnerNotes {getSortIcon("PartnerNotes")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("IncomingChannel")}
              >
                Incoming Channel {getSortIcon("IncomingChannel")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("MaterialOrder")}
              >
                Material Order {getSortIcon("MaterialOrder")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("CaseInformation")}
              >
                Case Information {getSortIcon("CaseInformation")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((WorkOrderItem, i) => (
                <tr
                  key={WorkOrderItem.WOID}
                  className={`text-center hover:bg-gray-100 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-2 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/work/${WorkOrderItem.WOID}`)}
                  >
                    {WorkOrderItem.WOID}
                  </td>
                  <td
                    className="p-2 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/case/${WorkOrderItem.CaseID}`)}
                  >
                    {WorkOrderItem.CaseID}
                  </td>
                  <td className="p-2 border">{WorkOrderItem.WorkOrderType}</td>
                  <td className="p-2 border">{WorkOrderItem.Priority}</td>
                  <td className="p-2 border">{WorkOrderItem.SystemStatus}</td>
                  <td className="p-2 border">{WorkOrderItem.SubStatus}</td>
                  <td className="p-2 border">{WorkOrderItem.PreferredDay}</td>
                  <td className="p-2 border">{WorkOrderItem.PreferredTime}</td>
                  <td className="p-2 border">{WorkOrderItem.ShipmentCountry}</td>
                  <td className="p-2 border">{WorkOrderItem.ShipmentState}</td>
                  <td className="p-2 border">{WorkOrderItem.CreatedOn}</td>
                  <td className="p-2 border">{WorkOrderItem.Owner}</td>
                  <td className="p-2 border">{WorkOrderItem.SLAJeopardy}</td>
                  <td className="p-2 border">{WorkOrderItem.DueDateCustomer}</td>
                  <td className="p-2 border">{WorkOrderItem.CoverageWindow}</td>
                  <td className="p-2 border">{WorkOrderItem.Response}</td>
                  <td className="p-2 border">{WorkOrderItem.OTCCode}</td>
                  <td className="p-2 border">{WorkOrderItem.RequestedDateTimeCustomer}</td>
                  <td className="p-2 border">{WorkOrderItem.GuaranteedFixTimeCustomer}</td>
                  <td className="p-2 border">{WorkOrderItem.EarlyStartDateTimeCustomer}</td>
                  <td className="p-2 border">{WorkOrderItem.LatestStartDateTimeCustomer}</td>
                  <td className="p-2 border">{WorkOrderItem.SLAReschedule}</td>
                  <td className="p-2 border">{WorkOrderItem.ActiveScheduleDate}</td>
                  <td className="p-2 border">{WorkOrderItem.SLAErrorDescription}</td>
                  <td className="p-2 border">{WorkOrderItem.CasePriorityIndex}</td>
                  <td className="p-2 border">{WorkOrderItem.PartnerStatus}</td>
                  <td className="p-2 border">{WorkOrderItem.WorkOrderDescription}</td>
                  <td className="p-2 border">{WorkOrderItem.PartnerNotes}</td>
                  <td className="p-2 border">{WorkOrderItem.IncomingChannel}</td>
                  <td className="p-2 border">{WorkOrderItem.MaterialOrder}</td>
                  <td className="p-2 border">{WorkOrderItem.CaseInformation}</td>
                  <td className="flex items-center justify-center gap-2 p-2 border">
                    <WorkOrderEdit WOID={WorkOrderItem.WOID} onUpdate={fetchWorkOrderDataTable} />
                    <WorkOrderDelete
                      MOID={WorkOrderItem.MOID}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchWorkOrderDataTable}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="32" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Bottom controls (Pagination) */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> work orders
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const User_table = () => {
  const [UserData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");


  // 🔹 sort state
  const [sortConfig, setSortConfig] = useState({
    key: "IDUser",
    direction: "asc",
  });

  const navigate = useNavigate();

  // 🔹 Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
        console.log(response.data.data)
        Swal.close();
      } else {
        setError("Failed to fetch User data");
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

  useEffect(() => {
    fetchUserDataTable();
  }, []);

  // 🔹 Filter data based on debounced search
  const filteredUserTable = useMemo(() => {
    return UserData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [UserData, debouncedSearchTerm]);

  // 🔹 Sorting logic
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredUserTable];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle null or undefined values
        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";
        
        // Case-insensitive sorting for strings
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredUserTable, sortConfig]);

  // 🔹 Calculate total pages
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  // 🔹 Get current page data
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // 🔹 Sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };
  
  // 🔹 Go to page handler
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 User Table</h2>

      {/* Flexbox container for search input and Add button */}
      <div className="flex flex-warp items-center gap-2 mb-4 ">
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search users..."
          className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Add User Button */}
        <UserAdd />
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("IDUser")}
              >
                ID User {getSortIcon("IDUser")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Email")}
              >
                Email {getSortIcon("Email")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Username")}
              >
                Username {getSortIcon("Username")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Name")}
              >
                Name {getSortIcon("Name")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Role")}
              >
                Role {getSortIcon("Role")}
              </th>
              {/* Tambahkan kolom Phone di sini */}
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Phone")}
              >
                Phone {getSortIcon("Phone")}
              </th>
              {/* Tambahkan kolom Signature di sini */}
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Signature")}
              >
                Signature {getSortIcon("Signature")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("ProfilePhoto")}
              >
                Profil Photo {getSortIcon("ProfilePhoto")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("CreatedAt")}
              >
                CreatedAt {getSortIcon("CreatedAt")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("UpdatedAt")}
              >
                UpdatedAt {getSortIcon("UpdatedAt")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((UserItem, i) => (
                <tr
                  key={UserItem.IDUser}
                  className={`text-center text-sm hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                    {UserItem.IDUser}
                  </td>
                  <td className="p-2 border">{UserItem.Email}</td>
                  <td className="p-2 border">{UserItem.Username}</td>
                  <td className="p-2 border">{UserItem.Name}</td>
                  <td className="p-2 border">{UserItem.Role}</td>
                  <td className="p-2 border">{UserItem.resource?.Name}</td>
                  {/* Tampilkan data Phone di sini */}
                  <td className="p-2 border">{UserItem.Phone}</td>
                  {/* Tampilkan data Signature di sini */}
                  <td className="p-2 border">{UserItem.Signature}</td>
                  <td className="p-2 border">
                    {/* {console.log(preview?.ProfilePhoto)} */}
                    {UserItem?.ProfilePhoto ? (
                      <img src={`${import.meta.env.VITE_API_BASE_URL}${UserItem.ProfilePhoto}`} alt="Profile" className="w-10 h-10 object-cover rounded-full mx-auto" />
                    ) : (
                      "No Photo"
                    )}
                  </td>
                  <td className="p-2 border">{UserItem.CreatedAt}</td>
                  <td className="p-2 border">{UserItem.UpdatedAt}</td>
                  <td className="flex items-center justify-center gap-2 p-2 border">
                    <UserEdit
                      IDUser={UserItem.IDUser}
                      onUpdate={fetchUserDataTable}
                    />
                    <UserDelete
                      IDUser={UserItem.IDUser}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchUserDataTable}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Bottom controls (Pagination) */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> users
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Part_table = () => {
  const [PartData, setPartData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // 🔹 Updated state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState(""); // 🔹 New state for "Go to"

  // 🔹 state sorting
  const [sortConfig, setSortConfig] = useState({
    key: "PartNumber",
    direction: "asc",
  });

  // 🔹 Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchPartDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Part...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
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

  useEffect(() => {
    fetchPartDataTable();
  }, []);

  // 🔹 Filter data berdasarkan pencarian (using debounced search term)
  const filteredPartTable = useMemo(() => {
    return PartData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [PartData, debouncedSearchTerm]);

  // 🔹 Sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredPartTable];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredPartTable, sortConfig]);

  // 🔹 Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // 🔹 Icon indikator sort (using Lucide-React icons)
  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  // 🔹 "Go to page" handler
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Part Table</h2>

      {/* Flexbox container for search input and Add button */}
      <div className="flex flex-wrap items-center gap-2 mb-4 ">
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search parts..."
          className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Add Part Button */}
        <PartAdd />
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* 🔹 Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("PartNumber")}>
                Part Number {getSortIcon("PartNumber")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Keyword")}>
                Keyword {getSortIcon("Keyword")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("PartDescription")}>
                Part Description {getSortIcon("PartDescription")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Orderability")}>
                Orderability {getSortIcon("Orderability")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("RestrictionReason")}>
                Restriction Reason {getSortIcon("RestrictionReason")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("CSR_Flag")}>
                CSR Flag {getSortIcon("CSR_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("ROHS_Flag")}>
                ROHS Flag {getSortIcon("ROHS_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Returnable_Flag")}>
                Returnable Flag {getSortIcon("Returnable_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("HardRoll_Flag")}>
                HardRoll Flag {getSortIcon("HardRoll_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("DangerousGoods_Flag")}>
                DangerousGoods Flag {getSortIcon("DangerousGoods_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("LithiumBattery_Flag")}>
                LithiumBattery Flag {getSortIcon("LithiumBattery_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Oversize_Flag")}>
                Oversize Flag {getSortIcon("Oversize_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Heavy_Flag")}>
                Heavy Flag {getSortIcon("Heavy_Flag")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Price")}>
                Price {getSortIcon("Price")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("FreightPrice")}>
                Freight Price {getSortIcon("FreightPrice")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Tax")}>
                Tax {getSortIcon("Tax")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Total")}>
                Total {getSortIcon("Total")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Shipping_Fee")}>
                Shipping Fee {getSortIcon("Shipping_Fee")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((PartItem, i) => (
                <tr key={PartItem.PartNumber} className={`text-center text-sm hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                    {PartItem.PartNumber}
                  </td>
                  <td className="p-2 border">{PartItem.Keyword}</td>
                  <td className="p-2 border">{PartItem.PartDescription}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Orderability ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.Orderability ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">{PartItem.RestrictionReason}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.CSR_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.CSR_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.ROHS_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.ROHS_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Returnable_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.Returnable_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.HardRoll_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.HardRoll_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.DangerousGoods_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.DangerousGoods_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.LithiumBattery_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.LithiumBattery_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Oversize_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.Oversize_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Heavy_Flag ? "bg-green-500" : "bg-red-500"}`}>
                      {PartItem.Heavy_Flag ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">{PartItem.Price}</td>
                  <td className="p-2 border">{PartItem.FreightPrice}</td>
                  <td className="p-2 border">{PartItem.Tax}</td>
                  <td className="p-2 border">{PartItem.Total}</td>
                  <td className="p-2 border">{PartItem.Shipping_Fee}</td>
                  <td className="flex items-center justify-center gap-2 p-2 border">
                    <PartEdit PartNumber={PartItem.PartNumber} onUpdate={fetchPartDataTable} />
                    <PartDelete
                      PartNumber={PartItem.PartNumber}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchPartDataTable}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="19" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Bottom controls (Pagination) */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> parts
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const Resource_table = () => {
  const [ResourceData, setResourceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");

  // 🔹 sort config
  const [sortConfig, setSortConfig] = useState({
    key: "ResourceId",
    direction: "asc",
  });

  const navigate = useNavigate();

  // 🔹 Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  useEffect(() => {
    fetchResourceDataTable();
  }, []);

  // 🔹 Filter data based on debounced search
  const filteredResourceTable = useMemo(() => {
    return ResourceData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [ResourceData, debouncedSearchTerm]);

  // 🔹 Sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredResourceTable];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredResourceTable, sortConfig]);

  // 🔹 Calculate total pages
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  // 🔹 Get current page data
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // 🔹 Sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };
  
  // 🔹 Go to page handler
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Resource Table</h2>

      {/* Kontainer Flexbox untuk pencarian dan tombol Add */}
      <div className="flex flex-warp items-center gap-2 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search..."
          className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Add Button */}
        <ResourceAdd />
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-center border">No</th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("ResourceId")}
              >
                Resource ID {getSortIcon("ResourceId")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("Name")}
              >
                Name {getSortIcon("Name")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((ResourceItem, i) => (
                <tr
                  key={ResourceItem.ResourceId}
                  className={`text-center hover:bg-gray-100 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                    {ResourceItem.ResourceId}
                  </td>
                  <td className="p-2 border">{ResourceItem.Name}</td>
                  <td className="flex items-center justify-center gap-2 p-2 border">
                    <ResourceEdit
                      ResourceId={ResourceItem.ResourceId}
                      onUpdate={fetchResourceDataTable}
                    />
                    <ResourceDelete
                      ResourceId={ResourceItem.ResourceId}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchResourceDataTable}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Bottom controls (Pagination) */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> resources
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const ResourceAccountTable = () => {
  const [resourceAccounts, setResourceAccounts] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [resourceFilter, setResourceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SORTING STATE
  const [sortConfig, setSortConfig] = useState({
    key: "ResourceAccountId",
    direction: "asc",
  });

  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown size={14} className="inline ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="inline ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="inline ml-1 text-blue-600" />
    );
  };

  const fetchResources = async () => {
    try {
      const response = await ApiCustomer.get("/api/resources");
      if (response.data.success) {
        setResources(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  const fetchResourceAccounts = async () => {
    setLoading(true);
    setError(null);
    Swal.fire({
      title: "Memuat Data Resource Account...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

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

  // Unique ResourceIds for filter
  const uniqueResourceIds = useMemo(() => {
    return [
      ...new Set(resourceAccounts.map((item) => item.ResourceId).filter((v) => v)),
    ].sort();
  }, [resourceAccounts]);

  // Filtering logic (using debounced search term)
  const filteredAccounts = useMemo(() => {
    return resourceAccounts.filter((item) => {
      const matchSearch = Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      const matchResource = !resourceFilter || item.ResourceId === resourceFilter;
      return matchSearch && matchResource;
    });
  }, [resourceAccounts, debouncedSearchTerm, resourceFilter]);

  // SORTING applied here
  const sortedAccounts = useMemo(() => {
    let sortable = [...filteredAccounts];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a?.[sortConfig.key] ?? "";
        const bVal = b?.[sortConfig.key] ?? "";

        if (!isNaN(aVal) && !isNaN(bVal)) {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return sortable;
  }, [filteredAccounts, sortConfig]);

  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage) || 1;
  const currentData = sortedAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // "Go to page" handler
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Resource Accounts</h2>

      {/* NEW: Search Input + Add button in one row */}
      <div className="flex flex-col items-start gap-4 mb-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="🔍 Search accounts..."
          className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ResourceAccountAdd onAdd={fetchResourceAccounts} />
      </div>

      {/* NEW: Filters + Reset button below */}
      <div className="flex flex-col items-start gap-4 mb-4 sm:flex-row sm:items-center">
        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={resourceFilter}
          onChange={(e) => {
            setResourceFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Resources</option>
          {uniqueResourceIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => {
            setSearchTerm("");
            setResourceFilter("");
            setCurrentPage(1);
          }}
        >
          Reset Filters
        </button>
      </div>
      
      {loading && <p>Loading accounts...</p>}
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-center border cursor-pointer max-w-20" onClick={() => handleSort("ResourceAccountId")}>
                Resource Account ID {getSortIcon("ResourceAccountId")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Name")}>
                Name {getSortIcon("Name")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("ResourceId")}>
                Resource ID {getSortIcon("ResourceId")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((account, i) => (
                <tr
                  key={account.ResourceAccountId}
                  className={`text-sm hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-3 text-center text-blue-500 border cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/app/resource-account/${account.ResourceAccountId}`)
                    }
                  >
                    {account.ResourceAccountId}
                  </td>
                  <td className="p-3 border text-center">{account.Name}</td>
                  <td className="p-3 border text-center">{account.ResourceId || "-"}</td>
                  <td className="flex items-center justify-center gap-2 p-3 border">
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
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls (Pagination) */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedAccounts.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedAccounts.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedAccounts.length)}</b> of{" "}
          <b>{sortedAccounts.length}</b> accounts
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const SubkTechnician_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceAccountFilter, setResourceAccountFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subkTechnicianData, setSubkTechnicianData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // SORTING STATE
  const [sortConfig, setSortConfig] = useState({
    key: "SubkTechnicianId",
    direction: "asc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown size={14} className="inline ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="inline ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="inline ml-1 text-blue-600" />
    );
  };

  const fetchSubkTechnicianData = async () => {
    Swal.fire({
      title: "Memuat Data Subk Technician...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/subk-technician");
      if (response.data.success) {
        setSubkTechnicianData(response.data.data);
      } else {
        setError("Failed to fetch Subk Technician data");
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

  // Ambil unique Resource Account untuk filter
  const uniqueResourceAccounts = useMemo(() => {
    return [
      ...new Set(
        subkTechnicianData
          .map((item) => item.resourceAccount?.Name)
          .filter((v) => v)
      ),
    ].sort();
  }, [subkTechnicianData]);

  // Filtering logic (search + filter resource account)
  const filteredData = useMemo(() => {
    return subkTechnicianData.filter((item) => {
      const matchSearch = Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      const matchResource =
        !resourceAccountFilter ||
        item.resourceAccount?.Name === resourceAccountFilter;

      return matchSearch && matchResource;
    });
  }, [subkTechnicianData, debouncedSearchTerm, resourceAccountFilter]);

  // APPLY SORTING DI SINI
  const sortedData = useMemo(() => {
    let sortable = [...filteredData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal, bVal;

        if (sortConfig.key === "ResourceAccount") {
          aVal = a?.resourceAccount?.Name ?? "";
          bVal = b?.resourceAccount?.Name ?? "";
        } else {
          aVal = a?.[sortConfig.key] ?? "";
          bVal = b?.[sortConfig.key] ?? "";
        }

        if (!isNaN(aVal) && !isNaN(bVal)) {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // Handle "Go to page" input
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Subk Technician Table</h2>

      {/* Search and Add Button on the same row */}
      <div className="flex flex-col items-center justify-between gap-4 mb-4 sm:flex-row">
        <div className="flex items-center w-full gap-2">
          <input
            type="text"
            placeholder="🔍 Search technicians..."
            className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SubkTechnicianAdd onUpdate={fetchSubkTechnicianData} />
        </div>
      </div>

      {/* Filter and Reset Button on a new row */}
      <div className="flex flex-col items-center justify-between gap-4 mb-4 sm:flex-row">
        <div className="flex items-center w-full gap-2">
          <select
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            value={resourceAccountFilter}
            onChange={(e) => {
              setResourceAccountFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Resource Accounts</option>
            {uniqueResourceAccounts.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 text-white bg-gray-500 rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => {
              setSearchTerm("");
              setResourceAccountFilter("");
              setCurrentPage(1);
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("SubkTechnicianId")}>
                Subk Technician ID {getSortIcon("SubkTechnicianId")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Name")}>
                Name {getSortIcon("Name")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("ResourceAccount")}>
                Resource Account {getSortIcon("ResourceAccount")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr
                  key={item.SubkTechnicianId}
                  className={`text-sm hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-3 text-center text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/subk-technician/${item.SubkTechnicianId}`)}
                  >
                    {item.SubkTechnicianId}
                  </td>
                  <td className="p-3 border text-center">{item.Name}</td>
                  <td className="p-3 border text-center">
                    {item.resourceAccount?.Name || "N/A"}
                  </td>
                  <td className="flex items-center justify-center gap-2 p-3 border">
                    <SubkTechnicianEdit
                      SubkTechnicianId={item.SubkTechnicianId}
                      onUpdate={fetchSubkTechnicianData}
                    />
                    <SubkTechnicianDelete
                      SubkTechnicianId={item.SubkTechnicianId}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchSubkTechnicianData}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls (Pagination) */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing{" "}
          <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> technicians
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const SymptomCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptomCodeData, setSymptomCodeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // SORTING STATE
  const [sortConfig, setSortConfig] = useState({
    key: "SymptomCodeID",
    direction: "asc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown size={14} className="inline ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="inline ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="inline ml-1 text-blue-600" />
    );
  };

  const fetchSymptomCodeData = async () => {
    Swal.fire({
      title: "Memuat Data Symptom Codes...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
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

  // Filtering logic
  const filteredData = useMemo(() => {
    return symptomCodeData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [symptomCodeData, debouncedSearchTerm]);

  // APPLY SORTING DI SINI
  const sortedData = useMemo(() => {
    const sortable = [...filteredData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" || typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        }

        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // Handle "Go to page" input
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Symptom Code Table</h2>

      {/* Search + Add Button (row 1) */}
      <div className="flex flex-col items-center justify-between gap-4 mb-4 sm:flex-row">
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="🔍 Search symptom codes..."
            className="w-full p-2 border rounded-lg shadow-sm sm:w-1/3 focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <SymptomCodeAdd onUpdate={fetchSymptomCodeData} />
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SymptomCodeID")}
              >
                Symptom Code ID {getSortIcon("SymptomCodeID")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SymptomCode")}
              >
                Symptom Code {getSortIcon("SymptomCode")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("TopCategory")}
              >
                Top Category {getSortIcon("TopCategory")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("SubCategory")}
              >
                Sub Category {getSortIcon("SubCategory")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("QualityCodes")}
              >
                Quality Codes {getSortIcon("QualityCodes")}
              </th>
              <th
                className="p-3 text-center border cursor-pointer"
                onClick={() => handleSort("CreatedOn")}
              >
                Created On {getSortIcon("CreatedOn")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={item.SymptomCodeID} className={`text-sm hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-3 text-center text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/symptom-code/${item.SymptomCodeID}`)}
                  >
                    {item.SymptomCodeID}
                  </td>
                  <td className="p-3 border text-center">{item.SymptomCode}</td>
                  <td className="p-3 border text-center">{item.TopCategory}</td>
                  <td className="p-3 border text-center">{item.SubCategory}</td>
                  <td className="p-3 border text-center">{item.QualityCodes || "N/A"}</td>
                  <td className="p-3 border text-center">
                    {new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="flex items-center justify-center gap-2 p-3 border">
                    <SymptomCodeEdit
                      SymptomCodeID={item.SymptomCodeID}
                      onUpdate={fetchSymptomCodeData}
                    />
                    <SymptomCodeDelete
                      SymptomCodeID={item.SymptomCodeID}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchSymptomCodeData}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls (Pagination) */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing{" "}
          <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> symptom codes
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const BookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");

  // filters
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedJeopardy, setSelectedJeopardy] = useState("");
  const [selectedCreatedBy, setSelectedCreatedBy] = useState("");

  // sort config (default: BookingId DESC)
  const [sortConfig, setSortConfig] = useState({
    key: "BookingId",
    direction: "asc",
  });

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchBookingData = async () => {
    Swal.fire({
      title: "Memuat Data Bookings...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/booking");
      if (response.data.success) {
        console.log("Data Response Booking", response.data.data);
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

  // derive unique options
  const uniqueStatus = useMemo(() => {
    const all = bookingData.map((b) => b.BookingStatus).filter(Boolean);
    return ["", ...Array.from(new Set(all)).sort()];
  }, [bookingData]);

  const uniqueJeopardy = ["", "Yes", "No"];

  const uniqueCreatedBy = useMemo(() => {
    const all = bookingData.map((b) => b.createdByUser?.Username).filter(Boolean);
    return ["", ...Array.from(new Set(all)).sort()];
  }, [bookingData]);

  // filter + search
  const filteredData = useMemo(() => {
    return bookingData.filter((item) => {
      const status = item.BookingStatus ?? "";
      const jeopardy = item.ScheduleJeopardy ? "Yes" : "No";
      const createdBy = item.createdByUser?.Username ?? "";

      const fStatus = !selectedStatus || status === selectedStatus;
      const fJeopardy = !selectedJeopardy || jeopardy === selectedJeopardy;
      const fCreated = !selectedCreatedBy || createdBy === selectedCreatedBy;
      if (!(fStatus && fJeopardy && fCreated)) return false;

      // search
      const haystack = Object.values(item).join(" ").toLowerCase();
      return haystack.includes(debouncedSearchTerm.toLowerCase());
    });
  }, [bookingData, debouncedSearchTerm, selectedStatus, selectedJeopardy, selectedCreatedBy]);

  // sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // handle nested fields
        if (sortConfig.key === "Username") {
          aVal = a.createdByUser?.Username ?? "";
          bVal = b.createdByUser?.Username ?? "";
        }
        if (sortConfig.key === "ScheduleJeopardy") {
          aVal = a.ScheduleJeopardy ? "Yes" : "No";
          bVal = b.ScheduleJeopardy ? "Yes" : "No";
        }

        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedJeopardy("");
    setSelectedCreatedBy("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown size={14} className="inline ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="inline ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="inline ml-1 text-blue-600" />
    );
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Bookings Table</h2>

      {/* Search & Add */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search bookings..."
          className="w-full sm:w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <BookingsAdd onUpdate={fetchBookingData} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          {uniqueStatus.map((v) => (
            <option key={v} value={v}>
              {v || "—"}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedJeopardy}
          onChange={(e) => {
            setSelectedJeopardy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Jeopardy</option>
          {uniqueJeopardy.map((v) => (
            <option key={v} value={v}>
              {v || "—"}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedCreatedBy}
          onChange={(e) => {
            setSelectedCreatedBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Created By</option>
          {uniqueCreatedBy.map((v) => (
            <option key={v} value={v}>
              {v || "—"}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        >
          Reset Filter
        </button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table with fixed header and scrollable body */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto max-h-[70vh]">
        <table className="min-w-full relative border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("BookingId")}>
                Booking ID {getSortIcon("BookingId")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("WOID")}>
                WOID {getSortIcon("WOID")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("BookingStatus")}>
                Status {getSortIcon("BookingStatus")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("ScheduleJeopardy")}>
                Schedule Jeopardy {getSortIcon("ScheduleJeopardy")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("ScheduleJeopardyTime")}>
                Jeopardy Time {getSortIcon("ScheduleJeopardyTime")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("DoNotDisturb")}>
                Do Not Disturb {getSortIcon("DoNotDisturb")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("CeScheduleChange")}>
                CE Schedule Change {getSortIcon("CeScheduleChange")}
              </th>
              <th className="p-3 text-center border">Durations (min)</th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("Username")}>
                Created By {getSortIcon("Username")}
              </th>
              <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort("CreatedAt")}>
                Created At {getSortIcon("CreatedAt")}
              </th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={item.BookingId} className={`text-center hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-3 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/bookings/${item.BookingId}`)}
                  >
                    {item.BookingId}
                  </td>
                  <td className="p-3 border text-center" onClick={() => navigate(`/app/work/${item.WOID}`)}>{item.WOID}</td>
                  <td className="p-3 border text-center">{item.BookingStatus || "-"}</td>
                  <td className="p-3 border text-center">{item.ScheduleJeopardy ? "Yes" : "No"}</td>
                  <td className="p-3 border text-center">
                    {item.ScheduleJeopardyTime
                      ? new Date(item.ScheduleJeopardyTime).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="p-3 border text-center">{item.DoNotDisturb ? "Yes" : "No"}</td>
                  <td className="p-3 border text-center">{item.CeScheduleChange ? "Yes" : "No"}</td>
                  <td className="p-3 border text-center">
                    Total Billable: {item.TotalBillableDurationInMinutes || 0} <br />
                    Total In Progress: {item.TotalInProgressDurationInMinutes || 0} <br />
                    Total Break: {item.TotalBreakDurationInMinutes || 0}
                  </td>
                  <td className="p-3 border text-center">{item.createdByUser?.Username || "-"}</td>
                  <td className="p-3 border text-center">
                    {new Date(item.CreatedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="flex justify-center p-3 space-x-2 border">
                    <BookingsEdit BookingId={item.BookingId} onUpdate={fetchBookingData} />
                    <BookingsDelete
                      BookingId={item.BookingId}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchBookingData}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-6 text-center text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing{" "}
          <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> bookings
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const BookingDetailsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 per page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingDetailsData, setBookingDetailsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");
  const navigate = useNavigate();

  // filters
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedChangedBy, setSelectedChangedBy] = useState("");

  // sorting config
  const [sortConfig, setSortConfig] = useState({
    key: "BookingDetailId",
    direction: "asc",
  });

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchBookingDetails = async () => {
    Swal.fire({
      title: "Memuat Data Booking Details...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/bookingDetails");
      if (response.data.success) {
        console.log("Data Response BookingDetails", response.data.data);
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

  // derive unique options
  const uniqueStatus = useMemo(() => {
    const all = bookingDetailsData.map((b) => b.Status).filter(Boolean);
    return ["", ...Array.from(new Set(all)).sort()];
  }, [bookingDetailsData]);

  const uniqueChangedBy = useMemo(() => {
    const all = bookingDetailsData.map((b) => b.ChangedBy).filter(Boolean);
    return ["", ...Array.from(new Set(all)).sort()];
  }, [bookingDetailsData]);

  // filter + search
  const filteredData = bookingDetailsData.filter((item) => {
    const status = item.Status ?? "";
    const changedBy = item.ChangedBy ?? "";

    const fStatus = !selectedStatus || status === selectedStatus;
    const fChangedBy =
      !selectedChangedBy || changedBy.toString() === selectedChangedBy.toString();

    if (!(fStatus && fChangedBy)) return false;

    // search with debounced term
    const haystack = Object.values(item).join(" ").toLowerCase();
    return haystack.includes(debouncedSearchTerm.toLowerCase());
  });

  // sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // default value handling
        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedChangedBy("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // sort handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Booking Details Management</h2>

      {/* Search & Add */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="w-full sm:w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <BookingDetailsAdd onUpdate={fetchBookingDetails} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          {uniqueStatus.map((v) => (
            <option key={v} value={v}>
              {v || "—"}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={selectedChangedBy}
          onChange={(e) => {
            setSelectedChangedBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Changed By</option>
          {uniqueChangedBy.map((v) => (
            <option key={v} value={v}>
              {v || "—"}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
        >
          Reset Filter
        </button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow overflow-auto max-h-[600px] relative">
        <table className="w-full relative border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="text-gray-700 uppercase text-sm text-center">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("BookingDetailId")}>
                Booking Detail ID {getSortSymbol("BookingDetailId")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("BookingId")}>
                Booking ID {getSortSymbol("BookingId")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("ResourceId")}>
                Resource ID {getSortSymbol("ResourceId")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("ResorceAccountId")}>
                Resource Account ID {getSortSymbol("ResorceAccountId")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("SubkTechnicianId")}>
                Subk Technician ID {getSortSymbol("SubkTechnicianId")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("Name")}>
                Name {getSortSymbol("Name")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("Status")}>
                Status {getSortSymbol("Status")}
              </th>
              <th className="border p-3">Customer Time</th>
              <th className="border p-3">User Time</th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("ChangedBy")}>
                Changed By {getSortSymbol("ChangedBy")}
              </th>
              <th className="border p-3 cursor-pointer" onClick={() => handleSort("ChangedAt")}>
                Changed At {getSortSymbol("ChangedAt")}
              </th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={item.BookingDetailId} className={`hover:bg-gray-100 text-center text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="border p-2 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/bookings/${item.BookingDetailId}`)}
                  >
                    {item.BookingDetailId}
                  </td>
                  <td className="border p-2">{item.BookingId}</td>
                  <td className="border p-2">{item.ResourceId}</td>
                  <td className="border p-2">{item.ResorceAccountId}</td>
                  <td className="border p-2">{item.SubkTechnicianId}</td>
                  <td className="border p-2">{item.Name}</td>
                  <td className="border p-2">{item.Status}</td>
                  <td className="p-2 text-left border">
                    <div>
                      Start:{" "}
                      {item.StartTimeCustomerTime
                        ? new Date(item.StartTimeCustomerTime).toLocaleString()
                        : "-"}
                    </div>
                    <div>
                      End:{" "}
                      {item.EndTimeCustomerTime
                        ? new Date(item.EndTimeCustomerTime).toLocaleString()
                        : "-"}
                    </div>
                    <div>
                      Est. Arrival:{" "}
                      {item.EstimatedArrivalTimeCustomerTime
                        ? new Date(item.EstimatedArrivalTimeCustomerTime).toLocaleString()
                        : "-"}
                    </div>
                    <div>
                      Actual Arrival:{" "}
                      {item.ActualArrivalTimeCustomerTime
                        ? new Date(item.ActualArrivalTimeCustomerTime).toLocaleString()
                        : "-"}
                    </div>
                  </td>
                  <td className="p-2 text-left border">
                    <div>
                      Start:{" "}
                      {item.StartTimeUserTime
                        ? new Date(item.StartTimeUserTime).toLocaleString()
                        : "-"}
                    </div>
                    <div>
                      End:{" "}
                      {item.EndTimeUserTime
                        ? new Date(item.EndTimeUserTime).toLocaleString()
                        : "-"}
                    </div>
                    <div>Duration: {item.DurationInMinutesUserTime || 0} min</div>
                    <div>
                      Est. Arrival:{" "}
                      {item.EstimatedArrivalTimeUserTime
                        ? new Date(item.EstimatedArrivalTimeUserTime).toLocaleString()
                        : "-"}
                    </div>
                    <div>
                      Actual Arrival:{" "}
                      {item.ActualArrivalTimeUserTime
                        ? new Date(item.ActualArrivalTimeUserTime).toLocaleString()
                        : "-"}
                    </div>
                  </td>
                  <td className="p-2 border">{item.ChangedBy}</td>
                  <td className="p-2 border">
                    {new Date(item.ChangedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="flex justify-center gap-2 p-2 border">
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
              ))
            ) : (
              <tr>
                <td colSpan="12" className="p-4 text-center text-gray-500">
                  No entries found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> booking details
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const RepairClassCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk menunda pencarian (debounce)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  // Default 10 item per halaman, dapat diubah
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State untuk input "Go to page"
  const [goToPageInput, setGoToPageInput] = useState("");
  const navigate = useNavigate();

  // 🔹 sort config
  const [sortConfig, setSortConfig] = useState({
    key: "Code",
    direction: "asc",
  });

  // Efek untuk menunda (debounce) pencarian selama 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async () => {
    Swal.fire({
      title: "Memuat Data Repair Class Code...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/repairClassCode");
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch repair class code data");
      }
    } catch (err) {
      console.error("Error fetching repair class code data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 filter search menggunakan debouncedSearchTerm
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  );

  // 🔹 sorting
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) aVal = "";
        if (bVal === null || bVal === undefined) bVal = "";

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 sort handlers
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };
  
  // Fungsi untuk menangani "Go to page"
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Repair Class Code Management</h2>

      {/* Kontainer untuk Search dan Tombol Add yang sejajar dan sama tinggi */}
      <div className="flex flex-wrap items-center  gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search codes..."
          className="w-full sm:w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* RepairClassCodeAdd akan sejajar dengan input berkat flexbox */}
        <RepairClassCodeAdd onUpdate={fetchData} />
      </div>
      
      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Kontainer tabel dengan gulir dan header tetap */}
      <div className="bg-white rounded-2xl shadow overflow-auto max-h-[600px] relative">
        <table className="w-full relative border-collapse">
          {/* Header tabel dengan sticky class */}
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm text-center">
              <th className="p-3 text-sm font-semibold text-center border">No</th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("Code")}
              >
                Code {getSortIcon("Code")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("Description")}
              >
                Description {getSortIcon("Description")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("Definition")}
              >
                Definition {getSortIcon("Definition")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("PaymentEligibility")}
              >
                Payment Eligibility {getSortIcon("PaymentEligibility")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("CreatedOn")}
              >
                Created On {getSortIcon("CreatedOn")}
              </th>
              <th className="p-3 text-sm font-semibold text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={item.Code} className={`hover:bg-gray-100 text-center text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td
                    className="border p-2 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/repair-class-code/${item.Code}`)}
                  >
                    {item.Code}
                  </td>
                  <td className="border p-2">{item.Description}</td>
                  <td className="border p-2">{item.Definition}</td>
                  <td className="border p-2">{item.PaymentEligibility}</td>
                  <td className="border p-2">
                    {item.CreatedOn
                      ? new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <RepairClassCodeEdit Code={item.Code} onUpdate={fetchData} />
                    <RepairClassCodeDelete
                      Code={item.Code}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchData}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No entries found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> codes
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const ServiceCatalogTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk menunda pencarian (debounce)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  // Default 10 item per halaman, dapat diubah
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceCatalogData, setServiceCatalogData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State untuk input "Go to page"
  const [goToPageInput, setGoToPageInput] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "ServiceCatalogID", direction: "desc" });
  const navigate = useNavigate();

  // Efek untuk menunda (debounce) pencarian selama 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchServiceCatalog = async () => {
    Swal.fire({
      title: "Memuat Data Service Catalog...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/service-log");
      if (response.data.success) {
        setServiceCatalogData(response.data.data);
      } else {
        setError("Failed to fetch service catalog data");
      }
    } catch (err) {
      console.error("Error fetching service catalog data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchServiceCatalog();
  }, []);

  // fungsi sorting dengan useMemo untuk performa lebih baik
  const sortedData = useMemo(() => {
    const sorted = [...serviceCatalogData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? "";
        const bVal = b[sortConfig.key] ?? "";

        if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
          const numA = parseFloat(aVal);
          const numB = parseFloat(bVal);
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        }

        const strA = aVal.toString().toLowerCase();
        const strB = bVal.toString().toLowerCase();

        if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
        if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [serviceCatalogData, sortConfig]);

  // filter search menggunakan debouncedSearchTerm
  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
  );
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  // Fungsi untuk menangani "Go to page"
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">📊 Service Catalog Table</h2>

      {/* Kontainer untuk Search dan Tombol Add yang sejajar dan sama tinggi */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="w-full sm:w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* ServiceCatalogAdd akan sejajar dengan input berkat flexbox */}
        <ServiceCatalogAdd onUpdate={fetchServiceCatalog} />
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Kontainer tabel dengan gulir dan header tetap */}
      <div className="bg-white rounded-2xl shadow overflow-auto max-h-[600px] relative">
        <table className="w-full relative border-collapse">
          {/* Header tabel dengan sticky class */}
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm text-center">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("ServiceCatalogID")}>
                Service Catalog ID {renderSortIcon("ServiceCatalogID")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("AssetID")}>
                Asset ID {renderSortIcon("AssetID")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("Service_offerID")}>
                Service Offer ID {renderSortIcon("Service_offerID")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("PartNumber")}>
                Part Number {renderSortIcon("PartNumber")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("WarrantyStatus")}>
                Warranty Status {renderSortIcon("WarrantyStatus")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("Currency")}>
                Currency {renderSortIcon("Currency")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("Price")}>
                Price {renderSortIcon("Price")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("Tax")}>
                Tax {renderSortIcon("Tax")}
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => requestSort("Total")}>
                Total {renderSortIcon("Total")}
              </th>
              <th className="p-3 text-sm font-semibold text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={item.ServiceCatalogID} className={`hover:bg-gray-100 text-center text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td
                    className="border p-2 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/service-log/${item.ServiceCatalogID}`)}
                  >
                    {item.ServiceCatalogID}
                  </td>
                  <td className="border p-2">{item.AssetID}</td>
                  <td className="border p-2">{item.Service_offerID}</td>
                  <td className="border p-2">{item.PartNumber || "-"}</td>
                  <td className="border p-2">{item.WarrantyStatus || "-"}</td>
                  <td className="border p-2">{item.Currency || "-"}</td>
                  <td className="border p-2">
                    {item.Price ? parseFloat(item.Price).toFixed(2) : "-"}
                  </td>
                  <td className="border p-2">
                    {item.Tax ? parseFloat(item.Tax).toFixed(2) : "-"}
                  </td>
                  <td className="border p-2">
                    {item.Total ? parseFloat(item.Total).toFixed(2) : "-"}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <ServiceCatalogEdit
                      ServiceCatalogID={item.ServiceCatalogID}
                      onUpdate={fetchServiceCatalog}
                    />
                    <ServiceCatalogDelete
                      ServiceCatalogID={item.ServiceCatalogID}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchServiceCatalog}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  No entries found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === filteredData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(filteredData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, filteredData.length)}</b> of{" "}
          <b>{filteredData.length}</b> entries
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const OTCCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk menunda pencarian (debounce)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  // Default 10 item per halaman, dapat diubah
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otcCodeData, setOTCCodeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State untuk input "Go to page"
  const [goToPageInput, setGoToPageInput] = useState("");
  const navigate = useNavigate();

  // state sorting
  const [sortConfig, setSortConfig] = useState({
    key: "OTCCode",
    direction: "asc",
  });

  // Efek untuk menunda (debounce) pencarian selama 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchOTCCode = async () => {
    Swal.fire({
      title: "Memuat Data OTC Code...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/otc-code");
      if (response.data.success) {
        setOTCCodeData(response.data.data);
      } else {
        setError("Failed to fetch OTC Code data");
      }
    } catch (err) {
      console.error("Error fetching OTC Code Table:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchOTCCode();
  }, []);

  // handle sorting dengan useMemo untuk performa lebih baik
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // filter & sort
  const filteredData = useMemo(() => {
    return otcCodeData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [otcCodeData, debouncedSearchTerm]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // function ambil icon sort
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={16} />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );
  };

  // Fungsi untuk menangani "Go to page"
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 OTC Codes Table</h2>

      {/* Kontainer untuk Search dan Tombol Add yang sejajar dan sama tinggi */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="w-full sm:w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* OTCAdd akan sejajar dengan input berkat flexbox */}
        <OTCAdd onUpdate={fetchOTCCode} />
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Kontainer tabel dengan gulir dan header tetap */}
      <div className="bg-white rounded-2xl shadow overflow-auto max-h-[600px] relative">
        <table className="w-full relative border-collapse">
          {/* Header tabel dengan sticky class */}
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-3 text-sm font-semibold text-center border">No</th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("OTCCode")}>
                <div className="flex items-center justify-center gap-1">
                  OTC Code {getSortIcon("OTCCode")}
                </div>
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("Description")}>
                <div className="flex items-center justify-center gap-1">
                  Description {getSortIcon("Description")}
                </div>
              </th>
              <th className="p-3 text-sm font-semibold text-left border cursor-pointer" onClick={() => handleSort("CreatedOn")}>
                <div className="flex items-center justify-center gap-1">
                  Created At {getSortIcon("CreatedOn")}
                </div>
              </th>
              <th className="p-3 text-sm font-semibold text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={item.OTCCode} className={`hover:bg-gray-100 text-center text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="p-3 text-blue-500 border cursor-pointer hover:underline">
                    {item.OTCCode}
                  </td>
                  <td className="p-3 border">{item.Description}</td>
                  <td className="p-3 border">
                    {new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border p-2 flex space-x-2 justify-center">
                    <OTCEdit OTCCode={item.OTCCode} onUpdate={fetchOTCCode} />
                    <OTCDelete
                      OTCCode={item.OTCCode}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchOTCCode}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No entries found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedData.length)}</b> of{" "}
          <b>{sortedData.length}</b> entries
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const CrsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Menambahkan itemsPerPage
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [CrsData, setCrsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState(""); // Menambahkan goToPageInput

  // state sorting
  const [sortConfig, setSortConfig] = useState({
    key: "caseResolutionCode",
    direction: "asc",
  });

  const fetchCrs = async () => {
    Swal.fire({
      title: "Memuat Data CRS",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/caseResolution");
      if (response.data.success) {
        setCrsData(response.data.data);
      } else {
        setError("Failed to fetch CRS data");
      }
    } catch (err) {
      console.error("Error fetching CRS data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchCrs();
  }, []);

  // Sorting function
  const sortedData = useMemo(() => {
    const sorted = [...CrsData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle null/undefined values
        if (aVal == null) aVal = "";
        if (bVal == null) bVal = "";

        // Tipe data date
        const aIsDate = !isNaN(Date.parse(aVal));
        const bIsDate = !isNaN(Date.parse(bVal));

        if (aIsDate && bIsDate) {
          const dateA = new Date(aVal);
          const dateB = new Date(bVal);
          return sortConfig.direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        // Tipe data string
        if (typeof aVal === "string") {
            const result = aVal.localeCompare(bVal);
            return sortConfig.direction === "asc" ? result : -result;
        }

        // Tipe data angka
        const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortConfig.direction === "asc" ? result : -result;
      });
    }
    return sorted;
  }, [CrsData, sortConfig]);

  // Filtering function
  const filteredData = useMemo(() => {
    return sortedData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // handle click sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // render icon sort
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    if (sortConfig.direction === "asc")
      return <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />;
    return <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />;
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Case Resolution Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset halaman ke 1 saat mencari
        }}
      />

      <CrsAdd />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Kontainer untuk tabel yang bisa digulir */}
      <div className="bg-white rounded-2xl shadow overflow-scroll max-h-300">
        <table className="min-w-full border border-gray-300 border-collapse">
          <thead className="sticky z-10 top-0 bg-gray-200">
            <tr className="text-sm text-gray-700 uppercase">
              <th className="p-3 text-sm font-semibold text-left border">No</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("id_csr")}>
                <div className="flex items-center justify-center gap-1">
                  ID Csr {renderSortIcon("id_csr")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("caseResolutionCode")}>
                <div className="flex items-center justify-center gap-1">
                  Case Resolution Code {renderSortIcon("caseResolutionCode")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("autoClose")}>
                <div className="flex items-center justify-center gap-1">
                  Auto Close {renderSortIcon("autoClose")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("caseReadyForClosure")}>
                <div className="flex items-center justify-center gap-1">
                  Case Ready For Closure {renderSortIcon("caseReadyForClosure")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("readyForCloseDays")}>
                <div className="flex items-center justify-center gap-1">
                  Ready For Close Days {renderSortIcon("readyForCloseDays")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("readyForClosureDate")}>
                <div className="flex items-center justify-center gap-1">
                  Ready For Closure Date {renderSortIcon("readyForClosureDate")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("pendingCustomerAction")}>
                <div className="flex items-center justify-center gap-1">
                  Pending Customer Action {renderSortIcon("pendingCustomerAction")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("customerRequestedCloseDate")}>
                <div className="flex items-center justify-center gap-1">
                  Customer Requested CloseDate {renderSortIcon("customerRequestedCloseDate")}
                </div>
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={item.id_csr} className={`text-center hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-2 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/case-resolution/${item.id_csr}`)}
                  >
                    {item.id_csr}
                  </td>
                  <td className="p-2 text-blue-500 border">{item.caseResolutionCode}</td>
                  <td className="p-2 border">{item.autoClose}</td>
                  <td className="p-2 border">{item.caseReadyForClosure}</td>
                  <td className="p-2 border">{item.readyForCloseDays}</td>
                  <td className="p-2 border">
                    {item.readyForClosureDate ? new Date(item.readyForClosureDate).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="p-2 border">
                    {item.pendingCustomerAction ? new Date(item.pendingCustomerAction).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="p-2 border">
                    {item.customerRequestedCloseDate ? new Date(item.customerRequestedCloseDate).toLocaleDateString("id-ID") : "-"}
                  </td>
                  <td className="border p-2 flex space-x-2 justify-center">
                    <CrsEdit id_csr={item.id_csr} onUpdate={fetchCrs} />
                    <CrsDelete
                      id_csr={item.id_csr}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchCrs}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination dan Rows per page */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, filteredData.length)}</b> of{" "}
          <b>{filteredData.length}</b> entries
        </div>

        {/* Tombol Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const FailureTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Mengubah default itemsPerPage menjadi 10
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [FailureData, setFailureData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState(""); // Menambahkan state untuk "Go to page"

  // 🔹 State untuk sorting
  const [sortConfig, setSortConfig] = useState({
    key: "FailureId",
    direction: "asc",
  });

  const fetchFailureDataTable = async () => {
    setLoading(true);
    setError(null);
    Swal.fire({
      title: "Memuat Data Failure...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await ApiCustomer.get("/api/failure");
      if (response.data.success) {
        setFailureData(response.data.data);
      } else {
        setError("Failed to fetch Failure data");
      }
    } catch (err) {
      console.error("Error fetching Failure data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchFailureDataTable();
  }, []);

  // 🔹 Fungsi sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // 🔹 Menggunakan useMemo untuk sorting dan filtering
  const sortedAndFilteredData = useMemo(() => {
    const filtered = FailureData.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const sorted = [...filtered].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const valueA = a[sortConfig.key] ?? "";
      const valueB = b[sortConfig.key] ?? "";
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [FailureData, searchTerm, sortConfig]);

  // Hitung total halaman
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage) || 1;

  // Ambil data sesuai halaman saat ini
  const currentData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // 🔹 Ikon sort dinamis
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="inline w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />
    );
  };

  // 🔹 Fungsi untuk "Go to page"
  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = Number(goToPageInput);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setGoToPageInput("");
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">Failure Management</h2>
      <input
        type="text"
        placeholder="🔍 Search failures..."
        className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 mb-4 w-full md:w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      <FailureAdd />
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Kontainer untuk tabel yang bisa digulir */}
      <div className="bg-white rounded-2xl shadow overflow-scroll max-h-300">
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0 bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold text-center border">No</th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("FailureId")}
              >
                Failure ID {renderSortIcon("FailureId")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("Name")}
              >
                Name {renderSortIcon("Name")}
              </th>
              <th
                className="p-3 text-sm font-semibold text-center border cursor-pointer"
                onClick={() => handleSort("Description")}
              >
                Description {renderSortIcon("Description")}
              </th>
              <th className="p-3 text-sm font-semibold text-center border">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((FailureItem, i) => (
                <tr
                  key={FailureItem.FailureId}
                  className={`hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 text-center border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td
                    className="p-3 text-blue-500 text-center border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/failure/${FailureItem.FailureId}`)}
                  >
                    {FailureItem.FailureId}
                  </td>
                  <td className="p-3 border">{FailureItem.Name}</td>
                  <td className="p-3 border">{FailureItem.Description}</td>
                  <td className="flex p-3 space-x-2 justify-center border">
                    <FailureEdit
                      FailureId={FailureItem.FailureId}
                      onUpdate={fetchFailureDataTable}
                    />
                    <FailureDelete
                      FailureId={FailureItem.FailureId}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchFailureDataTable}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No data found 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Kontrol di bagian bawah tabel */}
      <div className="flex flex-col w-full gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-1 text-sm border rounded-lg"
            value={itemsPerPage === sortedAndFilteredData.length ? "all" : itemsPerPage}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                setItemsPerPage(sortedAndFilteredData.length);
                setCurrentPage(1);
              } else {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Info total data */}
        <div className="text-sm text-gray-600">
          Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b> –{" "}
          <b>{Math.min(currentPage * itemsPerPage, sortedAndFilteredData.length)}</b> of{" "}
          <b>{sortedAndFilteredData.length}</b> entries
        </div>

        {/* Pagination + Go to page */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span className="px-3 py-1 text-sm">
              Page <b>{currentPage}</b> of {totalPages}
            </span>

            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>

            <form onSubmit={handleGoToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Go to"
                className="w-16 p-1 text-sm text-center border rounded-lg"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};