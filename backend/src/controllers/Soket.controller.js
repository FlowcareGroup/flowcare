export default function socketHandler(io) {
  let onlineUsers = [];

  io.on("connection", async (socket) => {
    console.log("New client connected", socket.id);
    //revisar para que me de el id y el rol si no quitarlo 
    socket.on("addNewUsers", (user) => {
      user &&
        !onlineUsers.some((u) => u?.userId === user.id) &&
        onlineUsers.push({
          userId: user.id,
          socketId: socket.id,
          role: user.role,
          profile: user,
        });
        console.log("onlineUsers:", onlineUsers) ;
      io.emit("getUsers", onlineUsers);
    });

    


    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      // send active users
      io.emit("getUsers", onlineUsers);
    });
  });
}
