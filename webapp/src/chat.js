
import { chats } from "./data"
import './css/chat.css'
import { useState } from "react"

const Chat = (id) => {
    
    const [inputValue, setInputValue] = useState('')

    const {chatID} = id

    const user = chats.find((chat) => chat.id === chatID)

    return (

    <div className="chat-container">

       
            <div className="user-info">
                
                <img alt="" src={user.img}/>
                <div className="user">
                    <h2>{user.name}</h2>
                    <h5>Last seen recently</h5>
                </div>
                <hr/>
            </div>


            <div className="chat-section">


                
                    {<ShowMessages chat={user}/>}
                
                



            </div>



                <div className="write-text">
                    <input className="user-input" value={inputValue} style={{width:'90%'}}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                        }}
                    />
                    
                    <button className="send" onClick={() => {

                        if(inputValue !== ''){
                            
                            if(user.messages[1] === undefined){
                                user.messages = [...user.messages, {from:"Shoya", msgs:[`${inputValue}`]}]
                                console.log("user.messages: ", user.messages)
                            }
                             else {
                                user.messages[1].msgs = [...user.messages[1].msgs, inputValue]
                                console.log("user.messages[1].msgs: ", user.messages)
                            }

                            setInputValue('')

                        }
                        
                        }}
                    >Send</button>
                </div>


    </div>
    )


}


const ShowMessages = (userChat) => {

    const {chat} = userChat

    const messagesFromOtherUser = chat.messages[0].msgs
    
    
    
    var messagesSentToUser
    
    if(chat.messages[1] !== undefined){
        messagesSentToUser = chat.messages[1].msgs 
    }

    return (
        <>
        {messagesFromOtherUser ?
        
        (
            chat.messages[0].msgs.map((message) => {
                return (
                    <div className="messages-received">
                        <h4>
                            {message}
                            <br/>
                        </h4>
                    </div>
                )
            })

        ) : (
            <></>
        )
        
        }

        {messagesSentToUser ? (

            messagesSentToUser.map((message) => {
                return (
                    <div className="messages-sent">
                        <h4>
                            {message}
                            <br/>
                        </h4>
                    </div>
                )
            })

        ) : (
            <></>
        )

        }

        {/* {!messagesFromOtherUser && !messagesSentToUser ? (
            () => {
                    return (
                    <p style={{position:'absolute', left:'50%', right:'50%'}}>No messages...</p>
                    )
            }

        ) : (
            <></>
        )} */}

</>


    )
}


export default Chat