const User = require('../models/user')
// const bcrypt = require('bcryptjs')

const register = async (req, res) => {

    const {name, username, password} = req.body

    if(!name || !username || !password) {
       return res.status(400).json({msg:'Provide all the required values'})
    }

    try {
        const newUser = await User.create(req.body)
        res.status(201).json({user:newUser, msg:'user registered successfully'})    
    } catch (error) {
        res.status(500).json({msg:'Error while registering user', error: error})
    }

}


const login = async (req, res) => {

    const {username, password} = req.body

    if(!username || !password){
        return res.status(400).json({msg:'Provide both username & password to log in'})
    }

    const user = await User.findOne({ username:username, password:password})
        .populate('chats', 'name')

    
    if(!user){
        return res.status(400).json({msg:'No such user was found'})
    }

    res.status(200).json({msg:'successful login', user: user})

}


module.exports = {register, login}