import {useState, useContext, useEffect} from 'react'
import Modal from 'react-modal'
import { chatsContext } from './chats'
import './css/modal.css'

const OptionsModal = ({selectedModalMsg, setSelectedModalMsg, selectedChatsId, setSelectedChatsId, sendingMessage,
     onDeleteMessage, onDeleteComment, voteTopic, setVoteTopic, setVoteOptions, voteOptions,  editVote, 
     editMessage ,leaveChat, pinMessage, modalType, setShowModal, showcaseNavbar, setShowcaseNavbar}) => {

    const {chats, setChats} = useContext(chatsContext)

    // const [voteTopic, setVoteTopic] = useState(selectedModalMsg?.topic || '')
    // const [voteOptions, setVoteOptions] = useState( selectedModalMsg?.options || ['', ''])

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
        sendingMessage('setup-vote')
    }

    const onVoteEdit = (id) => {
        editVote(voteTopic, voteOptions, id)
    }
    

    const handleVoteOptionChange = (index, value) => {
        const updatedOptions = [...voteOptions];
        updatedOptions[index] = value;
        setVoteOptions(updatedOptions);
    }


    const baseURL = 'http://localhost:8080/api/v1'
    const token = localStorage.getItem('token')
    const createGroup = async (groupName, bio) => {
        setShowModal(false)

        try {
            const response = await fetch(`${baseURL}/chats/group`,{
                method: 'POST',
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name:groupName,
                    bio: bio
                })
            })

            const groupData = await response.json()
            
            if(showcaseNavbar) setShowcaseNavbar(false)
            
            if(!response.ok){
                throw new Error('Error occurred while making group')
            }
            console.log('Group has been made: ', groupData);
            
        } catch (error) {
            console.log(error);
        }

    }

    const createChannel = (channelName, bio) => {
        setShowModal(false)
        setChats([...chats,{id: chats.length + 1, name: channelName, type:'channel',
        messages:[],
        users:[{id:1, name:"Shoya", type:'admin', 
            img:'https://thumbs.dreamstime.com/b/professional-business-man-center-tablet-computer-148434325.jpg'},
        ],
        admins:["Shoya"],
        pinnedMessages:[], bio:bio,
            img: 'https://wallpapers.com/images/hd/aesthetic-computer-4k-c9qdhe02pr84wh3a.jpg',
            lastUpdatedAt: new Date().toISOString()

    }])
    if(showcaseNavbar) setShowcaseNavbar(false)
    }
    

    const [name, setName] = useState("Shoya")
    const [username, setUsername] = useState("@shoya_alm")
    const [bio, setBio] = useState("this is my cool little bio")
    
    const [groupOrChannelName, setGroupOrChannelName] = useState('')
    const [groupOrChannelAbout, setGroupOrChannelAbout] = useState('')
    const [channelLink, setChannelLink] = useState('')
    
    switch (modalType) {
        case 'forward':
            return (
        
         <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
        contentLabel="Forward Modal" ariaHideApp={false}
        overlayClassName="forward-modal-overlay" className="forward-modal-content">

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

                const isChosen = selectedChatsId.includes(chat._id)
                
                return (
                    <>
                    {chat.type !== 'channel' || chat.admin === "Shoya" ? (<>
                        <div className="chat-modal" style={{width: "calc(33.33% - 13.33px)",
                        textAlign: "center"}} key={chat.id} 
                        onClick={() => {
                            if(isChosen){

                            setSelectedChatsId(prevSelectedChatsId => prevSelectedChatsId.filter(id => id !== chat._id))

                            } else {
                                setSelectedChatsId(prevSelectedChatsId => [...prevSelectedChatsId, chat._id])
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
        
        {selectedChatsId.length !== 0 && (<button onClick={() => {
            setShowModal(false)
            sendingMessage('forward')
            }}
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
                                    onDeleteMessage(selectedModalMsg._id)
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
                                    sendingMessage('pin')
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
        
        case "edit-vote":
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
                                
                                <button onClick={() => setVoteOptions([...voteOptions, ''])}>add option</button>
                            
                            </div>
                            
                            <hr/>

                            <div className='voting-buttons'>
                                <button style={{position:'absolute', left:'0px'}} 
                                    onClick={() => setShowModal(false)}>cancel</button>
                                
                                <button style={{position:'absolute', right:'0px'}}
                                    onClick={() => {
                                        if(!voteOptions.includes('')){
                                            setShowModal(false)
                                            onVoteEdit(selectedModalMsg.id)
                                        } else {
                                            alert('options Cannot be empty')
                                        }
                                        }}>edit</button>
                            </div>

                        </div>
                        <br/>
                            
                    </Modal>
            )

        case "edit-profile":
            // user's info will be received by the token in the browser's local storage
            return (
            <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                    contentLabel="Edit Profile Modal" ariaHideApp={false} 
                    overlayClassName="edit-profile-modal-overlay" className="edit-profile-modal-content">

                    <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>

                    <h3 style={{textAlign:'center'}}>You are</h3>

                    <img src='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        style={{  width: '150px',height: '150px',borderRadius: '50%',objectFit: 'cover',flexShrink: 0}}
                    /> 
                    {/* add a button, which represents a camera emoji, and when clicked, we choose a new image */}

                        {/* for this part, i'll be adding a backend 'patch' functionality for updating user info */}
                        <div style={{gap:'30px', height:'100px', display:'flex', 
                                    flexDirection:'column', marginTop:'20px'}}>
                            <input value={name} onChange={(e) => setName(e.target.value)} />
                            <input value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div> 
                    </div>

                    <div style={{marginTop:'40px', display:'flex', flexDirection:'row'}}>
                    <button onClick={() => setShowModal(false)}>close</button>
                    <button style={{position:'absolute', right:'15px'}}>save</button>
                    </div>
                </Modal>

            )

        case "create-group":
            return (

                <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                    contentLabel="Create Group Modal" ariaHideApp={false} overlayClassName="create-group-modal-overlay"
                    className="create-group-modal-content">

                    <div style={{position:'relative', alignItems:'center', display:'flex', flexDirection:'column'}}>
                        <h4>Let's make a new group!</h4>

                        <span>Upload an image</span>
                        <img src='https://wallpapers.com/images/hd/aesthetic-computer-4k-c9qdhe02pr84wh3a.jpg' 
                        alt='group pic' style={{width: '150px', height: '150px', borderRadius: '50%',marginRight: '10px',
                        objectFit: 'cover', display: 'block'}}/>

                        <div style={{display:'flex', flexDirection:'column', marginTop:'40px'}}>
                           
                           <label>group name<input placeholder='group name...' value={groupOrChannelName}
                            onChange={(e) => setGroupOrChannelName(e.target.value)}/></label>

                           <label>about<input placeholder='about...' value={groupOrChannelAbout}
                            onChange={(e) => setGroupOrChannelAbout(e.target.value)}/></label>
                           
                        </div>
                        
                        <div style={{marginTop:'40px', display:'flex', flexDirection:'row', width:'100%'}}>
                            <button onClick={() => setShowModal(false)}>close</button>
                            
                            <button disabled={!groupOrChannelName || !groupOrChannelAbout}
                            style={{position:'absolute', right:'10px',
                            backgroundColor: (!groupOrChannelName || !groupOrChannelAbout) ? 'grey' : 'initial',
                            cursor: (!groupOrChannelName || !groupOrChannelAbout) ? 'not-allowed' : 'pointer',
                            }} onClick={() => createGroup(groupOrChannelName, groupOrChannelAbout)}>create</button> 
                        </div>
                    </div>
                </Modal>
            )
        
        case "group-invite-link":
            return (

                <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                    contentLabel="Group Invite Link Modal" ariaHideApp={false} 
                    overlayClassName="group-invite-link-modal-overlay" className="group-invite-link-modal-content">

                
                </Modal>

            )

        
        case "create-channel":
            return (

                <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
                    contentLabel="Create Channel Modal" ariaHideApp={false} overlayClassName="create-channel-modal-overlay"
                    className="create-channel-modal-content">

                    <div style={{position:'relative', alignItems:'center', display:'flex', flexDirection:'column'}}>
                        <h4>Let's make a new channel!</h4>

                        <span>Upload an image</span>
                        <img src='https://wallpapers.com/images/hd/aesthetic-computer-4k-c9qdhe02pr84wh3a.jpg' 
                        alt='group pic' style={{width: '150px', height: '150px', borderRadius: '50%',marginRight: '10px',
                        objectFit: 'cover', display: 'block'}}/>

                        <div style={{display:'flex', flexDirection:'column', marginTop:'40px'}}>
                           
                           <label>channel name<input placeholder='channel name...' value={groupOrChannelName}
                            onChange={(e) => setGroupOrChannelName(e.target.value)}/></label>

                           <label>channel name: @<input placeholder='channel link...' value={channelLink}
                            onChange={(e) => setChannelLink(e.target.value)}/></label>

                           <label>about<input placeholder='about...' value={groupOrChannelAbout}
                            onChange={(e) => setGroupOrChannelAbout(e.target.value)}/></label>
                           
                        </div>
                        
                        <div style={{marginTop:'40px', display:'flex', flexDirection:'row', width:'100%'}}>
                            <button onClick={() => setShowModal(false)}>close</button>
                            
                            <button disabled={!groupOrChannelName || !groupOrChannelAbout}
                            style={{position:'absolute', right:'10px', backgroundColor: 
                            (!groupOrChannelName || !channelLink || !groupOrChannelAbout) ? 'grey' : 'initial',
                            cursor: (!groupOrChannelName || !channelLink || !groupOrChannelAbout) 
                            ? 'not-allowed' : 'pointer',
                            }} onClick={() => createChannel(groupOrChannelName, groupOrChannelAbout)}>create</button> 
                        </div>
                    </div>
                
                </Modal>

            )


        
        default:
            break;
    }

}

const AttachedFileModal = ({attachedFiles, setAttachedFiles, handleAttachFiles, selectedUser, fileInputRef, 
        resetFileInputKey, editingAttachedFiles, setEditingAttachedFiles, selectedFileMessageID, setSelectedFileMessageID,
        sendStatus, setSendStatus, attachedFilesComment, setAttachedFilesComment, chatHistory, setChatHistory,
        sendingMessage, setShowModal }) => {

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
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px',
                    position: 'relative', paddingLeft: '10px'}}>
                        <img src="/img/pdf-icon.png" alt="PDF" style={{ width: '100px', height: '90px' }}
                        />
                        <h4 style={{position:'relative'}}>{filenameTruncate(file.name)}</h4>
                        <hr/>
                        <h5 style={{position:'relative', textAlign:'left'}}>{fileSize(file.size)}</h5>                    
                        
                        </div>
                    
                    );
            } else if(file.type.startsWith('text/plain')){
                return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px',
                    position: 'relative',paddingLeft: '10px'}}>
                    <img src="/img/text-file.webp" alt="Text file"
                    style={{width: '90px', height: '90px', marginRight: '15px'}}/>
                    <h4 style={{position:'relative'}}>{filenameTruncate(file.name)}</h4>
                    <hr/>
                    <h5 style={{position:'relative', textAlign:'left'}}>{fileSize(file.size)}</h5>
                    </div>
                )
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
                setAttachedFilesComment('')
                setAttachedFiles(null)}} style={{position:'relative', left:'10px'}}>Close</button>
            
            {attachedFiles.length <= 9 ? (
                <>
                    <input style={{display:'none'}} ref={fileInputRef}
                    onChange={(e) => handleAttachFiles(e, fileToReplaceIndex)} type="file"/>

                    <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        style={{position:'relative', left:'32%'}}
                    >add</button>
                </>
            ) : (
                <></>
            )}
                    <button onClick={() => {
                        setShowModal(false)
                        sendingMessage('send-files')
                    }
                    } 
                    style={{position:'absolute', right:'10px'}}>Send</button>
                </div>
        
        

        <hr/>

        </Modal>
    )


}


export {OptionsModal, AttachedFileModal}