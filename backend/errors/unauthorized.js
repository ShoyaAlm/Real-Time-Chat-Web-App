const CustomAPIError = require('./custom-api')

class UnauthorizedError extends CustomAPIError {
    constructor(message){
        super(message)
        this.statusCode = 401
    }
}

module.exports = UnauthorizedError