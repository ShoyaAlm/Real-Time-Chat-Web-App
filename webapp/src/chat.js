
import { people } from "./people"
import './css/chat.css'
import { useEffect, useState, useContext, useRef } from "react"
import { chatsContext } from "./chats"

import {OptionsModal, AttachedFileModal} from './modal'
import { UserInfo, GroupInfo } from "./chat-info"

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


    
    const handleAttachFiles = (event, replaceIndex = null) => {
        
        const attachedFile = event.target.files[0]

        if(replaceIndex !== null){
        
            setAttachedFiles(prevFiles => {
                const updatedFiles = [...prevFiles]
                updatedFiles[replaceIndex] = attachedFile
                return updatedFiles
            })

        } else {
        
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

            }
        
        


    const fileInputRef = useRef(null)

    const [fileInputKey, setFileInputKey] = useState(0)

    const resetFileInputKey = () => {
        setFileInputKey(prevKey => prevKey + 1)
    }

    const [editingAttachedFiles, setEditingAttachedFiles] = useState(false)

    const [selectedFileMessageID, setSelectedFileMessageID] = useState(0)

    const [attachedFilesComment, setAttachedFilesComment] = useState('')


    const [showUserInfo, setShowUserInfo] = useState(false)
    const [showGroupInfo, setShowGroupInfo] = useState(false)

    return (

    <div className="chat-container">

            {showUserInfo && <UserInfo chat={user} setShowUserInfo={setShowUserInfo} />}
            {showGroupInfo && <GroupInfo chat={user} setShowGroupInfo={setShowGroupInfo} 
                showUserInfo={showUserInfo} setShowUserInfo={setShowUserInfo}/>}
       
            <div className="user-info" onClick={() => user.type === "chat" 
                ? setShowUserInfo(true) : setShowGroupInfo(true)}>
                
                <img alt="" src={user.img}/>
                <div className="user">
                    <h2>{user.name}</h2>
                    {user.type === 'group' ? (<><h5>{user.users.length} members</h5></>)
                         : (<><h5>Last seen recently</h5></>)}
                </div>
            </div>



            <div className="chat-section">


                
                    {<ShowMessages chat={user} onDeleteMessage={ theMessage => {
                        const filteredMessages = user.messages.filter((message) => message.msg !== theMessage)
                        updatedMessages(filteredMessages)
                    }}
                        setMessageToEdit={setMessageToEdit} setMessageToReply={setMessageToReply}
                        inputValue={inputValue} setInputValue={setInputValue} setSendStatus={setSendStatus} 
                        setAttachedFiles={setAttachedFiles} setEditingAttachedFiles={setEditingAttachedFiles}
                        setSelectedFileMessageID={setSelectedFileMessageID}
                        setAttachedFilesComment={setAttachedFilesComment}


                    />}
                
            </div>

                    {sendStatus === 'reply' || sendStatus === 'edit' ? (
                        <>
                            <div className="typeof-message">
                                {sendStatus == 'reply' ? (
                                    
                                    <div className="reply">
                                    {messageToReply.type === "files" || messageToReply.type === "edited-files" ? (
                                        <>
                                    <h5>Reply: {messageToReply.msg.length > 1 ? 'files ' : '1 file '} 
                                            from {messageToReply.from}</h5>  
                                        </>
                                    ) : (
                                        <>
                                        {typeof messageToReply.msg === "object" ? (
                                            <>
                                            <h5>Reply: {messageToReply.msg.length > 1 ? 'files ' : '1 file '} 
                                            from {messageToReply.from}</h5>                                                
                                            </>
                                        ) : (
                                            <>
                                        <h5>Reply: {messageToReply.msg.slice(0, 50)}
                                        {messageToReply.msg.length > 50 ? '...' : ''}</h5>  

                                            </>
                                        )}
                                        </>
                                    )}
                                    </div>

                                ) : (
                                    <>
                                        {typeof messageToEdit === "object" ? (
                                            <></>
                                        ) : (
                                      
                                        <div className="edit">
                                            <h5>Edit: {messageToEdit.slice(0, 50)}
                                            {messageToEdit.length > 50 ? '...' : ''}</h5>  
                                        </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    ) : (<></>)}

                <div className="write-text">

                    
                    
                    <label className="file-label" htmlFor="fileUpload">📎Attach</label>
                    <input type="file" id="fileUpload" key={fileInputKey} onChange={handleAttachFiles}
                        ref={fileInputRef}/>

                    <input className="user-input" value={inputValue} style={{width:'90%'}}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    
                    {attachedFiles && <AttachedFileModal attachedFiles={attachedFiles}
                     setAttachedFiles={setAttachedFiles} handleAttachFiles={handleAttachFiles}
                        selectedUser={user} fileInputRef={fileInputRef} resetFileInputKey={resetFileInputKey}
                        editingAttachedFiles={editingAttachedFiles} setEditingAttachedFiles={setEditingAttachedFiles}
                        selectedFileMessageID={selectedFileMessageID} setSelectedFileMessageID={setSelectedFileMessageID}
                        sendStatus={sendStatus} setSendStatus={setSendStatus} attachedFilesComment={attachedFilesComment}
                        setAttachedFilesComment={setAttachedFilesComment} chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                     />}

                    <button className="send" onClick={() => {

                        if(inputValue !== '' && sendStatus === 'send'){
                            
                            if(chatHistory){

                                const newMessages = [...user.messages, 
                                {id: user.messages.length + 1, from: "Shoya", msg: inputValue,
                                 createdAt: new Date().toISOString(), type:"normal"}]
                                
                                updatedMessages(newMessages)
                                                            
                            if(inputValue !== ''){
                                setInputValue('')
                            } else if(fileInputRef.current !== null){
                                fileInputRef.current.value = null
                            }
                            
                            } else {
                                setChats( prevChats => [...prevChats, {id: prevChats.length + 1,
                                name: user.name, messages: [{id: 1 ,from:"Shoya", msg: inputValue, 
                                createdAt: new Date().toISOString(), type:"normal"}],
                                img: user.img, lastUpdatedAt: new Date().toISOString()
                                }])

                            if(inputValue !== ''){
                                setInputValue('')
                            } else if(fileInputRef.current !== null){
                                fileInputRef.current.value = null
                            }
                                setChatHistory(true)
                            }
                        
                        } else if(inputValue !== '' && sendStatus === 'edit') {
                            
                            const selectedMessage = user.messages.find(
                                (message) => message.id === messageToEdit.id)
                            
                            console.log(selectedMessage)
                            selectedMessage.msg = inputValue
                            selectedMessage.type = 'edited'
                            
                            setChats( prevChats => prevChats.map((chat) => chat.name === name 
                            ? {...chat, messages: chat.messages} : chat))

                            setInputValue('')
                            setSendStatus('send')

                        }
                        else if(inputValue !== '' && sendStatus === 'reply'){

                            const selectedMessage = user.messages.find(
                                (message) => message.id === messageToReply.id)
                            
                            const newMessages = [...user.messages,
                            {id:user.messages.length + 1 ,from:"Shoya", msg: inputValue,
                             createdAt: new Date().toISOString(), type:"reply", ref:selectedMessage}]
                            
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


const ShowMessages = ({chat, onDeleteMessage, setMessageToEdit, setMessageToReply, inputValue,
    setInputValue, setSendStatus, setAttachedFiles, setEditingAttachedFiles, setSelectedFileMessageID,
    setAttachedFilesComment}) => {
    
    const messages = chat.messages    
        
    const [showThreeOptions, setShowThreeOptions] = useState(false)
                
    const replyMessage = (theMessage) => {
        
        setMessageToReply(theMessage)
        
        if(inputValue){
            setInputValue('')
        }
        setShowThreeOptions(false)
        setSendStatus('reply')

    }

    const editMessage = (theMessage) => {
        setShowThreeOptions(false)

        if(typeof theMessage.msg === "object"){
            if(theMessage.comment !== ''){
                setAttachedFilesComment(theMessage.comment)
            }
            setEditingAttachedFiles(true)
            setAttachedFiles(theMessage.msg)
            setSelectedFileMessageID(theMessage.id)
        } else {
            setInputValue(theMessage.msg)
            setMessageToEdit(theMessage)
        }
        
        setSendStatus('edit')
    }

    const deleteMessage = (theMessage) => {
        setShowThreeOptions(false)
        onDeleteMessage(theMessage)
    }


    const [optionsIndex, setOptionsIndex] = useState(null)

    const [showModal, setShowModal] = useState(false)

    const [messageToForward, setMessageToForward] = useState(null)

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
                            
                            <h5 onClick={() => {
                                setShowThreeOptions(false)
                                setShowModal(true)
                                setMessageToForward(message)
                                }}>Forward</h5>
                            
                            {showModal && <OptionsModal messageToForward={messageToForward}
                            setMessageToForward={setMessageToForward} modalType={'forward'} setShowModal={setShowModal}/>}
                            
                            <h5 onClick={() => editMessage(message)}>Edit</h5>
                            <h5 onClick={() => deleteMessage(message.msg)}>Delete</h5>
                        
                        
                        </div>
                            

                        </div>
                        
                        <div className="messages-sent">
                            {message.ref ? (
                                <>
                                    <div className="reply-preview">
                                    <h5 style={{fontSize:"13px"}}>{message.ref.from}</h5>
                                        {message.ref.type === "files" || message.ref.type === "edited-files" ? (
                                            <>
                                                <h5>{message.ref.msg.length > 1 ? (<>
                                                {message.ref.msg.length} files
                                                </>) : (<>{message.ref.msg.length} file</>)}</h5>
                                            </>
                                        ) : (
                                            <>
                                            {typeof message.ref.msg !== "object" ? (
                                                <>
                                                <h5>{message.ref.msg.slice(0, 30)}
                                                {message.ref.msg.length > 30 ? '...' : ''}</h5>
                                                </>
                                            ) : (
                                                <></>
                                            )}
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
                                

                                {message.type === "files" || message.type === "edited-files" ? (
                                    <>
                                    <ShowcaseFiles files={message} />                                        
                                    </>
                                ) : (
                                    <>
                                    {typeof message.msg === "object" ? (
                                        <>
                                        <ShowcaseFiles files={message} />
                                        </>
                                        
                                    ) : (
                                        <><h4>{message.msg}</h4></>
                                    )}
                                    </>
                                )}




                                <h5>
                                {message.type == "edited" || message.type == "edited-files" ? "Edited, " : ""}
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