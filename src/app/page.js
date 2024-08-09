"use client";
import React, { useEffect } from "react";
import { io } from "socket.io-client";
import Page from "../app/homepage/page";

const Home = () => {
  useEffect(() => {
    const socket = io();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Page />
    </div>
  );
};

export default Home;
