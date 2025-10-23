import { Router, type Response } from "express";
import Rooms from "../models/Rooms.js";
import { verifyToken, type AuthRequest } from "../middleware/auth.js";
import type { ITextArea } from "../interfaces/textAreaInterface.js";
import mongoose from "mongoose";

const router = Router();

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, textAreas } = req.body;

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const room = new Rooms({
      name,
      createdBy: req.user.id,
      members: [req.user.id],
      textAreas: textAreas || [],
    });

    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const rooms = await Rooms.find({ members: req.user.id });
    res.status(200).json(rooms);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/:roomId/textareas", verifyToken, async (req, res) => {
  const { roomId } = req.params;
  const { title, body } = req.body;

  try {
    const room = await Rooms.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const newTextArea = {
      title: title || "New Text Area",
      body: body || "",
    } as ITextArea;
    room.textAreas.push(newTextArea);
    await room.save();

    res.status(201).json({
      textArea: newTextArea,
      index: room.textAreas.length - 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/join", verifyToken, async (req: AuthRequest, res: Response) => {
  const { inviteCode } = req.body;
  const userId = new mongoose.Types.ObjectId(req.user!.id);

  try {
    const room = await Rooms.findOne({ inviteCode });
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
