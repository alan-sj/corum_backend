import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";

import roomRoutes from "./routes/roomRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import Rooms from "./models/Rooms.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/rooms", roomRoutes);
app.use("/answers", answerRoutes);
app.use("/comments", commentRoutes);
app.use("/questions", questionRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/tag", tagRoutes);
app.use("/home", homeRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

// ------------------ SOCKET.IO ------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on(
    "updateTextArea",
    async ({
      roomId,
      textAreaIndex,
      body,
    }: {
      roomId: string;
      textAreaIndex: number;
      body: string;
    }) => {
      try {
        const room = await Rooms.findById(roomId);
        if (!room) return;

        room.textAreas[textAreaIndex]!.body = body;
        await room.save();

        // Broadcast to everyone else in the same room
        socket.to(roomId).emit("textAreaUpdated", {
          roomId,
          textAreaIndex,
          body,
        });
      } catch (err) {
        console.error("Socket updateTextArea error:", err);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("DB Connected");
    server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch((error) => {
    console.error("Failed DB Connection", error);
  });
