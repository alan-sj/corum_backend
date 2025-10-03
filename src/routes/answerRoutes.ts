import {Router} from 'express';

import Answer from '../models/Answer.js';

const router= Router();

router.post("/", async (req,res)=>{
    try{
        const answer=new Answer(req.body);
        const savedAnswer=await answer.save();
        res.status(201).json(savedAnswer);
    }   catch(err:any){
        res.status(400).json({error: err.message});
        }
});

router.get("/",async(req,res)=>{
    try{
        const answer=await Answer.find();
        res.json(answer);
    } catch(err:any){
        res.status(500).json({error: err.message});
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
      return res.status(404).json({ error: "Question not found" });
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
      return res.status(404).json({ error: "Question not found"});
    }

    res.json(deletedAnswer);
  } catch (err:any) {
    res.status(500).json({ error : err.message });
  }
});

export default router;
