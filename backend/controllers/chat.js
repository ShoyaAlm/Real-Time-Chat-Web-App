const User = require('../models/user')
const {Chat, NormalChat, GroupChat, ChannelChat} = require('../models/chat')
const {Message, TextMessage, VoteMessage, FileMessage, ReplyMessage} = require('../models/message')
const {BadRequestError, NotFoundError, UnauthorizedError, ServerError} = require('../errors/index')

const getUserChats = async (req, res) => {

    const {user:{userId}} = req

    if(!userId){
        throw new BadRequestError('No user ID provided')
    }

    try {
        
        const chats = await Chat.find({users:userId})

        res.status(200).json({nb: chats.length, chats: chats})
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

    const {user:{userId}, body: {secondUserId, message} } = req

    if(!secondUserId){
        throw new BadRequestError('Please provide the id of the other user')
    }

    try {
        const firstUser = await User.findById(userId)
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


        const newChat = new NormalChat({
            name:[firstUser.name, secondUser.name],
            users:[userId, secondUserId],
            messages:[]
        })

        await newChat.save()

        
        const newMessage = new TextMessage({
            msg: message,
            from: userId,
            chat: newChat._id
        })

        await newMessage.save()


        newChat.messages.push(newMessage._id)
        await newChat.save()


        firstUser.chats.push(newChat._id)
        secondUser.chats.push(newChat._id)


        await firstUser.save()
        await secondUser.save()
        

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
        throw new ServerError(error)        
    }


}

const makeChannel = async (req, res) => {

    const {user:{userId}, body:{name, link, bio}} = req

    if(!name || !link){
        throw new BadRequestError('Provide channel name and a link')
    }

    try {
        
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

        await Chat.findOneAndDelete({_id:chatId})

        res.status(200).json({msg:"chat successfully deleted"})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
        
    }

}


module.exports = {getUserChats, allChats, getChat, makeChat, makeGroup, makeChannel, deleteChat}

