import ApiCustomer from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, ArrowUpDown, File } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const ErfCase = () => {
    const [caseData, setCaseData] = useState([])

    const fetchData = async () => {
        try {
            const response = await ApiCustomer.get('/api/case-information')
            const data = response.data.data.filter(c => c.CaseStatus == 'Close');
            setCaseData(data)
            return data
        } catch (err) {
            console.log("THIS THING GIVE ME ERROR", err)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    console.log(caseData)

    const [selectedFiles, setSelectedFiles] = useState([]);

    async function uploadFiles(files) {
        toast.loading("WAIT FOR THE UPLOAD")
        console.log("Uploading files...");
        const formData = new FormData();
        for (let file of files) {
            formData.append("files", file);
        }

        const res = await ApiCustomer.post('/api/case-information/erf', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);

    }


 

    return (
        <div className='bg-slate-200 p-5'>
            <Tabs defaultValue="Main">
                <TabsList>
                    <TabsTrigger value="Main">Main</TabsTrigger>
                    <TabsTrigger value="Pending">Pending</TabsTrigger>
                </TabsList>
                <TabsContent value="Main">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Upload Multiple ERF Files</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2 text-sm text-gray-600">
                                You can upload multiple ERF files. Maximum file size per file: 10MB.
                            </p>
                            <Input type="file" multiple onChange={(e) => setSelectedFiles(e.target.files)} />
                            <button
                                onClick={() => uploadFiles(selectedFiles)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Submit
                            </button>

                        </CardContent>
                        <CardFooter>
                            {/* Optional: Add any footer content here */}
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="Pending">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Closed Cases</h2>
                        </CardHeader>
                        <CardContent>
                            <table className="min-w-full border border-gray-300 rounded">
                                <thead>
                                    <tr className="text-sm text-gray-700 uppercase bg-gray-200">
                                        <th className="p-2 border cursor-pointer" >
                                            Case ID
                                        </th>
                                        <th className="p-2 border cursor-pointer" >
                                            Created On 
                                        </th>
                                        <th className="p-2 border cursor-pointer" >
                                            Case Subject 
                                        </th>

                                        <th className="p-2 border cursor-pointer" >
                                            ErfDoc
                                        </th>
                                        
                                        <th className="p-2 border cursor-pointer" >
                                            Company
                                        </th>
                                        <th className="p-2 border cursor-pointer" >
                                            Primary 
                                        </th>

                                        <th className="p-2 border cursor-pointer" >
                                            Serial Number 
                                        </th>
                                        <th className="p-2 border cursor-pointer" >
                                            Product Number 
                                        </th>
                                        <th className="p-2 border cursor-pointer" >
                                            Product Name 
                                        </th>
 
                                        <th className="p-2 border cursor-pointer" >
                                            Case Status 
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {caseData.length === 0 ? (
                                        <tr>
                                            <td colSpan={13} className="text-center py-4">No closed cases found.</td>
                                        </tr>
                                    ) : (
                                        caseData.map((c, idx) => (
                                            <tr key={c.CaseID} className="text-center hover:bg-gray-100">
                                                            <td
                                                              className="p-2 text-blue-500 border cursor-pointer hover:underline"
                                                              onClick={() => navigate(`/app/case/${c.CaseID}`)}
                                                            >
                                                              {c.CaseID}
                                                            </td>
                                                            <td className="p-2 border">{c.CreatedOn}</td>
                                                            <td className="p-2 border">{c.CaseSubject}</td>
                                                            <td className="p-2 border">
                                                                {
                                                         c.caseinformation.ErfDoc  &&
                                                        (<Button onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}${c.caseinformation.ErfDoc }`)} ><File/></Button>)
                                                                }
                                                                </td>
                                                            <td className="p-2 border">{c.CustomerAccount}</td>
                                                            <td className="p-2 border">{c.Primary}</td>
                                                            <td className="p-2 border">{c.SerialNumber}</td>
                                                            <td className="p-2 border">{c.ProductNumber}</td>
                                                            <td className="p-2 border">{c.ProductName}</td>
                                                            
                                                            <td
                                                              className={cn(
                                                                "bg-emerald-300",
                                                                c.CaseStatus === "Close"
                                                                  ? "bg-red-300"
                                                                  : c.CaseStatus === "InActive"
                                                                    ? "bg-sky-300"
                                                                    : ""
                                                              )}
                                                            >
                                                              {c.CaseStatus}
                                                            </td>
                                                          </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
