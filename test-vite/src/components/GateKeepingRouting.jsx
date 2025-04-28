import { Navigate, Outlet } from "react-router";

import App from "@/App";

export const GateKeepingRouting = () => {
    const token = localStorage.getItem('token');

    if(!token) {
        return <Navigate to="/lorem" replace />
    }

    return <App />
}