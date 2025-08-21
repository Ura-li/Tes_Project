import React, { useState, useEffect , useMemo} from "react";
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
import { RepairClassCodeAdd, RepairClassCodeEdit, RepairClassCodeDelete } from "@/components/sc-modal";
import { ServiceCatalogAdd, ServiceCatalogEdit, ServiceCatalogDelete } from "@/components/sc-modal";
import { OTCAdd, OTCEdit, OTCDelete} from "@/components/sc-modal";
import { CrsAdd, CrsEdit, CrsDelete } from "@/components/sc-modal";
import { FailureAdd, 
  FailureEdit, 
  FailureDelete } from "@/components/sc-modal";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ExportExcel } from "./components/Export-Excel";

import { Select, SelectItem, SelectTrigger, SelectContent, SelectGroup, SelectValue } from "./components/ui/select";
// import PDFButton from "./components/PDFButton";
// import ServiceRequestPDF from "./components/service-request-form";
export const Contact_table = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Sorting
  const [sortColumn, setSortColumn] = useState("ContactID");
  const [sortDirection, setSortDirection] = useState("asc");

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
  useEffect(() => {
    let filtered = contacts.filter((contact) => {
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

    // Sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal = a[sortColumn] ?? "";
        let bVal = b[sortColumn] ?? "";

        // Numeric comparison kalau bisa
        if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
          aVal = Number(aVal);
          bVal = Number(bVal);
        } else {
          aVal = aVal.toString().toLowerCase();
          bVal = bVal.toString().toLowerCase();
        }

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredContacts(filtered);
    setCurrentPage(1);
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
    sortColumn,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const currentData = useMemo(() => {
    return filteredContacts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredContacts, currentPage]);

  // Sorting handler
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortArrow = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Contact Table</h2>

      {/* Search + Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="p-2 border border-gray-300 rounded min-w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Dropdown filters */}
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="p-2 border rounded">
          <option value="">All Companies</option>
          {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedSalutation} onChange={(e) => setSelectedSalutation(e.target.value)} className="p-2 border rounded">
          <option value="">All Salutations</option>
          {uniqueSalutations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="p-2 border rounded">
          <option value="">All Languages</option>
          {uniqueLanguages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(""); setSelectedCity(""); setSelectedZipCode(""); }} className="p-2 border rounded">
          <option value="">All Countries</option>
          {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); setSelectedZipCode(""); }} className="p-2 border rounded" disabled={!selectedCountry}>
          <option value="">All States</option>
          {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedZipCode(""); }} className="p-2 border rounded" disabled={!selectedState}>
          <option value="">All Cities</option>
          {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedZipCode} onChange={(e) => setSelectedZipCode(e.target.value)} className="p-2 border rounded" disabled={!selectedCity}>
          <option value="">All Zip Codes</option>
          {uniqueZipCodes.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-scroll">
        <table className="border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              {[
                { key: "No", label: "No", disableSort: true },
                { key: "ContactID", label: "Contact ID" },
                { key: "Company", label: "Company" },
                { key: "Salutation", label: "Salutation" },
                { key: "FirstName", label: "First Name" },
                { key: "LastName", label: "Last Name" },
                { key: "Email", label: "Email" },
                { key: "PreferredLanguage", label: "Preferred Language" },
                { key: "Phone", label: "Phone" },
                { key: "Mobile", label: "Mobile" },
                { key: "WorkPhone", label: "Work Phone" },
                { key: "WorkExtension", label: "Work Extension" },
                { key: "OtherPhone", label: "Other Phone" },
                { key: "OtherExtension", label: "Other Extension" },
                { key: "Fax", label: "Fax" },
                { key: "AddressLine1", label: "Address Line 1" },
                { key: "AddressLine2", label: "Address Line 2" },
                { key: "City", label: "City" },
                { key: "StateProvince", label: "State/Province" },
                { key: "Country", label: "Country" },
                { key: "ZipPostalCode", label: "Zip/Postal Code" },
                { key: "Actions", label: "Actions", disableSort: true },
              ].map(col => (
                <th
                  key={col.key}
                  className="p-2 border cursor-pointer select-none"
                  onClick={() => !col.disableSort && handleSort(col.key)}
                >
                  {col.label}{!col.disableSort && renderSortArrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((contact, index) => (
                <tr key={contact.ContactID} className="text-center hover:bg-gray-100">
                  <td className="p-2 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-2 border">{contact.ContactID}</td>
                  <td className="p-2 border">{contact.Company}</td>
                  <td className="p-2 border">{contact.Salutation}</td>
                  <td className="p-2 border">{contact.FirstName}</td>
                  <td className="p-2 border">{contact.LastName}</td>
                  <td className="p-2 border">{contact.Email}</td>
                  <td className="p-2 border">{contact.PreferredLanguage}</td>
                  <td className="p-2 border">{contact.Phone}</td>
                  <td className="p-2 border">{contact.Mobile}</td>
                  <td className="p-2 border">{contact.WorkPhone}</td>
                  <td className="p-2 border">{contact.WorkExtension}</td>
                  <td className="p-2 border">{contact.OtherPhone}</td>
                  <td className="p-2 border">{contact.OtherExtension}</td>
                  <td className="p-2 border">{contact.Fax}</td>
                  <td className="p-2 border">{contact.AddressLine1}</td>
                  <td className="p-2 border">{contact.AddressLine2}</td>
                  <td className="p-2 border">{contact.City}</td>
                  <td className="p-2 border">{contact.StateProvince}</td>
                  <td className="p-2 border">{contact.Country}</td>
                  <td className="p-2 border">{contact.ZipPostalCode}</td>
                  <td className="flex p-2 space-x-2 border">
                    <ContactEdit contactID={contact.ContactID} onUpdate={fetchContacts} />
                    <ContactDelete contactID={contact.ContactID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="22" className="p-4 text-center">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // State untuk sorting
  const [sortConfig, setSortConfig] = useState({ key: 'Company', direction: 'ascending' });
  // State untuk filter country dan city
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mendapatkan daftar negara unik dari data
  const uniqueCountries = useMemo(() => {
    const countries = companies.map(company => company.Country).filter(Boolean);
    return ["", ...new Set(countries.sort())];
  }, [companies]);

  // Mendapatkan daftar kota unik dari data yang sudah difilter berdasarkan negara
  const uniqueCities = useMemo(() => {
    const cities = companies
      .filter(company => selectedCountry === "" || company.Country === selectedCountry)
      .map(company => company.City)
      .filter(Boolean);
    return ["", ...new Set(cities.sort())];
  }, [companies, selectedCountry]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fungsi untuk mengambil data dari API
  const fetchCompanies = async () => {
    setError(null);
    setLoading(true);

    Swal.fire({
      title: "Memuat Data Company...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get(`/api/site_account`);
      setCompanies(response.data.data);
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
      Swal.close();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter dan sort companies
  useEffect(() => {
    let currentFiltered = companies.filter((company) => {
      // General search term filter
      const matchesSearchTerm = Object.values(company).some((val) =>
        val?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

      // Country and City filters
      const matchesCountry = selectedCountry === "" || company.Country === selectedCountry;
      const matchesCity = selectedCity === "" || company.City === selectedCity;

      return matchesSearchTerm && matchesCountry && matchesCity;
    });

    // Sorting logic
    if (sortConfig.key !== null) {
      currentFiltered.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCompanies(currentFiltered);
  }, [debouncedSearchTerm, companies, sortConfig, selectedCountry, selectedCity]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const currentData = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sorting handler
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Company Table</h2>

      {/* Filter inputs section */}
      <div className="mb-4 space-x-4 flex items-center">
        {/* Text search input */}
        <input
          type="text"
          placeholder="Search companies..."
          className="w-1/3 p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {/* Country filter dropdown */}
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedCity(""); // Reset city filter when country changes
            setCurrentPage(1);
          }}
        >
          <option value="">All Countries</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {/* City filter dropdown */}
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setCurrentPage(1);
          }}
          disabled={!selectedCountry && companies.length > 0} // Disable if no country is selected
        >
          <option value="">All Cities</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">No</th>
              <th className="p-2 border cursor-pointer" onClick={() => requestSort('Company')}>
                Company {getSortIndicator('Company')}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => requestSort('Email')}>
                Email {getSortIndicator('Email')}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => requestSort('PrimaryPhone')}>
                Primary Phone {getSortIndicator('PrimaryPhone')}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => requestSort('WhatsappNo')}>
                Whatsapp Number {getSortIndicator('WhatsappNo')}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => requestSort('City')}>
                City {getSortIndicator('City')}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => requestSort('Country')}>
                Country {getSortIndicator('Country')}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((company, index) => (
                <tr key={company.SiteAccountID} className="hover:bg-gray-100">
                  <td className="p-2 text-center border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-2 border">{company.Company}</td>
                  <td className="p-2 border">{company.Email}</td>
                  <td className="p-2 border">{company.PrimaryPhone}</td>
                  <td className="p-2 border">{company.WhatsappNo}</td>
                  <td className="p-2 border">{company.City}</td>
                  <td className="p-2 border">{company.Country}</td>
                  <td className="flex p-2 space-x-2 border">
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
                <td colSpan="8" className="p-4 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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

  // 🔹 Sort states
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("CaseID"); // default sort

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
  let filteredCaseTable = caseData
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

  // 🔹 Sorting
  filteredCaseTable = [...filteredCaseTable].sort((a, b) => {
    const valA = a[sortColumn] ?? "";
    const valB = b[sortColumn] ?? "";

    // coba numeric
    const numA = parseFloat(valA);
    const numB = parseFloat(valB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return sortOrder === "asc" ? numA - numB : numB - numA;
    }

    // fallback string
    return sortOrder === "asc"
      ? valA.toString().localeCompare(valB.toString(), undefined, { numeric: true })
      : valB.toString().localeCompare(valA.toString(), undefined, { numeric: true });
  });

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredCaseTable.length / itemsPerPage);
  const currentData = filteredCaseTable.slice(
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
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <ExportExcel caseData={caseData} />
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
        <Select defaultValue="Open" value={openClose} onValueChange={setOpenClose}>
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
                Case ID {sortColumn === "CaseID" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CreatedOn")}>
                Created On {sortColumn === "CreatedOn" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CaseSubject")}>
                Case Subject {sortColumn === "CaseSubject" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CustomerAccount")}>
                Customer Account {sortColumn === "CustomerAccount" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Primary")}>
                Primary {sortColumn === "Primary" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("HW")}>
                HW {sortColumn === "HW" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SerialNumber")}>
                Serial Number {sortColumn === "SerialNumber" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductNumber")}>
                Product Number {sortColumn === "ProductNumber" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductName")}>
                Product Name {sortColumn === "ProductName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CreatedName")}>
                Created Name {sortColumn === "CreatedName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Owner")}>
                Owner {sortColumn === "Owner" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("WorkGroup")}>
                WorkGroup {sortColumn === "WorkGroup" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CaseStatus")}>
                Case Status {sortColumn === "CaseStatus" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((caseItem) => (
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
        {filteredCaseTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No cases found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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

export const Assets_table = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // dropdown filters
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductNumber, setSelectedProductNumber] = useState("");
  const [selectedProductLine, setSelectedProductLine] = useState("");

  // state untuk sorting (default sort by ProductNumber ascending)
  const [sortConfig, setSortConfig] = useState({ key: "ProductNumber", direction: "asc" });

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
      console.log("Fetched first page of assets:", first.data.data);
      const firstData = first?.data?.data || [];
      const totalPages = first?.data?.totalPages ?? 1;

      let all = [...firstData];
      for (let p = 2; p <= totalPages; p++) {
        const res = await ApiCustomer.get(`/api/asset-information?page=${p}&limit=${LIMIT}`);
        const more = res?.data?.data || [];
        all = all.concat(more);
      }
      if (totalPages === 1 && Array.isArray(first?.data) && !first?.data?.data) {
        all = first.data;
      }

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
      const haystack = [
        a?.AssetID, a?.SerialNumber, a?.SiteAccountID, a?.ContactID,
        pn, pl, num
      ].map(v => (v ?? "").toString().toLowerCase()).join(" ");
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

      // Try to treat as numbers if both are numeric
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
  }, [sortedAssets, currentPage]);

  // handle sort on header click
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const resetFilters = () => {
    setSelectedProductName("");
    setSelectedProductNumber("");
    setSelectedProductLine("");
    setSearchTerm("");
    setCurrentPage(1);
    setSortConfig({ key: "ProductNumber", direction: "asc" }); // reset ke default
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Asset Information Table</h2>

      {/* Search + Reset */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search asset..."
          className="p-2 border border-gray-300 rounded min-w-[220px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={resetFilters}
          className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Reset Filter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
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
      </div>

      {error && <p className="mb-2 text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              {[
                { key: "no", label: "No" },
                { key: "AssetID", label: "Asset ID" },
                { key: "SerialNumber", label: "Serial Number" },
                { key: "ProductName", label: "Product Name" },
                { key: "ProductNumber", label: "Product Number" },
                { key: "ProductLine", label: "Product Line" },
                { key: "SiteAccountID", label: "Site Account ID" },
                { key: "ContactID", label: "Contact ID" },
              ].map(col => (
                <th
                  key={col.key}
                  className={`p-2 border ${col.key !== "no" ? "cursor-pointer hover:bg-gray-300" : ""}`}
                  onClick={() => col.key !== "no" && handleSort(col.key)}
                >
                  {col.label}
                  {sortConfig.key === col.key && (
                    <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
              ))}
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="p-4 text-center">Loading...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((a, idx) => (
                <tr key={a.AssetID} className="hover:bg-gray-100">
                  <td className="p-2 text-center border">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="p-2 border">{a.AssetID}</td>
                  <td className="p-2 border">{a.SerialNumber}</td>
                  <td className="p-2 border">{a?.product_information?.ProductName}</td>
                  <td className="p-2 border">{a?.ProductNumber}</td>
                  <td className="p-2 border">{a?.product_information?.ProductLine}</td>
                  <td className="p-2 border">{a.SiteAccountID}</td>
                  <td className="p-2 border">{a.ContactID}</td>
                  <td className="flex p-2 gap-2 border">
                    <AssetEdit assetId={a.AssetID} onUpdate={fetchAllAssets} />
                    <AssetDelete assetId={a.AssetID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="p-4 text-center">No data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 gap-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >Next</button>
        </div>
      )}
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
  const itemsPerPage = 10;

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
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="inline ml-1" />;
    return sortConfig.direction === "asc" 
      ? <ArrowUp size={14} className="inline ml-1" /> 
      : <ArrowDown size={14} className="inline ml-1" />;
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
  const uniqueLines = useMemo(() => ["", ...new Set(products.map(p => p?.ProductLine).filter(Boolean)).values()], [products]);
  const uniqueTypes = useMemo(() => ["", ...new Set(products.map(p => p?.product_type?.ProductType).filter(Boolean)).values()], [products]);
  const uniqueGroups = useMemo(() => ["", ...new Set(products.map(p => p?.product_type?.ProductGroup).filter(Boolean)).values()], [products]);
  const uniqueTowers = useMemo(() => ["", ...new Set(products.map(p => p?.product_type?.ProductTower).filter(Boolean)).values()], [products]);

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

      const fLine  = !selectedLine  || line === selectedLine;
      const fType  = !selectedType  || type === selectedType;
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
  }, [sortedProducts, currentPage]);

  const resetFilters = () => {
    setSelectedLine("");
    setSelectedType("");
    setSelectedGroup("");
    setSelectedTower("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Product Table</h2>

      {/* Search & Add */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ProductAdd onAdded={fetchAllProducts} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <select className="p-2 border rounded" value={selectedLine} onChange={(e) => setSelectedLine(e.target.value)}>
          <option value="">All Product Line</option>
          {uniqueLines.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">All Product Type</option>
          {uniqueTypes.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">All Product Group</option>
          {uniqueGroups.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <select className="p-2 border rounded" value={selectedTower} onChange={(e) => setSelectedTower(e.target.value)}>
          <option value="">All Product Tower</option>
          {uniqueTowers.map(v => <option key={v} value={v}>{v || "—"}</option>)}
        </select>
        <button onClick={resetFilters} className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Reset Filter</button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">No</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductNumber")}>
                Product Number {getSortIcon("ProductNumber")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductLine")}>
                Product Line {getSortIcon("ProductLine")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductName")}>
                Product Name {getSortIcon("ProductName")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductType")}>
                Product Type {getSortIcon("ProductType")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductGroup")}>
                Product Group {getSortIcon("ProductGroup")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ProductTower")}>
                Product Tower {getSortIcon("ProductTower")}
              </th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="p-4 text-center">Loading...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((p, idx) => (
                <tr key={p.ProductNumber} className="hover:bg-gray-100">
                  <td className="p-2 text-center border">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="p-2 border">{p.ProductNumber}</td>
                  <td className="p-2 border">{p.ProductLine}</td>
                  <td className="p-2 border">{p.ProductName}</td>
                  <td className="p-2 border">{p.product_type?.ProductType}</td>
                  <td className="p-2 border">{p.product_type?.ProductGroup}</td>
                  <td className="p-2 border">{p.product_type?.ProductTower}</td>
                  <td className="p-2 border">-</td>
                  <td className="flex p-2 gap-2 border">
                    <ProductEdit ProductNumber={p.ProductNumber} onUpdate={fetchAllProducts} />
                    <ProductDelete ProductNumber={p.ProductNumber} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onUpdate={fetchAllProducts}/>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="p-4 text-center">No data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPagesLocal > 1 && (
        <div className="flex items-center justify-center mt-4 gap-2">
          <button className="p-2 bg-gray-300 rounded disabled:opacity-50" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPagesLocal}</span>
          <button className="p-2 bg-gray-300 rounded disabled:opacity-50" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPagesLocal))} disabled={currentPage === totalPagesLocal}>
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
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ProductTypeData, setProductTypeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/product-type");
      if (response.data.success) {
        setProductTypeData(response.data.data);
        Swal.close();
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

      Swal.close();
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

  useEffect(() => {
    fetchProductTypeDataTable();
  }, []);

  // 🔍 Filter data
  const filteredProductTypeTable = ProductTypeData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 🔽 Sorting function
  const sortedData = [...filteredProductTypeTable].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    let aValue = a[key];
    let bValue = b[key];

    // Pastikan angka tetap numerik
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

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // 🔹 Render icon sort
  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="inline w-4 h-4 ml-1" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">ProductType Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ProductTypeAdd />

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th
                className="p-2 border cursor-pointer"
                onClick={() => requestSort("ProductTypeID")}
              >
                ProductType ID {renderSortArrow("ProductTypeID")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => requestSort("ProductTower")}
              >
                Product Tower {renderSortArrow("ProductTower")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => requestSort("ProductGroup")}
              >
                Product Group {renderSortArrow("ProductGroup")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => requestSort("ProductType")}
              >
                Product Type {renderSortArrow("ProductType")}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ProductTypeItem) => (
              <tr
                key={ProductTypeItem.ProductTypeID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/app/case/${ProductTypeItem.ProductTypeID}`)
                  }
                >
                  {ProductTypeItem.ProductTypeID}
                </td>
                <td className="p-2 border">{ProductTypeItem.ProductTower}</td>
                <td className="p-2 border">{ProductTypeItem.ProductGroup}</td>
                <td className="p-2 border">{ProductTypeItem.ProductType}</td>
                <td className="flex p-2 space-x-2 border">
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
        {sortedData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [WarrantyServiceData, setWarrantyServiceData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default sorting by Service_offerID ascending
  const [sortConfig, setSortConfig] = useState({
    key: "Service_offerID",
    direction: "asc",
  });

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
        Swal.close();
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

      Swal.close();
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

  useEffect(() => {
    fetchWarrantyServiceDataTable();
  }, []);

  // Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (!isNaN(valA) && !isNaN(valB)) {
        return sortConfig.direction === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      return sortConfig.direction === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="inline w-4 h-4" />;
    if (sortConfig.direction === "asc") return <ArrowUp className="inline w-4 h-4" />;
    return <ArrowDown className="inline w-4 h-4" />;
  };

  // Filter data
  const filteredWarrantyServiceTable = WarrantyServiceData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply sorting
  const sortedData = getSortedData(filteredWarrantyServiceTable);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Warranty Service Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <WarrantyServiceAdd />

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Service_offerID")}>
                Service offerID {renderSortIcon("Service_offerID")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Service_description")}>
                Service description {renderSortIcon("Service_description")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CTat_RTime")}>
                Customer Tat {renderSortIcon("CTat_RTime")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Price")}>
                Price {renderSortIcon("Price")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Shipping_Fee")}>
                Shipping Fee {renderSortIcon("Shipping_Fee")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("qty_ws")}>
                Quantity {renderSortIcon("qty_ws")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Tax")}>
                Tax {renderSortIcon("Tax")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Total")}>
                Total {renderSortIcon("Total")}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((WarrantyServiceItem) => (
              <tr
                key={WarrantyServiceItem.Service_offerID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/app/case/${WarrantyServiceItem.Service_offerID}`)
                  }
                >
                  {WarrantyServiceItem.Service_offerID}
                </td>
                <td className="p-2 border">{WarrantyServiceItem.Service_description}</td>
                <td className="p-2 border">{WarrantyServiceItem.CTat_RTime}</td>
                <td className="p-2 border">{WarrantyServiceItem.Price}</td>
                <td className="p-2 border">{WarrantyServiceItem.Shipping_Fee}</td>
                <td className="p-2 border">{WarrantyServiceItem.qty_ws}</td>
                <td className="p-2 border">{WarrantyServiceItem.Tax}</td>
                <td className="p-2 border">{WarrantyServiceItem.Total}</td>
                <td className="flex p-2 space-x-2 border">
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
            ))}
          </tbody>
        </table>
        {filteredWarrantyServiceTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      <div className="flex items-center justify-center mt-4 space-x-2">
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

export const Mo_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [MaterialOrderData, setMaterialOrderData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Filter
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // 🔹 Sorting state (default sort by MOID ascending)
  const [sortConfig, setSortConfig] = useState({
    key: "MOID",
    direction: "asc",
  });

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
        Swal.close();
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

  useEffect(() => {
    fetchMaterialOrderDataTable();
  }, []);

  // 🔹 Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      // numeric check
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return sortConfig.direction === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      // string fallback
      return sortConfig.direction === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  };

  // 🔹 Filter data
  const filteredMaterialOrderTable = MaterialOrderData.filter((item) => {
    const matchesSearch = Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = selectedStatus
      ? item.OrderStatus === selectedStatus
      : true;

    const matchesType = selectedType ? item.OrderType === selectedType : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  // 🔹 Apply sorting
  const sortedData = getSortedData(filteredMaterialOrderTable);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // 🔹 Dropdown values
  const uniqueStatuses = [
    ...new Set(MaterialOrderData.map((item) => item.OrderStatus)),
  ];
  const uniqueTypes = [
    ...new Set(MaterialOrderData.map((item) => item.OrderType)),
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedType("");
    setCurrentPage(1);
  };

  // 🔹 Sort Icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={16} />;
    if (sortConfig.direction === "asc") return <ArrowUp size={16} />;
    return <ArrowDown size={16} />;
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Material Order Table</h2>

      {/* Search */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Select + Reset */}
      <div className="flex items-center mb-4 space-x-4">
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded"
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
          className="p-2 border rounded"
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
          className="px-4 py-2 text-white bg-gray-500 rounded"
        >
          Reset Filters
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table (❗struktur tetap, hanya th dibuat bisa klik sort) */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("MOID")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>MO ID</span>
                  {renderSortIcon("MOID")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("WOID")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>WO ID</span>
                  {renderSortIcon("WOID")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("OrderNumber")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Order Number</span>
                  {renderSortIcon("OrderNumber")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("OrderStatus")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Order Status</span>
                  {renderSortIcon("OrderStatus")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("OrderType")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Order Type</span>
                  {renderSortIcon("OrderType")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("CreatedOn")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Created On</span>
                  {renderSortIcon("CreatedOn")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("SalesOrderNumber")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Sales Order Number</span>
                  {renderSortIcon("SalesOrderNumber")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("RMANumber")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>RMA Number</span>
                  {renderSortIcon("RMANumber")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("ReadyForClosureDate")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Ready For Closure Date</span>
                  {renderSortIcon("ReadyForClosureDate")}
                </div>
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("Owner")}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Owner</span>
                  {renderSortIcon("Owner")}
                </div>
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((MaterialOrderItem) => (
              <tr
                key={MaterialOrderItem.MOID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/app/material-order/${MaterialOrderItem.MOID}`)
                  }
                >
                  {MaterialOrderItem.MOID}
                </td>
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/app/work/${MaterialOrderItem.WOID}`)
                  }
                >
                  {MaterialOrderItem.WOID}
                </td>
                <td className="p-2 border">{MaterialOrderItem.OrderNumber}</td>
                <td className="p-2 border">{MaterialOrderItem.OrderStatus}</td>
                <td className="p-2 border">{MaterialOrderItem.OrderType}</td>
                <td className="p-2 border">{MaterialOrderItem.CreatedOn}</td>
                <td className="p-2 border">
                  {MaterialOrderItem.SalesOrderNumber}
                </td>
                <td className="p-2 border">{MaterialOrderItem.RMANumber}</td>
                <td className="p-2 border">
                  {MaterialOrderItem.ReadyForClosureDate}
                </td>
                <td className="p-2 border">{MaterialOrderItem.Owner}</td>
                <td className="flex p-2 space-x-2 border">
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
        {sortedData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [WorkOrderData, setWorkOrderData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchWorkOrderDataTable();
  }, []);

  // 🔹 ambil unique values untuk dropdown
  const uniqueWorkOrderType = [...new Set(WorkOrderData.map((d) => d.WorkOrderType))];
  const uniqueSystemStatus = [...new Set(WorkOrderData.map((d) => d.SystemStatus))];
  const uniqueShipmentCountry = [...new Set(WorkOrderData.map((d) => d.ShipmentCountry))];
  const uniqueShipmentState = [...new Set(WorkOrderData.map((d) => d.ShipmentState))];
  const uniqueOwner = [...new Set(WorkOrderData.map((d) => d.Owner))];

  // 🔹 Filter data
  const filteredWorkOrderTable = WorkOrderData.filter((item) => {
    const matchSearch = Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

  // 🔹 Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return sortConfig.direction === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      return sortConfig.direction === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  };

  // 🔹 Apply sorting
  const sortedData = getSortedData(filteredWorkOrderTable);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  // 🔹 Sort Icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={16} />;
    if (sortConfig.direction === "asc") return <ArrowUp size={16} />;
    return <ArrowDown size={16} />;
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Work Order Table</h2>

      {/* 🔹 Search */}
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 border rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🔹 Filters */}
      {/* ... filter select sama seperti sebelumnya ... */}

      {error && <p className="text-red-500">{error}</p>}

      {/* Table with sorting */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("WOID")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>WOID</span>
                  {renderSortIcon("WOID")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CaseID")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Case ID</span>
                  {renderSortIcon("CaseID")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("WorkOrderType")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Work Order Type</span>
                  {renderSortIcon("WorkOrderType")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Priority")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Priority</span>
                  {renderSortIcon("Priority")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SystemStatus")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>System Status</span>
                  {renderSortIcon("SystemStatus")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SubStatus")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Sub Status</span>
                  {renderSortIcon("SubStatus")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("PreferredDay")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Preferred Day</span>
                  {renderSortIcon("PreferredDay")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("PreferredTime")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Preferred Time</span>
                  {renderSortIcon("PreferredTime")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ShipmentCountry")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Shipment Country</span>
                  {renderSortIcon("ShipmentCountry")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ShipmentState")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Shipment State</span>
                  {renderSortIcon("ShipmentState")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CreatedOn")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Created On</span>
                  {renderSortIcon("CreatedOn")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Owner")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Owner</span>
                  {renderSortIcon("Owner")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SLAJeopardy")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>SLAJeopardy</span>
                  {renderSortIcon("SLAJeopardy")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("DueDateCustomer")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>DueDate Customer</span>
                  {renderSortIcon("DueDateCustomer")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CoverageWindow")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Coverage Window</span>
                  {renderSortIcon("CoverageWindow")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Response")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Response</span>
                  {renderSortIcon("Response")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("OTCCode")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>OTCCode</span>
                  {renderSortIcon("OTCCode")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("RequestedDateTimeCustomer")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Requested DateTime Customer</span>
                  {renderSortIcon("RequestedDateTimeCustomer")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("GuaranteedFixTimeCustomer")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Guaranteed FixTime Customer</span>
                  {renderSortIcon("GuaranteedFixTimeCustomer")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("EarlyStartDateTimeCustomer")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Early Start DateTime Customer</span>
                  {renderSortIcon("EarlyStartDateTimeCustomer")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("LatestStartDateTimeCustomer")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Latest Start DateTime Customer</span>
                  {renderSortIcon("LatestStartDateTimeCustomer")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SLAReschedule")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>SLAReschedule</span>
                  {renderSortIcon("SLAReschedule")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ActiveScheduleDate")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Active Schedule Date</span>
                  {renderSortIcon("ActiveScheduleDate")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("SLAErrorDescription")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>SLA Error Description</span>
                  {renderSortIcon("SLAErrorDescription")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CasePriorityIndex")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Case Priority Index</span>
                  {renderSortIcon("CasePriorityIndex")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("PartnerStatus")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Partner Status</span>
                  {renderSortIcon("PartnerStatus")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("WorkOrderDescription")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>WorkOrder Description</span>
                  {renderSortIcon("WorkOrderDescription")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("PartnerNotes")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>PartnerNotes</span>
                  {renderSortIcon("PartnerNotes")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("IncomingChannel")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Incoming Channel</span>
                  {renderSortIcon("IncomingChannel")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("MaterialOrder")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Material Order</span>
                  {renderSortIcon("MaterialOrder")}
                </div>
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CaseInformation")}>
                <div className="flex items-center justify-center space-x-1">
                  <span>Case Information</span>
                  {renderSortIcon("CaseInformation")}
                </div>
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((WorkOrderItem) => (
              <tr key={WorkOrderItem.WOID} className="text-center hover:bg-gray-100">
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
                <td className="flex p-2 space-x-2 border">
                  <WorkOrderEdit WOID={WorkOrderItem.WOID} onUpdate={fetchWorkOrderDataTable} />
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
        {sortedData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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
      <h2 className="mb-4 text-xl font-bold">User Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <UserAdd></UserAdd>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">ID User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Profil Photo</th>
              <th className="p-2 border">CreatedAt</th>
              <th className="p-2 border">UpdateAt</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((UserItem) => (
              <tr
                key={UserItem.IDUser}
                className="text-center hover:bg-gray-100"
              >
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                  {UserItem.IDUser}
                </td>
                <td className="p-2 border">{UserItem.Email}</td>
                <td className="p-2 border">{UserItem.Username}</td>
                <td className="p-2 border">{UserItem.Name}</td>
                <td className="p-2 border">{UserItem.Role}</td>
                <td className="p-2 border">{UserItem.ProfilPhoto}</td>
                <td className="p-2 border">{UserItem.CreatedAt}</td>
                <td className="p-2 border">{UserItem.UpdatedAt}</td>
                <td className="flex p-2 space-x-2 border">
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
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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
      <h2 className="mb-4 text-xl font-bold">Part Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <PartAdd/>
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">PartNumber</th>
              <th className="p-2 border"> Keyword </th>
              <th className="p-2 border">PartDescription </th>
              <th className="p-2 border">Orderability</th>
              <th className="p-2 border">RestrictionReason</th>
              <th className="p-2 border">CSR_Flag</th>
              <th className="p-2 border"> ROHS Flag </th>
              <th className="p-2 border">Returnable Flag</th>
              <th className="p-2 border">HardRoll Flag</th>
              <th className="p-2 border">DangerousGoods Flag</th>
              <th className="p-2 border">LithiumBattery Flag</th>
              <th className="p-2 border">Oversize Flag </th>
              <th className="p-2 border">Heavy Flag </th>
              <th className="p-2 border">Price </th>
              <th className="p-2 border">FreightPrice </th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Shipping_Fee</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((PartItem) => (
              <tr
                key={PartItem.PartNumber}
                className="text-center hover:bg-gray-100"
              >
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
                <td className="flex p-2 space-x-2 border">
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
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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
      <h2 className="mb-4 text-xl font-bold">Resource Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ResourceAdd/>  
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Resource ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ResourceItem) => (
              <tr
                key={ResourceItem.ResourceId}
                className="text-center hover:bg-gray-100"
              >
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                  {ResourceItem.ResourceId}
                </td>
                <td className="p-2 border">{ResourceItem.Name}</td>
                <td className="flex p-2 space-x-2 border">
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
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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
  const [resourceFilter, setResourceFilter] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resourceAccounts, setResourceAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState([]);

  // SORTING STATE
  const [sortConfig, setSortConfig] = useState({ key: "ResourceAccountId", direction: "asc" });

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
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="inline ml-1" />;
    return sortConfig.direction === "asc" 
      ? <ArrowUp size={14} className="inline ml-1" /> 
      : <ArrowDown size={14} className="inline ml-1" />;
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
  const uniqueResourceIds = [
    ...new Set(resourceAccounts.map((item) => item.ResourceId).filter((v) => v))
  ];

  // Filtering logic
  const filteredAccounts = resourceAccounts.filter((item) => {
    const matchSearch = Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchResource = !resourceFilter || item.ResourceId === resourceFilter;
    return matchSearch && matchResource;
  });

  // SORTING applied di sini
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

  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);
  const currentData = sortedAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Resource Accounts</h2>

      {/* Search + Add button */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <ResourceAccountAdd onAdd={fetchResourceAccounts} />
      </div>

      {/* Filter ResourceId + Reset */}
      <div className="flex items-center gap-2 mb-4">
        <select
          className="p-2 border rounded"
          value={resourceFilter}
          onChange={(e) => {
            setResourceFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Resource IDs</option>
          {uniqueResourceIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>

        <button
          className="p-2 text-white bg-gray-500 rounded"
          onClick={() => {
            setSearchTerm("");
            setResourceFilter("");
            setCurrentPage(1);
          }}
        >
          Reset Filter
        </button>
      </div>

      {loading && <p>Loading accounts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ResourceAccountId")}>
                Resource Account ID {getSortIcon("ResourceAccountId")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Name")}>
                Name {getSortIcon("Name")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ResourceId")}>
                Resource ID {getSortIcon("ResourceId")}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((account) => (
              <tr key={account.ResourceAccountId} className="text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/app/resource-account/${account.ResourceAccountId}`)
                  }
                >
                  {account.ResourceAccountId}
                </td>
                <td className="p-2 border">{account.Name}</td>
                <td className="p-2 border">{account.ResourceId || "-"}</td>
                <td className="flex justify-center p-2 space-x-2 border">
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
        {sortedAccounts.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No accounts found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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


export const SubkTechnician_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceAccountFilter, setResourceAccountFilter] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subkTechnicianData, setSubkTechnicianData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔽 STATE SORTING
  const [sortConfig, setSortConfig] = useState({ key: "SubkTechnicianId", direction: "asc" });

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
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="inline ml-1" />;
    return sortConfig.direction === "asc" 
      ? <ArrowUp size={14} className="inline ml-1" /> 
      : <ArrowDown size={14} className="inline ml-1" />;
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
  const uniqueResourceAccounts = [
    ...new Set(
      subkTechnicianData
        .map((item) => item.resourceAccount?.Name)
        .filter((v) => v)
    ),
  ];

  // Filtering logic (search + filter resource account)
  const filteredData = subkTechnicianData.filter((item) => {
    const matchSearch = Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchResource =
      !resourceAccountFilter ||
      item.resourceAccount?.Name === resourceAccountFilter;

    return matchSearch && matchResource;
  });

  // 🔽 APPLY SORTING DI SINI
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

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Subk Technician Table</h2>

      {/* Search + Add Button (row 1) */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <SubkTechnicianAdd onUpdate={fetchSubkTechnicianData} />
      </div>

      {/* Filter + Reset (row 2) */}
      <div className="flex items-center gap-2 mb-4">
        <select
          className="p-2 border rounded"
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
          className="p-2 text-white bg-gray-500 rounded"
          onClick={() => {
            setSearchTerm("");
            setResourceAccountFilter("");
            setCurrentPage(1);
          }}
        >
          Reset Filter
        </button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("SubkTechnicianId")}
              >
                Subk Technician ID {getSortIcon("SubkTechnicianId")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("Name")}
              >
                Name {getSortIcon("Name")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("ResourceAccount")}
              >
                Resource Account {getSortIcon("ResourceAccount")}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.SubkTechnicianId}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/app/subk-technician/${item.SubkTechnicianId}`)
                  }
                >
                  {item.SubkTechnicianId}
                </td>
                <td className="p-2 border">{item.Name}</td>
                <td className="p-2 border">
                  {item.resourceAccount?.Name || "N/A"}
                </td>
                <td className="flex justify-center p-2 space-x-2 border">
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
            ))}
          </tbody>
        </table>
        {sortedData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">
            No entries found.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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

export const SymptomCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptomCodeData, setSymptomCodeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Default sort pada SymptomCodeID ascending
  const [sortConfig, setSortConfig] = useState({ key: "SymptomCodeID", direction: "asc" });

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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = symptomCodeData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue instanceof Date || !isNaN(Date.parse(aValue))) {
      return sortConfig.direction === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Symptom Code Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SymptomCodeAdd onUpdate={fetchSymptomCodeData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("SymptomCodeID")}
              >
                Symptom Code ID {renderSortArrow("SymptomCodeID")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("SymptomCode")}
              >
                Symptom Code {renderSortArrow("SymptomCode")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("TopCategory")}
              >
                Top Category {renderSortArrow("TopCategory")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("SubCategory")}
              >
                Sub Category {renderSortArrow("SubCategory")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("QualityCodes")}
              >
                Quality Codes {renderSortArrow("QualityCodes")}
              </th>
              <th
                className="p-2 border cursor-pointer"
                onClick={() => handleSort("CreatedOn")}
              >
                Created On {renderSortArrow("CreatedOn")}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.SymptomCodeID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/app/symptom-code/${item.SymptomCodeID}`)
                  }
                >
                  {item.SymptomCodeID}
                </td>
                <td className="p-2 border">{item.SymptomCode}</td>
                <td className="p-2 border">{item.TopCategory}</td>
                <td className="p-2 border">{item.SubCategory}</td>
                <td className="p-2 border">{item.QualityCodes || "N/A"}</td>
                <td className="p-2 border">
                  {new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="flex justify-center p-2 space-x-2 border">
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
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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


export const BookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // filters
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedJeopardy, setSelectedJeopardy] = useState("");
  const [selectedCreatedBy, setSelectedCreatedBy] = useState("");

  // sort config (default: BookingId DESC)
  const [sortConfig, setSortConfig] = useState({
    key: "BookingId",
    direction: "asc",
  });

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
  const filteredData = bookingData.filter((item) => {
    const status = item.BookingStatus ?? "";
    const jeopardy = item.ScheduleJeopardy ? "Yes" : "No";
    const createdBy = item.createdByUser?.Username ?? "";

    const fStatus = !selectedStatus || status === selectedStatus;
    const fJeopardy = !selectedJeopardy || jeopardy === selectedJeopardy;
    const fCreated = !selectedCreatedBy || createdBy === selectedCreatedBy;
    if (!(fStatus && fJeopardy && fCreated)) return false;

    // search
    const haystack = Object.values(item).join(" ").toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

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

  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Bookings Table</h2>

      {/* Search & Add */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <BookingsAdd onUpdate={fetchBookingData} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="p-2 border rounded"
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
          className="p-2 border rounded"
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
          className="p-2 border rounded"
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
          className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Reset Filter
        </button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("BookingId")}>
                Booking ID {getSortSymbol("BookingId")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("WOID")}>
                WOID {getSortSymbol("WOID")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("BookingStatus")}>
                Status {getSortSymbol("BookingStatus")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ScheduleJeopardy")}>
                Schedule Jeopardy {getSortSymbol("ScheduleJeopardy")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("ScheduleJeopardyTime")}>
                Jeopardy Time {getSortSymbol("ScheduleJeopardyTime")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("DoNotDisturb")}>
                Do Not Disturb {getSortSymbol("DoNotDisturb")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CeScheduleChange")}>
                CE Schedule Change {getSortSymbol("CeScheduleChange")}
              </th>
              <th className="p-2 border">Durations (min)</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("Username")}>
                Created By {getSortSymbol("Username")}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("CreatedAt")}>
                Created At {getSortSymbol("CreatedAt")}
              </th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.BookingId} className="text-center hover:bg-gray-100">
                  <td
                    className="p-2 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/bookings/${item.BookingId}`)}
                  >
                    {item.BookingId}
                  </td>
                  <td className="p-2 border">{item.WOID}</td>
                  <td className="p-2 border">{item.BookingStatus || "-"}</td>
                  <td className="p-2 border">{item.ScheduleJeopardy ? "Yes" : "No"}</td>
                  <td className="p-2 border">
                    {item.ScheduleJeopardyTime
                      ? new Date(item.ScheduleJeopardyTime).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="p-2 border">{item.DoNotDisturb ? "Yes" : "No"}</td>
                  <td className="p-2 border">{item.CeScheduleChange ? "Yes" : "No"}</td>
                  <td className="p-2 border">
                    Total Billable: {item.TotalBillableDurationInMinutes || 0} <br />
                    Total In Progress: {item.TotalInProgressDurationInMinutes || 0} <br />
                    Total Break: {item.TotalBreakDurationInMinutes || 0}
                  </td>
                  <td className="p-2 border">{item.createdByUser?.Username || "-"}</td>
                  <td className="p-2 border">
                    {new Date(item.CreatedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="flex justify-center p-2 space-x-2 border">
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
                <td colSpan="11" className="p-4 text-center">
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
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
      )}
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

  // filters
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedChangedBy, setSelectedChangedBy] = useState("");

  const fetchBookingDetails = async () => {
    Swal.fire({
      title: "Memuat Data Booking Details...",
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
      const response = await ApiCustomer.get("/api/bookingDetails");
      if (response.data.success) {
        console.log("Data Response Booking", response.data.data);
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
    const all = bookingDetailsData.map(b => b.Status).filter(Boolean);
    return ["", ...Array.from(new Set(all)).sort()];
  }, [bookingDetailsData]);

  const uniqueChangedBy = useMemo(() => {
    const all = bookingDetailsData.map(b => b.ChangedBy).filter(Boolean);
    console.log("Data Response Changed By", all);
    return ["", ...Array.from(new Set(all)).sort()];
  }, [bookingDetailsData]);

  // filter + search
  const filteredData = bookingDetailsData.filter((item) => {
    const status = item.Status ?? "";
    const ChangedBy = item.ChangedBy ?? "";
    
    const fStatus = !selectedStatus || status === selectedStatus;
    const fChangedBy = !selectedChangedBy || ChangedBy === parseInt(selectedChangedBy);
    console.log(item.ChangedBy, selectedChangedBy, fChangedBy)
//  console.log( "Created By", ChangedBy);
    if (!(fStatus && fChangedBy)) return false;

    // search
    const haystack = Object.values(item).join(" ").toLowerCase();
    // console.log("haystack", item);
    return haystack.includes(searchTerm.toLowerCase());
    
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedChangedBy("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Booking Details Table</h2>

      {/* Search & Add */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full sm:w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <BookingDetailsAdd onUpdate={fetchBookingDetails} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="p-2 border rounded"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          {uniqueStatus.map((v) => (
            <option key={v} value={v}>{v || "—"}</option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedChangedBy}
          onChange={(e) => {
            setSelectedChangedBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Changed By</option>
          {uniqueChangedBy.map((v) => (
            <option key={v} value={v}>{v || "—"}</option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
          Reset Filter
        </button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm text-center">
              <th className="border p-2">Booking Detail ID</th>
              <th className="border p-2">Booking ID</th>
              <th className="border p-2">Resource ID</th>
              <th className="border p-2">Resource Account ID</th>
              <th className="border p-2">Subk Technician ID</th>
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
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.BookingDetailId} className="hover:bg-gray-100 text-center text-sm">
                  <td className="border p-2 text-blue-500 cursor-pointer hover:underline"
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
                    <div>Start: {item.StartTimeCustomerTime ? new Date(item.StartTimeCustomerTime).toLocaleString() : "-"}</div>
                    <div>End: {item.EndTimeCustomerTime ? new Date(item.EndTimeCustomerTime).toLocaleString() : "-"}</div>
                    <div>Est. Arrival: {item.EstimatedArrivalTimeCustomerTime ? new Date(item.EstimatedArrivalTimeCustomerTime).toLocaleString() : "-"}</div>
                    <div>Actual Arrival: {item.ActualArrivalTimeCustomerTime ? new Date(item.ActualArrivalTimeCustomerTime).toLocaleString() : "-"}</div>
                  </td>

                  <td className="p-2 text-left border">
                    <div>Start: {item.StartTimeUserTime ? new Date(item.StartTimeUserTime).toLocaleString() : "-"}</div>
                    <div>End: {item.EndTimeUserTime ? new Date(item.EndTimeUserTime).toLocaleString() : "-"}</div>
                    <div>Duration: {item.DurationInMinutesUserTime || 0} min</div>
                    <div>Est. Arrival: {item.EstimatedArrivalTimeUserTime ? new Date(item.EstimatedArrivalTimeUserTime).toLocaleString() : "-"}</div>
                    <div>Actual Arrival: {item.ActualArrivalTimeUserTime ? new Date(item.ActualArrivalTimeUserTime).toLocaleString() : "-"}</div>
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
              <tr><td colSpan="12" className="p-4 text-center">No entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
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
      )}
    </div>
  );
};

export const RepairClassCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const filteredData = data.filter((item) =>
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
      <h2 className="text-xl font-bold mb-4">Repair Class Code Table</h2>

      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <RepairClassCodeAdd onUpdate={fetchData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm text-center">
              <th className="border p-2">Code</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Definition</th>
              <th className="border p-2">Payment Eligibility</th>
              <th className="border p-2">Created On</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.Code} className="hover:bg-gray-100 text-center text-sm">
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

export const ServiceCatalogTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceCatalogData, setServiceCatalogData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const filteredData = serviceCatalogData.filter((item) =>
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
      <h2 className="text-xl font-bold mb-4">Service Catalog Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Add Component (Optional) */}
      <ServiceCatalogAdd onUpdate={fetchServiceCatalog} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm text-center">
              <th className="border p-2">Service Catalog ID</th>
              <th className="border p-2">Asset ID</th>
              <th className="border p-2">Service Offer ID</th>
              <th className="border p-2">Part Number</th>
              <th className="border p-2">Warranty Status</th>
              <th className="border p-2">Currency</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Tax</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.ServiceCatalogID} className="hover:bg-gray-100 text-center text-sm">
                <td className="border p-2 text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/app/service-log/${item.ServiceCatalogID}`)}
                >
                  {item.ServiceCatalogID}
                </td>
                <td className="border p-2">{item.AssetID}</td>
                <td className="border p-2">{item.Service_offerID}</td>
                <td className="border p-2">{item.PartNumber || "-"}</td>
                <td className="border p-2">{item.WarrantyStatus || "-"}</td>
                <td className="border p-2">{item.Currency || "-"}</td>
                <td className="border p-2">{item.Price ? parseFloat(item.Price).toFixed(2) : "-"}</td>
                <td className="border p-2">{item.Tax ? parseFloat(item.Tax).toFixed(2) : "-"}</td>
                <td className="border p-2">{item.Total ? parseFloat(item.Total).toFixed(2) : "-"}</td>
                <td className="border p-2 flex justify-center gap-2">
                  {/* Optional Edit/Delete Components */}
                  <ServiceCatalogEdit ServiceCatalogID={item.ServiceCatalogID} onUpdate={fetchServiceCatalog} />
                  <ServiceCatalogDelete ServiceCatalogID={item.ServiceCatalogID} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onUpdate={fetchServiceCatalog} />
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

export const OTCCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otcCodeData, setOTCCodeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const filteredData = otcCodeData.filter((item) =>
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
      <h2 className="text-xl font-bold mb-4">OTC Codes Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <OTCAdd onUpdate={fetchOTCCode} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">OTC Code</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.OTCCode} className="hover:bg-gray-100 text-center">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  // onClick={() => navigate(`/app/bookings/${item.BookingId}`)}
                >
                  {item.OTCCode}
                </td>
                <td className="p-2 border">{item.Description}</td>
                <td className="p-2 border">
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
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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

export const CrsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [CrsData, setCrsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCrs = async () => {
    Swal.fire({
      title: "Memuat Data CRS",
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
      const response = await ApiCustomer.get("/api/caseResolution");
      if (response.data.success) {
        setCrsData(response.data.data);
      } else {
        setError("Failed to fetch crs data");
      }
    } catch (err) {
      console.error("Error fetching crs data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };


  useEffect(() => {
    fetchCrs();
  }, []);

  const filteredData = CrsData.filter((item) =>
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
      <h2 className="mb-4 text-xl font-bold">Case Resolution Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    <CrsAdd/>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">ID Csr</th>
              <th className="p-2 border">Case Resolution Code</th>
              <th className="p-2 border">Auto Close</th>
              <th className="p-2 border">Case Ready For Closure</th>
              <th className="p-2 border">Ready For Close Days</th>
              <th className="p-2 border">Ready For Closure Date</th>
              <th className="p-2 border">Pending Customer Action</th>
              <th className="p-2 border">Customer Requested CloseDate</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id_csr} className="text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/app/case-resolution/${item.id_csr}`)}
                > 
                  {item.id_csr}
                </td> 
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  // onClick={() => navigate(`/app/bookings/${item.BookingId}`)}
                >
                  {item.caseResolutionCode}
                </td>
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  // onClick={() => navigate(`/app/bookings/${item.BookingId}`)}
                >
                  {item.autoClose}
                </td>
                <td className="p-2 border">{item.caseReadyForClosure}</td>
                <td className="p-2 border">
                  {new Date(item.readyForCloseDays).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                 <td className="p-2 border">
                  {new Date(item.readyForClosureDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                 <td className="p-2 border">
                  {new Date(item.pendingCustomerAction).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-2 border">
                  {new Date(item.customerRequestedCloseDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
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
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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

export const FailureTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [FailureData, setFailureData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        Swal.close();
      } else {
        setError("Failed to fetch Failure data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Failure.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Failure data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Failure.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchFailureDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredFailureTable = FailureData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredFailureTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredFailureTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Failure Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FailureAdd/>  
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Failure ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((FailureItem) => (
              <tr
                key={FailureItem.FailureId}
                className="text-center hover:bg-gray-100"
              >
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                  {FailureItem.FailureId}
                </td>
                <td className="p-2 border">{FailureItem.Name}</td>
                <td className="p-2 border">{FailureItem.Description}</td>
                <td className="flex p-2 space-x-2 border">
                <FailureEdit FailureId={FailureItem.FailureId} onUpdate={fetchFailureDataTable}></FailureEdit>
                <FailureDelete
                  FailureId={FailureItem.FailureId}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onUpdate={fetchFailureDataTable}                
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFailureTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
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