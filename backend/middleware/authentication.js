const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({msg:"Bearer authorization is missing"})
    }

    const token = header.split(' ')[1]

    try {
        const payload = jwt.verify(token, 'jwtSecret')
        req.user = {userId:payload.userId, name:payload.name}
        next()
    } catch (error) {
        return res.status(400).json({msg:"Authentication failed"})
    }

}

module.exports = authenticate