from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def home (request):
    data = {
        "message": "Server Running..."
    }
    return JsonResponse(data)