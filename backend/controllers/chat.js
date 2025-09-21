const User = require('../models/user')
const {Chat, NormalChat, GroupChat, ChannelChat} = require('../models/chat')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')
const {BadRequestError, NotFoundError, UnauthorizedError, ServerError} = require('../errors/index')
const {updateChatCache} = require('./cache')

const client = require('../utils/redisClient')


const getUserChats = async (req, res) => {

    const {user:{userId, name}} = req

    if(!userId){
        throw new BadRequestError('No user ID provided')
    }

    try {

        const cacheKey = `chats:${userId}`
        
        const cachedChats = await client.get(cacheKey)

        if(cachedChats){
            const parsedCachedChats = JSON.parse(cachedChats)
            return res.status(200).json({msg:"cached chats", 
                nb: parsedCachedChats.length,
                chats: parsedCachedChats,
                currentUser:{
                    id:userId,
                    name: name
                }
            })
        }

        const chats = await Chat.find({users:userId})
            .populate('users', 'name img')
            .populate({
                path:'messages',
                options:{sort:{createdAt:-1}, limit:1},
                populate:{path:'from', select:'name'}
            })
            

        await client.set(cacheKey, JSON.stringify(chats), {
            EX: 600
        })

        res.status(200).json({msg:"non-cached chats", nb: chats.length, chats: chats, currentUser:{
                    id:userId,
                    name: name
                }})
    } catch (error) {
        console.log(error);
        throw new ServerError(error)
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
        throw new ServerError(error)
    }
}

const getChat = async (req, res) => {

    const {params:{chatId}} = req
    
    try {

        const chat = await Chat.findById(chatId)
        
        res.status(200).json({chat: chat})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }


}

const makeChat = async (req, res) => {

    const {user:{userId, name}, body: {secondUserId, message} } = req

    if(!secondUserId){
        throw new BadRequestError('Please provide the id of the other user')
    }

    try {
        
        const secondUser = await User.findById(secondUserId)

        if(!secondUser){
            throw new NotFoundError('Please provide valid user ID')
        }

        if(!message){
            throw new BadRequestError('Message cannot be empty')
        }

        const chatExists = await NormalChat.findOne({
            type:'Normal',
            users:{$all:[userId, secondUserId]}, 
            $expr:{ $eq: [{$size: "$users"}, 2]}
            },
        )

        if(chatExists){
            throw new BadRequestError('Chat between 2 users already exists!')
        }

        const newChat = await NormalChat.create({
            name:[name, secondUser.name], // name is the current user's name
            users:[userId, secondUserId],
            messages:[]
        })


        const newMessage = await TextMessage.create({
            msg: message,
            from: userId,
            chat: newChat._id
        })


        await NormalChat.findByIdAndUpdate(newChat._id, {
            $push: {messages:newMessage._id}
        })

        await Promise.all([
            User.findByIdAndUpdate(userId, {$push:{chats:newChat._id}}),
            User.findByIdAndUpdate(secondUserId, { $push:{chats:newChat._id} })
        ])


        await Promise.all([
            updateChatCache(userId, newChat, 'add'),
            updateChatCache(secondUserId, newChat, 'add')
        ])

        res.status(201).json(newChat)

    } catch (error) {
        console.log(error);
        throw new ServerError('Error while creating the chat')
    }


}

const makeGroup = async (req, res) => {

    const {user:{userId}, body:{name, bio}} = req

    if(!name){
        return res.status(400).json({msg:"Enter group name!"})
    }

    try {
    
        const newGroup = await GroupChat.create({
            name:name,
            users:[userId],
            messages:[],
            bio:bio
        })

        await Promise.all([updateChatCache(userId, newChannel, 'add')])


        res.status(201).json({msg:"Group was successfully created", group:newGroup})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)        
    }


}

const makeChannel = async (req, res) => {

    const {user:{userId}, body:{name, link, bio}} = req

    if(!name || !link){
        throw new BadRequestError('Provide channel name and a link')
    }

    try {
        
        const newChannel = await ChannelChat.create({
            name:name,
            users:[userId],
            link:link,
            messages:[],
            bio:bio
        })

        await Promise.all([updateChatCache(userId, newChannel, 'add')])

        res.status(201).json({msg:"Channel was successfully created", channel: newChannel})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)       
    }

}

const deleteChat = async (req, res) => {

    const {user:{userId}, params:{chatId}} = req

    if(!chatId){
        throw new BadRequestError('Chat ID required!')
    }

    try {
        
        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new NotFoundError('Invalid chat ID!')
        }

        if(!chat.users.includes(userId)){
            throw new UnauthorizedError('Authentication failed. You are not part of the Chat to delete it')
        }

        await Promise.all([updateChatCache(userId, chat, 'delete')])

        await Chat.findOneAndDelete({_id:chatId})

        res.status(200).json({msg:"chat successfully deleted"})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
        
    }

}


module.exports = {getUserChats, allChats, getChat, makeChat, makeGroup, makeChannel, deleteChat}

