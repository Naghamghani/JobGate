import React, { useEffect, useState } from "react";
import ConnectionsComponent from "../components/ConnectionsComponent";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";

export default function Connections({ currentUser }) {
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
  return loading ? (
    <Loader />
  ) : (
    <ConnectionsComponent currentUser={currentUser} />
  );
}
