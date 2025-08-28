import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationCard } from "./FrontDesk_Page";
import { useState, useEffect} from "react";
import ApiCustomer from "@/api";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";


export default function ApoLanding() {
    const { user } = useAuth();
    const [userData, setUserData] = useState([]);
    const [preview, setPreview] = useState({
        ProfilePhoto: null,
        Signature: null,
    });

    const fetchData = async () => {
        try {
            const fecthUserData = await ApiCustomer.get(`/api/user/${user.id}`)
            const resFetchUserData = fecthUserData.data.data;
            console.log("Fetch user daya : ", user)
            setUserData({
                ...userData,
                Username: resFetchUserData.Username,
                Name: resFetchUserData.Name,
                Email: resFetchUserData.Email,
                Phone: resFetchUserData.Phone || "",
                ProfilePhoto: resFetchUserData.ProfilePhoto,
                Signature: resFetchUserData.Signature,
            })
            setPreview({
                ProfilePhoto: fecthUserData.data.data.ProfilePhoto ? `${import.meta.env.VITE_API_BASE_URL}${fecthUserData.data.data.ProfilePhoto}` : null,
                Signature: fecthUserData.data.data.Signature ? `${import.meta.env.VITE_API_BASE_URL}${fecthUserData.data.data.Signature}` : null,
            });
        } catch (err) {
            console.error(err);
            
        }
    }
    // fetchData();
    useEffect(() =>{
        fetchData();
    },[])
    // const [parts, setPart] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const ItemsPerPage = 3;

    // const indexOfLastItem = currentPage * ItemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
    // const currentData = parts.slice(indexOfFirstItem, indexOfLastItem);
    // const totalPages  = Math.ceil(parts.length / ItemsPerPage);

    return (
        <div className="grid mt-4 m-5 gap-5 max-h-[calc(100vh-15px)] grid-rows-2 grid-cols-3">
            <Card className={"rounded-sm"}>
                <CardHeader className={"grid grid-cols-2 items-start"}>
                    {!preview.ProfilePhoto && (
                    <div className="flex justify-start">
                        <div className="w-30 h-30 rounded-full border-4 border-white shadow-md text-center">
                        <span className="text-3xl font-bold">?</span>
                        </div>
                    </div>
                    )}
                    {preview.ProfilePhoto && (
                    <div className="flex justify-start">
                        <img
                        src={preview.ProfilePhoto}
                        alt="Profile Preview"
                        className="w-30 h-30 rounded-full border-4 border-white shadow-md text-center"
                        />
                    </div>
                    )}
                    {/* <div className="flex justify-start">
                        <img  
                            src={user?.avatar || "/default-avatar.png"}
                            alt="avatar"
                            className="w-30 h-30 rounded-full border-4 border-white shadow-md text-center"
                        />
                    </div> */}
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
                    <span className='text-sm text-gray-500'>{userData.Phone}</span>
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