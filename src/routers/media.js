const express=require('express')
const Media=require('../models/media')
const router=new express.Router()
const multer=require('multer')
const User=require('../models/user')
const path=require('path')
const fs=require('fs')
const auth=require('../middleware/auth')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../videos'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const upload=multer({
    fileFilter(req,file,cb){
        if(!file.originalname.endsWith('.mp4')){
            return cb(new Error('File must be a video'))
        }
        cb(undefined,true)
    },
    storage: storage,
    limits:{
        fileSize: 10000000
    }
})

router.post('/video',auth, upload.single('upload'),async(req,res)=>{
    const user= await User.findOne({email: req.user.email})
    if(!user){
        throw new Error()
    }
    const media=new Media({owner: user._id})
    media['name']=req.file.originalname
    media['url']=`http://localhost:3000/video/${media._id}`
    // path.join(path.join(__dirname,'../videos'), media._id)
    try{
        await media.save()
        res.status(201).send(media)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/get-videos',auth,async(req,res)=>{
    try{
        const user=await User.findOne({email: req.user.email})
        if(!user){
            throw new Error()
        }
        Media.find({owner: user._id}).then((media)=>{
            if(!media){
                return res.status(404).send()
            }
            res.send(media)
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/video/:id',auth,async(req,res)=>{
    try{
        Media.findOne({_id: req.params.id}).then((media)=>{
            if(!media){
                return res.status(404).send('No Media Found')
            }
            // console.log(media.name)
            // console.log(path.join(path.join(__dirname,'../videos'), media.name))
            const file=fs.createReadStream(path.join(path.join(__dirname,'../videos'), media.name))
            // const stat=fs.statSync(path.join(path.join(__dirname,'../videos'), media.name))
            res.setHeader('Content-Type','video/mp4')
            file.pipe(res)
            // res.download(path.join(path.join(__dirname,'../videos'), media.name))
        })
    } catch(e){
        res.status(400).send(e)
    }
})

module.exports=router