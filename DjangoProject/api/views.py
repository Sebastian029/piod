from datetime import datetime, timedelta
from django.db import transaction

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import Recipe, UserDietPreferences, WeeklyMealPlan, DailyMeal
from .serializers import (
    UserSerializer,
    DailyMealSerializer,
    RecipeSerializer,
    RegisterSerializer,
    UserDietPreferencesSerializer,
    WeeklyMealPlanSerializer,
    WeeklyMealPlanSummarySerializer,
)
from core.ga_engine import evolve
from core.ga_types import GAConfig, MacroRange, MealPlanConstraints
from core.get_data import load_data, prepare_recipes


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=RegisterSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=UserSerializer)
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


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

        with transaction.atomic():
            for recipe_data in recipes_data:
                try:
                    if Recipe.objects.filter(name=recipe_data['name']).exists():
                        continue

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
                    print(f"Error creating recipe: {str(e)}")
                    continue

        return created_count


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


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

    @extend_schema(responses=UserDietPreferencesSerializer)
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

class GeneratePlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        preferences, _ = UserDietPreferences.objects.get_or_create(user=request.user)

        recipes = []
        for r in Recipe.objects.all():
            recipes.append({
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
            })

        if not recipes:
            return Response({'detail': 'No recipes'}, status=status.HTTP_400_BAD_REQUEST)

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

        ga = GAConfig()

        WeeklyMealPlan.objects.filter(user=request.user).delete()

        created_plans = []

        today = datetime.now().date()
        current_week_start = WeeklyMealPlan.get_week_start(today)

        try:
            with transaction.atomic():
                for week_offset in range(3):
                    week_start = current_week_start + timedelta(weeks=week_offset)
                    week_end = WeeklyMealPlan.get_week_end(week_start)

                    best_plan, best_score, result = evolve(
                        recipes,
                        constraints,
                        ga,
                        rng_seed= week_offset
                    )

                    weekly_plan, created = WeeklyMealPlan.objects.update_or_create(
                        user=request.user,
                        start_date=week_start,
                        defaults={
                            'end_date': week_end,
                            'score': best_score
                        }
                    )

                    for day_idx in range(7):
                        day_date = week_start + timedelta(days=day_idx)

                        daily_meal = DailyMeal.objects.create(
                            weekly_plan=weekly_plan,
                            date=day_date,
                            day_number=day_idx + 1
                        )

                        recipe_ids = [recipes[idx]['id'] for idx in best_plan.plan[day_idx]]
                        recipe_objects = Recipe.objects.filter(id__in=recipe_ids)
                        daily_meal.recipes.set(recipe_objects)

                    created_plans.append(weekly_plan)

            serializer = WeeklyMealPlanSerializer(created_plans, many=True)

            return Response({
                'success': True,
                'weeks': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class WeeklyMealPlanViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WeeklyMealPlanSerializer

    def get_queryset(self):
        return WeeklyMealPlan.objects.filter(
            user=self.request.user
        ).prefetch_related('days__recipes')

    @action(detail=False, methods=['get'])
    @extend_schema(responses=WeeklyMealPlanSerializer)
    def current(self, request):
        today = datetime.now().date()
        week_start = WeeklyMealPlan.get_week_start(today)

        try:
            plan = self.get_queryset().get(start_date=week_start)
            serializer = WeeklyMealPlanSerializer(plan)
            return Response(serializer.data)
        except WeeklyMealPlan.DoesNotExist:
            return Response({'detail': 'Brak planu'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    @extend_schema(
        parameters=[
            OpenApiParameter(name='date', type=str, required=True, location=OpenApiParameter.QUERY)
        ],
        responses=WeeklyMealPlanSerializer
    )
    def by_date(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'detail': 'Brak daty'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            week_start = WeeklyMealPlan.get_week_start(date)
            plan = self.get_queryset().get(start_date=week_start)
            serializer = WeeklyMealPlanSerializer(plan)
            return Response(serializer.data)
        except ValueError:
            return Response({'detail': 'YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
        except WeeklyMealPlan.DoesNotExist:
            return Response({'detail': 'Brak planu'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def current_test(self, request):
        today = datetime.now().date()
        week_start = WeeklyMealPlan.get_week_start(today)

        try:
            plan = self.get_queryset().get(start_date=week_start)
            preferences, _ = UserDietPreferences.objects.get_or_create(user=request.user)

            weekly_actual = {
                'calories': 0.0,
                'protein': 0.0,
                'carbs': 0.0,
                'fat': 0.0,
            }

            for day in plan.days.all():
                day_totals = day.get_totals()
                weekly_actual['calories'] += day_totals['calories']
                weekly_actual['protein'] += day_totals['protein']
                weekly_actual['carbs'] += day_totals['carbs']
                weekly_actual['fat'] += day_totals['fat']

            weekly_target = {
                'calories': {
                    'min': preferences.min_calories_per_day * 7,
                    'max': preferences.max_calories_per_day * 7,
                    'target': preferences.get_target_calories() * 7,
                },
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
            }

            comparison = {
                'calories': {
                    'actual': round(weekly_actual['calories'], 2),
                    'target': round(weekly_target['calories']['target'], 2),
                    'min': round(weekly_target['calories']['min'], 2),
                    'max': round(weekly_target['calories']['max'], 2),
                    'difference': round(weekly_actual['calories'] - weekly_target['calories']['target'], 2),
                    'percentage': round((weekly_actual['calories'] / weekly_target['calories']['target'] * 100) if
                                        weekly_target['calories']['target'] > 0 else 0, 1),
                    'in_range': weekly_target['calories']['min'] <= weekly_actual['calories'] <=
                                weekly_target['calories']['max'],
                },
                'protein': {
                    'actual': round(weekly_actual['protein'], 2),
                    'min': round(weekly_target['protein']['min'], 2),
                    'max': round(weekly_target['protein']['max'], 2),
                    'difference_from_min': round(weekly_actual['protein'] - weekly_target['protein']['min'], 2),
                    'in_range': weekly_target['protein']['min'] <= weekly_actual['protein'] <= weekly_target['protein'][
                        'max'],
                },
                'carbs': {
                    'actual': round(weekly_actual['carbs'], 2),
                    'min': round(weekly_target['carbs']['min'], 2),
                    'max': round(weekly_target['carbs']['max'], 2),
                    'difference_from_min': round(weekly_actual['carbs'] - weekly_target['carbs']['min'], 2),
                    'in_range': weekly_target['carbs']['min'] <= weekly_actual['carbs'] <= weekly_target['carbs'][
                        'max'],
                },
                'fat': {
                    'actual': round(weekly_actual['fat'], 2),
                    'min': round(weekly_target['fat']['min'], 2),
                    'max': round(weekly_target['fat']['max'], 2),
                    'difference_from_min': round(weekly_actual['fat'] - weekly_target['fat']['min'], 2),
                    'in_range': weekly_target['fat']['min'] <= weekly_actual['fat'] <= weekly_target['fat']['max'],
                },
            }

            plan_serializer = WeeklyMealPlanSerializer(plan)

            user_preferences = {
                'meals_per_day': preferences.meals_per_day,
                'diet_type': preferences.diet_type,
                'daily_targets': {
                    'calories': {
                        'min': preferences.min_calories_per_day,
                        'max': preferences.max_calories_per_day,
                        'target': preferences.get_target_calories(),
                    },
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
                'excluded_ingredients': list(preferences.excluded_ingredients or []),
                'allergens': list(preferences.allergens or []),
            }

            return Response({
                'plan': plan_serializer.data,
                'user_preferences': user_preferences,
                'weekly_comparison': comparison,
                'summary': {
                    'all_in_range': all([
                        comparison['calories']['in_range'],
                        comparison['protein']['in_range'],
                        comparison['carbs']['in_range'],
                        comparison['fat']['in_range'],
                    ]),

                }
            })

        except WeeklyMealPlan.DoesNotExist:
            return Response(
                {'detail': 'Brak planu'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        count = self.get_queryset().count()
        self.get_queryset().delete()
        return Response({'detail': f'Succes'}, status=status.HTTP_200_OK)


class DailyMealView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=DailyMealSerializer)
    def get(self, request, date_str):
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'detail': 'YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            daily_meal = DailyMeal.objects.prefetch_related('recipes').get(
                weekly_plan__user=request.user,
                date=date
            )
            serializer = DailyMealSerializer(daily_meal)
            return Response(serializer.data)
        except DailyMeal.DoesNotExist:
            return Response({'detail': f'Brak planu'}, status=status.HTTP_404_NOT_FOUND)
