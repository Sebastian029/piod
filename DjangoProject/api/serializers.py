from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recipe


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

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'name', 'description', 'meal_type',
                  'protein', 'carbs', 'fat', 'calories',
                  'tags', "steps",
                  'n_steps', 'n_ingredients', 'ingredients']