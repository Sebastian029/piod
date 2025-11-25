from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from .views import AnnotatedTokenObtainPairView, AnnotatedTokenRefreshView


urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/token/', AnnotatedTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', AnnotatedTokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('api.urls')),
    # Swagger UI endpoints
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
