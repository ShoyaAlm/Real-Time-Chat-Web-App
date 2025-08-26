import { allChats } from "./data";
import './css/chatprev.css'
import './css/chat.css'
import ChatParent from "./chat";
import { useEffect, useState, createContext, useContext } from "react";

import { people } from "./people";

export const chatsContext = createContext(null)
export const showChatContext = createContext(null)
export const pinnedMessagesContext = createContext(null)
export const postCommentsContext = createContext(null)

export const searchTermsContext = createContext(null)

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
    const [showPinnedMessages, setShowPinnedMessages] = useState(false)
    const [showPostComments, setShowPostComments] = useState(false)


    const [searchInputValue, setSearchInputValue] = useState('')

    const [searchedUsers, setSearchedUsers] = useState([])

    var lastMessageOrigin = ''

    useEffect(() => {

        if(searchMod === 'people'){
            const users = people.filter((person) => {
            
                const personLCName = person.name.toLowerCase()
                return personLCName.startsWith(searchInputValue)
            
            })
            setSearchedUsers(users)
        }
        
    }, [searchInputValue])

    useEffect(() => {

        if(searchMod === 'terms' && user.messages && searchInputValue !== ''){
            
            const foundTerms = user.messages.filter((message) => {

                if(message.type === 'file' || typeof message.msg === 'object'){
                    return message.comment.includes(searchInputValue)
                }
                else if(message.type === 'vote' || message.topic !== undefined){
                    return message.topic.includes(searchInputValue)                
                }
                else {
                    return message.msg.includes(searchInputValue)
                }



            }).map((message) => {
                
                if(message.type === 'file' || typeof message.msg === 'object'){
                    return {id: message.id, from: message.from, msg: message.msg, createdAt: message.createdAt, 
                        type: message.type}
                }
                else if(message.type === 'vote' || message.topic !== undefined){
                    return {id: message.id, from: message.from, topic: message.topic, options:message.options,
                        allVotes: message.allVotes, createdAt: message.createdAt, type: message.type}                
                }
                else {
                    return {id: message.id, from: message.from, msg: message.msg, createdAt: message.createdAt, 
                        type: message.type}
                }
            })
            setFilteredResults(foundTerms)
        } else {
            setFilteredResults([])
        }


    }, [searchInputValue, user])
    
    const {chats} = useContext(chatsContext)

    const [searchMod, setSearchMod] = useState('')

    const [filteredResults, setFilteredResults] = useState([])
    


    return (

        <showChatContext.Provider value={{showChat, setShowChat}}>
            <pinnedMessagesContext.Provider value={{showPinnedMessages, setShowPinnedMessages}}>
                <postCommentsContext.Provider value={{showPostComments, setShowPostComments}}>
                    <searchTermsContext.Provider value={{filteredResults, setFilteredResults, setSearchMod}}>

        <div className="front-end" style={{display:'flex', flexDirection:'row'}}>
            
            <div className="left-side-container" style={{backgroundColor:'rgba(59, 110, 148, 0.89)', width:'40%',
            height:'100vh'}}>

            <div className="searchbar">
                
                <input type="text" onChange={(e) => {
                        setSearchInputValue(e.target.value)

                        if(searchMod === '') setSearchMod('people')
                    
                }} placeholder="search..." value={searchInputValue}/>
            
            {searchInputValue && (
                <button onClick={() => {
                    if(searchMod !== '') setSearchMod('')
                    setSearchInputValue('')
                }} className="clear-btn" aria-label="Clear search">
                    X
                </button>
            )}
            
            </div>


            {(!searchInputValue || searchMod === '' ) ? (
                <>

            <div className="chatPreviews">

            {chats.slice().sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)) 
            .map((chat) => {

                var lastMessage
                var previewLastMessage
                
            if(chat.messages.length !== 0){
                    
                    lastMessageOrigin = chat.messages[chat.messages.length - 1].from 

                    if(chat.messages[chat.messages.length - 1].type !== 'vote' 
                        && chat.messages[chat.messages.length - 1].topic === undefined){
                        lastMessage = chat.messages[chat.messages.length - 1].msg
                    } else {
                        lastMessage = chat.messages[chat.messages.length - 1].topic
                    }

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
                
                } else if(chat.messages[chat.messages.length - 1].type === 'vote' 
                            || chat.messages[chat.messages.length - 1].topic !== undefined){

                    previewLastMessage = lastMessage.length > 60 ? 
                            lastMessage.slice(0, 60) + "..." : lastMessage;

                } else {
                        previewLastMessage = lastMessage.length > 60 ? 
                            lastMessage.slice(0, 60) + "..." : lastMessage;
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
                        setUser(chat)
                        }}>
                        <img alt="" src={chat.img} className="profile-img"/>
                        <div style={{position:'relative', display:'flex', flexDirection:'column', left:'20px'}}>
                            <h3 className="name">{chat.name}</h3>
                            
                            <h5 className="chat-msg">
                            {chat.type === 'channel' ? (<></>) : (<>{lastMessageOrigin}: </>)}
                            {previewLastMessage}</h5>
                        </div>
                    </div>
                    </div>
                )
            })}


            </div>

                </>
            ) : (
                <>

                {(searchInputValue !== '' && searchMod === 'people') && (<>
                    <div className="searched-users-container">

                    {searchedUsers.length !== 0 ? 
                    (
                        <>
                        
                        {searchedUsers.map((user) => {

                        
                            return (
                                <div key={user.id} className="searched-user" onClick={() => {
                                    setShowChat(true)
                                    setUser(user)
                                    setSearchInputValue('')
                                }}>
                                <div style={{position:'relative', display:'flex', flexDirection:'row'}}>

                                    <img src={user.img} className="searched-user-profile"/>

                                    <div style={{position:'relative', display:'flex', flexDirection:'column', 
                                    textAlign:'center', left:'90%'}}>
                                    
                                    <h3 className="searched-user-name">{user.name}</h3>
                                    
                                    {user.type === 'chat' && (<><h5>Last seen recently</h5></>)} 
                                    {user.type === 'group' && (<><h5>Group</h5></>)} 
                                    {user.type === 'channel' && (<><h5>Channel</h5></>)} 
                                                                                                            
                                    
                                    
                                    </div>
                                    
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
                </>)}


                
                {(searchInputValue !== '' || searchMod === 'terms') && (<>
                    
                    <div className="searched-term-results">
                    
                        <>
                        {searchInputValue === '' ? (<>
                            <h4 style={{textAlign: 'center', top: '50px', position: 'relative'}}>Find something</h4>
                        </>) : (<>


                        
                        {filteredResults.map((result) => {
                            return (

                            <div key={result.id} className="searched-term" onClick={() => {
                                // when clicked, we are brought into the position of that message
                                }}>
                                <div style={{position:'relative', display:'flex', flexDirection:'row'}}>
                                    <h3>{result.from}</h3>

                                    <div style={{position:'relative', display:'flex', flexDirection:'column', 
                                    textAlign:'center', left:'40%'}}>
                                    
                                    <h4>{result.type}</h4>  
                                    <h4>{result.msg}</h4>                                              
                                    
                                    
                                    </div>
                                    
                                </div>
                                
                            </div>

                            )
                        })}

                        </>)}
                            
                        </>
                    
                    </div>
                </>)}

                </>
            )}

            </div>
                
                <div>
                {showChat && <ChatParent name={user.name} />}
                </div>

                {!showChat && (
                    <div style={{position:'relative', textAlign:'center', width:'60%', backgroundColor:'#436087ff'}}>
                        <p style={{position:'absolute', left:'40%', top:'40%', color:'#ffffffff'}}>
                            Select chat to start messaging</p>
                    </div>
                )}

        </div>
                        </searchTermsContext.Provider>
                    </postCommentsContext.Provider>
                </pinnedMessagesContext.Provider>
            </showChatContext.Provider>
    )


}


export default ChatPage