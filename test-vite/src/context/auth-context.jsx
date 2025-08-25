// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromToken, setToken, clearToken, getToken } from "@/lib/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        const userData = token ? getUserFromToken(token) : null;
        setUser(userData);
        setLoading(false);
    }, []);

    const login = (token) => {
        setToken(token);
        setUser(getUserFromToken(token));
    };

    const logout = () => {
        clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
