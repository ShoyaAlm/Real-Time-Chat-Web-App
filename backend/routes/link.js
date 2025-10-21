const express = require('express')
const router = express.Router()

const {getLink, findNormalChat} = require('../controllers/link')

router.route('/:link').get(getLink)
router.route('/normalChat/:name1/:name2').get(findNormalChat)


module.exports = router
