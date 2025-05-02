const express = require("express");
const connectDb=require("./config/database.js")
const User=require('./models/user.js')
const app = express();
require('dotenv').config();
const {validateSignUpData}=require("./utils/validation.js")
const bcrypt=require('bcrypt')
const validator=require("validator")
app.use(express.json())

app.post("/signUp",async (req,res)=>{
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
        res.send("User Added successfully!");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

app.post('/login',async (req,res)=>{
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
        res.status(200).send("Login successfull")



    } catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

app.get('/feed',async (req,res)=>{
    try{
        const users=await User.find({})
        res.send(users)
    }catch(err){
        res.status(400).send("Something Went wrong")
    }
})

app.delete('/user/:id',async(req,res)=>{
    const userId=req.params.id
    try{
        const user=await User.findByIdAndDelete(userId)
        res.send(user)
    }catch(error){
        res.status(400).send("Something Went wrong")
    }
})

app.patch('/user/:id',async(req,res)=>{
    const userId=req.params.id
    const data=req.body
    

    try{
        const ALLOWED_UPDATES=[
            "photoUrl","firstName","lastName","password","age","gender","about","skills"
        ]
    
        const isUpdateAllowed=Object.keys(data).every(k=>ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed){
            throw new Error("update not allowed")
        }
        const user=await User.findByIdAndUpdate(userId,data,{
            new:true,
            runValidators:true
        },)
        res.send(user)
    }catch(error){
        res.status(400).send("Something Went wrong"+ error)
    }
})


connectDb().then(()=>{
    console.log("connected to database");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777...");
      });
    
}).catch((error)=>{
    console.error("Error connecting to database")
}) 
