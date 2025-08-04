import {useState, useContext, useEffect} from 'react'
import Modal from 'react-modal'
import { chatsContext } from './chats'

const OptionsModal = ({message, modalType, setShowModal}) => {

    const {chats, setChats} = useContext(chatsContext)

    const [chosenChats, setChosenChats] = useState([])
    

    const forwardMessages = (chosedChats) => {
        
        setChats((prevChats) => {
            
            return prevChats.map((chat) => {
                if(chosedChats.includes(chat.id)){
                
                return {...chat, messages:[...chat.messages, {from:message.from, msg: message.msg,
                 createdAt: new Date().toISOString(), type:'forwarded'}],lastUpdatedAt: new Date().toISOString()}

                } else {
                    return chat
                }

            }) 
        })

        setShowModal(false)
    }



    if(modalType == 'forward'){
        return (
        
         <Modal isOpen={true} onRequestClose={() => setShowModal(false)}
        
        contentLabel="Forward Modal"
        ariaHideApp={false} overlayClassName="forward-modal-overlay" className="forward-modal-content"
      >
        <p style={{position:'relative', left:'0', color:'#99c2fb', margin:'0'}}>{message.msg}</p>
        <h2 style={{fontSize:'20px'}}>Forward Message To...</h2>

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
                            if(chosenChats.includes(chat.id)){

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
    }

    // if(modalType === 'delete'){

    // }

    // if(modalType === 'forward'){

    // }
}

const AttachedFileModal = ({attachedFiles, setAttachedFiles, handleAttachFiles}) => {


    const [avgSize, setAvgSize] = useState({width:'16%', height:'16%'})
    const [imgDimensions, setImgDimensions] = useState({})

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

    return (
        <Modal isOpen={true} onRequestClose={() => setAttachedFiles(null)}
        ariaHideApp={false} overlayClassName="attached-files-overlay" className="attached-files-content"
        >

        <h2 style={{position:'relative', left:'10px'}}>Attached Files</h2>
        <hr/>

        <div className="selected-files" style={{position:'relative'}}>
        {attachedFiles.map((file, index) => {
                console.log(file)
            if(file.type.startsWith('image/')){
                return (
                    <div key={index} style={{ display:'flex', alignItems:'center', marginBottom:'10px'}}>
                        <img src={URL.createObjectURL(file)} alt={file.name}
                        style={{position:'relative', width: avgSize.width, height: avgSize.height, 
                        borderRadius:'4%', left:'10px'}} />
                        <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
                            <h4 style={{position:'relative'}}>{filenameTruncate(file.name)}</h4>
                            <h3 style={{position:'relative'}}>{fileSize(file.size)}</h3>
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

        <button onClick={() => console.log('sending')} style={{position:'absolute', right:'0'}}>Send</button>
        {/* <button onClick={() => handleAttachFiles()} >Add</button> */}
        <input style={{position:'relative', left:'140px'}} onChange={handleAttachFiles} type="file"/>
        <button onClick={() => setAttachedFiles(null)} 
            style={{position:'absolute', left:'0'}}>Close</button>
        
        </div>
        

        <hr/>

        </Modal>
    )


}


export {OptionsModal, AttachedFileModal}