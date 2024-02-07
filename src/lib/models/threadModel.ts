import mongoose, { Mongoose } from "mongoose";

const threadSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    file:{
        type:String
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    parentId:{
        type:String
    },
    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ]
})
const Thread=mongoose.models.Thread || mongoose.model('Thread',threadSchema)

export default Thread