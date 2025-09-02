const express = require('express')


const makeChat = (req, res) => {
    res.send('creating chat')
}

const makeGroup = (req, res) => {
    res.send('creating group')
}

const makeChannel = (req, res) => {
    res.send('creating channel')
}

const deleteChat = (req, res) => {
    res.send('deleting chat')
}



module.exports = {makeChat, makeGroup, makeChannel}

