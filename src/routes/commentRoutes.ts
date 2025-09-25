import { Router } from "express";
import Comment from "../models/Comment.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();

    if (req.body.parentType === "question") {
      await Question.findByIdAndUpdate(
        req.body.parentId,
        { $push: { comments: savedComment._id } },
        { new: true }
      );
    } else if (req.body.parentType === "answer") {
      await Answer.findByIdAndUpdate(
        req.body.parentId,
        { $push: { comments: savedComment._id } },
        { new: true }
      );
    }

    res.status(201).json(savedComment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const comment = await Comment.find();
    res.json(comment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
