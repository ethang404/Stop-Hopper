from django.shortcuts import render
from django.http import HttpResponse
from django.utils.crypto import get_random_string
#Django rest framework imports + JWT token import:
import jwt
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #JWT Token import(for customizing token creation)
from rest_framework_simplejwt.views import TokenObtainPairView #JWT token import(for customizing token creation)
from rest_framework.decorators import api_view, permission_classes #api views allow to specify 'GET' or 'POST" methods. +isAuthenicated method(if user is valid)
from rest_framework.permissions import IsAuthenticated #testing if is authenticated in function call. Not decorator like above
from rest_framework.response import Response #Good response pattern
from rest_framework import status #HTTP status codes

from rest_framework_simplejwt.authentication import JWTAuthentication #checks if provided token is valid
#Django model imports:
from .models import *
import environ #for .env files
#import our serializers:
from .serializers import *
# Create your views here.
env = environ.Env()
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
@api_view(['POST'])
def registerUser(request):
    name = request.data['username']
    passw = request.data['password']
    email = request.data['email']
    user = Account.objects.create_user(username=name,password=passw,email=email)
    user.save()
    return Response({"UserCreated"})

@permission_classes((IsAuthenticated,)) #this checks if the user is valid
def hello_world(request):
    tokenResult = JWTAuthentication().authenticate(request) #this checks if the provided token(in header) is valid
    if tokenResult:
        return HttpResponse("return this string")
    else:
        return HttpResponse("Invalid Token")

@api_view(['POST'])
def calculateRoute(request):
    #ideally this calculates the optimal order of stops to make in a route. Hardcode for demo :O?
    routeCode = request.data['RouteCode']
    print(routeCode)
    #Query for all stops with above Route Code:
    #get routeId then query stops with that routeId
    routeId = Route.objects.get(routeCode=routeCode)
    stops = Stops.objects.filter(route_id_id=routeId.id)
    serializer = StopsSerializer(stops, many=True)
    data = serializer.data
    #we'd prob calculate optimal routes here:
    myData = [{"origin":"Park East Student Living", "destination":"Texas Tech University","travelMode":"DRIVING"},
    {"origin":"Texas Tech University", "destination":"Walmart Supercenter, Marsha Sharp Freeway West, Lubbock, TX, USA","travelMode":"DRIVING"}]
    return Response(myData)
    #serializer = StopsSerializer(stops, many=True)
    #data = serializer.data
    #print(data)
    #return Response(serializer.data)

    return Response("Calculated Route", status=status.HTTP_200_OK)
@api_view(['POST'])
def submitStops(request): #need to make tweaks to better handle error handling. Fine for demo
    
    routeCode = get_random_string(length=6) #add error handling for tokens(if invalid/non existent)
    token = request.headers['Authorization'].split(' ')[1]
    print(token)
    token = jwt.decode(token, env('SECRET_KEY'), algorithms=["HS256"])
    userId = token['user_id']
    
    print(token['user_id'])
    print(routeCode)

    #Create new Route
    data = {
        "user_id":userId,
        "routeCode":routeCode
    }
    serializer = RouteSerializer(data = data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        #Grab route code from newly made route:
        routeId = Route.objects.get(routeCode=data['routeCode'])
        stopData = request.data #stop,pref,arriveBy data passed from creating stop

        #Processing stops recieved attached to Route
        for obj in stopData:
            print(obj['Stop'])
            if obj['Stop'] != '':
                stop = Stops(stopAddress=obj['Stop'], route_id_id=routeId.id)
                stop.save()
                try:#Saving Preferences attached to Stop
                    stopSet = Stops.objects.filter(stopAddress=obj['Stop'])[0] #this is an issue I think because if there are stopAddress with same address itll error(fix later)
                    print(stopSet.id)
                    if obj['Priority'] != None and obj['Priority'] !="":#dont assign preferences if things are empty/null
                        pref = Preferences(arriveBy=obj['ArriveBy'],priority=obj['Priority'],stop_id_id=stopSet.id)
                        pref.save()
                except Stops.DoesNotExist:
                    return Response({"No Stop found"})
        return Response({'Status':status.HTTP_201_CREATED, 'RouteCode':routeId.routeCode})
    else:
        return Response("Error with creating route", status=status.HTTP_406_NOT_ACCEPTABLE)

#ideally you return something like the followin: return Response("New User Created", status=status.HTTP_201_CREATED)
#or if returning data: return Response(serializer.data)