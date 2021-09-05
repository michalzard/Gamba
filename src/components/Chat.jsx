import React from 'react'
import "../style/Chat.scss";
import SendIcon from '@material-ui/icons/Send';

function Chat({sessionID,user}) {
    return (
        <div className="Chat">
        <div className="Info"><h4>Info about some shit</h4></div>
        <div className="Messages">
        </div>
        <div className="InputBox">
        <textarea type="text" className="InputArea" placeholder={`Chat as ${user ? user.name : null}`}/>
        <div className="send"><SendIcon className="chatSend"></SendIcon></div>
        </div>
        </div>
    )
}

export default Chat;

/**
 * Please login to chat overlay
 */