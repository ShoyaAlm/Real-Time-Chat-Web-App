const mongoose = require('mongoose')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')
const {Chat, GroupChat, Channel} = require('../models/chat')


const getAllMessages = async (req, res) => {
    const {chatId} = req.params


    if(!chatId){
        return res.status(400).json({msg:"Chat ID required!"})
    }

    try {

        const chat = await Chat.findById(chatId).populate({
            path:"messages",
            populate:{
                path:"from",
                select:"name username"
            }
        })
        
        if(!chat){
            return res.status(404).json({msg:"No chat was found"})
        }

        res.status(200).json({nb:chat.messages.length, messages:chat.messages})


    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:error})
    }


}

const sendMessage = async (req, res) => {

    const {chatId} = req.params
    const {userId, message} = req.body


    if(!chatId){
        return res.status(400).json({msg:"Chat ID required!"})
    }

    try {
    
        const chat = await Chat.findById(chatId)

        if(!chat){
            return res.status(404).json({msg:"No chat was found"})
        }

        if(!message){
            return res.status(400).json({msg:"Provide a message!"})
        }

        if(!chat.users.includes(userId)){
            return res.status(401).json({msg:"Unauthorized access. You do not belong to this chat!"})
        }

        const newMessage = new TextMessage({
            msg:message,
            from:userId,
            chat:chatId
        })

        await newMessage.save()


        chat.messages.push(newMessage._id)
        await chat.save()

        res.status(201).json({msg:"new message created", message:newMessage})

    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:error})
    }
}

const editMessage = async (req, res) => {


    const {chatId} = req.params
    const {messageId, userId, userInput} = req.body


    if(!messageId || !userId || !userInput){
        return res.status(400).json({msg:"Must provide message ID, user ID and an input"})
    }

    if(!chatId){
        return res.status(400).json({msg:"Chat ID required!"})
    }

    try {
        const chat = await Chat.findById(chatId)

        if(!chat){
            return res.status(404).json({msg:"Invalid chat ID"})
        }

        const message = await Message.findById(messageId)
        
        if(!message){
            return res.status(404).json({msg:"Invalid message ID"})
        }

        if(!message.from._id.equals(new mongoose.Types.ObjectId(userId))){
            return res.status(401).json({msg:"Unauthorized error. You do not have the permission to modify the message"})
        }

        message.msg = userInput
        message.edited = true

        await message.save()

        res.status(200).json({msg:"message successfully updated"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:error})
    }


}

const deleteMessage = async (req, res) => {

    const {chatId} = req.params
    const {messageId, userId} = req.body


    if(!messageId || !userId){
        return res.status(400).json({msg:"Must provide both message ID and user ID"})
    }

    if(!chatId){
        return res.status(400).json({msg:"Chat ID required!"})
    }


    try {
        const chat = await Chat.findById(chatId)

        if(!chat){
            return res.status(404).json({msg:"Invalid chat ID"})
        }

    
        const message = await Message.findById(messageId)
        
        if(!message){
            return res.status(404).json({msg:"Invalid message ID"})
        }


        

        if(!!message.from._id.equals(new mongoose.Types.ObjectId(userId))){
            return res.status(401).json({msg:"Unauthorized error. You do not have the permission to delete the message"})
        }

        chat.messages.splice(message._id.toString(), 1)

        await chat.save()

        res.status(200).json({msg:"message successfully deleted"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:error})
    }

}


const forwardMessage = (req, res) => {
    // we have the current chat's id, and by clicking on any other chat on the modal(to forward our message)...
    // we also save the id of the selected(destination) chats
    res.send('forward message')
}


const pinMessage = (req, res) => {
    // add this message with its properties to the pinnedMessages
    res.send('pin message')
}


module.exports = { getAllMessages, sendMessage,  forwardMessage, editMessage, deleteMessage, pinMessage }