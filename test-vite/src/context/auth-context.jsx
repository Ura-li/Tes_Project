import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { getUserFromToken, setToken, clearToken, getToken } from "@/lib/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const logoutTimerRef = useRef(null);

    const clearLogoutTimer = useCallback(() => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    }, []);

    const logout = useCallback(() => {
        clearLogoutTimer();
        clearToken();
        setUser(null);
    }, [clearLogoutTimer]);

    const scheduleLogout = useCallback((tokenPayload) => {
        clearLogoutTimer();

        if (!tokenPayload?.exp) {
            return;
        }

        const expiresInMs = tokenPayload.exp * 1000 - Date.now();

        if (expiresInMs <= 0) {
            logout();
            return;
        }

        logoutTimerRef.current = setTimeout(() => {
            logout();
        }, expiresInMs);
    }, [logout, clearLogoutTimer]);

    const login = useCallback((token) => {
        setToken(token);
        const userData = getUserFromToken(token);
        setUser(userData);
        scheduleLogout(userData);
    }, [scheduleLogout]);

    useEffect(() => {
        const token = getToken();
        const userData = token ? getUserFromToken(token) : null;

        setUser(userData);
        scheduleLogout(userData);
        setLoading(false);

        return () => {
            clearLogoutTimer();
        };
    }, [scheduleLogout, clearLogoutTimer]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {loading == false ? children : null}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
