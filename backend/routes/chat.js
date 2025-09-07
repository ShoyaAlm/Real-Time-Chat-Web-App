const express = require('express')
const router = express.Router()


const {getAllChats, makeChat, makeGroup, makeChannel, deleteChat} = require('../controllers/chat')

router.route('/').get(getAllChats).post(makeChat).post(makeChannel).post(makeGroup)
router.route('/:id').delete(deleteChat)

module.exports = router