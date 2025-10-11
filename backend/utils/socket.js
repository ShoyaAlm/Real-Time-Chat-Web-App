const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIo(server, {
        cors:{
            origin:'http://localhost:3000',
            methods:['GET', 'POST', 'PATCH', 'DELETE'],
            allowedHeaders:['Content-Type'],
            credentials:true
        },
    });

    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('joinChat', (chatId) => {
            socket.join(chatId); 
            console.log(`User joined chat: ${chatId}`);
        });

        socket.on('joinMessageRoom', messageId => {
            socket.join(`message_${messageId}`)
            console.log(`User joined message room: `, messageId);
        })

        socket.on('newMessage', (message, chatID) => {
            io.to(chatID).emit('newMessage', message)
            console.log('sending message to ', chatID);
        })

        socket.on('editMessage', (message, inputValue, chatID) => {
            message.msg = inputValue
            message.edited = true
            io.to(chatID).emit('editMessage', message)
            console.log('message edited(socket)');
        })

        socket.on('deleteMessage', (message, chatID) => {
            io.to(chatID).emit('deleteMessage', message)
            console.log('message deleted(socket)');
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIo };
