import { usesocket } from "@/context/SoketContext";
import { useSession } from "next-auth/react";


const ListOnlineUsers = () => {
  const {} = useSession()
  const { onlineUsers } = usesocket()

  return (
    <div>
      {onlineUsers && onlineUsers.map((onlineUser) => {
        return <div key={onlineUser.userId}>
          <div>{onlineUser.profile.name?.split(' ')[0]}</div>
        </div>
      })}
    </div>
  );
};

export default ListOnlineUsers;