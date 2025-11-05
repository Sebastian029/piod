from __future__ import annotations
import random
from typing import List, Tuple
from .ga_constraints import recipe_allowed
from .ga_fitness import compute_fitness
from .ga_types import GAConfig, MealPlan, MealPlanConstraints, Recipe


def group_recipes_by_meal_type(recipes: List[Recipe]) -> dict:
    recipe_groups = {}

    for index, recipe in enumerate(recipes):
        meal_type = str(recipe.get('meal_type', '') or '')

        if meal_type not in recipe_groups:
            recipe_groups[meal_type] = []

        recipe_groups[meal_type].append(index)

    return recipe_groups


def create_random_meal_plan(recipes: List[Recipe], constraints: MealPlanConstraints) -> MealPlan:
    recipe_groups = group_recipes_by_meal_type(recipes)
    weekly_plan = []

    for day_number in range(constraints.days):
        daily_meals = []

        for required_meal_type in constraints.required_meal_types:
            available_recipes = recipe_groups.get(required_meal_type, [])

            if available_recipes:
                random_recipe_index = random.choice(available_recipes)
                daily_meals.append(random_recipe_index)

        all_recipe_indices = list(range(len(recipes)))
        while len(daily_meals) < constraints.meals_per_day:
            random_recipe_index = random.choice(all_recipe_indices)
            daily_meals.append(random_recipe_index)

        daily_meals = daily_meals[:constraints.meals_per_day]
        weekly_plan.append(daily_meals)

    return MealPlan(
        plan=weekly_plan,
        meals_per_day=constraints.meals_per_day,
        days=constraints.days
    )


def select_parent_by_tournament(population: List[MealPlan], fitness_scores: List[float], tournament_size: int) -> int:
    best_index = None

    for round_number in range(tournament_size):
        random_index = random.randrange(0, len(population))

        if best_index is None or fitness_scores[random_index] > fitness_scores[best_index]:
            best_index = random_index

    return best_index


def create_children(parent1: MealPlan, parent2: MealPlan, crossover_rate: float) -> Tuple[MealPlan, MealPlan]:
    if random.random() > crossover_rate:
        return parent1.copy(), parent2.copy()

    child1 = parent1.copy()
    child2 = parent2.copy()

    split_day = random.randrange(1, parent1.days)

    for day in range(split_day, parent1.days):
        child1.plan[day], child2.plan[day] = child2.plan[day], child1.plan[day]

    return child1, child2


def mutate_meal_plan(meal_plan: MealPlan, recipes: List[Recipe], constraints: MealPlanConstraints,
                     mutation_rate: float) -> MealPlan:
    recipe_groups = group_recipes_by_meal_type(recipes)

    for day in range(meal_plan.days):
        for meal_slot in range(meal_plan.meals_per_day):

            if random.random() < mutation_rate:
                current_recipe_index = meal_plan.plan[day][meal_slot]
                current_meal_type = str(recipes[current_recipe_index].get('meal_type', '') or '')

                available_recipes = recipe_groups.get(current_meal_type, list(range(len(recipes))))

                if available_recipes:
                    new_recipe_index = random.choice(available_recipes)
                    meal_plan.plan[day][meal_slot] = new_recipe_index

    return meal_plan


def evolve(recipes: List[Recipe], constraints: MealPlanConstraints, ga: GAConfig, rng_seed: int | None = None) -> Tuple[
    MealPlan, float, dict]:

    if rng_seed is not None:
        random.seed(rng_seed)

    filtered_recipes = []
    for recipe in recipes:
        if recipe_allowed(recipe, constraints.diet_type, constraints.allergens, constraints.excluded_ingredients):
            filtered_recipes.append(recipe)
        else:
            recipe_copy = dict(recipe)
            recipe_copy['__banned__'] = True
            filtered_recipes.append(recipe_copy)

    population = []
    for i in range(ga.population_size):
        random_plan = create_random_meal_plan(filtered_recipes, constraints)
        population.append(random_plan)

    best_plan = None
    best_fitness = None
    best_details = None

    for generation in range(ga.generations):
        fitness_scores = []
        fitness_details = []

        for plan in population:
            fitness, details = compute_fitness(plan, filtered_recipes, constraints)
            fitness_scores.append(fitness)
            fitness_details.append(details)

        best_index_this_gen = max(range(len(population)), key=lambda i: fitness_scores[i])

        if best_plan is None or fitness_scores[best_index_this_gen] > best_fitness:
            best_plan = population[best_index_this_gen]
            best_fitness = fitness_scores[best_index_this_gen]
            best_details = fitness_details[best_index_this_gen]

        next_generation = []

        number_of_elites = max(0, ga.elitism)
        elite_indices = sorted(range(len(population)), key=lambda i: fitness_scores[i], reverse=True)
        elite_indices = elite_indices[:number_of_elites]

        for elite_index in elite_indices:
            next_generation.append(population[elite_index].copy())

        while len(next_generation) < ga.population_size:
            parent1_index = select_parent_by_tournament(population, fitness_scores, ga.tournament_size)
            parent2_index = select_parent_by_tournament(population, fitness_scores, ga.tournament_size)

            parent1 = population[parent1_index]
            parent2 = population[parent2_index]

            child1, child2 = create_children(parent1, parent2, ga.crossover_rate)

            child1 = mutate_meal_plan(child1, filtered_recipes, constraints, ga.mutation_rate)
            child2 = mutate_meal_plan(child2, filtered_recipes, constraints, ga.mutation_rate)

            next_generation.append(child1)
            next_generation.append(child2)

        population = next_generation[:ga.population_size]

    return best_plan, best_fitness, best_details
