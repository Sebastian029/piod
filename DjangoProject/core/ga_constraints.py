from __future__ import annotations
from typing import Dict, List


def recipe_matches_diet(recipe: Dict[str, object], diet_type: str) -> bool:
    if diet_type == 'standard':
        return True
    if diet_type == 'vegetarian':
        return bool(recipe.get('is_vegetarian', False) or recipe.get('is_vegan', False))
    if diet_type == 'vegan':
        return bool(recipe.get('is_vegan', False))
    if diet_type == 'low_carb':
        return bool(recipe.get('is_low_carb', False))
    if diet_type == 'gluten_free':
        return bool(recipe.get('is_gluten_free', False))
    if diet_type == 'keto':
        return bool(recipe.get('is_keto', False))
    if diet_type == 'pescetarian':
        return bool(recipe.get('is_pescetarian', False))
    return True



def recipe_contains_any(recipe: Dict[str, object], banned_terms: List[str]) -> bool:
    if not banned_terms:
        return False
    text_parts: List[str] = []
    ingredients = recipe.get('ingredients', []) or []
    text_parts.extend([str(x).lower() for x in ingredients])
    text_parts.append(str(recipe.get('name', '')).lower())
    text_parts.append(str(recipe.get('tags', '')).lower())
    blob = ' '.join(text_parts)
    for term in banned_terms:
        if term.lower() in blob:
            return True
    return False


def recipe_allowed(recipe: Dict[str, object], diet_type: str, allergens: List[str], excluded: List[str]) -> bool:
    if not recipe_matches_diet(recipe, diet_type):
        return False
    if recipe_contains_any(recipe, allergens):
        return False
    if recipe_contains_any(recipe, excluded):
        return False
    return True


