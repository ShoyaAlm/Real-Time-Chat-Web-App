
import { allChats } from "./data"
import './css/chat.css'
import { useState } from "react"

const ChatParent = ({ chatID }) => {
    
    const [chats, setChats] = useState(allChats)

    return (
        <Chat
         chatID={chatID}
         chats={chats}
         setChats={setChats}   
        />
    )
}

const Chat = ({chatID, chats, setChats}) => {
    
    const [inputValue, setInputValue] = useState('')



    const user = chats.find((chat) => chat.id === chatID)

    const updatedMessages = (newMessages) => {

        setChats( prevChats => prevChats.map((chat) => chat.id === chatID
         ? {...chat, messages: newMessages} : chat))
    
        }

        console.log(chats);
        

    
    return (

    <div className="chat-container">

       
            <div className="user-info">
                
                <img alt="" src={user.img}/>
                <div className="user">
                    <h2>{user.name}</h2>
                    <h5>Last seen recently</h5>
                </div>
            </div>


            <div className="chat-section">


                
                    {<ShowMessages chat={user} onDeleteMessage={ theMessage => {
                        const filteredMessages = user.messages.filter((message) => message.msg !== theMessage)
                        updatedMessages(filteredMessages)
                    }

                    }/>}
                
                



            </div>



                <div className="write-text">
                    <input className="user-input" value={inputValue} style={{width:'90%'}}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                        }}
                    />
                    
                    <button className="send" onClick={() => {

                        if(inputValue !== ''){
                            
                            const newMessages = [...user.messages, {from: "Shoya", msg: `${inputValue}`}]
                            updatedMessages(newMessages)

                            setInputValue('')
                        }
                        
                        }}
                    >Send</button>
                </div>


    </div>
    )


}


const ShowMessages = ({chat, onDeleteMessage}) => {
    
    const messages = chat.messages
        
    
    const [showThreeOptions, setShowThreeOptions] = useState(false)
        

    var messageExists = messages.length > 0
    

    const deleteMessage = (theMessage) => {

        setShowThreeOptions(false)
        
        onDeleteMessage(theMessage)
    
    }
    
    return (
    <>
        {messageExists ?
        
        (
            messages.map((message, index) => {
                if(message.from !== "Shoya"){
                    
                    return (
                        <div className="message-wrapper left" key={index}>
                            <div className="messages-received">
                                <h4>
                                    {message.msg}
                                </h4>
                            </div>
                        </div>
                    )

                } else {

                        return (
                            <div className="message-wrapper right" key={index}>
                                
                                <div className="dot-container">
                                    <button onClick={() => {
                                        if(!showThreeOptions){
                                            setShowThreeOptions(true)
                                        } else {
                                            setShowThreeOptions(false)
                                        }
                                    }} className="dot-button">...</button>
                                    
                                    {showThreeOptions ? (
                                        <>
                                            <div className="three-options">
                                                <h5>Edit</h5>
                                                <h5 onClick={() => deleteMessage(message.msg)}>Delete</h5>
                                                <h5>Copy</h5>
                                            
                                            </div>
                                        </>
                                    )
                                    : (
                                        <></>
                                    )}
                                    

                                </div>
                                
                                <div className="messages-sent">
                                    <h4>
                                        {message.msg}
                                    </h4>
                                </div>
                                


                            </div>
                        )
                    
                    
                }

            })

        ) : (
            <div >
                <p style={{left:"45%", top:"40%"}}>No messages...</p>
            </div>
        )
        
        }

    </>


    )
}


export default ChatParent