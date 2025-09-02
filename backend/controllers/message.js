const express = require('express')

const getAllMessages = (req, res) => {
    // when we click on a specific chat, all the messages should appear
    // this is done by receiving their id from the front-end
    res.send('getting all messages')
}

const sendMessage = (req, res) => {
    // whenever this function is called, we receive the id of the chat, and add the message to it
    // then we send our text, attach files, or a vote
    res.send('sending message')
}

const forwardMessage = (req, res) => {
    // we have the current chat's id, and by clicking on any other chat on the modal(to forward our message)...
    // we also save the id of the selected(destination) chats
    res.send('forward message')
}

const editMessage = (req, res) => {
    // we receive the id of that message, and patch the message
    res.send('edit message')
}


const deleteMessage = (req, res) => {
    // remove it by its id
    res.send('getting all messages')
}


const pinMessage = (req, res) => {
    // add this message with its properties to the pinnedMessages
    res.send('getting all messages')
}


module.exports = { getAllMessages, sendMessage,  forwardMessage, editMessage, deleteMessage, pinMessage }