const express = require("express");
const app = express();
const connectDb=require("./config/database.js")
const cookieParser=require('cookie-parser')
const cors=require("cors");
const UsersAuth=require('./routes/Auth.js')
const Profile=require('./routes/Profile.js')
const Request=require('./routes/Request.js')
const User=require('./routes/User.js')
const Chat=require('./routes/Chat.js')
const http = require('http')
const initSocket=require('./utils/socket.js')

app.use(cors({
    origin:["http://localhost:5173","https://code--crush.vercel.app"],
    credentials: true,
}))
require('dotenv').config();
app.use(express.json())
app.use(cookieParser())

app.use('/user',UsersAuth)
app.use('/api/profile',Profile)
app.use('/api/request',Request)
app.use('/api/user',User)
app.use('/api/chat',Chat)

const server=http.createServer(app);
initSocket(server);

connectDb().then(()=>{
    console.log("connected to database")
    server.listen(7777, () => {
        console.log("Server is successfully listening on port 7777...");
      });
    
}).catch((error)=>{
    console.error("Error connecting to database " + error)
}) 
