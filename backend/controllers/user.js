const User = require('../models/user')
// const bcrypt = require('bcryptjs')
const {BadRequestError, ServerError, UnauthorizedError} = require('../errors/index')

const register = async (req, res) => {

    const {name, username, password} = req.body

    if(!name || !username || !password) {
        throw new BadRequestError('Provide all the required values')
    }

    try {
        const newUser = await User.create(req.body)

        const token = newUser.generateJWT()

        res.status(201).json({user:newUser, msg:'user registered successfully', token:token})    
    } catch (error) {
        throw new ServerError('Error while registering user')
    }

}


const login = async (req, res) => {

    const {username, password} = req.body

    if(!username || !password){
        throw new BadRequestError('Provide both username & password to log in')
    }


    const user = await User.findOne({ username:username})
        .populate('chats', 'name')

    
    if(!user){
        throw new BadRequestError('No such user was found')
    }

    const isPasswordCorrect = await user.passwordValidation(password)

    if(!isPasswordCorrect){
        throw new UnauthorizedError('Wrong password!')
    }

    const token = user.generateJWT()

    res.status(200).json({msg:'successful login', user:user, token:token})

}


module.exports = {register, login}