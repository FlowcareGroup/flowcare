"use client"; // 👈 importante si estás usando Next.js con App Router (carpeta /app)

import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { User } from "../../../../types/auth.types";
import { io } from "socket.io-client";
import { set } from "zod";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  handlerSelectUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  // ✅ Tipamos el estado correctamente
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const socketRef = useRef(null);

  const handlerSelectUser = (user: User) => {
    setSelectedUser(user);
  }


  return (
    <UserContext.Provider value={{ user, setUser, handlerSelectUser, selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook personalizado para acceder al contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};