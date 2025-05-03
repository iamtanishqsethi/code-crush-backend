const jwt=require("jsonwebtoken")
const User=require("../models/user.js")
const userAuth = async (req, res, next) => {
  try{
    //read the token from req.cookie
    const cookies=req.cookies
    const {token}=cookies
    if(!token) throw new Error("Token not found");
    //validate the token 
    const decodedValue=await jwt.verify(token,process.env.JWT_KEY)
    //find the user
    const user=await User.findById(decodedValue._id)
    if(!user) throw new Error("User not found");
    req.user=user
    next()
  }  
  catch(err){
    res.status(404).send("ERROR : " + err.message);
  }
  
};
  
  module.exports = {
    userAuth,
  };