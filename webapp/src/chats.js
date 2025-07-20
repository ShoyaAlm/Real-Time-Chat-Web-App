import { chats } from "./data";
import './css/chatprev.css'
import './css/chat.css'
import Chat from "./chat";
import { useState } from "react";

const ChatPreview = () => {



    const [chatId, setChatId] = useState(0)
    const [showChat, setShowChat] = useState(false)
    return (
    
        <div className="allChats">
            
            {chats.map((chat) => {
                return (
                    <div key={chat.id} className="chatPreview" onClick={() => {
                        if(!showChat){
                            setShowChat(true)
                        }
                        setChatId(chat.id)
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








export default ChatPreview