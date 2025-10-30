import React, { useEffect, useRef } from "react";

// Definición de la interfaz para las props del componente
interface IVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
}

// Componente funcional
const VideoContainer = ({ stream, isLocalStream, isOnCall }: IVideoContainer) => {
  // Referencia para acceder al elemento <video> en el DOM
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hook para enlazar el MediaStream al elemento de video
  useEffect(() => {
    // Solo ejecuta si la referencia al elemento <video> y el stream existen
    if (videoRef.current && stream) {
      // Asigna el MediaStream al elemento de video para que comience a reproducirse
      videoRef.current.srcObject = stream;
    }
  }, [stream]); // Se ejecuta cada vez que 'stream' cambia

  return (
  <video 
    className={`rounded border ${
      isLocalStream && isOnCall 
        ? "w-[200px] h-auto absolute border-blue-500 border-2"
        : "w-[800px]"
    }`}
    ref={videoRef} 
    autoPlay 
    playsInline 
    muted={isLocalStream} 
  />
);
};

export default VideoContainer;