from typing import Dict, List
from django.conf import settings
import os
import pandas as pd
import random


def load_data(max_recipes: int = 10000) -> pd.DataFrame:
    csv_path = os.path.join(settings.BASE_DIR, 'core', 'recipes_data.csv')

    df = pd.read_csv(csv_path,
                     engine='python',
                     quotechar='"',
                     sep=',',
                     on_bad_lines='skip',
                     dtype=str)

    if max_recipes is not None:
        df = df.head(max_recipes)

    # Parse ingredients
    ingredients_parsed = []
    for ing_str in df['ingredients']:
        try:
            clean = ing_str.strip('[]').replace("'", "").replace('"', '')
            ingredients_parsed.append([item.strip() for item in clean.split(',') if item.strip()])
        except:
            ingredients_parsed.append([])
    df['ingredients_list'] = ingredients_parsed

    # Parse steps
    steps_parsed = []
    for step_str in df.get('steps', []):
        try:
            clean = step_str.strip('[]').replace("'", "").replace('"', '')
            steps_parsed.append([item.strip() for item in clean.split(',') if item.strip()])
        except:
            steps_parsed.append([])
    df['steps_list'] = steps_parsed

    # Parse nutrition
    nutrition_parsed = []
    for nutr_str in df['nutrition']:
        try:
            clean = nutr_str.strip('[]').replace("'", "").replace('"', '')
            values = [item.strip() for item in clean.split(',') if item.strip()]
            nutrition_parsed.append([float(v) for v in values])
        except:
            nutrition_parsed.append([0, 0, 0, 0, 0, 0, 0])
    df['nutrition_list'] = nutrition_parsed

    # Extract nutrition values
    df['calories'] = df['nutrition_list'].apply(lambda x: float(x[0]) if len(x) > 0 else 0)
    df['fat'] = df['nutrition_list'].apply(lambda x: float(x[1]) if len(x) > 1 else 0)
    df['protein'] = df['nutrition_list'].apply(lambda x: float(x[4]) if len(x) > 4 else 0)
    df['carbs'] = df['nutrition_list'].apply(lambda x: float(x[6]) if len(x) > 6 else 0)

    # Convert n_steps and n_ingredients to int
    df['n_steps'] = pd.to_numeric(df.get('n_steps', 0), errors='coerce').fillna(0).astype(int)
    df['n_ingredients'] = pd.to_numeric(df.get('n_ingredients', 0), errors='coerce').fillna(0).astype(int)

    # Convert preparation time if exists
    df['minutes'] = pd.to_numeric(df.get('minutes', 0), errors='coerce').fillna(0).astype(int)

    # Filter valid recipes
    df = df[(df['calories'] > 0) & (df['protein'] >= 0) & (df['carbs'] >= 0)]

    return df


def classify_meal_type(row) -> str:
    tags_str = str(row['tags']).lower()
    name_str = str(row['name']).lower()
    calories = row['calories']

    breakfast_keywords = ['breakfast', 'brunch', 'morning', 'cereal', 'pancake',
                          'waffle', 'oatmeal', 'egg', 'toast', 'coffee', 'muffin']

    snack_keywords = ['snack', 'appetizer', 'finger-food', 'smoothie', 'shake',
                      'bar', 'bite', 'dip', 'spread', 'fruit', 'yogurt']

    lunch_keywords = ['lunch', 'sandwich', 'salad', 'soup', 'wrap', 'bowl']

    dinner_keywords = ['dinner', 'main-dish', 'meat', 'poultry', 'beef',
                       'pork', 'chicken', 'steak', 'roast', 'pasta', 'rice']

    if calories >= 250 and calories <= 450:
        if any(keyword in tags_str or keyword in name_str for keyword in breakfast_keywords):
            return 'breakfast'

    if calories >= 100 and calories <= 350:
        if any(keyword in tags_str or keyword in name_str for keyword in snack_keywords):
            return random.choice(['second_breakfast', 'snack'])

    if calories >= 400 and calories <= 700:
        if any(keyword in tags_str or keyword in name_str for keyword in lunch_keywords):
            return 'lunch'
        if any(keyword in tags_str or keyword in name_str for keyword in dinner_keywords):
            return 'lunch'

    if calories >= 350 and calories <= 650:
        if any(keyword in tags_str or keyword in name_str for keyword in dinner_keywords):
            return 'dinner'

    if calories < 250:
        return random.choice(['second_breakfast', 'snack'])
    elif calories < 400:
        return 'breakfast'
    elif calories < 600:
        return random.choice(['lunch', 'dinner'])
    else:
        return 'lunch'


def prepare_recipes(df: pd.DataFrame) -> List[Dict]:
    df['meal_type'] = df.apply(classify_meal_type, axis=1)

    recipes = []
    for _, row in df.iterrows():
        recipe = {
            'id': row['id'],
            'name': row['name'],
            'description': str(row.get('description', '')),
            'meal_type': row['meal_type'],
            'protein': row['protein'],
            'carbs': row['carbs'],
            'fat': row['fat'],
            'calories': row['calories'],
            'ingredients': row['ingredients_list'],
            'steps': row.get('steps_list', []),
            'tags': str(row['tags']).lower(),
            'preparation_time': int(row.get('minutes', 0)),
            'preparation_guide': '\n'.join(row.get('steps_list', [])),
            'n_steps': int(row.get('n_steps', 0)),
            'n_ingredients': int(row.get('n_ingredients', 0))
        }
        recipes.append(recipe)

    return recipes

