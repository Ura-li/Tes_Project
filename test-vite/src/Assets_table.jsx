import React from 'react';
export const Assets_table = () => {
  const assetsinfo = [
    {
      AssetID: 201,
      SerialNumber: "SN-123456",
      ProductName: "Laptop Pro X",
      ProductNumber: "LPX-001",
      ProductLine: "Electronics",
      SiteAccountID: 101,
    },
    {
      AssetID: 202,
      SerialNumber: "SN-789012",
      ProductName: "Server Ultra",
      ProductNumber: "SVU-500",
      ProductLine: "Enterprise Hardware",
      SiteAccountID: 102,
    },
    {
      AssetID: 203,
      SerialNumber: "SN-345678",
      ProductName: "Smartphone Elite",
      ProductNumber: "SPE-200",
      ProductLine: "Mobile Devices",
      SiteAccountID: 103,
    },
    {
      AssetID: 204,
      SerialNumber: "SN-901234",
      ProductName: "Industrial Printer",
      ProductNumber: "IPR-800",
      ProductLine: "Printing Solutions",
      SiteAccountID: 104,
    },
    {
      AssetID: 205,
      SerialNumber: "SN-567890",
      ProductName: "Wireless Router",
      ProductNumber: "WR-300",
      ProductLine: "Networking",
      SiteAccountID: 105,
    },
  ];

  return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Assest Information Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Asset ID</th>
                <th className="border p-2">Serial Number</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Product Number</th>
                <th className="border p-2">Product Line</th>
                <th className="border p-2">Site Account ID</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {assetsinfo.map((assets) => (
                <tr key={assets.AssetID} className="hover:bg-gray-100">
                  <td className="border p-2 text-center">{assets.AssetID}</td>
                  <td className="border p-2">{assets.SerialNumber}</td>
                  <td className="border p-2">{assets.ProductName}</td>
                  <td className="border p-2">{assets.ProductNumber}</td>
                  <td className="border p-2">{assets.ProductLine}</td>
                  <td className="border p-2">{assets.SiteAccountID}</td>    
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
);
} 
