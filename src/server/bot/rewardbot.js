const {Client,MessageEmbed, MessageAttachment} = require("discord.js");
const express=require("express");
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());
app.listen(3333,console.log('Discord bot ~ 3333'));
require("dotenv").config();
//discord
const client=new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"] });
const Canvas=require('canvas');
//guild id 904072633509900318

app.post('/reward',async(req,res)=>{
    try{
    const {userName,rewardName,rewardCost,timestamp,target}=req.body;
    
    const textChannels=[...client.channels.cache.values()].filter(channel=>channel.type==="GUILD_TEXT");

    switch(rewardName){
        case "Kick" : 
        RemoveUser(target.displayName,`Kick redeemed by ${userName}`,"kick");
        break;
        case "Ban" :
        RemoveUser(target.displayName,`Ban redeemed by ${userName}`,"ban");
        break;
        case "Uav" : generateAndSendUAVMap(textChannels[0].id);
        break;

    }
    //channels in cache is map collection object so we spread the iterable values to get array of objects
    if(rewardName!=="Uav")
    sendRewardEmbed(textChannels[0].id,{
    author:userName,
    message :`${rewardName} was redeemed by ${userName} targetting ${target.displayName}`,
    reward:rewardName,
    cost:rewardCost,
    timestamp
    });
    
    res.send({message:"Reward redeemed successfuly"});
    }catch(err){
        console.log(err.message);
        res.send({message:"Error occured redeeming rewards"});
    }
});

app.get('/users',async(req,res)=>{
//exclude bot itself from showing
try{
const guilds=client.guilds.cache.map((guild)=>guild);
const users=[...(await guilds[0].members.fetch()).values()]
.filter(user=>user.displayName!==client.user.username)
.filter(user=>user.kickable); //shows every user that is kickable,filters out mods/owner
res.send(users);
}catch(err){
    console.log(err.message);
}
});

app.get('/channels',async(req,res)=>{
    const {filter}=req.query;
    //query should be like voice,text
    const textChannels=[...client.channels.cache.values()];
    let filteredChannels=null;
    if(filter){filteredChannels=textChannels.filter(channel=>channel.type===`GUILD_${filter.toUpperCase()}`);
    }else filteredChannels=textChannels;
    res.send(filteredChannels);
});


client.on('ready',()=>{
    console.log(`Logged in as ${client.user.tag}`);
});

//connect to discord api to serve on servers
client.login(process.env.DISCORD_BOT_TOKEN);

/**
 * HELPER FUNCTIONS
 *  
 */

function sendRewardEmbed(channelID,{author,message,reward,cost,timestamp}){
const embed=new MessageEmbed({title:reward,author,footer:cost,color:"GOLD",description:message,timestamp});
embed.setFooter(`${cost} Credits`);
if(embed)client.channels.cache.get(channelID).send({embeds:[embed]});
}

async function RemoveUser(username,reason,type){
    try{
    const guilds=client.guilds.cache.map((guild)=>guild);
    const users=[...(await guilds[0].members.fetch()).values()]
    .filter(user=>user.displayName!==client.user.username);
    const userToKick=users.filter(user=>user.displayName===username);
    if(type==="kick") if(userToKick[0].kickable) userToKick[0].kick(reason ? reason : "Reason wasn't defined");
    if(type==="ban") if(userToKick[0].bannable) userToKick[0].ban({days:1,reason:reason ? reason : "Reason wasn't defined"})
    else return;
    }catch(err){console.log(err.message);}
}


/**
 *  UAV FUNCTIONS
 */
async function generateAndSendUAVMap(channelID){
    const canvas=Canvas.createCanvas(1000,1000);
    const ctx=canvas.getContext('2d');
    const bg=await Canvas.loadImage("src/server/bot/assets/ExcelRadarChart.gif");
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);
    //DEBUG
    //TODO: loop over all available voice channels and display that many enemies on radar
    for(let i=0;i<10;i++) drawCircle(ctx,canvas.width/2,canvas.height/2,20);
    //display player count "detected"
    drawText(ctx,20,30,`10 Players detected`);
    const attachFile=new MessageAttachment(canvas.toBuffer(),"ExcelRadarChart.jpg");
    const channel=client.channels.cache.get(channelID);

    //1. Create & Send the first message which you want to update.

    let embed=new MessageEmbed().setImage("attachment://ExcelRadarChart.jpg");
    const displayMsg=await channel.send({embeds:[embed]});

    //2. Send the second message & Get the URL.
    const msg=await channel.send({files:[attachFile]});
    const url=msg.attachments.first().url;
    
    //3. Edit your first message.
    embed=new MessageEmbed().setImage(url);
    displayMsg.edit({embeds:[embed]});
    msg.delete({timeout:2000});//remove the prev msg so that only canvas is shown
  
}

function drawCircle(ctx,x,y,radius){
    ctx.save();
    ctx.fillStyle="lime";
    ctx.beginPath();
    ctx.arc(Math.floor(Math.random()*x)+x/2,Math.floor(Math.random()*y)+y/2,radius,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}
function drawText(ctx,x,y,text){
    ctx.save();
    ctx.font="30px Arial";
    ctx.fillStyle="white";
    ctx.fillText(text,x,y);
    ctx.restore();

}

/**
 * Precision Airstrike Functions
 */

async function targetRandomUsers(){
    try{
    const guilds=client.guilds.cache.map((guild)=>guild);
    const users=[...(await guilds[0].members.fetch()).values()]
    .filter(user=>user.displayName!==client.user.username);
    const rnd=Math.floor(Math.random()*users.length);
    const targettedUsers=[];
    targettedUsers.push(users[rnd]);
    const existingRole=guilds[0].roles.cache.find(role=>role.name==="Target");
    if(!existingRole){
    guilds[0].roles.create({
        name:"Target",
        color:"RED",
        reason:"Precision strike targetting",
    });
    }else{
          
    for(let i=0;i<targettedUsers.length;i++){
        const members=targettedUsers[i];
        members.roles.add(existingRole);
    } 
    }

    }catch(err){
        console.log(err.message);
    }
}
