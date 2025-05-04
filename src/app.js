const express = require("express");
const app = express();
const connectDb=require("./config/database.js")
const cookieParser=require('cookie-parser')
const UsersAuth=require('./routes/Auth.js')
const Profile=require('./routes/Profile.js')
const Request=require('./routes/Request.js')
const User=require('./routes/User.js')

require('dotenv').config();
app.use(express.json())
app.use(cookieParser())

app.use('/user',UsersAuth)
app.use('/api/profile',Profile)
app.use('/api/request',Request)
app.use('/api/user',User)

connectDb().then(()=>{
    console.log("connected to database")
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777...");
      });
    
}).catch((error)=>{
    console.error("Error connecting to database " + error)
}) 
