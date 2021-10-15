import {CssBaseline} from "@material-ui/core"
import "./style/App.scss";
import Content from "./components/Content";
import Chat from "./components/Chat";
import { useState,useEffect } from "react";
import axios from "axios";
import {io} from "socket.io-client";

function App() {

    const [sessionID,setSessionID]=useState(null);
    const [user,setUser]=useState(null);
    
    //login popup states
    const [loginOpened,setLoginOpened]=useState(false);
    
    useEffect(() => {
        if(localStorage.getItem("sessionID")){
        setSessionID(localStorage.getItem("sessionID"));
        //failing if sessionID is set as undefined
        axios.get(`http://localhost:3001/session?lastSession=${localStorage.getItem("sessionID")}`).then(data=>{
        const {message,sessionID}=data.data;
        console.log(data.data);
        if(message.includes("Session wasn't found")){setSessionID(null);localStorage.removeItem("sessionID");}
        axios.post(`http://localhost:3001/member`,{id:sessionID}).then(data=>{
        const {user}=data.data;
        setUser(user);
        });

      });
      }
    }, []);

    //socket states
    const [socket,setSocket]=useState(null);
    const [messages,setMessages]=useState([]);
    const [rouletteTimer,setRouletteTimer]=useState(0);
    const [rouletteBets,setRouletteBets]=useState([]);
    const [currentWin,setCurrentWin]=useState({});

    useEffect(()=>{
      if(user!==null){
      const socket=io('http://localhost:3002');
      setSocket(socket);
      //show messages that were emitted to chat server in chatbox
      socket.on("message",(data)=>setMessages((prev)=>[...prev,data]));
      //roulette info
      socket.on("rouletteTimer",(timer)=>setRouletteTimer(timer));
      socket.on("roulette.allBets",(bets)=>setRouletteBets(bets));
      socket.on("roulette.win",(winData)=>setCurrentWin(winData));

      return ()=>socket.close();    
      }
      },[user]);

  return (
    <div className="App">
    <CssBaseline/>
    <Chat user={user} setLoginOpened={setLoginOpened} socket={socket} setMessages={setMessages} messages={messages} />
    <Content setLoginOpened={setLoginOpened} loginOpened={loginOpened} socket={socket} sessionID={sessionID} setSessionID={setSessionID}
    rouletteTimer={rouletteTimer} rouletteBets={rouletteBets} currentWin={currentWin}
    setUser={setUser} user={user}/>
    </div>
  );
}

export default App;
