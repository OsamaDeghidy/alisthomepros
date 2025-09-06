import api from './api';

export interface Appointment {
  id: number;
  title: string;
  description?: string;
  professional: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  client: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  project_info?: {
    id: number;
    title: string;
    slug: string;
  };
  date: string;
  time: string;
  duration: number;
  location?: string;
  meeting_link?: string;
  type: 'consultation' | 'site_visit' | 'meeting' | 'inspection';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreate {
  title: string;
  description?: string;
  professional: number;
  project?: number;
  date: string;
  time: string;
  duration: number;
  location?: string;
  meeting_link?: string;
  type: 'consultation' | 'site_visit' | 'meeting' | 'inspection';
}

export interface AppointmentUpdate {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  duration?: number;
  location?: string;
  meeting_link?: string;
  type?: 'consultation' | 'site_visit' | 'meeting' | 'inspection';
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

export interface AppointmentFilters {
  status?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentStats {
  total_appointments: number;
  today_appointments: number;
  this_week_appointments: number;
  confirmed_appointments: number;
  pending_appointments: number;
  cancelled_appointments: number;
  completed_appointments: number;
  average_duration: number;
  total_hours: number;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
  duration: number;
}

export interface AvailableSlotsResponse {
  professional: {
    id: number;
    name: string;
    specialization: string;
    is_available: boolean;
  };
  date: string;
  available_slots: AvailableSlot[];
  total_slots: number;
}

export interface CalendarDay {
  date: string;
  day_of_week: string;
  is_weekend: boolean;
  is_available: boolean;
  appointments: {
    id: number;
    title: string;
    time: string;
    duration: number;
    status: string;
    client: string | null;
  }[];
  available_slots_count: number;
}

export interface CalendarResponse {
  professional: {
    id: number;
    name: string;
    specialization: string;
    is_available: boolean;
  };
  year: number;
  month: number;
  calendar: Record<string, CalendarDay>;
}

export interface AvailabilitySettings {
  is_available: boolean;
  working_hours?: {
    start_time: string;
    end_time: string;
  };
  unavailable_dates?: string[];
}

export const calendarService = {
  // Appointments
  async getAppointments(filters?: AppointmentFilters): Promise<{ results: Appointment[]; count: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/calendar/appointments/?${params.toString()}`);
    return response.data;
  },

  async getAppointment(id: number): Promise<Appointment> {
    const response = await api.get(`/calendar/appointments/${id}/`);
    return response.data;
  },

  async createAppointment(data: AppointmentCreate): Promise<Appointment> {
    const response = await api.post('/calendar/appointments/create/', data);
    return response.data;
  },

  async updateAppointment(id: number, data: AppointmentUpdate): Promise<Appointment> {
    const response = await api.patch(`/calendar/appointments/${id}/update/`, data);
    return response.data;
  },

  async deleteAppointment(id: number): Promise<void> {
    await api.delete(`/calendar/appointments/${id}/delete/`);
  },

  // Statistics
  async getAppointmentStats(): Promise<AppointmentStats> {
    const response = await api.get('/calendar/appointments/stats/');
    return response.data;
  },

  // Available slots
  async getAvailableSlots(
    professionalId: number,
    date: string,
    duration: number = 60
  ): Promise<AvailableSlotsResponse> {
    const params = new URLSearchParams({
      professional_id: professionalId.toString(),
      date,
      duration: duration.toString()
    });
    
    const response = await api.get(`/calendar/available-slots/?${params.toString()}`);
    return response.data;
  },

  // Professional calendar
  async getProfessionalCalendar(
    professionalId: number,
    year: number,
    month: number
  ): Promise<CalendarResponse> {
    const params = new URLSearchParams({
      professional_id: professionalId.toString(),
      year: year.toString(),
      month: month.toString()
    });
    
    const response = await api.get(`/calendar/professional-calendar/?${params.toString()}`);
    return response.data;
  },

  // Availability settings
  async setAvailability(settings: AvailabilitySettings): Promise<{ message: string; is_available: boolean }> {
    const response = await api.post('/calendar/set-availability/', settings);
    return response.data;
  }
};