// src/hooks/useNotifications.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "notifications";

function loadNotifs() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const now = Date.now();
    // filter expired (>7 days old)
    return parsed.filter(n => now - new Date(n.date).getTime() < 7 * 24 * 60 * 60 * 1000);
}

export function useNotifications(userId) {
    const [notifications, setNotifications] = useState(loadNotifs);

    // persist whenever changed
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    // helper to add new notif
    function addNotification(notif) {
        // setNotifications(prev => [{ ...notif, userId }, ...prev]);
        const token = Date.now().toString(36) + Math.random().toString(36).slice(2);
        setNotifications(prev => [{ ...notif, userId, token }, ...prev]);
    }

    function deleteNotification(token) {
        setNotifications(prev => prev.filter(n => n.token !== token));
    }

    function clearNotification() {
        setNotifications([]);
    }

    return { notifications, addNotification, deleteNotification, clearNotification };
}
