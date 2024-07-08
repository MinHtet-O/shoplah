"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import styles from "@/app/page.module.css";
import logo from "../../../public/logo-icon.png";
import { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import { AppDispatch } from "../../store/store";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
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
                        onClick={onRegisterClick}
                      >
                        Sign up
                      </a>
                      <a className="button is-light" onClick={onLoginClick}>
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
    </>
  );
};

export default Navbar;
