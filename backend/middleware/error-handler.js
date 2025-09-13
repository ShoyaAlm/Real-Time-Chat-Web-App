const CustomAPIError = require('../errors/custom-api')

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({msg: err.message})
    }
    return res.status(500).json({err})
}

module.exports = errorHandlerMiddleware