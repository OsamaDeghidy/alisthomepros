'use client';

import dynamic from 'next/dynamic';

const MessagesClient = dynamic(() => import('./MessagesClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  )
});

interface Message {
  id: number;
  content: string;
  sender: User;
  conversation: number;
  created_at: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: number;
  file: string;
  file_url: string;
  original_filename: string;
  file_size: number;
  file_size_formatted: string;
  file_type: string;
  mime_type: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  display_name?: string;
  user_type: string;
  is_available?: boolean;
  is_verified?: boolean;
  rating?: number;
  avatar?: string;
}

interface FileUpload {
  file: File;
  preview?: string;
}

interface Professional {
  id: number;
  user: User;
  specialization: string;
  experience_years: number;
  hourly_rate: number;
  availability?: {
    weeklySchedule: WeeklySchedule;
  };
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface DaySchedule {
  isAvailable: boolean;
  slots: TimeSlot[];
}

interface TimeSlot {
  start: string;
  end: string;
}

export default function MessagesPage() {

  return <MessagesClient />;
}