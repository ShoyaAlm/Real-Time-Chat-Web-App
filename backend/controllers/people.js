const User = require('../models/user')
const {ChannelChat} = require('../models/chat')
const {BadRequestError} = require('../errors/index')

const searchPeople = async (req, res) => {

    const {userInput} = req.params
    
    console.log(userInput);
    
    try {
        const users = await User.find({
            username:{$regex: `^${userInput}`, $options:'i'}
        }).sort({
            username: 1
        }).limit(8)

        const channels = await ChannelChat.find({
            link:{$regex: `^${userInput}`, $options:'i'}
        }).sort({
            username: 1
        }).limit(2)

        const result = [...users, ...channels]


        return res.status(200).json({result})
    } catch (error) {
        console.log(error);
        throw new BadRequestError('Searching for users failed')
    }    
}

// we also need to add caching (expires relatively soon, like 60 seconds)

module.exports = searchPeople