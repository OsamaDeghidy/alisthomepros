from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, time
from .models import Appointment
from projects.models import Project, Category

User = get_user_model()


class AppointmentModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client_user = User.objects.create_user(
            username='client1',
            email='client1@example.com',
            password='testpass123',
            user_type='client'
        )
        
        self.professional_user = User.objects.create_user(
            username='professional1',
            email='professional1@example.com',
            password='testpass123',
            user_type='home_pro'
        )
        
        # Create a test category and project
        self.category = Category.objects.create(
            name='Home Maintenance',
            description='General home maintenance services'
        )
        
        self.project = Project.objects.create(
            title='Kitchen Renovation',
            description='Complete kitchen renovation project',
            client=self.client_user,
            category=self.category,
            budget_min=5000,
            budget_max=10000,
            location='New York',
            status='active'
        )
    
    def test_appointment_creation(self):
        """Test creating an appointment"""
        appointment = Appointment.objects.create(
            title='Initial Consultation',
            description='Discuss project requirements',
            professional=self.professional_user,
            client=self.client_user,
            project=self.project,
            date=date.today(),
            time=time(14, 30),
            duration=60,
            location='Client\'s home',
            type='consultation',
            status='scheduled'
        )
        
        self.assertEqual(appointment.title, 'Initial Consultation')
        self.assertEqual(appointment.professional, self.professional_user)
        self.assertEqual(appointment.client, self.client_user)
        self.assertEqual(appointment.project, self.project)
        self.assertEqual(appointment.duration, 60)
        self.assertEqual(appointment.type, 'consultation')
        self.assertEqual(appointment.status, 'scheduled')
    
    def test_appointment_str(self):
        """Test appointment string representation"""
        appointment = Appointment.objects.create(
            title='Site Visit',
            professional=self.professional_user,
            client=self.client_user,
            date=date(2024, 1, 15),
            time=time(10, 0),
            duration=120
        )
        
        expected_str = f"Site Visit - 2024-01-15 10:00:00"
        self.assertEqual(str(appointment), expected_str)
    
    def test_appointment_ordering(self):
        """Test appointment ordering by date and time"""
        # Create appointments with different dates/times
        appointment1 = Appointment.objects.create(
            title='First Appointment',
            professional=self.professional_user,
            client=self.client_user,
            date=date(2024, 1, 15),
            time=time(14, 0),
            duration=60
        )
        
        appointment2 = Appointment.objects.create(
            title='Second Appointment',
            professional=self.professional_user,
            client=self.client_user,
            date=date(2024, 1, 15),
            time=time(10, 0),
            duration=60
        )
        
        appointment3 = Appointment.objects.create(
            title='Third Appointment',
            professional=self.professional_user,
            client=self.client_user,
            date=date(2024, 1, 14),
            time=time(16, 0),
            duration=60
        )
        
        appointments = list(Appointment.objects.all())
        
        # Should be ordered by date, then time
        self.assertEqual(appointments[0], appointment3)  # Earliest date
        self.assertEqual(appointments[1], appointment2)  # Same date, earlier time
        self.assertEqual(appointments[2], appointment1)  # Same date, later time


class AppointmentViewTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client_user = User.objects.create_user(
            username='client1',
            email='client1@example.com',
            password='testpass123',
            user_type='client'
        )
        
        self.professional_user = User.objects.create_user(
            username='professional1',
            email='professional1@example.com',
            password='testpass123',
            user_type='home_pro'
        )
        
        self.appointment = Appointment.objects.create(
            title='Test Appointment',
            professional=self.professional_user,
            client=self.client_user,
            date=date.today(),
            time=time(14, 30),
            duration=60
        )
    
    def test_appointment_list_requires_authentication(self):
        """Test that appointment list requires authentication"""
        response = self.client.get('/api/calendar/appointments/')
        self.assertEqual(response.status_code, 401)
    
    def test_appointment_list_authenticated(self):
        """Test appointment list for authenticated user"""
        self.client.force_login(self.client_user)
        response = self.client.get('/api/calendar/appointments/')
        self.assertEqual(response.status_code, 200) 