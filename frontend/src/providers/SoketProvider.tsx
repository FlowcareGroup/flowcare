"use client"

import { SocketContextProvider } from "@/context/SoketContext";




const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketContextProvider>
      {children}
    </SocketContextProvider>
  );
};

export  default SocketProvider ;