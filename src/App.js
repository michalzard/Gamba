import {CssBaseline} from "@material-ui/core"
import "./style/App.scss";
import Content from "./components/Content";
import Chat from "./components/Chat";
import { useState,useEffect } from "react";
import axios from "axios";

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

  return (
    <div className="App">
    <CssBaseline/>
    <Chat user={user} setLoginOpened={setLoginOpened} />
    <Content setLoginOpened={setLoginOpened} loginOpened={loginOpened}
    sessionID={sessionID} setSessionID={setSessionID} setUser={setUser} user={user}/>
    </div>
  );
}

export default App;
