const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/internship-task',{
    useNewUrlParser: true,
    useCreateIndex: true
})