"use client";
import "./globals.css";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import { store } from "../app/redux/store/store";
import { Nunito } from "@next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";
import { useEffect } from "react";

const nunito = Nunito({
  subsets: ["latin"],
  weights: ["400", "700"],
});

export default function RootLayout({ children }) {
    useEffect(() => {
      const socket = io();

      return () => {
        socket.disconnect();
      };
    }, []);
  return (
    <Provider store={store}>
      <html lang="en" className={nunito.className}>
        <body>
          {children}
          <ToastContainer />
        </body>
      </html>
    </Provider>
  );
}
