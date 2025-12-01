from rest_framework import serializers


class TokenObtainRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class TokenObtainResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class TokenRefreshRequestSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class TokenRefreshResponseSerializer(serializers.Serializer):
    access = serializers.CharField()