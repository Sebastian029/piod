import React, {useState} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";
import { UtensilsCrossed } from "lucide-react";
import "./Layout.css";
import { AuthModal } from "./Modal/AuthModal";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const openLogin = () => setShowLoginModal(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  const goToQuestionnaire = () => {
    if (!user) {
      openLogin();
      return;
    }
    navigate("/questionnaire");
  };

  const goToMealPlan = () => {
    if (!user) {
      openLogin();
      return;
    }
    navigate("/mealplan", { state: { shouldRegenerate: false } });
  };

  const goToMealHistory = () => {
    if (!user) {
      openLogin();
      return;
    }
    navigate("/history", { state: { shouldRegenerate: false } });
  };


  return (
    <div className="layout-root">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand-link">
            <UtensilsCrossed className="icon" />
            <span className="hidden-sm">MealPlan</span>
          </Link>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link${isActive("/") ? " active" : ""}`}
            >
              Home
            </Link>
            <button
              type="button"
              onClick={goToQuestionnaire}
              className={`nav-link ${
                isActive("/questionnaire") ? "active" : ""
              }`}
            >
              <span className="hidden-sm">Questionnaire</span>
              <span className="visible-sm">Survey</span>
            </button>
            <button
              type="button"
              onClick={goToMealPlan}
              className={`nav-link ${
                isActive("/mealplan") ? "active" : ""
              }`}
            >
              <span className="hidden-sm">Meal Plan</span>
              <span className="visible-sm">Plan</span>
            </button>
            <button
              type="button"
              onClick={goToMealHistory}
              className={`nav-link ${
                isActive("/history") ? "active" : ""
              }`}
            >
              <span className="hidden-sm">History</span>
              <span className="visible-sm">History</span>
            </button>
            {/* <Link
              to="/shopping-list"
              className={`nav-link${isActive("/shopping-list") ? " active" : ""}`}
            >
              <span className="hidden-sm">Shopping List</span>
              <span className="visible-sm">Shop</span>
            </Link> */}
            {!user ? (
              <button
                className="nav-link"
                onClick={openLogin}
              >
                Login
              </button>
            ) : (
              <button
                className="nav-link"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      <AuthModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <p>
            © 2024 MealPlan. Automatically generate personalized meal plans with
            our genetic algorithm.
          </p>
        </div>
      </footer>
    </div>
  );
};
