from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe, UserDietPreferences, WeeklyMealPlan, DailyMeal


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']



class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'description', 'meal_type', 'protein', 'carbs',
            'fat', 'calories', 'tags', "steps", 'n_steps', 'n_ingredients',
            'ingredients', 'is_vegetarian', 'is_vegan',
            'is_low_carb', 'is_gluten_free', 'is_keto', 'is_pescetarian'
        ]



class UserDietPreferencesSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserDietPreferences
        fields = [
            'user',
            'username',
            'min_calories_per_day',
            'max_calories_per_day',
            'meals_per_day',
            'min_protein_per_day',
            'max_protein_per_day',
            'min_carbs_per_day',
            'max_carbs_per_day',
            'min_fat_per_day',
            'max_fat_per_day',
            'allergens',
            'excluded_ingredients',
            'diet_type',
        ]
        read_only_fields = ['user']

    def validate(self, data):
        instance = getattr(self, 'instance', None)

        min_cal = data.get('min_calories_per_day',
                           getattr(instance, 'min_calories_per_day', None) if instance else None)
        max_cal = data.get('max_calories_per_day',
                           getattr(instance, 'max_calories_per_day', None) if instance else None)

        if min_cal is not None and max_cal is not None and min_cal > max_cal:
            raise serializers.ValidationError({
                'min_calories_per_day': 'Minimum calories cannot be greater than maximum calories'
            })

        min_protein = data.get('min_protein_per_day',
                               getattr(instance, 'min_protein_per_day', None) if instance else None)
        max_protein = data.get('max_protein_per_day',
                               getattr(instance, 'max_protein_per_day', None) if instance else None)

        if min_protein is not None and max_protein is not None and min_protein > max_protein:
            raise serializers.ValidationError({
                'min_protein_per_day': 'Minimum protein cannot be greater than maximum protein'
            })

        min_carbs = data.get('min_carbs_per_day',
                             getattr(instance, 'min_carbs_per_day', None) if instance else None)
        max_carbs = data.get('max_carbs_per_day',
                             getattr(instance, 'max_carbs_per_day', None) if instance else None)

        if min_carbs is not None and max_carbs is not None and min_carbs > max_carbs:
            raise serializers.ValidationError({
                'min_carbs_per_day': 'Minimum carbs cannot be greater than maximum carbs'
            })

        min_fat = data.get('min_fat_per_day',
                           getattr(instance, 'min_fat_per_day', None) if instance else None)
        max_fat = data.get('max_fat_per_day',
                           getattr(instance, 'max_fat_per_day', None) if instance else None)

        if min_fat is not None and max_fat is not None and min_fat > max_fat:
            raise serializers.ValidationError({
                'min_fat_per_day': 'Minimum fat cannot be greater than maximum fat'
            })

        return data


# POPRAWIONE SERIALIZERY Z DATAMI

class DailyMealSerializer(serializers.ModelSerializer):
    recipes = RecipeSerializer(many=True, read_only=True)
    daily_totals = serializers.SerializerMethodField()

    class Meta:
        model = DailyMeal
        fields = ['id', 'date', 'day_number', 'recipes', 'daily_totals']

    def get_daily_totals(self, obj) -> dict[str, float]:
        return obj.get_totals()




class WeeklyMealPlanSerializer(serializers.ModelSerializer):
    days = DailyMealSerializer(many=True, read_only=True)
    weekly_totals = serializers.SerializerMethodField()

    class Meta:
        model = WeeklyMealPlan
        fields = [
            'start_date', 'end_date',
            'score', 'days', 'weekly_totals'
        ]

    def get_weekly_totals(self, obj) -> dict[str, float]:
        totals = {
            'calories': 0.0,
            'protein': 0.0,
            'carbs': 0.0,
            'fat': 0.0,
        }

        for day in obj.days.all():
            day_totals = day.get_totals()
            totals['calories'] += day_totals['calories']
            totals['protein'] += day_totals['protein']
            totals['carbs'] += day_totals['carbs']
            totals['fat'] += day_totals['fat']

        return totals


class WeeklyMealPlanSummarySerializer(serializers.ModelSerializer):

    class Meta:
        model = WeeklyMealPlan
        fields = ['start_date', 'end_date', 'score']
