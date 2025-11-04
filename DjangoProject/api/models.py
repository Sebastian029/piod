from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError


class Recipe(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    meal_type = models.CharField(max_length=50)
    protein = models.FloatField(default=0.0)
    carbs = models.FloatField(default=0.0)
    fat = models.FloatField(default=0.0)
    calories = models.FloatField(default=0.0)
    tags = models.TextField(blank=True, default='')
    steps = models.JSONField(default=list, blank=True)
    n_steps = models.IntegerField(default=0)
    n_ingredients = models.IntegerField(default=0)
    ingredients = models.JSONField(default=list, blank=True)
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class UserDietPreferences(models.Model):
    DIET_TYPE_CHOICES = [
        ('standard', 'Standardowa'),
        ('vegetarian', 'Wegetariańska'),
        ('vegan', 'Wegańska'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='diet_preferences',
        primary_key=True
    )

    min_calories_per_day = models.FloatField(
        default=1500,
        validators=[MinValueValidator(100), MaxValueValidator(10000)],
    )
    max_calories_per_day = models.FloatField(
        default=2500,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
    )
    meals_per_day = models.IntegerField(
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(6)],
    )
    min_protein_per_day = models.FloatField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
    )
    max_protein_per_day = models.FloatField(
        default=150,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
    )
    min_carbs_per_day = models.FloatField(
        default=150,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
    )
    max_carbs_per_day = models.FloatField(
        default=300,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
    )
    min_fat_per_day = models.FloatField(
        default=40,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
    )
    max_fat_per_day = models.FloatField(
        default=80,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
    )
    allergens = models.JSONField(
        default=list,
        blank=True,
    )
    excluded_ingredients = models.JSONField(
        default=list,
        blank=True,
    )

    diet_type = models.CharField(
        max_length=20,
        choices=DIET_TYPE_CHOICES,
        default='standard',
    )

    def __str__(self):
        return f"{self.user.username} preferences"

    def clean(self):
        errors = {}

        if self.min_calories_per_day > self.max_calories_per_day:
            errors['min_calories_per_day'] = 'calories range err'

        if self.min_protein_per_day > self.max_protein_per_day:
            errors['min_protein_per_day'] = 'protein range err'

        if self.min_carbs_per_day > self.max_carbs_per_day:
            errors['min_carbs_per_day'] = 'carbs range err'

        if self.min_fat_per_day > self.max_fat_per_day:
            errors['min_fat_per_day'] = 'fat range err'

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def get_target_calories(self):
        return (self.min_calories_per_day + self.max_calories_per_day) / 2

    def to_constraints_dict(self):
        return {
            'target_calories_per_day': self.get_target_calories(),
            'target_macros': {
                'protein': (self.min_protein_per_day, self.max_protein_per_day),
                'carbs': (self.min_carbs_per_day, self.max_carbs_per_day),
                'fat': (self.min_fat_per_day, self.max_fat_per_day),
            },
            'excluded_ingredients': self.excluded_ingredients,
            'allergens': self.allergens,
            'diet_type': self.diet_type if self.diet_type != 'standard' else None,
            'required_meal_types': self._build_required_meal_types(),
        }

    def _build_required_meal_types(self):
        meal_types_map = {}

        if self.meals_per_day == 1:
            meal_types_map = {0: ['lunch']}
        elif self.meals_per_day == 2:
            meal_types_map = {0: ['breakfast'], 1: ['dinner']}
        elif self.meals_per_day == 3:
            meal_types_map = {0: ['breakfast'], 1: ['lunch'], 2: ['dinner']}
        else:
            meal_types_map = {
                0: ['breakfast'],
                1: ['lunch'],
                2: ['dinner']
            }
            for i in range(3, self.meals_per_day):
                meal_types_map[i] = ['snack']

        return meal_types_map
