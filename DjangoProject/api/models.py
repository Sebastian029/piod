from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


from django.db import models


class Recipe(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    meal_type = models.CharField(max_length=50)

    # Wartości odżywcze
    protein = models.FloatField(default=0.0)
    carbs = models.FloatField(default=0.0)
    fat = models.FloatField(default=0.0)
    calories = models.FloatField(default=0.0)

    tags = models.TextField(blank=True, default='')
    steps = models.JSONField(default=list, blank=True)  # <-- DODAJ TO!


    # Dodatkowe pola
    n_steps = models.IntegerField(default=0)
    n_ingredients = models.IntegerField(default=0)

    # Lista składników jako JSONField (działa na każdej bazie!)
    ingredients = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name
