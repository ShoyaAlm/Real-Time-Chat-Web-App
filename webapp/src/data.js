export const allChats = [
    {id: 1, name: "Peter", type:'chat',
        messages:[
            {id:1, from:"Peter", 
            msg:"This was the most helpful thing i have ever read to help me finish my thesis",
            createdAt: new Date().toISOString(),
                type: 'normal'},
            {id:2, from:"Peter",
                msg:"To be honest, I think this works! I have my proof of work on me, so hit me when you have time.",
                createdAt: new Date().toISOString(),
                type: 'normal'},
            
            {id:3, from:"Shoya",
                msg:"Hi there, I thought i'd say hello",
                createdAt: new Date().toISOString(),
                type: 'normal'},

            {id:4, from:"Peter",
                msg:"Yes, that sounds about right! We should have a conversation sometime soon, though.",
                createdAt: new Date().toISOString(),
                type: 'normal'},
        ],
        pinnedMessages:[], // have its OWN id, plus taking in the message id that we pinned
        bio:'Hey there, I am Peter, not the actual Spiderman, though, haha!',
        img:'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg',
        lastUpdatedAt: new Date().toISOString()
    },

    {id: 2, name: "Josh", type:'chat',
         messages:[
                {id:1, from:"Josh" ,
                    msg:"I think we should take the alternative way to infiltrate the detection system?",
                    createdAt: new Date().toISOString(),
                    type: 'normal'
                },
                
                {id:2, from:"Josh",
                    msg:"That's the way I think, at least I thought it would be initally! So don't blame me!",
                    createdAt: new Date().toISOString(),
                    type: 'normal'
                },
                
                {id:3, from:"Josh",
                    msg:"Anyway, how was your day?",
                    createdAt: new Date().toISOString(),
                    type: 'normal'
                },
                
                {id:4, from:"Josh",
                    msg:"I hear it was fullfilling, you were fulfilled! Haha.",
                    createdAt: new Date().toISOString(),
                    type: 'normal'
                }
            ],
        pinnedMessages:[
            {id:1, messageID:1, from:"Josh", 
            phrase:"I think we should take the alternative way to infiltrate the detection system?", 
            createdAt: new Date().toISOString(), type: 'normal'},
            {id:2, messageID:2, from:"Josh", 
            phrase:"That's the way I think, at least I thought it would be initally! So don't blame me!", 
            createdAt: new Date().toISOString(), type: 'normal'},
        
        ],

        bio:'My specialty comes in many fields, including hacking...',
        img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg',
        lastUpdatedAt: new Date().toISOString()
    },
    
    {id: 3, name: "Maxim", type:'chat',
        messages:[
            {id:1, from:"Maxim", 
                msg:"Not to be redundant or anything, but do any of you suggest we regroup at a certain cafe?",
                createdAt: new Date().toISOString(),
                type: 'normal'
            },
        
            {id:2, from:"Maxim",
                msg:"Just saying. There's a reason these start-ups raise so fast and manage to fail so quick.",
                createdAt: new Date().toISOString(),
                type: 'normal'
            }],
        pinnedMessages:[],
        bio:"the name's maxim, from mother Russia",
        img: 'https://thumbs.dreamstime.com/b/professional-business-man-center-tablet-computer-148434325.jpg',
        lastUpdatedAt: new Date().toISOString()
    },

    {id: 4, name: "Group 1", type:'group',
        messages:[
            {id:1, from:"Maxim",
                msg:"Hi everyone to this wonderful GroupChat!", createdAt: new Date().toISOString(),
                type:'normal'
            },
            
            {id:2, from:"Maxim",
                msg:"Who's in it for a treat?", createdAt: new Date().toISOString(),
                type:'normal'
            },

            {id:3, from:"Peter",
                msg:"I'm game.", createdAt: new Date().toISOString(),
                type:'normal'
            },
            
        ],
        users:[{id:1, name:"Maxim", 
            img:'https://thumbs.dreamstime.com/b/professional-business-man-center-tablet-computer-148434325.jpg'},
        {id:2, name:"Peter", 
            img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'},
        {id:3, name:"Shoya", 
            img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'},
        {id:4, name:"Jay", 
            img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'},
        {id:5, name:"Lucas", 
            img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'},
        {id:6, name:"Aiden", 
            img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'},
        ],
        pinnedMessages:[],
            bio:'This is just for the showcasing purposes, nothing specific.',
            
            img: 'https://wallpaper.dog/large/20675505.jpg',
        lastUpdatedAt: new Date().toISOString()


    },

    {id: 5, name: "Hacker News", type: 'channel', 
        messages:[{id:1, msg:"Hi everyone to this wonderful Channel! This channel is called",
                createdAt: new Date().toISOString(), type:'normal', author: "Shoya"
            },
            {id:2, msg:"This is the second message in this channel",
                createdAt: new Date().toISOString(), type:'normal', author: "Shoya"
            },
            {id:3, msg:"And this will be the third & final message in here",
                createdAt: new Date().toISOString(), type:'normal', author: "Shoya"
            },
            
        ], 
        users:[{id: 1, name:"Shoya"}],
        pinnedMessages:[],
        link:'hacker_news',
        bio:'This is my one and only bio channel',
        img:'https://wallpapers.com/images/hd/aesthetic-computer-4k-c9qdhe02pr84wh3a.jpg',
        lastUpdatedAt: new Date().toISOString()
    }


]
