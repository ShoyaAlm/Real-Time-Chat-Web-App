
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
                            
                            if(user.messages == []){
                                user.messages.push({from:"Shoya", msg:`${inputValue}`})
                                console.log("first ever message: ", user.messages)
                            
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


const ShowMessages = (userChat) => {

    const {chat} = userChat

    
    const messageExists = chat.messages.length > 0
    

    return (
    <>
        {messageExists ?
        
        (
            chat.messages.map((message, index) => {
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