import { Layout } from "../../components/Layout";
import { Link } from "react-router-dom";
import {
  Zap, Leaf, BarChart3, Utensils, ArrowRight, CheckCircle2,
} from "lucide-react";
import "./Index.css";

export default function Index() {
  return (
    <Layout>
      <div className="main-container">
        {/* Hero Section */}
        <section className="hero-section">
          <span className="hero-badge">
            Intelligent Meal Planning
          </span>
          <h1 className="hero-title">
            <span className="hero-gradient">Personalized Meal Plans</span>
            <br />
            Powered by Science
          </h1>
          <p className="hero-desc">
            MealPlan uses genetic algorithms to generate optimal meal plans based
            on your preferences, dietary restrictions, and nutritional goals.
            Get perfect macros and variety every single day.
          </p>
          <div className="hero-btn-row">
            <Link to="/questionnaire" className="btn-primary">
              Get Started <ArrowRight className="icon" />
            </Link>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="features-header">
            <h2 className="features-title">Why Choose MealPlan?</h2>
            <p className="features-desc">
              Powered by advanced algorithms to optimize every aspect of your nutrition
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Zap className="icon" style={{color: "#2563eb"}}/></div>
              <h3 className="feature-title">Genetic Algorithm</h3>
              <p className="feature-text">
                Our cutting-edge genetic algorithm finds the best meal combinations
                that match your nutritional targets and preferences.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-accent"><BarChart3 className="icon" style={{color: "#f59e42"}}/></div>
              <h3 className="feature-title">Macro Tracking</h3>
              <p className="feature-text">
                Precise calorie and macro calculations. Get detailed breakdowns of
                protein, carbs, fats, and micronutrients for every meal.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-green"><Leaf className="icon" style={{color: "#16a34a"}}/></div>
              <h3 className="feature-title">Diet Types</h3>
              <p className="feature-text">
                Support for vegetarian, vegan, gluten-free, and many other dietary
                preferences and restrictions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue"><Utensils className="icon" style={{color: "#2563eb"}}/></div>
              <h3 className="feature-title">Variety</h3>
              <p className="feature-text">
                Never get bored with the same meals. Our algorithm ensures diverse,
                interesting recipes throughout the week.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-purple"><CheckCircle2 className="icon" style={{color: "#9333ea"}}/></div>
              <h3 className="feature-title">Editable Plans</h3>
              <p className="feature-text">
                Don't like a meal? Easily swap recipes while maintaining your nutritional targets and preferences.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon feature-icon-orange">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: "#ea580c"}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="feature-title">Shopping List</h3>
              <p className="feature-text">
                Automatic shopping list generation with all ingredients needed for your meal plan.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-section">
          <div className="how-header">
            <h2 className="features-title">How It Works</h2>
          </div>
          <div className="how-step-group">
            <div className="how-step">
              <div className="how-step-icon-wrap">
                <div className="how-step-icon">1</div>
              </div>
              <div>
                <h3 className="how-step-title">Answer Simple Questions</h3>
                <p className="how-step-text">
                  Tell us about your dietary preferences, restrictions, favorite meal types, and your daily meal volume preferences.
                </p>
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-icon-wrap">
                <div className="how-step-icon">2</div>
              </div>
              <div>
                <h3 className="how-step-title">Genetic Algorithm Runs</h3>
                <p className="how-step-text">
                  Our algorithm analyzes thousands of recipe combinations to find the optimal plan that meets all your criteria.
                </p>
              </div>
            </div>
            <div className="how-step">
              <div className="how-step-icon-wrap">
                <div className="how-step-icon">3</div>
              </div>
              <div>
                <h3 className="how-step-title">Get Your Plan</h3>
                <p className="how-step-text">
                  Receive a complete meal plan for the week with detailed macros, recipes, and a shopping list.
                </p>
              </div>
            </div>
          </div>
          <div className="how-btn-wrap">
            <Link to="/questionnaire" className="btn-primary">
              Create Your Plan Now <ArrowRight className="icon" />
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-block">
              <div className="stat-num">10K+</div>
              <div className="stat-label">Recipes in Database</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">100%</div>
              <div className="stat-label">Macro Accuracy</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">50+</div>
              <div className="stat-label">Diet Types</div>
            </div>
            <div className="stat-block">
              <div className="stat-num">&lt;1s</div>
              <div className="stat-label">Plan Generation</div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
