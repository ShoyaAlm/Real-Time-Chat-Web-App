const express = require('express')
const router = express.Router()

const {register, login} = require('../controllers/register-login')

router.route('/register').post(register)
router.route('/login').post(login)

module.exports = router