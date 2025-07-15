export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'hod' | 'principal' | 'director';
  department?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  rollNumber?: string; // For students
  jobId?: string; // For faculty and staff
}

export interface DashboardStats {
  attendance?: number;
  marks?: number;
  feeDues?: number;
  notifications?: number;
  students?: number;
  faculty?: number;
  departments?: number;
  revenue?: number;
}

export interface AttendanceRecord {
  date: string;
  present: boolean;
  subject?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
}