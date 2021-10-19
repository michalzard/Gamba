import React,{useEffect,useState} from 'react'
import "../style/Roulette.scss";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RefreshIcon from '@material-ui/icons/Refresh';
import PersonIcon from '@material-ui/icons/Person';
import {TextField,Button,Avatar} from '@material-ui/core';
import axios from "axios";

function Roulette({user,socket,sessionID,rouletteTimer,rouletteBets,currentWin}) {
    const [betAmount,setBetAmount]=useState(0);
    const initBoxes=(boxDiv)=>{
        const amountOfBoxes=50;
        for(let i=0;i<amountOfBoxes;i++){
            const box=document.createElement("div");
            box.className="box";
            //60 is min-width of boxes
            box.style.left=`${amountOfBoxes*amountOfBoxes/2.5}px`;
            
            // if(i===amountOfBoxes/2)box.style.backgroundColor="pink";
            if(i%2===0) box.style.backgroundColor="#c32d4f";
            else box.style.backgroundColor="#2e2e36";
            const insideBox=document.createElement("span");
            const rnd=Math.floor(Math.random()*14)+1;
            insideBox.innerHTML=rnd; // what number to show on box
            insideBox.className="boxNumber";
            box.appendChild(insideBox);
            boxDiv.appendChild(box);
        }
    }

    useEffect(()=>{
    let boxDiv=document.getElementsByClassName("colorBoxes")[0];
    initBoxes(boxDiv);
    
    return ()=>{if(boxDiv){boxDiv=null;}}
    },[]);

    // const restartRoulleteTrack=()=>{

    // }

    const spinRoulette=(roulette,color)=>{
   /**
    * transition-property: left;
    * transition-duration: 2s; 
    * properties of boxTransition that are applied to make spin animation 
    * and removed for reset portion of animation
    */
    for(let i=0;i<roulette.children.length;i++){
        roulette.children[i].classList.remove("boxTransition");
        roulette.children[i].style.left=roulette.children.length*50/2.5+"px";
    } 
    const spin=setTimeout(()=>{
        for(let i=0;i<roulette.children.length;i++){
        roulette.children[i].classList.add("boxTransition");
        let offset="0px"; 
        if(color==="red") offset="-95px"; //red
        else offset="-35px";//black,green

        roulette.children[i].style.left=offset; 
        } 
        clearTimeout(spin);
    },1000);
   
    }



    useEffect(()=>{

        const roulette=document.getElementsByClassName("colorBoxes")[0];
        const middleBox=roulette.children[currentWin.result ? currentWin.result.color==="red" ? 26 : 25 : 25]; 
        
        console.log(currentWin);
        //
   
        try{
        if(currentWin.result) spinRoulette(roulette,currentWin.result.color);
      
        if(currentWin.result.color==="black"){
        middleBox.style.backgroundColor="#2e2e36";
        middleBox.style.border="2px solid orange";
        roulette.children[26].style.border="none"; //red box need to be reset so its not displaying 2 diff highlights 
        }
        if(currentWin.result.color==="red"){
        middleBox.style.backgroundColor="#c32d4f";
        middleBox.style.border="2px solid orange";
        roulette.children[25].style.border="none"; // same but for black/green
        }
        if(currentWin.result.color==="green"){
        middleBox.style.border="2px solid orange";
        middleBox.style.backgroundColor="green";
        roulette.children[26].style.border="none"; // same but for red again
        }
        
        if(currentWin.result.number>=0) middleBox.children[0].innerHTML=currentWin.result.number;        
    }catch(err){
        console.log(err.message);
    }
    },[currentWin]);

    const onAmountChange=(e)=>{
        setBetAmount(e.target.value);
    }

    const changeCurrentBet=(amount)=>{
    setBetAmount(amount);
    }

    const clearCurrentBet=()=>{
        setBetAmount(0);
    }


    const submitCurrentBet=(color)=>{
    const balanceDiff=user.balance-=betAmount;//updates balance showed on profile
    if(betAmount>0 && betAmount<balanceDiff){
    const betAmount=parseInt(document.getElementsByClassName('betAmountInputField')[0].children[0].children[0].value);
    
    axios.post("http://localhost:3001/balance",{id:sessionID,balance:balanceDiff});
    socket.emit('bet',{user,color,betAmount});
    }}

    return (
        <div className="roulette">
        <div className="game">
           <div className="history">
            <div className="last100boxes">Results debug - {currentWin.result ? currentWin.result.number : null } {currentWin.result ? currentWin.result.color : null} </div>
            <span className="last100">Last 100
            <span className="reds">40</span>
            <span className="greens">10</span>
            <span className="blacks">50</span>
            </span>
           </div>
           <div className="progressBar">
            <div className="insideProgress" style={{width:rouletteTimer ? `${(rouletteTimer/15)*100}%` : '100%'}}/>
           <span className="text">Spinning in {rouletteTimer ? rouletteTimer : "..."}</span>
          </div>
          
           <div className="colorBoxes"/>

           <div className="betControls">
            <div className="balance">
            <LocalAtmIcon/> <span className="amount">{user ? user.balance : 0}</span> <RefreshIcon/>
            </div>
            <div className="controls">
            <div className="betField">
            <TextField type={"number"} placeholder="0" color="secondary" className="betAmountInputField"
            onChange={(e)=>{onAmountChange(e);}} value={betAmount}   InputLabelProps={{style:{color:"gray"}}} InputProps={{style:{color:"white"}}}/>
            {/* make number type  */}
            </div>
            <div className="ctrlButtons">
            <Button variant="text" size="small" color="secondary" onClick={()=>{clearCurrentBet();}}>Clear</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(Math.floor(betAmount/2));}}>1/2</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(betAmount+100);}}>+100</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(betAmount+1000);}}>+1k</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(betAmount+10000);}}>+10k</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(user.balance)}}>Max</Button>
            </div>
            </div>
           </div>
           <div className="betButtons">
            <Button variant="text" className="redBet" onClick={()=>{submitCurrentBet("red");}}>Red</Button>
            <Button variant="text" className="greenBet" onClick={()=>{submitCurrentBet("green");}}>Green</Button>
            <Button variant="text" className="blackBet" onClick={()=>{submitCurrentBet("black");}}>Black</Button>
            </div>
            <div className="betInfo">
            <div className="redOverall">
            <span><PersonIcon/> 0 </span> 
            <span><LocalAtmIcon/> 0 </span>
             </div>
            <div className="greenOverall">
            <span><PersonIcon/> 0 </span>
            <span><LocalAtmIcon/> 0 </span>
            </div>
            <div className="blackOverall">
            <span><PersonIcon/> 0 </span>
            <span><LocalAtmIcon/> 0 </span>
            </div>
            </div>
           <div className="lastBets">
           <div className="red">
            <div className="highestRed">
            highest red
            </div>
            <div className="smallerReds">
            {
                rouletteBets.map((bet,i)=>{ 
                return bet.color==="red" ? <UserBetInfo key={i} username={bet.user.name} betAmount={bet.betAmount}/> 
                : null
                })
            }
            </div>
           </div>
           <div className="green">
            <div className="highestGreen">
            highest green
            </div>
            <div className="smallerGreens">
            {
                rouletteBets.map((bet,i)=>{ 
                return bet.color==="green" ? <UserBetInfo key={i} username={bet.user.name} betAmount={bet.betAmount}/> 
                : null
                })
            }
            </div>
           </div>
           <div className="black">
            <div className="highestBlack">
            highest black
            </div>
            <div className="smallerBlacks">
            {
                rouletteBets.map((bet,i)=>{ 
                return bet.color==="black" ? <UserBetInfo key={i} username={bet.user.name} betAmount={bet.betAmount}/> 
                : null
                })
            }
            </div>
           </div>

           </div>

           </div>
        </div>
    )
}

export default Roulette;

function UserBetInfo({username,betAmount}){
    return (
        <div className="userBet">
        <span className="userInfo"><Avatar/>{username ? username : null}</span>
        <span className="userBetAmount"><LocalAtmIcon/>{betAmount ? betAmount : 0}</span>
        </div>
    )
}