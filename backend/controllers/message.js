const mongoose = require('mongoose')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')
const {Chat, GroupChat, Channel} = require('../models/chat')
const {BadRequestError, NotFoundError, UnauthorizedError, ServerError} = require('../errors/index')


const client = require('../utils/redisClient')



const getAllMessages = async (req, res) => {
    
    const {user:{userId}, params:{chatId}} = req

    if(!chatId || !userId){
        throw new BadRequestError('Chat ID & userId required!')
    }

    try {

        const updateStart = Date.now()
        
        const cacheKey = `chats:${chatId}:messages`
        
        const cachedMessages = await client.get(cacheKey)

        if(cachedMessages){

            const parsedCachedMessages = JSON.parse(cachedMessages)

            console.log('parsedCachedMessages', Date.now() - updateStart, 'ms')

            return res.status(200).json({
                msg:"redis output",
                nb: parsedCachedMessages.length,
                messages: parsedCachedMessages
            })
        }



        const chat = await Chat.findById(chatId).populate({
            path:"messages",
            populate:{
                path:"from",
                select:"username"
            },
            options:{ sort: {createdAt: 1}}
        }).lean()
        
        console.log('Chat fetch took', Date.now() - updateStart, 'ms')

        if(!chat){
            throw new NotFoundError('No chat was found')
        }


                await client.set(cacheKey, JSON.stringify(chat.messages), {
            EX: 600
        })

        console.log('client.set : ', Date.now() - updateStart, 'ms')

        res.status(200).json({ nb:chat.messages.length, messages:chat.messages })


    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }


}

const sendMessage = async (req, res) => {

    const {params:{chatId}, body:{message, type, messageReplyId}, user:{userId}} = req

    if(!chatId){
        throw new BadRequestError('Chat ID required!')
    }

    try {
    
        const chat = await Chat.findOne({_id:chatId, users:userId})

        if(!chat){
            throw new UnauthorizedError('Unauthorized access. You do not belong to this chat!')
        }

        if(!message || !type){
            throw new BadRequestError('Provide a message and the type!')
        }


        let newMessage
        
        switch(type){
            case 'Text':
                newMessage = new TextMessage({
                    msg:message,
                    from:userId,
                    chat:chatId
                })
                break

            case 'Vote':
                if(!message.topic || !Array.isArray(message.options) || !(message.options.length > 1)){
                    throw new BadRequestError('Enter valid information for making a voting message')
                }
                newMessage = new VoteMessage({
                    topic:message.topic,
                    options:message.options,
                    allVotes:message.allVotes,
                    from:userId,
                    chat:chatId
                })
                break

            case 'Files':
                newMessage = new FileMessage({
                    msg:message.msg,
                    comment:message.comment,
                    from:userId,
                    chat:chatId
                })
                break

            case 'Reply':
                newMessage = new ReplyMessage({
                    msg:message,
                    ref:messageReplyId,
                    from:userId,
                    chat:chatId
                })
                break


            default:
                throw new BadRequestError(`Message type (${type}) is not supported`)
        }



        await newMessage.save()


        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {$push:{messages: newMessage._id}},
            {new:true}
        ).populate({
            path:"messages",
            populate:{
                path:"from",
                select:"name username"
            },
            options:{ sort: {createdAt: 1}}
        })


        const cacheKey = `chats:${chatId}:messages`
        await client.set(cacheKey, JSON.stringify(updatedChat.messages), {
            EX: 600
        })

        res.status(201).json({msg:"new message created", message:newMessage})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }
}

const editMessage = async (req, res) => {

    const {params:{messageId}, body:{userInput}, user:{userId}} = req

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
        throw new ServerError(error)
    }


}

const deleteMessage = async (req, res) => {

    const {params:{chatId, messageId}, user:{userId}} = req

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

    
        const message = await Message.findOne({
            _id:messageId,
            chat:chatId,            
            from:userId
        })
        
        if(!message){
            throw new UnauthorizedError('Unauthorized error. You do not have the permission to delete the message')
        }

        chat.messages = chat.messages.filter(id => !id.equals(message._id))

        await chat.save()

        await Message.findByIdAndDelete(messageId)

        const updatedChat = await Chat.findById(chatId).populate({
            path: "messages",
            populate: { path: "from", select: "username" },
            options: { sort: { createdAt: 1 } }
        })

        const cacheKey = `chats:${chatId}:messages`
        await client.set(cacheKey, JSON.stringify(updatedChat.messages), {
            EX: 600
        })

        res.status(200).json({msg:"message successfully deleted"})
    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }

}


const forwardMessage = async (req, res) => {

    const {params:{chatId, messageId}, body:{selectedChatsId}} = req

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
        throw new ServerError(error)
    }
}


const pinMessage = async (req, res) => {

    const {params:{chatId, messageId}} = req

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
        throw new ServerError(error)
    }

}


module.exports = { getAllMessages, sendMessage,  forwardMessage, editMessage, deleteMessage, pinMessage }