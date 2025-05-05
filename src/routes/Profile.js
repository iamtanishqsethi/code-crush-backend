const express=require("express")
const {userAuth} = require("../middlewares/auth.js");
const {validateEditProfileData,validatePassword}=require('../utils/validation.js')
const router=express.Router()
const User=require('../models/user.js')
const bcrypt=require('bcrypt')

router.get('/',userAuth,async (req,res) => {
    try{

        const user=req.user
        if(!user) throw new Error("User not found");
        res.send(user)
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }

})

router.patch('/edit',userAuth,async (req,res) => {
    try{
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send("Empty update body.");
        }
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const user=req.user
        if(!user) throw new Error("User not found");
        const id=user._id;

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).send(updatedUser)
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }

})

router.patch('/forgetPassword/:id',userAuth,async (req,res) => {
    try{
        const id=req.params.id;
        const {emailId,oldPassword,newPassword}=req.body;
        if (!emailId || !oldPassword || !newPassword) {
            throw new Error("Email and password are required");
        }
        const user=await User.findOne({emailId})
        if(!user) throw new Error("Invalid Credentials");

        const isOldPasswordValid=await bcrypt.compare(oldPassword,user.password)
        if(!isOldPasswordValid){
            throw new Error("Invalid Credentials")
        }
        validatePassword(newPassword)

        const passwordHash=await bcrypt.hash(newPassword,10)
        await User.findByIdAndUpdate(id,{
            password: passwordHash,
        })
        res.status(200).send("Password updated successfully");

    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})
module.exports = router;