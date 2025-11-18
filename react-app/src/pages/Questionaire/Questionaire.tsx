import { Layout } from "../../components/Layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import styles from "./Questionaire.module.css"; 

interface UserPreferences {
  dietTypes: string[];
  mealsPerDay: number;
  dailyCalories: number;
  preferredMeals: string[];
  allergies: string[];
  dislikedIngredients: string[];
  vegetarianDays: number;
}

const DIET_TYPES = [
  "Omnivore",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Keto",
  "Low-carb",
  "High-protein",
];

const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const ALLERGY_OPTIONS = [
  "Nuts",
  "Dairy",
  "Shellfish",
  "Eggs",
  "Soy",
  "Wheat",
  "Sesame",
];

const DISLIKED_INGREDIENTS = [
  "Mushrooms",
  "Olives",
  "Cilantro",
  "Spicy",
  "Liver",
  "Seafood",
  "Beans",
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietTypes: [],
    mealsPerDay: 3,
    dailyCalories: 2000,
    preferredMeals: ["Breakfast", "Lunch", "Dinner"],
    allergies: [],
    dislikedIngredients: [],
    vegetarianDays: 0,
  });

  const toggleMultiSelect = (
    field: keyof Pick<
      UserPreferences,
      "dietTypes" | "preferredMeals" | "allergies" | "dislikedIngredients"
    >,
    value: string
  ) => {
    setPreferences((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return {
          ...prev,
          [field]: current.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...current, value],
        };
      }
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem("mealPlanPreferences", JSON.stringify(preferences));
    navigate("/mealplan");
  };

  const progressPercentage = ((step + 1) / 5) * 100;

  return (
    <Layout>
    <div className={styles.wrapper}>
      {/* Progress bar */}
      <div className={styles.progressHeader}>
        <h1 className={styles.mainTitle}>Meal Plan Preferences</h1>
        <span className={styles.progressStep}>Step {step + 1} of 5</span>
      </div>
      <div className={styles.progressBarOuter}>
        <div
          className={styles.progressBarInner}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step 0: Diet Types */}
      {step === 0 && (
        <div className={styles.stepSection}>
          <div>
            <h2 className={styles.stepTitle}>Diet Type</h2>
            <p className={styles.stepDesc}>
              Select all diet types that apply to you or your preferences.
            </p>
          </div>
          <div className={styles.gridList}>
            {DIET_TYPES.map((diet) => (
              <button
                key={diet}
                onClick={() => toggleMultiSelect("dietTypes", diet)}
                className={`${styles.buttonOption} ${
                  preferences.dietTypes.includes(diet) ? styles.buttonActive : ""
                }`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>{diet}</span>
                  {preferences.dietTypes.includes(diet) && <Check className="icon" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Meals Per Day */}
      {step === 1 && (
        <div className={styles.stepSection}>
          <div>
            <h2 className={styles.stepTitle}>Meals Per Day</h2>
            <p className={styles.stepDesc}>
              How many meals would you like per day?
            </p>
          </div>
          <div className={styles.gridMealsDay}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, mealsPerDay: num }))
                }
                className={`${styles.buttonOption} ${
                  preferences.mealsPerDay === num ? styles.buttonActive : ""
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Daily Calories */}
      {step === 2 && (
        <div className={styles.stepSection}>
          <div>
            <h2 className={styles.stepTitle}>Daily Calorie Target</h2>
            <p className={styles.stepDesc}>What is your daily calorie goal?</p>
          </div>
          <div>
            <div className={styles.cardSlider}>
              <div className={styles.sliderLabelRow}>
                <label className={styles.sliderLabelRow}>Calories</label>
                <span className={styles.sliderValue}>
                  {preferences.dailyCalories}
                </span>
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="100"
                value={preferences.dailyCalories}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    dailyCalories: parseInt(e.target.value),
                  }))
                }
                className={styles.sliderRange}
              />
              <div className={styles.sliderMinMaxRow}>
                <span>1200</span>
                <span>4000</span>
              </div>
            </div>
            <div className={styles.gridButtons}>
              {[1500, 1800, 2000, 2500, 3000].map((cal) => (
                <button
                  key={cal}
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      dailyCalories: cal,
                    }))
                  }
                  className={`${styles.buttonOption} ${
                    preferences.dailyCalories === cal ? styles.buttonActive : ""
                  }`}
                >
                  {cal}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Preferred Meals */}
      {step === 3 && (
        <div className={styles.stepSection}>
          <div>
            <h2 className={styles.stepTitle}>Preferred Meal Types</h2>
            <p className={styles.stepDesc}>
              Which meal types do you want in your plan?
            </p>
          </div>
          <div className={styles.gridList}>
            {MEAL_OPTIONS.map((meal) => (
              <button
                key={meal}
                onClick={() => toggleMultiSelect("preferredMeals", meal)}
                className={`${styles.buttonOption} ${
                  preferences.preferredMeals.includes(meal) ? styles.buttonActive : ""
                }`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>{meal}</span>
                  {preferences.preferredMeals.includes(meal) && <Check className="icon" />}
                </div>
              </button>
            ))}
          </div>
          <div className={styles.vegCard}>
            <h3 className={styles.vegTitle}>Vegetarian Days</h3>
            <p className={styles.vegDesc}>
              How many days per week would you like vegetarian meals?
            </p>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={preferences.vegetarianDays}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  vegetarianDays: parseInt(e.target.value),
                }))
              }
              className={styles.vegSlider}
            />
            <div className={styles.vegValue}>
              {preferences.vegetarianDays} days per week
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Allergies & Dislikes */}
      {step === 4 && (
        <div className={styles.stepSection}>
          <div>
            <h2 className={styles.stepTitle}>Allergies & Dislikes</h2>
            <p className={styles.stepDesc}>
              Select any allergies and ingredients you dislike.
            </p>
          </div>
          <div className={styles.spaceVertical}>
            <div>
              <h3 className={styles.subTitle}>Allergies</h3>
              <div className={styles.gridAllergies}>
                {ALLERGY_OPTIONS.map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => toggleMultiSelect("allergies", allergy)}
                    className={`${styles.buttonOption} ${
                      preferences.allergies.includes(allergy) ? styles.buttonRed : ""
                    }`}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>{allergy}</span>
                      {preferences.allergies.includes(allergy) && <Check className="icon" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className={styles.subTitle}>Disliked Ingredients</h3>
              <div className={styles.gridDisliked}>
                {DISLIKED_INGREDIENTS.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() =>
                      toggleMultiSelect("dislikedIngredients", ingredient)
                    }
                    className={`${styles.buttonOption} ${
                      preferences.dislikedIngredients.includes(ingredient) ? styles.buttonAmber : ""
                    }`}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>{ingredient}</span>
                      {preferences.dislikedIngredients.includes(ingredient) && <Check className="icon" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={styles.navBtnsRow}>
        <button
          onClick={handlePrevious}
          disabled={step === 0}
          className={styles.btnPrev}
        >
          Previous
        </button>
        {step === 4 ? (
          <button onClick={handleSubmit}
            className={`${styles.btnPrimary} ${styles.shadow}`}>
            Generate My Plan
            <ArrowRight className="icon" />
          </button>
        ) : (
          <button onClick={handleNext}
            className={styles.btnPrimary}>
            Next
            <ArrowRight className="icon" />
          </button>
        )}
      </div>
    </div>
    </Layout>
  );
}
