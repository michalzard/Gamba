import React,{useEffect} from 'react'
import "../style/Roulette.scss";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import RefreshIcon from '@material-ui/icons/Refresh';
import {TextField} from '@material-ui/core';

function Roulette() {
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
            <LocalAtmIcon/> <span className="amount">6666</span> <RefreshIcon/>
            </div>
            <div className="controls">
            <TextField placeholder="amount" color="secondary" label="Bet" InputLabelProps={{style:{color:"gray"}}} InputProps={{style:{color:"white"}}}/>
            </div>


           </div>
           <div className="lastBets">current bets</div>
           </div>
        </div>
    )
}

export default Roulette;
