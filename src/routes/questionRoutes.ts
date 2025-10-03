import { Router } from "express";

import Question from "../models/Question.js";
import mongoose from "mongoose";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const question = await Question.find();
    res.json(question);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update/:id", async(req,res) =>{
  try{ 
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

router.delete("/delete/:id", async(req,res) =>{
  try{
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id); 
       
    if(!deletedQuestion)  {
      return res.status(404).json({ error: "Question not found"});
    }

    res.json(deletedQuestion);
  } catch (err:any) {
    res.status(500).json({ error : err.message });
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

router.get("/tag/:tagName", async (req, res) => {
  const { tagName } = req.params;

  try {
    const questions = await Question.find({ tags: tagName });
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


