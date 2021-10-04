const express=require("express");
const app=express();
const cors=require('cors');
const mongoose = require("mongoose");
const bcrypt=require('bcrypt');
const session=require("express-session");
const mongoDBStore=require("connect-mongodb-session")(session);
require("dotenv").config();
const User=require("./schemas/User");

/**
 * SOCKET PORTION OF SERVER
 */
const httpServer = require('http').createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});


//connect to db before everything
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log("database connected"))
.catch(err=>console.log(err));



const mongoStore=new mongoDBStore({
    uri:process.env.DATABASE_URI,
    collection:"sessions",
})

//session config
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    cookie:{
        maxAge:1000*60 * 28800,//8 hours
        httpOnly:true,
        secure:true,
    },
    
    saveUninitialized:false,
    store:mongoStore,
}))


app.use(cors());
//cannot receive json in response body w/o this
app.use(express.json());

app.post('/register',async (req,res)=>{
try{
const {email,name,password}=req.body;
const hashedPw=await bcrypt.hash(password,12);
const registeredUser=new User({email,name,password:hashedPw});
await registeredUser.save();
if(registeredUser){
req.session.user_id=registeredUser._id;
const foundSession=await mongoose.connection.db.collection("sessions").findOne({'session.user_id':foundUser._id});
res.send({message:"User registered successfully",sessionID:foundSession._id});
}
}catch(err){
console.log(err);
res.send({message:"User registration failed"});
}
});

app.post('/login',async(req,res)=>{
try{
const {name,password}=req.body;
const foundUser=await User.findOne({name});
if(foundUser){
    const validatedPw=await bcrypt.compare(password,foundUser.password);
    req.session.user_id=foundUser._id;
    const foundSession=await mongoose.connection.db.collection("sessions").findOne({'session.user_id':foundUser._id});
    if(validatedPw){
        res.send({message:"Login successful",sessionID: foundSession._id});
    }else{
        res.send({message:"Username or password you entered is incorrect"});
    }
}

}catch(err){
res.send({message:"User validation failed"});
}

})

app.post('/logout',async (req,res)=>{
try{
    const{id}=req.body;
    const removedSession=await mongoose.connection.db.collection("sessions").findOneAndDelete({_id:id});
    if(removedSession){res.send({message:"User successfully logged out!"});}
    else{res.send({message:"Session invalid!"});}
}catch(err){
    console.log(err);
}

});

/*request send everytime user visits websites
if their last session is still active,go to website,
if not send response back to delete last session and make them log in*/

app.get('/session',async(req,res)=>{
    const {lastSession}=req.query;
    try{
    const foundSession=await mongoose.connection.db.collection("sessions").findOne({_id:lastSession});
    if(foundSession){
    const{_id}=foundSession;
    res.send({message:"Session found",sessionID:_id});
    }else{
    console.log("Session wasn't found");
    res.send({message:"Session wasn't found"});
    }
    }catch(err){
    console.log(err);
    }
})


app.post('/member',async (req,res)=>{
try{
    const {id}=req.body;
    const foundSession=await mongoose.connection.db.collection("sessions").findOne({_id:id});
    const {user_id}=foundSession.session;

if(mongoose.isValidObjectId(user_id) && user_id){
    const requestID=mongoose.Types.ObjectId(user_id);
    const foundUser=await User.findById(requestID,{_id:0,password:0});

    res.send({message:"Member found!",user:foundUser});
}
else{
    res.send({message:"Member not found or session invalid"});
}
}catch(err){
console.log(err);
}
});

app.post('/balance',async(req,res)=>{
  //expect sessionID,
  //lookup user so that only logged in users can change their balance
  //adjust balance
  const {id,balance}=req.body;
  try{
    const foundSession=await mongoose.connection.db.collection("sessions").findOne({_id:id});
    if(foundSession && balance){
      const requestID=foundSession.session.user_id;
      const requestedPlayer=await User.findById(requestID);
      requestedPlayer.balance=balance;
      requestedPlayer.save();
      res.send({message:"Balance updated successfully"});
    }else{
      res.send({message:"Unauthorized to update balance"});
    }
  }catch(err){
    console.log(err);
  }

})




app.listen(3001,()=>{console.log('Web Server ~ 3001')});


/**
 * SOCKET PORTION OF SERVER
 */

io.on("connection", (socket) => {
  socket.emit('message', {
    author: {
      name: 'System',
      photoURL: ''
    },
    message: "Welcome to Chat!"
  });

  socket.on('message', (data) => {
    socket.broadcast.emit('message', {
      author: data.author,
      message: data.message
    });
  });

  socket.on('bet', (data) => {
    Roulette.addBet(data);
    socket.emit('roulette.allBets', Roulette.currentBets);
  })

});

httpServer.listen(3002, () => console.log('Websocket Server ~ 3002'));

class Roulette {
  static timer = 15;
  static cooldown = this.timer + 10;
  static currentBets = [];

  //timer with cooldown so that all the animations and such can play out
  static startRound = () => {
    setInterval(() => {
      this.timer--;
      if (this.timer >= 0 && this.timer < 15) {
        try {
          io.sockets.emit('rouletteTimer', this.timer);
        } catch (err) {
          console.log(err);
        }
      }
      //TEMP, CLEAR ONLY ON THE END OF THE TURN
      if (this.timer === 16) {
        this.clearBets();
      }
      //if timer hits 0,adjust timer,clear all current bets,establish winning combination
      if (this.timer === 0) {
        this.timer = this.cooldown;
        this.generateWinningRound();
      }
    }, 1000);

    setInterval(() => {
      if (this.timer >= 0 && this.timer < 15) {
        try {
          io.sockets.emit('roulette.allBets', Roulette.currentBets);
        } catch (err) {
          console.log(err);
        }
      }
    }, 100);

  }

  static addBet(betData) {
    this.currentBets.push(betData);
  }
  static clearBets() {
    this.currentBets = [];
    io.sockets.emit('roulette.allBets', this.currentBets);
  }

  static generateWinningRound(){
    const numbers=[];
    for(let i=0;i<14;i++)numbers.push(i);
    const winningColor=()=>{
    const rnd=Math.floor(Math.random()*100);
    const rndnum=Math.floor(Math.random()*15)+1;
    if(rnd<=45){return {number:rndnum,color:"red"}};
    if(rnd>45 && rnd<55){return {number:0,color:"green"}};
    if(rnd>=55){return {number:rndnum,color:"black"}};
    }
    
    console.log(winningColor());
  }

}

Roulette.startRound();
