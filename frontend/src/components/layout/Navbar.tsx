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
import { ViewType, setViewType } from "../../store/filterSlice";
import { fetchItems } from "@/store/itemsSlice";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { viewType } = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleShopClick = () => {
    dispatch(setViewType(ViewType.BUY));
    dispatch(fetchItems());
    router.push("/");
  };

  const handleListingsClick = () => {
    dispatch(setViewType(ViewType.SELL));
    dispatch(fetchItems());
    router.push("/");
  };

  return (
    <nav
      className="navbar is-white"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand p-0">
          <Link href={"/"} className={`navbar-item ${styles.navbarBrand}`}>
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
                  <button
                    className={`button ${
                      viewType === ViewType.BUY ? "is-primary" : ""
                    }`}
                    onClick={handleShopClick}
                  >
                    <span>Shop</span>
                  </button>
                  <button
                    className={`button ${
                      viewType === ViewType.SELL ? "is-primary" : ""
                    }`}
                    onClick={handleListingsClick}
                  >
                    <span>My Listings</span>
                  </button>
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
