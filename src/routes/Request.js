const express = require('express');
const {userAuth} = require("../middlewares/auth");
const router=express.Router()

router.post('/sendConnectionRequest',userAuth , async (req,res)=>{
    console.log("sending connection request")

    res.send("connection request sent")
})

module.exports=router;