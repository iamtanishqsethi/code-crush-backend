const express=require('express')
const app =express()

app.use("/api",(req,res)=>{res.send('hello')})
app.use('/t',(req,res)=>{res.send('t')})
app.use("/",(req,res)=>{
    res.send('hello from server')
})



app.listen(3300,()=>console.log('Server started'));