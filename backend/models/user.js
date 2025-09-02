const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please provide your name'],
        minLength:3,
        maxLength:30,
    },
    username:{
        type:String,
        required:[true, 'Please provide your username'],
        minLength:5,
        maxLength:20,
        unique:true
    },

    img:{
        type:String,
        default:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'
    },

    bio:{
        type:String,
        default:'hey there, I am a participant.'
    },

    chats:{
        type:mongoose.Types.ObjectId,
        ref:'Chat',
    }
    

})


module.exports = mongoose.model('User', UserSchema)