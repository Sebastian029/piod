from django.urls import path
from .views import RegisterView, ProtectedView, UserDietPreferencesViewSet
from . import views

preferences_list = UserDietPreferencesViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('protected/', ProtectedView.as_view(), name='protected'),

    # Recipes
    path('recipes/', views.RecipeViewSet.as_view({'get': 'list'}), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeViewSet.as_view({'get': 'retrieve'}), name='recipe-detail'),
    path('recipes/load/', views.UploadRecipesView.as_view(), name='upload-recipes'),
    path('recipes/delete-all/', views.DeleteAllRecipesView.as_view(), name='delete-all-recipes'),

    # Preferences
    path('preferences/', preferences_list, name='user-preferences'),

    # NOWE - PLANY Z DATAMI
    path('plans/generate/', views.Generate3WeeksView.as_view(), name='generate-3-weeks'),

    # Pobierz wszystkie plany
    path('plans/', views.WeeklyMealPlanViewSet.as_view({'get': 'list'}), name='meal-plans-list'),

    # Pobierz plan obecnego tygodnia
    path('plans/current/', views.WeeklyMealPlanViewSet.as_view({'get': 'current'}), name='current-week-plan'),
    path('plans/current-test/', views.WeeklyMealPlanViewSet.as_view({'get': 'current_test'}), name='current-week-plan-test'),

    # Pobierz plan dla konkretnej daty (?date=2025-11-15)
    path('plans/by-date/', views.WeeklyMealPlanViewSet.as_view({'get': 'by_date'}), name='plan-by-date'),

    # Pobierz konkretny plan po ID
    path('plans/<int:pk>/', views.WeeklyMealPlanViewSet.as_view({'get': 'retrieve'}), name='meal-plan-detail'),

    # Pobierz posiłki dla konkretnej daty
    path('plans/day/<str:date_str>/', views.DailyMealView.as_view(), name='daily-meal'),

    # Usuń wszystkie plany
    path('plans/delete-all/', views.WeeklyMealPlanViewSet.as_view({'delete': 'delete_all'}), name='delete-all-plans'),
]
