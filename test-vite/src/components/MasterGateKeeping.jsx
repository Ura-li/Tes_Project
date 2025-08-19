import { Navigate } from "react-router";
import { getUserFromToken } from "@/lib/utils/auth";

export const MasterGateKeeping = ( { children, allow }) => {
    const user = getUserFromToken();
    // if(!user || user.role !== 'admin'){
    //     /**
    //      * TODO
    //      * MAKE FORBIDDEN PAGE
    //      */
    //     return <Navigate to="/" />;
    // }

    if(!user) return <Navigate to ="/" replace/>

    if(!allow.includes(user.role)){
        return  <Navigate to="/app/forbidden" />
    }
    return children;
}