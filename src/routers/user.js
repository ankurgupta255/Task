const express=require('express')
const User=require('../models/user')
const router=new express.Router()
const {passwordResetEmail}= require('../emails/account')
const auth=require('../middleware/auth')

router.post('/signup', async(req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        const token=await user.generateAuthToken()
        res.status(201).send({
            user: user.getPublicProfile(), token
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/signin', async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email, req.body.password)
        // const token=await user.generateAuthToken()
        res.send({
            user: user.getPublicProfile()
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/user',auth, async(req,res)=>{
    try{
        // const user= await User.findOne({email: req.body.email})
        // if(!user){
        //     throw new Error()
        // }
        res.send(req.user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.post('/reset-password',auth, async(req,res)=>{
    try{
        const user= await User.findOne({email: req.user.email})
        if(!user){
            throw new Error()
        }
        const uniquecode= Math.floor(Math.random() * 9999)
        passwordResetEmail(user.email,user.name, uniquecode)
        user['uniquecode']=uniquecode
        await user.save()
        res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.post('/change-password',auth, async(req,res)=>{
    try{
        const user=await User.findOne({email: req.user.email})
        if(!user){
            throw new Error()
        }
        if(req.body.uniquecode!=user.uniquecode){
            throw new Error()
        }
        user['password']=req.body.password
        await user.save()
        res.send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports=router
