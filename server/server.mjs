// server.mjs
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: [process.env.VITE_URL], // your Vite frontend
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // Optional: join room per role or user
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

httpServer.listen(4000, () => {
    console.log("🚀 Socket.IO server running on http://localhost:4000");
});

export { io };

// inside server.js
app.use(express.json());

app.post("/emit", (req, res) => {
    const { event, payload } = req.body;
    io.emit(event, payload); // broadcast to all clients
    return res.json({ success: true });
});

