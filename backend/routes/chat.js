const express = require('express')
const router = express.Router()


const {getUserChats, allChats, makeChat, makeGroup, makeChannel, deleteChat} = require('../controllers/chat')

router.route('/').get(allChats).post(makeChat)
router.route('/group').post(makeGroup)
router.route('/channel').post(makeChannel)
router.route('/:userId').get(getUserChats)
router.route('/:chatId').delete(deleteChat)

module.exports = router