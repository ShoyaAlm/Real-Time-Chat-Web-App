const mongoose = require('mongoose')
const crypto = require('crypto')



const ChatSchema = new mongoose.Schema({


    img:{
        type:String,
        default:"https://wallpaper.dog/large/20675505.jpg"
    },
    
    messages:[{
        type:mongoose.Types.ObjectId,
        ref:'Message',
    }],


    users:[{
        type: mongoose.Types.ObjectId,
        ref:'User',
        unique:true
    }],

    pinnedMessages:[{
        type:mongoose.Types.ObjectId,
        ref:'Message'
    }],


    type:{
        type:String,
        enum:['Normal', 'Group', 'Channel'],
        required:true
    },

    createdAt:{
        type:Date, 
        default: Date.now
    },

    lastUpdatedAt:{
        type:Date, 
        default: Date.now
    }
},{discriminatorKey:'type'})


const NormalChatSchema = new mongoose.Schema({

    name:{
        type:String,
    },

})


const GroupChatSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please provide the name'],
        minLength:3,
        maxLength:30,
    },

    bio:{
        type:String,
        default:'',
        maxLength:30,
    },
    
    inviteLink:{
        type:String,
        required:[true],
        unique:true
    },

})


const ChannelSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please provide the name'],
        minLength:3,
        maxLength:30,
    },

    bio:{
        type:String,
        default:'',
        maxLength:30,
    },
    
    link:{
        type:String,
        required:[true, 'Please provide the link'],
        minLength:5,
        maxLength:20,
        unique:true
    },

})



function inviteLinkGeneration() {
    return crypto.randomBytes(8).toString('hex')
}

GroupChatSchema.pre('save', async function (next){
    if(!this.inviteLink){
        let link;
        let isLinkUnique = false;

        while(!isLinkUnique){
            link = inviteLinkGeneration();
            const linkExists = await this.constructor.findOne({inviteLink: link})
            if(!linkExists) isLinkUnique = true
        }
        this.inviteLink = link
    }
    next()
})


const Chat = mongoose.model('Chat', ChatSchema)

const NormalChat = Chat.discriminator('Normal', NormalChatSchema)
const GroupChat = Chat.discriminator('Group', GroupChatSchema)
const Channel = Chat.discriminator('Channel', ChannelSchema)

module.exports = { Chat, NormalChat, GroupChat, Channel }