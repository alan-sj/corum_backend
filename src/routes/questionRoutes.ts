import { Router, type Response } from "express";
import mongoose from "mongoose";
import Question from "../models/Question.js";
import Tag from "../models/Tag.js";
import {
  checkToken,
  verifyToken,
  type AuthRequest,
} from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, tags, isPrivate, roomId } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const author = req.user.id;

    const tagIds = await Tag.find({ _id: { $in: tags } }).then((t) =>
      t.map((tag) => tag._id)
    );

    const question = new Question({
      title,
      body,
      tags: tagIds,
      author,
      isPrivate,
      roomId,
    });

    const savedQuestion = await question.save();

    const populatedQuestion = await (
      await savedQuestion.populate("tags", "tagName")
    ).populate("author", "username");

    res.status(201).json(populatedQuestion);
    console.log("Question Added");
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", checkToken, async (req: AuthRequest, res) => {
  try {
    const questions = await Question.find()
      .populate("tags", "tagName")
      .populate("author", "username")
      .sort({ createdAt: -1 });

    const username = req.user?.username;
    res.json({ username: username, questions: questions });
    console.log("All questions fetched!");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/tags", async (req, res: Response) => {
  try {
    const tags = await Tag.find({}, "_id tagName").sort({ tagName: 1 });
    res.json(tags);
    console.log("All tags fetched!");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("tags", "tagName")
      .populate("author", "username")
      .populate({
        path: "answers",
        populate: [
          { path: "author", select: "username" },
          {
            path: "comments",
            populate: { path: "author", select: "username" },
            select: "body author createdAt updatedAt",
          },
        ],
        select: "body votes comments createdAt updatedAt",
      })
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
        select: "body author createdAt updatedAt",
      });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
    console.log("Question fetched successfully with views incremented!");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(updatedQuestion);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(deletedQuestion);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/upvote", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      { $inc: { "votes.upvotes": 1 } },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/downvote", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      { $inc: { "votes.downvotes": 1 } },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/filter", checkToken, async (req: AuthRequest, res) => {
  try {
    const { tags }: { tags: string[] } = req.body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "Tags are required" });
    }

    const tagDocs = await Tag.find({ _id: { $in: tags } });
    const tagIds = tagDocs.map((t) => t._id);

    const questions = await Question.find({ tags: { $in: tagIds } })
      .populate("tags", "tagName")
      .populate("author", "username")
      .sort({ createdAt: -1 });
    const username = req.user?.username;
    res.json({ username: username, questions: questions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
