from django.urls import path
from . import views

app_name = 'calendar_app'

urlpatterns = [
    # Appointments
    path('appointments/', views.AppointmentListView.as_view(), name='appointment_list'),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment_detail'),
    path('appointments/create/', views.AppointmentCreateView.as_view(), name='appointment_create'),
    path('appointments/<int:pk>/update/', views.AppointmentUpdateView.as_view(), name='appointment_update'),
    path('appointments/<int:pk>/delete/', views.AppointmentDeleteView.as_view(), name='appointment_delete'),
    
    # Statistics
    path('appointments/stats/', views.get_appointment_stats, name='appointment_stats'),
    
    # Available slots and calendar
    path('available-slots/', views.get_available_slots, name='available_slots'),
    path('professional-calendar/', views.get_professional_calendar, name='professional_calendar'),
    path('set-availability/', views.set_professional_availability, name='set_availability'),
    
    # Professional availability schedule
    path('availability/', views.get_professional_availability, name='get_availability'),
    path('availability/save/', views.save_professional_availability, name='save_availability'),
    
    # Public professional availability
    path('professionals/<int:professional_id>/availability/', views.get_public_professional_availability, name='public_professional_availability'),
]