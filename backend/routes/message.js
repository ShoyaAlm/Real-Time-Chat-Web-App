const express = require('express')
const router = express.Router()

const { getAllMessages, sendMessage, forwardMessage, 
    editMessage, deleteMessage, pinMessage } = require('../controllers/message')

router.route('/:chatId').get(getAllMessages).post(sendMessage)
router.route('/:chatId').patch(editMessage).delete(deleteMessage)

router.route('/:chatId/pin').post(pinMessage)
router.route('/:chatId/forward').post(forwardMessage)


module.exports = router