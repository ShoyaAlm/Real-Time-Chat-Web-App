import {useState, useContext, useEffect} from 'react'
import Modal from 'react-modal'
import { chatsContext } from './chats'
import './css/modal.css'

const OptionsModal = ({selectedModalMsg, setSelectedModalMsg, onDeleteMessage, onDeleteComment, 
                       setupVote ,leaveChat, pinMessage, modalType, setShowModal}) => {

    const {chats, setChats} = useContext(chatsContext)

    const [chosenChats, setChosenChats] = useState([])    

    const [voteTopic, setVoteTopic] = useState('')
    const [voteOptions, setVoteOptions] = useState(['', ''])

    const alterOptions = (value, index) => {
        console.log(value, index);
        
        if(value === 'remove'){
            const filteredVoteOptions = voteOptions.filter((option) => option.id !== index)
            setVoteOptions(filteredVoteOptions)
        } else {
            setVoteOptions([...voteOptions, ''])
        }
    }

    const onVoteSubmit = () => {
        setupVote(voteTopic, voteOptions)
    }

    const handleVoteOptionChange = (index, value) => {
        const updatedOptions = [...voteOptions];
        updatedOptions[index] = value;
        setVoteOptions(updatedOptions);
    }

    const forwardMessages = (selectedChats) => {
        
        setChats((prevChats) => {
            
            return prevChats.map((chat) => {
                
                if(selectedChats.includes(chat.id)){

                    if(typeof selectedModalMsg.msg === "object" && selectedModalMsg.comment !== null){
                    
                    return {...chat, messages:[...chat.messages, {id:chat.messages.length + 1 ,
                     sentFrom:selectedModalMsg.from, from:"Shoya", msg: selectedModalMsg.msg, 
                     createdAt: new Date().toISOString(), type:'forwarded', comment: selectedModalMsg.comment}],
                     lastUpdatedAt: new Date().toISOString()}
                    } else {
                        
                        return {...chat, messages:[...chat.messages, {id:chat.messages.length + 1 ,
                                sentFrom:selectedModalMsg.from, from:"Shoya", msg: selectedModalMsg.msg,
                                createdAt: new Date().toISOString(), type:'forwarded'}],
                             lastUpdatedAt: new Date().toISOString()}
                    }

                } else {
                    return chat
                }

            }) 
        })

        setSelectedModalMsg(null)
        setShowModal(false)
    }
    
    switch (modalType) {
        case 'forward':
            return (
        
         <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
        contentLabel="Forward Modal" ariaHideApp={false}
        overlayClassName="forward-modal-overlay" className="forward-modal-content"
      >
        {selectedModalMsg.type !== "files" && selectedModalMsg.type !== "edited-files" ? (
            <>
            {typeof selectedModalMsg.msg !== "object" ? (
                <>
            <p style={{position:'relative', left:'0', color:'#9306458b', margin:'0'}}>{selectedModalMsg.msg}</p>
            <h2 style={{fontSize:'20px'}}>Forward Message To...</h2>
                </>
            ) : (
                <>
            <p style={{position:'relative', left:'0', color:'#9306458b', 
                margin:'0'}}>{selectedModalMsg.msg.length > 1 ? "1 file" : `${selectedModalMsg.msg.length}`} files</p>
            <h2 style={{fontSize:'20px'}}>Forward Files To...</h2>
                </>
            )}
            </>
        ) : (
            <>
            <p style={{position:'relative', left:'0', color:'#99c2fb', 
                margin:'0'}}>{selectedModalMsg.msg.length > 1 ? "1 file" : `${selectedModalMsg.msg.length}`} files</p>
            <h2 style={{fontSize:'20px'}}>Forward Files To...</h2>
            </>
        )}

        <hr/>
                <div className="user-chats-modal"
                style={{display: "flex", flexWrap: "wrap", gap: "20px",
                justifyContent: "flex-start", flexDirection:'row'}}>
            
            {chats.map((chat) => {

                const isChosen = chosenChats.includes(chat.id)

                return (
                    <>
                    {chat.type !== 'channel' || chat.admin === "Shoya" ? (<>
                        <div className="chat-modal" style={{width: "calc(33.33% - 13.33px)",
                        textAlign: "center"}} key={chat.id} 
                        onClick={() => {
                            if(isChosen){

                                setChosenChats(() => {
                                    const filterChosenChats = chosenChats.filter(
                                        (id) => id !== chat.id)
                                    
                                    return filterChosenChats
                                })

                            } else {
                                setChosenChats([...chosenChats, chat.id])
                            }
                            
                            }}>

                            <img src={chat.img} 
                            style={{width: "68px",height: "68px",borderRadius: "50%",
                            objectFit: "cover",marginBottom: "8px"}}/>
                            
                            <h5 style={{margin:'0'}}>{chat.name}</h5>
                            {isChosen && (
                                <div style={{position:'absolute'}}>
                                <span style={{position: "absolute",left:'30px', bottom:'25px',
                                backgroundColor: "#dff264ff", color: "white",borderRadius: "50%",width: "20px",
                                height: "20px", display: "flex", justifyContent: "center",alignItems: "center",
                                fontWeight: "bold", fontSize: "20px",}}>✔️</span>
                                </div>
                            )}
                        </div>

                    </>) : (<>

                    </>)}

                        </>
                )
            })}
            
            </div>
            <br/>
            <div className="modal-buttons" style={{position:'relative', height:'10px'}}>
        
        {chosenChats.length !== 0 && (<button onClick={() => forwardMessages(chosenChats)}
            style={{position:'absolute', right:'0'}}>Confirm</button>)}
        
        <button onClick={() => setShowModal(false)} 
            style={{position:'absolute', left:'0'}}>Close</button>
        
        
            </div>
      </Modal>       
        )
        
        case 'delete':
                return (
                    <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                            contentLabel="Delete Modal" ariaHideApp={false}
                            overlayClassName="delete-modal-overlay" className="delete-modal-content"
                        >

                        <h4 style={{marginTop:'0', textAlign:'center'}}>Do you want to delete this message?</h4>
                        
                        <div style={{position:'relative', flexDirection:'row', marginBottom:'10px'}}>
                            
                            <button style={{position:'absolute', left:'0px'}} 
                                onClick={() => setShowModal(false)}>No</button>
                            
                            <button style={{position:'absolute', right:'0px'}}
                                onClick={() => {
                                    setShowModal(false)
                                    onDeleteMessage(selectedModalMsg)
                                    }}>Yes</button>
                            
                        </div>
                        <br/>
                            
                    </Modal>
                )

        case 'pin':
            return (
                <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                            contentLabel="Pin Modal" ariaHideApp={false}
                            overlayClassName="pin-modal-overlay" className="pin-modal-content"
                        >

                        <h4 style={{marginTop:'0', textAlign:'center'}}>Would you like to pin this message?</h4>
                        
                        <div style={{position:'relative', flexDirection:'row', marginBottom:'10px'}}>
                            
                            <button style={{position:'absolute', left:'0px'}} 
                                onClick={() => setShowModal(false)}>No</button>
                            
                            <button style={{position:'absolute', right:'0px'}}
                                onClick={() => {
                                    pinMessage(selectedModalMsg)
                                    setShowModal(false)}}>Yes</button>
                            
                        </div>
                        <br/>
                            
                    </Modal>
            )


        case 'delete-comment':
                return (
                    <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                            contentLabel="Delete Modal" ariaHideApp={false}
                            overlayClassName="delete-modal-overlay" className="delete-modal-content"
                        >

                        <h4 style={{marginTop:'0', textAlign:'center'}}>Do you want to delete this comment?</h4>
                        
                        <div style={{position:'relative', flexDirection:'row', marginBottom:'10px'}}>
                            
                            <button style={{position:'absolute', left:'0px'}} 
                                onClick={() => setShowModal(false)}>No</button>
                            
                            <button style={{position:'absolute', right:'0px'}}
                                onClick={() => {
                                    setShowModal(false)
                                    onDeleteComment(selectedModalMsg)
                                    }}>Yes</button>
                            
                        </div>
                        <br/>
                            
                    </Modal>
                )

        case "leave-chat":
            return (
                    <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                            contentLabel="Delete Modal" ariaHideApp={false}
                            overlayClassName="delete-modal-overlay" className="delete-modal-content"
                        >

                        <h4 style={{marginTop:'0', textAlign:'center'}}>Do you want to leave this chat?</h4>
                        
                        <div style={{position:'relative', flexDirection:'row', marginBottom:'10px'}}>
                            
                            <button style={{position:'absolute', left:'0px'}} 
                                onClick={() => setShowModal(false)}>No</button>
                            
                            <button style={{position:'absolute', right:'0px'}}
                                onClick={() => {
                                    setShowModal(false)
                                    leaveChat(selectedModalMsg)
                                    }}>Yes</button>
                            
                        </div>
                        <br/>
                            
                    </Modal>
                )
        
        case "setup-vote":
            return (
                    <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                            contentLabel="Voting Modal" ariaHideApp={false}
                            overlayClassName="voting-modal-overlay" className="voting-modal-content"
                        >

                        <div style={{position:'relative', flexDirection:'row', marginBottom:'10px'}}>
                            
                            <div className='topic'>
                                <h4>What's the topic</h4>
                                <input type='text' placeholder='topic...' value={voteTopic}
                                    onChange={(e) => setVoteTopic(e.target.value)} required
                                />
                            </div>

                            <br />
                            <hr />

                            <div className='voting-options-wrapper'>

                                {voteOptions.map((option, index) => {
                                    return (
                                        <div className='voting-options'>
                                        <label key={index}>
                                        {index + 1}
                                        <input type='text' placeholder={`option ${index + 1}`} value={option} required
                                        onChange={(e) => handleVoteOptionChange(index, e.target.value)}
                                        style={{position:'relative', left:'10px'}}
                                        />
                                        </label>
                                        {voteOptions.length > 2 && (<>
                                            <button onClick={() => alterOptions('remove', index + 1)}
                                            style={{position:'absolute', right:'0px'}}>remove</button>
                                        </>)}
                                        </div>
                                    )
                                })}
                            
                            </div>
                            
                            <hr/>

                            <div className='voting-buttons'>
                                <button style={{position:'absolute', left:'0px'}} 
                                    onClick={() => setShowModal(false)}>cancel</button>
                                
                                <button style={{position:'absolute', right:'0px'}}
                                    onClick={() => {
                                        if(!voteOptions.includes('')){
                                            setShowModal(false)
                                            onVoteSubmit()
                                        } else {
                                            alert('options Cannot be empty')
                                        }
                                        }}>submit</button>
                            </div>

                        </div>
                        <br/>
                            
                    </Modal>
                )
            
        
        default:
            break;
    }

}

const AttachedFileModal = ({attachedFiles, setAttachedFiles, handleAttachFiles, selectedUser, fileInputRef, 
        resetFileInputKey, editingAttachedFiles, setEditingAttachedFiles, selectedFileMessageID, setSelectedFileMessageID,
        sendStatus, setSendStatus, attachedFilesComment, setAttachedFilesComment, chatHistory, setChatHistory}) => {

    const {chats, setChats} = useContext(chatsContext)

    const [avgSize, setAvgSize] = useState({width:'20%', height:'20%'})
    const [imgDimensions, setImgDimensions] = useState({})

    const [fileToReplaceIndex, setFileToReplaceIndex] = useState(null)
    

    const filenameTruncate = (filename) => {
        if(filename.length <= 20) return filename

        const extIndex = filename.lastIndexOf('.')
        if(!extIndex) return filename.slice(0, 18) + '...'

        const name = filename.slice(0, extIndex);
        const ext = filename.slice(extIndex);

        const charsToShow = 20 - ext.length - 3;
        const frontChars = Math.ceil(charsToShow / 2);
        const backChars = Math.floor(charsToShow / 2);

        return (
            name.slice(0, frontChars) + '...' + name.slice(name.length - backChars) + ext
        )
    }

    const fileSize = (bytes) => {
        if(bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        const size = bytes / Math.pow(k, i)
        return `${size.toFixed(1)} ${sizes[i]}`
    }

    useEffect(() => {
        let loaded = 0;
        const newDims = {}

        attachedFiles.forEach((file, index) => {
            if(file.type.startsWith('image/')){
                const img = new Image();
                img.src = URL.createObjectURL(file)
                img.onload = () => {
                    newDims[index] = {
                        width: img.width * 0.1,
                        height: img.height * 0.1
                    }
                    loaded ++;


                    if(loaded === attachedFiles.filter(f => f.type.startsWith('image/').length)){
                        setImgDimensions(newDims);

                        const allDims = Object.values(newDims)
                        const avgW = allDims.reduce((sum, d) => sum + d.width, 0) / allDims.length;
                        const avgH = allDims.reduce((sum, d) => sum + d.height, 0) / allDims.length;

                        setAvgSize({ width: avgW, height: avgH });
                    }
                }
            }
        })
    }, [attachedFiles])




    const sendAttachedFiles = (attachedFiles) => {
        
        setChats((prevChats) => {

            
            if(!chatHistory) {

            setChatHistory(true) 
            return [...prevChats, {id:prevChats.length + 1, name: selectedUser.name, type: "chat", 
                messages:[{id:1, from:"Shoya", msg: attachedFiles, createdAt: new Date().toISOString(),
                    type: 'files', comment: attachedFilesComment ? attachedFilesComment : ''}],
                    img: selectedUser.img, lastUpdatedAt: new Date().toISOString()}]
        
            }
            
            return (prevChats.map((chat) => {
                
                if(chat.id === selectedUser.id){
                    
                    
                    if(editingAttachedFiles){

                        chat.messages.map((message) => {
                            
                            if(message.id == selectedFileMessageID){
                                message.msg = attachedFiles
                                message.type = "edited-files"
                                message.comment = attachedFilesComment ? attachedFilesComment : ''
                            }
                            return message
                        })
                        setAttachedFilesComment('')
                        return {...chat, lastUpdatedAt: new Date().toISOString()}

                    } else {
                        setAttachedFilesComment('')
                        return {...chat, messages:[...chat.messages, 
                            {id:chat.messages.length + 1 ,from:"Shoya", msg: attachedFiles, 
                                createdAt: new Date().toISOString(), type: 'files',
                            comment: attachedFilesComment ? attachedFilesComment : ''
                        }],
                                lastUpdatedAt: new Date().toISOString()}
                    }

                } else {
                    return chat
                }


            }))
        })


        
        setTimeout(() => {
            if(sendStatus === 'edit'){
                setSendStatus('send')
            }
            if(editingAttachedFiles){
                setEditingAttachedFiles(false)
            }
            if(fileInputRef.current) {
                resetFileInputKey()
            }
            if(selectedFileMessageID !== 0){
                setSelectedFileMessageID(0)
            }
            setAttachedFiles(null)}, 20)
    }

    return (
        <Modal isOpen={true} onRequestClose={() => {
            fileInputRef.current.value = null
            resetFileInputKey()
            setAttachedFiles(null)}} ariaHideApp={false} overlayClassName="attached-files-overlay"
            className="attached-files-content">

        <h2 style={{position:'relative', left:'10px'}}>Attached Files</h2>
        <hr/>

        <div className="selected-files" style={{position:'relative'}}>
        

        {attachedFiles.map((file, index) => {
            if(file.type.startsWith('image/')){
                return (
                    <div key={index} style={{ display:'flex', alignItems:'center', marginBottom:'10px',
                    maxWidth:'360px'}}>
                        <img src={URL.createObjectURL(file)} alt={file.name}
                        style={{position:'relative', width: avgSize.width, height: avgSize.height, 
                        borderRadius:'4%', left:'10px'}} />
                        <div style={{display:'flex', flexDirection:'column', marginLeft:'20px', 
                        height:'100%'}}>
                            <h4 style={{position:'relative'}}>{filenameTruncate(file.name)}</h4>
                            <h5 style={{position:'relative', textAlign:'left'}}>{fileSize(file.size)}</h5>
                        </div>
                        
                        <div style={{position:'absolute', display:'flex', flexDirection:'column', 
                                    marginLeft:'20px', right:'10px', gap:'50px'}}>
                            <button onClick={() => {
                                setAttachedFiles(prevFiles => 
                                    prevFiles.filter((prevFile) => prevFile.name !== file.name))
                            }}>trash</button>
                            <button onClick={() => {
                                setFileToReplaceIndex(index)
                                fileInputRef.current.click()
                            }}>replace</button>
                        </div>
                    </div>
                )
            } else if(file.type.startsWith('video/')){
                return (
                <div key={index}>
                    <video src={URL.createObjectURL(file)} width="180" height="160" controls
                    style={{borderRadius: '0', position:'relative', left:'10px'}}/>
                    <h5>{file.name}</h5>
                </div>
                )
            } else if(file.type.startsWith('application/pdf')){
                return (
                    <div key={index}>
                        <img
                        src="webapp/src/img/pdf-icon.png"
                        alt="PDF"
                        style={{ width: '80px', height: '70px' }}
                        />
                        <h5>{file.name}</h5>
                    </div>
                    );
            }
        })}
        </div>

        <input type='text' style={{position:'relative', width:'90%', marginBottom:'10px', left:'10px'}}
            placeholder='Comment...' value={attachedFilesComment}
            onChange={(e) => setAttachedFilesComment(e.target.value)}
        />

            <div style={{position:'relative'}}>
            
            <button onClick={() => {
                fileInputRef.current.value = null
                resetFileInputKey()
                setAttachedFiles(null)}} style={{position:'relative', left:'10px'}}>Close</button>
            
            {attachedFiles.length <= 9 ? (
                <>
                    <input style={{position:'relative', left:'25%'}} ref={fileInputRef}
                    onChange={(e) => handleAttachFiles(e, fileToReplaceIndex)} type="file"/>
                </>
            ) : (
                <></>
            )}
                    <button onClick={() => sendAttachedFiles(attachedFiles)} 
                    style={{position:'absolute', right:'10px'}}>Send</button>
                </div>
        
        

        <hr/>

        </Modal>
    )


}


export {OptionsModal, AttachedFileModal}