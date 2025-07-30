export const allChats = [
    {id: 1, name: "Peter", 
        messages:[
            {from:"Peter", 
            msg:"This was the most helpful thing i have ever read to help me finish my thesis",
            createdAt: new Date().toISOString(),
                type: 'normal'},
            {from:"Peter",
                msg:"To be honest, I think this works! I have my proof of work on me, so hit me when you have time",
                createdAt: new Date().toISOString(),
                type: 'normal'},
            
                {from:"Shoya",
                msg:"Hi there, I thought i'd say hello",
                createdAt: new Date().toISOString(),
                type: 'normal'},

            {from:"Peter",
                msg:"Yes, that sounds about right! We should have a conversation sometime soon, though.",
                createdAt: new Date().toISOString(),
                type: 'normal'},
        ],
        img:'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg',
        lastUpdatedAt: new Date().toISOString()
    },

    {id: 2, name: "Josh",
         messages:[
                {from:"Josh" ,
                    msg:"I think we should take the alternative way to infiltrate the detection system?",
                    createdAt: new Date().toISOString(),
                    type: 'normal'
                },
                
                {from:"Josh",
                    msg:"That's the way I think, at least I thought it would be initally! So don't blame me!",
                    createdAt: new Date().toISOString(),
                    type: 'normal'
                }
            ],
        img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg',
        lastUpdatedAt: new Date().toISOString()
    },
    
    {id: 3, name: "Maxim", 
        messages:[
            {from:"Maxim", 
                msg:"Not to be redundant or anything, but do any of you suggest we regroup at a certain cafe?",
                createdAt: new Date().toISOString(),
                type: 'normal'
            },
        
            {from:"Maxim",
                msg:"Just saying. There's a reason these start-ups raise so fast and manage to fail so quick.",
                createdAt: new Date().toISOString(),
                type: 'normal'
            }],

        img: 'https://thumbs.dreamstime.com/b/professional-business-man-center-tablet-computer-148434325.jpg',
        lastUpdatedAt: new Date().toISOString()
    },


]
