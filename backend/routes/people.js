const express = require('express')
const router = express.Router()

const searchPeople = require('../controllers/people')

router.route('/:userInput').get(searchPeople)

module.exports = router
