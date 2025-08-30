import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/auth-context";

export function SocketInitializer() {
    const { user } = useAuth();
    const socket = useSocket();

    useEffect(() => {
        if (user?.id) {
            socket.emit("joinUser", user.id);
        }
    }, [user, socket]);

    return null;
}
