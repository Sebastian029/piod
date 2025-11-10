from rest_framework import status, generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .serializers import RegisterSerializer, RecipeSerializer, UserDietPreferencesSerializer
from .models import Recipe, UserDietPreferences
from core.get_data import load_data, prepare_recipes
from core.ga_types import GAConfig, MacroRange, MealPlanConstraints
from core.ga_engine import evolve


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "User registered successfully"}, status=status.HTTP_201_CREATED)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "This is a protected resource",
            "user": request.user.username,
        })


class UploadRecipesView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            df = load_data()
            recipes_data = prepare_recipes(df)
            created_count = self.upload_to_database(recipes_data)

            return Response({
                'success': True,
                'message': f'Successfully uploaded {created_count} recipes!',
                'count': created_count
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

    def upload_to_database(self, recipes_data):
        created_count = 0
        skipped_count = 0

        with transaction.atomic():
            for recipe_data in recipes_data:
                try:
                    # Check if recipe already exists
                    if Recipe.objects.filter(name=recipe_data['name']).exists():
                        skipped_count += 1
                        continue

                    # Create Recipe with all fields
                    Recipe.objects.create(
                        name=recipe_data['name'],
                        description=recipe_data.get('description', ''),
                        meal_type=recipe_data['meal_type'],
                        protein=float(recipe_data['protein']),
                        carbs=float(recipe_data['carbs']),
                        fat=float(recipe_data['fat']),
                        calories=float(recipe_data['calories']),
                        tags=recipe_data['tags'],
                        n_steps=int(recipe_data.get('n_steps', 0)),
                        n_ingredients=int(recipe_data.get('n_ingredients', 0)),
                        ingredients=recipe_data['ingredients'],
                        steps=recipe_data.get('steps', []),
                        is_vegetarian=recipe_data['is_vegetarian'],
                        is_vegan=recipe_data['is_vegan']
                    )

                    created_count += 1

                except Exception as e:
                    print(f"Error creating recipe {recipe_data.get('name', 'unknown')}: {str(e)}")
                    continue

        return created_count



class RecipeDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk=None):
        if pk:
            try:
                recipe = Recipe.objects.get(pk=pk)
                serializer = RecipeSerializer(recipe)
                return Response(serializer.data)
            except Recipe.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            recipes = Recipe.objects.all()
            serializer = RecipeSerializer(recipes, many=True)
            return Response(serializer.data)


class DeleteAllRecipesView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request):
        try:
            with transaction.atomic():
                recipe_count = Recipe.objects.count()
                Recipe.objects.all().delete()

                return Response({
                    'success': True,
                    'message': 'All recipes deleted successfully!',
                    'deleted_recipes': recipe_count
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserDietPreferencesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDietPreferencesSerializer

    def list(self, request):
        preferences, created = UserDietPreferences.objects.get_or_create(
            user=request.user
        )

        serializer = UserDietPreferencesSerializer(preferences)
        return Response(serializer.data)

    def create(self, request):
        if UserDietPreferences.objects.filter(user=request.user).exists():
            return Response(
                {'detail': 'Preferences already exist. Use PUT or PATCH to update.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserDietPreferencesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request):
        try:
            preferences = UserDietPreferences.objects.get(user=request.user)
        except UserDietPreferences.DoesNotExist:
            return Response(
                {'detail': 'Preferences not found. Create them first.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserDietPreferencesSerializer(
            preferences,
            data=request.data,
            partial=False
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request):
        try:
            preferences = UserDietPreferences.objects.get(user=request.user)
        except UserDietPreferences.DoesNotExist:
            return Response(
                {'detail': 'Preferences not found. Create them first.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserDietPreferencesSerializer(
            preferences,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request):
        try:
            preferences = UserDietPreferences.objects.get(user=request.user)
            preferences.delete()
            return Response(
                {'detail': 'Preferences deleted'},
                status=status.HTTP_204_NO_CONTENT
            )
        except UserDietPreferences.DoesNotExist:
            return Response(
                {'detail': 'Preferences not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class GenerateWeeklyPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            preferences, _ = UserDietPreferences.objects.get_or_create(user=request.user)
        except Exception as e:
            return Response({'detail': f'Preferences error: {e}'}, status=status.HTTP_400_BAD_REQUEST)

        if preferences.meals_per_day <= 1:
            required_types = ['lunch']
        elif preferences.meals_per_day == 2:
            required_types = ['breakfast', 'dinner']
        else:
            required_types = ['breakfast', 'lunch', 'dinner']

        constraints = MealPlanConstraints(
            days=7,
            meals_per_day=preferences.meals_per_day,
            required_meal_types=required_types,
            calories_target_per_day=preferences.get_target_calories(),
            macros_per_day=MacroRange(
                protein_g=(preferences.min_protein_per_day, preferences.max_protein_per_day),
                carbs_g=(preferences.min_carbs_per_day, preferences.max_carbs_per_day),
                fat_g=(preferences.min_fat_per_day, preferences.max_fat_per_day),
            ),
            excluded_ingredients=list(preferences.excluded_ingredients or []),
            allergens=list(preferences.allergens or []),
            diet_type=preferences.diet_type,
            diversity_window_days=7,
        )

        qs = Recipe.objects.all()
        recipes = []
        for r in qs:
            recipe_dict = {
                'id': r.id,
                'name': r.name,
                'description': r.description,
                'meal_type': r.meal_type,
                'protein': float(r.protein),
                'carbs': float(r.carbs),
                'fat': float(r.fat),
                'calories': float(r.calories),
                'ingredients': list(r.ingredients or []),
                'steps': list(r.steps or []),
                'tags': r.tags,
                'n_steps': int(r.n_steps),
                'n_ingredients': int(r.n_ingredients),
                'is_vegetarian': bool(r.is_vegetarian),
                'is_vegan': bool(r.is_vegan),
            }
            recipes.append(recipe_dict)

        if not recipes:
            return Response({'detail': 'No recipes available. Load recipes first.'}, status=status.HTTP_400_BAD_REQUEST)

        ga = GAConfig()
        best_plan, best_score, result = evolve(recipes, constraints, ga, rng_seed=1)

        # Calculate weekly totals
        result_days = []
        weekly_totals = {
            'calories': 0.0,
            'protein': 0.0,
            'carbs': 0.0,
            'fat': 0.0,
        }

        for d in range(constraints.days):
            day_items = []
            day_totals = {
                'calories': 0.0,
                'protein': 0.0,
                'carbs': 0.0,
                'fat': 0.0,
            }

            for idx in best_plan.plan[d]:
                r = recipes[idx]
                meal_data = {
                    'id': r['id'],
                    'name': r['name'],
                    'meal_type': r['meal_type'],
                    'calories': r['calories'],
                    'protein': r['protein'],
                    'carbs': r['carbs'],
                    'fat': r['fat'],
                }
                day_items.append(meal_data)

                # Sum for the day
                day_totals['calories'] += r['calories']
                day_totals['protein'] += r['protein']
                day_totals['carbs'] += r['carbs']
                day_totals['fat'] += r['fat']

            # Sum for the week
            weekly_totals['calories'] += day_totals['calories']
            weekly_totals['protein'] += day_totals['protein']
            weekly_totals['carbs'] += day_totals['carbs']
            weekly_totals['fat'] += day_totals['fat']

            result_days.append({
                'day': d + 1,
                'meals': day_items,
                'daily_totals': {
                    'calories': round(day_totals['calories'], 2),
                    'protein': round(day_totals['protein'], 2),
                    'carbs': round(day_totals['carbs'], 2),
                    'fat': round(day_totals['fat'], 2),
                }
            })

        # User preferences (targets)
        user_preferences = {
            'meals_per_day': preferences.meals_per_day,
            'diet_type': preferences.diet_type,
            'daily_targets': {
                'calories': preferences.get_target_calories(),
                'protein': {
                    'min': preferences.min_protein_per_day,
                    'max': preferences.max_protein_per_day,
                },
                'carbs': {
                    'min': preferences.min_carbs_per_day,
                    'max': preferences.max_carbs_per_day,
                },
                'fat': {
                    'min': preferences.min_fat_per_day,
                    'max': preferences.max_fat_per_day,
                },
            },
            'weekly_targets': {
                'calories': preferences.get_target_calories() * 7,
                'protein': {
                    'min': preferences.min_protein_per_day * 7,
                    'max': preferences.max_protein_per_day * 7,
                },
                'carbs': {
                    'min': preferences.min_carbs_per_day * 7,
                    'max': preferences.max_carbs_per_day * 7,
                },
                'fat': {
                    'min': preferences.min_fat_per_day * 7,
                    'max': preferences.max_fat_per_day * 7,
                },
            },
            'excluded_ingredients': list(preferences.excluded_ingredients or []),
            'allergens': list(preferences.allergens or []),
        }

        return Response({
            'score': best_score,
            'fitness_breakdown': {
                'calories_penalty': result.get('calories', 0),
                'meals_count_penalty': result.get('meals_count', 0),
                'required_types_penalty': result.get('required_types', 0),
                'macros_penalty': result.get('macros', 0),
                'allergens_penalty': result.get('allergens', 0),
                'diversity_penalty': result.get('diversity', 0),
                'diet_bonus': result.get('diet_bonus', 0),
            },
            'user_preferences': user_preferences,
            'weekly_totals': {
                'calories': round(weekly_totals['calories'], 2),
                'protein': round(weekly_totals['protein'], 2),
                'carbs': round(weekly_totals['carbs'], 2),
                'fat': round(weekly_totals['fat'], 2),
            },
            'days': result_days,
        }, status=status.HTTP_200_OK)
