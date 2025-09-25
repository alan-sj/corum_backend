import { Router } from "express";
import Rooms from "../models/Rooms.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const room = new Rooms(req.body);
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.json(rooms);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
