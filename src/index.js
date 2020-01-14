const express=require('express')
require('./db/mongoose')
const userRouter=require('./routers/user')
const mediaRouter=require('./routers/media')
const cors=require('cors')
const app=express()
const port=process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('Welcome to the API!')
})

app.use(userRouter)
app.use(mediaRouter)

app.listen(port,()=>{
    console.log('Server is up at port ' + port)
})