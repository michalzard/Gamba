const express=require("express");
const app=express();
const cors=require('cors');
const mongoose = require("mongoose");
const bcrypt=require('bcrypt');
const session=require("express-session");
const mongoDBStore=require("connect-mongodb-session")(session);
require("dotenv").config();
const User=require("./schemas/User");

//connect to db before everything
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log("database connected"))
.catch(err=>console.log(err))

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
const {email,name,password}=req.body;
try{
const hashedPw=await bcrypt.hash(password,12);
const registeredUser=new User({email,name,password:hashedPw});
await registeredUser.save();
if(registeredUser){
req.session.user_id=registeredUser._id;
res.send({message:"User registered successfully",sessionID:req.session.id});
}
}catch(err){
console.log(err);
res.send({message:"User registration failed"});
}
});

app.post('/login',async(req,res)=>{
const {name,password}=req.body;
console.log(req.body);
try{
const foundUser=await User.findOne({name});
if(foundUser){
    const validatedPw=await bcrypt.compare(password,foundUser.password);
  
    if(validatedPw){
        req.session.user_id=foundUser._id;
        res.send({message:"Login successful",sessionID:req.session.id});
    }else{
        res.send({message:"Username or password you entered is incorrect"});
    }
}

}catch(err){
res.send({message:"User validation failed"});
}

})

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
        res.send({message:"Session wasn't found"});
    }
    }catch(err){
        console.log(err);
    }
})


app.listen(3001,()=>{console.log('Auth Server ~3001')});
