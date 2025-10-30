import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
 
const app = express();
const server = http.createServer(app);
 
const io = new Server(server,{
    cors:{
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials:true
    }
});

const userSocketMap = {};

function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

io.on("connection", (socket) =>{
    console.log("**********A user connected*******");
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    //emit
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () =>{
        console.log("Usuario desconectado ", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})


export { io, server, app, getReceiverSocketId}