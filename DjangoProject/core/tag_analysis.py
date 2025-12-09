from typing import Dict, List
from collections import Counter
import re


def parse_tags(tags_string: str) -> List[str]:

    if not tags_string:
        return []
    
    tags_string = tags_string.strip()
    tags_string = re.sub(r'[\[\]()]', '', tags_string)
    
    tags = re.split(r'[,;\s]+', tags_string)
    
    cleaned_tags = []
    for tag in tags:
        tag = tag.strip().lower()
        if tag and len(tag) > 1:
            cleaned_tags.append(tag)
    
    return cleaned_tags


def get_user_preferred_tags(user) -> Dict[str, float]:

    from api.models import UserRecipeRating
    
    ratings = UserRecipeRating.objects.filter(user=user).select_related('recipe')
    
    if not ratings.exists():
        return {}
    
    tag_weights = Counter()
    total_ratings = 0
    
    for rating_obj in ratings:
        recipe = rating_obj.recipe
        rating = rating_obj.rating
        total_ratings += 1
        
        tags = parse_tags(recipe.tags or '')

        if rating >= 4:
            weight = rating - 3
        elif rating <= 2:
            weight = rating - 3
        else:
            weight = 0
        
        for tag in tags:
            tag_weights[tag] += weight
    
    preferred_tags = dict(tag_weights)
    
    preferred_tags = {tag: weight for tag, weight in preferred_tags.items() if weight > 0}
    

    if total_ratings > 0 and preferred_tags:
        max_weight = max(preferred_tags.values()) if preferred_tags else 1.0
        if max_weight > 0:
            normalization_factor = 2.0 / max_weight
            preferred_tags = {tag: weight * normalization_factor for tag, weight in preferred_tags.items()}
    
    return preferred_tags


def calculate_tag_similarity(recipe_tags: str, preferred_tags: Dict[str, float]) -> float:
    if not preferred_tags:
        return 0.0
    
    recipe_tag_list = parse_tags(recipe_tags or '')
    if not recipe_tag_list:
        return 0.0
    
    similarity_score = 0.0
    for tag in recipe_tag_list:
        if tag in preferred_tags:
            similarity_score += preferred_tags[tag]
    
    return similarity_score


