const client = require('../utils/redisClient')

const updateChatCache = async (userId, selectedChat, command) => {    
    const cacheKey = `chats:${userId}`
    const cachedChats = await client.get(cacheKey)
    if(cachedChats){
        let parsedChats = JSON.parse(cachedChats)

        if(command === 'add'){
            parsedChats.push(selectedChat)
        }

        else if(command === 'delete'){
            parsedChats = parsedChats.filter(chat => String(chat._id) !== String(selectedChat._id))
        }

        await client.set(cacheKey, JSON.stringify(parsedChats), {
                EX: 600
            })
    }
}

const updateMessageCache = async (chatId, message, command) => {

    const cacheKey = `chats:${chatId}:messages`
    const cachedMessages = await client.get(cacheKey)

    if(cachedMessages){
        let parsedMessages = JSON.parse(cachedMessages)

        switch (command) {
            case 'add':
                parsedMessages.push(message)
                break;

            case 'delete':
                parsedMessages = parsedMessages.filter(msg => String(msg._id) !== String(message._id))
                break;
            
            case 'edit':
                parsedMessages = parsedMessages.map(msg => {
                if(String(msg._id) === String(message._id)){
                    return {
                        ...msg,
                        msg: message.msg,
                        edited: true 
                    }
                }
                return msg
            })
                break;

            case 'submit-vote':
                parsedMessages = parsedMessages.map(msg => {
                if(String(msg._id) === String(message._id)){
                    return {
                        ...msg,
                        allVotes: message.allVotes 
                    }
                }
                return msg
            })

                
            default:
                break;
        }


        await client.set(cacheKey, JSON.stringify(parsedMessages), {
            EX: 600
        })
    }

}


const updatePinnedMessageCache = async (chatId, message, command) => {
    const cacheKey = `chats:${chatId}:pinnedMessages`
    const cachedPinnedMessages = await client.get(cacheKey)

    if(cachedPinnedMessages){
        let parsedPinnedMessages = JSON.parse(cachedPinnedMessages)

        switch (command) {
        
            case 'add':
                parsedPinnedMessages.push(message)
                break;
        
            case 'remove':
                parsedPinnedMessages = parsedPinnedMessages.filter(msg => String(msg._id) !== String(message._id))
                break;

            default:
                break;
        }

        await client.set(cacheKey, JSON.stringify(parsedPinnedMessages), {
            EX: 600
        })
    }

}

module.exports = {updateChatCache, updateMessageCache, updatePinnedMessageCache}