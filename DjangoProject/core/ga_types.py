from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Literal, Optional, Tuple


DietType = Literal['standard', 'vegetarian', 'vegan']


@dataclass
class MacroRange:
    protein_g: Tuple[float, float]
    carbs_g: Tuple[float, float]
    fat_g: Tuple[float, float]


@dataclass
class MealPlanConstraints:
    days: int
    meals_per_day: int
    required_meal_types: List[str]
    calories_target_per_day: float
    macros_per_day: MacroRange
    excluded_ingredients: List[str]
    allergens: List[str]
    diet_type: DietType
    diversity_window_days: int = 3
    preferred_tags: Optional[Dict[str, float]] = None
    fitness_multipliers: Dict[str, float] = field(default_factory=lambda: {
        'calories': 1.0,
        'macros': 1.0,
        'tags': 1.0
    })


@dataclass
class GAConfig:
    population_size: int = 80
    generations: int = 60
    crossover_rate: float = 0.85
    mutation_rate: float = 0.15
    tournament_size: int = 4
    elitism: int = 2


Recipe = Dict[str, object]


@dataclass
class MealPlan:
    plan: List[List[int]]
    meals_per_day: int
    days: int

    def copy(self) -> 'MealPlan':
        return MealPlan(
            plan=[day.copy() for day in self.plan],
            meals_per_day=self.meals_per_day,
            days=self.days,
        )


