
import { chats } from "./data"
import './css/chat.css'
import { useEffect, useState } from "react"

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
            </div>


            <div className="chat-section">


                
                    {<ShowMessages chat={user} onDeleteMessage={(theMessage) => {
                     
                    const filteredMessages = user.messages.filter((message) => message.msg !== theMessage)
                    user.messages = filteredMessages
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
                            
                            if(user.messages == []){
                                user.messages = [{from:"Shoya", msg:`${inputValue}`}]
                            
                            } else {
                                user.messages = [...user.messages, {from:"Shoya", msg:`${inputValue}`}]
                            }

                            setInputValue('')

                        }
                        
                        }}
                    >Send</button>
                </div>


    </div>
    )


}


const ShowMessages = ({chat, onDeleteMessage}) => {
    
    const selectedChat = chat
    
    console.log(selectedChat);
    
    
    const [allMessages, setAllMessages] = useState(selectedChat.messages) 
    
    const [showThreeOptions, setShowThreeOptions] = useState(false)
    
    useEffect(() => {
           setAllMessages(chat.messages)
    }, [chat.messages])
        

    var messageExists = allMessages.length > 0
    

    const deleteMessage = (theMessage) => {

        setShowThreeOptions(false)
        
        onDeleteMessage(theMessage)
    
    }
    
    return (
    <>
        {messageExists ?
        
        (
            allMessages.map((message, index) => {
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


export default Chat