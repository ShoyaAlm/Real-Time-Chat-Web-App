const mongoose = require('mongoose')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')
const {Chat, GroupChat, Channel} = require('../models/chat')
const {BadRequestError, NotFoundError, UnauthorizedError, ServerError} = require('../errors/index')
const {updateMessageCache, updatePinnedMessageCache} = require('./cache')
require('dotenv').config()
const client = require('../utils/redisClient')

const ftp = require('basic-ftp')
const fs = require('fs')
const path = require('path')


const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const getAllMessages = async (req, res) => {
    
    const {user:{userId}, params:{chatId}} = req

    if(!chatId || !userId){
        throw new BadRequestError('Chat ID & userId required!')
    }

    try {
        
        const cacheKey = `chats:${chatId}:messages`
        
        const cachedMessages = await client.get(cacheKey)

        if(cachedMessages){

            const parsedCachedMessages = JSON.parse(cachedMessages)
            return res.status(200).json({
                msg:"cache output",
                nb: parsedCachedMessages.length,
                messages: parsedCachedMessages
            })
        }



        const chat = await Chat.findById(chatId).populate([{
            path:"messages",
            populate:[
                {path:"from",select:"name"},
                {path:"origin", select:"name"},
                {
                    path:"ref", 
                    select:"msg type",
                    populate:{path:"from", select:"name"}
                },
                {
                    path:"allVotes",
                    populate:{path:"voter", select:"name"},
                },
                {
                    path:"files",
                    
                }
        ],
            options:{ sort: {createdAt: 1}, limit:20}
        },
    ]).lean()
        
        if(!chat){
            throw new NotFoundError('No chat was found')
        }


        const retrievedMessages = chat.messages.map(message => {
            const baseMessage = {
                _id: message._id,
                from: message.from,
                origin: message.origin,
                createdAt: message.createdAt,
                type: message.type,
                edited: message.edited,
                forwarded: message.forwarded,
                seen: message.seen,
                chat: message.chat
            }


            switch (message.type) {
                case 'Text':
                    return {...baseMessage, msg: message.msg}

                case 'Reply':
                    return {...baseMessage, msg: message.msg, ref:message.ref}

                case 'Vote':
                    return {...baseMessage, topic: message.topic, options: message.options, allVotes:message.allVotes}
                
                case 'Files':
                    return {...baseMessage, files: message.files, comment: message.comment}

                default:
                    return baseMessage;
            }


        })


        await client.set(cacheKey, JSON.stringify(retrievedMessages), {
            EX: 600
        })

        res.status(200).json({msg:"non-cache output", nb:retrievedMessages.length, messages:retrievedMessages })


    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }


}

const sendMessage = async (req, res) => {

    const {
        params:{chatId}, 
        body:{message, type, messageToReplyId, topic, options, allVotes}, 
        user:{userId}} = req

    if(!chatId){
        throw new BadRequestError('Chat ID required!')
    }

    try {

        if(type !== 'Vote' && type !== 'Files'){
            if(!message) throw new BadRequestError('Provide a message!')
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
                if(!topic || !Array.isArray(options) || !(options.length > 1)){
                    throw new BadRequestError('Enter valid information for making a voting message')
                }
                newMessage = new VoteMessage({
                    topic:topic,
                    options:options,
                    allVotes:allVotes,
                    from:userId,
                    chat:chatId
                })
                break

            // case 'Files':
            //     newMessage = new FileMessage({
            //         files:files,
            //         comment:comment,
            //         from:userId,
            //         chat:chatId
            //     })
            //     break

            case 'Reply':
                newMessage = new ReplyMessage({
                    msg:message,
                    ref:messageToReplyId,
                    from:userId,
                    chat:chatId
                })
                break


            default:
                throw new BadRequestError(`Message type (${type}) is not supported`)
        }

        await newMessage.save()

        switch (type) {
            
            case 'Text':
                await newMessage.populate([
                    {path:'from', select:'name'},
                ])

                break

            case 'Vote':
                await newMessage.populate([
                    {path:'from', select:'name'},
                    // {path:'topic'},
                    // {path:'options'},
                    {path:'allVotes.voter', select:'name'}
                ])

                break

            // case 'Files':
            //     await newMessage.populate([
            //         {path:'from', select:'name'},
            //         {path:'files comment'}
            //     ])
            //     break

            case 'Reply':
                await newMessage.populate([
                    {path:'from', select:'name'},
                    {
                        path:'ref',
                        select:'msg type from',
                        populate:{path:'from', select:'name'}
                    }
                ])

                break


            default:
                break;
        }

        await Chat.findByIdAndUpdate(chatId,
            {$push:{messages: newMessage._id}},
            {new:true}
        ).exec()
        .catch( err => console.log("Updating chat failed: ", err))

        await updateMessageCache(chatId, newMessage, 'add')

        res.status(201).json({msg:"new message created", message:newMessage})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }
}

const sendFilesMessage = async (req, res) => {


    const {body, params:{chatId}, user:{userId}} = req

    const comment = body.comment
    const files = req.files

    if (!chatId){
        return res.status(400).json({ error: 'Chat ID is required' })
    } 
    
    if (!req.files || req.files.length === 0){
        return res.status(400).json({ error: 'No files uploaded' })
    }

    try {
        
        const uploadedFiles = []

        for (const file of files){


            const result = await cloudinary.uploader.upload(file.path, {
                folder:`chat-app/${chatId}`
            })

            uploadedFiles.push({
                name:file.originalname,
                URL:result.secure_url,
                type:file.mimetype,
                size:file.size,
                public_id:result.public_id
            })

            fs.unlinkSync(file.path)
        }

        const newMessage = await FileMessage({
            files:uploadedFiles,
            comment:comment,
            from:userId,
            chat:chatId,
        })

        await newMessage.save()
        await Chat.findByIdAndUpdate(chatId, {
            $push:{messages:newMessage._id}
        })

        await updateMessageCache(chatId, newMessage, 'add')

        await newMessage.populate('files')

        res.status(201).json({ msg: 'Files uploaded and message saved', message: newMessage })

    } catch (error) {
        console.log('File upload failed: ', error);
        throw new ServerError('File upload failed')
    }


}

const editMessage = async (req, res) => {

    const {params:{messageId, chatId}, body:{userInput}, user:{userId}} = req

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

        await updateMessageCache(chatId, message, 'edit')
        
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

        if(message.type === 'Files' && Array.isArray(message.files)){
            for (const file of message.files) {
            try {
               await cloudinary.uploader.destroy(file.public_id);
            } catch (error) {
                console.error(`Failed to delete ${file.name} from Cloudinary:`, error);
            }
        }
        }

        await updateMessageCache(chatId, message, 'delete')

        await Message.findByIdAndDelete(messageId)

        chat.messages = chat.messages.filter(id => !id.equals(message._id))
        
        try {
            await chat.save()
        } catch (error) {
            console.log('failed to update chat: ', error);
        }

        res.status(200).json({msg:"message successfully deleted"})
    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }

}

const forwardMessage = async (req, res) => {

    const {params:{chatId, messageId}, body:{selectedChatsId}, user:{userId}} = req

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
        
        console.log('forwarding msg: ', message);
        

        if(!message){
            throw new NotFoundError('Invalid message ID')
        }

        console.log(selectedChatsId);
        

        for (const id of selectedChatsId) {
            
            const chat = await Chat.findById(id)
            
            if(!chat){
                throw new NotFoundError('selected chat ID is invalid')
            }

            const newMessageData = {
                from: userId,
                origin:message.from,
                forwarded: true,
                msg: message.msg,
                chat: id
            }

            const Model = Message.discriminators[message.type]
            const newMessage = new Model(newMessageData)
            await newMessage.save()




            await newMessage.populate([
                {path:'from', select:'name'},
                {path:'origin',select:'name'}
            ])

            console.log('new Message: ', newMessage);

            await updateMessageCache(id, newMessage, 'add')
            
            await Chat.findByIdAndUpdate(id, {
                $push: {messages: newMessage._id},
                $set: {$lastUpdatedAt: new Date()}
            })
            
        }
        

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
            
            await Chat.findByIdAndUpdate(chatId,{
                $push:{pinnedMessages:messageId}
            })
            
            await updatePinnedMessageCache(chatId, message, 'add')

        } else {
            throw new BadRequestError('This message was already pinned!')
        }

        res.status(201).json({msg:"message successfully pinned", chat:chat})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }

}

const submitVote = async (req, res) => { 
    const {params: {chatId, messageId}, user:{userId}, body:{selectedOption}} = req
    
    if(!chatId || !messageId){
        throw new BadRequestError('Provide chatID & messageID')
    }

    if(!selectedOption){
        throw new BadRequestError('An option must be selected')
    }

    try {
        const voteMessage = await Message.findById(messageId)
    
        if(!voteMessage){
            throw new NotFoundError('No such message was found!')
        }

        voteMessage.allVotes.push({voter:userId, selectedOption:selectedOption})
    
        await voteMessage.save()
    
        await updateMessageCache(chatId, voteMessage, 'submit-vote')
    
        res.status(200).json({msg:'Vote successfully submitted'})
    } catch (error) {
        console.log(error);
    }

}




module.exports = { getAllMessages, sendMessage, sendFilesMessage, forwardMessage, editMessage,
    deleteMessage, pinMessage, submitVote }