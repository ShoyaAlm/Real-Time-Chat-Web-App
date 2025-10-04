const mongoose = require('mongoose')
const crypto = require('crypto')
const User = require('./user')

const {Message} = require('./message')



const UsersInChatSchema = new mongoose.Schema({

    user:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    role:{
        type:String,
        enum:['normal', 'admin'],
        default:'normal'
    }

})

const ChatSchema = new mongoose.Schema({

    
    messages:[{
        type:mongoose.Types.ObjectId,
        ref:'Message',
    }],

    users:[UsersInChatSchema],

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

    name:[{
        type:String,
    }],

})


const GroupChatSchema = new mongoose.Schema({


    img:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/6540/6540763.png"
    },
    
    name:{
        type:String,
        required:[true, 'Please provide the name'],
        minLength:2,
        maxLength:30,
    },

    bio:{
        type:String,
        default:'',
        maxLength:30,
    },
    
    inviteLink:{
        type:String,
        unique:true
    },

})


const ChannelChatSchema = new mongoose.Schema({


    img:{
        type:String,
        default:"https://www.pngkey.com/png/detail/230-2301779_best-classified-apps-default-user-profile.png"
    },

    name:{
        type:String,
        required:[true, 'Please provide the name'],
        minLength:2,
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

    try {
        if (this.isNew && this.users && this.users.length > 0){
            await User.updateMany(
                {_id: {$in: this.users}}, // checks if the _id exists $in the 'this.user'
                {$addToSet:{ chats:this._id}} // we add a value to an array if it doesn't already exist
            )
        }

        next()

    } catch (error) {
        next(error)
    }

})

ChannelChatSchema.pre('save', async function (next){

    try {
        if(this.isNew && this.users && this.users.length >= 0){
            await User.updateMany(
                {_id: {$in: this.users}},
                {$addToSet: {chats:this._id}}
            )
        }
    } catch (error) {
        next()   
    }

})


ChatSchema.pre('findOneAndDelete', async function(next){

    try {
        const chat = await this.model.findOne(this.getFilter())

        if(chat){
            await Message.deleteMany({chat:chat._id})
        }

        await mongoose.model('User').updateMany(
            {chats:chat._id},
            {$pull:{chats: chat._id}}
        )

        next()
        
    } catch (error) {
        next(error)
    }

})

const Chat = mongoose.model('Chat', ChatSchema)

const NormalChat = Chat.discriminator('Normal', NormalChatSchema)
const GroupChat = Chat.discriminator('Group', GroupChatSchema)
const ChannelChat = Chat.discriminator('Channel', ChannelChatSchema)

module.exports = { Chat, NormalChat, GroupChat, ChannelChat }