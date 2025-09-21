const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors')

const connectDB = require('./db/connect')

const userRouter = require('./routes/user')
const chatRouter = require('./routes/chat')
const messageRouter = require('./routes/message')

const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/authentication')

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/chats', authenticationMiddleware, chatRouter)
app.use('/api/v1/chats/:chatId/messages', authenticationMiddleware, messageRouter)


app.use(errorHandlerMiddleware)


const port = 8080

const start = async () => {
    
    try {
        // await connectDB(process.env.MONGO_URI)
        await connectDB(process.env.LOCALDBURI)
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        })
    
    } catch (error) {
        console.log(error);
    }
}

start();

