import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import ApiCustomer from "@/api";

export function AssetSearchResult({ search, contactId, onSelectAsset }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (!search.SerialNumber && !contactId) return;
    const fetchAssets = async () => {
      try {
        let res;
        if (search.SerialNumber) {
          res = await ApiCustomer.get(`/api/assets?serial=${search.SerialNumber}`);
        } else if (contactId) {
          res = await ApiCustomer.get(`/api/assets?contactId=${contactId}`);
        }
        setAssets(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssets();
  }, [search.SerialNumber, contactId]);

  return (
    <Card>
      <CardHeader>Assets</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial Number</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <TableRow
                  key={asset.AssetID}
                  onClick={() => onSelectAsset(asset)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{asset.SerialNumber}</TableCell>
                  <TableCell>{asset.Model}</TableCell>
                  <TableCell>{asset.Status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No assets found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
