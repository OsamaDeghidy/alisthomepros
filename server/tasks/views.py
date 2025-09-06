from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema
from .models import Task
from .serializers import TaskSerializer, TaskCreateSerializer, TaskUpdateSerializer


class TaskListView(generics.ListAPIView):
    """قائمة المهام"""
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'priority', 'project']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            Q(assigned_to=user) | Q(assigned_by=user) | Q(project__client=user)
        ).select_related('assigned_to', 'assigned_by', 'project')
    
    @extend_schema(
        operation_id="list_tasks",
        summary="List Tasks",
        description="Get tasks list",
        tags=["Tasks"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class TaskDetailView(generics.RetrieveAPIView):
    """تفاصيل المهمة"""
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            Q(assigned_to=user) | Q(assigned_by=user) | Q(project__client=user)
        ).select_related('assigned_to', 'assigned_by', 'project')
    
    @extend_schema(
        operation_id="get_task_detail",
        summary="Task Details",
        description="Get specific task details",
        tags=["Tasks"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class TaskCreateView(generics.CreateAPIView):
    """إنشاء مهمة جديدة"""
    serializer_class = TaskCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="create_task",
        summary="Create New Task",
        description="Create new task",
        tags=["Tasks"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class TaskUpdateView(generics.UpdateAPIView):
    """تحديث المهمة"""
    serializer_class = TaskUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            Q(assigned_to=user) | Q(assigned_by=user) | Q(project__client=user)
        )
    
    @extend_schema(
        operation_id="update_task",
        summary="Update Task",
        description="Update existing task",
        tags=["Tasks"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class TaskDeleteView(generics.DestroyAPIView):
    """حذف المهمة"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            Q(assigned_by=user) | Q(project__client=user)
        )
    
    @extend_schema(
        operation_id="delete_task",
        summary="Delete Task",
        description="Delete existing task",
        tags=["Tasks"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_task(request, pk):
    """إكمال المهمة"""
    try:
        task = Task.objects.get(
            id=pk,
            assigned_to=request.user
        )
        task.status = 'completed'
        task.progress = 100
        task.completed_at = timezone.now()
        task.save()
        
        return Response({
            'message': 'Task completed successfully',
            'status': task.status
        })
    except Task.DoesNotExist:
        return Response({
            'error': 'Task not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_task(request, pk):
    """بدء المهمة"""
    try:
        task = Task.objects.get(
            id=pk,
            assigned_to=request.user
        )
        task.status = 'in_progress'
        task.save()
        
        return Response({
            'message': 'Task started successfully',
            'status': task.status
        })
    except Task.DoesNotExist:
        return Response({
            'error': 'Task not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_tasks(request):
    """مهامي"""
    user = request.user
    
    pending_tasks = Task.objects.filter(
        assigned_to=user,
        status='pending'
    ).count()
    
    in_progress_tasks = Task.objects.filter(
        assigned_to=user,
        status='in_progress'
    ).count()
    
    completed_tasks = Task.objects.filter(
        assigned_to=user,
        status='completed'
    ).count()
    
    return Response({
        'pending_tasks': pending_tasks,
        'in_progress_tasks': in_progress_tasks,
        'completed_tasks': completed_tasks,
        'total_tasks': pending_tasks + in_progress_tasks + completed_tasks
    })
