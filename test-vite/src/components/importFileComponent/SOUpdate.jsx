import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import ApiCustomer from "@/api";
import { formatDateForMySQL } from "../../lib/utils";

import { useAuth } from "@/context/auth-context";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "../ui/input";

export function SOTemplateButton({ target = "" }) {
  const handleDownload = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/import/materialorder?targetStatus=${target}`;
  };

  return (
    <Button
    variant="outline"
      onClick={handleDownload}
      className={
        "dark:bg-gradient-to-b dark:border-2 dark:from-slate-800 dark:via-slate-600 dark:to-slate-700 dark:border-b-slate-600 dark:to-60% dark:via-100% dark:from-50% dark:text-white"
      }
    >
      Download SO Template
    </Button>
  );
}

// ONGOING, NOT FINISHED YET
// -miku21
export function SOImport({ target, dateRMA }) {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [previewStats, setPreviewStats] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  const columns = useMemo(
    () => [
      { key: "index", label: "#" },
      { key: "so", label: "SO No." },
      { key: "rma", label: "RMA No." },
      { key: "ctCode", label: "CT/Part" },
      { key: "awb", label: "AWB" },
      { key: "match", label: "Matched (MO / Case)" },
    ],
    []
  );

  const handleFileUpload = async (e) => {
    const uploaded = e.target.files?.[0];
    setFile(uploaded || null);
    if (uploaded) {
      await handlePreview(uploaded);
    } else {
      setPreviewRows([]);
      setPreviewStats(null);
    }
  };

  const handlePreview = async (uploadedFile = file) => {
    if (!uploadedFile) {
      toast.warning("Upload Excel first to preview.");
      return;
    }
    if (!target) {
      toast.warning("Select target status first.");
      return;
    }

    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("targetStatus", target);

      const response = await ApiCustomer.post(
        "/api/import/materialorder/preview",
        formData
      );
      const payload = response.data;

      if (!payload.success) {
        setPreviewError(payload.message || "Failed to preview file.");
        setPreviewRows([]);
        setPreviewStats(null);
        return;
      }

      setPreviewRows(payload.rows || []);
      setPreviewStats({
        total: payload.totalRows,
        matched: payload.matchedRows,
        missing: payload.missingRows,
      });
    } catch (err) {
      console.error("Preview failed", err);
      setPreviewError("Failed to preview file.");
      setPreviewRows([]);
      setPreviewStats(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.warning("No File Uploaded.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetStatus", target);
    formData.append("dateRMA", formatDateForMySQL(dateRMA));
    formData.append("changedBy", user.id);
    try {
      const response = await ApiCustomer.post(
        "/api/import/materialorder",
        formData
      );
      const result = response.data;

      if (result.success) {
        toast(`${result.message}`);
      } else {
        toast.warning(`${result.message}`);
      }
    } catch (err) {
      toast.warning("Failed to import data");
      console.error(err);
    }
  };

  return (
    <div className="mt-2 flex flex-col items-start space-y-4 w-full">
      <div className="flex items-center space-x-3">
        <Button variant="outline" onClick={() => handlePreview()} className={"dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-600 dark:to-slate-700 dark:border-2 dark:border-b-slate-600 dark:to-60% dark:via-100% dark:from-50% dark:text-white"}>
          {previewLoading ? "Previewing..." : "Preview Import"}
        </Button>
        <Button variant="outline" onClick={handleImport} className={"dark:bg-gradient-to-b dark:from-slate-800 dark:via-slate-600 dark:to-slate-700 dark:border-2 dark:border-b-slate-600 dark:to-60% dark:via-100% dark:from-50% dark:text-white"} >Import Asset Data</Button>
      <Input variant={"outline"} type="file" accept=".xlsx, .xls" onChange={handleFileUpload}/>
      </div>

      {previewError && (
        <div className="text-sm text-red-500">{previewError}</div>
      )}

      {previewStats && (
        <div className="text-xs text-muted-foreground space-x-4">
          <span>Total: {previewStats.total}</span>
          <span>Matched: {previewStats.matched}</span>
          <span>Missing: {previewStats.missing}</span>
        </div>
      )}

      {previewRows.length > 0 && (
        <div className="w-full overflow-auto rounded-md border border-dashed border-slate-300 dark:border-slate-600">
            <Table className="min-w-full border-collapse text-xs sm:text-sm">
            <TableHeader className="sticky z-10 top-0 bg-gray-100/95 dark:bg-slate-800/95">
                <TableRow className="text-slate-800 dark:text-slate-100">
                {columns.map((col) => (
                    <TableHead
                    key={col.key}
                    className="p-3 text-xs font-semibold text-left border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                    >
                    {col.label}
                    </TableHead>
                ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {previewRows.map((row, i) => {
                const inputs = row.inputs || {};
                const matched = row.matched;

                const awb =
                    inputs.awbOut ||
                    inputs.awbIn ||
                    inputs.awb ||
                    inputs.AWB_OutCode ||
                    inputs.AWB_InCode ||
                    "";

                const ctOrPart = inputs.removedSerial || inputs.removedPart || "";

                return (
                    <TableRow
                    key={`${row.index}-${inputs.soNumber || inputs.rmaNumber}`}
                    className={`hover:bg-blue-50/70 dark:hover:bg-slate-700 
                        ${i % 2 === 0 
                        ? "bg-white dark:bg-slate-900" 
                        : "bg-gray-50 dark:bg-slate-800/80"
                        }`}
                    >
                    {/* Index */}
                    <TableCell className="p-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {(row.index - 1)}
                    </TableCell>

                    {/* SO Number */}
                    <TableCell className="p-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {inputs.soNumber || "-"}
                    </TableCell>

                    {/* RMA Number */}
                    <TableCell className="p-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {inputs.rmaNumber || "-"}
                    </TableCell>

                    {/* CT or Part */}
                    <TableCell className="p-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {ctOrPart || "-"}
                    </TableCell>

                    {/* AWB */}
                    <TableCell className="p-3 border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {awb || "-"}
                    </TableCell>

                    {/* Matched MO/Case */}
                    <TableCell className="p-3 border border-slate-200 dark:border-slate-800">
                        {matched ? (
                        <div className="flex flex-col text-green-600 dark:text-green-400">
                            <span>MO: {matched.MOID} ({row.matchSource})</span>
                            <span>Case: {matched.CaseID || "-"}</span>
                        </div>
                        ) : (
                        <span className="text-red-500">Not Found</span>
                        )}
                    </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </div>
      )}

    </div>
  );
}
