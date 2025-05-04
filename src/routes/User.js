const express = require('express');
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest=require("../models/ConnectionRequest.js")
const User=require("../models/user.js")
const router = express.Router();

router.get('/requests',userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const pendingRequests=await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl"]);

        res.json({message:"Data fetched successfully.",data:pendingRequests})


    } catch(error){
        res.status(400).json({message:`${error}`});
    }
})
router.get('/connections',userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectedRequest=await ConnectionRequest.find({
            status: "accepted",
            $or:[{toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}]
        }).populate("fromUserId",["firstName","lastName","photoUrl"]).populate("toUserId",["firstName","lastName","photoUrl"]);

        const data=connectedRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id){
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({message:"Data fetched successfully.",data})
    }
    catch(error){
        res.status(400).json({message:`${error}`});
    }
})

router.get('/feed',userAuth,async (req,res)=>{
    try{

        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50 ? 50 : limit;
        const skip=(page-1)*limit;

        const loggedInUser=req.user;
        //all connection requests that the user has sent or received
        const connectionRequests=await ConnectionRequest.find({
            $or:[{toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}]
        }).select("fromUserId toUserId")

        const hiddenUsers=new Set();
        connectionRequests.forEach(req=>{
            hiddenUsers.add(req.fromUserId.toString())
            hiddenUsers.add(req.toUserId.toString())
        })

        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hiddenUsers)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName photoUrl age gender about skills").skip(skip).limit(limit)
        res.send(users)
    }
    catch(error){
        res.status(400).json({message:`${error}`});
    }
})


module.exports = router;