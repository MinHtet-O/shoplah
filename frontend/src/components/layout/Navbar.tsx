"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => {
    return pathname === path ? "is-primary" : "is-light";
  };

  return (
    <nav
      className="navbar is-white"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand p-0">
          <Link
            href={isAuthenticated ? "/explorer" : "/"}
            className={`navbar-item ${styles.navbarBrand}`}
          >
            <Image height={35} src={logo} alt="ShopLah Logo" />
            <span className={`has-text-primary ${styles.navbarText}`}>
              ShopLah
            </span>
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            {isAuthenticated && (
              <div className="navbar-item">
                <div className="buttons">
                  <Link
                    href="/explorer"
                    className={`button ${isActive("/explorer")}`}
                  >
                    <span>Shop</span>
                  </Link>
                  <Link
                    href="/listings"
                    className={`button ${isActive("/listings")}`}
                  >
                    <span>My Listings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {!isAuthenticated && (
                  <>
                    <button
                      className="button is-primary"
                      onClick={onRegisterClick}
                    >
                      Sign up
                    </button>
                    <button className="button is-light" onClick={onLoginClick}>
                      Log in
                    </button>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <Link href="/sell" className="button is-primary is-light">
                      <span className="icon">
                        <i className="fas fa-dollar-sign"></i>
                      </span>
                      <span>Sell</span>
                    </Link>
                    <button className="button is-light" onClick={handleLogout}>
                      <span className="icon">
                        <i className="fas fa-arrow-right-from-bracket"></i>
                      </span>
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
