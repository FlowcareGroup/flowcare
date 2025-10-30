"use client";

import { usesocket } from "@/context/SoketContext";
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const VideoCall = () => {
  const { localStream, ongoingCall, peers, handleHangup,isOnCallEnded } = usesocket();
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

  const isOnCall = localStream && peers && ongoingCall ? true : false;

  if (isOnCallEnded) return <div className="mt-5 text-rose-500 text-center">
    Call Ended
  </div>;


  if(!localStream && !peers) return null


  return (
    <div>
      {/* Contenedor del video local (solo se muestra si localStream existe) */}
      <div className="mt-4 relative">
        {localStream && (
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={isOnCall}
          />
        )}
        {peers && peers.stream && (
          <VideoContainer
            stream={peers.stream}
            isLocalStream={false}
            isOnCall={isOnCall}
          />
        )}
      </div>

      {/* Controles de la llamada */}
      <div className="mt-8 flex item-center justify-center bg-slate-400">
        {/* Botón para Microfono */}
        <button onClick={toggleMic}>
          {/* Muestra un ícono si el micrófono está encendido */}
          {isMicOn && <MdMic size={28} />}
          {/* Muestra otro ícono si el micrófono está apagado */}
          {!isMicOn && <MdMicOff size={28} />}
        </button>

        {/* Botón para Terminar la Llamada */}
        <button
          className="px-4 py-2 bg-rose-500 text-white rounded mx-4"
          onClick={() =>
            handleHangup({
              ongoingCall: ongoingCall ? ongoingCall : undefined,isEmitedHangup: true,
            })
          }
        >
          End Call
        </button>

        {/* Botón para Cámara */}
        <button onClick={toggleCamera}>
          {/* Muestra un ícono si el video está encendido */}
          {isVidOn && <MdVideocam size={28} />}
          {/* Muestra otro ícono si el video está apagado */}
          {!isVidOn && <MdVideocamOff size={28} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
