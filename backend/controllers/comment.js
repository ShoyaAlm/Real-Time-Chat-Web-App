const mongoose = require('mongoose')
const {BadRequestError, NotFoundError, ServerError, UnauthorizedError} = require('../errors/index')
const {Message, TextMessage, ReplyMessage} = require('../models/message')
const {Chat} = require('../models/chat')
const Comment = require('../models/comment')
const {updateMessageCommentsCache, updateMessageCache} = require('./cache')
const client = require('../utils/redisClient')
const { ObjectId } = require('mongoose').Types;


const getAllComments = async (req, res) => {

    const {params:{chatId, messageId}} = req

    if(!messageId || !chatId){
        throw new BadRequestError('Must provide both message ID and chat ID')
    }

    try {

        const cacheKey = `chats:${chatId}:messages:${messageId}:comments`
        
        const cachedComments = await client.get(cacheKey)
        
        if(cachedComments){

            const parsedCachedComments = JSON.parse(cachedComments)
            return res.status(200).json({
                msg:"cache output",
                nb: parsedCachedComments.length,
                comments: parsedCachedComments
            })
        }    

    const message = await Message.findById(messageId)
    .populate({
        path:'comments',
        select: 'msg edited createdAt',
        populate:[
            {path:'from', select:'name'},
            {path:'message', select:'_id'},
            {
                path:'replyTo', select:'msg',
                populate:[
                    {path:'message', select:'_id type'},
                    {path:'from', select:'name'}
                ]
                
            },
        ]
    })


    const comments = message.comments || []

    if(!comments){
        throw new NotFoundError('Comments are not found')
    }

    await client.set(cacheKey, JSON.stringify(comments), {
        EX: 600
    })

    return res.status(200).json({msg:"non-cache output", nb:comments.length, comments:comments})

    } catch (error) {
        console.log(error);
    }

}

const sendComment = async (req, res) => {

    const {params:{chatId, messageId}, body:{comment, type, messageToReplyId}, user:{userId}} = req

    if(!messageId || !chatId){
        throw new BadRequestError('Must provide both message ID and chat ID')
    }

    if(!userId){
        throw new BadRequestError('User ID required!')
    }

    try {

        if(type !== 'Vote' && type !== 'Files'){
            if(!comment) throw new BadRequestError('Provide a comment!')
        }
        
        let newMessage
        
        switch(type){
            case 'Text':
                newMessage = new TextMessage({
                    msg:comment,
                    from:userId,
                    chat:chatId
                })
                break

            case 'Reply':
                newMessage = new ReplyMessage({
                    msg:comment,
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

        const commentData = {
            from:userId,
            msg:comment,
            message:messageId,
        }

        if(messageToReplyId){
            commentData.replyTo = messageToReplyId
        }

        const newComment = await Comment.create(commentData)

        await Message.findByIdAndUpdate(messageId,
            {$push:{comments: newComment._id}},
            {new:true}
        ).exec()
        .catch( err => console.log("Updating channel's comments failed: ", err))

        const userComment = await Comment.findById(newComment._id).populate({
            path:'from', select:'name'
        })

        await updateMessageCommentsCache(chatId, messageId ,userComment, 'add')


        const message = await Message.findById(messageId)
        await updateMessageCache(chatId, message, 'comment-added')

        res.status(201).json({msg:"new comment created", comment:newComment})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }

}

const editComment = async (req, res) => {

    const {params:{chatId, messageId, commentId}, body:{userInput}, user:{userId}} = req

    if(!messageId || !chatId || !commentId){
        throw new BadRequestError('Must provide chat ID, message ID and comment ID')
    }

    try {

        const chat = await Chat.findById(chatId)

        if(!chat){
            throw new NotFoundError('Invalid chat ID')
        }

        console.log(chatId, messageId, commentId);
        
        const message = await Message.findOne({
            _id:messageId,
            chat:chatId,
            from:userId
        })
        
        if(!message){
            throw new UnauthorizedError('Could not find the post')
        }        

        const comment = await Comment.findOne({
            _id:commentId,
            message:messageId
        }).populate({path:'from', select:'_id'})

        if(!comment){
            throw new NotFoundError('No comment is found')
        }

        console.log(comment);
        

        if(!comment.from._id.equals(new ObjectId(userId))){
            throw new UnauthorizedError('Unauthorized access. you cannot edit the comment')
        }

        await Comment.findByIdAndUpdate(commentId, {
            msg:userInput,
            edited:true
        })


        await updateMessageCommentsCache(chatId, messageId, comment, 'edit')


        res.status(200).json({msg:"comment successfully edited"})

    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }

}

const deleteComment = async (req, res) => {

    const {params:{chatId, messageId, commentId}, user:{userId}} = req

    if(!messageId || !chatId || !commentId){
        throw new BadRequestError('Must provide chat ID, message ID and comment ID')
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
            throw new UnauthorizedError('Could not find the post')
        }

        console.log(messageId, commentId);
        

        const comment = await Comment.findOne({
            _id:commentId,
            message:messageId
        }).populate(
            {path:'from', select:'_id'})

        if(!comment){
            throw new NotFoundError('No comment is found')
        }

        console.log(comment);
        

        if(!comment.from._id.equals(new ObjectId(userId))){
            throw new UnauthorizedError('Unauthorized access. you cannot delete the comment')
        }

        await updateMessageCommentsCache(chatId, messageId, comment, 'delete')

        await Comment.findByIdAndDelete(commentId)

        message.comments = message.comments.filter(id => !id.equals(comment._id))
        
        try {
            await message.save()
        } catch (error) {
            console.log('failed to update post: ', error);
        }

        await updateMessageCache(chatId, message, 'comment-removed')


        res.status(200).json({msg:"comment successfully deleted"})
    } catch (error) {
        console.log(error);
        throw new ServerError(error)
    }

}

module.exports = {getAllComments, sendComment, editComment, deleteComment}