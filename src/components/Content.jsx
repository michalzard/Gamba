import React,{useState} from 'react'
import "../style/Content.scss";
import {Button,Dialog,DialogTitle,DialogContent,TextField,Avatar} from "@material-ui/core";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from "axios";


function Navigation({sessionID,setSessionID,user}) {
    //tabs
    const [selected,setSelected]=useState(1);
    //login popup states
    const [loginOpened,setLoginOpened]=useState(false);
    const closeLoginDialog=()=>{
        setLoginOpened(false);
    }
 

    return (
       <div className="content">

        <div className="navigation">
        <div className="links">
        
        <InteractiveButton ButtonIcon={HighlightOffIcon} text='Roulette' currentSelection={selected} setSelected={setSelected} selectedIndex={1}/>
        <InteractiveButton text='Text 2' currentSelection={selected} setSelected={setSelected} selectedIndex={2}/>
        <InteractiveButton text='Text 3' currentSelection={selected} setSelected={setSelected} selectedIndex={3}/>
        
        </div>

        <div className="login">
        {/**TODO: show whole menu of actions once already logged in  */}
        {sessionID ? <UserInfo userBalance={user ? user.balance : null}/> : 
        <Button color="secondary" className="loginBtn" variant="contained" onClick={()=>{setLoginOpened(true);}} ><PersonIcon/> Login / Register</Button>
        }
        </div>
        </div>
       
        <div>
        <LoginDialog handleClose={closeLoginDialog} openBool={loginOpened} setSessionID={setSessionID} setLoginOpened={setLoginOpened}/>
        <div className="second_navigation">
        
        <ExitToAppIcon/>
        </div>
        <span>Content</span>
        
        </div>

       </div>
    )
       
}

export default Navigation

function InteractiveButton({ButtonIcon,selectedIndex,currentSelection,setSelected,text}){
    return(
        <Button color="primary" className="intBtn" ariant="text" disableFocusRipple style={{
        color:currentSelection===selectedIndex ? "#c32d4f" : null,borderTop: currentSelection===selectedIndex ? '2px solid red' : null}} onClick={()=>{setSelected(selectedIndex);}}>
        <div className="intBtnContent">{ButtonIcon ? <ButtonIcon style={{marginRight:'5px'}}/> : null} <span className="intBtnText">{text}</span></div>
        </Button> 
    )
}


function LoginDialog({handleClose,openBool,setSessionID,setLoginOpened}){
const [display,setDisplay]=useState("Login");
const [warning,setWarning]=useState("");

/**
 * add visible response for user if they try to register with name that was already created
 */
const registerUser=({setSessionID})=>{
    //send data to auth server
    axios.post(`http://localhost:3001/register`,{
        email:document.getElementsByClassName("em")[0].children[1].children[0].value,
        name:document.getElementsByClassName("nm")[0].children[1].children[0].value,
        password:document.getElementsByClassName("pw")[0].children[1].children[0].value,
    }).then(data=>{
    const {sessionID}=data.data;
    localStorage.setItem('session',sessionID);
    setSessionID(sessionID);
    setLoginOpened(false);
    });
   
}

/**
 * Add visible response for user for when they misspel passwords
 */
const loginUser=()=>{
    axios.post(`http://localhost:3001/login`,{
        name:document.getElementsByClassName("nm")[0].children[1].children[0].value,
        password:document.getElementsByClassName("pw")[0].children[1].children[0].value,
    }).then(data=>{
    const {message,sessionID}=data.data;
    setWarning(message);
    localStorage.setItem('sessionID',sessionID);
    setSessionID(sessionID);
    setLoginOpened(false);
    });
}

return(
    <Dialog onClose={handleClose} className="dialogMenu" open={openBool}>
    <div className="loginDialog">
    <DialogTitle className="dialogTitle">
    {/* <h4>Login -or- Register</h4> */} 
    <Button color="secondary" variant="contained" size="large" onClick={()=>{setDisplay("Login")}}>Login</Button>
    <span className="or">-or-</span> 
    <Button color="secondary" variant="contained" size="large" onClick={()=>{setDisplay("Register")}}>Register</Button>  
 
    </DialogTitle>
    
    <DialogContent className="dialogContent">
    {/* username, password , email in reg part and create button*/}
    {display==="Login" ? <h2>Login to continue</h2> : <h2>Register your account</h2>}
    <span style={{marginLeft:"10px",color:"red"}}>{warning}</span>
    {display==="Register" ? <TextField className="em" color="secondary" label="Email" InputLabelProps={{style:{color:"white"}}} placeholder="Email" variant="filled" type="email"/> : null }

    <TextField color="secondary" className="nm" label="Name" InputLabelProps={{style:{color:"white"}}} placeholder="Name" variant="filled" type="text"/>
    <TextField color="secondary" className="pw" label="Password"InputLabelProps={{style:{color:"white"}}} placeholder="Password" variant="filled" type="password"/>    
    <div className="actions">
    <Button color="secondary" variant="text" disableRipple size="small" onClick={()=>{display==="Login" ? setDisplay("Register") : setDisplay("Login");}}>
    {display==="Login" ? "Forgot your password?" : "Already have an account?" }</Button>
    <Button color="secondary" variant="contained" onClick={()=>
    {display==="Login" ? loginUser() : registerUser(); } 
    }>{display==="Login" ? "Login" : "Register"}</Button>
    </div>
    </DialogContent>

    </div>

    </Dialog>
)
}

function UserInfo({userBalance}){
    return(
        <div className="userInfo">
        <div className="balanceTag">Credits</div>
        <div className="balance">
        <span className="total">{userBalance ? userBalance : 0}</span>
        </div>
        <Avatar className="userPhoto"/>
        </div>
    )
}