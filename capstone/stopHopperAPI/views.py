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
import requests
import json
import numpy as np
from python_tsp.exact import solve_tsp_dynamic_programming as tsp

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

@api_view(['DELETE'])
def deleteStop(request):
    route = Route.objects.get(routeCode=request.data['routeCode'])
    stopName = request.data['stopName']
    try:
        stop = Stops.objects.filter(route_id_id=route.id).filter(stopAddress=stopName)[0].delete()
        return Response({'Status':status.HTTP_200_OK, "Result":"Stop Deleted"})
    except:
        return Response({'Status':status.HTTP_204_NO_CONTENT, "Result":"Stop not found"})

@api_view(['POST'])
def addStop(request):
    route = Route.objects.get(routeCode=request.data['routeCode'])
    stopName = request.data['stopAddress']
    try:
        newStop = Stops(stopAddress=stopName,route_id_id=route.id)
        newStop.save()
        return Response({'Status':status.HTTP_201_CREATED,"Result":"Stop added"})
    except:
        return Response({'Status':status.HTTP_204_NO_CONTENT,"Result":"Failure to add a stop"})

@api_view(['DELETE'])
def deleteTask(request):
    taskId = request.data['id']
    try:
        Tasks.objects.get(id = taskId).delete()
        return Response({'Status':status.HTTP_200_OK, "Result":"Task Deleted"})
    except:
        return Response({'Status':status.HTTP_204_NO_CONTENT, "Result":"Task not found"})

@api_view(['POST'])
def addTask(request):
    routeCode = request.data['RouteCode']
    stopName = request.data['stopAddress']
    tName = request.data['taskName']

    route = Route.objects.get(routeCode = routeCode)
    try:
        answers = Stops.objects.filter(route_id_id=route.id).get(stopAddress=stopName)
        sId = answers.id

        newTask = Tasks(taskName=tName,stopId_id=sId)
        newTask.save()
        
        return Response({'Status':status.HTTP_201_CREATED,"Result":"Task added"})
    except:
        return Response({'Status':status.HTTP_204_NO_CONTENT,"Result":"Failure to add task"})

@api_view(['GET'])
def getTasks(request):
    data = []
    rCode = request.headers['routeCode']
    routeId = Route.objects.get(routeCode=rCode)
    stops = Stops.objects.filter(route_id_id=routeId.id)

    #structure should be data[{Stop:"Target"}, TaskInfo:[{"id":task.id,"taskName":task.taskName,"stopId":task.stopId.id}]]
    
    for i,stop in enumerate(stops):
        try:
            print(stop.id, stop.stopAddress, stop.route_id_id)
            tasks = Tasks.objects.filter(stopId_id = stop.id)
            data.append({"Stop":stop.stopAddress,"TaskInfo":[]})
            for index, task in enumerate(tasks): #if a stop has no tasks this wont run since its empty
                #print(task.taskName, task.stopId.id)
                #data.append({"Stop":stop.stopAddress,"TaskInfo":{"id":task.id,"taskName":task.taskName,"stopId":task.stopId.id}})
                data[i]["TaskInfo"].append({"id":task.id,"taskName":task.taskName,"stopId":task.stopId.id})
                print(data)
                print("\n")
        except:
            print("error", stop.stopAddress)
            
            continue
    return Response(data)

@api_view(['POST'])
def calculateRoute(request):
    #ideally this calculates the optimal order of stops to make in a route. Hardcode for demo :O?
    routeCode = request.data['RouteCode']
    #print(routeCode)
    #Query for all stops with above Route Code:
    #get routeId then query stops with that routeId
    routeId = Route.objects.get(routeCode=routeCode)
    stops = Stops.objects.filter(route_id_id=routeId.id)

    stopList = []
    positiveStopList = []
    negativeStopList = []
    for i in stops:
        if i == stops[0]:
            continue
        try:
            pref = Preferences.objects.get(stop_id=i.id)
            if pref.priority > 0:
                index = 0
                for j in positiveStopList:
                    if j[1] < pref.priority:
                        break
                    index += 1
                positiveStopList.insert(index, [i, pref.priority])
            elif pref.priority < 0:
                index = 0
                for j in negativeStopList:
                    if j[1] < pref.priority:
                        break
                    index += 1
                negativeStopList.insert(index, [i, pref.priority])
            else:
                stopList.append(i)
        except:
            stopList.append(i)

    
    if len(positiveStopList) == 0 and len(negativeStopList) == 0:
        stopList.insert(0, stops[0])

    x = 0
    for i in stopList:
        x += 1

    #x = 2 #debug line!!!!!!!!!!!
    
    if x != 0:
        map = np.empty([x, x])

        for i in range(x):
            for j in range(i, x):
                if i != j:
                    response = requests.get("https://maps.googleapis.com/maps/api/directions/json?origin=" + stopList[i].stopAddress.replace(" ", "%20") + "&destination=" + stopList[j].stopAddress.replace(" ", "%20") + "&key=AIzaSyCPQNTJv4XB3ULqZAgi1jNmcvxqLMHUKTs")
                    value = json.loads(response.text)["routes"][0]["legs"][0]["duration"]["value"]
                    map[i, j] = value
                    map[j, i] = value
                else:
                    map[i,j] = 0
        sequence, distance = tsp(map)
    #we'd prob calculate optimal routes here:
    #print (sequence)

    #initial garbage for unknown reasons.
    myData = [{"origin":"1819 Glenna Goodacre Blvd, Lubbock, TX 79401", "destination":"5225 Texas 289 Loop Frontage Road, S Loop 289 Suite 207, Lubbock, TX 79424","travelMode":"DRIVING"}]#, {"origin":"1819 Glenna Goodacre Blvd, Lubbock, TX 79401", "destination":"5225 Texas 289 Loop Frontage Road, S Loop 289 Suite 207, Lubbock, TX 79424","travelMode":"DRIVING"}]
    
    #positive prio
    if len(positiveStopList):
        myData.append({"origin":stops[0].stopAddress, "destination":positiveStopList[0][0].stopAddress, "travelMode":"DRIVING"})
        for i in range(0, len(positiveStopList) -1):
            myData.append({"origin":positiveStopList[i][0].stopAddress, "destination":positiveStopList[i+1][0].stopAddress, "travelMode":"DRIVING"})
        exitO = stops[0].stopAddress
    else:
        if (len(stopList)):
            exitO = stopList[sequence[0]].stopAddress



    #reorder sequence
    if (len(positiveStopList) or len(negativeStopList)) and len(stopList):
        if len(positiveStopList):
            entry = positiveStopList[-1][0].stopAddress
        else:
            entry = stops[0].stopAddress
        
        if len(negativeStopList):
            exit = negativeStopList[-1][0].stopAddress
        else:
            exit = stops[0].stopAddress
        
        entryMap = []
        exitMap = []

        for i in sequence:
            response = requests.get("https://maps.googleapis.com/maps/api/directions/json?origin=" + entry.replace(" ", "%20") + "&destination=" + stopList[i].stopAddress.replace(" ", "%20") + "&key=AIzaSyCPQNTJv4XB3ULqZAgi1jNmcvxqLMHUKTs")
            value = json.loads(response.text)["routes"][0]["legs"][0]["duration"]["value"]
            entryMap.append(value)

            response = requests.get("https://maps.googleapis.com/maps/api/directions/json?origin=" + exit.replace(" ", "%20") + "&destination=" + stopList[i].stopAddress.replace(" ", "%20") + "&key=AIzaSyCPQNTJv4XB3ULqZAgi1jNmcvxqLMHUKTs")
            value = json.loads(response.text)["routes"][0]["legs"][0]["duration"]["value"]
            exitMap.append(value)

        #forwards
        lowestStart = 0
        lowestStartValue = 0
        for i in range(0, len(sequence)):
            current = entryMap[i]
            current += exitMap[i-1]

            for j in range(0, len(sequence)-1):
                x = i + j
                y = i + j + 1
                if x >= len(sequence):
                    x -= len(sequence)
                if y >= len(sequence):
                    y -= len(sequence)
                current += map[sequence[x], sequence[y]]

            if lowestStartValue == 0 or lowestStartValue > current:
                lowestStart = i
                lowestStartValue = current

        lowestStartBackwards = 0
        lowestStartValueBackwards = 0
        sequenceBackwards = sequence.copy()
        sequenceBackwards.reverse()
        entryMapBackwards = entryMap.copy()
        entryMapBackwards.reverse()
        exitMapBackwards = exitMap.copy()
        exitMapBackwards.reverse()
        for i in range(0, len(sequenceBackwards)):
            current = entryMapBackwards[i]
            current += exitMapBackwards[i-1]

            for j in range(0, len(sequenceBackwards)-1):
                x = i + j
                y = i + j + 1
                if x >= len(sequenceBackwards):
                    x -= len(sequenceBackwards)
                if y >= len(sequenceBackwards):
                    y -= len(sequenceBackwards)
                current += map[sequenceBackwards[x], sequenceBackwards[y]]

            if lowestStartValueBackwards == 0 or lowestStartValueBackwards > current:
                lowestStartBackwards = i
                lowestStartValueBackwards = current
        


        if lowestStartValue < lowestStartValueBackwards:
            oldSequence = sequence.copy()
        else:
            oldSequence = sequenceBackwards.copy()
        for i in range(len(sequence)):
            x = i + lowestStart
            if x >= len(sequence):
                x -= len(sequence)
            sequence[i] = oldSequence[x]





    #optimized route.
    if len(stopList):
        if len(positiveStopList):
            myData.append({"origin":positiveStopList[-1][0].stopAddress, "destination":stopList[sequence[0]].stopAddress, "travelMode":"DRIVING"})
        elif len(negativeStopList):
            myData.append({"origin":stops[0].stopAddress, "destination":stopList[sequence[0]].stopAddress, "travelMode":"DRIVING"})
        for i in range(0, len(sequence)-1):
            myData.append({"origin":stopList[sequence[i]].stopAddress, "destination":stopList[sequence[i+1]].stopAddress, "travelMode":"DRIVING"})
    #if there is no stoplist
    else:
        #if there is positive prio list
        if len(positiveStopList):
            #if there is no negative prio
            if len(negativeStopList) == 0:
                myData.append({"origin":positiveStopList[-1][0].stopAddress, "destination":stops[0].stopAddress, "travelMode":"DRIVING"})
            #if there is negative prio
            else:
                myData.append({"origin":positiveStopList[-1][0].stopAddress, "destination":negativeStopList[0][0].stopAddress, "travelMode":"DRIVING"})
        #if there is not a positive prio list
        else:
            myData.append({"origin":stops[0].stopAddress, "destination":negativeStopList[0][0].stopAddress, "travelMode":"DRIVING"})

    
    

    #negative prio.
    if len(negativeStopList):
        if len(stopList):
            myData.append({"origin":stopList[sequence[-1]].stopAddress, "destination":negativeStopList[0][0].stopAddress, "travelMode":"DRIVING"})
        for i in range(0, len(negativeStopList) -1):
            myData.append({"origin":negativeStopList[i][0].stopAddress, "destination":negativeStopList[i+1][0].stopAddress, "travelMode":"DRIVING"})
        myData.append({"origin":negativeStopList[-1][0].stopAddress, "destination":stops[0].stopAddress, "travelMode":"DRIVING"})
    else:
        if len(stopList):
            myData.append({"origin":stopList[sequence[-1]].stopAddress, "destination":exitO, "travelMode":"DRIVING"})

    #myData = [{"origin":"1819 Glenna Goodacre Blvd, Lubbock, TX 79401", "destination":"5225 Texas 289 Loop Frontage Road, S Loop 289 Suite 207, Lubbock, TX 79424","travelMode":"DRIVING"},
    #{"origin":"5225 Texas 289 Loop Frontage Road, S Loop 289 Suite 207, Lubbock, TX 79424", "destination":"116 W Loop 289 Acc Rd, Lubbock, TX 79416","travelMode":"DRIVING"},
    #{"origin":"116 W Loop 289 Acc Rd, Lubbock, TX 79416", "destination":"1819 Glenna Goodacre Blvd, Lubbock, TX 79401","travelMode":"DRIVING"}]
    return Response(myData)
    #serializer = StopsSerializer(stops, many=True)
    #data = serializer.data
    
    #print(data)
    #return Response(serializer.data)

    return Response("Calculated Route", status=status.HTTP_200_OK)
@api_view(['GET'])
def getRoutes(request):
    token = request.headers['Authorization'].split(' ')[1]
    #routeCode = request.headers['routeCode']
    token = jwt.decode(token, env('SECRET_KEY'), algorithms=["HS256"])
    print(token)
    print(token['user_id'])

    data = []
    routes = Route.objects.filter(user_id_id=token['user_id'])
    counter = 0
    for route in routes:
        if counter < 10:
            data.append({"id":route.id,"routeCode":route.routeCode,"user_id":route.user_id_id})
            counter += 1
        else:
            return Response(data, status=status.HTTP_200_OK)
    return Response(data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def deleteRoute(request):
    try:
        routeCode = request.data['RouteCode']

        route = Route.objects.get(routeCode=routeCode)
        route.delete()
        return Response({'Status':status.HTTP_201_CREATED,"Result":"Route deleted"})
    except:
        return Response({'Status':status.HTTP_204_NO_CONTENT,"Result":"Failure to delete Route"})




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
                    if obj['TaskName'] != '':
                        tasks = Tasks(taskName=obj['TaskName'],stopId_id=stop.id)
                        tasks.save()
                    if obj['Priority'] != None and obj['Priority'] !="":#dont assign preferences if things are empty/null
                        pref = Preferences(arriveBy=obj['ArriveBy'],priority=obj['Priority'],stop_id_id=stop.id)
                        pref.save()
                except Stops.DoesNotExist:
                    return Response({"No Stop found"})
                
        return Response({'Status':status.HTTP_201_CREATED, 'RouteCode':routeId.routeCode})
    else:
        return Response("Error with creating route", status=status.HTTP_406_NOT_ACCEPTABLE)

#ideally you return something like the followin: return Response("New User Created", status=status.HTTP_201_CREATED)
#or if returning data: return Response(serializer.data)