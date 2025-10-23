import { Router, type Response } from "express";
import Comment from "../models/Comment.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { verifyToken, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { parentType, id, body } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!["question", "answer"].includes(parentType)) {
      return res.status(400).json({ error: "Invalid parent type" });
    }

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const parentId = id;

    const comment = new Comment({
      parentId,
      parentType,
      body,
      author: req.user.id,
    });

    const savedComment = await comment.save();

    if (parentType === "question") {
      await Question.findByIdAndUpdate(parentId, {
        $push: { comments: savedComment._id },
      });
    } else if (parentType === "answer") {
      await Answer.findByIdAndUpdate(parentId, {
        $push: { comments: savedComment._id },
      });
    }

    const populatedComment = await savedComment.populate("author", "username");

    res.status(201).json(populatedComment);
    console.log("Comment added successfully!");
  } catch (err: any) {
    console.error("Error adding comment:", err);
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

router.put("/update/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(updatedComment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(deletedComment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
