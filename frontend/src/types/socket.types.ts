import { Session } from "next-auth";

export interface socketUser {
  userId: string;
  socketId: string;
  role:string;
  profile: Session["user"];
}
