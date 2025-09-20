const express = require('express');
const app = express();
require('dotenv').config()

const connectDB = require('./db/connect')

const userRouter = require('./routes/user')
const chatRouter = require('./routes/chat')
const messageRouter = require('./routes/message')

const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/authentication')


app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/chats', authenticationMiddleware, chatRouter)
app.use('/api/v1/chats/:chatId/messages', authenticationMiddleware, messageRouter)


app.use(errorHandlerMiddleware)


const port = 3000

// use this to connect to database
// mongosh --host localhost --port 27017
// db.users.find()  (to find all users)

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

