import React, { useEffect, useState } from 'react'
import "../style/Chat.scss";
import SendIcon from '@material-ui/icons/Send';
import {io} from "socket.io-client";
import { Avatar } from '@material-ui/core';
import BlockIcon from '@material-ui/icons/Block';


function Chat({user,setLoginOpened}) {
    const [socket,setSocket]=useState(null);
    const [messages,setMessages]=useState([]);

    useEffect(()=>{
    if(user!==null){
    const socket=io('http://localhost:3002');
    setSocket(socket);
    socket.on("message",(data)=>{
    //show messages that were emitted to chat server in chatbox
    setMessages((prev)=>[...prev,data]);
    });
    return ()=>socket.close();    
}
    
    },[user]);

    const sendMessageToChat=()=>{
        if(socket && user){
        const author={photoURL:user.photoURL,name:user.name};
        const textBox=document.getElementsByClassName('InputArea')[0]
        const data={author,message:textBox.value};
        if(textBox.value.length>0){ 
        socket.emit('message',data);
        setMessages((prev)=>[...prev,data]);
        console.log(messages);
        textBox.value='';    
        }

        }
    }

    return (
        <div className="Chat">
        <div className="Info"><h4>Info about some shit</h4></div>
        <div className="Messages">
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
            <textarea type="text" className="InputArea" placeholder={`Chat as ${user.name }`}/> 
            <div className="send"><SendIcon onClick={()=>{sendMessageToChat()}} className="chatSend"></SendIcon></div>
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