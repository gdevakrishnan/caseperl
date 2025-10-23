from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

ROLE_CHOICES = (
    ('agent', 'Agent'),
    ('admin', 'Admin'),
)

class UserManager(BaseUserManager):
    def create_user(self, uname, password=None, role='agent', **extra_fields):
        if not uname:
            raise ValueError('The Username must be set')
        user = self.model(uname=uname, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, uname, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(uname, password, role='admin', **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    uname = models.CharField(max_length=150, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='agent')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'uname'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.uname
