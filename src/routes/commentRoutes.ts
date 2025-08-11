import {Router} from 'express';

import Comment from '../models/Comment';
import { error } from 'console';
const router=Router();

router.post("/", async (req,res)=>{
    try{
        const comment= new Comment(req.body);
        const savedComment=await comment.save();
        res.status(201).json(savedComment);
    } catch(err:any){
        res.status(400).json({error:err.message});;
    }
});

router.get("/",async(req,res)=>{
    try{
        const comment=await Comment.find();
        res.json(comment);
    }   catch(err:any){
        res.status(500).json({error:err.message});
    }
})

export default router;