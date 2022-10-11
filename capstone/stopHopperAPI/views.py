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
    request.session['routeCode'] = "7sftep63"
    request.session['stop#1'] = "Target"
    request.session['stop#2'] = "Walmart"
    request.session['stop#3'] = "Sex store"
    request.session['stop#4'] = "Outside"
    request.session['stop#5'] = "Mesuem"
    request.session['stop#6'] = "Park East"
    request.session['stop#7'] = "School"
    request.session['arriveBy'] = "7:30"
    request.session['priorityStop#'] = "#1"

    return HttpResponse("return this string" + request.session.get('routeCode'))

    #ideally you return something like the followin: return Response("New User Created", status=status.HTTP_201_CREATED)
    #or if returning data: return Response(serializer.data)