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
    
        <div className="front-end" style={{display:'flex', flexDirection:'row'}}>
            
            <div className="left-side-container" style={{backgroundColor:'rgba(59, 110, 148, 0.89)', width:'40%',
            height:'100vh'}}>

            <div className="searchbar">
                
                <input type="text" onChange={(e) => {
                        setSearchInputValue(e.target.value)
                        setIsLoadingUsers(true)
                    
                }} placeholder="search..." value={searchInputValue}/>
            
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
                    
                    lastMessageOrigin = chat.messages[chat.messages.length - 1].from 

                    lastMessage = chat.messages[chat.messages.length - 1].msg

                if(chat.messages[chat.messages.length - 1].type === "files"){
                    
                    if(chat.messages[chat.messages.length - 1].comment !== ''){
                        previewLastMessage = lastMessage.length == 1 ? 
                        `${chat.messages[chat.messages.length - 1].comment} (1 file)` 
                                : `${chat.messages[chat.messages.length - 1].comment} (${lastMessage.length} files)`
                    } else {
                        previewLastMessage = lastMessage.length == 1 ? `1 file` : `${lastMessage.length} files`
                    }

                    

                } else if (chat.messages[chat.messages.length - 1].type === "forwarded"
                                && typeof chat.messages[chat.messages.length - 1].msg === "object") {
                        
                    if(chat.messages[chat.messages.length - 1].comment !== ''){
                        previewLastMessage = lastMessage.length == 1 ? 
                        `forwarded: ${chat.messages[chat.messages.length - 1].comment} (1 file)` 
                                : `forwarded ${chat.messages[chat.messages.length - 1].comment} 
                                (${lastMessage.length} files)`
                    } else {
                            previewLastMessage = lastMessage.length === 1 ? `forwarded 1 file`
                            : `forwarded ${lastMessage.length} files`
                    }
                        

                } else if((chat.messages[chat.messages.length - 1].type === "edited" || "edited-files")
                        && typeof chat.messages[chat.messages.length - 1].msg === "object"){
                        
                        if(chat.messages[chat.messages.length - 1].comment !== ''){
                            previewLastMessage = lastMessage.length === 1 ? 
                        `${chat.messages[chat.messages.length - 1].comment} (1 file)` 
                                : `${chat.messages[chat.messages.length - 1].comment} (${lastMessage.length} files)`
                        } else {
                            previewLastMessage = lastMessage.length === 1 ? `1 file`
                            : `${lastMessage.length} files`
                        }
                
                } else {
                        previewLastMessage = lastMessage.length > 50 ? 
                            lastMessage.slice(0, 50) + "..." : lastMessage;
                }


            } else {
                    previewLastMessage = "(empty chat)"
                }                
                
                return (
                    <div key={chat.id}>
                    <div className="preview" onClick={() => {
                        if(!showChat){
                            setShowChat(true)
                        }
                        setUser(chat.name)
                        }}>
                        <img alt="" src={chat.img} className="profile-img"/>
                        <div style={{position:'relative', display:'flex', flexDirection:'column', left:'20px'}}>
                            <h3 className="name">{chat.name}</h3>
                            <h4 className="chat-msg">{lastMessageOrigin}: {previewLastMessage}</h4>
                        </div>
                    </div>
                        <hr style={{color:'#333'}}/>
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
                                <div key={user.id} className="searched-user" onClick={() => {
                                    setShowChat(true)
                                    setUser(user.name)
                                    setIsLoadingUsers(false)
                                    setSearchInputValue('')
                                    return (
                                        <>
                                            {showChat && <ChatParent name={user} />}
                                        </>
                                    )
                                }}>
                                    
                                    <img src={user.img} className="searched-user-profile"/>

                                    <div style={{display:'flex', flexDirection:'column'}}>
                                    <h3 className="searched-user-name">
                                        {user.name}
                                    </h3>

                                    <h5 style={{position:'relative', left:'33px', top:'0px'}}>
                                    Last seen recently</h5>
                                    
                                    <hr />
                                    </div>

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

            </div>
                
                <div>
                {showChat && <ChatParent name={user} />}
                </div>

                {!showChat && (
                    <div style={{position:'relative', textAlign:'center', width:'60%', backgroundColor:'#436087ff'}}>
                        <p style={{position:'absolute', left:'40%', top:'40%', color:'#ffffffff'}}>
                            Select chat to start messaging</p>
                    </div>
                )}

        </div>
    )


}


export default ChatPage