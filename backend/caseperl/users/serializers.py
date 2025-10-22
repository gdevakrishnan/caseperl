from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'uname', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'uname', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            uname=validated_data['uname'],
            password=validated_data['password'],
            role=validated_data.get('role', 'agent')
        )
        return user

class LoginSerializer(serializers.Serializer):
    uname = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['uname'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")
