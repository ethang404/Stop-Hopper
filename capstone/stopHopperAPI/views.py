from django.shortcuts import render
from django.http import HttpResponse

#Django rest framework imports + JWT token import:
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #JWT Token import(for customizing token creation)
from rest_framework_simplejwt.views import TokenObtainPairView #JWT token import(for customizing token creation)
from rest_framework.decorators import api_view, permission_classes #api views allow to specify 'GET' or 'POST" methods. +isAuthenicated method(if user is valid)
from rest_framework.permissions import IsAuthenticated #testing if is authenticated in function call. Not decorator like above
from rest_framework.response import Response #Good response pattern
from rest_framework import status #HTTP status codes

from rest_framework_simplejwt.authentication import JWTAuthentication #checks if provided token is valid
#Django model imports:
from .models import *
# Create your views here.

#If you would like to custome what you pass to JWT token:

#class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    #@classmethod
    #def get_token(cls, user):
        #token = super().get_token(user)

        # Add custom claims
        #token['name'] = user.name
        # ...

        #return token

#class MyTokenObtainPairView(TokenObtainPairView):
    #serializer_class = MyTokenObtainPairSerializer



@permission_classes((IsAuthenticated,)) #this checks if the user is valid
def hello_world(request):
    tokenResult = JWTAuthentication().authenticate(request) #this checks if the provided token(in header) is valid
    if tokenResult:
        return HttpResponse("return this string")
    else:
        return HttpResponse("Invalid Token")

#How to create an Route obj(id and routeCode are auto added), have to provide foreign key relation.
#you SHOULD use serializers for this instead..look it up :)

@api_view(['POST'])
def testing(request):
    temp = request.data
    print(str(temp))
    #route = Route(user_id_id = 1)
    #route.save()
    return Response({str(temp),"I crave death"})


#ideally you return something like the followin: return Response("New User Created", status=status.HTTP_201_CREATED)
#or if returning data: return Response(serializer.data)