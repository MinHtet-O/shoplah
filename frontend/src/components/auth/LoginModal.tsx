import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";

interface LoginModalProps {
  isActive: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isActive,
  onClose,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title is-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  className={`input ${error?.errors?.email ? "is-danger" : ""}`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error?.errors?.email && (
                <p className="help is-danger">{error.errors.email[0]}</p>
              )}
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  className={`input ${
                    error?.errors?.password ? "is-danger" : ""
                  }`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error?.errors?.password && (
                <p className="help is-danger">{error.errors.password[0]}</p>
              )}
            </div>
            {error && !error.errors && (
              <div className="notification is-danger is-light">
                <p>{error.message}</p>
              </div>
            )}
            <div className="field">
              <div className="control">
                <button
                  className={`button is-primary ${
                    isLoading ? "is-loading" : ""
                  }`}
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
          <p className="mt-3">
            New to ShopLah? <a onClick={onSwitchToRegister}>Register here</a>
          </p>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default LoginModal;
