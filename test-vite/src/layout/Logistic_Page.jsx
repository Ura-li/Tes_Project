import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect} from "react";
import ApiCustomer from "@/api";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { NotificationCard } from "@/components/NotificationCard";
import { useNavigate } from "react-router";
import { CaseField } from "@/pages/services/service-case";

export default function Logistik() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [CaseData, setCaseData] = useState([]);
    const [preview, setPreview] = useState({
        ProfilePhoto: null,
        Signature: null,
    });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

    const fetchData = async () => {
        try {
            const fetchCaseData = await ApiCustomer.get('/api/case-information')
            // setCaseData(fetchCaseData.data.data );           
            const fecthUserData = await ApiCustomer.get(`/api/user/${user.id}`)
            const resFetchUserData = fecthUserData.data.data;
            console.log("Fetch user data : ", fecthUserData)
            console.log("Fetch Data Mo Detail Line", fetchCaseData.data.data)

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
            const valueFilterPartOrder = fetchCaseData.data.data.filter(c =>  c?.caseinformation?.workorder?.[0]?.materialorder?.[0]?.materialorderlineitems?.[0]?.LineItemID)
            console.log("Filtered PartData:", valueFilterPartOrder); 
            setCaseData(valueFilterPartOrder);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() =>{
        fetchData();
    },[])
   
    const totalPages = Math.ceil(CaseData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = CaseData.slice(startIndex, startIndex + itemsPerPage);


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
                        className={user.role === "lg" ? "bg-amber-200" : "bg-gray-200"}
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
                    <CardTitle className={"text-2xl"}>Sparepart</CardTitle>
                    <hr />
                </CardHeader>
                <CardContent className={"grid grid-cols-2 gap-4"}>
                 {currentData.length > 0 ? (
            currentData.map((c) => (
              <Card
                key={c.caseinformation.CaseID}
                className="border-3 rounded-sm hover:bg-gray-200"
                onClick={() =>
                  navigate(
                    `/app/material-order/${c.caseinformation?.workorder?.[0]?.materialorder?.[0]?.MOID}`
                  )
                }
              >
                <CardHeader className={"flex justify-between"}>
                  <CardTitle>
                    {c.caseinformation?.workorder?.[0]?.materialorder?.[0]?.MOID}
                  </CardTitle>
                  <hr />
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                  <CaseField label={"PART : "}>
                    {
                      c.caseinformation?.workorder?.[0]?.materialorder?.[0]
                        ?.materialorderlineitems?.[0]?.Description
                    }
                  </CaseField>

                  </div>

                  <div className="flex flex-row gap-2">
                  <CaseField label={"PARTNUMBER : "}>
                    {
                      c.caseinformation?.workorder?.[0]?.materialorder?.[0]
                        ?.materialorderlineitems?.[0]?.PartNumber
                    }
                  </CaseField>

                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-400">No Open Orders found</p>
          )}
        </CardContent>

        {/* Pagination Controls */}
        <CardFooter className="flex justify-between items-center">
          <button
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </CardFooter>
            </Card>

            <Card className={"rounded-sm"}>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className={"overflow-y-auto space-y-3"}>
                    <NotificationCard />
                </CardContent>
            </Card> 
        </div>
    )
}