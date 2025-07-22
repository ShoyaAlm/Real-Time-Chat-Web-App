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

                var lastMessage
                var previewLastMessage

                if(chat.messages.length !== 0){

                    lastMessage = chat.messages[chat.messages.length - 1].msg

                    previewLastMessage = lastMessage.length > 65 ? lastMessage.slice(0, 65) + "..." : lastMessage;

                } else {
                    previewLastMessage = "(empty chat)"
                }                
                
                return (
                    <div key={chat.id} className="chatPreview" onClick={() => {
                        if(!showChat){
                            setShowChat(true)
                        }
                        setChatId(chat.id)
                        }}>
                        <img alt="" src={chat.img} className="profile-img"/>
                        <h2 className="name">{chat.name}</h2>
                        <h4 className="chat-msg">{previewLastMessage}</h4>
                        <hr/>

                    </div>
                    
                )
            })}


                
                {showChat && <Chat chatID={chatId}/>}

        </div>
    )


}








export default ChatPreview