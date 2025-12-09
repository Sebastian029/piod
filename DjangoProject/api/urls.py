from django.urls import path
from .views import RegisterView, ProtectedView, UserDietPreferencesViewSet, IngredientView, DietExcludedIngredientsView, \
    DietTypesView, RecipeRatingViewSet
from . import views

preferences_list = UserDietPreferencesViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

ratings_list = RecipeRatingViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

ratings_detail = RecipeRatingViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [

    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('user/', views.CurrentUserView.as_view(), name='protected'),


    path('recipes/', views.RecipeViewSet.as_view({'get': 'list'}), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeViewSet.as_view({'get': 'retrieve'}), name='recipe-detail'),
    path('recipes/load/', views.UploadRecipesView.as_view(), name='upload-recipes'),
    path('recipes/delete-all/', views.DeleteAllRecipesView.as_view(), name='delete-all-recipes'),

    path('preferences/', preferences_list, name='user-preferences'),
    path('ingredients/', IngredientView.as_view(), name='ingredients-list'),
    path('diets/', DietTypesView.as_view(), name='diet-types'),

    path('diet-excluded/', DietExcludedIngredientsView.as_view(), name='diet-excluded-ingredients'),



    path('plans/generate/', views.GeneratePlanView.as_view(), name='generate-3-weeks'),
    path('plans/current/', views.WeeklyMealPlanViewSet.as_view({'get': 'current'}), name='current-week-plan'),
    path('plans/current-test/', views.WeeklyMealPlanViewSet.as_view({'get': 'current_test'}), name='current-week-plan-test'),
    path('plans/by-date/', views.WeeklyMealPlanViewSet.as_view({'get': 'by_date'}), name='plan-by-date'),
    path('plans/day/<str:date_str>/', views.DailyMealView.as_view(), name='daily-meal'),
    path('plans/switch-recipe/', views.SwitchRecipeView.as_view(), name='switch-recipe'),
    path('plans/auto-swap-recipe/', views.AutoSwapRecipeView.as_view(), name='auto-swap-recipe'),
    path('plans/delete-all/', views.WeeklyMealPlanViewSet.as_view({'delete': 'delete_all'}), name='delete-all-plans'),

    path('ratings/', ratings_list, name='recipe-ratings-list'),
    path('ratings/my/', RecipeRatingViewSet.as_view({'get': 'my_ratings'}), name='my-ratings'),
    path('ratings/by-recipe/', RecipeRatingViewSet.as_view({'get': 'by_recipe'}), name='rating-by-recipe'),
    path('ratings/<int:pk>/', ratings_detail, name='recipe-rating-detail'),
]
