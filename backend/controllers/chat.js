const User = require('../models/user')
const {Chat, GroupChat, Channel} = require('../models/chat')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')


const getAllChats = async (req, res) => {
    const {userId} = req.params

    if(!userId){
        return res.status(400).json({msg:"No user ID provided"})
    }

    const chats = await User.findById(userId)

    if(!chats){
        return res.status(404).json({msg:"Wrong user credentials"})
    }
    

    res.status(200).json({chats: chats})
}

const makeChat = async (req, res) => {
    const {userId1, userId2, message, type} = req.body

    if(!userId1 || !userId2){
        return res.status(400).json({msg:"Please provide the id of both users"})
    }

    try {
        const user1 = await User.findById(userId1)
        const user2 = await User.findById(userId2)


        if(!user1 || !user2){
            return res.status(404).json({msg:"at least 1 user id is wrong"})
        }

        if(!message){
            return res.status(400).json({msg:"Message cannot be empty"})
        }



        const newChat = new Chat({
            type:"chat",
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

const makeGroup = (req, res) => {
    res.send('creating group')
}

const makeChannel = (req, res) => {
    res.send('creating channel')
}

const deleteChat = (req, res) => {
    res.send('deleting chat')
}


module.exports = {getAllChats, makeChat, makeGroup, makeChannel, deleteChat}

