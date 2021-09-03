const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    balance:{
        type:Number,
        default:0,
    }
},{timestamps:true});



module.exports=mongoose.model("User",userSchema);