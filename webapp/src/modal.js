import {useState, useContext, useEffect} from 'react'
import Modal from 'react-modal'
import { chatsContext } from './chats'
import ShowcaseFiles from './files'

const OptionsModal = ({message, modalType, setShowModal}) => {

    const {chats, setChats} = useContext(chatsContext)

    const [chosenChats, setChosenChats] = useState([])
    

    const forwardMessages = (selectedChats) => {
        
        setChats((prevChats) => {
            console.log(typeof message.msg);
            
            return prevChats.map((chat) => {
                if(selectedChats.includes(chat.id)){
                return {...chat, messages:[...chat.messages, {from:message.from, msg: message.msg,
                 createdAt: new Date().toISOString(), type:'forwarded'}],lastUpdatedAt: new Date().toISOString()}

                } else {
                    return chat
                }

            }) 
        })

        setShowModal(false)
    }


    switch (modalType) {
        case 'forward':
            return (
        
         <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
        
        contentLabel="Forward Modal"
        ariaHideApp={false} overlayClassName="forward-modal-overlay" className="forward-modal-content"
      >
        {message.type !== "files" ? (
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
                                fontWeight: "bold", fontSize: "20px",}}>
✔️
                                </span>
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

const AttachedFileModal = ({attachedFiles, setAttachedFiles, handleAttachFiles, chatID, fileInputRef}) => {

    const {chats, setChats} = useContext(chatsContext)




    const sendAttachedFiles = (attachedFiles) => {
        setChats((prevChats) => {
            if(fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            
            return (prevChats.map((chat) => {
                
                if(chat.id === chatID){
                    return {...chat, messages:[...chat.messages, 
                        {from:"Shoya", msg: attachedFiles, 
                            createdAt: new Date().toISOString(), type:'files'}],
                        
                            lastUpdatedAt: new Date().toISOString()}

                } else {
                    return chat
                }


            }))
        })
        setTimeout(() => {
            setAttachedFiles(null)
            if(fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            }, 200)
    }

    return (
        <Modal isOpen={true} onRequestClose={() => {
            fileInputRef.current.value = ''
            setAttachedFiles(null)}} ariaHideApp={false} overlayClassName="attached-files-overlay"
            className="attached-files-content">

        <h2 style={{position:'relative', left:'10px'}}>Attached Files</h2>
        <hr/>

        <div className="selected-files" style={{position:'relative'}}>
        
        <ShowcaseFiles files={attachedFiles}/>

        <button onClick={() => {
            fileInputRef.current.value = ''
            setAttachedFiles(null)}} style={{position:'absolute', left:'0'}}>Close</button>
        
        {attachedFiles.length <= 9 ? (
            <>
                {/* <button onClick={() => handleAttachFiles()} >Add</button> */}
                <input style={{position:'relative', left:'140px'}} onChange={handleAttachFiles} type="file"/>
            </>
        ) : (
            <></>
        )}
                <button onClick={() => sendAttachedFiles(attachedFiles)} 
                style={{position:'absolute', right:'0'}}>Send</button>
        
        </div>
        

        <hr/>

        </Modal>
    )


}


export {OptionsModal, AttachedFileModal}