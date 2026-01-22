import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { MealPlanApi, type PatchedUserDietPreferences, type DietTypeEnum, type DietData } from "../../api";
import { Layout } from "../../components/Layout";
import styles from "./Questionaire.module.css"; 
import { Slider, Cascader} from 'antd';


const MEAL_OPTIONS = [
  "breakfast", 
  "lunch", 
  "dinner"
];

const FITNESS_OPTIONS = [
  "calories",
  "macros",
  "tags"
];


export default function Questionnaire() {
  const navigate = useNavigate();
  const [dietTypes, setDietTypes] = useState<DietData[]>([]);
  const [allergens, setAllergens] = useState([""]);
  const [ingredients, setIngredients] = useState([""]);
  
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<PatchedUserDietPreferences>({
    diet_type: "standard",
    meals_per_day: 3,
    min_calories_per_day: 1500,
    max_calories_per_day: 3000,

    allergens: [],
    excluded_ingredients: [],
    fitness_priority: "calories",
  });
  const [preferredMeals, setPreferredMeals] = useState<string[]>([...MEAL_OPTIONS]);

  const [allergyCascaderValue, setAllergyCascaderValue] = useState<string[][]>([]);
  const [ingredientCascaderValue, setIngredientCascaderValue] = useState<string[][]>([]);


  const flattenCascaderValue = (cascaderValue: string[][]): string[] => {
    return cascaderValue.flat(); 
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try{
        const dietResponse = await MealPlanApi.diets.dietsRetrieve();
        setDietTypes(dietResponse.data.diets);
        const ingredientsResponse = await MealPlanApi.ingredients.ingredientsRetrieve('ingredients');
        setIngredients(ingredientsResponse.data.ingredients);
        const allergensResponse = await MealPlanApi.ingredients.ingredientsRetrieve('allergens');
        setAllergens(allergensResponse.data.ingredients);
        console.log(dietResponse.data);
        console.log(ingredientsResponse);
        console.log(allergensResponse);
      }
      catch (error) {
        console.error("Failed to load options:", error);
        setDietTypes([
          { id: 'standard', name: 'Normal' },
          { id: 'vegetarian', name: 'Vegetarian' },
          { id: 'vegan', name: 'Vegan' }
        ]);
        setAllergens(["nuts", "dairy", "shellfish", "eggs", "soy", "wheat", "sesame"]);
        setIngredients(["mushrooms", "olives", "cilantro", "spicy", "liver", "seafood", "beans"]);
      }
    };

    fetchOptions();

  },[])

  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      allergens: flattenCascaderValue(allergyCascaderValue),
      excluded_ingredients: flattenCascaderValue(ingredientCascaderValue)
    }));
  }, [allergyCascaderValue, ingredientCascaderValue]);

  const toggleMultiSelect = (
    field: keyof Pick<
      PatchedUserDietPreferences,
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
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(preferences)
      await MealPlanApi.preferences.preferencesList()
      await MealPlanApi.preferences.preferencesPartialUpdate(preferences)
      navigate("/mealplan", { state: { 
        shouldRegenerate: true
      }});
    } catch (err: any) {
      console.error("Failed to update preferences: " + err)
    }
  };

  const allergyOptions = allergens.map(item => ({ value: item, label: item.charAt(0).toUpperCase() + item.slice(1) }));
  const ingredientOptions = ingredients.map(item => ({ value: item, label: item.charAt(0).toUpperCase() + item.slice(1) }));

  const progressPercentage = ((step + 1) / 6) * 100;

  return (
    <Layout>
    <div className={styles.wrapper}>
      {/* Progress bar */}
      <div className={styles.progressHeader}>
        <h1 className={styles.mainTitle}>Meal Plan Preferences</h1>
        <span className={styles.progressStep}>Step {step + 1} of 6</span>
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
            {dietTypes.map((diet) => (
              <button
                key={diet.id}
                onClick={() => setPreferences((prev) => ({ ...prev, diet_type: diet.id as DietTypeEnum }))}
                className={`${styles.buttonOption} ${
                  preferences.diet_type == diet.id ? styles.buttonActive : ""
                }`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{'textTransform': "capitalize"}}>{diet.name}</span>
                  {preferences.diet_type == diet.id && <Check className="icon" />}
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
              
              <Slider 
                className={styles.slider}
                range={{ draggableTrack: true }} 
                max={4000} 
                min={1200} 
                step={100} 
                value={[preferences.min_calories_per_day ?? 1500 , preferences.max_calories_per_day ?? 3000]} 
                onChange={(value: number[]) => {
                  const [min, max] = value as number[];
                  setPreferences((prev) => ({
                    ...prev,
                    min_calories_per_day: min,
                    max_calories_per_day: max,
                  }));
                }}
              />
              <div className={styles.sliderMinMaxRow}>
                <span>1200</span>
                <span>4000</span>
              </div>
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
              
              <Cascader
                style={{ width: '100%', maxWidth: '400px' }}
                options={allergyOptions}
                value={allergyCascaderValue}
                onChange={setAllergyCascaderValue}
                multiple
                maxTagCount="responsive"
                placeholder="Select allergies..."
                showSearch={{onSearch: (value) => console.log(value) }}
                className={styles.cascader}
              />
            </div>
            <div>
              <h3 className={styles.subTitle}>Disliked Ingredients</h3>
              
              <Cascader
                style={{ width: '100%', maxWidth: '400px' }}
                options={ingredientOptions}
                value={ingredientCascaderValue}
                onChange={setIngredientCascaderValue}
                multiple
                maxTagCount="responsive"
                placeholder="Select disliked ingredients..."
                showSearch={{onSearch: (value) => console.log(value) }}
                className={styles.cascader}
              />
               
            </div>
          </div>
          
        </div>
      )}


      {/* Step 5: Focus areas */}
      {step === 5 && (
        <div className={styles.stepSection}>
          <div>
            <h2 className={styles.stepTitle}>Focus areas</h2>
            <p className={styles.stepDesc}>
              Select what is most important for you.
            </p>
          </div>
          <div className={styles.gridList}>
            {FITNESS_OPTIONS.map((fit) => (
              <button
                key={fit}
                onClick={() => setPreferences((prev) => ({ ...prev, fitness_priority: fit }))}
                className={`${styles.buttonOption} ${
                  preferences.fitness_priority == fit ? styles.buttonActive : ""
                }`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{'textTransform': "capitalize"}}>{fit}</span>
                  {preferences.fitness_priority ==fit && <Check className="icon" />}
                </div>
              </button>
            ))}
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
        {step === 5 ? (
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
