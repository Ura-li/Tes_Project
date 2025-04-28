import { Navigate } from "react-router";
import { getUserFromToken } from "@/lib/utils/auth";

export const MasterGateKeeping = ( { children }) => {
    const user = getUserFromToken();
    if(!user || user.role !== 'admin'){
        /**
         * TODO
         * MAKE FORBIDDEN PAGE
         */
        return <Navigate to="/" />;
    }

    return children;
}