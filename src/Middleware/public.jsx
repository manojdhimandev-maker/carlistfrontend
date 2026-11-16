import React from "react";
import { Navigate } from "react-router-dom";

export default function Public(props) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/Home"} />;
  }
  return <>{props.children}</>;
}
