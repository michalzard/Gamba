import React from 'react';
import "../style/Chat.scss";
import SendIcon from '@material-ui/icons/Send';
import { Avatar } from '@material-ui/core';
import BlockIcon from '@material-ui/icons/Block';


function Chat({user,setLoginOpened,socket,messages,setMessages}) {


    const sendMessageToChat=()=>{
        if(socket && user){
        const author={photoURL:user.photoURL,name:user.name};
        const textBox=document.getElementsByClassName('InputArea')[0]
        const data={author,message:textBox.value};
        if(textBox.value.length>0){ 
        socket.emit('message',data);
        setMessages((prev)=>[...prev,data]);
        textBox.value='';    
        }
        const lastChatMsg=setTimeout(()=>{scrollToBottom('Messages');clearInterval(lastChatMsg);},120); 
        
        }
    }
    const scrollToBottom=(id)=>{
        const div=document.getElementById(id);
        div.scrollTop=div.scrollHeight-div.clientHeight;
     }

    return (
        <div className="Chat">
        <div className="Info"><h4>Info about some shit</h4></div>
        <div className="Messages" id="Messages">
        {socket ? socket.disconnected ? 
        <div className="chatDisconnected"><BlockIcon/><span>Chat disconnected</span></div> : null
        : null}
        {
           user ?  messages.map((el,i)=>{
                return <ChatMessage key={i} author={el.author} message={el.message} />
            })
            : null
        }
        </div>
        <div className="InputBox">
        {
            user ? 
            <>
            <textarea type="text" className="InputArea" onKeyPress={(e)=>{if(e.key==="Enter"){e.preventDefault();sendMessageToChat();}}} placeholder={`Chat as ${user.name }`}/> 
            <div className="send"><SendIcon onClick={()=>{sendMessageToChat();}} className="chatSend"></SendIcon></div>
            </> 
            : 
            <span className="notLoggedInput">Please<span onClick={()=>{setLoginOpened(true)}} className="loginLink">log in</span> to chat</span> 
        }
        
        </div>
        </div>
    )
}

export default Chat;

function ChatMessage({author,message}){
    return(
        <div className="msg">
        <Avatar className="msgAvatar" src={author.photoURL ? author.photoURL : null} />
        <span className="msgContent">
        <span className="msgAuthor">{author ? author.name : "Username"}</span>
        <span className="msgText">{message ? message : null}</span>
        </span>
        
        </div>
    )
}