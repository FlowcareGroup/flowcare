
import { socketUser } from "@/types/socket.types";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react" ;
import { io, Socket } from "socket.io-client";



interface isosocketContext {
onlineUsers: socketUser[] | null ;

}

export const SocketContext = createContext<isosocketContext | null>(null) ;


export const SocketContextProvider = ({children} : {children : React.ReactNode}) => {
  const [socket, setsocket] = useState<Socket | null>(null) ;
  const { data: user, status } = useSession();  
  const [isSocketConnected, setisSocketConnected] = useState(false) ;
  const [onlineUsers, setOnlineUsers] = useState<socketUser[] | null>(null) ;
   console.log("isConnected:",isSocketConnected) ;
 console.log("socket_data:",user,status) ;
console.log("onlineUsers:", onlineUsers) ;
      console.log("User changed:", process.env.NEXT_PUBLIC_SOCKET_URL) ;

  //inicializaciones y funciones para manejar el socket
  useEffect(() => {
    if (status === "loading") {
        return; 
     }
    const newsocket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    setsocket(newsocket) ;
    return () => {
      newsocket.disconnect() ;
    };
  }, [status]) ;

  useEffect(() => {
     if (!socket) return ;
    if (socket.connected){
        onConnect() ;
    }

    function onConnect() {
        setisSocketConnected(true) ;
        console.log("socket conectado") ;    
    }

    function onDisconnect() {
        setisSocketConnected(false) ;
        console.log("socket desconectado") ;    
    }

    socket.on("connect", onConnect) ;
    socket.on("disconnect", onDisconnect) ;

    return () => {
        socket.off("connect", onConnect) ;
        socket.off("disconnect", onDisconnect) ;
    }
    
    }, [socket]) ;

    // set oline user

  useEffect(() => {
  if (!socket || !isSocketConnected) return

  socket.emit('addNewUsers', user)
  socket.on('getUsers', (res) => {
    setOnlineUsers(res)
  })

  return () => {
    socket.off('getUsers', (res) => {
      setOnlineUsers(res)
    })
  }
}, [socket, isSocketConnected, user])

    return (
    <SocketContext.Provider value={{onlineUsers}}>
    {children}
  </SocketContext.Provider>
  );
}


export const usesocket = () => {
    const context =  useContext(SocketContext) ;
    if (!context) {
        throw new Error("usesocket must be used within a SocketProvider") ;
    }
    return context ;
}