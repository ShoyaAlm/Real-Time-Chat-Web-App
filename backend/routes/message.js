const express = require('express')
const router = express.Router()

const { getAllMessages, sendMessage, forwardMessage, 
    editMessage, deleteMessage, pinMessage } = require('../controllers/message')

router.route('/:chatId').get(getAllMessages).post(sendMessage).post(forwardMessage)
router.route('/:chatId').patch(editMessage).delete(deleteMessage).post(pinMessage)

module.exports = router