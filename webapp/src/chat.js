
import { people } from "./people"
import { allChats } from "./data"
import './css/chat.css'
import { useEffect, useState, useContext, useRef } from "react"
import { chatsContext, showChatContext, pinnedMessagesContext, postCommentsContext, searchTermsContext,
        modalContext, userContext, } from "./chats"

import {OptionsModal, AttachedFileModal} from './modal'
import { UserInfo, GroupInfo, ChannelInfo } from "./chat-info"


import ShowcaseFiles from "./files"

const ChatParent = ({ name }) => {

    return (
        <Chat
         name={name}
        />
    )
}



const Chat = ({name}) => {
    
    const baseURL = 'http://localhost:8080/api/v1'

    const {chats, setChats} = useContext(chatsContext)
    const {setShowChat} = useContext(showChatContext)

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
        
            if(inputValue && showPostComments){
                setInputValue('')
            }
        }
    

    var user = chats.find((chat) => chat.name === name) ?? people.find((person) => person.name === name)
    

    const {currentUser, token, chatID} = useContext(userContext)
    const [chatMessages, setChatMessages] = useState([])
    

    useEffect(() => {   
        setChatHistory(chats.find((chat) => chat.name === name) ? true : false)

        if(showPinnedMessages) setShowPinnedMessages(false)
        if(!canShowOtherChat) {
            setCanShowOtherChat(true)
        } else setShowPostComments(false)

        if(inputValue) setInputValue('')

        // here's where we receive messages 
        const fetchChat = async () => {
            
            try {
                
                const response = await fetch(`${baseURL}/chats/${chatID}/messages`,{
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type':'application/json'
                    }
                })
                if(!response.ok){
                    throw new Error('Failed retrieving messages from chat')
                }

                const chatMessagesData = await response.json()
                setChatMessages(chatMessagesData.messages)
            } catch (error) {
                console.log(error);
            }
        }

        fetchChat()

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
        
    
    const [highlightMsgId, setHighlightMsgId] = useState(null)
    
    const [currentLine, setCurrentLine] = useState(0)

    const highlightMessage = (msgId) => {        
        setHighlightMsgId(msgId - 1)
        setTimeout(() => {
            setHighlightMsgId(null)
        }, 3000)
    }

    const {showPinnedMessages, setShowPinnedMessages} = useContext(pinnedMessagesContext)

    const {showPostComments, setShowPostComments} = useContext(postCommentsContext)

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
    const [showChannelInfo, setShowChannelInfo] = useState(false)

    const [selectedPost, setSelectedPost] = useState(null) // for when we click on comment-section of a post
    const [canShowOtherChat, setCanShowOtherChat] = useState(true)

    const [showChatOptions, setShowChatOptions] = useState(false)

    const {modalType, setModalType, showModal, setShowModal} = useContext(modalContext)
    
    const [selectedModalMsg, setSelectedModalMsg] = useState(null)

    const openModal = (type, message) => {
        if(showChatOptions) setShowChatOptions(false)
        
        setModalType(type)
        setSelectedModalMsg(message)
        setShowModal(true)
    }


    const leaveChat = (chosenChat) => {
        setShowChat(false)
        const filteredChats = allChats.filter((chat) => chat.id !== chosenChat.id)
        setChats(filteredChats)
    }

    const [voteTopic, setVoteTopic] = useState('')
    const [voteOptions, setVoteOptions] = useState(['', ''])
    const [selectedVoteOption,setSelectedVoteOption] = useState('')

    const editVote = (voteTopic, voteOptions, id) => {
        const newMessages = user.messages.map((message) => {
            if(message.id === id){
                message.topic = voteTopic
                message.options = voteOptions
                return message
            } else {
                return message
            }
        })
        updatedMessages(newMessages)
    }


    const getChatName = (chatType) => {
        if(chatType === 'group' || chatType === 'channel'){
            console.log('type is not chat');
        } else if(chatType === "Normal"){
            const secondUser = user.users.find(user => user.name !== currentUser.name)        
            return secondUser.name
        }
    }

    const [selectedChatsId, setSelectedChatsId] = useState([])
    
    const sendingMessage = async (sendStatusType, message = null) => {
        
        switch (sendStatusType) {

            case 'send':
                try {
                    const response = await fetch(`${baseURL}/chats/${chatID}/messages`,
                        {
                            method:'POST',
                            headers:{
                                'Authorization':`Bearer ${token}`,
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({
                                message:inputValue,
                                type:"Text"
                            })
                        }
                    )

                    const messageData = await response.json()

                    if(!response.ok){
                        throw new Error('Error occurred while sending message', messageData.message)
                    }

                    console.log('message has been sent', messageData);
                    
                } catch (error) {
                    console.log(error);
                } finally{
                    setInputValue('')
                }

                break;
     
            case 'setup-vote':
                try {
                    const response = await fetch(`${baseURL}/chats/${chatID}/messages`,
                        {
                            method:'POST',
                            headers:{
                                'Authorization':`Bearer ${token}`,
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({
                                topic:voteTopic,
                                options:voteOptions,
                                allVotes:[],
                                type:"Vote"
                            })
                        }
                    )

                    const messageData = await response.json()
                    
                    setVoteTopic('')
                    setVoteOptions(['', ''])
                    
                    if(!response.ok){
                        throw new Error('Error occurred while submitting the vote', messageData.message)
                    }

                    console.log('Vote has been sent', messageData);
                    
                } catch (error) {
                    console.log(error);
                } finally{
                    
                }

                break;
  
            case 'send-vote':
                
                try {
                    const response = await fetch(`${baseURL}/chats/${chatID}/messages/${message._id}/vote`,
                        {
                            method:'PATCH',
                            headers:{
                                'Authorization':`Bearer ${token}`,
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({
                                selectedOption:selectedVoteOption
                            })
                        }
                    )

                    const messageData = await response.json()
                    
                    setVoteTopic('')
                    setVoteOptions(['', ''])
                    setSelectedVoteOption('')
                    setSelectedModalMsg('')
                    
                    if(!response.ok){
                        throw new Error('Error occurred while submitting the vote', messageData.message)
                    }

                    console.log('Vote has been sent', messageData);
                    
                } catch (error) {
                    console.log(error);
                } finally{
                    
                }

                break;

            case 'send-files':

                const formData = new FormData()
                attachedFiles.forEach(file => {
                    formData.append('files', file)
                })

                console.log(attachedFiles);
                formData.append('comment', attachedFilesComment)

                try {
                    for (const pair of formData.entries()) {
                    console.log(pair[0], pair[1])
                    }
                    const response = await fetch(`${baseURL}/chats/${chatID}/messages/files`,
                        {
                            method:'POST',
                            headers:{
                                'Authorization':`Bearer ${token}`
                            },
                            body: formData
                        }
                    )

                    const messageData = await response.json()

                    if(!response.ok){
                        throw new Error('Error occurred while sending files', messageData.message)
                    }

                    console.log('files have been sent', messageData);
                    
                } catch (error) {
                    console.log(error);
                }

                break;

            case 'reply':
                    try {
                        const response = await fetch(`${baseURL}/chats/${chatID}/messages`,
                            {
                                method:'POST',
                                headers:{
                                    'Authorization':`Bearer ${token}`,
                                    'Content-Type':'application/json'
                                },
                                body: JSON.stringify({
                                    message:inputValue,
                                    type:"Reply",
                                    messageToReplyId: messageToReply._id
                                })
                            }
                        )

                        const messageData = await response.json()

                        setSelectedModalMsg('')
                        if(!response.ok){
                            throw new Error('Error occurred while replying the message', messageData.message)
                        }

                        console.log('reply has been sent', messageData);
                        
                    } catch (error) {
                        console.log(error);
                    } finally{
                        setInputValue('')
                    }

                    break;
    
            case 'edit':

                try {
                    console.log(selectedModalMsg);
                    
                    const response = await fetch(`${baseURL}/chats/${chatID}/messages/${selectedModalMsg._id}`,{
                        method:'PATCH',
                        headers:{
                            'Authorization':`Bearer ${token}`,
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            userInput:inputValue
                        })
                    })

                    const editedData = await response.json()
                    
                    if(!response.ok){
                        throw new Error('Problem occurred while editing the message' || editedData.message)
                    }
                    setInputValue('')
                    setSelectedModalMsg('')

                } catch (error) {
                    console.log(error);
                } finally {
                    console.log('Message has been edited');
                }

                break;
                    // if(typeof theMessage.msg === "object"){
                    //     if(theMessage.comment !== ''){
                    //         setAttachedFilesComment(theMessage.comment)
                    //     }
                    //     setEditingAttachedFiles(true)
                    //     setAttachedFiles(theMessage.msg)
                    //     setSelectedFileMessageID(theMessage.id)
                    // } else {
                    //     if(theMessage.type === 'vote'  || theMessage.topic !== undefined){
                    //         openModal('edit-vote', theMessage)
                    //     } else {
                    //         setInputValue(theMessage.msg)
                    //         setMessageToEdit(theMessage)
                    //     }
                    // }

       

            case 'forward':
                try {
                    const forwardPromises = selectedChatsId.map(chatId => {
                        return fetch(`${baseURL}/chats/${chatId}/messages/${selectedModalMsg._id}/forward`,
                            {
                                method:'POST',
                                headers:{
                                    'Authorization':`Bearer ${token}`,
                                    'Content-Type':'application/json'
                                   },
                                body: JSON.stringify({
                                    selectedChatsId
                                })
                            }
                        )
                    })

                    const responses = await Promise.all(forwardPromises)
                    
                    setSelectedChatsId([])
                    
                    for(const response of responses){
                        if(!response.ok){                            
                            throw new Error('Error occurred while forwarding message')
                        }
                    }

                    console.log('message was sent to all chats');
                    
                } catch (error) {
                    console.log(error);
                }

                break;

            case 'pin':
                try {
                    const response = await fetch(`${baseURL}/chats/${chatID}/messages/${selectedModalMsg._id}/pin`,
                        {
                            method:'POST',
                            headers:{
                                'Authorization':`Bearer ${token}`,
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({
                                message:inputValue,
                                type:"Text"
                            })
                        }
                    )

                    const messageData = await response.json()

                    if(!response.ok){
                        throw new Error('Error occurred while sending message', messageData.message)
                    }

                    console.log('message has been sent', messageData);
                    
                } catch (error) {
                    console.log(error);
                }
                break;


            default:
                break;
        }

        if(sendStatus !== 'send') setSendStatus('send')

    }

    const onDeleteMessage = async (messageId) => {
        try {
            const response = await fetch(`${baseURL}/chats/${chatID}/messages/${messageId}`,{
                method:'DELETE',
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            const deletedData = await response.json()

            if(!response.json){
                throw new Error('Problem occurred while deleting the message' || deletedData.message)
            }

        } catch (error) {
            console.log(error);
        } finally {
            console.log('Message has been deleted');
        }
    }

    const {setSearchMod} = useContext(searchTermsContext)
    

    return (
    <>
            <div className="chat-container">

                    {showUserInfo && <UserInfo chat={user} setShowUserInfo={setShowUserInfo} />}
                    {showGroupInfo && <GroupInfo chat={user} setShowGroupInfo={setShowGroupInfo} />}
                    
                    {showChannelInfo && <ChannelInfo chat={user} setShowChannelInfo={setShowChannelInfo} />}

                    {!showPinnedMessages && !showPostComments && (
                        <>

                    <div className="user-info">
                        
                        <div onClick={() => user.type === "Normal" 
                        ? setShowUserInfo(true) : (user.type === 'Group' 
                        ? setShowGroupInfo(true) : setShowChannelInfo(true))} style={{position:'relative', 
                        display:'flex', width:'90%'}}>

                            <img alt="" src={(() => {
                                if(user.type === 'Normal'){
                                    const otherUser = user.users.find(user => user._id !== currentUser.id)
                                    return otherUser ? otherUser.img 
                    : "https://t4.ftcdn.net/jpg/05/31/37/89/360_F_531378938_xwRjN9e5ramdPj2coDwHrwk9QHckVa5Y.jpg"
                                } else {
                                    return user.img
                                }
                                })()
                                }

                            />
                            <div className="user">
                                <h2>{getChatName(user.type)}</h2>
                                {user.type === 'Group' ? (<><h5>{user.users.length} members</h5></>)
                                    : (<>
                                    {user.type === 'Channel' ? (<>{user.users.length} subscribers</>)
                                    : (<>
                                    {user.name === 'Saved Messages' ? (<></>) : (<><h5>Last seen recently</h5></>) } 
                                    </>)} </>)}

                            </div>

                        </div>
                        
                        <div className="chat-options-container">
                        <button onClick={() => {
                                setSearchMod('terms')
                            }}>Search</button>
                        
                        
                            <button className="chat-options-button" 
                            onClick={() => setShowChatOptions(!showChatOptions)}>dots</button>
                            
                            {showChatOptions && (<>
                                <div className={`chat-options-menu ${showChatOptions ? 'show' : ''}`}>
                                        {(user.type === 'Channel' || user.type === 'Group') && (
                                            <><h5 onClick={() => openModal('setup-vote', user)}>Setup Vote</h5></>
                                        )}
                                        {chatHistory && (<><h5 style={{color:'#ae1212ff'}}
                                        onClick={() => openModal('leave-chat', user)} //deleting the chat from our list
                                        >Leave</h5></>)}
                        
                        
                    {showModal && <OptionsModal 
                    {...(modalType === 'setup-vote' 
                    ? { sendingMessage, voteTopic, setVoteTopic, setVoteOptions, voteOptions, selectedModalMsg } : {})}
                    {...(modalType === "leave-chat" ? { leaveChat, selectedModalMsg } : {})}
                    modalType={modalType} setShowModal={setShowModal}/>}
                        
                                        
                                </div>
                            </>)}

                        </div>

                    </div>
                        </>
                    )}

                    {!showPinnedMessages && !showPostComments && (<>
                    <div className="pinned-messages" style={{backgroundColor:'#19138ad8'}}>
                        {user.pinnedMessages !== undefined && (
                            <>

                            {user.pinnedMessages.length != 0 && (<>
                            <div className="pinned-message-container">
                            
                            
                            <div className="pinned-messages-lines">
                                {user.pinnedMessages.slice(0, 3).map((msg, index, arr) => (
                                    <div key={index} className={`line-segment ${index === arr.length - 
                                        `${currentLine === 0 ? 1 : currentLine}` ? 'current-pin' : ''}`}>
                                    </div>
                                ))}
                            
                            </div>

                    <div style={{position:'relative',width:'80%',left:'30px',display:'flex',flexDirection:'column'}}
                    onClick={() => {
                        const pinnedMessagesLength = user.pinnedMessages.length
                        if(currentLine < pinnedMessagesLength){
                            if(currentLine === 0){
                                setCurrentLine(1)                                
                                highlightMessage(user.pinnedMessages[user.pinnedMessages.length - 1].messageID)
                            } else {
                                setCurrentLine(currentLine + 1)
                            highlightMessage(user.pinnedMessages[user.pinnedMessages.length - currentLine].messageID)
                            }
                        } else {
                            setCurrentLine(1)
                            highlightMessage(user.pinnedMessages[user.pinnedMessages.length - currentLine].messageID)
                        }
                        }}
                    >
                            <h5 style={{marginBottom:'0px', marginTop:'5px', color:'#ffffffff'}}>
                            Pinned Message #{currentLine === 0 ? `${user.pinnedMessages.length}` 
                            : `${user.pinnedMessages.length - currentLine + 1}`}</h5>
                                
                            <h6 style={{marginTop:'6px', marginBottom:'0px', color:'#d0db38ff'}}>
                                {user.pinnedMessages[user.pinnedMessages.length - 1].from.name}
                                </h6>
                            <h5 style={{marginTop:'2px', marginBottom:'0px', color:'#ffffffff'}}>
                                {currentLine === 0 ? `${user.pinnedMessages[user.pinnedMessages.length - 1].msg}`
                                : `${user.pinnedMessages[user.pinnedMessages.length - currentLine].msg}`}
                                    </h5>
                            </div>
                            <button style={{position:'relative', width:'60px', height:'20px', top:'20px', left:'100px'}}
                            onClick={() => setShowPinnedMessages(true)}>Pinned Messages</button>
                            </div>
                            </>)}
                            
                            </>

                        )}
                    </div>
                    </>)}


                    <div className="chat-section">


                        
                            {<ShowMessages chat={user} setChats={setChats} onDeleteMessage={onDeleteMessage}
                                setMessageToEdit={setMessageToEdit} setMessageToReply={setMessageToReply}
                                inputValue={inputValue} setInputValue={setInputValue} setSendStatus={setSendStatus} 
                                setAttachedFiles={setAttachedFiles} setEditingAttachedFiles={setEditingAttachedFiles}
                                setSelectedFileMessageID={setSelectedFileMessageID}
                                setAttachedFilesComment={setAttachedFilesComment} highlightMsgId={highlightMsgId}
                                highlightMessage={highlightMessage} selectedPost={selectedPost} 
                                setSelectedPost={setSelectedPost} updatedMessages={updatedMessages} openModal={openModal}
                                showModal={showModal} setShowModal={setShowModal} modalType={modalType} 
                                setModalType={setModalType} selectedModalMsg={selectedModalMsg} 
                                setSelectedModalMsg={setSelectedModalMsg} leaveChat={leaveChat}
                                editVote={editVote} chatMessages={chatMessages} setChatMessages={setChatMessages}
                                selectedChatsId={selectedChatsId} setSelectedChatsId={setSelectedChatsId}
                                sendingMessage={sendingMessage} setSelectedVoteOption={setSelectedVoteOption}
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
                                            {messageToReply.type === 'vote' ? (<>
                                                <h5>Reply: {messageToReply.topic.slice(0, 50)}
                                                {messageToReply.topic.length > 50 ? '...' : ''}</h5>  
                                            </>) : (<>
                                                <h5>Reply: {messageToReply.msg.slice(0, 50)}
                                                {messageToReply.msg.length > 50 ? '...' : ''}</h5>  
                                            </>)}

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

                {!showPinnedMessages && ((user.type !== 'Channel' || showPostComments === true) ||
                (user.type === 'Channel' && user.admins.includes("Shoya"))) && (<>
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
                        setChatHistory={setChatHistory} sendingMessage={sendingMessage}
                    />}

                    <button className="send" onClick={() => sendingMessage(sendStatus)}
                    >{sendStatus === 'send' && <>Send</>}
                     {sendStatus === 'reply' && <>Reply</>}
                     {sendStatus === 'edit' && <>Edit</>}
                    </button>
                </div>
                </>)}

                        {user.type === 'Channel' && !showPostComments && !user.admins.includes("Shoya") && (<>
                            <div style={{textAlign:'center'}}>
                                <h3>JOIN</h3>
                            </div>
                        </>)}


            </div>

    </>
    )


}


const ShowMessages = ({chat, setChats, onDeleteMessage, setMessageToEdit, setMessageToReply, inputValue,
    setInputValue, setSendStatus, setAttachedFiles, setEditingAttachedFiles, setSelectedFileMessageID,
    setAttachedFilesComment, highlightMsgId, highlightMessage, selectedPost, setSelectedPost, openModal,
    showModal, setShowModal, modalType, setModalType, selectedModalMsg, setSelectedModalMsg, leaveChat,
    editVote, chatMessages, selectedChatsId, setSelectedChatsId, sendingMessage, voteTopic, setVoteTopic,
    voteOptions, setVoteOptions, setSelectedVoteOption }) => {
    
    const {currentUser} = useContext(userContext)
    
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
        setInputValue(theMessage.msg)
        setSendStatus('edit')
        setSelectedModalMsg(theMessage)
    }

    const [optionsIndex, setOptionsIndex] = useState(null)

    const [messageToForward, setMessageToForward] = useState(null)
    

    const {showPinnedMessages} = useContext(pinnedMessagesContext)
    const {showPostComments, setShowPostComments} = useContext(postCommentsContext)

    const [selectedOptions, setSelectedOptions] = useState({})
    const [showVoteOptions, setShowVoteOptions] = useState({})

    const voteCounts = (message) => {
        return message.options.map((option, index) => 
            {
                const optionNumber = index + 1
                return message.allVotes.filter(vote => vote.selectedOption === optionNumber).length
            })
    }

    const votePercentage = (num, message) => {        
        const totalVotes = message.allVotes.length 
        return ((num/totalVotes) * 100).toFixed(1)
    }    

    return (
    <>

        {chatMessages && !showPinnedMessages && !showPostComments ?
        
        (
            chatMessages.map((message, index) => {

                if(message.from.name !== currentUser.name){
                    
                    return (
                        <div className={`message-wrapper left ${highlightMsgId == `${index}` ? 'highlight' : ''} `} 
                        key={index} id={`msg-${index}`}>

                        
                            {chat.type === 'Group' ? (<>

                                {chat.users.map((user, index) => {
                                    if(user.name == message.from.name){

                                        return (<div key={index}> <img src={user.img} 
                                    style={{width:'36px', height:'36px', borderRadius:'50%', marginRight:'5px',
                                        position:'relative', left:'0', objectFit: 'cover',flexShrink: '0'}}/>
                                        </div>)
                                    }
                                })} </>) : (<></>)}
                            
                            <div className="messages-received">
                            {message.ref ? (
                                <>
                                    <div className="reply-preview" onClick={() => highlightMessage(message.ref._id)}>
                                    <h5 style={{fontSize:"13px"}}>{message.ref.from.name}</h5>
                                        {message.ref.type === "Files" || 
                                        (message.ref.type === "Files" && message.edited === true) ? (
                                            <>
                                                <h5>{message.ref.msg.length > 1 ? (<>
                                                {message.ref.msg.length} files
                                                </>) : (<>{message.ref.msg.length} file</>)}</h5>
                                            </>
                                        ) : (
                                            <>
                                            {typeof message.ref.msg !== "object" ? (
                                                <>
                                                {message.type === 'Vote' ? (<>
                                                    <h5>{message.ref.topic.slice(0, 30)}
                                                    {message.ref.topic.length > 30 ? '...' : ''}</h5>
                                                </>) : (<>
                                                    <h5>{message.ref.msg.slice(0, 30)}
                                                    {message.ref.msg.length > 30 ? '...' : ''}</h5>
                                                </>)}
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                            </>
                                        )}

                                    </div>
                                </>
                            ) : (<></>)}

                                {chat.type === 'Group' ? (
                                    <><h5 style={{position:'relative', textAlign:'left'}}>{message.from.name}</h5></>
                                ) : (<></>)}
                                    
                                { message.type === 'Vote' && (<>
                                    <h3 style={{marginTop:'5px'}}>{message.topic}</h3>
                                    
                                    {message.options.map((option, index) => {
                                    
                                    const optionChecked = selectedOptions[message._id] === index + 1
                                    const selectedOption = selectedOptions[message._id] || false 

                                    if(message.allVotes.some(vote => String(vote.voter) === String(currentUser._id))){
                                        return (<>
                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <h5>{option}</h5>
                                        <span> - {voteCounts(message)[index]} votes - 
                                        ({votePercentage(voteCounts(message)[index], message)}%)
                                        </span>
                                        </div>
                                        </>)
                                    } else {
                                        return (<>

                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <input type="radio" checked={optionChecked} 
                                            onClick={() => {
                                                    if(selectedOptions[message.id] === index+1){
                                                        setSelectedOptions(prev => ({...prev, [message._id]:null}))
                                                        setShowVoteOptions(prev => ({...prev, [message._id]:false}))
                                                        setSelectedVoteOption('')
                                                    } else {
                                                        setSelectedOptions(prev => ({...prev, [message._id]:index+1}))
                                                        setShowVoteOptions(prev => ({...prev, [message._id]:true}))
                                                        setSelectedVoteOption(index+1)
                                                    }
                                            }
                                                }/>
                                            <h5>{option}</h5>
                                        </div>
                                        </>)
                                    }
                                    

                                    })}
                                    {showVoteOptions[message._id] && (<>
                                    <h4 style={{textAlign:'center'}} onClick={() => {
                                    setSelectedModalMsg(message)
                                    setShowVoteOptions(prev => ({...prev, [message._id]:false}))
                                    sendingMessage('send-vote')
                                    }}>vote</h4>
                                    </>)}
                                </>)}


                                {typeof message.msg === 'string' && (<>
                                    <h4 style={{marginTop:'4px'}}>
                                        {message.msg}
                                    </h4>
                                </>)}

                                <div style={{display:'flex', justifyContent:'flex-end' ,textAlign:'right'}}>

                                {chat.type === 'Channel' && (<><h5 style={{bottom:'6px', right:'68px'}}>
                                {message.from}, </h5></>)}
                                <h5> {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                                </div>

                                    {chat.type === 'Channel' && (
                                    <div style={{position:'relative', textAlign:'left', top:'-3px'}} 
                                    onClick={() => { 
                                        setSelectedPost(message)
                                        setShowPostComments(true)}
                                        }>    
                                    <hr />
                                    
                                        {message.msgComments.length === 0 ? (<><h5>No comment...</h5></>)
                                        : (<>{message.msgComments.length === 1 ? (<><h5>1 Comment</h5></>)
                                        : (<> <h5>{message.msgComments.length} Comments</h5></>)}
                                        </>)}
                                        
                                    </div>
                                    )}


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
                            
                            <h5 onClick={() => {
                                openModal('forward', message)
                                setShowThreeOptions(false)
                                }}>Forward</h5>
                            
                            <h5 onClick={() => {
                                navigator.clipboard.writeText(message.msg);
                                setShowThreeOptions(false)}}>Copy</h5>
                            
                            <h5 onClick={() => {
                                openModal('pin', message)
                                setShowThreeOptions(false)
                            }}>Pin</h5>

                    {showModal && <OptionsModal {...(modalType === 'forward' ? {
                    selectedModalMsg, setSelectedModalMsg, selectedChatsId, setSelectedChatsId, sendingMessage} : {})}
                    {...(modalType === "pin" ? {sendingMessage, selectedModalMsg} : {})}
                    {...(modalType === 'setup-vote' 
                    ? {sendingMessage, voteTopic, setVoteTopic, setVoteOptions, voteOptions, selectedModalMsg } : {})}
                    {...(modalType === "leave-chat" ? { leaveChat, selectedModalMsg } : {})}
                    modalType={modalType} setShowModal={setShowModal}/>}
                        
                        
                        </div>
                            

                        </div>

                        </div>
                    )

                } else if(message.from.name === currentUser.name) {
                    
                    return (
                    <div className={`message-wrapper right ${highlightMsgId == `${index}` ? 'highlight' : ''} `} 
                        key={index} id={`msg-${index}`}>
                        
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
                                openModal('pin', message)
                                setShowThreeOptions(false)
                            }}>Pin</h5>

                            <h5 onClick={() => {
                                setShowThreeOptions(false)
                                openModal('forward', message)
                                }}>Forward</h5>
                            
                    {showModal && <OptionsModal {...(modalType === 'forward' 
                ? { selectedModalMsg, setSelectedModalMsg, selectedChatsId, setSelectedChatsId, sendingMessage} : {})}
                        
                    {...(modalType === "delete" ? {onDeleteMessage, selectedModalMsg} : {})}
                    {...(modalType === "pin" ? {sendingMessage, selectedModalMsg} : {})}
                    {...(modalType === 'setup-vote' 
                    ? { sendingMessage, voteTopic, setVoteTopic, setVoteOptions, voteOptions, selectedModalMsg } : {})}
                    {...(modalType === 'edit-vote' ? { editVote, selectedModalMsg } : {})}
                    {...(modalType === "leave-chat" ? { leaveChat, selectedModalMsg } : {})}

                    modalType={modalType} setShowModal={setShowModal}/>}

                            <h5 onClick={() => editMessage(message)}>Edit</h5>
                            <h5 onClick={() => {
                                openModal('delete', message)
                                setShowThreeOptions(false)}}>Delete</h5>
                        
                        
                        </div>
                            

                        </div>
                        
                        <div className="messages-sent">
                            {message.ref ? (
                                <>
                                    <div className="reply-preview" onClick={() => highlightMessage(message.ref.id)}>
                                    <h5 style={{fontSize:"13px"}}>{message.ref.from.name}</h5>
                                        {message.ref.type === "Files" || 
                                        (message.ref.type === "Files" && message.edited === true) ? (
                                            <>
                                                <h5>{message.ref.msg.length > 1 ? (<>
                                                {message.ref.msg.length} files
                                                </>) : (<>{message.ref.msg.length} file</>)}</h5>
                                            </>
                                        ) : (
                                            <>
                                            {typeof message.ref.msg !== "object" ? (
                                                <>
                                                {message.ref.type === 'Vote' ? (<>
                                                    <h5>{message.ref.topic.slice(0, 30)}
                                                    {message.ref.topic.length > 30 ? '...' : ''}</h5>
                                                </>) : (<>
                                                    <h5>{message.ref.msg.slice(0,20)}
                                                    {message.ref.msg.length > 20 ? '...' : ''}</h5>
                                                </>)}
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                            </>
                                        )}

                                        
                                    </div>
                                </>
                            ) : (<></>)}

                            {message.forwarded === true ? (
                                <>
                                <div className="forward-preview">
                                    <h5>from: {message.origin?.name || 'Unknown'}</h5>
                                </div>
                                </>
                            ) : (<></>)}
                                

                                {message.type === "Files" || (message.type === "Files" && message.edited === true) ? (
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
                                        <></>
                                    )}
                                    </>
                                )}
                                
                                {(message.type === 'Vote' || message.topic !== undefined) && (<>
                                    <h3 style={{marginTop:'5px'}}>{message.topic}</h3>
                                    {message.options.map((option, index) => {
                                    
                                    const optionChecked = selectedOptions[message._id] === index + 1
                                    const selectedOption = selectedOptions[message._id] || false 

                                    if(message.allVotes.some(vote => 
                                    String(vote.voter.name) === String(currentUser.name))){
                                        return (<>
                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <h5>{option}</h5>
                                        <span> - {voteCounts(message)[index]} votes - 
                                        ({votePercentage(voteCounts(message)[index], message)}%)
                                        </span>
                                        </div>
                                        </>)
                                    } else {
                                        return (<>

                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <input type="radio" checked={optionChecked} 
                                            onClick={() => {
                                                    if(selectedOptions[message.id] === index+1){
                                                        setSelectedOptions(prev => ({...prev, [message._id]:null}))
                                                        setShowVoteOptions(prev => ({...prev, [message._id]:false}))
                                                        setSelectedVoteOption('')

                                                    } else {
                                                        setSelectedOptions(prev => ({...prev, [message._id]:index+1}))
                                                        setShowVoteOptions(prev => ({...prev, [message._id]:true}))
                                                        setSelectedVoteOption(index+1)
                                                    }
                                            }
                                                }/>
                                            <h5>{option}</h5>
                                        </div>
                                        </>)
                                    }
                                    

                                    })}
                                    {showVoteOptions[message._id] && (<>
                                        <h4 style={{textAlign:'center'}} onClick={() => {
                                        setShowVoteOptions(prev => ({...prev, [message._id]:false}))
                                        sendingMessage('send-vote', message)
                                        }}>vote</h4>
                                    </>)}
                                </>)}



                                {typeof message.msg === 'string' && (<>
                                    <h4 style={{marginTop:'4px'}}>
                                        {message.msg}
                                    </h4>
                                </>)}

                                <div style={{display:'flex', justifyContent:'flex-end'}}>

                                {chat.type === 'Channel' && (<><h5 style={{bottom:'6px', right:'68px'}}>
                                {message.from}, </h5></>)}
                                {message.edited === true && (<><h5>edited, </h5></>)}
                                <h5> {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                                </div>

                                    {chat.type === 'Channel' && (
                                    <div style={{position:'relative', top:'-3px'}} 
                                    onClick={() => { setSelectedPost(message)
                                        setShowPostComments(true)}}>    
                                    <hr />
                                    
                                        {message.msgComments.length === 0 ? (<><h5>No comment...</h5></>)
                                        : (<>{message.msgComments.length === 1 ? (<><h5>1 Comment</h5></>)
                                        : (<> <h5>{message.msgComments.length} Comments</h5></>)}
                                        </>)}
                                        
                                    </div>
                                    )}



                                </div>
                                


                            </div>
                        )
                    
                    
                }

            })

        ) : (
            <>
            {!showPinnedMessages && !showPostComments ? (<>
                <div >
                    <p style={{left:"45%", top:"40%"}}>No messages...</p>
                </div>
            </>) : (<>
                {/* if we had selected to showcase the pinned messages */}
                {showPinnedMessages ? (<>
                <ShowPinnedMessages pinnedMessages={chat.pinnedMessages}
                showThreeOptions={showThreeOptions} setShowThreeOptions={setShowThreeOptions}
                optionsIndex={optionsIndex} setOptionsIndex={setOptionsIndex} showModal={showModal}
                setShowModal={setShowModal} messageToForward={messageToForward} setMessageToForward={setMessageToForward}
                openModal={openModal} modalType={modalType} setModalType={setModalType} onDeleteMessage={onDeleteMessage}
                selectedModalMsg={selectedModalMsg} selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions} showVoteOptions={showVoteOptions} 
                setShowVoteOptions={setShowVoteOptions} voteCounts={voteCounts} votePercentage={votePercentage}
                />

                </>) : (<>
                {/* alternatively, for the comments below a channel post */}
                {showPostComments && <ShowPostComments post={selectedPost} highlightMessage={highlightMessage}
                optionsIndex={optionsIndex} setOptionsIndex={setOptionsIndex} showThreeOptions={showThreeOptions} 
                setShowThreeOptions={setShowThreeOptions} openModal={openModal}
                replyMessage={replyMessage} showModal={showModal} setShowModal={setShowModal} editMessage={editMessage}
                highlightMsgId={highlightMsgId} modalType={modalType} onDeleteMessage={onDeleteMessage}
                selectedModalMsg={selectedModalMsg} setSelectedModalMsg={setSelectedModalMsg}
            />}

                </>)}
            </>)}
            </>
        )
        
        }

    </>

    )
}


const ShowPinnedMessages = ({pinnedMessages, showThreeOptions, setShowThreeOptions, optionsIndex, setOptionsIndex,
    showModal, setShowModal, messageToForward, setMessageToForward, openModal, modalType, setModalType, onDeleteMessage,
    selectedModalMsg, selectedOptions, setSelectedOptions, showVoteOptions, setShowVoteOptions, voteCounts,
    votePercentage}) => {

    const {setShowPinnedMessages} = useContext(pinnedMessagesContext)
    
    const {currentUser} = useContext(userContext)

    console.log(pinnedMessages);
    
    return (

        <>
        <div style={{position:'relative', display:'flex', flexDirection:'row', height:'80px', width:'100%',
        backgroundColor:'#712727ff'}}>
        <button onClick={() => setShowPinnedMessages(false)}>Back</button>
        <h4>{pinnedMessages.length} Pinned Messages</h4>
        </div>
        
        {pinnedMessages.map((message, index) => {
            return (
                <div className="show-pinned-messages" key={index}>


                {message.from !== "Shoya" ? (
                    <>
                        <div className="message-wrapper left" key={index}>
                        
                            <div className="messages-received">

                            {message.forwarded === true ? (
                                <>
                                <div className="forward-preview">
                                    <h5>from: {message.origin.name}</h5>
                                </div>
                                </>) : (<></>)}

                                {message.type === "Files" || 
                                (message.type === "Files" && message.edited === true) ? (
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
                                        <>
                                    {message.topic !== undefined ? (<>



                                    <h3 style={{marginTop:'5px'}}>{message.topic}</h3>
                                    {message.options.map((option, index) => {
                                    
                                    const optionChecked = selectedOptions[message.id] === index + 1
                                    const selectedOption = selectedOptions[message.id] || false 

                                    if(message.allVotes.some(vote => String(vote.voter) === String(currentUser._id))){
                                        return (<>
                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <h5>{option}</h5>
                                        <span> - {voteCounts(message)[index]} votes - 
                                        ({votePercentage(voteCounts(message)[index], message)}%)
                                        </span>
                                        </div>
                                        </>)
                                    } else {
                                        return (<>

                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <input type="radio" checked={optionChecked} 
                                            onClick={() => {
                                                    if(selectedOptions[message.id] === index+1){
                                                        setSelectedOptions(prev => ({...prev, [message.id]:null}))
                                                        setShowVoteOptions(prev => ({...prev, [message.id]:false}))
                                                    } else {
                                                        setSelectedOptions(prev => ({...prev, [message.id]:index+1}))
                                                        setShowVoteOptions(prev => ({...prev, [message.id]:true}))
                                                    }
                                            }
                                                }/>
                                            <h5>{option}</h5>
                                        </div>
                                        </>)
                                    }
                                    

                                    })}
                                    {showVoteOptions[message.id] && (<>
                                        <h4 style={{textAlign:'center'}} onClick={() => {
                                        message.allVotes = [...message.allVotes, {"Shoya":selectedOptions[message.id]}]
                                        setShowVoteOptions(prev => ({...prev, [message.id]:false}))
                                        }}>vote</h4>
                                    </>)}

                                        </>) : (<>
                                            <><h4>{message.msg}</h4></>
                                        </>)}
                                        </>
                                    )}
                                    </>
                                )}


                                <h5 style={{textAlign:'right'}}>
                                {message.edited == true ? "edited, " : ""}
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

                            <h5 onClick={() => {
                                navigator.clipboard.writeText(message.phrase);
                                setShowThreeOptions(false)}}>Copy</h5>
                            

                            <h5 onClick={() => {
                                setShowThreeOptions(false)
                                setShowModal(true)
                                setMessageToForward(message)
                                setModalType('forward')
                                }}>Forward</h5>
                            
                            {showModal && <OptionsModal {...(modalType === 'forward' ? {
                                messageToForward, setMessageToForward} : {})}
                                {...(modalType === "delete" ? {onDeleteMessage, selectedModalMsg} : {})}
 
                              modalType={modalType} setShowModal={setShowModal}/>}
                            
                            <h5 onClick={() => {
                                openModal('delete', message)
                                setShowThreeOptions(false)}}>Delete</h5>
                        
                        
                        </div>
                            

                        </div>

                        </div>
                    
                    </>
                ) : (
                    <>
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

                            <h5 onClick={() => {
                                navigator.clipboard.writeText(message.phrase);
                                setShowThreeOptions(false)}}>Copy</h5>
                            

                            <h5 onClick={() => {
                                setShowThreeOptions(false)
                                setShowModal(true)
                                setMessageToForward(message)
                                setModalType('forward')
                                }}>Forward</h5>
                            
                            {showModal && <OptionsModal {...(modalType === 'forward' ? {
                                messageToForward, setMessageToForward} : {})}
                                {...(modalType === "delete" ? {onDeleteMessage, selectedModalMsg} : {})}

                              modalType={modalType} setShowModal={setShowModal}/>}
                            
                            <h5 onClick={() => {
                                openModal('delete', message)                                
                                setShowThreeOptions(false)}}>Delete</h5>
                        
                        
                        </div>
                            

                        </div>
                        
                        <div className="messages-sent">

                            {message.forwarded === true ? (
                                <>
                                <div className="forward-preview">
                                    <h5>from: {message.sentFrom}</h5>
                                </div>
                                </>) : (<></>)}

                                {message.type === "Files" ? (
                                    <>
                                    <ShowcaseFiles files={message} />                                        
                                    </>
                                ) : (
                                    <>
                                    {typeof message.phrase === "object" ? (
                                        <>
                                        <ShowcaseFiles files={message} />
                                        </>
                                        
                                    ) : (
                                        <>
                                    {message.topic !== undefined ? (<>



                                    <h3 style={{marginTop:'5px'}}>{message.topic}</h3>
                                    {message.options.map((option, index) => {
                                    
                                    const optionChecked = selectedOptions[message.id] === index + 1
                                    const selectedOption = selectedOptions[message.id] || false 

                                    if(message.allVotes.some(vote => String(vote.voter) === String(currentUser._id))){
                                        return (<>
                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <h5>{option}</h5>
                                        <span> - {voteCounts(message)[index]} votes - 
                                        ({votePercentage(voteCounts(message)[index], message)}%)
                                        </span>
                                        </div>
                                        </>)
                                    } else {
                                        return (<>

                                        <div className="vote-message-options"
                                        style={{display:'flex', flexDirection:'row', gap:'10px', marginBottom:'10px'}}
                                        key={index}>
                                            <input type="radio" checked={optionChecked} 
                                            onClick={() => {
                                                    if(selectedOptions[message.id] === index+1){
                                                        setSelectedOptions(prev => ({...prev, [message.id]:null}))
                                                        setShowVoteOptions(prev => ({...prev, [message.id]:false}))
                                                    } else {
                                                        setSelectedOptions(prev => ({...prev, [message.id]:index+1}))
                                                        setShowVoteOptions(prev => ({...prev, [message.id]:true}))
                                                    }
                                            }
                                                }/>
                                            <h5>{option}</h5>
                                        </div>
                                        </>)
                                    }
                                    

                                    })}
                                    {showVoteOptions[message.id] && (<>
                                        <h4 style={{textAlign:'center'}} onClick={() => {
                                        message.allVotes = [...message.allVotes, {"Shoya":selectedOptions[message.id]}]
                                        setShowVoteOptions(prev => ({...prev, [message.id]:false}))
                                        }}>vote</h4>
                                    </>)}









                                        </>) : (<>
                                            <><h4>{message.phrase}</h4></>
                                        </>)}
                                        </>
                                    )}
                                    </>
                                )}




                                <h5 style={{textAlign:'right'}}>
                                {message.edited == true ? "edited, " : ""}
                                    {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>

                        </div>
                                


                            </div>

                    </>
                )}
                    
                    

                </div>
            )
        })}

        </>
    )

}

const ShowPostComments = ({post, highlightMessage, optionsIndex, setOptionsIndex, showThreeOptions, 
    setShowThreeOptions, openModal, replyMessage, showModal, setShowModal, editMessage, highlightMsgId, modalType, 
        selectedModalMsg, setSelectedModalMsg}) => {

    const {setShowPostComments} = useContext(postCommentsContext)



    const onDeleteComment = (selectedMessage) => {
        post.msgComments = post.msgComments.filter((comment) => comment.id !== selectedMessage.id)
    }



    return (
        <>

        <div style={{backgroundColor:'#93a5ffff', display:'flex', flexDirection:'row'}}>
        <button onClick={() => setShowPostComments(false)}>Back</button>

            <div style={{display:'flex', flexDirection:'column'}}>
                <h4>Discussion</h4>
                {post.msgComments.length === 1 ? (<>
                    <h5>1 comment</h5>
                </>) : (<> {post.msgComments.length === 0 ? (<><h5>0 comments</h5></>) 
                    : (<><h5>{post.msgComments.length} comments</h5></>)}
                </>)}
            </div>

        </div>

                        <div className="channel-post-wrapper">
                            <div className="channel-post">

                                <h4 style={{marginTop:'4px', marginBottom:'2px'}}>
                                    {post.msg}
                                </h4>

                                <div style={{display:'flex', justifyContent:'flex-end'}}>

                                <h5 style={{bottom:'6px', right:'68px'}}>{post.from}, </h5>

                                <h5> {new Date(post.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                                </div>
                            </div>

                            </div>


            {post.msgComments.length !== 0 ? (<>
            <h5 style={{position:'relative', left:'45%', width:'120px'}}>Discussion started</h5>
            <br />
            {post.msgComments.map((comment, index) => {

                    if(comment.from !== "Shoya"){
                        
                        return (
                            <div className={`message-wrapper left ${highlightMsgId == `${index}` ? 'highlight' : ''} `} 
                            key={index} id={`msg-${index}`}>

                                
                                <div className="messages-received">                                        
                                    
                                    <h4 style={{marginTop:'4px'}}>
                                        {comment.msg}
                                    </h4>

                                    <div style={{display:'flex', justifyContent:'flex-end' ,textAlign:'right'}}>

                                    <h5> {new Date(comment.createdAt)
                                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </h5>
                                    </div>

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

                                <h5 onClick={() => replyMessage(comment)}>Reply</h5>
                                
                                <h5 onClick={() => {
                                    openModal('forward', comment)
                                    setShowThreeOptions(false)
                                    }}>Forward</h5>
                                
                                <h5 onClick={() => {
                                    navigator.clipboard.writeText(comment.msg);
                                    setShowThreeOptions(false)}}>Copy</h5>

                                {showModal && <OptionsModal {...(modalType === 'forward' ? {
                                    selectedModalMsg, setSelectedModalMsg} : {})}

                                modalType={modalType} setShowModal={setShowModal}/>}                        
                            </div>

                            </div>

                            </div>
                        )

                    } else {
                        
                        return (
                        <div className={`message-wrapper right ${highlightMsgId == `${index}` ? 'highlight' : ''} `} 
                            key={index} id={`msg-${index}`}>
                            
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

                                <h5 onClick={() => replyMessage(comment)}>Reply</h5>
                                <h5 onClick={() => {
                                    navigator.clipboard.writeText(comment.msg);
                                    setShowThreeOptions(false)}}>Copy</h5>
                                

                                <h5 onClick={() => {
                                    setShowThreeOptions(false)
                                    openModal('forward', comment)
                                    }}>Forward</h5>
                                
                                {showModal && <OptionsModal {...(modalType === 'forward' ? { 
                                    selectedModalMsg, setSelectedModalMsg } : {})}

                                    {...(modalType === "delete-comment" ? {onDeleteComment, selectedModalMsg} : {})}                             
                                modalType={modalType} setShowModal={setShowModal}/>}

                                <h5 onClick={() => editMessage(comment)}>Edit</h5>
                                <h5 onClick={() => {
                                    openModal('delete-comment', comment)                                
                                    setShowThreeOptions(false)}}>Delete</h5>
                            
                            
                            </div>
                                

                            </div>
                            
                            <div className="messages-sent">
                                {comment.ref ? (
                                    <>
                                        <div className="reply-preview" onClick={() => highlightMessage(comment.ref.id)}>
                                        <h5 style={{fontSize:"13px"}}>{comment.ref.from}</h5>
                                            {comment.ref.type === "files" || comment.ref.type === "edited-files" ? (
                                                <>
                                                    <h5>{comment.ref.msg.length > 1 ? (<>
                                                    {comment.ref.msg.length} files
                                                    </>) : (<>{comment.ref.msg.length} file</>)}</h5>
                                                </>
                                            ) : (
                                                <>
                                                {typeof comment.ref.msg !== "object" ? (
                                                    <>
                                                    <h5>{comment.ref.msg.slice(0, 30)}
                                                    {comment.ref.msg.length > 30 ? '...' : ''}</h5>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                                </>
                                            )}

                                            
                                        </div>
                                    </>
                                ) : (<></>)}
                                    

                                    {comment.type === "files" || comment.type === "edited-files" ? (
                                        <>
                                        <ShowcaseFiles files={comment} />                                        
                                        </>
                                    ) : (
                                        <>
                                        {typeof comment.msg === "object" ? (
                                            <>
                                            <ShowcaseFiles files={comment} />
                                            </>
                                            
                                        ) : (
                                            <><h4>{comment.msg}</h4></>
                                        )}
                                        </>
                                    )}

                                    <h5>
                                    {comment.type == "edited" || comment.type == "edited-files" ? "Edited, " : ""}
                                        {new Date(comment.createdAt)
                                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </h5>

                                    </div>
                                </div>
                            )
                        
                        
                    }

            })}
        </>) : (<><h5 style={{position:'relative', left:'45%', width:'135px'}}>No comments here...</h5></>)}
        </>
    )
}


export default ChatParent