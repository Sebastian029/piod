from django.urls import path
from .views import RegisterView, ProtectedView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('protected/', ProtectedView.as_view(), name='protected'),
]
