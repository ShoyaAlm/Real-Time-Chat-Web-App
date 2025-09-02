const express = require('express')


const register = (req, res) => {
    res.send('registering user')
}


const login = (req, res) => {
    res.send('logging in')
}


module.exports = {register, login}