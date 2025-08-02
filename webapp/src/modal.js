import {useState, useContext} from 'react'
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
}


export default OptionsModal