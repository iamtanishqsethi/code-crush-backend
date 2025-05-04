const express = require('express');
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest=require("../models/ConnectionRequest.js");
const User=require("../models/user.js");
const router=express.Router()

router.post('/send/:status/:toUserId',userAuth , async (req,res)=>{

    try{

        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        if(toUserId.toString()===fromUserId.toString()) throw new Error("Incorrect user id");

        const allowedStatus=["ignored","interested"]
        if(!allowedStatus.includes(status)) throw new Error(`Invalid status: ${status}`);

        const toUser=await User.findById(toUserId);
        if(!toUser) throw new Error(`Invalid user`)

        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {
                    fromUserId:fromUserId,
                    toUserId:toUserId
                },
                {
                    fromUserId: toUserId,
                    toUserId:fromUserId,
                }
            ]

        })
        if(existingConnectionRequest) throw new Error("Connection already exists");


        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data=await connectionRequest.save();
        if(!data) throw new Error("could not send connection request");

        res.json({message:"connection successfully sent",data})

    }
    catch(error){
        res.status(400).json({ message:`${error}` });
    }

})

router.post('/review/:status/:requestId',userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const status=req.params.status;
        const requestId=req.params.requestId;


        const allowedStatus=["accepted","rejected"]
        if(!allowedStatus.includes(status)) throw new Error(`Invalid status: ${status}`);

        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest) throw new Error("Connection not found");

        connectionRequest.status=status;
        const data=await connectionRequest.save()
        if(!data) throw new Error("could not send connection request");

        res.json({message:`Connection Request ${status}`,
        data})
    }
    catch(error){
        res.status(400).json({ message:`${error}` });
    }


})

module.exports=router;