export const allChats = [
    {id: 1, name: "Peter", type:'chat',
        messages:[
            {id:1, from:"Peter", 
            msg:"This was the most helpful thing i have ever read to help me finish my thesis",
            createdAt: new Date().toISOString(),
                type: 'normal'},
            {id:2, from:"Peter",
                msg:"To be honest, I think this works! I have my proof of work on me, so hit me when you have time. To be honest, I think this works! I have my proof of work on me, so hit me when you have timeTo be honest, I think this works! I have my proof of work on me, so hit me when you have timeTo be honest, I think this works! I have my proof of work on me, so hit me when you have timeTo be honest, I think this works! I have my proof of work on me, so hit me when you have timeTo be honest, I think this works! I have my proof of work on me, so hit me when you have timeTo be honest, I think this works! I have my proof of work on me, so hit me when you have time",
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
                }
            ],
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
            img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg'},],
        
            
            img: 'https://wallpaper.dog/large/20675505.jpg',
        lastUpdatedAt: new Date().toISOString()


    }


]
