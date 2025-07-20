
import { chats } from "./data"
import './css/chat.css'
import { useState } from "react"

const Chat = (id) => {
    
    const [myMsg, setMyMsg] = useState([])
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

                <p>{user.msg}</p>

                <div className="my-messages">
                    {myMsg && <MyMessages messages={myMsg}/>}
                </div>
                
                <div className="write-text">
                    <input className="user-input" value={inputValue} style={{width:'90%'}}

                        onChange={(e) => {

                            setInputValue(e.target.value)
                            console.log(inputValue)

                        }}
                    />
                    
                    <button className="send" onClick={() => {

                        setMyMsg([...myMsg, inputValue])
                        setInputValue('')
                        console.log(myMsg)
                        
                        }}
                    >Send</button>
                </div>



            </div>



    </div>
    )


}


const MyMessages = (setOfMsgs) => {

    const {messages} = setOfMsgs

    return (
        <>
            {messages.map((message) => {
                return (
                    <h5>
                        {message}
                        <br/>
                    </h5>
                )
            })}
        </>
    )
}


export default Chat