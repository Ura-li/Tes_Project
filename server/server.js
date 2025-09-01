// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

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

// server.js
// server.js
app.post("/emit", (req, res) => {
    const { event, payload, caseInfo, rooms } = req.body;
    console.log("The rooms",caseInfo)
    if (caseInfo) {
        notifyCaseUsers(caseInfo, event, payload);
    } else if (rooms?.length) {
        rooms.forEach(r => io.to(r).emit(event, payload));
    } else {
        // console.log("THIS THING IS WORKS",caseInfo,event,payload);
        // no fallback, prevent global
        console.log("⚠️ No target room specified, skipped global emit");
    }

    return res.json({ success: true });
});


function notifyCaseUsers(caseInfo, event, payload) {
    if (caseInfo.createdById) {
        io.to(`user:${caseInfo.createdById}`).emit(event, payload);
    }
    if (caseInfo.ownerId) {
        io.to(`user:${caseInfo.ownerId}`).emit(event, payload);
    }
}


