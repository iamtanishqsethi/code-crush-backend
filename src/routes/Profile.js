const express=require("express")
const {userAuth} = require("../middlewares/auth");
const router=express.Router()

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
module.exports = router;