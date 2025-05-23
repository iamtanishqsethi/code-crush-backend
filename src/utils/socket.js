const socket=require("socket.io")
const crypto = require("crypto")
const Chat = require("../models/chat.js")
const ConnectionRequest = require("../models/ConnectionRequest");

const getSecretRoomId=(userId,targetUserId)=>{
    return crypto.createHash("sha256").update([userId,targetUserId].sort().join('_')).digest("hex")
}

const onlineUsers=new Map()//map to store all online users

const initSocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin:["http://localhost:5173","https://code--crush.vercel.app"],
        }
    })

    io.on("connection",(socket)=>{
        //handle events

        socket.on("joinChat",({userId,targetUserId})=>{
            //event for people who want to join chat
            //need to create a separate room for these to users

            const room=getSecretRoomId(userId,targetUserId)//sorting to make the room same for both users
            console.log("Joining room "+ room)
            socket.join(room)

            //when new user joins room
            //1. all the users should know about his online status
            onlineUsers.set(userId,socket.id)
            io.to(room).emit("userOnlineStatus",({userId,isOnline:true}))

            //2. the joining user  should also know if the target user is already online when user is joining
            if(onlineUsers.has(targetUserId)){
                socket.emit("userOnlineStatus",({userId:targetUserId,isOnline:true}))
            }

        })

        socket.on("leaveChat",({userId,targetUserId})=>{
            const room=getSecretRoomId(userId,targetUserId)

            onlineUsers.delete(userId)
            io.to(room).emit("userOnlineStatus",({userId,isOnline:false}))
            socket.leave(room)
        })

        socket.on("sendMessage",async ({firstName,lastName,photoUrl,userId,targetUserId,text})=>{

            try{
                //event for sending  messages
                const room=getSecretRoomId(userId,targetUserId)

                //check if the users are friends or not

                const connectedRequest=await ConnectionRequest.find({
                    status: "accepted",
                    $or:[{toUserId:userId,fromUserId:targetUserId},{toUserId:targetUserId,fromUserId:userId}]
                })
                if(!connectedRequest){
                    throw new Error("Connection between user is not defined ")
                }


                //save message in database
                let chat=await Chat.findOne({
                    participants:{$all:[userId,targetUserId]}
                })
                if(!chat){//first message , chat didn't exist before
                    chat=new Chat({
                        participants:[userId,targetUserId],
                        messages:[]
                    })
                }
                chat.messages.push({
                    senderId:userId,
                    text:text
                })
                await chat.save()
                io.to(room).emit("newMessageReceived",{firstName,lastName,photoUrl,text,_id:userId,timestamp:new Date()})
            }catch(error){
                console.log(error)
            }

        })
        socket.on("disconnect",()=>{
            //event for disconnecting

            //cleanup process
            let disconnectedUserId = null

            onlineUsers.forEach((socketId, userId) => {
                if (socketId === socket.id) {
                    disconnectedUserId = userId
                }
            })

            if (disconnectedUserId) {
                onlineUsers.delete(disconnectedUserId);
                io.emit("userOnlineStatus", { userId: disconnectedUserId, isOnline:false })
            }
        })
    })

}
module.exports=initSocket;