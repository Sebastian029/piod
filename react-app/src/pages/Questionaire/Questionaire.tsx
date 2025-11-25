import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import { type PatchedUserDietPreferences, MealPlanApi, DietTypeEnum } from "../../api";
import { Layout } from "../../components/Layout";
import styles from "./Questionaire.module.css"; 


//TODO retrieve ALL this stuff from API

const DIET_TYPES: string[] = [
  DietTypeEnum.Standard,
  DietTypeEnum.Vegetarian,
  DietTypeEnum.Vegan,
]

const MEAL_OPTIONS = [
  "breakfast", 
  "lunch", 
  "dinner", 
  "snack"
];

const ALLERGY_OPTIONS = [
  "nuts",
  "dairy",
  "shellfish",
  "eggs",
  "soy",
  "wheat",
  "sesame",
];

const DISLIKED_INGREDIENTS = [
  "mushrooms",
  "olives",
  "cilantro",
  "spicy",
  "liver",
  "seafood",
  "beans",
];

export default function Questionnaire() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<PatchedUserDietPreferences>({
    diet_type: "standard",
    meals_per_day: 3,
    min_calories_per_day: 1500,
    max_calories_per_day: 3000,
    // preferred_meals: [], //TODO preferred meals
    //TODO min/max_protein_per_day
    //TODO min/max_carbs_per_day
    //TODO min/max_fat_per_day
    allergens: [],
    excluded_ingredients: [],
    //TODO vegeterian_days
  });
  //TODO remove when preferred_meals is available
  const [preferredMeals, setPreferredMeals] = useState<string[]>(["breakfast", "lunch", "dinner"]);
  //TODO remove when preferred_meals is available
  const [vegetarianDays, setVegetarianDays] = useState<number>(0);

  const toggleMultiSelect = (
    field: keyof Pick<
      PatchedUserDietPreferences,
      //TODO add back preferred_meals when available
      "allergens" | "excluded_ingredients" 
    >,
    value: string
  ) => {
    setPreferences((prev) => {
      const current = prev[field] as string[];
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

  const togglePreferredMealsMultiSelect = (
    value: string
  ) => {
    setPreferredMeals((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      } else {
        return [...prev, value]
      }
    })
  }

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

  const handleSubmit = async () => {
    //TODO add create_or_update in API, there is no way currently to only check if preferences exist
    await MealPlanApi.preferences.preferencesList()
    await MealPlanApi.preferences.preferencesPartialUpdate(preferences)
    navigate("/mealplan", { state: { 
      shouldRegenerate: true
    }});
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
              Select diet type that applies to you or your preferences.
            </p>
          </div>
          <div className={styles.gridList}>
            {DIET_TYPES.map((diet) => (
              <button
                key={diet}
                onClick={() => setPreferences((prev) => ({ ...prev, diet_type: diet as DietTypeEnum }))}
                className={`${styles.buttonOption} ${
                  preferences.diet_type == diet ? styles.buttonActive : ""
                }`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{'textTransform': "capitalize"}}>{diet}</span>
                  {preferences.diet_type == diet && <Check className="icon" />}
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
                  setPreferences((prev) => ({ ...prev, meals_per_day: num }))
                }
                className={`${styles.buttonOption} ${
                  preferences.meals_per_day === num ? styles.buttonActive : ""
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
                  from {preferences.min_calories_per_day} to {preferences.max_calories_per_day}
                </span>
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="100"
                value={preferences.min_calories_per_day}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    min_calories_per_day: parseInt(e.target.value),
                  }))
                }
                className={styles.sliderRange}
              />
              <input
                type="range"
                min="1200"
                max="4000"
                step="100"
                value={preferences.max_calories_per_day}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    max_calories_per_day: parseInt(e.target.value),
                  }))
                }
                className={styles.sliderRange}
              />
              <div className={styles.sliderMinMaxRow}>
                <span>1200</span>
                <span>4000</span>
              </div>
            </div>
            {/* <div className={styles.gridButtons}>
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
            </div> */}
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
                onClick={() => togglePreferredMealsMultiSelect(meal)}
                className={`${styles.buttonOption} ${
                  preferredMeals.includes(meal) ? styles.buttonActive : ""
                }`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{'textTransform': "capitalize"}}>{meal}</span>
                  {preferredMeals.includes(meal) && <Check className="icon" />}
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
              value={vegetarianDays}
              onChange={(e) => setVegetarianDays(parseInt(e.target.value))}
              className={styles.vegSlider}
            />
            <div className={styles.vegValue}>
              {vegetarianDays} days per week
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
                    onClick={() => toggleMultiSelect("allergens", allergy)}
                    className={`${styles.buttonOption} ${
                      preferences.allergens.includes(allergy) ? styles.buttonRed : ""
                    }`}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{'textTransform': "capitalize"}}>{allergy}</span>
                      {preferences.allergens.includes(allergy) && <Check className="icon" />}
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
                      toggleMultiSelect("excluded_ingredients", ingredient)
                    }
                    className={`${styles.buttonOption} ${
                      preferences.excluded_ingredients.includes(ingredient) ? styles.buttonAmber : ""
                    }`}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{'textTransform': "capitalize"}}>{ingredient}</span>
                      {preferences.excluded_ingredients.includes(ingredient) && <Check className="icon" />}
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
