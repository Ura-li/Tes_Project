// lib/socketClient.js
import axios from "axios";
import dotenv from "dotenv";

export async function notifySocket(event, payload) {
    try {
        await axios.post(process.env.WEBSOCKET_URL+"emit", { event, payload });
    } catch (e) {
        console.error("Socket notify error:", e.message);
    }
}
