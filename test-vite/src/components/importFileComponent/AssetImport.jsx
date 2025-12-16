import { useState } from "react";
import * as XLSX from "xlsx"
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { toast } from "sonner";
import ApiCustomer from "@/api";
import { Input } from "../ui/input";

export function AssetTemplateButton() {
  const handleDownload = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/import/asset-information`;
  };

  return (
    <Button variant={"outline"} onClick={handleDownload}>
      Download Product Template
    </Button>
  );
}


export function AssetImport() {
    const [file, setFile] = useState(null)

    const handleFileUpload = (e) =>{
        setFile(e.target.files[0]);
    }

    const handleImport = async () => {
        if (!file){
            toast.warning("No File Uploaded.");
            return;
        }

        const formData = new FormData();
        formData.append("file",file);

        try{
            const response = await ApiCustomer.post("/api/import/asset-information",formData);
            const result = response.json();

            if(result.success){
                toast(`${result.data.data.message}`)
            }else{
                toast.warning(`${result.data.data.message}`)
            }
        }catch(err){
            toast.warning("Failed to import data")
        }
    }
    return (
        <div className="flex flex-row items-center gap-2 ">
            <Input className="ring-1 ring-gray-400 rounded-sm" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <Button variant={"outline"} onClick={handleImport}>Import Asset Data</Button>
        </div>
    );
}