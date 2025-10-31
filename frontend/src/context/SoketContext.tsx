import {
  OngoinCall,
  Participants,
  PeerData,
  socketUser,
} from "@/types/socket.types";
import { useSession } from "next-auth/react";
import Peer, { SignalData } from "simple-peer";
import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface isosocketContext {
  onlineUsers: socketUser[] | null;
  localStream: MediaStream | null;
  ongoingCall: OngoinCall | null;
  handleCall: (user: socketUser) => void;
  handleJoinCall: (ongoingCall: OngoinCall) => void;
  handleHangup: (data: { ongoingCall?: OngoinCall ; isEmitedHangup?: boolean }) => void; 
  peers: PeerData | null;
  isOnCallEnded: boolean;
}

export const SocketContext = createContext<isosocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setsocket] = useState<Socket | null>(null);
  const { data: user, status } = useSession();
  const [isSocketConnected, setisSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<socketUser[] | null>(null);
  const [ongoingCall, setOngoingCall] = useState<OngoinCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerData | null>(null);
  const [isOnCallEnded, setIsOnCallEnded] = useState(false);

  console.log("isConnected:", isSocketConnected);
  //  console.log("socket_data:",user,status) ;
  // console.log("onlineUsers:", onlineUsers) ;
  //       console.log("User changed:", process.env.NEXT_PUBLIC_SOCKET_URL) ;
  const getMediaStream = useCallback(
    async (faceMode?: string) => {
      if (localStream) {
        return localStream;
      }
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        });
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.log("Error accessing media devices:", error);
        throw error;
      }
    },
    [localStream]
  );
  const currentSocketUser = onlineUsers?.find(
    (onlineUser) => onlineUser.userId === user?.user.id
  );

  const handleCall = useCallback(async (user: socketUser) => {
      setIsOnCallEnded(false);

      if (!currentSocketUser || !socket) return;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("No se pudo obtener el stream de medios");
        return;
      }

      const participants = { caller: currentSocketUser, receiver: user };
      setOngoingCall({
        participants,
        isRinging: false,
      });
      socket.emit("call", participants);
    },
    [socket, currentSocketUser, ongoingCall]
  );

  const handleHangup = useCallback((data: { ongoingCall?: OngoinCall | null; isEmitHangup?: boolean }) => {
      if (socket && user && data?.ongoingCall && data?.isEmitHangup) {
        socket.emit("hangup", {
          ongoingCall: data.ongoingCall,
          userHangingUpId: user.user.id,
        });
      }

      setOngoingCall(null);
      setPeers(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      setIsOnCallEnded(true);
    },
    [socket, user, localStream]
  );

  const createPeer = useCallback(
    async (stream: MediaStream, initiador: boolean) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];

      const peer = new Peer({
        stream,
        initiator: initiador,
        trickle: true,
        config: { iceServers },
      });
      peer.on("stream", (stream) => {
        setPeers((prevPeers) => {
          if (prevPeers) {
            return { ...prevPeers, stream };
          }
          return prevPeers;
        });
        peer.on("error", console.error);
        peer.on("close", () => handleHangup({}));

        const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
        rtcPeerConnection.oniceconnectionstatechange = () => {
          if (
            rtcPeerConnection.iceConnectionState === "disconnected" ||
            rtcPeerConnection.iceConnectionState === "failed"
          ) {
            handleHangup({});
          }
        };
      });

      return peer;
    },
    [ongoingCall, setPeers]
  );

  const completePeerConnection = useCallback(
    async (connectionData: {
      sdp: SignalData;
      ongoingCall: OngoinCall;
      isCaller: boolean;
    }) => {
      if (!localStream) {
        console.log("No se pudo obtener el stream de medios");
        return;
      }

      if (peers) {
        peers.peerConnection?.signal(connectionData.sdp);
        return;
      }

      const newpeer = await createPeer(localStream, true);

      setPeers({
        peerConnection: newpeer,
        participantUser: connectionData.ongoingCall.participants.receiver,
        stream: undefined,
      });

      newpeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: true,
          });
        }
      });
    },
    [localStream, peers, createPeer, ongoingCall, socket]
  );

  const handleJoinCall = useCallback(async (ongoingCall: OngoinCall) => {
      
      setIsOnCallEnded(false);

      setOngoingCall((prev) => {
        if (prev) {
          return { ...prev, isRinging: false };
        }
        return prev;
      });

      const stream = await getMediaStream();
      if (!stream) {
        console.log("No se pudo obtener el stream de medios");
        return;
      }

      const newpeer = await createPeer(stream, true);

      setPeers({
        peerConnection: newpeer,
        participantUser: ongoingCall.participants.caller,
        stream: undefined,
      });

      newpeer.on("signal", async (data: SignalData) => {
        if (socket) {
          // emit off
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: false,
          });
        }
      });
    },
    [socket, currentSocketUser]
  );

  const onIncomingCall = useCallback(
    (participants: Participants) => {
      setOngoingCall({
        participants,
        isRinging: true,
      });
    },
    [socket, user, ongoingCall]
  );

  //inicializaciones y funciones para manejar el socket
  useEffect(() => {
    if (status === "loading") {
      return;
    }
    const newsocket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    setsocket(newsocket);
    return () => {
      newsocket.disconnect();
    };
  }, [status]);

  useEffect(() => {
    if (!socket) return;
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setisSocketConnected(true);
      console.log("socket conectado");
    }

    function onDisconnect() {
      setisSocketConnected(false);
      console.log("socket desconectado");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  // set oline user

  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.emit("addNewUsers", user);
    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isSocketConnected, user]);

  //llamar

  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    socket.on("incomingCall", onIncomingCall);
    socket.on("webrtcSignal", completePeerConnection);
     socket.on("onHangup", handleHangup);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
        socket.off("onHangup", handleHangup);
    };
  }, [socket, isSocketConnected, user, onIncomingCall, completePeerConnection]);

      useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>

        if (isOnCallEnded) {
          timeout = setTimeout(() => {
            setIsOnCallEnded(false)
          }, 2000)
        }

        return () => clearTimeout(timeout)
      }, [isOnCallEnded])

      
  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        handleCall,
        ongoingCall,
        localStream,
        handleJoinCall,
        handleHangup,
        peers,
        isOnCallEnded,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const usesocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("usesocket must be used within a SocketProvider");
  }
  return context;
};
