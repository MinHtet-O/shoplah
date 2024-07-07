import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "@/app/page.module.css";
import logo from "../../../public/logo-icon.png";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import { RootState } from "../../store/store";
import { logout, clearAuthError } from "../../store/authSlice";
import { AppDispatch } from "../../store/store";

export default function Navbar() {
  const [isLoginModalActive, setIsLoginModalActive] = useState(false);
  const [isRegisterModalActive, setIsRegisterModalActive] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalActive(false);
    dispatch(clearAuthError());
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalActive(false);
    dispatch(clearAuthError());
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalActive(false);
    setIsRegisterModalActive(true);
    dispatch(clearAuthError());
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalActive(false);
    setIsLoginModalActive(true);
    dispatch(clearAuthError());
  };

  return (
    <>
      <nav
        className="navbar is-white"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand p-0">
            <a className={`navbar-item ${styles.navbarBrand}`} href="/">
              <Image height={35} src={logo} alt="ShopLah Logo" />
              <span className={`has-text-primary ${styles.navbarText}`}>
                ShopLah
              </span>
            </a>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <a className="navbar-item">Explore</a>
              <a className="navbar-item">Sell</a>
              <a className="navbar-item">About</a>
              <a className="navbar-item">Contact</a>
              <div className="navbar-item">
                <div className="buttons">
                  {!isAuthenticated && (
                    <>
                      <a
                        className="button is-primary"
                        onClick={() => setIsRegisterModalActive(true)}
                      >
                        Sign up
                      </a>
                      <a
                        className="button is-light"
                        onClick={() => setIsLoginModalActive(true)}
                      >
                        Log in
                      </a>
                    </>
                  )}
                  {isAuthenticated && (
                    <a className="button is-light" onClick={handleLogout}>
                      Logout
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <LoginModal
        isActive={isLoginModalActive}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isActive={isRegisterModalActive}
        onClose={handleCloseRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}
