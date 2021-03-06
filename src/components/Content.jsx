import React,{useEffect, useState} from 'react'
import "../style/Content.scss";
import {Button,Dialog,DialogTitle,DialogContent,TextField,Avatar} from "@material-ui/core";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from "axios";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import Roulette from './Roulette';

function Navigation({sessionID,setSessionID,user,setUser,setLoginOpened,loginOpened,socket,rouletteTimer,rouletteBets,setRouletteBets,currentWin}) {
    //tabs
    const [selected,setSelected]=useState(1);
    const [rewardsOpen,setRewardsOpen]=useState(false);
    const closeLoginDialog=()=>{
        setLoginOpened(false);
    }
    const closeRewardScreen=()=>{
        setRewardsOpen(false);
    }
    const logoutUser=()=>{
        //when already logged in so there's session already established
        axios.post(`http://localhost:3001/logout`,{
            id:localStorage.getItem("sessionID"),
        });
        setSessionID(null);
        setUser(null);
    }
    return (
       <div className="content">

        <div className="navigation">
        <div className="links">
        
        <InteractiveButton ButtonIcon={HighlightOffIcon} text='Roulette' currentSelection={selected} setSelected={setSelected} selectedIndex={1}/>
        <InteractiveButton text='Text 2' currentSelection={selected} setSelected={setSelected} selectedIndex={2}/>
        <InteractiveButton text='Text 3' currentSelection={selected} setSelected={setSelected} selectedIndex={3}/>
        
        </div>
        <div className='rewards'>
        <Button color="secondary" variant="contained" className="loginBtn" onClick={()=>{setRewardsOpen(true);}}>Withdraw</Button>
        </div>
        <div className="login">
        {/**TODO: show whole menu of actions once already logged in  */}
        {sessionID ? <UserInfo userBalance={user ? user.balance : null}/> : 
        <Button color="secondary" className="loginBtn" variant="contained" onClick={()=>{setLoginOpened(true);}} ><PersonIcon/> Login / Register</Button>
        }
        </div>
        </div>
       
        <div className="content2">
        <LoginDialog handleClose={closeLoginDialog} openBool={loginOpened} setSessionID={setSessionID} setLoginOpened={setLoginOpened} setUser={setUser}/>
        <RewardsScreen handleClose={closeRewardScreen} openBool={rewardsOpen} user={user}/>
        <div className="second_navigation">
        
        {sessionID ? <span className="exitIcon"><ExitToAppIcon onClick={()=>{logoutUser();}}/></span> : null}
        </div>
        <div className="games">
        <Roulette user={user} sessionID={sessionID} socket={socket} setRouletteBets={setRouletteBets}
        rouletteTimer={rouletteTimer} rouletteBets={rouletteBets} currentWin={currentWin}/>
        </div>
        </div>

       </div>
    )
       
}

export default Navigation;
/**
 * REWARDS SCREEN WITH CUSTOM ELEMENTS
 */
function RewardsScreen({handleClose,openBool,user}){
    const [discordUsers,setDiscordUsers]=useState([]);
    const [selectIndex,setSelectIndex]=useState(0);
    const fetchDiscordUsers=()=>{
        //fetches array from 
        axios.get("http://localhost:3333/users").then(data=>{setDiscordUsers(data.data)});
    }
    const redeemReward=(rName)=>{
        axios.post("http://localhost:3333/reward",{userName:user.name,target:discordUsers[selectIndex],rewardName:rName ? rName : null,rewardCost:30000,timestamp:Date.now()});
    }
    useEffect(()=>{if(openBool)fetchDiscordUsers();},[openBool]);
    return(
        <Dialog onClose={handleClose} open={openBool} className="rewardScreen"
        >
        <DialogTitle className="rewardTitle">Rewards Shop</DialogTitle>
        <DialogContent className="rewardMenu">
      
        <div className="targets">
        <span className='text'>
        Choose target to apply effect onto from 
        <a href="https://discord.gg/7ucFa2zcAX" target="_blank" rel="noreferrer">Discord</a>.<br/>
        </span>
        <div className="discord_users">
        {
        discordUsers.map((member,i)=>{
        return <Avatar key={member.userId} src={member.displayAvatarURL} style={{border: selectIndex===i ? `2px solid red` : null,cursor:"pointer"}} 
        onClick={()=>{setSelectIndex(i)}}/>
        })
        }
        </div></div>

        <div className="rewards">
        <RewardsTile name="Kick" desc="Kicks user from server" price={30000} callback={()=>{redeemReward("Kick");}}/>
        <RewardsTile name="Ban" desc="Bans user from server" price={30000} callback={()=>{redeemReward("Ban")}}/>
        <RewardsTile name="UAV" desc="Bot scans voice chats if people are exposed,displays them on radar and targets them in red,
        picks 60% of targets to attack" price={30000} callback={()=>{redeemReward("Uav")}}/> 
        <RewardsTile name="Precision Airstrike" desc="Bot scans voicechats and attacks with 3 man precision "
         price={30000} callback={()=>{console.log('airstrike')}}/>
        </div>


        </DialogContent>
        </Dialog>
    )
}

function RewardsTile({name,desc,price,callback}){
    return (
        <div className="rewardEl">
        <span className="name">{name ? name : null}</span>
        <span className="description">{desc ? desc : "No description"}</span>
        <span className="pricing"><LocalAtmIcon/>{price ? price : 777}</span>
        <Button color="secondary" variant="contained" className="loginBtn rwdBtn" onClick={()=>{callback();
        }}>Redeem</Button>
        </div>
    )
}

function InteractiveButton({ButtonIcon,selectedIndex,currentSelection,setSelected,text}){
    return(
        <Button color="primary" className="intBtn" ariant="text" disableFocusRipple style={{
        color:currentSelection===selectedIndex ? "#c32d4f" : null,borderTop: currentSelection===selectedIndex ? '2px solid red' : null}} onClick={()=>{setSelected(selectedIndex);}}>
        <div className="intBtnContent">{ButtonIcon ? <ButtonIcon style={{marginRight:'5px'}}/> : null} <span className="intBtnText">{text}</span></div>
        </Button> 
    )
}


function LoginDialog({handleClose,openBool,setSessionID,setLoginOpened,setUser}){
const [display,setDisplay]=useState("Login");
const [warning,setWarning]=useState("");

/**
 * add visible response for user if they try to register with name that was already created
 */
const registerUser=()=>{
    //send data to auth server
    axios.post(`http://localhost:3001/register`,{
        email:document.getElementsByClassName("em")[0].children[1].children[0].value,
        name:document.getElementsByClassName("nm")[0].children[1].children[0].value,
        password:document.getElementsByClassName("pw")[0].children[1].children[0].value,
    });
    setDisplay("Login");   
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
    if(message.includes('Login successful')){
    localStorage.setItem('sessionID',sessionID);
    setSessionID(sessionID);
    setLoginOpened(false);
    //get user data
    axios.post(`http://localhost:3001/member`,{id:sessionID}).then(data=>{
        const {user}=data.data;
        setUser(user);
    });
    }
    //if login is incorrect keep showing dialog window but remove session object from localstorage if present
    else{
        localStorage.removeItem('sessionID');
        setLoginOpened(true);
    }
    
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