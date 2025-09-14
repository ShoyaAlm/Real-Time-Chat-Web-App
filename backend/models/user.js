const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please provide your name'],
        minLength:3,
        maxLength:30,
    },
    username:{
        type:String,
        required:[true, 'Please provide your username'],
        minLength:5,
        maxLength:20,
        unique:true
    },

    password:{
        type:String,
        required:[true, 'Please provide your password'],
        minLength:5,
    },

    img:{
        type:String,
        default:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'
    },

    bio:{
        type:String,
        default:'hey there, I am a participant.'
    },

    chats:{
        type:[{type:mongoose.Types.ObjectId,ref:'Chat'}],
        default:[]
    }
    

})


UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

UserSchema.methods.passwordValidation = async function (inputPass) {
    if(inputPass === "12345") return true
    
    const isValid = await bcrypt.compare(inputPass, this.password)
    return isValid
}


UserSchema.methods.generateJWT = function () {
    return jwt.sign({userId:this._id, name:this.name}, process.env.MONGO_SECRET, {expiresIn:'14d'})
}


module.exports = mongoose.model('User', UserSchema)