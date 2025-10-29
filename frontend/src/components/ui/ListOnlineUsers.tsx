import { usesocket } from "@/context/SoketContext";
import { useSession } from "next-auth/react";

const ListOnlineUsers = () => {
  const { data } = useSession();
  const { onlineUsers,handleCall } = usesocket();
  console.log("onlineUsersLIst:", onlineUsers);
  return (
    <div
      className="flex border-b border-b-primary/10 w-full
items-center pb-2"
    >
      {onlineUsers &&
        onlineUsers.map((onlineUser) => {
          if (onlineUser.profile.user.id === data?.user.id) return null;
          return (
            <div
              key={onlineUser.socketId}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={()=>handleCall(onlineUser)}
            >
              <div className="text-sm">
                {onlineUser.profile.user.name?.split(" ")[0]}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ListOnlineUsers;
