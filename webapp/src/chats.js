import { allChats } from "./data";
import './css/chatprev.css'
import './css/chat.css'
import ChatParent from "./chat";
import { useEffect, useState, createContext, useContext } from "react";

import { people } from "./people";

export const chatsContext = createContext(null)

const ChatPage = () => {
    
    const [chats, setChats] = useState(allChats)

    return (
        <>
            <chatsContext.Provider value={{chats, setChats}}>
                <ChatPreview />
            </chatsContext.Provider>
        </>
    )
}


const ChatPreview = () => {



    const [user, setUser] = useState('')
    const [showChat, setShowChat] = useState(false)

    const [isLoadingUsers, setIsLoadingUsers] = useState(false)

    const [searchInputValue, setSearchInputValue] = useState('')

    const [searchedUsers, setSearchedUsers] = useState([])

    var lastMessageOrigin = ''

    useEffect(() => {

        const users = people.filter((person) => {
        
            const personLCName = person.name.toLowerCase()
            return personLCName.startsWith(searchInputValue)
        
        })
        setSearchedUsers(users)
        
    }, [searchInputValue])
    
    const {chats} = useContext(chatsContext)

    return (
    
        <div className="front-end">
            
            <div className="searchbar">
                
                <input type="text" onChange={(e) => {
                        setSearchInputValue(e.target.value)
                        setIsLoadingUsers(true)
                    
                }} placeholder="search..."/>
            
            {searchInputValue && (
                <button onClick={() => {
                    setSearchInputValue('')
                    setIsLoadingUsers(false)
                }} className="clear-btn" aria-label="Clear search">
                    X
                </button>
            )}
            
            </div>


            {!isLoadingUsers || !searchInputValue ? (
                <>

            <div className="chatPreviews">

            {chats.slice().sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)) 
            .map((chat) => {

                var lastMessage
                var previewLastMessage
                
                if(chat.messages.length !== 0){

                    lastMessage = chat.messages[chat.messages.length - 1].msg

                    if(chat.messages[chat.messages.length - 1].from === 'Shoya'){
                        lastMessageOrigin = 'Shoya'
                    } else {
                       lastMessageOrigin = chat.messages[chat.messages.length - 1].from 
                    }

                    previewLastMessage = lastMessage.length > 65 ? lastMessage.slice(0, 60) + "..." : lastMessage;

                } else {
                    previewLastMessage = "(empty chat)"
                }                
                
                return (
                    <div key={chat.id} className="preview" onClick={() => {
                        if(!showChat){
                            setShowChat(true)
                        }
                        setUser(chat.name)
                        }}>
                        <img alt="" src={chat.img} className="profile-img"/>
                        <h2 className="name">{chat.name}</h2>
                        <h4 className="chat-msg">{lastMessageOrigin}: {previewLastMessage}</h4>
                        <hr/>

                    </div>
                    
                )
            })}


            </div>

                </>
            ) : (
                <>

                    <div className="searched-users-container">

                    {searchedUsers.length !== 0 ? 
                    (
                        <>
                        
                        {searchedUsers.map((user) => {

                        
                            return (
                                <div key={user.id} className="searched-user">
                                    
                                    <img src={user.img} className="searched-user-profile"/>

                                    <h3 onClick={() => {
                                    setShowChat(true)
                                    setUser(user.name)
                                    setIsLoadingUsers(false)
                                    setSearchInputValue('')
                                    return (
                                        <>
                                            {showChat && <ChatParent name={user} />}
                                        </>
                                    )
                                }} className="searched-user-name">
                                        {user.name}
                                    </h3>

                                    <h5 style={{position:'relative', left:'33px', top:'0px'}}>
                                    Last seen recently</h5>
                                    

                                    <hr style={{position:"relative"}}/>
                                </div>
                            )

                        })}
                        </>
                    ) : (
                        <>
                            <h2 style={{textAlign:'center'}}>No users were found...</h2>
                        </>
                    )}
                        


                    </div>

                </>
            )}

                
                {showChat && <ChatParent name={user} />}



        </div>
    )


}








export default ChatPage