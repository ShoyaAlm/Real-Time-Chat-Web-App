export const chats = [
    {id: 1, name: "Peter", 
        messages:[
            {from:"Peter", 
            msg:"This was the most helpful thing i have ever read to help me finish my thesis"},
            {from:"Peter",
                msg:"To be honest, I think this works! I have my proof of work on me, so hit me when you have time"
            }    
        ],
        img:'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg',
        createdAt: new Date().toISOString()
    },

    {id: 2, name: "Josh",
         messages:[
            {from:"Josh" ,
            msg:"I think we should take the alternative way to infiltrate the detection system?"},
            {from:"Josh",
                msg:"That's the way I think, at least I thought it would be initally! So don't blame me!"
            }],
        img:'https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg',
        createdAt: new Date().toISOString()
    },
    
    {id: 3, name: "Maxim", 
        messages:[
            {from:"Maxim", 
            msg:["Not to be redundant or anything, but do any of you suggest we regroup at a certain cafe?"]},
        {from:"Maxim",
            msg:"Just saying. There's a reason these start-ups raise so fast and manage to fail so quick."
        }],
        img: 'https://thumbs.dreamstime.com/b/professional-business-man-center-tablet-computer-148434325.jpg',
        createdAt: new Date().toISOString()
    },


]


//   const now = new Date();

//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
//   const day = String(now.getDate()).padStart(2, '0');

//   const hour = String(now.getHours()).padStart(2, '0');
//   const minute = String(now.getMinutes()).padStart(2, '0');
//   const second = String(now.getSeconds()).padStart(2, '0');

//   return `${year}-${month}-${day}-${hour}-${minute}-${second}`;