const mongoose = require('mongoose')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')
const {Chat, GroupChat, Channel} = require('../models/chat')
const {BadRequestError, NotFoundError, UnauthorizedError, ServerError} = require('../errors/index')


const getAllMessages = async (req, res) => {
    
    const {chatId} = req.params
    const {userId} = req.body

    if(!chatId || !userId){
        throw new BadRequestError('Chat ID & userId required!')
    }

    try {

        await Message.updateMany(
            {chat: chatId, seen: false, from: {$ne: userId}},
            {$set: {seen:true}}
        )

        const chat = await Chat.findById(chatId).populate({
            path:"messages",
            populate:{
                path:"from",
                select:"name username"
            },
            options:{ sort: {createdAt: 1}}
        })
        
        if(!chat){
            throw new NotFoundError('No chat was found')
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
        throw new BadRequestError('Chat ID required!')
    }

    try {
    
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new NotFoundError('No chat was found')
        }

        if(!message){
            throw new BadRequestError('Provide a message!')
        }

        if(!chat.users.includes(userId)){
            throw new UnauthorizedError('Unauthorized access. You do not belong to this chat!')
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
        throw new BadRequestError('Must provide message ID, user ID and an input')
    }

    if(!chatId){
        throw new BadRequestError('Chat ID required!')
    }

    try {
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new NotFoundError('Invalid chat ID')
        }

        const message = await Message.findById(messageId)
        
        if(!message){
            throw new NotFoundError('Invalid message ID')
        }

        if(!message.from._id.equals(new mongoose.Types.ObjectId(userId))){
            throw new UnauthorizedError('Unauthorized error. You do not have the permission to modify the message')
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
        throw new BadRequestError('Must provide both message ID and user ID')
    }

    if(!chatId){
        throw new BadRequestError('Chat ID required!')
    }


    try {
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new NotFoundError('Invalid chat ID')
        }

    
        const message = await Message.findById(messageId)
        
        if(!message){
            throw new NotFoundError('Invalid message ID')
        }

        if(!!message.from._id.equals(new mongoose.Types.ObjectId(userId))){
            throw new UnauthorizedError('Unauthorized error. You do not have the permission to delete the message')
        }

        chat.messages.splice(message._id.toString(), 1)

        await chat.save()

        res.status(200).json({msg:"message successfully deleted"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:error})
    }

}


const forwardMessage = async (req, res) => {

    const {chatId} = req.params
    const {messageId, selectedChatsId} = req.body


    if(!messageId || !selectedChatsId){
        throw new BadRequestError('Must provide message ID and chosen chats ID')
    }

    if(!chatId){
        throw new BadRequestError('Chat ID required!')
    }

    try {
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new NotFoundError('Invalid chat ID')
        }

        const message = await Message.findById(messageId)
        
        if(!message){
            throw new NotFoundError('Invalid message ID')
        }

        selectedChatsId.map(async (chatId) => {
            
            const chat = await Chat.findById(chatId)
            
            if(!chat){
                throw new NotFoundError('selected chat ID is invalid')
            }

            const newMessageData = {
                from: message.from,
                type: message.type,
                forwarded: true,
                msg: message.msg,
                chat: chatId
            }

            const Model = Message.discriminators[message.type]
            const newMessage = new Model(newMessageData)
            await newMessage.save()

            await Chat.findByIdAndUpdate(chatId,
                {$push: {messages: newMessage._id}},
                {$set: {$lastUpdatedAt: new Date()}}
            )

        })


        res.status(201).json({msg:"message successfully forwarded"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:error})
    }
}


const pinMessage = async (req, res) => {

    const {chatId} = req.params
    const {messageId} = req.body


    if(!messageId){
        throw new BadRequestError('Must provide message ID')
    }

    if(!chatId){
        throw new BadRequestError('Chat ID required!')
    }


    try {
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new NotFoundError('Invalid chat ID')
        }

    
        const message = await Message.findById(messageId)
        
        if(!message){
            throw new NotFoundError('Invalid message ID')
        }

        if(!chat.pinnedMessages.includes(message._id)){
            
            chat.pinnedMessages.push(message)
            
            await chat.save()
        } else {
            throw new BadRequestError('This message was already pinned!')
        }



        res.status(201).json({msg:"message successfully pinned", chat:chat})

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:error})
    }

}


module.exports = { getAllMessages, sendMessage,  forwardMessage, editMessage, deleteMessage, pinMessage }