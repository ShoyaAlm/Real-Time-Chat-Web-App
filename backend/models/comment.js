const mongoose = require('mongoose')

const ChannelCommentSchema = new mongoose.Schema({
     from:{
            type:mongoose.Types.ObjectId,
            ref:'User',
            required:true      
        },
        msg:{
            type:String,
            required:true
        },
        message:{
            type:mongoose.Types.ObjectId,
            ref:'Message',
            required:true
        },
        replyTo:{
            type:mongoose.Types.ObjectId,
            ref:'Comment',
            default:null
        },
        createdAt: {
            type:Date,
            default: Date.now()
        }
})

const Comment = mongoose.model('Comment', ChannelCommentSchema)

module.exports = Comment