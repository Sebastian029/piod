from django.db import models


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

    def __str__(self):
        return self.name
