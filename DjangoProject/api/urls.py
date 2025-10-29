from django.urls import path
from .views import RegisterView, ProtectedView
from . import views


urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('protected/', ProtectedView.as_view(), name='protected'),

    path('recipes/', views.RecipeListView.as_view(), name='recipe-list'),
    path('recipes/load/', views.UploadRecipesView.as_view(), name='upload-recipes'),
    path('recipes/delete-all/', views.DeleteAllRecipesView.as_view(), name='delete-all-recipes'),

]
