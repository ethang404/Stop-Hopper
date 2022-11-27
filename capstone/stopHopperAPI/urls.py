from django.urls import path
from .views import *

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)#Simple JWT import url

urlpatterns = [
    path('test/',hello_world),
    path('register/',registerUser),
    path('submitStop/',submitStops),
    path('deleteStop/',deleteStop),
    path('addStop/',addStop),
    path('calculateRoute/',calculateRoute),
    path('getRoutes/',getRoutes),
    path('deleteRoute/',deleteRoute),
    path('getTasks/',getTasks),
    path('addTask/',addTask),
    path('deleteTask/',deleteTask),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]