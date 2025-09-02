const mongoose = require('mongoose')
const crypto = require('crypto')


const ChatSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please provide the name'],
        minLength:3,
        maxLength:30,
    },

    img:{
        type:String,
        default:"https://wallpaper.dog/large/20675505.jpg"
    },
    
    messages:{
        type:mongoose.Types.ObjectId,
        ref:'Message',
    },

    pinnedMessages:[{
        type:mongoose.Types.ObjectId,
        ref:'Message'
    }],


    type:{
        enum:['chat', 'group', 'channel']
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

const Chat = mongoose.model('Chat', ChatSchema)

const GroupChatSchema = new mongoose.Schema({

    users:{
        type: mongoose.Types.ObjectId,
        ref:'User',
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

// GroupChatSchema.methods.

const ChannelSchema = new mongoose.Schema({

    users:{
        type: mongoose.Types.ObjectId,
        ref:'User',
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


const GroupChat = Chat.discriminator('Group', GroupChatSchema)

const Channel = Chat.discriminator('Channel', ChannelSchema)


module.exports = { Chat, GroupChat, Channel }
