const express=require("express")
const router=express.Router()
const {validateSignUpData}=require("../utils/validation.js")
const bcrypt=require('bcrypt')
const validator=require("validator")
const jwt=require("jsonwebtoken")
const User=require('../models/user.js')

router.post("/signUp",async (req,res)=>{
    try {
    
        validateSignUpData(req)

        const passwordHash=await bcrypt.hash(req.body.password,10)

        const user=new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            emailId:req.body.emailId,
            password:passwordHash
        })
        
        await user.save();

        const token = await jwt.sign({ _id: user._id }, process.env.JWT_KEY,{expiresIn:'1d'})
        res.cookie("token",token,{
            maxAge:3600000*24,
            httpOnly:true,
            secure:true,
        })
        res.status(201).send("User Added successfully!")
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

router.post('/login',async (req,res)=>{
    try{
        const {emailId,password}=req.body
        
        if (!emailId || !password) {
            throw new Error("Email and password are required");
        }

        //validate email
        if(!validator.isEmail(emailId)){
            throw new Error("Email is not valid")
        }
        const user=await User.findOne({emailId})
        if(!user){
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid) {
            throw new Error("Invalid Credentials")
        }
        //create jwt token
        const token=await jwt.sign({_id:user._id},process.env.JWT_KEY,{expiresIn:'1d'})
        
        res.cookie("token",token,{
            maxAge: 3600000*24,
            httpOnly: true,
            secure: true,
            sameSite:'none'
        })
        //add token to cookie and send response back to user 

        res.status(200).send(user)



    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

router.post('/logout',async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("Logged out")
})

module.exports=router;