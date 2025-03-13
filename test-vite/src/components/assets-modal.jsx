import { Copy } from "lucide-react";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Search } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

//importing API
import ApiCustomer from "@/api";

export function DialogCloseButton({
  isModalAssetOpen,
  setIsModalAssetOpen,
  search,
  setSearch,
}) {
  // console.log(isModalAssetOpen);

  // create search state
  const [searchAsset, setSearchAsset] = useState("");
  const [searchedAssets, setSearchedAssets] = useState([]);

  //creating Asset Data
  const [assets, setAssets] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [siteAccounts, setSiteAccounts] = useState([]);

  //define method
  // const fetchDataAssets = async () => {
  //   //fetch data from API with Axios
  //   await ApiCustomer.get("/api/asset-information").then((response) => {
  //     // console.log("Asset");
  //     // console.log(response.data.data)
  //     //assign response data to state "asset"
  //     setAssets(response.data.data);
  //   });
  // };

  //run hook useEffect
  useEffect(() => {
    //call method
    const fetchDataAssets = async () => {
      try {
        const response = await ApiCustomer.get("/api/asset-information");
        setAssets(response.data.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchDataAssets();
  }, []);

  //filter item

  const filteredAssets = assets.filter(
    (asset) =>
      asset.SerialNumber?.toLowerCase().includes(search.toLowerCase()) ||
      asset.ProductName?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSearchAssets = assets.filter(
    (asset) =>
      asset.SerialNumber?.toLowerCase().includes(searchAsset.toLowerCase()) ||
      asset.ProductName?.toLowerCase().includes(searchAsset.toLowerCase())
  );

  return (
    <Dialog open={isModalAssetOpen} onOpenChange={setIsModalAssetOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
          }}
        >
          Assets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl gap-y-10 shadow-white">
        <DialogHeader>
          <DialogTitle className="mb-5">Assets</DialogTitle>
          <DialogDescription className="text-black  gap-1">
            <span className="flex items-center w-[20em]  gap-2 relative">
              Search Assets
              <Search className="absolute right-1" />
              <Input
                className=" flex-1 ring-2 border-0 rounded-2xl pr-10"
                value={searchAsset}
                onChange={(e) => setSearchAsset(e.target.value)}
              />
            </span>
          </DialogDescription>
        </DialogHeader>

        <Table className="table-fixed border-spacing-0 mx-auto">
          <TableHeader>
            <TableRow className="text-xl bg-blue-200">
              <TableHead>Assets</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Product No</TableHead>
              <TableHead>Product Line</TableHead>
              <TableHead>Site Account ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSearchAssets.length > 0 ? (
              filteredSearchAssets.map((asset) => (
                <TableRow key={asset.AssetID}>
                  <TableCell className="font-medium whitespace-break-spaces">
                    {asset.ProductName}
                  </TableCell>
                  <TableCell>{asset.SerialNumber}</TableCell>
                  <TableCell>{asset.ProductNumber}</TableCell>
                  <TableCell>{asset.ProductLine}</TableCell>
                  <TableCell className="text-right">
                    {asset.SiteAccountID}
                  </TableCell>
                </TableRow>
              ))
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <TableRow key={asset.AssetID}>
                  <TableCell className="font-medium whitespace-break-spaces">
                    {asset.ProductName}
                  </TableCell>
                  <TableCell>{asset.SerialNumber}</TableCell>
                  <TableCell>{asset.ProductNumber}</TableCell>
                  <TableCell>{asset.ProductLine}</TableCell>
                  <TableCell className="text-right">
                    {asset.SiteAccountID}
                  </TableCell>
                </TableRow>
              ))
            ) : assets.length > 0 ? (
              assets.map((asset) => (
                <TableRow key={asset.AssetID}>
                  <TableCell className="font-medium whitespace-break-spaces">
                    {asset.ProductName}
                  </TableCell>
                  <TableCell>{asset.SerialNumber}</TableCell>
                  <TableCell>{asset.ProductNumber}</TableCell>
                  <TableCell>{asset.ProductLine}</TableCell>
                  <TableCell className="text-right">
                    {asset.SiteAccountID}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center font-medium whitespace-break-spaces"
                >
                  Data Belum Tersedia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="secondary">
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
