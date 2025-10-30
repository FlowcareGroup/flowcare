"use client";
import { usesocket } from "@/context/SoketContext";
import { MdCall, MdCallEnd } from "react-icons/md";

const CallNotification = () => {    
const {ongoingCall,handleJoinCall,handleHangup} = usesocket();

if (!ongoingCall?.isRinging) return;
return (
  <div className="absolute bg-slate-500 bg-opacity-70 w-screen h-screen top-0 left-0 flex items-center justify-center">
    <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
      
      <div className="flex flex-col items-center">
       
        
        {/* Muestra el primer nombre del llamante */}
        <h3>{ongoingCall.participants.caller.profile.user.name?.split(' ')[0]}</h3>
      </div>
      
      <p className="text-sm mb-2">Incoming Call</p>
      
      {/* Contenedor de los botones de aceptar y rechazar */}
      <div className="flex gap-3">
        
        {/* Botón para Aceptar (verde) */}
        <button  onClick={()=> handleJoinCall(ongoingCall)} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
          <MdCall size={24} />
        </button>
        
        {/* Botón para Rechazar (rojo) */}
        <button    onClick={() =>
            handleHangup({
              ongoingCall: ongoingCall ? ongoingCall : undefined,isEmitedHangup: true,
            })
          } className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white">
          <MdCallEnd size={24} />
        </button>
        
      </div>
    </div>
  </div>
);


}

export default CallNotification;