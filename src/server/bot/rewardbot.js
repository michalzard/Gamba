const {Client,MessageEmbed} = require("discord.js");
const express=require("express");
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());
app.listen(3333,console.log('Discord bot ~ 3333'));
require("dotenv").config();
//discord
const client=new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"] });

//guild id 904072633509900318

app.post('/kick',async(req,res)=>{
    try{
    const {userName,rewardName,rewardCost,timestamp,target}=req.body;
    //channels in cache is map collection object so we spread the iterable values to get array of objects
    const textChannels=[...client.channels.cache.values()].filter(channel=>channel.type==="GUILD_TEXT");
    sendRewardEmbed(textChannels[0].id,{
    author:userName,
    message :`${rewardName} was redeemed by ${userName} targetting ${target.displayName}`,
    reward:rewardName,
    cost:rewardCost,
    timestamp
    });
    
    kickUser(target.displayName,`Kick redeemed by ${userName}`);
    res.send({message:"Reward redeemed successfuly"});
    }catch(err){
        console.log(err.message);
        res.send({message:"Error occured redeeming rewards"});
    }
});

app.get('/users',async(req,res)=>{
//exclude bot itself from showing
const guilds=client.guilds.cache.map((guild)=>guild);
const users=[...(await guilds[0].members.fetch()).values()]
.filter(user=>user.displayName!==client.user.username)
.filter(user=>user.kickable); //shows every user that is kickable,filters out mods/owner
res.send(users);
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

async function kickUser(username,reason){
    try{
    const guilds=client.guilds.cache.map((guild)=>guild);
    const users=[...(await guilds[0].members.fetch()).values()]
    .filter(user=>user.displayName!==client.user.username);
    const userToKick=users.filter(user=>user.displayName===username);
    if(userToKick[0].kickable) userToKick[0].kick(reason ? reason : "Reason wasn't defined");
    else return;
    }catch(err){console.log(err.message);}
}

