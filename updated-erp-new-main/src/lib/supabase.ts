import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ahsyetnbbpsjhdydolng.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoc3lldG5iYnBzamhkeWRvbG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzY1OTAsImV4cCI6MjA2NzMxMjU5MH0.Q1ryS84YdGsEJznndzakGdaSKd5Svz3_ogA-J18a0lQ';

// Validate Supabase credentials
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key';

// Create a client even if credentials are not fully validated
// This allows the app to run in demo mode
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log status for debugging
console.log('Supabase client initialized in demo mode');

// Helper functions for database operations
export const db = {
  // Check if Supabase is properly configured
  isConfigured: () => hasValidCredentials,
  
  // Show configuration error
  showConfigError: () => {
    if (!hasValidCredentials) {
      throw new Error('Supabase is not properly configured. Please check your environment variables.');
    }
  },
  
  // Students
  async getStudents() {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getStudentById(id: string) {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching student:', error);
      return null;
    }
    
    return data;
  },
  
  async createStudent(student: any) {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('students')
      .insert([student])
      .select();
    
    if (error) {
      console.error('Error creating student:', error);
      return null;
    }
    
    return data?.[0] || null;
  },
  
  async updateStudent(id: string, updates: any) {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating student:', error);
      return null;
    }
    
    return data?.[0] || null;
  },
  
  // Faculty
  async getFaculty() {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching faculty:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Attendance
  async getAttendance(filters = {}) {
    this.showConfigError();
    
    let query = supabase
      .from('attendance')
      .select('*, students(name, rollNumber)');
    
    // Apply filters
    if (filters.studentId) {
      query = query.eq('student_id', filters.studentId);
    }
    
    if (filters.date) {
      query = query.eq('date', filters.date);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
    
    return data || [];
  },
  
  async markAttendance(records) {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('attendance')
      .insert(records)
      .select();
    
    if (error) {
      console.error('Error marking attendance:', error);
      return null;
    }
    
    return data;
  },
  
  // Marks
  async getMarks(filters = {}) {
    this.showConfigError();
    
    let query = supabase
      .from('marks')
      .select('*, students(name, rollNumber)');
    
    // Apply filters
    if (filters.studentId) {
      query = query.eq('student_id', filters.studentId);
    }
    
    if (filters.subject) {
      query = query.eq('subject', filters.subject);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching marks:', error);
      return [];
    }
    
    return data || [];
  },
  
  async saveMarks(records) {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('marks')
      .insert(records)
      .select();
    
    if (error) {
      console.error('Error saving marks:', error);
      return null;
    }
    
    return data;
  },
  
  // Fees
  async getFees(filters = {}) {
    this.showConfigError();
    
    let query = supabase
      .from('fees')
      .select('*, students(name, rollNumber)');
    
    // Apply filters
    if (filters.studentId) {
      query = query.eq('student_id', filters.studentId);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query.order('due_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching fees:', error);
      return [];
    }
    
    return data || [];
  },
  
  async recordPayment(payment) {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('fees')
      .insert([payment])
      .select();
    
    if (error) {
      console.error('Error recording payment:', error);
      return null;
    }
    
    return data?.[0] || null;
  },
  
  // Notifications
  async getNotifications(filters = {}) {
    this.showConfigError();
    
    let query = supabase
      .from('notifications')
      .select('*');
    
    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data || [];
  },
  
  async createNotification(notification) {
    this.showConfigError();
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select();
    
    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    
    return data?.[0] || null;
  },
  
  // User authentication
  async signIn(email, password) {
    this.showConfigError();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return { user: null, error };
    }
    
    return { user: data.user, session: data.session, error: null };
  },
  
  async signOut() {
    this.showConfigError();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      return false;
    }
    
    return true;
  },
  
  async getCurrentUser() {
    this.showConfigError();
    
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return data?.user || null;
  }
};