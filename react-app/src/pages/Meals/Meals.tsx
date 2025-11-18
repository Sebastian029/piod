import { Layout } from "../../components/Layout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, Edit2, Shuffle, Plus, Minus } from "lucide-react";
import styles from './Meals.module.css'; // Import stylów!

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

interface DayPlan {
  day: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Mock recipe database
const MOCK_RECIPES: Meal[] = [
  {
    id: "1",
    name: "Oatmeal with Berries",
    type: "breakfast",
    calories: 350,
    protein: 12,
    carbs: 55,
    fat: 8,
    ingredients: ["Oats", "Blueberries", "Honey", "Milk"],
  },
  {
    id: "2",
    name: "Grilled Chicken Salad",
    type: "lunch",
    calories: 520,
    protein: 45,
    carbs: 35,
    fat: 18,
    ingredients: ["Chicken Breast", "Mixed Greens", "Olive Oil", "Lemon"],
  },
  {
    id: "3",
    name: "Salmon with Vegetables",
    type: "dinner",
    calories: 650,
    protein: 50,
    carbs: 45,
    fat: 28,
    ingredients: ["Salmon", "Broccoli", "Sweet Potato", "Olive Oil"],
  },
  {
    id: "4",
    name: "Greek Yogurt Parfait",
    type: "breakfast",
    calories: 280,
    protein: 20,
    carbs: 38,
    fat: 5,
    ingredients: ["Greek Yogurt", "Granola", "Honey", "Strawberries"],
  },
  {
    id: "5",
    name: "Turkey Wrap",
    type: "lunch",
    calories: 480,
    protein: 40,
    carbs: 45,
    fat: 16,
    ingredients: ["Turkey", "Whole Wheat Wrap", "Lettuce", "Tomato", "Mayo"],
  },
  {
    id: "6",
    name: "Pasta Marinara",
    type: "dinner",
    calories: 580,
    protein: 28,
    carbs: 72,
    fat: 18,
    ingredients: ["Pasta", "Tomato Sauce", "Ground Beef", "Parmesan"],
  },
  {
    id: "7",
    name: "Almonds & Apple",
    type: "snack",
    calories: 220,
    protein: 8,
    carbs: 28,
    fat: 10,
    ingredients: ["Almonds", "Apple"],
  },
  {
    id: "8",
    name: "Protein Smoothie",
    type: "snack",
    calories: 250,
    protein: 30,
    carbs: 35,
    fat: 4,
    ingredients: ["Protein Powder", "Banana", "Milk", "Berries"],
  },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Simple genetic algorithm mockup for plan generation
const generateMealPlan = (preferences: any): DayPlan[] => {
  const plan: DayPlan[] = [];
  DAYS.forEach((day) => {
    const mealsForDay: Meal[] = [];
    const mealsPerDay = preferences.mealsPerDay || 3;
    const targetCalories = preferences.dailyCalories || 2000;
    preferences.preferredMeals.forEach((mealType: string) => {
      const mealTypeKey = mealType.toLowerCase() as
        | "breakfast"
        | "lunch"
        | "dinner"
        | "snack";
      const availableMeals = MOCK_RECIPES.filter((m) => m.type === mealTypeKey);
      if (availableMeals.length > 0) {
        const randomMeal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
        mealsForDay.push(randomMeal);
      }
    });
    const totalCalories = mealsForDay.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = mealsForDay.reduce((sum, m) => sum + m.protein, 0);
    const totalCarbs = mealsForDay.reduce((sum, m) => sum + m.carbs, 0);
    const totalFat = mealsForDay.reduce((sum, m) => sum + m.fat, 0);
    plan.push({
      day,
      meals: mealsForDay,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    });
  });
  return plan;
};

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  useEffect(() => {
    const preferences = JSON.parse(localStorage.getItem("mealPlanPreferences") || "{}");
    setTimeout(() => {
      const plan = generateMealPlan(preferences);
      setMealPlan(plan);
      setLoading(false);
      setExpandedDays([DAYS[0]]);
    }, 2000);
  }, []);

  const toggleDayExpand = (day: string) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const regeneratePlan = () => {
    setLoading(true);
    setExpandedDays([]);
    const preferences = JSON.parse(localStorage.getItem("mealPlanPreferences") || "{}");
    setTimeout(() => {
      const plan = generateMealPlan(preferences);
      setMealPlan(plan);
      setLoading(false);
      setExpandedDays([DAYS[0]]);
    }, 2000);
  };

  const getTotalWeekStats = () => ({
    calories: mealPlan.reduce((sum, day) => sum + day.totalCalories, 0),
    protein: mealPlan.reduce((sum, day) => sum + day.totalProtein, 0),
    carbs: mealPlan.reduce((sum, day) => sum + day.totalCarbs, 0),
    fat: mealPlan.reduce((sum, day) => sum + day.totalFat, 0),
  });

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinnerWrapper}>
            <div className={styles.loadingSpinnerOuter}>
              <div className={styles.loadingSpinnerBase}></div>
              <div className={styles.loadingSpinnerActive}></div>
            </div>
          </div>
          <h2 className={styles.loadingTitle}>Generating Your Meal Plan</h2>
          <p className={styles.loadingDesc}>
            Our genetic algorithm is optimizing your perfect meal plan...
          </p>
        </div>
      </Layout>
    );
  }

  const weekStats = getTotalWeekStats();

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.headerMainText}>Your Weekly Meal Plan</h1>
            <p className={styles.headerDesc}>
              Optimized to match your preferences and nutritional goals
            </p>
          </div>
          <div className={styles.headerBtnGroup}>
            <button onClick={regeneratePlan} className={styles.btn}>
              <Shuffle className="icon" />
              <span>Regenerate</span>
            </button>
            <button className={styles.btnPrimary}>
              <Download className="icon" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {/* Weekly Stats */}
        <div className={styles.weeklyStatsGrid}>
          <div className={styles.weeklyStatCard}>
            <p className={styles.weeklyStatLabel}>Total Calories</p>
            <p className={styles.weeklyStatValue}>{weekStats.calories.toLocaleString()}</p>
            <p className={styles.weeklyStatDesc}>{Math.round(weekStats.calories / 7)}/day</p>
          </div>
          <div className={styles.weeklyStatCard}>
            <p className={styles.weeklyStatLabel}>Protein</p>
            <p className={styles.weeklyStatValue}>{Math.round(weekStats.protein)}g</p>
            <p className={styles.weeklyStatDesc}>{Math.round(weekStats.protein / 7)}/day</p>
          </div>
          <div className={styles.weeklyStatCard}>
            <p className={styles.weeklyStatLabel}>Carbs</p>
            <p className={styles.weeklyStatValue}>{Math.round(weekStats.carbs)}g</p>
            <p className={styles.weeklyStatDesc}>{Math.round(weekStats.carbs / 7)}/day</p>
          </div>
          <div className={styles.weeklyStatCard}>
            <p className={styles.weeklyStatLabel}>Fat</p>
            <p className={styles.weeklyStatValue}>{Math.round(weekStats.fat)}g</p>
            <p className={styles.weeklyStatDesc}>{Math.round(weekStats.fat / 7)}/day</p>
          </div>
        </div>

        {/* Daily Plans */}
        <div className={styles.dailyPlanList}>
          {mealPlan.map((dayPlan) => (
            <div key={dayPlan.day} className={styles.dailyCard}>
              <button onClick={() => toggleDayExpand(dayPlan.day)} className={styles.dailyCardBtn}>
                <div>
                  <h3 className={styles.dailyCardDay}>{dayPlan.day}</h3>
                  <p className={styles.dailyCardMeals}>{dayPlan.meals.length} meals</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={styles.dailyCardStats}>
                    <p>Calories</p>
                    <p className={styles.dailyCardStatsValue}>{dayPlan.totalCalories}</p>
                  </div>
                  {expandedDays.includes(dayPlan.day) ?
                    <Minus className="icon" /> :
                    <Plus className="icon" />}
                </div>
              </button>

              {expandedDays.includes(dayPlan.day) && (
                <div className={styles.dailyExpanded}>
                  {dayPlan.meals.map((meal) => (
                    <div key={meal.id} className={styles.mealRow}>
                      <div className={styles.mealInfoHeader}>
                        <div>
                          <h4 className={styles.mealName}>{meal.name}</h4>
                          <p className={styles.mealType}>{meal.type}</p>
                        </div>
                        <button className={styles.mealEditBtn}><Edit2 className="icon" /></button>
                      </div>

                      <div className={styles.mealStatsGrid}>
                        <div>
                          <p className={styles.mealStatLabel}>Calories</p>
                          <p className={styles.mealStatValue}>{meal.calories}</p>
                        </div>
                        <div>
                          <p className={styles.mealStatLabel}>Protein</p>
                          <p className={styles.mealStatValue}>{meal.protein}g</p>
                        </div>
                        <div>
                          <p className={styles.mealStatLabel}>Carbs</p>
                          <p className={styles.mealStatValue}>{meal.carbs}g</p>
                        </div>
                        <div>
                          <p className={styles.mealStatLabel}>Fat</p>
                          <p className={styles.mealStatValue}>{meal.fat}g</p>
                        </div>
                        <div>
                          <button className={styles.mealSwapBtn}>Swap</button>
                        </div>
                      </div>
                      <div>
                        <p className={styles.ingredientsHeader}>Ingredients:</p>
                        <div className={styles.ingredientsWrap}>
                          {meal.ingredients.map((ingredient) => (
                            <span className={styles.ingredientChip} key={ingredient}>{ingredient}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className={styles.dailyStatsRow}>
                    <div>
                      <p className={styles.dailyStatLabel}>Total Calories</p>
                      <p className={styles.dailyStatValue}>{dayPlan.totalCalories}</p>
                    </div>
                    <div>
                      <p className={styles.dailyStatLabel}>Protein</p>
                      <p className={styles.dailyStatValue}>{Math.round(dayPlan.totalProtein)}g</p>
                    </div>
                    <div>
                      <p className={styles.dailyStatLabel}>Carbs</p>
                      <p className={styles.dailyStatValue}>{Math.round(dayPlan.totalCarbs)}g</p>
                    </div>
                    <div>
                      <p className={styles.dailyStatLabel}>Fat</p>
                      <p className={styles.dailyStatValue}>{Math.round(dayPlan.totalFat)}g</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionRow}>
          <Link to="/shopping-list" className={styles.actionBtn}>
            View Shopping List
          </Link>
          <button className={styles.actionBtnSecondary}>
            Edit Plan
          </button>
        </div>
      </div>
    </Layout>
  );
}