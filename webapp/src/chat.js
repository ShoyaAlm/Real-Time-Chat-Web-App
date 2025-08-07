
import { people } from "./people"
import './css/chat.css'
import { useEffect, useState, useContext, useRef } from "react"
import { chatsContext } from "./chats"
import {OptionsModal, AttachedFileModal} from './modal'
import ShowcaseFiles from "./files"

const ChatParent = ({ name }) => {

    return (
        <Chat
         name={name}
        />
    )
}



const Chat = ({name}) => {
    
    const {chats, setChats} = useContext(chatsContext)

    const [inputValue, setInputValue] = useState('')

    const [sendStatus, setSendStatus] = useState('send')
    
    const [messageToEdit, setMessageToEdit] = useState('')
    const [messageToReply, setMessageToReply] = useState('')


    const [chatHistory, setChatHistory] = useState(null)
    
    const [attachedFiles, setAttachedFiles] = useState(null)

    const updatedMessages = (newMessages) => {

        setChats( prevChats => prevChats.map((chat) => chat.name === name
         ? {...chat, messages: newMessages, 
            lastUpdatedAt: newMessages[newMessages.length - 1].createdAt} : chat))
        
        }

    

    var user = chats.find((chat) => chat.name === name) ?? people.find((person) => person.name === name)
    
    useEffect(() => {   
        setChatHistory(chats.find((chat) => chat.name === name) ? true : false)
    }, [user/*, chats*/])


    
    const handleAttachFiles = (event) => {
        
        const attachedFile = event.target.files[0]
        
        if(attachedFiles === null && attachedFile !== undefined){
            setAttachedFiles([attachedFile])
        } else if (attachedFile !== undefined){

            const fileAlreadyAdded = attachedFiles.some(file => file.name === attachedFile.name)

            if(fileAlreadyAdded){
                console.log("file already added");
            } else {
                setAttachedFiles([...attachedFiles, attachedFile])
            }
        }

        
    }


    const fileInputRef = useRef(null)

    return (

    <div className="chat-container">

       
            <div className="user-info">
                
                <img alt="" src={user.img}/>
                <div className="user">
                    <h2>{user.name}</h2>
                    {user.type === 'group' ? (<></>) : (<><h5>Last seen recently</h5></>)}
                </div>
            </div>


            <div className="chat-section">


                
                    {<ShowMessages chat={user} onDeleteMessage={ theMessage => {
                    
                        const filteredMessages = user.messages.filter((message) => message.msg !== theMessage)
                        updatedMessages(filteredMessages)
                    
                    }}
                        setMessageToEdit={setMessageToEdit} setMessageToReply={setMessageToReply}
                        setInputValue={setInputValue} setSendStatus={setSendStatus} 
                        attachedFiles={attachedFiles}
                        

                    />}
                
                



            </div>



                    {sendStatus === 'reply' || sendStatus === 'edit' ? (
                        <>
                            <div className="typeof-message">
                                {sendStatus == 'reply' ? (
                                    <div className="reply">
                                    {messageToReply.type === "files" ? (
                                        <>
                                    <h5>Reply: files from {messageToReply.from}</h5>  
                                        </>
                                    ) : (
                                        <>
                                        <h5>Reply: {messageToReply.msg.slice(0, 50)}
                                        {messageToReply.msg.length > 50 ? '...' : ''}</h5>  
                                        </>
                                    )}
                                    </div>
                                ) : (
                                    <div className="edit">
                                       <h5>Edit: {messageToEdit.slice(0, 50)}
                                       {messageToEdit.length > 50 ? '...' : ''}</h5>  
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                <div className="write-text">

                    

                    <input className="user-input" value={inputValue} style={{width:'90%'}}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    
                    <button className="attach-file">Attach</button>
                    <input type="file" onChange={handleAttachFiles} ref={fileInputRef}/>
                    
                    {attachedFiles && <AttachedFileModal attachedFiles={attachedFiles}
                     setAttachedFiles={setAttachedFiles} handleAttachFiles={handleAttachFiles}
                        chatID={user.id} fileInputRef={fileInputRef}
                     />}

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
                                createdAt: new Date().toISOString(), type:"normal"}],
                                img: user.img, lastUpdatedAt: new Date().toISOString()
                                }])

                                setInputValue('')

                                setChatHistory(true)

                            }
                        
                        } else if(inputValue !== '' && sendStatus === 'edit') {
                            
                            const selectedMessage = user.messages.find(
                                (message) => message.msg === messageToEdit)
                            
                            selectedMessage.msg = inputValue
                            selectedMessage.type = 'edited'
                            
                            setChats( prevChats => prevChats.map((chat) => chat.name === name 
                            ? {...chat, messages: chat.messages} : chat))

                            setInputValue('')
                            setSendStatus('send')

                        }
                        else if(inputValue !== '' && sendStatus === 'reply'){

                            const selectedMessage = user.messages.find(
                                (message) => message.msg === messageToReply.msg)
                            
                            console.log(selectedMessage)
                            const newMessages = [...user.messages,
                            {from:"Shoya", msg: inputValue, createdAt: new Date().toISOString(),
                             type:"reply", ref:selectedMessage}]
                            
                            setInputValue('')
                            setSendStatus('send')
                            updatedMessages(newMessages)
                            
                        }
                        
                        }}
                    >Send</button>
                </div>


    </div>
    )


}


const ShowMessages = ({chat, onDeleteMessage, setMessageToEdit, setMessageToReply,
    setInputValue, setSendStatus, attachedFiles}) => {
    
    const messages = chat.messages    
        
    const [showThreeOptions, setShowThreeOptions] = useState(false)
        
    // var messagesExist = messages === undefined ? false : true
        
    const replyMessage = (theMessage) => {
        
        
        setMessageToReply(theMessage)
              
        setInputValue('')
        setShowThreeOptions(false)
        setSendStatus('reply')

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

    const [showModal, setShowModal] = useState(false)

    return (
    <>
        {messages ?
        
        (
            messages.map((message, index) => {
                if(message.from !== "Shoya"){
                    
                    return (
                        <div className="message-wrapper left" key={index}>

                            {chat.type === 'group' ? (<>

                                {chat.users.map((user, index) => {
                                    if(user.name == message.from){
                                        return (<div key={index}>
                                        
                                    <img src={user.img} 
                                    style={{width:'36px', height:'36px', borderRadius:'50%', marginRight:'5px',
                                        position:'relative', left:'0', objectFit: 'cover',flexShrink: '0'}}/>
                                        </div>)
                                    }
                                })} </>) : (<></>)}
                            
                            <div className="messages-received">

                                {chat.type === 'group' ? (
                                    <><h5 style={{position:'relative', textAlign:'left'}}>{message.from}</h5></>
                                ) : (<></>)}
                                        

                                <h4 style={{marginTop:'4px'}}>
                                    {message.msg}
                                </h4>
                                <h5 >
                                    {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                            </div>

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
                                    
                                    <div className={`three-options ${showThreeOptions && optionsIndex === index 
                                    ? "show" : ""}`}>
                                    
                                    
                                    <h5 onClick={() => replyMessage(message)}>Reply</h5>
                                    <h5 onClick={() => {navigator.clipboard.writeText(message.msg);
                                        setShowThreeOptions(false);
                                    }}
                                    >Copy</h5>
                                </div>

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
                            
                            <div className={`three-options ${showThreeOptions && optionsIndex === index 
                            ? "show" : ""}`}>

                            <h5 onClick={() => replyMessage(message)}>Reply</h5>
                            <h5 onClick={() => {
                                navigator.clipboard.writeText(message.msg);
                                setShowThreeOptions(false)}}>Copy</h5>
                            
                            <h5 onClick={() => {setShowThreeOptions(false)
                                setShowModal(true)}}>Forward</h5>
                            
                                {showModal && <OptionsModal message={message}
                                modalType={'forward'} setShowModal={setShowModal}/>}
                            
                            <h5 onClick={() => editMessage(message.msg)}>Edit</h5>
                            <h5 onClick={() => deleteMessage(message.msg)}>Delete</h5>
                        
                        
                        </div>
                            

                        </div>
                        
                        <div className="messages-sent">
                            {message.ref ? (
                                <>
                                    <div className="reply-preview">
                                    <h5 style={{fontSize:"13px"}}>{message.ref.from}</h5>
                                        {message.ref.type !== "files" ? (
                                            <>
                                            <h5>{message.ref.msg.slice(0, 30)}
                                            {message.ref.msg.length > 30 ? '...' : ''}</h5>
                                            </>
                                        ) : (
                                            <>
                                            <h5>{message.ref.length > 1 ? (<>
                                                {message.ref.msg.length} files
                                            </>) : (<>{message.ref.msg.length} file</>)}</h5>
                                            
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (<></>)}

                            {message.type === 'forwarded' ? (
                                <>
                                <div className="forward-preview">
                                    <h5>from: {message.from}</h5>
                                </div>
                                </>
                            ) : (<></>)}
                                

                                {message.type === "files" ? (
                                <>
                                <ShowcaseFiles files={message.msg} />
                                </>
                                ) : (
                                    <>
                                    {typeof message.msg === "object" ? (
                                        <><ShowcaseFiles files={message.msg} /></>
                                    ) : (
                                        <><h4>{message.msg}</h4></>
                                    )}
                                    
                                    </>
                                )}



                                <h5>
                                {message.type == "edited" ? "Edited, " : ""}
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