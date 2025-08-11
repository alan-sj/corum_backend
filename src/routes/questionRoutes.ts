import {Router} from 'express';

import Question from '../models/Question';
const router = Router();

router.post("/",async(req,res)=>{
    try{
        const question= new Question(req.body);
        const savedQuestion= await question.save();
        res.status(201).json(savedQuestion);
    }   catch(err:any){
        res.status(400).json({error: err.message});
    }
});

router.get("/",async(req,res)=>{
    try{
        const question=await Question.find();
        res.json(question);
    } catch(err:any){
        res.status(500).json({error: err.message});
    }
})

export default router;