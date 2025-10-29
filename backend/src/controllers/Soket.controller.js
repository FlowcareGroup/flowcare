import { io } from "../../index.js";  
import onCall from "../soket_event/onCall.js";
export default function socketHandler() {
  let onlineUsers = [];

  io.on("connection", async (socket) => {
    console.log("New client connected", socket.id);
    //revisar para que me de el id y el rol si no quitarlo 
    socket.on("addNewUsers", (user) => {
      user &&
        !onlineUsers.some((u) => u?.userId === user.user.id) &&
        onlineUsers.push({
          userId: user.user.id,
          socketId: socket.id,
          role: user.user.role,
          profile: user,
        });
        console.log("onlineUsers:", onlineUsers) ;
      io.emit("getUsers", onlineUsers);
    });


    
    // llamar evento
    socket.on("call", onCall);

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      // send active users
      io.emit("getUsers", onlineUsers);
    });
  });
}
