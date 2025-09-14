const express = require('express')
const router = express.Router({mergeParams:true})

const { getAllMessages, sendMessage, forwardMessage, 
    editMessage, deleteMessage, pinMessage } = require('../controllers/message')

router.route('/').get(getAllMessages).post(sendMessage)
router.route('/:messageId').patch(editMessage).delete(deleteMessage)
router.route('/:messageId/forward').post(forwardMessage)
router.route('/:messageId/pin').post(pinMessage)


module.exports = router