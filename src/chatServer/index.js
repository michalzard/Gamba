const httpServer = require('http').createServer();
const io=require("socket.io")(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
    }
});


io.on("connection",(socket)=>{
    console.log(`${socket.id} connected`);
    socket.emit('message',{author:{name:'System',photoURL:''},message:"Welcome to Chat!"});
    
    socket.on('message',(data)=>{
        socket.broadcast.emit('message',{author:data.author,message:data.message});        
    });

});

httpServer.listen(3002,()=>console.log('Chat Server ~3002'));

