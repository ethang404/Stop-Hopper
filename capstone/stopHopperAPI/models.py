from django.db import models
from django.contrib.auth.models import User

# Create your models here.

#A route is composed of several stops
class Route(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    routeCode = models.CharField(max_length=20)
    class Meta:
        db_table = 'Route'

#Stores multiple stops for a route. Multiple stops make up a route
class Stops(models.Model):
    route_id = models.ForeignKey(Route, on_delete=models.CASCADE)
    stopAddress = models.CharField(max_length=100)
    class Meta:
        db_table = 'Stops'


#user Table(not shown here for storing user data). Each user can have multiple routes


#Stores Tasks for each stop in Route
class Tasks(models.Model):
    stopId = models.ForeignKey(Stops, on_delete=models.CASCADE)
    taskName = models.CharField(max_length=50)
    class Meta:
        db_table = 'Tasks'

#Stores preferences for priority of stop and when to arrive by etc. For Each stop in a route
class Preferences(models.Model):
    stop_id = models.ForeignKey(Stops, on_delete=models.CASCADE)
    arriveBy = models.CharField(max_length=20, blank=True)
    priority = models.IntegerField(blank=True)
    class Meta:
        db_table = 'Preferences'
    

#One Stop from RouteCodes can have multiple tasks