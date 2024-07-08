"use client";
import Head from "next/head";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Landing from "../components/landing/Landing";
import Home from "@/components/home/Home";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "@/store/authSlice";
import { AppDispatch, RootState } from "@/store/store";

export default function Index() {
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
      <Provider store={store}>
        <AppContent />
      </Provider>
    </div>
  );
}

function AppContent() {
  const [isLoginModalActive, setIsLoginModalActive] = useState(false);
  const [isRegisterModalActive, setIsRegisterModalActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginModalActive(false);
    }
  }, [isAuthenticated]);

  const handleCloseLoginModal = () => {
    setIsLoginModalActive(false);
    setSuccessMessage(""); // Clear success message on close
    dispatch(clearAuthError());
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalActive(false);
    dispatch(clearAuthError());
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalActive(false);
    setIsRegisterModalActive(true);
    setSuccessMessage(""); // Clear success message on switch
    dispatch(clearAuthError());
  };

  const handleSwitchToLogin = (message = "") => {
    setIsRegisterModalActive(false);
    setIsLoginModalActive(true);
    setSuccessMessage(message); // Set success message on switch
    dispatch(clearAuthError());
  };

  return (
    <>
      <Navbar
        onLoginClick={() => setIsLoginModalActive(true)}
        onRegisterClick={() => setIsRegisterModalActive(true)}
      />
      {isAuthenticated ? (
        <Home /> // Display the user home page if the user is authenticated
      ) : (
        <Landing /> // Display the landing page otherwise
      )}
      <Footer />
      <LoginModal
        isActive={isLoginModalActive}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
        successMessage={successMessage} // Pass the success message to the login modal
      />
      <RegisterModal
        isActive={isRegisterModalActive}
        onClose={handleCloseRegisterModal}
        onSwitchToLogin={handleSwitchToLogin} // Pass success message on registration
      />
    </>
  );
}
