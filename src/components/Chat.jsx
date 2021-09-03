import React from 'react'
import "../style/Chat.scss";
import SendIcon from '@material-ui/icons/Send';

function Chat() {
    return (
        <div className="Chat">
        <div className="Info"><h4>Info about some shit</h4></div>
        <div className="Messages">
        </div>
        <div className="InputBox">
        <textarea type="text" className="InputArea" placeholder="Chat Here"/>
        <div className="send"><SendIcon onClick={()=>{alert('clicked send')}}></SendIcon></div>
        </div>
        </div>
    )
}

export default Chat;

/**
 * Please login to chat overlay
 */