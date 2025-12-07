import { useState } from "react";
import * as XLSX from "xlsx"
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { toast } from "sonner";
import ApiCustomer from "@/api";
import { formatDateForInput, formatDateForMySQL } from "../../lib/utils";

export function SOTemplateButton(
    target = ''
) {
    // return console.log(target.target)
  const handleDownload = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/import/materialorder?targetStatus=${target.target}`;
  };

  return (
    <Button onClick={handleDownload} className={"dark:bg-gradient-to-b dark:border-2 dark:from-slate-800 dark:via-slate-600 dark:to-slate-700 dark:border-b-slate-600 dark:to-60% dark:via-100% dark:from-50% dark:text-white"}>
      Download SO Template
    </Button>
  );
}


//ONGOING, NOT FINISHED YET
// -miku21
export function SOImport(
    target,
    dateRMA
) {
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
        formData.append("targetStatus", target.target)
        formData.append("dateRMA", formatDateForMySQL(target.dateRMA))
        try{
            const response = await ApiCustomer.post("/api/import/materialorder",formData);
            const result = response.data;

            if(result.success){
                toast(`${result.message}`)
            }else{
                toast.warning(`${result.message}`)
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