// lib/socketClient.js
import axios from "axios";

export async function notifySocket(event, payload) {
    try {
        await axios.post("http://localhost:4000/emit", { event, payload });
    } catch (e) {
        console.error("Socket notify error:", e.message);
    }
}
