const express = require('express')
const router = express.Router({mergeParams:true})

const { getAllMessages, sendMessage, forwardMessage, 
    editMessage, deleteMessage, pinMessage, submitVote } = require('../controllers/message')

router.route('/').get(getAllMessages).post(sendMessage)
router.route('/:messageId').patch(editMessage).delete(deleteMessage)
router.route('/:messageId/forward').post(forwardMessage)
router.route('/:messageId/pin').post(pinMessage)
router.route('/:messageId/vote').patch(submitVote)



module.exports = router