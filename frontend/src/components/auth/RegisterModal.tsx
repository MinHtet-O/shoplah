import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";

interface RegisterModalProps {
  isActive: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isActive,
  onClose,
  onSwitchToLogin,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isActive) {
      // Reset form state when modal is closed
      setUsername("");
      setEmail("");
      setPassword("");
      dispatch(clearAuthError());
    }
  }, [isActive, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ username, email, password }));
  };

  const handleClose = () => {
    onClose();
    setUsername("");
    setEmail("");
    setPassword("");
    dispatch(clearAuthError());
  };

  return (
    <div className={`modal ${isActive ? "is-active" : ""}`}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title is-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className={`input ${
                    error?.errors?.username ? "is-danger" : ""
                  }`}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {error?.errors?.username && (
                <p className="help is-danger">{error.errors.username[0]}</p>
              )}
            </div>
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
                  Register
                </button>
              </div>
            </div>
          </form>
          <p className="mt-3">
            Already have an account? <a onClick={onSwitchToLogin}>Login here</a>
          </p>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={handleClose}
      ></button>
    </div>
  );
};

export default RegisterModal;
