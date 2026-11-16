import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../pages/navbar";
import Footer from "../pages/footer";

export default function Private(props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <header>
        <Navbar />
      </header>
      {props.children}
      <footer>
        <Footer/>
      </footer>
    </>
  );
}

