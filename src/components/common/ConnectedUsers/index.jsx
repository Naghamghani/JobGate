import React, { useEffect, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { getConnections } from "../../../api/FirestoreAPI";

export default function ConnectedUsers({ user, getCurrentUser, currentUser }) {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    getConnections(currentUser.id, user.id, setIsConnected);
  }, [currentUser.id, user.id]);
  return isConnected ? (
    <></>
  ) : (
    <div className="w-56 h-72 border border-gray-200 rounded-lg p-3 flex flex-col items-center relative hover:shadow-md transition-shadow">
      <div className="w-full h-16 bg-[#a0b4b7] absolute top-0 rounded-t-lg -z-10"></div>
      <img
        src={user.imageLink}
        className="w-24 h-24 rounded-full object-cover mt-4 border-2 border-white bg-white"
        alt="user"
      />
      <p className="font-semibold mt-3 text-center text-gray-900 line-clamp-1">{user.name}</p>
      <p className="text-sm text-gray-500 text-center line-clamp-2 px-2 mt-1 min-h-[40px]">{user.headline}</p>

      <button
        onClick={() => getCurrentUser(user.id)}
        className="mt-auto mb-2 w-full flex items-center justify-center gap-2 rounded-full border border-[#0a66c2] text-[#0a66c2] font-semibold py-1 hover:bg-[#ebf4fd] hover:border-2 transition-all"
      >
        <AiOutlineUsergroupAdd size={20} />
        Connect
      </button>
    </div>
  );
}
