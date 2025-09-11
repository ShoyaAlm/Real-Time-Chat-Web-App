const UserModel = require('../models/user')
const {Chat, NormalChat, GroupChat, ChannelChat} = require('../models/chat')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')

const getUserChats = async (req, res) => {
    const {userId} = req.params

    if(!userId){
        return res.status(400).json({msg:"No user ID provided"})
    }

    try {
        const user = await UserModel.findById(userId)
    
        if(!user){
            return res.status(404).json({msg:"Wrong user credentials"})
        }
        
        res.status(200).json({chats: user.chats})
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:error})
    }
}

const allChats = async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate('users', 'name')
            .populate('messages')
        
        res.status(200).json({nb:chats.length, chats:chats})
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:error})
    }
}

const makeChat = async (req, res) => {
    const {userId1, userId2, message} = req.body

    if(!userId1 || !userId2){
        return res.status(400).json({msg:"Please provide the id of both users"})
    }

    try {
        const user1 = await UserModel.findById(userId1)
        const user2 = await UserModel.findById(userId2)


        if(!user1 || !user2){
            return res.status(404).json({msg:"at least 1 user id is wrong"})
        }

        if(!message){
            return res.status(400).json({msg:"Message cannot be empty"})
        }


        const chatExists = await NormalChat.findOne({
            type:'Normal',
            users:{$all:[userId1, userId2]},
            $expr:{ $eq: [{$size: "$users"}, 2]}
            },
        )

        if(chatExists){
            return res.status(400).json({msg:"Chat between 2 users already exists!", chat:chatExists})
        }


        const newChat = new NormalChat({
            name:`${user1.name} ${user2.name}`,
            users:[userId1, userId2],
            messages:[]
        })

        await newChat.save()

        
        const newMessage = new TextMessage({
            msg: message,
            from: userId1,
            chat: newChat._id
        })

        await newMessage.save()


        newChat.messages.push(newMessage._id)
        await newChat.save()


        user1.chats.push(newChat._id)
        user2.chats.push(newChat._id)


        await user1.save()
        await user2.save()
        

        res.status(201).json(newChat)

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({msg:"Error in creating the chat", err: error.message})
    }


}

const makeGroup = async (req, res) => {

    const {userId, name, bio} = req.body

    if(!userId || !name){
        return res.status(400).json({msg:"Enter both user ID and group name!"})
    }


    try {

        console.log('User model:', typeof UserModel);
        
        const user = await UserModel.findById(userId)

        if(!user){
            return res.status(404).json({msg:"User not found"})
        }


        const newGroup = new GroupChat({
            name:name,
            users:[userId],
            messages:[],
            bio:bio
        })

        await newGroup.save()


        res.status(201).json({msg:"Group was successfully created", group:newGroup})

    } catch (error) {
        console.log(error);
        return res.status(404).json({msg:error})        
    }


}

const makeChannel = async (req, res) => {

      const {userId, name, link, bio} = req.body

    if(!userId || !name || !link){
        return res.status(400).json({msg:"Enter user ID, channel name and a link"})
    }


    try {
        
        const user = await UserModel.findById(userId)

        if(!user){
            return res.status(404).json({msg:"User not found"})
        }


        const newChannel = new ChannelChat({
            name:name,
            users:[userId],
            link:link,
            messages:[],
            bio:bio
        })

        await newChannel.save()

        res.status(201).json({msg:"Channel was successfully created", channel: newChannel})

    } catch (error) {
        console.log(error);
        return res.status(404).json({msg:error})        
    }

}

const deleteChat = async (req, res) => {

    const {chatId} = req.params
    const {userId} = req.body

    if(!chatId){
        return res.status(400).json({msg:"Chat ID required!"})
    }

    if(!userId){
        return res.status(401).json({msg:"Provide User ID!"})
    }

    try {
        
        const chat = await Chat.findById(chatId)

        if(!chat){
            return res.status(404).json({msg:"Invalid chat ID"})
        }

        if(!chat.users.includes(userId)){
            return res.status(401).json({msg:"Authentication failed. You are not part of the Chat to delete it"})
        }

        await Chat.findOneAndDelete({_id:chatId})

        res.status(200).json({msg:"chat successfully deleted"})

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:error})
        
    }

}


module.exports = {getUserChats, allChats, makeChat, makeGroup, makeChannel, deleteChat}

