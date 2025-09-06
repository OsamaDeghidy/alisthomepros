from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema
from .models import TimeEntry
from .serializers import TimeEntrySerializer, TimeEntryCreateSerializer, TimeEntryUpdateSerializer


class TimeEntryListView(generics.ListAPIView):
    """قائمة إدخالات الوقت"""
    serializer_class = TimeEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'project']
    ordering = ['-date', '-start_time']
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return TimeEntry.objects.filter(
                project__client=user
            ).select_related('professional', 'project')
        else:
            return TimeEntry.objects.filter(
                professional=user
            ).select_related('professional', 'project')
    
    @extend_schema(
        operation_id="list_time_entries",
        summary="List Time Entries",
        description="Get time entries list",
        tags=["Time Tracking"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class TimeEntryDetailView(generics.RetrieveAPIView):
    """تفاصيل إدخال الوقت"""
    serializer_class = TimeEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return TimeEntry.objects.filter(
                project__client=user
            ).select_related('professional', 'project')
        else:
            return TimeEntry.objects.filter(
                professional=user
            ).select_related('professional', 'project')
    
    @extend_schema(
        operation_id="get_time_entry_detail",
        summary="Time Entry Details",
        description="Get specific time entry details",
        tags=["Time Tracking"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class TimeEntryCreateView(generics.CreateAPIView):
    """إنشاء إدخال وقت جديد"""
    serializer_class = TimeEntryCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="create_time_entry",
        summary="Create New Time Entry",
        description="Create new time entry",
        tags=["Time Tracking"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class TimeEntryUpdateView(generics.UpdateAPIView):
    """تحديث إدخال الوقت"""
    serializer_class = TimeEntryUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TimeEntry.objects.filter(professional=self.request.user)
    
    @extend_schema(
        operation_id="update_time_entry",
        summary="Update Time Entry",
        description="Update existing time entry",
        tags=["Time Tracking"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class TimeEntryDeleteView(generics.DestroyAPIView):
    """حذف إدخال الوقت"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TimeEntry.objects.filter(professional=self.request.user)
    
    @extend_schema(
        operation_id="delete_time_entry",
        summary="Delete Time Entry",
        description="Delete existing time entry",
        tags=["Time Tracking"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def approve_time_entry(request, pk):
    """موافقة على إدخال الوقت"""
    try:
        time_entry = TimeEntry.objects.get(
            id=pk,
            project__client=request.user
        )
        time_entry.status = 'approved'
        time_entry.save()
        
        return Response({
            'message': 'Time entry approved successfully',
            'status': time_entry.status
        })
    except TimeEntry.DoesNotExist:
        return Response({
            'error': 'Time entry not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_time_entry(request, pk):
    """رفض إدخال الوقت"""
    try:
        time_entry = TimeEntry.objects.get(
            id=pk,
            project__client=request.user
        )
        time_entry.status = 'rejected'
        time_entry.save()
        
        return Response({
            'message': 'Time entry rejected successfully',
            'status': time_entry.status
        })
    except TimeEntry.DoesNotExist:
        return Response({
            'error': 'Time entry not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def time_summary(request):
    """ملخص الوقت"""
    user = request.user
    
    if user.user_type == 'client':
        entries = TimeEntry.objects.filter(project__client=user)
    else:
        entries = TimeEntry.objects.filter(professional=user)
    
    summary = entries.aggregate(
        total_hours=Sum('duration'),
        total_cost=Sum('total_cost')
    )
    
    return Response({
        'total_hours': (summary['total_hours'] or 0) / 60,
        'total_cost': summary['total_cost'] or 0,
        'total_entries': entries.count(),
        'pending_entries': entries.filter(status='pending').count(),
        'approved_entries': entries.filter(status='approved').count(),
        'rejected_entries': entries.filter(status='rejected').count()
    })
