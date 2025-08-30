// server.mjs
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"

dotenv.config();

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

    socket.on("joinUser", (userId) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined room user:${userId}`);
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
    const { event, payload, caseInfo, rooms } = req.body;
    console.log("The rooms",caseInfo)
    if (caseInfo) {
        notifyCaseUsers(caseInfo, event, payload);
    } else if (rooms?.length) {
        rooms.forEach(r => io.to(r).emit(event, payload));
    } else {
        console.log("⚠️ No target room specified, skipped global emit");
    }

    return res.json({ success: true });
});


function notifyCaseUsers(caseInfo, event, payload) {
    const targets = new Set();

    if (caseInfo.createdById) {
        targets.add(caseInfo.createdById);
    }
    if (caseInfo.ownerId) {
        targets.add(caseInfo.ownerId);
    }

    // Now emit only once per unique user
    targets.forEach(userId => {
        io.to(`user:${userId}`).emit(event, payload);
    });
}

