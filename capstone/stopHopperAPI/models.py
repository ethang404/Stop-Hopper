from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
# Create your models here.
from django.utils.crypto import get_random_string


#Custom Django user model
class MyUserManager(BaseUserManager):
    """
    Custom user model manager where username is the unique identifier
    """
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError(_('The Username must be set'))
        if not password:
            raise ValueError(_('The Password must be set'))
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class Account(AbstractBaseUser, PermissionsMixin): #A user has many routes attached to them. A route only has one user
    email = models.EmailField(verbose_name="email", max_length = 60, unique = True)
    username = models.CharField(max_length=30,unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    password = models.CharField(max_length=100)
    last_login = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password',]

    objects = MyUserManager()
    
    class Meta:
        db_table = 'Account'


    def __str__(self):
        return self.email


#A route is composed of several stops. Each stop corresponds to 1 route. Many routes go to an Account
class Route(models.Model):
    user_id = models.ForeignKey(Account, on_delete=models.CASCADE)
    routeCode = models.CharField(unique=True, max_length=6) #code to generate room code
    class Meta:
        db_table = 'Route'

#Stores multiple stops for a route. Multiple stops make up a route
class Stops(models.Model):
    route_id = models.ForeignKey(Route, on_delete=models.CASCADE)
    stopAddress = models.CharField(max_length=100)
    class Meta:
        db_table = 'Stops'


#Stores Tasks for each stop in Route. Many tasks to 1 stop
class Tasks(models.Model):
    stopId = models.ForeignKey(Stops, on_delete=models.CASCADE)
    taskName = models.CharField(max_length=50)
    class Meta:
        db_table = 'Tasks'

#Stores preferences for priority of stop and when to arrive by etc. For Each stop in a route. 1 to 1
class Preferences(models.Model):
    stop_id = models.ForeignKey(Stops, on_delete=models.CASCADE)
    arriveBy = models.CharField(max_length=20, blank=True)
    priority = models.IntegerField(blank=True)
    class Meta:
        db_table = 'Preferences'
    

#One Stop from RouteCodes can have multiple tasks