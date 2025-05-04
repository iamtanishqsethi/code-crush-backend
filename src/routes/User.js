const express = require('express');
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest=require("../models/ConnectionRequest.js")
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


module.exports = router;