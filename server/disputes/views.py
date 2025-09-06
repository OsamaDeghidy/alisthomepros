from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count, Avg, F
from django.utils import timezone
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from datetime import datetime, timedelta
from .models import Dispute, DisputeMessage, DisputeEvidence, DisputeResolution
from .serializers import (
    DisputeListSerializer, DisputeDetailSerializer, DisputeCreateSerializer,
    DisputeUpdateSerializer, DisputeMessageSerializer, DisputeMessageCreateSerializer,
    DisputeEvidenceSerializer, DisputeEvidenceCreateSerializer,
    DisputeResolutionSerializer, DisputeResolutionCreateSerializer,
    DisputeStatsSerializer
)
from contracts.models import Contract, ContractMilestone
from payments.models import Payment

User = get_user_model()


class DisputeListView(generics.ListAPIView):
    """قائمة النزاعات"""
    serializer_class = DisputeListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'dispute_type', 'priority', 'raised_by', 'against']
    search_fields = ['title', 'description', 'dispute_id']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        queryset = Dispute.objects.select_related(
            'raised_by', 'against', 'assigned_to', 'resolved_by',
            'contract', 'milestone', 'payment'
        ).prefetch_related('messages', 'evidence')
        
        # فلترة حسب المستخدم
        if user.is_staff:
            # الإدارة ترى جميع النزاعات
            return queryset
        else:
            # المستخدمون العاديون يرون النزاعات التي يشاركون فيها فقط
            return queryset.filter(
                Q(raised_by=user) | Q(against=user)
            )


class DisputeCreateView(generics.CreateAPIView):
    """إنشاء نزاع جديد"""
    serializer_class = DisputeCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(raised_by=self.request.user)


class DisputeDetailView(generics.RetrieveAPIView):
    """تفاصيل النزاع"""
    serializer_class = DisputeDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'dispute_id'
    
    def get_queryset(self):
        user = self.request.user
        queryset = Dispute.objects.select_related(
            'raised_by', 'against', 'assigned_to', 'resolved_by',
            'contract', 'milestone', 'payment'
        ).prefetch_related(
            'messages__sender', 'evidence__uploaded_by', 'resolution'
        )
        
        if user.is_staff:
            return queryset
        else:
            return queryset.filter(
                Q(raised_by=user) | Q(against=user)
            )


class DisputeUpdateView(generics.UpdateAPIView):
    """تحديث النزاع"""
    serializer_class = DisputeUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'dispute_id'
    
    def get_queryset(self):
        user = self.request.user
        queryset = Dispute.objects.all()
        
        if user.is_staff:
            return queryset
        else:
            return queryset.filter(
                Q(raised_by=user) | Q(against=user)
            )


class DisputeMessageListView(generics.ListCreateAPIView):
    """قائمة وإنشاء رسائل النزاع"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DisputeMessageCreateSerializer
        return DisputeMessageSerializer
    
    def get_queryset(self):
        dispute_id = self.kwargs.get('dispute_id')
        user = self.request.user
        
        # التحقق من صلاحية الوصول للنزاع
        try:
            dispute = Dispute.objects.get(dispute_id=dispute_id)
            if not (user in [dispute.raised_by, dispute.against] or user.is_staff):
                return DisputeMessage.objects.none()
        except Dispute.DoesNotExist:
            return DisputeMessage.objects.none()
        
        queryset = DisputeMessage.objects.filter(
            dispute__dispute_id=dispute_id
        ).select_related('sender')
        
        # إخفاء الرسائل الداخلية عن المستخدمين العاديين
        if not user.is_staff:
            queryset = queryset.filter(is_internal=False)
        
        return queryset
    
    def perform_create(self, serializer):
        dispute_id = self.kwargs.get('dispute_id')
        dispute = Dispute.objects.get(dispute_id=dispute_id)
        serializer.save(dispute=dispute, sender=self.request.user)


class DisputeEvidenceListView(generics.ListCreateAPIView):
    """قائمة وإنشاء أدلة النزاع"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DisputeEvidenceCreateSerializer
        return DisputeEvidenceSerializer
    
    def get_queryset(self):
        dispute_id = self.kwargs.get('dispute_id')
        user = self.request.user
        
        # التحقق من صلاحية الوصول للنزاع
        try:
            dispute = Dispute.objects.get(dispute_id=dispute_id)
            if not (user in [dispute.raised_by, dispute.against] or user.is_staff):
                return DisputeEvidence.objects.none()
        except Dispute.DoesNotExist:
            return DisputeEvidence.objects.none()
        
        return DisputeEvidence.objects.filter(
            dispute__dispute_id=dispute_id
        ).select_related('uploaded_by')
    
    def perform_create(self, serializer):
        dispute_id = self.kwargs.get('dispute_id')
        dispute = Dispute.objects.get(dispute_id=dispute_id)
        serializer.save(dispute=dispute, uploaded_by=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def resolve_dispute(request, dispute_id):
    """حل النزاع"""
    try:
        dispute = Dispute.objects.get(dispute_id=dispute_id)
        
        # التحقق من الصلاحيات
        if not request.user.is_staff:
            return Response(
                {'error': 'فقط الإدارة يمكنها حل النزاعات'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # التحقق من حالة النزاع
        if dispute.status in ['resolved', 'closed']:
            return Response(
                {'error': 'النزاع محلول أو مغلق بالفعل'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = DisputeResolutionCreateSerializer(data=request.data)
        if serializer.is_valid():
            # إنشاء قرار الحل
            resolution = serializer.save(
                dispute=dispute,
                resolved_by=request.user
            )
            
            # تحديث حالة النزاع
            dispute.status = 'resolved'
            dispute.resolved_by = request.user
            dispute.resolution_date = timezone.now()
            dispute.resolution_notes = serializer.validated_data.get('resolution_summary', '')
            dispute.save()
            
            # إضافة رسالة نظام
            DisputeMessage.objects.create(
                dispute=dispute,
                sender=request.user,
                message_type='resolution',
                content=f"تم حل النزاع: {resolution.resolution_summary}",
                is_system_message=True
            )
            
            return Response({
                'message': 'تم حل النزاع بنجاح',
                'dispute_id': str(dispute.dispute_id),
                'resolution': DisputeResolutionSerializer(resolution).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Dispute.DoesNotExist:
        return Response(
            {'error': 'النزاع غير موجود'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'خطأ في حل النزاع: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def escalate_dispute(request, dispute_id):
    """تصعيد النزاع"""
    try:
        dispute = Dispute.objects.get(dispute_id=dispute_id)
        
        # التحقق من الصلاحيات
        if not (request.user in [dispute.raised_by, dispute.against] or request.user.is_staff):
            return Response(
                {'error': 'ليس لديك صلاحية لتصعيد هذا النزاع'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # التحقق من حالة النزاع
        if dispute.status in ['resolved', 'closed', 'escalated']:
            return Response(
                {'error': 'لا يمكن تصعيد النزاع في هذه الحالة'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        escalation_reason = request.data.get('reason', '')
        
        # تحديث حالة النزاع
        dispute.status = 'escalated'
        dispute.priority = 'high'  # رفع الأولوية عند التصعيد
        dispute.save()
        
        # إضافة رسالة تصعيد
        DisputeMessage.objects.create(
            dispute=dispute,
            sender=request.user,
            message_type='system',
            content=f"تم تصعيد النزاع من قبل {request.user.get_full_name()}. السبب: {escalation_reason}",
            is_system_message=True
        )
        
        return Response({
            'message': 'تم تصعيد النزاع بنجاح',
            'dispute_id': str(dispute.dispute_id),
            'status': dispute.status
        })
        
    except Dispute.DoesNotExist:
        return Response(
            {'error': 'النزاع غير موجود'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'خطأ في تصعيد النزاع: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def close_dispute(request, dispute_id):
    """إغلاق النزاع"""
    try:
        dispute = Dispute.objects.get(dispute_id=dispute_id)
        
        # التحقق من الصلاحيات
        if not request.user.is_staff:
            return Response(
                {'error': 'فقط الإدارة يمكنها إغلاق النزاعات'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # التحقق من حالة النزاع
        if dispute.status == 'closed':
            return Response(
                {'error': 'النزاع مغلق بالفعل'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        closing_reason = request.data.get('reason', '')
        
        # تحديث حالة النزاع
        dispute.status = 'closed'
        dispute.save()
        
        # إضافة رسالة إغلاق
        DisputeMessage.objects.create(
            dispute=dispute,
            sender=request.user,
            message_type='system',
            content=f"تم إغلاق النزاع من قبل {request.user.get_full_name()}. السبب: {closing_reason}",
            is_system_message=True
        )
        
        return Response({
            'message': 'تم إغلاق النزاع بنجاح',
            'dispute_id': str(dispute.dispute_id),
            'status': dispute.status
        })
        
    except Dispute.DoesNotExist:
        return Response(
            {'error': 'النزاع غير موجود'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'خطأ في إغلاق النزاع: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def assign_dispute(request, dispute_id):
    """تعيين النزاع لموظف دعم"""
    try:
        dispute = Dispute.objects.get(dispute_id=dispute_id)
        
        # التحقق من الصلاحيات
        if not request.user.is_staff:
            return Response(
                {'error': 'فقط الإدارة يمكنها تعيين النزاعات'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        assigned_to_id = request.data.get('assigned_to')
        if not assigned_to_id:
            return Response(
                {'error': 'يجب تحديد الموظف المعين'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            assigned_user = User.objects.get(id=assigned_to_id, is_staff=True)
        except User.DoesNotExist:
            return Response(
                {'error': 'الموظف المحدد غير موجود أو ليس موظف دعم'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # تحديث تعيين النزاع
        dispute.assigned_to = assigned_user
        dispute.save()
        
        # إضافة رسالة تعيين
        DisputeMessage.objects.create(
            dispute=dispute,
            sender=request.user,
            message_type='system',
            content=f"تم تعيين النزاع إلى {assigned_user.get_full_name()}",
            is_system_message=True,
            is_internal=True
        )
        
        return Response({
            'message': 'تم تعيين النزاع بنجاح',
            'dispute_id': str(dispute.dispute_id),
            'assigned_to': {
                'id': assigned_user.id,
                'name': assigned_user.get_full_name()
            }
        })
        
    except Dispute.DoesNotExist:
        return Response(
            {'error': 'النزاع غير موجود'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'خطأ في تعيين النزاع: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class DisputeStatsView(APIView):
    """إحصائيات النزاعات"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # تحديد النزاعات حسب المستخدم
        if user.is_staff:
            disputes = Dispute.objects.all()
        else:
            disputes = Dispute.objects.filter(
                Q(raised_by=user) | Q(against=user)
            )
        
        # حساب الإحصائيات
        total_disputes = disputes.count()
        open_disputes = disputes.filter(status='open').count()
        resolved_disputes = disputes.filter(status='resolved').count()
        escalated_disputes = disputes.filter(status='escalated').count()
        
        # متوسط وقت الحل
        resolved_with_time = disputes.filter(
            status='resolved',
            resolution_date__isnull=False
        ).annotate(
            resolution_time=F('resolution_date') - F('created_at')
        )
        
        avg_resolution_time = 0
        if resolved_with_time.exists():
            total_seconds = sum(
                (dispute.resolution_date - dispute.created_at).total_seconds()
                for dispute in resolved_with_time
            )
            avg_resolution_time = total_seconds / resolved_with_time.count() / 3600  # بالساعات
        
        # النزاعات حسب النوع
        disputes_by_type = dict(
            disputes.values('dispute_type').annotate(
                count=Count('id')
            ).values_list('dispute_type', 'count')
        )
        
        # النزاعات حسب الحالة
        disputes_by_status = dict(
            disputes.values('status').annotate(
                count=Count('id')
            ).values_list('status', 'count')
        )
        
        # النزاعات الشهرية (آخر 12 شهر)
        monthly_disputes = []
        for i in range(12):
            month_start = timezone.now().replace(day=1) - timedelta(days=30*i)
            month_end = month_start + timedelta(days=30)
            count = disputes.filter(
                created_at__gte=month_start,
                created_at__lt=month_end
            ).count()
            monthly_disputes.append({
                'month': month_start.strftime('%Y-%m'),
                'count': count
            })
        
        stats_data = {
            'total_disputes': total_disputes,
            'open_disputes': open_disputes,
            'resolved_disputes': resolved_disputes,
            'escalated_disputes': escalated_disputes,
            'avg_resolution_time': round(avg_resolution_time, 2),
            'disputes_by_type': disputes_by_type,
            'disputes_by_status': disputes_by_status,
            'monthly_disputes': list(reversed(monthly_disputes))
        }
        
        serializer = DisputeStatsSerializer(stats_data)
        return Response(serializer.data)