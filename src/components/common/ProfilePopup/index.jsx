import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutAPI } from "../../../api/AuthAPI";
import { getCurrentUser } from "../../../api/FirestoreAPI";
import Button from "../Button";


export default function ProfilePopup() {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-60 p-4 flex flex-col items-start gap-3">
      <div className="flex flex-col">
        <p className="font-semibold text-base text-gray-900">{currentUser?.name}</p>
        <p className="text-sm text-gray-500">{currentUser?.headline}</p>
      </div>

      <div className="flex flex-col w-full gap-2 mt-2">
        <Button
          title="View Profile"
          onClick={() =>
            navigate("/profile", {
              state: {
                id: currentUser?.id,
              },
            })
          }
        />
        <Button
          title="My Connections"
          onClick={() => navigate("/friends")}
        />
        <Button
          title="Log out"
          onClick={() => {
            LogoutAPI();
            navigate('/login');
          }}
        />
      </div>
    </div>
  );
}
