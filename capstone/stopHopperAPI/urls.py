from django.urls import path
from .views import *

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)#Simple JWT import url

urlpatterns = [
    path('register/',registerUser),
    path('submitStop/',submitStops),
    path('getRoute/',calculateRoute),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]