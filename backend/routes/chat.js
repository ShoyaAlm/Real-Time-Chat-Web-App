const express = require('express')
const router = express.Router()


const {getUserChats, allChats, getChat, switchChat, makeChat, makeGroup, makeChannel, 
    deleteChat} = require('../controllers/chat')

router.route('/').get(getUserChats).post(makeChat)
router.route('/all').get(allChats)
router.route('/:chatId').get(getChat)
// router.route('/:link').get(switchChat)
router.route('/group').post(makeGroup)
router.route('/channel').post(makeChannel)
router.route('/:chatId').delete(deleteChat)

module.exports = router