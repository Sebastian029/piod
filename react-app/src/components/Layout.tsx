import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import "./Layout.css";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
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
            <Link
              to="/questionnaire"
              className={`nav-link${isActive("/questionnaire") ? " active" : ""}`}
            >
              <span className="hidden-sm">Questionnaire</span>
              <span className="visible-sm">Survey</span>
            </Link>
            <Link
              to="/meal-plan"
              className={`nav-link${isActive("/meal-plan") ? " active" : ""}`}
            >
              <span className="hidden-sm">Meal Plan</span>
              <span className="visible-sm">Plan</span>
            </Link>
            <Link
              to="/shopping-list"
              className={`nav-link${isActive("/shopping-list") ? " active" : ""}`}
            >
              <span className="hidden-sm">Shopping List</span>
              <span className="visible-sm">Shop</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

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
