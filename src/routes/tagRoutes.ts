import { Router } from "express";
import Tag from "../models/Tag.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const tag = new Tag(req.body);
    const savedTag = await tag.save();
    res.status(201).json(savedTag);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tag = await Tag.find();
    res.json(tag);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
