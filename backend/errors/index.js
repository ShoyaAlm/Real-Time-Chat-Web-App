const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')
const UnauthorizedError = require('./unauthorized')
const ServerError = require('./server-error')

module.exports = {NotFoundError, BadRequestError, UnauthorizedError, ServerError}