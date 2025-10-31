import { Session } from "next-auth";
import Peer from "simple-peer";

export interface socketUser {
  userId: string;
  socketId: string;
  role:string;
  profile: Session;
}

export interface OngoinCall {
 participants: Participants;
 isRinging: boolean;
}


export interface Participants {
 caller: socketUser;
 receiver: socketUser;
}

export interface PeerData{
  peerConnection: Peer.Instance;
  stream: MediaStream | undefined;
  participantUser: socketUser;
}