from __future__ import annotations
from typing import Dict, List, Tuple
from .ga_types import MealPlan, MealPlanConstraints, Recipe
from .tag_analysis import calculate_tag_similarity


def _day_totals(day_recipes: List[Recipe]) -> Dict[str, float]:
    calories = sum(float(r.get('calories', 0) or 0) for r in day_recipes)
    protein = sum(float(r.get('protein', 0) or 0) for r in day_recipes)
    carbs = sum(float(r.get('carbs', 0) or 0) for r in day_recipes)
    fat = sum(float(r.get('fat', 0) or 0) for r in day_recipes)
    return {
        'calories': calories,
        'protein': protein,
        'carbs': carbs,
        'fat': fat,
    }


def _meal_type_for(recipe: Recipe) -> str:
    return str(recipe.get('meal_type', '') or '')


def compute_fitness(
    plan: MealPlan,
    recipes: List[Recipe],
    constraints: MealPlanConstraints,
) -> Tuple[float, Dict[str, float]]:
    score = 1000.0
    breakdown: Dict[str, float] = {}

    kcal_penalty = 0.0
    for d in range(constraints.days):
        day_rcps = [recipes[idx] for idx in plan.plan[d]]
        totals = _day_totals(day_rcps)
        diff = totals['calories'] - constraints.calories_target_per_day
        kcal_penalty += (diff / max(constraints.calories_target_per_day, 1.0)) ** 2 * 200.0
    score -= kcal_penalty
    breakdown['calories'] = -kcal_penalty

    meals_penalty = 0.0
    for d in range(constraints.days):
        if len(plan.plan[d]) != constraints.meals_per_day:
            meals_penalty += 200.0
    score -= meals_penalty
    breakdown['meals_count'] = -meals_penalty

    type_penalty = 0.0
    for d in range(constraints.days):
        day_types = [_meal_type_for(recipes[idx]) for idx in plan.plan[d]]
        for req in constraints.required_meal_types:
            if req not in day_types:
                type_penalty += 50.0
    score -= type_penalty
    breakdown['required_types'] = -type_penalty

    macros_penalty = 0.0
    for d in range(constraints.days):
        totals = _day_totals([recipes[idx] for idx in plan.plan[d]])
        for key, rng in [('protein', constraints.macros_per_day.protein_g),
                          ('carbs', constraints.macros_per_day.carbs_g),
                          ('fat', constraints.macros_per_day.fat_g)]:
            low, high = rng
            val = totals[key]
            if val < low:
                macros_penalty += (low - val) * 0.5
            elif val > high:
                macros_penalty += (val - high) * 0.5
    score -= macros_penalty
    breakdown['macros'] = -macros_penalty

    allergy_penalty = 0.0
    for d in range(constraints.days):
        for idx in plan.plan[d]:
            r = recipes[idx]
            if r.get('__banned__'):
                allergy_penalty += 500.0
    score -= allergy_penalty
    breakdown['allergens'] = -allergy_penalty

    div_penalty = 0.0
    seen_window: List[int] = []
    window = max(1, constraints.diversity_window_days) * constraints.meals_per_day
    flat = [idx for day in plan.plan for idx in day]
    for i, idx in enumerate(flat):
        if idx in seen_window:
            div_penalty += 15.0
        seen_window.append(idx)
        if len(seen_window) > window:
            seen_window.pop(0)
    score -= div_penalty
    breakdown['diversity'] = -div_penalty

    diet_bonus = 0.0
    for d in range(constraints.days):
        for idx in plan.plan[d]:
            r = recipes[idx]

            if constraints.diet_type == 'vegetarian' and (r.get('is_vegetarian') or r.get('is_vegan')):
                diet_bonus += 2.0
            elif constraints.diet_type == 'vegan' and r.get('is_vegan'):
                diet_bonus += 3.0
            elif constraints.diet_type == 'low_carb' and r.get('is_low_carb'):
                diet_bonus += 2.5
            elif constraints.diet_type == 'gluten_free' and r.get('is_gluten_free'):
                diet_bonus += 2.0
            elif constraints.diet_type == 'keto' and r.get('is_keto'):
                diet_bonus += 3.0
            elif constraints.diet_type == 'pescetarian' and r.get('is_pescetarian'):
                diet_bonus += 2.0
            elif constraints.diet_type == 'standard':
                diet_bonus += 1.0
            else:
                diet_bonus += 0.5
    score += diet_bonus
    breakdown['diet_bonus'] = diet_bonus


    tag_bonus = 0.0
    if constraints.preferred_tags:
        for d in range(constraints.days):
            for idx in plan.plan[d]:
                r = recipes[idx]
                recipe_tags = str(r.get('tags', '') or '')
                similarity = calculate_tag_similarity(recipe_tags, constraints.preferred_tags)

                tag_bonus += similarity * 2.0
    score += tag_bonus
    breakdown['tag_similarity'] = tag_bonus

    return score, breakdown


