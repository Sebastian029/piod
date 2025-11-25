import { useAuth } from "./AuthContext";
import { useState } from "react";
import { AuthModal } from "../Modal/AuthModal";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(!user);

  if (!user) {
    return (
        <>
            {children}
            
            <AuthModal open={showLogin} onClose={() => setShowLogin(false)}/>
        </>


    );
  }

  return <>{children}</>;
}
