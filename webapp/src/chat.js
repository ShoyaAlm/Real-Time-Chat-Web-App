
import { people } from "./people"
import './css/chat.css'
import { useEffect, useState, useContext } from "react"

import { chatsContext } from "./chats"

const ChatParent = ({ name }) => {

    return (
        <Chat
         name={name}
        />
    )
}



// const reducer = (state, action) => {
//     if(action.type === "delete-msg"){

//     }

//     if(action.type === "edit-msg"){

//     }
// }

// const initialState = {

// }


const Chat = ({name}) => {

    // const [state, dipatch] = useReducer(reducer, initialState)
    
    const {chats, setChats} = useContext(chatsContext)

    const [inputValue, setInputValue] = useState('')

    const [sendStatus, setSendStatus] = useState('send')
    
    const [messageToEdit, setMessageToEdit] = useState('')

    const [chatHistory, setChatHistory] = useState(null)
    
    const updatedMessages = (newMessages) => {

        setChats( prevChats => prevChats.map((chat) => chat.name === name
         ? {...chat, messages: newMessages, 
            lastUpdatedAt: newMessages[newMessages.length - 1].createdAt} : chat))
        
        }

    var user = chats.find((chat) => chat.name === name) ?? people.find((person) => person.name === name)
    
    useEffect(() => {   
        setChatHistory(chats.find((chat) => chat.name === name) ? true : false)
    }, [user/*, chats*/])


    
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


                
                    {<ShowMessages chat={user} onDeleteMessage={ theMessage => {
                    
                        const filteredMessages = user.messages.filter((message) => message.msg !== theMessage)
                        updatedMessages(filteredMessages)
                    
                    }}
                        setMessageToEdit={setMessageToEdit}
                        setInputValue={setInputValue} setSendStatus={setSendStatus}
                        

                    />}
                
                



            </div>



                <div className="write-text">
                    <input className="user-input" value={inputValue} style={{width:'90%'}}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                        }}
                    />
                    
                    <button className="send" onClick={() => {

                        if(inputValue !== '' && sendStatus === 'send'){
                            
                            if(chatHistory){

                                const newMessages = [...user.messages, 
                                {from: "Shoya", msg: inputValue, createdAt: new Date().toISOString()}]
                                
                                updatedMessages(newMessages)

                                setInputValue('')
                                
                            } else {

                                setChats( prevChats => [...prevChats, {id: prevChats.length + 1,
                                name: user.name, messages: [{from:"Shoya", msg: inputValue, 
                                createdAt: new Date().toISOString()}],
                                img: user.img, lastUpdatedAt: new Date().toISOString()
                                }])

                                setInputValue('')

                                setChatHistory(true)

                            }
                        
                        } else if(inputValue !== '' && sendStatus === 'edit') {
                            
                            const selectedMessage = user.messages.find(
                                (message) => message.msg === messageToEdit)
                            
                            selectedMessage.msg = inputValue
                            
                            
                            setChats( prevChats => prevChats.map((chat) => chat.name === name 
                            ? {...chat, messages: chat.messages} : chat))

                            setInputValue('')
                            setSendStatus('send')

                        }
                        
                        }}
                    >Send</button>
                </div>


    </div>
    )


}


const ShowMessages = ({chat, onDeleteMessage, setMessageToEdit, 
    setInputValue, setSendStatus}) => {
    
    const messages = chat.messages    
    
    const [showThreeOptions, setShowThreeOptions] = useState(false)
        
    var messageExists

    if(messages === undefined){
        messageExists = false
    } else {
        messageExists = true /* messages.length > 0*/
    }
    
    

    const editMessage = (theMessage) => {

        setShowThreeOptions(false)
        
        setMessageToEdit(theMessage)

        setInputValue(theMessage)
        
        setSendStatus('edit')
    }

    const deleteMessage = (theMessage) => {

        setShowThreeOptions(false)
        
        onDeleteMessage(theMessage)
    
    }
    
    const [optionsIndex, setOptionsIndex] = useState(null)

    return (
    <>
        {messageExists ?
        
        (
            messages.map((message, index) => {
                if(message.from !== "Shoya"){
                    
                    return (
                        <div className="message-wrapper left" key={index}>
                            <div className="messages-received">
                                <h4>
                                    {message.msg}
                                </h4>
                                <h5>
                                    {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                            </div>
                        </div>
                    )

                } else {

                        return (
                            <div className="message-wrapper right" key={index}>
                                
                                <div className="dot-container">
                                    <button onClick={() => {
                                        if(!showThreeOptions){
                                            setOptionsIndex(index)
                                            setShowThreeOptions(true)
                                        } else {
                                            setOptionsIndex(null)
                                            setShowThreeOptions(false)
                                        }
                                    }} className="dot-button">...</button>
                                    
                                    {showThreeOptions && optionsIndex === index ? (
                                        <>
                                            <div className="three-options">
                                                <h5 onClick={() => 
                                                {navigator.clipboard.writeText(message.msg)
                                                .then(() => console.log("copied"))
                                                .catch(() => console.log("failed to copy"))
                                                setShowThreeOptions(false)
                                                }}>Copy</h5>
                                                <h5 onClick={() => editMessage(message.msg)}>Edit</h5>
                                                <h5 onClick={() => deleteMessage(message.msg)}>Delete</h5>
                                            
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
                                <h5>
                                    {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
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


export default ChatParent