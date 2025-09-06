'use client';

import { useState, useEffect } from 'react';
import { 
  Clock,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Save,
  Timer,
  Settings,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import Cookies from 'js-cookie';

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  type: 'available' | 'busy' | 'break';
}

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState<Omit<TimeSlot, 'id'>>({ start_time: '', end_time: '', type: 'available' });
  const [activeTab, setActiveTab] = useState('schedule');
  const [timezone, setTimezone] = useState('UTC');
  const [bufferTime, setBufferTime] = useState(15);
  const [maxAdvanceBooking, setMaxAdvanceBooking] = useState(30);

  // Weekly schedule state - will be loaded from backend
  const [weeklySchedule, setWeeklySchedule] = useState<{
    [key: string]: TimeSlot[];
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  }>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  const [specialDates] = useState([]);

  const days = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const timeSlotTypes = [
    { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
    { value: 'busy', label: 'Busy', color: 'bg-red-100 text-red-800' },
    { value: 'break', label: 'Break', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const tabs = [
    { id: 'schedule', label: 'Weekly Schedule', icon: Calendar }
  ];

  const getAvailabilityStats = () => {
    const totalSlots = Object.values(weeklySchedule).reduce((sum, slots) => sum + slots.length, 0);
    const availableDays = Object.keys(weeklySchedule).filter(day => weeklySchedule[day].length > 0).length;
    const totalHours = Object.values(weeklySchedule).reduce((sum, slots) => {
      return sum + slots.reduce((slotSum, slot) => {
        const start = new Date(`2024-01-01T${slot.start_time}`);
        const end = new Date(`2024-01-01T${slot.end_time}`);
        return slotSum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);
    }, 0);

    return {
      totalSlots,
      availableDays,
      totalHours: Math.round(totalHours * 10) / 10
    };
  };

  const stats = getAvailabilityStats();

  // Load availability data from backend
  useEffect(() => {
    loadAvailabilityData();
  }, []);

  const loadAvailabilityData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('access_token');
      
      if (!token) {
        console.warn('No authentication token found');
        setError('Please log in to access availability settings');
        setLoading(false);
        return;
      }
      
      const response = await fetch('https://www.alisthomepros.com/api/calendar/availability/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWeeklySchedule(data.weekly_schedule || {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        });
        setTimezone(data.timezone || 'UTC');
        setBufferTime(data.buffer_time || 15);
        setMaxAdvanceBooking(data.max_advance_booking || 30);
      } else if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        console.error('Failed to load availability data');
        setError('Failed to load availability data');
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      setError('Error loading availability data');
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = Cookies.get('access_token');
      
      if (!token) {
        setError('Please log in to save availability settings');
        setSaving(false);
        return;
      }
      
      const availabilityData = {
        weekly_schedule: weeklySchedule,
        timezone,
        buffer_time: bufferTime,
        max_advance_booking: maxAdvanceBooking
      };

      const response = await fetch('https://www.alisthomepros.com/api/calendar/availability/save/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(availabilityData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess('Availability settings saved successfully!');
        console.log('Saved records:', result.created_records);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else if (response.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save availability settings');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      setError('Error saving availability settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleDayAvailability = (day: string) => {
    const updatedSchedule = { ...weeklySchedule };
    if (updatedSchedule[day].length === 0) {
      // Add default time slot when enabling a day
      updatedSchedule[day] = [{
        id: Date.now(),
        start_time: '09:00',
        end_time: '17:00',
        type: 'available'
      }];
    } else {
      // Clear all slots when disabling a day
      updatedSchedule[day] = [];
    }
    setWeeklySchedule(updatedSchedule);
  };

  const removeTimeSlot = (day: string, slotId: number) => {
    const updatedSchedule = {
      ...weeklySchedule,
      [day]: weeklySchedule[day].filter(slot => slot.id !== slotId)
    };
    setWeeklySchedule(updatedSchedule);
  };

  const addTimeSlot = () => {
    if (newSlot.start_time && newSlot.end_time && selectedDay) {
      const newId = Date.now(); // Simple ID generation
      const updatedSchedule = {
        ...weeklySchedule,
        [selectedDay]: [
          ...weeklySchedule[selectedDay],
          {
            id: newId,
            start_time: newSlot.start_time,
            end_time: newSlot.end_time,
            type: newSlot.type
          }
        ]
      };
      setWeeklySchedule(updatedSchedule);
      setNewSlot({ start_time: '', end_time: '', type: 'available' });
      setShowAddSlotModal(false);
      setSelectedDay(null);
    }
  };

  const updateTimeSlot = () => {
    if (editingSlot && newSlot.start_time && newSlot.end_time) {
      const updatedSchedule = { ...weeklySchedule };
      
      // Find and update the slot
      Object.keys(updatedSchedule).forEach(day => {
        updatedSchedule[day] = updatedSchedule[day].map(slot => 
          slot.id === editingSlot.id 
            ? { ...slot, start_time: newSlot.start_time, end_time: newSlot.end_time, type: newSlot.type }
            : slot
        );
      });
      
      setWeeklySchedule(updatedSchedule);
      setNewSlot({ start_time: '', end_time: '', type: 'available' });
      setEditingSlot(null);
      setShowAddSlotModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading availability settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900 mb-2">
                Availability Settings
              </h1>
              <p className="text-gray-600">
                Manage your availability and booking preferences
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={saveAvailability}
                disabled={saving}
                className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Days</p>
                <p className="font-heading font-bold text-2xl text-dark-900">{stats.availableDays}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Slots</p>
                <p className="font-heading font-bold text-2xl text-dark-900">{stats.totalSlots}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Timer className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Weekly Hours</p>
                <p className="font-heading font-bold text-2xl text-dark-900">{stats.totalHours}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
            <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Weekly Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            {/* General Settings */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h2 className="font-heading font-semibold text-xl text-dark-900 mb-6">
                General Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buffer Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={bufferTime}
                    onChange={(e) => setBufferTime(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Advance Booking (days)
                  </label>
                  <input
                    type="number"
                    value={maxAdvanceBooking}
                    onChange={(e) => setMaxAdvanceBooking(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                    max="365"
                  />
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h2 className="font-heading font-semibold text-xl text-dark-900 mb-6">
                Weekly Schedule
              </h2>
              
              <div className="space-y-6">
                {days.map((day) => {
                  const daySchedule = weeklySchedule[day.key] || [];
                  const isAvailable = daySchedule.length > 0;
                  
                  return (
                    <div key={day.key} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleDayAvailability(day.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              isAvailable ? 'bg-primary-500' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                isAvailable ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <div>
                            <h3 className="font-semibold text-lg text-dark-900">{day.label}</h3>
                            <p className="text-sm text-gray-600">
                              {isAvailable ? `${daySchedule.length} time slot(s)` : 'Unavailable'}
                            </p>
                          </div>
                        </div>
                        {isAvailable && (
                          <button
                            onClick={() => {
                              setSelectedDay(day.key);
                              setNewSlot({ start_time: '09:00', end_time: '17:00', type: 'available' });
                              setEditingSlot(null);
                              setShowAddSlotModal(true);
                            }}
                            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Time Slot</span>
                          </button>
                        )}
                      </div>
                      
                      {isAvailable && daySchedule.length > 0 && (
                        <div className="space-y-3">
                          {daySchedule.map((slot) => {
                            const slotType = timeSlotTypes.find(type => type.value === slot.type);
                            return (
                              <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-dark-900">
                                      {slot.start_time} - {slot.end_time}
                                    </span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${slotType?.color || 'bg-gray-100 text-gray-800'}`}>
                                    {slotType?.label || slot.type}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingSlot(slot);
                                      setNewSlot({
                                        start_time: slot.start_time,
                                        end_time: slot.end_time,
                                        type: slot.type
                                      });
                                      setShowAddSlotModal(true);
                                    }}
                                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => removeTimeSlot(day.key, slot.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Add Time Slot Modal */}
        {showAddSlotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-xl text-dark-900">
                  {editingSlot ? 'Edit Time Slot' : 'Add Time Slot'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddSlotModal(false);
                    setEditingSlot(null);
                    setNewSlot({ start_time: '', end_time: '', type: 'available' });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newSlot.type}
                    onChange={(e) => setNewSlot({ ...newSlot, type: e.target.value as 'available' | 'busy' | 'break' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {timeSlotTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddSlotModal(false);
                    setEditingSlot(null);
                    setNewSlot({ start_time: '', end_time: '', type: 'available' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSlot ? updateTimeSlot : addTimeSlot}
                  className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors duration-200"
                >
                  {editingSlot ? 'Update' : 'Add'} Slot
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}