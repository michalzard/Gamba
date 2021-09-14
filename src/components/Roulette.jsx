import React,{useEffect,useState} from 'react'
import "../style/Roulette.scss";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RefreshIcon from '@material-ui/icons/Refresh';
import PersonIcon from '@material-ui/icons/Person';
import {TextField,Button} from '@material-ui/core';

function Roulette({user}) {
    const [betAmount,setBetAmount]=useState(0);
    const initBoxes=(boxDiv)=>{
        const amountOfBoxes=30;
        for(let i=1;i<amountOfBoxes+1;i++){
            const box=document.createElement("div");
            box.className="box"
            const insideBox=document.createElement("span");
            insideBox.innerHTML=`${i}`; // what number to show on box
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

    const onAmountChange=(e)=>{
        setBetAmount(e.target.value);
    }

    const changeCurrentBet=(amount)=>{
    setBetAmount(amount);
    }

    const clearCurrentBet=()=>{
        setBetAmount(0);
    }
    return (
        <div className="roulette">
        <div className="game">
           <div className="history">
            <div className="last100boxes">tu budu posledne farby</div>
            <span className="last100">Last 100
            <span className="reds">40</span>
            <span className="greens">10</span>
            <span className="blacks">50</span>
            </span>
           </div>
           <div className="progressBar">
            <div className="insideProgress"/>
           <span className="text">Spinning in ...</span>
          </div>

           <div className="colorBoxes"/>
           <div className="betControls">
            <div className="balance">
            <LocalAtmIcon/> <span className="amount">{user ? user.balance : 0}</span> <RefreshIcon/>
            </div>
            <div className="controls">
            <div className="betField">
            <TextField type={"number"} placeholder="0" color="secondary" 
            onChange={(e)=>{onAmountChange(e);}} value={betAmount}   InputLabelProps={{style:{color:"gray"}}} InputProps={{style:{color:"white"}}}/>
            {/* make number type  */}
            </div>
            <div className="ctrlButtons">
            <Button variant="text" size="small" color="secondary" onClick={()=>{clearCurrentBet();}}>Clear</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(Math.floor(betAmount/2));}}>1/2</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(betAmount+10);}}>+10</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(betAmount+1000);}}>+1k</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(betAmount+10000);}}>+10k</Button>
            <Button variant="text" size="small" color="secondary" onClick={()=>{changeCurrentBet(user.balance)}}>Max</Button>
            </div>
            </div>
           </div>
           <div className="betButtons">
            <Button variant="text" className="redBet">Red</Button>
            <Button variant="text" className="greenBet">Green</Button>
            <Button variant="text" className="blackBet">Black</Button>
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
           <div className="highest"> </div>    
           <div className="rest"> </div>
           </div>

           </div>
        </div>
    )
}

export default Roulette;
