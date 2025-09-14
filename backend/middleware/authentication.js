const jwt = require('jsonwebtoken')
const {UnauthorizedError} = require('../errors/index')

const authenticate = async (req, res, next) => {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer ')){
        throw new UnauthorizedError('Bearer authorization is missing')
    }

    const token = header.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.MONGO_SECRET)
        req.user = {userId:payload.userId, name:payload.name}
        next()
    } catch (error) {
        throw new UnauthorizedError('Authentication failed')
    }

}

module.exports = authenticate