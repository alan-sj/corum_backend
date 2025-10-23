import { Router, type Response } from "express";
import Answer from "../models/Answer.js";
import mongoose from "mongoose";
import { verifyToken, type AuthRequest } from "../middleware/auth.js";
import Question from "../models/Question.js";

const router = Router();

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { body, questionId } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!questionId) {
      return res.status(400).json({ error: "questionId is required" });
    }

    const answer = new Answer({
      body,
      author: req.user.id,
      questionId,
    });

    const savedAnswer = await answer.save();

    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: savedAnswer._id },
    });

    const populatedAnswer = await savedAnswer.populate("author", "username");

    res.status(201).json(populatedAnswer);
    console.log("Answer added successfully!");
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

router.put("/update/:id", async (req, res) => {
  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ error: "answer not found" });
    }

    res.json(updatedAnswer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedAnswer = await Answer.findByIdAndDelete(req.params.id);

    if (!deletedAnswer) {
      return res.status(404).json({ error: "answer not found" });
    }

    res.json(deletedAnswer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/upvote", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid answer ID" });
  }

  try {
    const answer = await Answer.findByIdAndUpdate(
      id,
      { $inc: { "votes.upvotes": 1 } },
      { new: true }
    );

    if (!answer) {
      return res.status(404).json({ error: "answer not found" });
    }

    res.json(answer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/downvote", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid answer ID" });
  }

  try {
    const answer = await Answer.findByIdAndUpdate(
      id,
      { $inc: { "votes.downvotes": 1 } },
      { new: true }
    );

    if (!answer) {
      return res.status(404).json({ error: "answer not found" });
    }

    res.json(answer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
