"use client";

import { usesocket } from "@/context/SoketContext";
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const VideoCall = () => {
  const { localStream } = usesocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      setIsVideoOn(videoTrack.enabled);
      const audioTrack = localStream.getAudioTracks()[0];
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  return (
    <div>
      {/* Contenedor del video local (solo se muestra si localStream existe) */}
      <div>
        {localStream && (
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={false}
          />
        )}
      </div>

      {/* Controles de la llamada */}
      <div className="mt-8 flex item-center justify-center bg-slate-400">
        {/* Botón para Microfono */}
        <button onClick={toggleMic}>
          {/* Muestra un ícono si el micrófono está encendido */}
          {isMicOn && <MdMicOff size={28} />}
          {/* Muestra otro ícono si el micrófono está apagado */}
          {!isMicOn && <MdMic size={28} />}
        </button>

        {/* Botón para Terminar la Llamada */}
        <button
          className="px-4 py-2 bg-rose-500 text-white rounded mx-4"
          onClick={() => {
            /* Lógica para colgar la llamada */
          }}
        >
          End Call
        </button>

        {/* Botón para Cámara */}
        <button onClick={toggleCamera}>
          {/* Muestra un ícono si el video está encendido */}
          {isVidOn && <MdVideocamOff size={28} />}
          {/* Muestra otro ícono si el video está apagado */}
          {!isVidOn && <MdVideocam size={28} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
