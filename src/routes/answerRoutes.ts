import { Router } from "express";

import Answer from "../models/Answer.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const answer = new Answer(req.body);
    const savedAnswer = await answer.save();
    res.status(201).json(savedAnswer);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const answer = await Answer.find();
    res.json(answer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
