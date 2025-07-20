import { chats } from "./data";
import './css/chatprev.css'
import './css/chat.css'
import { useState } from "react";

const ChatPreview = () => {



    const [chatId, setChatId] = useState(1)
    const [showChat, setShowChat] = useState(false)
    return (
    
        <div >
            
            {chats.map((chat) => {
                return (
                    <div key={chat.id} className="chatPreview" onClick={() => {
                        if(!showChat){
                            setShowChat(true)
                        }
                        setChatId(chat.id)
                        console.log(chatId)
                        }}>
                        <img alt="" src={chat.img} className="profile-img"/>
                        <h2 className="name">{chat.name}</h2>
                        <h4 className="chat-msg">{chat.msg}</h4>
                        <hr/>

                    </div>
                    
                )
            })}
                
                {showChat && <Chat chatID={chatId}/>}

        </div>
    )


}




const Chat = (id) => {

    const {chatID} = id
    

    const user = chats.find((chat) => chat.id === chatID)

    return (

    <div className="chat-container">

       
            <div className="chat-info">
                
                <img alt="" src={user.img}/>
                <div className="user">
                    <h2>{user.name}</h2>
                    <h5>Last seen recently</h5>
                </div>
            </div>


            <div className="chat-section">

                <p>{user.msg}</p>


            </div>



    </div>
    )


}




export default ChatPreview