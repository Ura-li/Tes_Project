import React, { useState } from "react";

export const Contact_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Jumlah data per halaman

  const contact = [
  ];

  // Filter data berdasarkan pencarian
  const filteredContact = contact.filter(
    (contact) =>
      contact.Company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.City.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.Country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Contact ID</th>
              <th className="border p-2">SiteAccountID</th>
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
            </tr>
          </thead>
          <tbody>
            {currentData.map((contact) => (
              <tr key={contact.ContactID} className="hover:bg-gray-100">
                <td className="border p-2 text-center">{contact.ContactID}</td>
                <td className="border p-2">{contact.SiteAccountID}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="px-4 py-2 border rounded">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
