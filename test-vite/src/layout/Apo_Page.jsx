import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationCard } from "./FrontDesk_Page";
import { useState, useEffect} from "react";
import ApiCustomer from "@/api";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";


export default function ApoLanding() {
    const { user } = useAuth();
      const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState({
          ProfilePhoto: null,
          Signature: null,
          Phone: null
      });

    const fetchData = async () => {
        setLoading(true);
        try {
            const fecthUserData = await ApiCustomer.get(`/api/user/${user.id}`);
             setPreview({
                ProfilePhoto: fecthUserData.data.data.ProfilePhoto ? `${import.meta.env.VITE_API_BASE_URL}${fecthUserData.data.data.ProfilePhoto}` : null,
                Signature: fecthUserData.data.data.Signature ? `${import.meta.env.VITE_API_BASE_URL}${fecthUserData.data.data.Signature}` : null,
                Phone: fecthUserData.data.data.Phone || null
            });
        }catch (error) {
            
         Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal memuat data. Silakan coba lagi.',
              });
              console.error('Error fetching case data:', error);
              throw error;
            } finally {
              setLoading(false);
            }
    }

     useEffect(() => {
        fetchData();
      }, []);
    
    
    // const indexOfLastItem = currentPage * ItemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
    // const currentData = parts.slice(indexOfFirstItem, indexOfLastItem);
    // const totalPages  = Math.ceil(parts.length / ItemsPerPage);

    return (
        <div className="grid mt-4 m-5 gap-5 max-h-[calc(100vh-15px)] grid-rows-2 grid-cols-3">
            <Card className={"rounded-sm"}>
                <CardHeader className={"grid grid-cols-2 items-start"}>
                   {!preview.ProfilePhoto && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-md -mb-10">
                        <span className="text-3xl font-bold">?</span>
                        </div>
                    </div>
                    )}
                    {preview.ProfilePhoto && (
                    <div className=" items-center grid grid-cols-2">
                        <div className="w-25 h-25 [clip-path:inset(0_0_50%_0)]  border-5 absolute rounded-t-full "/>
                        <div className="w-25 h-25 [clip-path:inset(0_50%_0_0)] border-5 border-blue-400 absolute rounded-t-full "/>
                        <div className="w-25 h-25 [clip-path:inset(50%_0_0_5%)] border-5 border-blue-400 absolute rounded-r-full "/>
                        <img
                        src={preview.ProfilePhoto}
                        alt="Profile Preview"
                        className="w-25 h-25 rounded-full border-4 border-white col-span-2"
                        />
                    </div>
                    )}
                    <div className="flex justify-end">
                    <Badge
                        variant={"outline"}
                        className={user.role === "apo" ? "bg-amber-200" : "bg-gray-200"}
                        >
                        {user.role}
                    </Badge>
                    </div>
                </CardHeader>
                <CardContent className={"ml-4 flex gap-1 flex-col"}>
                    <CardTitle className={"text-xl"}>{user?.name || "User"}</CardTitle>
                    <span className="text-gray-400">{user?.email}</span>
                    <span className="text-sm text-gray-400">{preview?.Phone}</span>
                </CardContent>
                <span className="text-xs text-center text-gray-500 mt-4">
                    Latest Login: {new Date().toLocaleString()}
                </span>
            </Card>

             <Card className={"rounded-sm col-span-2 row-span-2"}>
                <CardHeader>
                    <CardTitle className={"text-2xl"}>Sparepart Order</CardTitle>
                    <hr />
                </CardHeader>
                <CardContent>
                      <table className="border min-w-full shadow-lg border-gray-300">
                        <thead>
                            <tr className="uppercase">
                                <th className="p-2 border">HP Part No</th>
                                <th className="p-2 border">Part Name</th>
                                <th className="p-2 border">Bad CT Code</th>
                                <th className="p-2 border">CT Validation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {parts.map((Parts) => ( 
                            <tr key={Parts.id} className="text-center">
                                <td className="p-2 border">{Parts.photo}</td>
                                <td className="p-2 border">{Parts.name}</td>
                                <td className="p-2 border">{Parts.email}</td>
                                <td className="p-2 border">{Parts.phone}</td>
                            </tr>
                            ))} */}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card className={"rounded-sm"}>
                <CardHeader>
                    <CardTitle>Norifications</CardTitle>
                </CardHeader>
                <CardContent className={"overflow-y-auto space-y-3"}>
                    <NotificationCard/>
                </CardContent>
            </Card> 
        </div>
    )
}