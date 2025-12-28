import { createContext, useContext, useEffect, useState } from "react";
import ApiCustomer from "../api";
import { useAuth } from "./auth-context";
import { toast } from "sonner";

const TeamContext = createContext();

export function TeamProvider({children}) {
    const { user } = useAuth();
    const [teams, setTeams] = useState();
    const [activeTeam, setActiveTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const res = await ApiCustomer.get('/api/resources?limit=1000');
                const response = res.data.data;
                const mapped = response.map(r => ({
                    id: r.ResourceId,
                    name: r.Name, 
                    plan: r.ServiceCenterName,
                    logo: r.ResourceLogo,
                    raw: r
                }))

                setTeams(mapped);
                
                if (user?.resource) {
                    const defaultFromJWT = mapped.find(
                        (t) => t.id === user?.resource
                    );
                    if (defaultFromJWT) {
                        setActiveTeam(defaultFromJWT);
                        return;
                    }
                }
                const savedTeamId = localStorage.getItem("activeTeamId");


            } catch (error) {
                toast.error("Failedd to load Teams",error)
            } finally{
                setLoading(false)
            }
        }
        fetchTeams();
    },[user])

    useEffect(() => {
        if (activeTeam) {
            localStorage.setItem("activeTeamId", activeTeam.id);
        }
    }, [activeTeam]);


    return(
        <TeamContext.Provider value={{ teams, activeTeam, setActiveTeam, loading }}>
            {children}
        </TeamContext.Provider>
    )
}

export function useTeam() {
    return useContext(TeamContext);
}
