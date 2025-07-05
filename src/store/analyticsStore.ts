import { create } from 'zustand';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';

// Types for analytics data
export interface AnalyticsUpdate {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  metricType: 'attendance' | 'marks' | 'fees' | 'enrollment' | 'placement' | 'other';
  metricName: string;
  previousValue: number | null;
  newValue: number;
  percentageChange: number | null;
  department?: string;
}

export interface DepartmentData {
  name: string;
  students: number;
  faculty: number;
  color: string;
  value: number;
}

export interface AttendanceData {
  department: string;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
}

export interface MonthlyGrowthData {
  month: string;
  students: number;
  faculty: number;
}

export interface LoginTrendsData {
  period: string;
  overall: number;
  students: number;
  faculty: number;
  hod: number;
  admin: number;
}

export interface MonthlyBillingData {
  month: string;
  total: number;
  tuition: number;
  hostel: number;
  misc: number;
}

export interface AnalyticsState {
  // Dashboard metrics
  totalStudents: number;
  totalFaculty: number;
  techDepartments: number;
  monthlyBilling: number;
  innovationRate: number;
  
  // Charts data
  departmentData: DepartmentData[];
  attendanceData: AttendanceData[];
  monthlyGrowth: MonthlyGrowthData[];
  loginTrendsData: LoginTrendsData[];
  monthlyBillingData: MonthlyBillingData[];
  
  // Real-time updates
  recentUpdates: AnalyticsUpdate[];
  isConnected: boolean;
  lastUpdateTimestamp: Date | null;
  
  // Filters
  loginFilter: string;
  billingFilter: string;
  attendanceFilter: {
    year: string;
    semester: string;
    section: string;
  };
  
  // Audit log
  auditLog: AnalyticsUpdate[];
  setAuditLog: (updates: AnalyticsUpdate[]) => void;
  
  // Actions
  updateMetric: (update: AnalyticsUpdate) => void;
  setConnectionStatus: (status: boolean) => void;
  setLoginFilter: (filter: string) => void;
  setBillingFilter: (filter: string) => void;
  setAttendanceFilter: (filter: { year: string; semester: string; section: string }) => void;
  clearRecentUpdates: () => void;
}

// Create the store
const useAnalyticsStore = create<AnalyticsState>((set) => ({
  // Initial dashboard metrics
  totalStudents: 2847,
  totalFaculty: 156,
  techDepartments: 12,
  monthlyBilling: 515000,
  innovationRate: 98.5,
  
  // Initial charts data
  departmentData: [
    { name: 'Computer Science & AI', value: 35, color: '#22c55e', students: 850, faculty: 45 },
    { name: 'AI & Machine Learning', value: 25, color: '#84cc16', students: 620, faculty: 35 },
    { name: 'Data Science', value: 20, color: '#eab308', students: 580, faculty: 32 },
    { name: 'Software Engineering', value: 20, color: '#16a34a', students: 520, faculty: 28 },
  ],
  
  attendanceData: [
    { department: 'Computer Science', year1: 87, year2: 89, year3: 85, year4: 91 },
    { department: 'AI & ML', year1: 92, year2: 88, year3: 90, year4: 89 },
    { department: 'Data Science', year1: 85, year2: 87, year3: 89, year4: 92 },
    { department: 'Software Eng', year1: 88, year2: 90, year3: 87, year4: 85 },
  ],
  
  monthlyGrowth: [
    { month: 'Jan', students: 2650, faculty: 150 },
    { month: 'Feb', students: 2720, faculty: 152 },
    { month: 'Mar', students: 2780, faculty: 154 },
    { month: 'Apr', students: 2820, faculty: 155 },
    { month: 'May', students: 2847, faculty: 156 },
  ],
  
  loginTrendsData: [
    { period: 'Week 1', overall: 1250, students: 800, faculty: 350, hod: 50, admin: 50 },
    { period: 'Week 2', overall: 1380, students: 900, faculty: 380, hod: 50, admin: 50 },
    { period: 'Week 3', overall: 1420, students: 920, faculty: 400, hod: 50, admin: 50 },
    { period: 'Week 4', overall: 1500, students: 980, faculty: 420, hod: 50, admin: 50 },
  ],
  
  monthlyBillingData: [
    { month: 'Jan', total: 485000, tuition: 350000, hostel: 85000, misc: 50000 },
    { month: 'Feb', total: 520000, tuition: 380000, hostel: 90000, misc: 50000 },
    { month: 'Mar', total: 495000, tuition: 360000, hostel: 85000, misc: 50000 },
    { month: 'Apr', total: 540000, tuition: 400000, hostel: 90000, misc: 50000 },
    { month: 'May', total: 515000, tuition: 375000, hostel: 90000, misc: 50000 },
  ],
  
  // Real-time updates
  recentUpdates: [],
  isConnected: false,
  lastUpdateTimestamp: null,
  
  // Filters
  loginFilter: 'overall',
  billingFilter: 'all',
  attendanceFilter: {
    year: 'all',
    semester: 'all',
    section: 'all'
  },
  
  // Audit log
  auditLog: [],
  setAuditLog: (updates) => set({ auditLog: updates }),
  
  // Actions
  updateMetric: (update) => set((state) => {
    // Create a new update with a formatted timestamp for display
    const formattedUpdate = {
      ...update,
      id: update.id || crypto.randomUUID(),
      timestamp: update.timestamp || new Date()
    };
    
    // Update the specific metric based on the update type
    let newState = { ...state };
    
    switch (update.metricType) {
      case 'enrollment':
        if (update.metricName === 'totalStudents') {
          newState.totalStudents = update.newValue;
        } else if (update.metricName === 'totalFaculty') {
          newState.totalFaculty = update.newValue;
        }
        break;
        
      case 'fees':
        if (update.metricName === 'monthlyBilling') {
          newState.monthlyBilling = update.newValue;
          
          // Update the monthly billing data for the current month
          const currentMonth = format(new Date(), 'MMM');
          newState.monthlyBillingData = state.monthlyBillingData.map(item => 
            item.month === currentMonth 
              ? { ...item, total: update.newValue } 
              : item
          );
        }
        break;
        
      case 'attendance':
        // Update attendance data for the specific department and year
        if (update.department && update.metricName.startsWith('year')) {
          const year = update.metricName;
          newState.attendanceData = state.attendanceData.map(item => 
            item.department === update.department
              ? { ...item, [year]: update.newValue }
              : item
          );
        }
        break;
        
      // Add more cases for other metric types
    }
    
    // Add to recent updates (keep last 10)
    const recentUpdates = [formattedUpdate, ...state.recentUpdates].slice(0, 10);
    
    // Add to audit log (keep all)
    const auditLog = [formattedUpdate, ...state.auditLog];
    
    // Save to database
    try {
      supabase.from('analytics_updates').insert([{
        id: formattedUpdate.id,
        user_id: formattedUpdate.userId,
        user_name: formattedUpdate.userName,
        user_role: formattedUpdate.userRole,
        metric_type: formattedUpdate.metricType,
        metric_name: formattedUpdate.metricName,
        previous_value: formattedUpdate.previousValue,
        new_value: formattedUpdate.newValue,
        percentage_change: formattedUpdate.percentageChange,
        department: formattedUpdate.department
      }]).then(({ error }) => {
        if (error) {
          console.error('Error saving analytics update:', error);
        }
      });
    } catch (error) {
      console.error('Error saving analytics update:', error);
    }
    
    return {
      ...newState,
      recentUpdates,
      auditLog,
      lastUpdateTimestamp: new Date()
    };
  }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
  
  setLoginFilter: (filter) => set({ loginFilter: filter }),
  
  setBillingFilter: (filter) => set({ billingFilter: filter }),
  
  setAttendanceFilter: (filter) => set({ attendanceFilter: filter }),
  
  clearRecentUpdates: () => set({ recentUpdates: [] })
}));

export default useAnalyticsStore;