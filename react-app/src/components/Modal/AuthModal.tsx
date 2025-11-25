import React, { useState } from "react";
import { Modal } from "./Modal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";


interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const {user, login, register } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    if(!user){
        navigate("/");
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {showLogin ? (
        <>
          <LoginForm
            onLogin={async (data) => {
              const ok = await login(data);
              if (ok) onClose();
            }}
          />
          <div style={{ marginTop: "1rem" }}>
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => setShowLogin(false)}>
              Register
            </button>
          </div>
        </>
      ) : (
        <>
          <RegisterForm
            onRegister={async (data) => {
              const ok = await register(data);
              if (ok) setShowLogin(true);
            }}
          />
          <div style={{ marginTop: "1rem" }}>
            Already have an account?{" "}
            <button type="button" onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
