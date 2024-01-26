const express = require('express');
const mongoose = require('mongoose')
const  authMiddleware  = require('./middleware');
const { Account } = require('../db');
const router = express.Router();

router.get("/balance",authMiddleware,async(req,res)=>{
    console.log(req.userId)
    const account=await Account.findOne(
        {userId:req.userId}
    );
   

    if (!account) {
        return res.status(404).json({
            error: "Account details not found for the specified user"
        });
    }
       return res.status(200).json({
            balance:account.balance
           
        })
})

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const { to,amount } = req.body;

   const account=await Account.findOne({userId:req.userId}).session(session);

   if(!account || account.balance<amount){
    await session.abortTransaction();
    return res.status(400).json({
        message:"Insufficient balance"
    });
   }
const toAccount = await Account.findOne({
    userId:to
}).session(session);
if(!toAccount){
    await session.abortTransaction();
    return res.status(400).json({
        message:"Invalid account"
    })
}
//perform transfer
await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
await Account.updateOne({userId:to},{$inc:{balance: amount}}).session(session);

await session.commitTransaction();
res.json({
    message:"Transfer Successful"
})
})
module.exports=router;
    
