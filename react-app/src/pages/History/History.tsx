import { useEffect, useState } from "react";
import { Plus, Minus, ChevronUp, ChevronDown } from "lucide-react";
import { Layout } from "../../components/Layout";
import styles from "./History.module.css";
import axiosInstance from "../../api/axiosInstance";
import { Rate } from "antd";
import type { WeeklyMealPlan } from "../../api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function dayNameByNumber(num: number): string {
  return DAYS[num - 1];
}

interface HistoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WeeklyMealPlan[];
}

export default function MealPlanHistory() {
  const [weeks, setWeeks] = useState<WeeklyMealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // expansion state
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [expandedDays, setExpandedDays] = useState<Record<string, number[]>>({});
  const [expandedDescription, setExpandedDescription] = useState<Record<number, boolean>>({});

  const weekKeyFromPlan = (week: WeeklyMealPlan) =>
    `${week.start_date}_${week.end_date}`;

  const fetchHistory = async (pageToLoad: number) => {
    try {
      setLoading(true);
      const resp = await axiosInstance.get<HistoryResponse>(
        "/api/plans/history/",
        { params: { page: pageToLoad, page_size: pageSize } }
      );
      setWeeks(resp.data.results);
      setTotalCount(resp.data.count);
      setPage(pageToLoad);
      setExpandedWeeks([]);
      setExpandedDays({});
      setExpandedDescription({});
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks(prev =>
      prev.includes(weekKey) ? prev.filter(k => k !== weekKey) : [...prev, weekKey]
    );
  };

  const toggleDay = (weekKey: string, dayNum: number) => {
    setExpandedDays(prev => {
      const current = prev[weekKey] || [];
      return {
        ...prev,
        [weekKey]: current.includes(dayNum)
          ? current.filter(d => d !== dayNum)
          : [...current, dayNum],
      };
    });
  };

  const toggleDescription = (recipeId: number) => {
    setExpandedDescription(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  const handleRatingChange = async (recipeId: number, rating: number) => {
    try {
      await axiosInstance.post("/api/ratings/", {
        recipe_id: recipeId,
        rating,
      });
      // odśwież aktualną stronę po ocenie
      await fetchHistory(page);
    } catch (err) {
      console.error("Failed to rate recipe:", err);
    }
  };

  if (loading && weeks.length === 0) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinnerWrapper}>
            <div className={styles.loadingSpinnerOuter}>
              <div className={styles.loadingSpinnerBase}></div>
              <div className={styles.loadingSpinnerActive}></div>
            </div>
          </div>
          <h2 className={styles.loadingTitle}>Loading your history</h2>
          <p className={styles.loadingDesc}>
            Fetching your previous weekly meal plans...
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
            <h1 className={styles.headerMainText}>Meal Plan History</h1>
            <p className={styles.headerDesc}>
              Browse and review your previous weekly plans
            </p>
          </div>
        </div>

        {/* Weeks list */}
        <div className={styles.dailyPlanList}>
          {weeks.map((week) => {
            const weekKey = weekKeyFromPlan(week);

            return (
              <div key={weekKey} className={styles.dailyCard}>
                <button
                  className={styles.dailyCardBtn}
                  onClick={() => toggleWeek(weekKey)}
                >
                  <div>
                    <h3 className={styles.dailyCardDay}>
                      {week.start_date} – {week.end_date}
                    </h3>
                    <p className={styles.dailyCardMeals}>
                      {week.days.length} days
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className={styles.dailyCardStats}>
                      <p>Calories</p>
                      <p className={styles.dailyCardStatsValue}>
                        {week.weekly_totals.calories}
                      </p>
                    </div>
                    {expandedWeeks.includes(weekKey) ? <Minus /> : <Plus />}
                  </div>
                </button>

                {expandedWeeks.includes(weekKey) && (
                  <div className={styles.dailyExpanded}>
                    {/* Weekly stats */}
                    <div className={styles.weeklyStatsGrid}>
                      <div className={styles.weeklyStatCard}>
                        <p className={styles.weeklyStatLabel}>Total Calories</p>
                        <p className={styles.weeklyStatValue}>
                          {week.weekly_totals.calories.toLocaleString()}
                        </p>
                        <p className={styles.weeklyStatDesc}>
                          {Math.round(week.weekly_totals.calories / 7)}kcal per day
                        </p>
                      </div>
                      <div className={styles.weeklyStatCard}>
                        <p className={styles.weeklyStatLabel}>Protein</p>
                        <p className={styles.weeklyStatValue}>
                          {Math.round(week.weekly_totals.protein)}g
                        </p>
                        <p className={styles.weeklyStatDesc}>
                          {Math.round(week.weekly_totals.protein / 7)}g per day
                        </p>
                      </div>
                      <div className={styles.weeklyStatCard}>
                        <p className={styles.weeklyStatLabel}>Carbs</p>
                        <p className={styles.weeklyStatValue}>
                          {Math.round(week.weekly_totals.carbs)}g
                        </p>
                        <p className={styles.weeklyStatDesc}>
                          {Math.round(week.weekly_totals.carbs / 7)}g per day
                        </p>
                      </div>
                      <div className={styles.weeklyStatCard}>
                        <p className={styles.weeklyStatLabel}>Fat</p>
                        <p className={styles.weeklyStatValue}>
                          {Math.round(week.weekly_totals.fat)}g
                        </p>
                        <p className={styles.weeklyStatDesc}>
                          {Math.round(week.weekly_totals.fat / 7)}g per day
                        </p>
                      </div>
                    </div>

                    {/* Days in week */}
                    <div className={styles.dailyPlanList}>
                      {week.days.map((dayPlan) => (
                        <div key={dayPlan.day_number} className={styles.dailyCard}>
                          <button
                            onClick={() => toggleDay(weekKey, dayPlan.day_number)}
                            className={styles.dailyCardBtn}
                          >
                            <div>
                              <h3 className={styles.dailyCardDay}>
                                {dayNameByNumber(dayPlan.day_number)}
                              </h3>
                              <p className={styles.dailyCardMeals}>
                                {dayPlan.recipes.length} meals
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <div className={styles.dailyCardStats}>
                                <p>Calories</p>
                                <p className={styles.dailyCardStatsValue}>
                                  {dayPlan.daily_totals.calories}
                                </p>
                              </div>
                              {(expandedDays[weekKey] || []).includes(
                                dayPlan.day_number
                              ) ? (
                                <Minus className="icon" />
                              ) : (
                                <Plus className="icon" />
                              )}
                            </div>
                          </button>

                          {(expandedDays[weekKey] || []).includes(
                            dayPlan.day_number
                          ) && (
                            <div className={styles.dailyExpanded}>
                              {dayPlan.recipes.map((meal) => (
                                <div key={meal.id} className={styles.mealRow}>
                                  <div className={styles.mealInfoHeader}>
                                    <div>
                                      <h4 className={styles.mealName}>{meal.name}</h4>
                                      <p className={styles.mealType}>{meal.meal_type}</p>
                                    </div>
                                  </div>

                                  <div className={styles.mealStatsGrid}>
                                    <div>
                                      <p className={styles.mealStatLabel}>Calories</p>
                                      <p className={styles.mealStatValue}>
                                        {meal.calories}
                                      </p>
                                    </div>
                                    <div>
                                      <p className={styles.mealStatLabel}>Protein</p>
                                      <p className={styles.mealStatValue}>
                                        {meal.protein}g
                                      </p>
                                    </div>
                                    <div>
                                      <p className={styles.mealStatLabel}>Carbs</p>
                                      <p className={styles.mealStatValue}>
                                        {meal.carbs}g
                                      </p>
                                    </div>
                                    <div>
                                      <p className={styles.mealStatLabel}>Fat</p>
                                      <p className={styles.mealStatValue}>
                                        {meal.fat}g
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className={styles.ingredientsHeader}>Ingredients:</p>
                                    <div className={styles.ingredientsWrap}>
                                      {meal.ingredients.map((ingredient: string) => (
                                        <span
                                          className={styles.ingredientChip}
                                          key={ingredient}
                                        >
                                          {ingredient}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <p className={styles.ingredientsHeader}>
                                      Your rating: {meal.user_rating}
                                    </p>
                                    <Rate
                                      count={6}
                                      allowClear={false}
                                      value={meal.user_rating}
                                      onChange={(value) =>
                                        handleRatingChange(meal.id, value)
                                      }
                                    />
                                  </div>

                                  <button
                                    className={styles.expandDescriptionButton}
                                    onClick={() => toggleDescription(meal.id)}
                                  >
                                    <div>
                                      {expandedDescription[meal.id]
                                        ? "Hide description"
                                        : "Show description"}
                                    </div>
                                    <div>
                                      {expandedDescription[meal.id] ? (
                                        <ChevronUp />
                                      ) : (
                                        <ChevronDown />
                                      )}
                                    </div>
                                  </button>

                                  {expandedDescription[meal.id] && (
                                    <div className={styles.mealDetails}>
                                      {meal.description && (
                                        <p className={styles.mealDescription}>
                                          {meal.description}
                                        </p>
                                      )}

                                      {meal.steps && meal.steps.length > 0 && (
                                        <div className={styles.mealSteps}>
                                          <p className={styles.ingredientsHeader}>
                                            Steps:
                                          </p>
                                          <ol className={styles.mealStep}>
                                            {meal.steps.map(
                                              (step: string, index: number) => (
                                                <li key={index}>{step}</li>
                                              )
                                            )}
                                          </ol>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}

                              <div className={styles.dailyStatsRow}>
                                <div>
                                  <p className={styles.dailyStatLabel}>
                                    Total Calories
                                  </p>
                                  <p className={styles.dailyStatValue}>
                                    {dayPlan.daily_totals.calories}
                                  </p>
                                </div>
                                <div>
                                  <p className={styles.dailyStatLabel}>Protein</p>
                                  <p className={styles.dailyStatValue}>
                                    {Math.round(dayPlan.daily_totals.protein)}g
                                  </p>
                                </div>
                                <div>
                                  <p className={styles.dailyStatLabel}>Carbs</p>
                                  <p className={styles.dailyStatValue}>
                                    {Math.round(dayPlan.daily_totals.carbs)}g
                                  </p>
                                </div>
                                <div>
                                  <p className={styles.dailyStatLabel}>Fat</p>
                                  <p className={styles.dailyStatValue}>
                                    {Math.round(dayPlan.daily_totals.fat)}g
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination controls */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          <button
            className={styles.btn}
            disabled={page === 1 || loading}
            onClick={() => fetchHistory(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            className={styles.btn}
            disabled={page === totalPages || loading}
            onClick={() => fetchHistory(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}
