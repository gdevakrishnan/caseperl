from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Case
from .serializers import CaseSerializer
from django.shortcuts import get_object_or_404

class CaseListCreateView(APIView):
    def get(self, request):
        cases = Case.objects.filter(is_deleted=False)
        serializer = CaseSerializer(cases, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserCasesView(APIView):
    def get(self, request, user_id):
        cases = Case.objects.filter(user_id=user_id, is_deleted=False)
        serializer = CaseSerializer(cases, many=True)
        return Response(serializer.data)

class CaseUpdateView(APIView):
    def put(self, request, id, user_id):
        case = get_object_or_404(Case, id=id, is_deleted=False)
        
        if case.user_id != user_id:
            return Response(
                {"error": "You don't have permission to update this case"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CaseSerializer(case, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CaseUpdateStatusView(APIView):
    STATUS_CHOICES = ['new', 'open', 'in_progress', 'resolved', 'closed', 'reopened']

    def put(self, request, id, idx_status):
        if idx_status < 0 or idx_status >= len(self.STATUS_CHOICES):
            return Response({"error": "Invalid status index"}, status=status.HTTP_400_BAD_REQUEST)
        case = get_object_or_404(Case, id=id, is_deleted=False)
        case.status = self.STATUS_CHOICES[idx_status]
        case.save()
        serializer = CaseSerializer(case)
        return Response(serializer.data)

class CaseDeleteView(APIView):
    def delete(self, request, id):
        case = get_object_or_404(Case, id=id, is_deleted=False)
        case.is_deleted = True
        case.save()
        return Response({"message": "Case deleted successfully"})
