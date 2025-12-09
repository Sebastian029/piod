import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Edit2, Shuffle, Plus, Minus } from "lucide-react";

import { type WeeklyMealPlan, MealPlanApi } from "../../api";
import { Layout } from "../../components/Layout";
import styles from './Meals.module.css';


const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function dayNameByNumber(num: number): string {
  return DAYS[num - 1]
}

async function generateMealPlan(): Promise<WeeklyMealPlan> {
  const resp = await MealPlanApi.plans.plansGenerateCreate()
  const thisWeekPlan: WeeklyMealPlan = ((resp.data as any).weeks as WeeklyMealPlan[])[0];
  return thisWeekPlan;
}

async function getMealPlan(): Promise<WeeklyMealPlan> {
  const resp = await MealPlanApi.plans.plansCurrentRetrieve()
  return resp.data;
}


interface MealPlanProps {
  shouldRegenerate?: boolean
}

export default function MealPlan() {
  const location = useLocation();
  const { shouldRegenerate } = location.state as MealPlanProps || {};
  
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDaysNums, setExpandedDaysNums] = useState<number[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (shouldRegenerate) {
        return await generateMealPlan();
      } else {
        return await getMealPlan();
      }
    }

    fetchData()
      .then(plan => {
        setMealPlan(plan);
        setLoading(false);
        setExpandedDaysNums([1]);
      })
      .catch(err => console.error("Failed to get the meal plan: " + err))
  }, []);

  const toggleDayExpand = (dayNum: number) => {
    setExpandedDaysNums((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const switchRecipe = async (date: string, recipeID: number) => {
    setLoading(true);
    try {
      const switchResponse = await MealPlanApi.plans.plansAutoSwapRecipeCreate({
        date,
        old_recipe_id: recipeID,
      })
      const newPlan = await getMealPlan();
      setMealPlan(newPlan);
    }
    catch(err){
      console.error("Failed to swap recipe: ", err)
    }finally{
      setLoading(false);
    }

  }

  const regeneratePlan = () => {
    setLoading(true);
    setExpandedDaysNums([]);
    setTimeout(async () => {
      const plan = await generateMealPlan();
      setMealPlan(plan);
      setLoading(false);
      setExpandedDaysNums([1]);
    }, 2000);
  };

  if (loading || !mealPlan) {
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

  return (
    <Layout>
      <div className={styles.planContainer}>
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
            <p className={styles.weeklyStatValue}>{mealPlan.weekly_totals.calories.toLocaleString()}</p>
            <p className={styles.weeklyStatDesc}>{Math.round(mealPlan.weekly_totals.calories / 7)}/day</p>
          </div>
          <div className={styles.weeklyStatCard}>
            <p className={styles.weeklyStatLabel}>Protein</p>
            <p className={styles.weeklyStatValue}>{Math.round(mealPlan.weekly_totals.protein)}g</p>
            <p className={styles.weeklyStatDesc}>{Math.round(mealPlan.weekly_totals.protein / 7)}/day</p>
          </div>
          <div className={styles.weeklyStatCard}>
            <p className={styles.weeklyStatLabel}>Carbs</p>
            <p className={styles.weeklyStatValue}>{Math.round(mealPlan.weekly_totals.carbs)}g</p>
            <p className={styles.weeklyStatDesc}>{Math.round(mealPlan.weekly_totals.carbs / 7)}/day</p>
          </div>
          <div className={styles.weeklyStatCard}>
            <p className={styles.weeklyStatLabel}>Fat</p>
            <p className={styles.weeklyStatValue}>{Math.round(mealPlan.weekly_totals.fat)}g</p>
            <p className={styles.weeklyStatDesc}>{Math.round(mealPlan.weekly_totals.fat / 7)}/day</p>
          </div>
        </div>

        {/* Daily Plans */}
        <div className={styles.dailyPlanList}>
          {mealPlan.days.map((dayPlan) => (
            <div key={dayPlan.day_number} className={styles.dailyCard}>
              <button onClick={() => toggleDayExpand(dayPlan.day_number)} className={styles.dailyCardBtn}>
                <div>
                  <h3 className={styles.dailyCardDay}>{dayNameByNumber(dayPlan.day_number)}</h3>
                  <p className={styles.dailyCardMeals}>{dayPlan.recipes.length} meals</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={styles.dailyCardStats}>
                    <p>Calories</p>
                    <p className={styles.dailyCardStatsValue}>{dayPlan.daily_totals.calories}</p>
                  </div>
                  {expandedDaysNums.includes(dayPlan.day_number) ?
                    <Minus className="icon" /> :
                    <Plus className="icon" />}
                </div>
              </button>

              {expandedDaysNums.includes(dayPlan.day_number) && (
                <div className={styles.dailyExpanded}>
                  {dayPlan.recipes.map((meal) => (
                    <div key={meal.id} className={styles.mealRow}>
                      <div className={styles.mealInfoHeader}>
                        <div>
                          <h4 className={styles.mealName}>{meal.name}</h4>
                          <p className={styles.mealType}>{meal.meal_type}</p>
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
                          <button 
                            className={styles.mealSwapBtn} 
                            onClick={() => switchRecipe(dayPlan.date, meal.id)}
                            >
                              Swap
                            </button>
                        </div>
                      </div>
                      <div>
                        <p className={styles.ingredientsHeader}>Ingredients:</p>
                        <div className={styles.ingredientsWrap}>
                          {meal.ingredients.map((ingredient: string) => (
                            <span className={styles.ingredientChip} key={ingredient}>{ingredient}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className={styles.dailyStatsRow}>
                    <div>
                      <p className={styles.dailyStatLabel}>Total Calories</p>
                      <p className={styles.dailyStatValue}>{dayPlan.daily_totals.calories}</p>
                    </div>
                    <div>
                      <p className={styles.dailyStatLabel}>Protein</p>
                      <p className={styles.dailyStatValue}>{Math.round(dayPlan.daily_totals.protein)}g</p>
                    </div>
                    <div>
                      <p className={styles.dailyStatLabel}>Carbs</p>
                      <p className={styles.dailyStatValue}>{Math.round(dayPlan.daily_totals.carbs)}g</p>
                    </div>
                    <div>
                      <p className={styles.dailyStatLabel}>Fat</p>
                      <p className={styles.dailyStatValue}>{Math.round(dayPlan.daily_totals.fat)}g</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionRow}>
          {/* <Link to="/shopping-list" className={styles.actionBtn}>
            View Shopping List
          </Link> */}
          {/* <button className={styles.actionBtnSecondary}>
            Edit Plan
          </button> */}
        </div>
      </div>
    </Layout>
  );
}