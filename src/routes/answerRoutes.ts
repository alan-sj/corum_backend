import { Router } from "express";
import Answer from "../models/Answer.js";
import mongoose from "mongoose";

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

router.put("/update/:id", async(req,res) =>{
  try{ 
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

router.delete("/delete/:id", async(req,res) =>{
  try{
    const deletedAnswer = await Answer.findByIdAndDelete(req.params.id); 

    if(!deletedAnswer)  {
      return res.status(404).json({ error: "answer not found"});
    }

    res.json(deletedAnswer);
  } catch (err:any) {
    res.status(500).json({ error : err.message });
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
