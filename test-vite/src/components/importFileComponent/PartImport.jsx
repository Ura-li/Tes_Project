import { useState } from "react";
import * as XLSX from "xlsx"
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { toast } from "sonner";
import ApiCustomer from "@/api";

export function PartTemplateButton() {
  const handleDownload = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/import/part-information`;
  };

  return (
    <Button onClick={handleDownload}>
      Download Product Template
    </Button>
  );
}


export function PartImport() {
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
            const response = await ApiCustomer.post("/api/import/part-information",formData);
            const result = response.json();

            if(result.success){
                toast(`${result.data.data.message}`)
            }else{
                toast.warning(`${result.data.data.message}`)
            }
        }catch(err){
            toast.warning("Failed to import data")
            console.error(err)
        }
    }
    return (
        <div className="flex flex-col items-start space-y-3">
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <Button onClick={handleImport}>Import Asset Data</Button>
        </div>
    );
}