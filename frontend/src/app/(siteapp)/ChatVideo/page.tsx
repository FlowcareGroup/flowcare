"use client";


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClinicPage() {
  const router = useRouter();
  const { data: session, status, } = useSession();
   if (status === "loading" || !session) return <p>Cargando o no autenticado</p>;
  const backendToken = session.accessToken;

 

  return (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Página de Chat y Video</h1>
        <button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Salir</button>
        <p>Bienvenido a la página de Chat y Video.</p>


    </div>
  );
}
