const express = require("express");
const {userAuth} = require("../middlewares/auth");
const router = express.Router();
const Chat=require("../models/chat.js");

router.get('/:targetUserId',userAuth,async (req,res)=>{
    const {targetUserId} = req.params;

    const userId=req.user._id;

    try{
        let chat=await Chat.findOne({
            participants:{$all:[userId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:["firstName","lastName","photoUrl"]
        })
        if(!chat){
            chat=new Chat({
                participants:[userId,targetUserId],
                messages:[]
            })
            await chat.save()

        }
        res.json(chat)
    }
    catch(error){
        res.status(400).json({ message:`${error}` });
    }
})

module.exports = router;