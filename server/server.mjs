// server.mjs
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"
import cors from "cors";
import { request } from "http";

dotenv.config();

const allowedOrigin = process.env.VITE_URL?.replace(/\/$/, "");


const app = express();

app.use(cors({
    origin: [allowedOrigin],
    methods: ["GET", "POST"],
    credentials: true
}));

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigin, // your Vite frontend
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
        console.log("⚠️ No target room specified, skipped global emitKONTOL");
    }

    return res.json({ success: true });
});


function notifyCaseUsers(caseInfo, event, payload) {
    const { createdById, ownerId } = caseInfo;

    if (createdById && createdById === ownerId) {
        io.to(`user:${createdById}`).emit(event, payload);
    } else {
        if (createdById) {
            io.to(`user:${createdById}`).emit(event, payload);
        }
        if (ownerId) {
            io.to(`user:${ownerId}`).emit(event, payload);
        }
    }
}


