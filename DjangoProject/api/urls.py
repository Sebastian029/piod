from django.urls import path
from .views import RegisterView, ProtectedView, UserDietPreferencesViewSet, GenerateWeeklyPlanView
from . import views

preferences_list = UserDietPreferencesViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})
urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('protected/', ProtectedView.as_view(), name='protected'),

    path('recipes/', views.RecipeDetailView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeDetailView.as_view(), name='recipe-detail'),

    path('recipes/load/', views.UploadRecipesView.as_view(), name='upload-recipes'),
    path('recipes/delete-all/', views.DeleteAllRecipesView.as_view(), name='delete-all-recipes'),
    path('preferences/', preferences_list, name='user-preferences'),
    path('plans/weekly/', GenerateWeeklyPlanView.as_view(), name='generate-weekly-plan'),

]
