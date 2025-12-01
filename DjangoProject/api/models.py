from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta


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
    is_low_carb = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    is_keto = models.BooleanField(default=False)
    is_pescetarian = models.BooleanField(default=False)

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
    min_calories_per_day = models.FloatField(default=1500,
                                             validators=[MinValueValidator(100), MaxValueValidator(10000)])
    max_calories_per_day = models.FloatField(default=2500, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    meals_per_day = models.IntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(6)])
    min_protein_per_day = models.FloatField(default=50, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    max_protein_per_day = models.FloatField(default=150, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    min_carbs_per_day = models.FloatField(default=150, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    max_carbs_per_day = models.FloatField(default=300, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    min_fat_per_day = models.FloatField(default=40, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    max_fat_per_day = models.FloatField(default=80, validators=[MinValueValidator(0), MaxValueValidator(5000)])
    allergens = models.JSONField(default=list, blank=True)
    excluded_ingredients = models.JSONField(default=list, blank=True)
    diet_type = models.CharField(max_length=20, choices=DIET_TYPE_CHOICES, default='standard')

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
    
    def get_target_calories(self) -> float:
        return (self.min_calories_per_day + self.max_calories_per_day) / 2


class WeeklyMealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weekly_plans')

    start_date = models.DateField()
    end_date = models.DateField()

    score = models.FloatField(default=0.0)

    class Meta:
        ordering = ['start_date']
        unique_together = ['user', 'start_date']

    @staticmethod
    def get_week_start(date=None):
        if date is None:
            date = datetime.now().date()
        start = date - timedelta(days=date.weekday())
        return start

    @staticmethod
    def get_week_end(start_date) -> datetime:
        return start_date + timedelta(days=6)


class DailyMeal(models.Model):
    weekly_plan = models.ForeignKey(WeeklyMealPlan, on_delete=models.CASCADE, related_name='days')

    date = models.DateField()
    day_number = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(7)])

    recipes = models.ManyToManyField(Recipe, related_name='daily_meals', blank=True)

    class Meta:
        ordering = ['date']
        unique_together = ['weekly_plan', 'date']


    def get_totals(self) -> dict[str, float]:
        recipes_list = self.recipes.all()
        return {
            'calories': sum(r.calories for r in recipes_list),
            'protein': sum(r.protein for r in recipes_list),
            'carbs': sum(r.carbs for r in recipes_list),
            'fat': sum(r.fat for r in recipes_list),
        }