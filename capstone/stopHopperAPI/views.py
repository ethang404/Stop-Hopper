from django.shortcuts import render
from django.http import HttpResponse

#Django rest framework imports + JWT token import:
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #JWT Token import
from rest_framework_simplejwt.views import TokenObtainPairView #JWT token import
from rest_framework.decorators import api_view, permission_classes #api views allow to specify 'GET' or 'POST" methods. +isAuthenicated method(if user is valid)
from rest_framework.permissions import IsAuthenticated #testing if is authenticated in function call. Not decorator like above
from rest_framework.response import Response #Good response pattern
from rest_framework import status #HTTP status codes

#Django User model imports:
from django.contrib.auth.models import User
# Create your views here.


def hello_world(request):
    return HttpResponse("return this string")

    #ideally you return something like the followin: return Response("New User Created", status=status.HTTP_201_CREATED)
    #or if returning data: return Response(serializer.data)