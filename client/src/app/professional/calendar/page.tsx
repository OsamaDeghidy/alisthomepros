'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Video,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Timer,
  Users,
  Loader2
} from 'lucide-react';
import { calendarService, Appointment, AppointmentStats } from '@/lib/calendar';
import { useAuthStore } from '@/lib/store';

export default function CalendarPage() {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [, setShowAddAppointment] = useState(false);
  const [, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState('all');
  const [, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        status: filter === 'all' ? undefined : filter,
        date_from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
        date_to: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]
      };
      
      const response = await calendarService.getAppointments(filters);
      setAppointments(response.results || []);
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointment statistics
  const fetchStats = async () => {
    try {
      const response = await calendarService.getAppointmentStats();
      setStats(response);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchStats();
    }
  }, [user, currentDate, filter]);

  // Sample appointments data for fallback
  const sampleAppointments = [
    {
      id: 1,
      title: 'Kitchen Consultation',
      client: 'John Smith',
      date: '2024-01-15',
      time: '10:00 AM - 11:30 AM',
      duration: 90,
      type: 'consultation',
      status: 'confirmed',
      location: 'Client Location',
      address: '123 Main St, Los Angeles, CA',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      notes: 'Initial consultation for kitchen renovation project. Discuss layout, budget, and timeline.',
      budget: '$15,000',
      projectType: 'Kitchen Remodeling',
      priority: 'high',
      estimatedDuration: '2-3 weeks'
    },
    {
      id: 2,
      title: 'Bathroom Renovation - Progress Check',
      client: 'Sarah Johnson',
      date: '2024-01-15',
      time: '2:00 PM - 3:00 PM',
      duration: 60,
      type: 'site_visit',
      status: 'confirmed',
      location: 'Client Location',
      address: '456 Oak Ave, Beverly Hills, CA',
      phone: '+1 (555) 987-6543',
      email: 'sarah.johnson@email.com',
      notes: 'Weekly progress check. Review completed work and discuss next steps.',
      budget: '$8,500',
      projectType: 'Bathroom Renovation',
      priority: 'medium',
      completedPercentage: 65
    },
    {
      id: 3,
      title: 'Video Call - Project Discussion',
      client: 'Mike Davis',
      date: '2024-01-16',
      time: '9:00 AM - 10:00 AM',
      duration: 60,
      type: 'meeting',
      status: 'pending',
      location: 'Video Call',
      phone: '+1 (555) 456-7890',
      email: 'mike.davis@email.com',
      notes: 'Discuss electrical work requirements and timeline.',
      budget: '$3,200',
      projectType: 'Electrical Work',
      priority: 'low',
      meetingLink: 'https://zoom.us/j/123456789'
    },
    {
      id: 4,
      title: 'Final Walkthrough - Deck Installation',
      client: 'Emily Wilson',
      date: '2024-01-17',
      time: '11:00 AM - 12:00 PM',
      duration: 60,
      type: 'inspection',
      status: 'confirmed',
      location: 'Client Location',
      address: '789 Pine St, Santa Monica, CA',
      phone: '+1 (555) 321-0987',
      email: 'emily.wilson@email.com',
      notes: 'Final project walkthrough and completion documentation.',
      budget: '$6,800',
      projectType: 'Deck Installation',
      priority: 'high',
      completedPercentage: 100
    },
    {
      id: 5,
      title: 'Material Delivery Coordination',
      client: 'Robert Brown',
      date: '2024-01-18',
      time: '8:00 AM - 9:00 AM',
      duration: 60,
      type: 'consultation',
      status: 'pending',
      location: 'Client Location',
      address: '321 Elm St, Pasadena, CA',
      phone: '+1 (555) 654-3210',
      email: 'robert.brown@email.com',
      notes: 'Coordinate material delivery and site preparation.',
      budget: '$12,000',
      projectType: 'Flooring Installation',
      priority: 'medium'
    }
  ];

  const appointmentTypes = [
    { value: 'all', label: 'All Types', count: appointments.length },
    { value: 'consultation', label: 'Consultations', count: appointments.filter(a => a.type === 'consultation').length },
    { value: 'site_visit', label: 'Site Visits', count: appointments.filter(a => a.type === 'site_visit').length },
    { value: 'meeting', label: 'Meetings', count: appointments.filter(a => a.type === 'meeting').length },
    { value: 'inspection', label: 'Inspections', count: appointments.filter(a => a.type === 'inspection').length }
  ];

  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const typeColors = {
    consultation: 'bg-purple-100 text-purple-800',
    site_visit: 'bg-blue-100 text-blue-800',
    meeting: 'bg-green-100 text-green-800',
    inspection: 'bg-orange-100 text-orange-800'
  };



  // Get today's appointments
  const todayAppointments = appointments.filter(app => {
    const appointmentDate = new Date(app.date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments.filter(app => {
    const appointmentDate = new Date(app.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return appointmentDate >= today && appointmentDate <= nextWeek;
  });

  // Filter appointments
  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(app => app.type === filter);

  // Stats from API or calculated from appointments
  const displayStats = [
    {
      label: 'Today\'s Appointments',
      value: stats?.today_appointments || todayAppointments.length,
      subtext: 'Scheduled',
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'This Week',
      value: stats?.this_week_appointments || upcomingAppointments.length,
      subtext: 'Upcoming',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Pending Confirmation',
      value: stats?.pending_appointments || appointments.filter(a => a.status === 'scheduled').length,
      subtext: 'Awaiting Response',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Total Hours',
      value: Math.round((stats?.total_hours || appointments.reduce((sum, app) => sum + app.duration, 0) / 60) * 10) / 10,
      subtext: 'This Month',
      icon: Timer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return MessageCircle;
      case 'site_visit':
        return MapPin;
      case 'meeting':
        return Video;
      case 'inspection':
        return CheckCircle;
      default:
        return CalendarIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                Calendar & Appointments
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your schedule and client appointments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${
                    viewMode === 'month' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    viewMode === 'week' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${
                    viewMode === 'day' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Day
                </button>
              </div>
              <button
                onClick={() => setShowAddAppointment(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.subtext}</p>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-dark-900">
                  {viewMode === 'month' ? 'Monthly Calendar' : 
                   viewMode === 'week' ? 'Weekly Calendar' : 'Daily Calendar'}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    className="p-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-lg font-semibold text-dark-900 min-w-[200px] text-center">
                    {currentDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    className="p-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Simple Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();
                  const hasAppointments = appointments.some(app => 
                    new Date(app.date).toDateString() === date.toDateString()
                  );
                  
                  return (
                    <div
                      key={i}
                      className={`p-2 text-center text-sm rounded-lg cursor-pointer transition-all duration-200 ${
                        isCurrentMonth 
                          ? 'text-gray-900 hover:bg-primary-50' 
                          : 'text-gray-400'
                      } ${
                        isToday 
                          ? 'bg-primary-500 text-white hover:bg-primary-600' 
                          : ''
                      } ${
                        hasAppointments && !isToday 
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : ''
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date.getDate()}
                      {hasAppointments && !isToday && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">
                Today&apos;s Appointments
              </h3>
              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => {
                    const IconComponent = getAppointmentIcon(appointment.type);
                    return (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary-50 rounded-lg">
                            <IconComponent className="h-4 w-4 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-dark-900 text-sm">
                              {appointment.title}
                            </h4>
                            <p className="text-gray-600 text-xs mt-1">
                              {typeof appointment.client === 'string' 
                                ? appointment.client 
                                : `${appointment.client?.first_name || ''} ${appointment.client?.last_name || ''}`.trim() || appointment.client?.username || 'Unknown Client'
                              }
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {appointment.time}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[appointment.status as keyof typeof statusColors]}`}>
                                {appointment.status}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${typeColors[appointment.type as keyof typeof typeColors]}`}>
                                {appointment.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No appointments today</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/professional/availability"
                  className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                >
                  <Clock className="h-5 w-5 text-primary-600" />
                  <span className="text-primary-700 font-medium">Set Availability</span>
                </Link>
                <Link
                  href="/professional/time-tracker"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Timer className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Time Tracker</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Messages</span>
                </Link>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Schedule from Messages</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* All Appointments */}
        {!loading && (
          <div className="mt-8 bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-xl text-dark-900">
                All Appointments
              </h2>
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {appointmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const IconComponent = getAppointmentIcon(appointment.type);
                return (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary-50 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-dark-900 text-lg">
                            {appointment.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Client: {typeof appointment.client === 'string' 
                              ? appointment.client 
                              : `${appointment.client?.first_name || ''} ${appointment.client?.last_name || ''}`.trim() || appointment.client?.username || 'Unknown Client'
                            }
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <span className={`text-xs px-3 py-1 rounded-full ${statusColors[appointment.status as keyof typeof statusColors]}`}>
                              {appointment.status}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full ${typeColors[appointment.type as keyof typeof typeColors]}`}>
                              {appointment.type.replace('_', ' ')}
                            </span>
                          </div>
                          {appointment.description && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                              {appointment.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}