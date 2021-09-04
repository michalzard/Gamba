import {CssBaseline} from "@material-ui/core"
import "./style/App.scss";
import Content from "./components/Content";
import Chat from "./components/Chat";
import { useState,useEffect } from "react";
import axios from "axios";

function App() {

    const [sessionID,setSessionID]=useState(null);

     /**
     * JUST TO TEST
     */
      useEffect(() => {
        if(localStorage.getItem("sessionID")){
        setSessionID(localStorage.getItem("sessionID"))
        axios.get(`http://localhost:3001/session?lastSession=${localStorage.getItem("sessionID")}`).then(data=>{
        const {message}=data.data;
        if(message.includes("Session wasn't found")){setSessionID(null);localStorage.removeItem("sessionID");}
        });
      }
    }, []);

  return (
    <div className="App">
    <CssBaseline/>
    <Chat/>
    <Content sessionID={sessionID} setSessionID={setSessionID} />
    </div>
  );
}

export default App;
