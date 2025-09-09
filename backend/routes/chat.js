const express = require('express')
const router = express.Router()


const {getAllChats, allChats, makeChat, makeGroup, makeChannel, deleteChat} = require('../controllers/chat')

router.route('/').get(allChats).post(makeChat).post(makeChannel).post(makeGroup)
router.route('/:userId').get(getAllChats)
router.route('/:chatId').delete(deleteChat)

module.exports = router