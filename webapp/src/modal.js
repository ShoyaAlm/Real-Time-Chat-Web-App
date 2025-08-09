import {useState, useContext, useEffect} from 'react'
import Modal from 'react-modal'
import { chatsContext } from './chats'

const OptionsModal = ({message, modalType, setShowModal}) => {

    const {chats, setChats} = useContext(chatsContext)

    const [chosenChats, setChosenChats] = useState([])
    

    const forwardMessages = (selectedChats) => {
        
        setChats((prevChats) => {
            
            return prevChats.map((chat) => {
                if(selectedChats.includes(chat.id)){
                return {...chat, messages:[...chat.messages, {id:chat.messages.length + 1 ,from:message.from,
                     msg: message.msg, createdAt: new Date().toISOString(), type:'forwarded'}],
                     lastUpdatedAt: new Date().toISOString()}

                } else {
                    return chat
                }

            }) 
        })

        setShowModal(false)
    }

    console.log(message);
    


    switch (modalType) {
        case 'forward':
            return (
        
         <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
        
        contentLabel="Forward Modal"
        ariaHideApp={false} overlayClassName="forward-modal-overlay" className="forward-modal-content"
      >
        {message.type !== "files" && message.type !== "edited-files" ? (
            <>
            <p style={{position:'relative', left:'0', color:'#99c2fb', margin:'0'}}>{message.msg}</p>
            <h2 style={{fontSize:'20px'}}>Forward Message To...</h2>
            </>
        ) : (
            <>
            <p style={{position:'relative', left:'0', color:'#99c2fb', 
                margin:'0'}}>{message.msg.length} files</p>
            <h2 style={{fontSize:'20px'}}>Forward Files To...</h2>
            </>
        )}

        <hr/>
                <div className="user-chats-modal"
                style={{display: "flex", flexWrap: "wrap", gap: "20px",
                justifyContent: "space-between"}}>
            
            {chats.map((chat) => {

                const isChosen = chosenChats.includes(chat.id)

                return (

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
            // break;
        
        // case 'delete':

        //     break;

        // case 'pin':
            
        //     break;
        
        default:
            break;
    }

}

const AttachedFileModal = ({attachedFiles, setAttachedFiles, handleAttachFiles, chatID, fileInputRef, 
        resetFileInputKey, editingAttachedFiles, setEditingAttachedFiles, 
        selectedFileMessageID, setSelectedFileMessageID, sendStatus, setSendStatus, attachedFilesComment,
        setAttachedFilesComment}) => {

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
            
            return (prevChats.map((chat) => {
                
                if(chat.id === chatID){
                    console.log(selectedFileMessageID);
                    
                    if(editingAttachedFiles){

                        chat.messages.map((message) => {
                            
                            if(message.id == selectedFileMessageID){
                                message.msg = attachedFiles
                                message.type = "edited-files"
                                message.comment = attachedFilesComment ? attachedFilesComment : ''
                            }
                            return message
                        })
                        return {...chat, lastUpdatedAt: new Date().toISOString()}

                    } else {
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