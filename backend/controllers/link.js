const User = require('../models/user')
const {Chat, ChannelChat} = require('../models/chat')

const getLink = async (req, res) => {

    const {params:{link}} = req

    if(!link){
        throw new BadRequestError('Must provide a link')
    }
    
    // const cacheKey = `ID:${link}`
        
    try {
        
        // const cachedLink = await client.get(cacheKey)
        
        // if(cachedLink){

        //     const parsedCachedLink = JSON.parse(cachedLink)
        //     return res.status(200).json({
        //         msg:"cache output",
        //         link: parsedCachedLink
        //     })
        // }    

    const user = await User.findOne({username:link})

    if(user){
        // await client.set(cacheKey, JSON.stringify(user), {
        //     EX: 600
        // })
        return res.status(200).json({type:'user', data:user})
    }


    const channel = await ChannelChat.findOne({link:link})
    
    if(channel){
        // await client.set(cacheKey, JSON.stringify(channel), {
        //     EX: 600
        // })
        return res.status(200).json({type:'channel', data:channel})
    }

    console.log();
    

    return res.status(404).json({msg:"No user or channel with the given link was found"})

    } catch (error) {
        console.log(error);
    }

}


const findNormalChat = async (req, res) => {

    const {params:{name1, name2}} = req

    if(!name1 || !name2){
        throw new BadRequestError('Must provide names of users')
    }

    console.log(name1, name2);
    

    try {
        
        const chat = await Chat.findOne({
            type:'Normal',
            name:{ $all: [name1, name2] }
        }).populate([{
            path:'messages', select:'msg type edited createdAt from origin chat files',
            populate:[
                { path:'from', select:'name' },
                { path:'origin', select:'name' },
                { path:'chat', select:'_id' },
                { path:'files'},                
            ],
        },
        {path:'pinnedMessages', select:'msg type edited createdAt from origin chat files',
        populate:[
                { path:'from', select:'name' },
                { path:'origin', select:'name' },
                { path:'chat', select:'_id' },
                { path:'files'},
        ]},
        {path:'users', select:'user',
            populate:[
                {path:'user', select:'name img'}
            ]
        }
    ])
    
        if(!chat){
            return res.status(404).json({msg:"No chat with the given names was found"})
        }
        

        return res.status(200).json({chat: chat})
        
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {getLink, findNormalChat}