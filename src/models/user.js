const mongoose = require("mongoose");
const validator=require('validator')
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    trim:true,
    minLength:3,
    maxLength:50
  },
  lastName: {
    type: String,
    trim:true
  },
  emailId: {
    type: String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)) throw new Error("not a valid email")
    }
  },
  password: {
    type: String,
    required:true,
    minLength:6
  },
  age: {
    type: Number,
    min:16,
  },
  gender: {
    type: String,
    trim:true,
    validate(value){
        if(!["male","female","others"].includes(value)){
          throw new Error ("gender data is not valid")
        }
    }
  },
  photoUrl:{
    type:String,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    trim:true,
    validate(value){
      if(!validator.isURL(value)) throw new Error("not a valid photo url")
    }
  },
  about:{
    type:String,
    default:"Default about for the user",
    trim:true
  },
  skills:{
    type:[String],
    maxLength:25
  }
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);