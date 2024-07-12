// File: components/layout/AppLayout.tsx

"use client";

import React, { useState, ReactNode } from "react";
import Head from "next/head";
import { useDispatch } from "react-redux";
import { clearAuthError } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isLoginModalActive, setIsLoginModalActive] = useState(false);
  const [isRegisterModalActive, setIsRegisterModalActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseLoginModal = () => {
    setIsLoginModalActive(false);
    setSuccessMessage("");
    dispatch(clearAuthError());
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalActive(false);
    dispatch(clearAuthError());
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalActive(false);
    setIsRegisterModalActive(true);
    setSuccessMessage("");
    dispatch(clearAuthError());
  };

  const handleSwitchToLogin = (message = "") => {
    setIsRegisterModalActive(false);
    setIsLoginModalActive(true);
    setSuccessMessage(message);
    dispatch(clearAuthError());
  };

  return (
    <div>
      <Head>
        <title>ShopLah - Your Premier Online Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          defer
          src="https://use.fontawesome.com/releases/v5.14.0/js/all.js"
        ></script>
      </Head>
      <Navbar
        onLoginClick={() => setIsLoginModalActive(true)}
        onRegisterClick={() => setIsRegisterModalActive(true)}
      />
      <main>
        <div style={{ marginTop: "3rem" }}>{children}</div>
      </main>
      <Footer />
      <LoginModal
        isActive={isLoginModalActive}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
        successMessage={successMessage}
      />
      <RegisterModal
        isActive={isRegisterModalActive}
        onClose={handleCloseRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default AppLayout;
