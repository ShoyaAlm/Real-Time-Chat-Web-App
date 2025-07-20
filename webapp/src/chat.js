
import { chats } from "./data"
import './css/chat.css'

const Chat = ({id}) => {

    const userChat = chats.find((chat) => chat.id === id)

    return (

    <div className="chat-container">

        {/* <div className="chat-overview"> */}

            <div className="chat-info">
                
                <img alt="" src={userChat.img}/>
                <div className="user">
                    <h2>{userChat.name}</h2>
                    <h5>Last seen recently</h5>
                </div>
            </div>


            <div className="chat-section">

                <p>{userChat.msg}</p>


            </div>



    </div>
    )


}


export default Chat