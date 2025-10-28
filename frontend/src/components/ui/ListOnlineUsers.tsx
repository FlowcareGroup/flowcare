import { usesocket } from "@/context/SoketContext";
import { useSession } from "next-auth/react";


const ListOnlineUsers = () => {
  const {} = useSession()
  const { onlineUsers } = usesocket()
console.log("onlineUsersLIst:", onlineUsers) ;
  return (
    <div>
      {onlineUsers && onlineUsers.map((onlineUser) => {
        return <div key={onlineUser.socketId}>
          <div>{onlineUser.profile.user.name?.split(' ')[0]}</div>
        </div>
      })}
    </div>
  );
};

export default ListOnlineUsers;