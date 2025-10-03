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

router.put("/update/:id", async(req,res) =>{
  try{ 
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

router.delete("/delete/:id", async(req,res) =>{
  try{
    const deletedComment = await Comment.findByIdAndDelete(req.params.id); 

    if(!deletedComment)  {
      return res.status(404).json({ error: "Question not found"});
    }

    res.json(deletedComment);
  } catch (err:any) {
    res.status(500).json({ error : err.message });
  }
});

export default router;
