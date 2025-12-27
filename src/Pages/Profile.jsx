import React, { useEffect, useState } from "react";
import ProfileComponent from "../components/ProfileComponent";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";

export default function Profile({ currentUser }) {
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    let token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, []);
  return loading ? <Loader /> : <ProfileComponent currentUser={currentUser} />;
}
