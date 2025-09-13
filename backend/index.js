const express = require('express');
const app = express();
require('dotenv').config()

const connectDB = require('./db/connect')

const userRouter = require('./routes/user')
const chatRouter = require('./routes/chat')
const messageRouter = require('./routes/message')

const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())

app.use('/api/v1/user', userRouter)
// app.use('/api/v1/chats', chatRouter)
app.use('/api/v1/chats', messageRouter)

// app.use('/api/v1/chats/:id/messages', messageRouter)

app.use(errorHandlerMiddleware)


const port = 3000

const start = async () => {
    
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        })
    
    } catch (error) {
        console.log(error);
    }
}

start();

