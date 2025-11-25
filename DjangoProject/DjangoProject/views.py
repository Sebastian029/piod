""" Annotated versions of the TokenObtainPairView for JWT authentication.

Note: that these use serializers to explicitly separate the request and 
response. The original response has the username, password, access, refresh
fields with username and password annotated for write only and access,
refresh for read only.

Generators like swift-openapi-generator end up generating a single
model for the request and response, and thus failing to parse the response.

Note that the changes are only reflected in the schema, there are no
changes to the behavior of the view itself.

# https://github.com/tfranzel/drf-spectacular/issues/232#issuecomment-3047341364
"""
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import (
    TokenObtainRequestSerializer,
    TokenObtainResponseSerializer,
    TokenRefreshRequestSerializer,
    TokenRefreshResponseSerializer
)


@extend_schema(
    request=TokenObtainRequestSerializer,
    responses=TokenObtainResponseSerializer,
    tags=["auth"]
)
class AnnotatedTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for obtaining JWT tokens with additional schema annotations.
    """
    pass

@extend_schema(
    request=TokenRefreshRequestSerializer,
    responses=TokenRefreshResponseSerializer,
    tags=["auth"]
)
class AnnotatedTokenRefreshView(TokenRefreshView):
    """
    Custom view for obtaining refresh tokens with additional schema annotations.
    """
    pass