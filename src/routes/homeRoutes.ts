import { Router } from "express";

import Question from "../models/Question.js";
import Tag from "../models/Tag.js";
import mongoose from "mongoose";
const router = Router();

router.get("/", async(req,res) =>{
    try{
        const question= await Question.find()
            .select("id title votes tags views comments")
            .populate("tags","tagName")
            .populate("author","username")
            .limit(5);
        
        const tag= await Tag.find()
            .limit(5);

        res.status(200).json({question,tag});
    } catch(err:any) {
        res.status(500).json({error:err.message});
    }
});


export default router;