import React from "react";
import HomeComponent from "../components/HomeComponent";

export default function Home({ currentUser }) {
  return <HomeComponent currentUser={currentUser} />;
}
