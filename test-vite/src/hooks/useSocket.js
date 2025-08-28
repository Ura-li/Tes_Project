// src/hooks/useSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export function useSocket(event, handler) {
    useEffect(() => {
        socket.on(event, handler);
        return () => {
            socket.off(event, handler);
        };
    }, [event, handler]);

    return socket;
}
