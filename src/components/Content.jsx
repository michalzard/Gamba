import React,{useState} from 'react'
import "../style/Content.scss";
import {Button} from "@material-ui/core";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PersonIcon from '@material-ui/icons/Person';


function Navigation() {
    const [selected,setSelected]=useState(1);
    
    return (
       <div className="content">

        <div className="navigation">
        <div className="links">
        
        <InteractiveButton ButtonIcon={HighlightOffIcon} text='Roulette' currentSelection={selected} setSelected={setSelected} selectedIndex={1}/>
        <InteractiveButton text='Text 2' currentSelection={selected} setSelected={setSelected} selectedIndex={2}/>
        <InteractiveButton text='Text 3' currentSelection={selected} setSelected={setSelected} selectedIndex={3}/>

        
        </div>

        <div className="login">
        <Button color="primary" variant="text" disableRipple><PersonIcon/></Button>
        </div>
        </div>
       
        <div>
        <span>Content</span>
        
        </div>

       </div>
    )
       
}

export default Navigation

function InteractiveButton({ButtonIcon,selectedIndex,currentSelection,setSelected,text}){
    return(
        <Button color="primary" variant="text" disableFocusRipple style={{
        color:currentSelection===selectedIndex ? "#c32d4f" : null,borderTop: currentSelection===selectedIndex ? '2px solid red' : null}} onClick={()=>{setSelected(selectedIndex);}}>
        <div className="intBtnContent">{ButtonIcon ? <ButtonIcon style={{marginRight:'5px'}}/> : null} <span className="intBtnText">{text}</span></div>
        </Button> 
    )
}