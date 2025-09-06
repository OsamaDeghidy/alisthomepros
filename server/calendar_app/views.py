from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from datetime import datetime, timedelta, time
from django.utils import timezone
from django.db import models

from .models import Appointment, ProfessionalAvailability
from .serializers import AppointmentSerializer, AppointmentCreateSerializer


class AppointmentListView(generics.ListAPIView):
    """
    Appointments List
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'type']
    search_fields = ['title', 'description']
    ordering_fields = ['date', 'created_at']
    ordering = ['date']
    
    def get_queryset(self):
        user = self.request.user
        return Appointment.objects.filter(
            models.Q(client=user) | models.Q(professional=user)
        )
    
    @extend_schema(
        operation_id="list_appointments",
        summary="List Appointments",
        description="Get current user's appointments list",
        tags=["Calendar"],
        parameters=[
            OpenApiParameter(
                name="status",
                description="Appointment status filter",
                required=False,
                type=OpenApiTypes.STR,
                enum=['scheduled', 'confirmed', 'cancelled', 'completed']
            ),
            OpenApiParameter(
                name="type",
                description="Appointment type filter",
                required=False,
                type=OpenApiTypes.STR,
                enum=['consultation', 'site_visit', 'meeting', 'inspection']
            ),
            OpenApiParameter(
                name="date_from",
                description="Start date filter (YYYY-MM-DD)",
                required=False,
                type=OpenApiTypes.DATE
            ),
            OpenApiParameter(
                name="date_to",
                description="End date filter (YYYY-MM-DD)",
                required=False,
                type=OpenApiTypes.DATE
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Date filtering
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
            
        self.queryset = queryset
        return super().get(request, *args, **kwargs)


class AppointmentDetailView(generics.RetrieveAPIView):
    """
    Appointment Details
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Appointment.objects.filter(
            models.Q(client=user) | models.Q(professional=user)
        )
    
    @extend_schema(
        operation_id="get_appointment_detail",
        summary="Appointment Details",
        description="Get specific appointment details",
        tags=["Calendar"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class AppointmentCreateView(generics.CreateAPIView):
    """
    Create New Appointment
    """
    serializer_class = AppointmentCreateSerializer
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        operation_id="create_appointment",
        summary="Create New Appointment",
        description="Create a new appointment",
        tags=["Calendar"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class AppointmentUpdateView(generics.UpdateAPIView):
    """
    Update Appointment
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Appointment.objects.filter(
            models.Q(client=user) | models.Q(professional=user)
        )
    
    @extend_schema(
        operation_id="update_appointment",
        summary="Update Appointment",
        description="Update existing appointment",
        tags=["Calendar"],
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class AppointmentDeleteView(generics.DestroyAPIView):
    """
    Delete Appointment
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Appointment.objects.filter(
            models.Q(client=user) | models.Q(professional=user)
        )
    
    @extend_schema(
        operation_id="delete_appointment",
        summary="Delete Appointment",
        description="Delete existing appointment",
        tags=["Calendar"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="get_appointment_stats",
    summary="Get Appointment Statistics",
    description="Get appointment statistics for the current user",
    tags=["Calendar"]
)
def get_appointment_stats(request):
    """Get appointment statistics for the current user"""
    try:
        user = request.user
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        
        # Get user's appointments
        user_appointments = Appointment.objects.filter(
            models.Q(client=user) | models.Q(professional=user)
        )
        
        # Calculate statistics
        total_appointments = user_appointments.count()
        today_appointments = user_appointments.filter(date=today).count()
        this_week_appointments = user_appointments.filter(
            date__gte=week_start,
            date__lte=week_end
        ).count()
        
        # Status-based counts
        confirmed_appointments = user_appointments.filter(status='confirmed').count()
        pending_appointments = user_appointments.filter(status='scheduled').count()
        cancelled_appointments = user_appointments.filter(status='cancelled').count()
        completed_appointments = user_appointments.filter(status='completed').count()
        
        # Calculate average duration
        completed_appts = user_appointments.filter(status='completed')
        if completed_appts.exists():
            total_duration = sum([appt.duration for appt in completed_appts])
            average_duration = total_duration / completed_appts.count()
        else:
            average_duration = 0
            
        # Calculate total hours
        total_hours = sum([appt.duration for appt in user_appointments]) / 60
        
        stats = {
            'total_appointments': total_appointments,
            'today_appointments': today_appointments,
            'this_week_appointments': this_week_appointments,
            'confirmed_appointments': confirmed_appointments,
            'pending_appointments': pending_appointments,
            'cancelled_appointments': cancelled_appointments,
            'completed_appointments': completed_appointments,
            'average_duration': average_duration,
            'total_hours': total_hours
        }
        
        return Response(stats)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to get appointment statistics: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="get_available_slots",
    summary="Get Available Time Slots",
    description="Get available appointment slots for a professional on a specific date",
    tags=["Calendar"],
    parameters=[
        OpenApiParameter(
            name="professional_id",
            description="Professional's user ID",
            required=True,
            type=OpenApiTypes.INT
        ),
        OpenApiParameter(
            name="date",
            description="Date to check availability (YYYY-MM-DD)",
            required=True,
            type=OpenApiTypes.DATE
        ),
        OpenApiParameter(
            name="duration",
            description="Appointment duration in minutes (default: 60)",
            required=False,
            type=OpenApiTypes.INT
        )
    ]
)
def get_available_slots(request):
    """Get available appointment slots for a professional"""
    from authentication.models import User
    
    professional_id = request.query_params.get('professional_id')
    date_str = request.query_params.get('date')
    duration = int(request.query_params.get('duration', 60))  # Default 1 hour
    
    if not professional_id or not date_str:
        return Response(
            {'error': 'professional_id and date are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        professional = User.objects.get(
            id=professional_id, 
            user_type__in=['home_pro', 'specialist', 'crew_member'],
            is_active=True
        )
        appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except (User.DoesNotExist, ValueError):
        return Response(
            {'error': 'Invalid professional or date format'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if professional is available on this date
    if not professional.is_available:
        return Response({
            'available_slots': [],
            'message': 'Professional is currently unavailable'
        })
    
    # Get professional's working hours (default 9 AM to 6 PM)
    working_start = time(9, 0)  # 9:00 AM
    working_end = time(18, 0)   # 6:00 PM
    
    # Get existing appointments for this date
    existing_appointments = Appointment.objects.filter(
        professional=professional,
        date=appointment_date,
        status__in=['scheduled', 'confirmed']
    ).order_by('time')
    
    # Generate available slots
    available_slots = []
    current_time = working_start
    
    while current_time < working_end:
        slot_end = (datetime.combine(appointment_date, current_time) + 
                   timedelta(minutes=duration)).time()
        
        if slot_end > working_end:
            break
            
        # Check if this slot conflicts with existing appointments
        slot_available = True
        for appointment in existing_appointments:
            app_start = appointment.time
            app_end = (datetime.combine(appointment_date, app_start) + 
                      timedelta(minutes=appointment.duration)).time()
            
            # Check for overlap
            if (current_time < app_end and slot_end > app_start):
                slot_available = False
                break
        
        if slot_available:
            available_slots.append({
                'start_time': current_time.strftime('%H:%M'),
                'end_time': slot_end.strftime('%H:%M'),
                'duration': duration
            })
        
        # Move to next 30-minute slot
        current_time = (datetime.combine(appointment_date, current_time) + 
                       timedelta(minutes=30)).time()
    
    return Response({
        'professional': {
            'id': professional.id,
            'name': f"{professional.first_name} {professional.last_name}",
            'specialization': getattr(professional, 'specialization', ''),
            'is_available': professional.is_available
        },
        'date': date_str,
        'available_slots': available_slots,
        'total_slots': len(available_slots)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="get_professional_calendar",
    summary="Get Professional Calendar",
    description="Get professional's calendar for a specific month",
    tags=["Calendar"],
    parameters=[
        OpenApiParameter(
            name="professional_id",
            description="Professional's user ID",
            required=True,
            type=OpenApiTypes.INT
        ),
        OpenApiParameter(
            name="year",
            description="Year (YYYY)",
            required=True,
            type=OpenApiTypes.INT
        ),
        OpenApiParameter(
            name="month",
            description="Month (1-12)",
            required=True,
            type=OpenApiTypes.INT
        )
    ]
)
def get_professional_calendar(request):
    """Get professional's calendar for a specific month"""
    from authentication.models import User
    from calendar import monthrange
    
    professional_id = request.query_params.get('professional_id')
    year = request.query_params.get('year')
    month = request.query_params.get('month')
    
    if not all([professional_id, year, month]):
        return Response(
            {'error': 'professional_id, year, and month are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        professional = User.objects.get(
            id=professional_id, 
            user_type__in=['home_pro', 'specialist', 'crew_member'],
            is_active=True
        )
        year = int(year)
        month = int(month)
    except (User.DoesNotExist, ValueError):
        return Response(
            {'error': 'Invalid professional, year, or month'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get month range
    _, days_in_month = monthrange(year, month)
    month_start = datetime(year, month, 1).date()
    month_end = datetime(year, month, days_in_month).date()
    
    # Get appointments for the month
    appointments = Appointment.objects.filter(
        professional=professional,
        date__range=[month_start, month_end]
    ).order_by('date', 'time')
    
    # Build calendar data
    calendar_data = {}
    for day in range(1, days_in_month + 1):
        date = datetime(year, month, day).date()
        date_str = date.strftime('%Y-%m-%d')
        
        day_appointments = appointments.filter(date=date)
        
        calendar_data[date_str] = {
            'date': date_str,
            'day_of_week': date.strftime('%A'),
            'is_weekend': date.weekday() >= 5,
            'is_available': professional.is_available and date >= timezone.now().date(),
            'appointments': [
                {
                    'id': app.id,
                    'title': app.title,
                    'time': app.time.strftime('%H:%M'),
                    'duration': app.duration,
                    'status': app.status,
                    'client': f"{app.client.first_name} {app.client.last_name}" if app.client else None
                }
                for app in day_appointments
            ],
            'available_slots_count': len(get_day_available_slots(professional, date))
        }
    
    return Response({
        'professional': {
            'id': professional.id,
            'name': f"{professional.first_name} {professional.last_name}",
            'specialization': getattr(professional, 'specialization', ''),
            'is_available': professional.is_available
        },
        'year': year,
        'month': month,
        'calendar': calendar_data
    })


def get_day_available_slots(professional, date):
    """Helper function to calculate available slots for a day"""
    if not professional.is_available or date < timezone.now().date():
        return []
    
    working_start = time(9, 0)
    working_end = time(18, 0)
    slot_duration = 60  # 1 hour slots
    
    existing_appointments = Appointment.objects.filter(
        professional=professional,
        date=date,
        status__in=['scheduled', 'confirmed']
    )
    
    available_slots = []
    current_time = working_start
    
    while current_time < working_end:
        slot_end = (datetime.combine(date, current_time) + 
                   timedelta(minutes=slot_duration)).time()
        
        if slot_end > working_end:
            break
            
        slot_available = True
        for appointment in existing_appointments:
            app_start = appointment.time
            app_end = (datetime.combine(date, app_start) + 
                      timedelta(minutes=appointment.duration)).time()
            
            if (current_time < app_end and slot_end > app_start):
                slot_available = False
                break
        
        if slot_available:
            available_slots.append({
                'start_time': current_time.strftime('%H:%M'),
                'end_time': slot_end.strftime('%H:%M')
            })
        
        current_time = (datetime.combine(date, current_time) + 
                       timedelta(minutes=30)).time()
    
    return available_slots


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="set_professional_availability",
    summary="Set Professional Availability",
    description="Set professional's availability status and working hours",
    tags=["Calendar"],
    request={
        "type": "object",
        "properties": {
            "is_available": {"type": "boolean"},
            "working_hours": {
                "type": "object",
                "properties": {
                    "start_time": {"type": "string", "example": "09:00"},
                    "end_time": {"type": "string", "example": "18:00"}
                }
            },
            "unavailable_dates": {
                "type": "array",
                "items": {"type": "string", "format": "date"}
            }
        }
    }
)
def set_professional_availability(request):
    """Set professional's availability"""
    user = request.user
    
    if user.user_type not in ['home_pro', 'specialist', 'crew_member']:
        return Response(
            {'error': 'Only professionals can set availability'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    data = request.data
    is_available = data.get('is_available')
    
    if is_available is not None:
        user.is_available = is_available
        user.save()
    
    return Response({
        'message': 'Availability updated successfully',
        'is_available': user.is_available
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="get_professional_availability",
    summary="Get Professional Availability Schedule",
    description="Get professional's weekly availability schedule",
    tags=["Calendar"]
)
def get_professional_availability(request):
    """Get professional's weekly availability schedule"""
    user = request.user
    
    if user.user_type not in ['home_pro', 'specialist', 'crew_member']:
        return Response(
            {'error': 'Only professionals can access availability'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all availability records for this professional
    availability_records = ProfessionalAvailability.objects.filter(
        professional=user
    ).order_by('weekday')
    
    # Create weekly schedule structure
    weekly_schedule = {
        'monday': [],
        'tuesday': [],
        'wednesday': [],
        'thursday': [],
        'friday': [],
        'saturday': [],
        'sunday': []
    }
    
    weekday_names = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    
    for record in availability_records:
        day_name = weekday_names[record.weekday]
        slot_data = {
            'id': record.id,
            'start_time': record.start_time.strftime('%H:%M'),
            'end_time': record.end_time.strftime('%H:%M'),
            'type': 'available' if record.is_available else 'busy'
        }
        
        # Add break times if they exist
        if record.break_start and record.break_end:
            slot_data['break_start'] = record.break_start.strftime('%H:%M')
            slot_data['break_end'] = record.break_end.strftime('%H:%M')
        
        weekly_schedule[day_name].append(slot_data)
    
    return Response({
        'professional_id': user.id,
        'weekly_schedule': weekly_schedule,
        'timezone': 'UTC',  # You can make this configurable
        'buffer_time': 15,  # Default buffer time in minutes
        'max_advance_booking': 30  # Default max advance booking in days
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@extend_schema(
    operation_id="save_professional_availability",
    summary="Save Professional Availability Schedule",
    description="Save professional's weekly availability schedule",
    tags=["Calendar"],
    request={
        "type": "object",
        "properties": {
            "weekly_schedule": {
                "type": "object",
                "properties": {
                    "monday": {"type": "array"},
                    "tuesday": {"type": "array"},
                    "wednesday": {"type": "array"},
                    "thursday": {"type": "array"},
                    "friday": {"type": "array"},
                    "saturday": {"type": "array"},
                    "sunday": {"type": "array"}
                }
            },
            "timezone": {"type": "string"},
            "buffer_time": {"type": "integer"},
            "max_advance_booking": {"type": "integer"}
        }
    }
)
def save_professional_availability(request):
    """Save professional's weekly availability schedule"""
    user = request.user
    
    if user.user_type not in ['home_pro', 'specialist', 'crew_member']:
        return Response(
            {'error': 'Only professionals can set availability'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    data = request.data
    weekly_schedule = data.get('weekly_schedule', {})
    
    # Clear existing availability records for this professional
    ProfessionalAvailability.objects.filter(professional=user).delete()
    
    weekday_mapping = {
        'monday': 0,
        'tuesday': 1,
        'wednesday': 2,
        'thursday': 3,
        'friday': 4,
        'saturday': 5,
        'sunday': 6
    }
    
    created_records = []
    
    try:
        for day_name, slots in weekly_schedule.items():
            if day_name not in weekday_mapping:
                continue
                
            weekday = weekday_mapping[day_name]
            
            for slot in slots:
                start_time = datetime.strptime(slot['start_time'], '%H:%M').time()
                end_time = datetime.strptime(slot['end_time'], '%H:%M').time()
                is_available = slot.get('type', 'available') == 'available'
                
                # Handle break times if provided
                break_start = None
                break_end = None
                if 'break_start' in slot and 'break_end' in slot:
                    break_start = datetime.strptime(slot['break_start'], '%H:%M').time()
                    break_end = datetime.strptime(slot['break_end'], '%H:%M').time()
                
                availability_record = ProfessionalAvailability.objects.create(
                    professional=user,
                    weekday=weekday,
                    start_time=start_time,
                    end_time=end_time,
                    is_available=is_available,
                    break_start=break_start,
                    break_end=break_end
                )
                
                created_records.append({
                    'id': availability_record.id,
                    'day': day_name,
                    'start_time': slot['start_time'],
                    'end_time': slot['end_time'],
                    'type': slot.get('type', 'available')
                })
    
    except Exception as e:
        return Response(
            {'error': f'Failed to save availability: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response({
        'message': 'Availability schedule saved successfully',
        'created_records': len(created_records),
        'records': created_records
    })


@api_view(['GET'])
@permission_classes([AllowAny])
@extend_schema(
    operation_id="get_public_professional_availability",
    summary="Get Public Professional Availability",
    description="Get professional's availability status (public access)",
    tags=["Calendar"]
)
def get_public_professional_availability(request, professional_id):
    """Get professional's public availability information"""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        professional = User.objects.get(
            id=professional_id,
            is_active=True,
            user_type__in=['home_pro', 'specialist', 'crew_member']
        )
        
        # Get basic availability info (simplified for public view)
        availability_records = ProfessionalAvailability.objects.filter(
            professional=professional,
            is_available=True
        ).order_by('weekday')
        
        # Create simplified weekly schedule for public view
        weekly_schedule = {
            'monday': [],
            'tuesday': [],
            'wednesday': [],
            'thursday': [],
            'friday': [],
            'saturday': [],
            'sunday': []
        }
        
        weekday_names = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        
        for record in availability_records:
            day_name = weekday_names[record.weekday]
            slot_data = {
                'start_time': record.start_time.strftime('%H:%M'),
                'end_time': record.end_time.strftime('%H:%M'),
                'available': record.is_available
            }
            weekly_schedule[day_name].append(slot_data)
        
        return Response({
            'professional_id': professional.id,
            'is_available': professional.is_available,
            'weekly_schedule': weekly_schedule,
            'response_time': getattr(professional, 'response_time', 'Within 24 hours')
        })
        
    except User.DoesNotExist:
        return Response(
            {'error': 'Professional not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )