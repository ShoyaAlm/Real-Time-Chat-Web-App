
import { people } from "./people"
import { allChats } from "./data"
import './css/chat.css'
import { useEffect, useState, useContext, useRef } from "react"
import { chatsContext, showChatContext, pinnedMessagesContext, postCommentsContext, searchTermsContext,
        modalContext, } from "./chats"

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
    
    useEffect(() => {   
        setChatHistory(chats.find((chat) => chat.name === name) ? true : false)

        if(showPinnedMessages) setShowPinnedMessages(false)
        if(!canShowOtherChat) {
            setCanShowOtherChat(true)
        } else setShowPostComments(false)

        if(inputValue) setInputValue('')

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

    const setupVote = (voteTopic, voteOptions) => {
        const newMessages = [...user.messages, {
                id:user.messages.length + 1, from:"Shoya", topic:voteTopic, options:voteOptions, 
                allVotes:[] ,createdAt: new Date().toISOString(), type:'vote'
            }]
        updatedMessages(newMessages)
    }

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
                        
                        <div onClick={() => user.type === "chat" 
                        ? setShowUserInfo(true) : (user.type === 'group' 
                        ? setShowGroupInfo(true) : setShowChannelInfo(true))} style={{position:'relative', 
                        display:'flex', width:'90%'}}>

                            <img alt="" src={user.img}/>
                            <div className="user">
                                <h2>{user.name}</h2>
                                {user.type === 'group' ? (<><h5>{user.users.length} members</h5></>)
                                    : (<>
                                    {user.type === 'channel' ? (<>{user.users.length} subscribers</>)
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
                                        {(user.type === 'channel' || user.type === 'group') && (
                                            <><h5 onClick={() => openModal('setup-vote', user)}>Setup Vote</h5></>
                                        )}
                                        {chatHistory && (<><h5 style={{color:'#ae1212ff'}}
                                        onClick={() => openModal('leave-chat', user)} //deleting the chat from our list
                                        >Leave</h5></>)}
                        
                        
                                        {showModal && <OptionsModal 
                                        {...(modalType === 'setup-vote' ? { setupVote, selectedModalMsg } : {})}
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
                            <h5 style={{marginBottom:'0px', marginTop:'10px', color:'#ffffffff'}}>
                            Pinned Message #{currentLine === 0 ? `${user.pinnedMessages.length}` 
                            : `${user.pinnedMessages.length - currentLine + 1}`}</h5>
                                
                                <h5 style={{marginTop:'10px', color:'#ffffffff'}}>
                                    {currentLine === 0 ? `${user.pinnedMessages[user.pinnedMessages.length - 1].phrase}`
                                    : `${user.pinnedMessages[user.pinnedMessages.length - currentLine].phrase}`}
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


                        
                            {<ShowMessages chat={user} setChats={setChats} onDeleteMessage={ theMessage => {
                                const filteredMessages = user.messages.filter((message) => message.id !== theMessage.id)
                                updatedMessages(filteredMessages)
                            }}
                                setMessageToEdit={setMessageToEdit} setMessageToReply={setMessageToReply}
                                inputValue={inputValue} setInputValue={setInputValue} setSendStatus={setSendStatus} 
                                setAttachedFiles={setAttachedFiles} setEditingAttachedFiles={setEditingAttachedFiles}
                                setSelectedFileMessageID={setSelectedFileMessageID}
                                setAttachedFilesComment={setAttachedFilesComment} highlightMsgId={highlightMsgId}
                                highlightMessage={highlightMessage} selectedPost={selectedPost} 
                                setSelectedPost={setSelectedPost} updatedMessages={updatedMessages} openModal={openModal}
                                showModal={showModal} setShowModal={setShowModal} modalType={modalType} 
                                setModalType={setModalType} selectedModalMsg={selectedModalMsg} 
                                setSelectedModalMsg={setSelectedModalMsg} leaveChat={leaveChat} setupVote={setupVote}
                                editVote={editVote}
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

                        {!showPinnedMessages && ((user.type !== 'channel' || showPostComments === true) ||
                        (user.type === 'channel' && user.admins.includes("Shoya"))) && (<>
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
                                    
                                    if(user.type !== 'channel'){
                                        
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
                                    } else if(user.type === 'channel'){
                                        
                                        // posting a comment within a channel
                                        if(showPostComments){

                                            // then we add a comment to the selected post
                                            selectedPost.msgComments = [...selectedPost.msgComments, 
                                            { id: selectedPost.msgComments.length + 1, from: "Shoya", msg:inputValue,
                                                createdAt: new Date().toISOString(), type:"normal"
                                            }]

                                            const newMessages = [...user.messages]
                                            setCanShowOtherChat(false)
                                            updatedMessages(newMessages)

                                        } else {
                                            // We are an admin of the channel and sharing a post
                                            const newMessages = [...user.messages, 
                                            {id: user.messages.length + 1, msg: inputValue, 
                                            createdAt: new Date().toISOString(), type:"normal", from:"Shoya", 
                                            msgComments:[]}]

                                            updatedMessages(newMessages)
                                        }
                                    }
                                
                                } else if(inputValue !== '' && sendStatus === 'edit') {
                                    
                                    if(user.type !== 'channel'){
                                        
                                    const selectedMessage = user.messages.find(
                                    (message) => message.id === messageToEdit.id)
                                    
                                    selectedMessage.msg = inputValue
                                    selectedMessage.type = 'edited'
                                    
                                    setChats( prevChats => prevChats.map((chat) => chat.name === name 
                                    ? {...chat, messages: chat.messages} : chat))

                                    setInputValue('')
                                    setSendStatus('send')

                                    }
                                    else if (user.type === 'channel'){ // while editing a post in a channel
                                        
                                        if(!showPostComments){
                                        const selectedMessage = user.messages.find(
                                        (message) => message.id === messageToEdit.id)
                                        
                                        selectedMessage.msg = inputValue
                                        selectedMessage.type = 'edited'
                                        
                                        setChats( prevChats => prevChats.map((chat) => chat.name === name 
                                        ? {...chat, messages: chat.messages} : chat))

                                        setInputValue('')
                                        setSendStatus('send')

                                        } else { // while editing a comment on a post 
                                            const selectedComment = selectedPost.msgComments.find(
                                                (comment) =>  comment.id === messageToEdit.id )
                                            
                                            selectedComment.msg = inputValue
                                            selectedComment.type = 'edited'

                                            setInputValue('')
                                            setSendStatus('send')
                                        
                                        }

                                    }

                                    }
                                    
                                else if(inputValue !== '' && sendStatus === 'reply'){

                                    if(user.type !== 'channel'){
                                        const selectedMessage = user.messages.find(
                                            (message) => message.id === messageToReply.id)
                                        
                                        const newMessages = [...user.messages,
                                        {id:user.messages.length + 1 ,from:"Shoya", msg: inputValue,
                                        createdAt: new Date().toISOString(), type:"reply", ref:selectedMessage}]
                                        
                                        setInputValue('')
                                        setSendStatus('send')
                                        updatedMessages(newMessages)
                                    } else {

                                        if(!showPostComments){ // replying on channel posts
                                            const selectedMessage = user.messages.find(
                                            (message) => message.id === messageToReply.id)
                                        
                                            const newMessages = [...user.messages,
                                            {id:user.messages.length + 1 , msg: inputValue,
                                            createdAt: new Date().toISOString(), type:"reply", from:"Shoya", 
                                            msgComments:[], ref:selectedMessage
                                            }]
                                            
                                            setInputValue('')
                                            setSendStatus('send')
                                            updatedMessages(newMessages)

                                        } else { // replying on a post's comment
                                            const selectedComment = selectedPost.msgComments.find(
                                                (comment) => comment.id === messageToReply.id
                                            )
                                            selectedPost.msgComments = [...selectedPost.msgComments, {
                                                id:selectedPost.msgComments.length + 1, from:"Shoya", msg:inputValue,
                                                createdAt: new Date().toISOString(), type:'reply', ref:selectedComment
                                            }]

                                            setInputValue('')
                                            setSendStatus('send')

                                        }


                                    }
                                    
                                }
                                
                                }}
                            >Send</button>
                        </div>
                        </>)}

                        {user.type === 'channel' && !showPostComments && !user.admins.includes("Shoya") && (<>
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
    setupVote, editVote}) => {
    
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
                if(theMessage.type === 'vote'  || theMessage.topic !== undefined){
                    openModal('edit-vote', theMessage)
                } else {
                    setInputValue(theMessage.msg)
                    setMessageToEdit(theMessage)
                }
            }
        setSendStatus('edit')
    }

    const pinMessage = (theMessage) => {

        setChats(prevChats => prevChats.map((selectedChat) => {
            
            if(selectedChat.id === chat.id){
                if(theMessage.type === 'vote' || theMessage.topic !== undefined) {
                return {...selectedChat, pinnedMessages:[...selectedChat.pinnedMessages,
                    {id: chat.pinnedMessages.length + 1, messageID: theMessage.id, from: theMessage.from,
                    phrase: theMessage.topic, topic: theMessage.topic, options: theMessage.options, 
                    allVotes: theMessage.allVotes, createdAt: theMessage.createdAt, type: theMessage.type}]}    
                } else {
                    return {...selectedChat, pinnedMessages:[...selectedChat.pinnedMessages,
                        {id: chat.pinnedMessages.length + 1, messageID: theMessage.id, from: theMessage.from,
                        phrase: theMessage.msg, createdAt: theMessage.createdAt, type: theMessage.type}]}
                }
            } else {
                return selectedChat
            }
        
        }))
    }

    const [optionsIndex, setOptionsIndex] = useState(null)

    const [messageToForward, setMessageToForward] = useState(null)
    

    const {showPinnedMessages} = useContext(pinnedMessagesContext)
    const {showPostComments, setShowPostComments} = useContext(postCommentsContext)

    const [selectedOptions, setSelectedOptions] = useState({})
    const [showVoteOptions, setShowVoteOptions] = useState({})

    const voteCounts = (message) => {

        return message.options.map((_, index) => 
            
            {
                const optionNumber = index + 1
                return message.allVotes.filter(vote => Object.values(vote)[0] === optionNumber).length
            })
    }

    const votePercentage = (num, message) => {        
        const totalVotes = message.allVotes.length 
        return ((num/totalVotes) * 100).toFixed(1)
    }

    return (
    <>



        {messages && !showPinnedMessages && !showPostComments ?
        
        (
            messages.map((message, index) => {

                if(message.from !== "Shoya"){
                    
                    return (
                        <div className={`message-wrapper left ${highlightMsgId == `${index}` ? 'highlight' : ''} `} 
                        key={index} id={`msg-${index}`}>

                        
                            {chat.type === 'group' ? (<>

                                {chat.users.map((user, index) => {
                                    if(user.name == message.from){

                                        return (<div key={index}> <img src={user.img} 
                                    style={{width:'36px', height:'36px', borderRadius:'50%', marginRight:'5px',
                                        position:'relative', left:'0', objectFit: 'cover',flexShrink: '0'}}/>
                                        </div>)
                                    }
                                })} </>) : (<></>)}
                            
                            <div className="messages-received">
                            {message.ref ? (
                                <>
                                    <div className="reply-preview" onClick={() => highlightMessage(message.ref.id)}>
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
                                                {message.ref.type === 'vote' ? (<>
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

                                {chat.type === 'group' ? (
                                    <><h5 style={{position:'relative', textAlign:'left'}}>{message.from}</h5></>
                                ) : (<></>)}
                                    
                                {(message.type === 'vote'  || message.topic !== undefined) && (<>
                                    <h3 style={{marginTop:'5px'}}>{message.topic}</h3>
                                    {message.options.map((option, index) => {
                                    
                                    const optionChecked = selectedOptions[message.id] === index + 1
                                    const selectedOption = selectedOptions[message.id] || false 

                                    if(message.allVotes.some(vote => Object.keys(vote).includes("Shoya"))){
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
                                </>)}


                                {typeof message.msg === 'string' && (<>
                                    <h4 style={{marginTop:'4px'}}>
                                        {message.msg}
                                    </h4>
                                </>)}

                                <div style={{display:'flex', justifyContent:'flex-end' ,textAlign:'right'}}>

                                {chat.type === 'channel' && (<><h5 style={{bottom:'6px', right:'68px'}}>
                                {message.from}, </h5></>)}
                                <h5> {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                                </div>

                                    {chat.type === 'channel' && (
                                    <div style={{position:'relative', textAlign:'left', top:'-3px'}} 
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
                                selectedModalMsg, setSelectedModalMsg} : {})}
                                {...(modalType === "pin" ? {pinMessage, selectedModalMsg} : {})}
                                {...(modalType === 'setup-vote' ? { setupVote, selectedModalMsg } : {})}
                                {...(modalType === "leave-chat" ? { leaveChat, selectedModalMsg } : {})}

                                
                              modalType={modalType} setShowModal={setShowModal}/>}
                        
                        
                        </div>
                            

                        </div>

                        </div>
                    )

                } else if(message.from === "Shoya") {
                    
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
                            
                            {showModal && <OptionsModal 
                            {...(modalType === 'forward' ? { selectedModalMsg, setSelectedModalMsg } : {})}
                                {...(modalType === "delete" ? {onDeleteMessage, selectedModalMsg} : {})}
                                {...(modalType === "pin" ? {pinMessage, selectedModalMsg} : {})}
                                {...(modalType === 'setup-vote' ? { setupVote, selectedModalMsg } : {})}
                                {...(modalType === 'edit-vote' ? { editVote, selectedModalMsg } : {})}
                                {...(modalType === "leave-chat" ? { leaveChat, selectedModalMsg } : {})}

                              modalType={modalType} setShowModal={setShowModal}/>}

                            <h5 onClick={() => editMessage(message) }>Edit</h5>
                            <h5 onClick={() => {
                                openModal('delete', message)
                                setShowThreeOptions(false)}}>Delete</h5>
                        
                        
                        </div>
                            

                        </div>
                        
                        <div className="messages-sent">
                            {message.ref ? (
                                <>
                                    <div className="reply-preview" onClick={() => highlightMessage(message.ref.id)}>
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
                                                {message.ref.type === 'vote' ? (<>
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

                            {message.type === 'forwarded' ? (
                                <>
                                <div className="forward-preview">
                                    <h5>from: {message.sentFrom}</h5>
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
                                        <></>
                                    )}
                                    </>
                                )}
                                
                                {(message.type === 'vote' || message.topic !== undefined) && (<>
                                    <h3 style={{marginTop:'5px'}}>{message.topic}</h3>
                                    {message.options.map((option, index) => {
                                    
                                    const optionChecked = selectedOptions[message.id] === index + 1
                                    const selectedOption = selectedOptions[message.id] || false 

                                    if(message.allVotes.some(vote => Object.keys(vote).includes("Shoya"))){
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
                                </>)}



                                {typeof message.msg === 'string' && (<>
                                    <h4 style={{marginTop:'4px'}}>
                                        {message.msg}
                                    </h4>
                                </>)}

                                <div style={{display:'flex', justifyContent:'flex-end'}}>

                                {chat.type === 'channel' && (<><h5 style={{bottom:'6px', right:'68px'}}>
                                {message.from}, </h5></>)}
                                {message.type === 'edited' && (<><h5>edited, </h5></>)}
                                <h5> {new Date(message.createdAt)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                                </div>

                                    {chat.type === 'channel' && (
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

                            {message.type === 'forwarded' ? (
                                <>
                                <div className="forward-preview">
                                    <h5>from: {message.sentFrom}</h5>
                                </div>
                                </>) : (<></>)}

                                {message.type === "files" || message.type === "edited-files" ? (
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

                                    if(message.allVotes.some(vote => Object.keys(vote).includes("Shoya"))){
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
                                {message.type == "edited" || message.type == "edited-files" ? "Edited, " : ""}
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

                            {message.type === 'forwarded' ? (
                                <>
                                <div className="forward-preview">
                                    <h5>from: {message.sentFrom}</h5>
                                </div>
                                </>) : (<></>)}

                                {message.type === "files" || message.type === "edited-files" ? (
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

                                    if(message.allVotes.some(vote => Object.keys(vote).includes("Shoya"))){
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
                                {message.type == "edited" || message.type == "edited-files" ? "Edited, " : ""}
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