const mongoose=require('mongoose')

const mediaSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        url: {
            type: String,
            trim: true,
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },{
        timestamps: true
    }
)

const Media=mongoose.model('Media',mediaSchema)

module.exports=Media