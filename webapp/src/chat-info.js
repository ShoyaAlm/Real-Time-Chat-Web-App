import React, { useState } from "react";
import Modal from "react-modal"

import './css/chat-info.css'

const UserInfo = ({chat, setShowUserInfo}) => {


    return (
        <Modal isOpen={true} onRequestClose={() => setShowUserInfo(false)}
        
        contentLabel="User Info" ariaHideApp={false} overlayClassName="user-info-overlay" className="user-info-content"
        >

        <img src={chat.img} style={{width:'75px', height:'75px', borderRadius:'50%', objectFit: 'cover',
            position:'absolute', left:'10px', top:'10px'}}/>
        <div className="user-detail" style={{position:'relative', left:'120px'}}>
        
        <h3 style={{}}>{chat.name}</h3>
        <h5 style={{}}>last seen recently</h5>
        <hr/>
        
        <h5>bio</h5>
        <h5>{chat.bio}</h5>
        <hr/>

        <h5 style={{}}>@username</h5>
        
        </div>
        

        {/* after showcasing everything, then put different sections such as media, links, groups */}


        </Modal>
    )
}


const GroupInfo = ({chat, setShowGroupInfo, showUserInfo, setShowUserInfo}) => {

    const [selectedUser, setSelectedUser] = useState(null)

    return (
        <Modal isOpen={true} onRequestClose={() => setShowGroupInfo(false)}
        contentLabel="Group Info" ariaHideApp={false} overlayClassName="group-info-overlay" className="group-info-content"
        >
        
        <div>
        

        <div className="group-detail" style={{position:'relative', left:'10px'}}>
        
        <img src={chat.img} style={{width:'75px', height:'75px', borderRadius:'50%', objectFit: 'cover',
            position:'absolute', left:'6px', top:'-5px'}}/>
        
        <button onClick={() => setShowGroupInfo(false)} style={{position:'absolute', right:'30px'}}>X</button>
        <div style={{position:'relative', left:'100px', marginBottom:'25px', width:'65%'}}>
            <h3>{chat.name}</h3>
            <h5>{chat.users.length} members</h5>
        </div>
        
        <hr/>


        <h5>bio</h5>
        <h5>{chat.bio}</h5>
        
        <h5 style={{marginBottom:'0', marginTop:'10px'}}>{chat.users.length} Members</h5>
            {/* add a search bar */}

        <div className="group-users" style={{position:'relative', overflowY: 'auto', maxHeight:'330px'}}>
        <hr style={{fontSize:'10px'}}/>
        {chat.users.map((user, index) => {
            return (
                <>
                {showUserInfo && <UserInfo chat={selectedUser} setShowUserInfo={setShowUserInfo} />}
                
                <div key={index} style={{position:'relative', display:'flex', flexDirection:'row'}}
                   onClick={() => {
                    setSelectedUser(user)
                    setShowUserInfo(true) }} >

                <img src={user.img} style={{position:'absolute', left:'10px', width:'54px', height:'54px', top:'8px',
                    borderRadius:'50%', objectFit: 'cover'}}/>
                <div style={{position:'relative' ,display:'flex', flexDirection:'column', left:'80px', height:'80px'}}>
                <h4 style={{position:'absolute', top:'-10px'}}>{user.name}</h4>
                <h5 style={{position:'relative', top:'20px', marginBottom:'0'}}>Last seen recently</h5>
                </div>
                
                </div>
                
                </>
            )
        })}
                </div>

        </div>

        </div>
        
        </Modal>
    )
}

const ChannelInfo = ({chat, setShowChannelInfo}) => {

    console.log(chat.users);
    
    return (
        <Modal isOpen={true} onRequestClose={() => setShowChannelInfo(false)}
        
        contentLabel="Channel Info" ariaHideApp={false} overlayClassName="channel-info-overlay"
        className="channel-info-content">

        <img src={chat.img} style={{width:'75px', height:'75px', borderRadius:'50%', objectFit: 'cover',
            position:'absolute', left:'10px', top:'10px'}}/>
        <div className="channel-detail" style={{position:'relative', left:'120px'}}>
        
        <h3 style={{}}>{chat.name}</h3>
        <h5 style={{}}>{chat.users.length} members</h5>
        <hr/>
        
        <h5>bio</h5>
        <h5>{chat.bio}</h5>
        <hr/>
        
        <h4>{chat.link}</h4>
        <h5 style={{}}>Link</h5>
        <hr />
        </div>
        

        </Modal>
    )

}

export {UserInfo, GroupInfo, ChannelInfo}