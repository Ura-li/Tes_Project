import { createContext, useContext, useEffect, useState } from "react";
import ApiCustomer from "../api";
import { useAuth } from "./auth-context";

const TeamContext = createContext();

export function TeamProvider({children}) {
    const { user } = useAuth();
    console.log("USER", user)
    const [teams, setTeams] = useState([]);
    const [activeTeam, setActiveTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    


    useEffect(() => {
        async function fetchTeams() {
            try {
                const res = await ApiCustomer.get('/api/resources?limit=1000');
                const response = res.data.data;
                // console.log("RES CONTEXT", response)
                const mapped = response.map(r => ({
                    id: r.ResourceId,
                    name: r.Name, 
                    plan: r.ServiceCenterName,
                    logo: r.ResourceLogo,
                    raw: r
                }))

                setTeams(mapped);
                
                const savedTeamId = localStorage.getItem("activeTeamId");

                if (user?.resource) {
                    const defaultFromJWT = mapped.find(
                        (t) => t.id === user.resource
                    );
                    console.log("DEFC JWT",defaultFromJWT, mapped)
                    if (defaultFromJWT) {
                        setActiveTeam(defaultFromJWT);
                        return;
                    }
                }

                setActiveTeam(mapped[0]);   

            } catch (error) {
                console.error("Failed to load Teams,", error);
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