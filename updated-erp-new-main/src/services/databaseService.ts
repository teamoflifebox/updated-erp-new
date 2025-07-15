import { supabase } from '../lib/supabase';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  parentName: string;
  parentPhone: string;
  emergencyContact?: string;
  address: string;
  avatar?: string;
  cgpa?: number;
  attendance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faculty {
  id: string;
  name: string;
  jobId: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  experience: string;
  subjects: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  facultyId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedAt: Date;
  notificationSent: boolean;
}

export interface MarksRecord {
  id: string;
  studentId: string;
  facultyId: string;
  subject: string;
  examType: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  date: string;
  notificationSent: boolean;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  notificationSent: boolean;
}

export interface AnalyticsData {
  attendance: {
    overall: number;
    byDepartment: { [key: string]: number };
    byMonth: { month: string; percentage: number }[];
  };
  marks: {
    averageGPA: number;
    bySubject: { subject: string; average: number }[];
    distribution: { grade: string; count: number }[];
  };
  fees: {
    collectionRate: number;
    totalCollected: number;
    pending: number;
    byMonth: { month: string; collected: number; target: number }[];
  };
}

class DatabaseService {
  // Student Management
  async getStudents(filters?: { department?: string; year?: string; search?: string }) {
    try {
      let query = supabase
        .from('students')
        .select(`
          *,
          users:user_id (
            name,
            email,
            department,
            avatar,
            phone
          )
        `);
      
      if (filters?.department) {
        query = query.eq('users.department', filters.department);
      }
      
      if (filters?.year) {
        query = query.eq('year', filters.year);
      }
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        query = query.or(`
          users.name.ilike.%${search}%,
          roll_number.ilike.%${search}%,
          users.email.ilike.%${search}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching students:', error);
        return [];
      }
      
      // Transform data to match the expected format
      return data.map(student => ({
        id: student.id,
        name: student.users.name,
        rollNumber: student.roll_number,
        email: student.users.email,
        phone: student.users.phone,
        department: student.users.department,
        year: student.year,
        parentName: student.parent_name,
        parentPhone: student.parent_phone,
        address: student.address || '',
        cgpa: student.cgpa,
        attendance: student.attendance_percentage,
        createdAt: new Date(student.created_at),
        updatedAt: new Date(student.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  async getStudent(id: string): Promise<Student> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          users:user_id (
            name,
            email,
            department,
            avatar,
            phone,
            address
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching student:', error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.users.name,
        rollNumber: data.roll_number,
        email: data.users.email,
        phone: data.users.phone,
        department: data.users.department,
        year: data.year,
        parentName: data.parent_name,
        parentPhone: data.parent_phone,
        address: data.users.address || '',
        cgpa: data.cgpa,
        attendance: data.attendance_percentage,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  async createStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    try {
      // First create user
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: student.email,
        password: 'password123', // Default password, should be changed
      });
      
      if (userError || !userData.user) {
        console.error('Error creating user:', userError);
        throw userError;
      }
      
      // Create user profile
      const { data: userProfileData, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: userData.user.id,
          name: student.name,
          email: student.email,
          role: 'student',
          department: student.department,
          avatar: student.avatar,
          phone: student.phone,
          address: student.address,
          join_date: new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        throw profileError;
      }
      
      // Create student record
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{
          user_id: userData.user.id,
          roll_number: student.rollNumber,
          year: student.year,
          semester: '1st Semester', // Default value
          section: 'A', // Default value
          parent_name: student.parentName,
          parent_phone: student.parentPhone,
          cgpa: 0,
          attendance_percentage: 0
        }])
        .select()
        .single();
      
      if (studentError) {
        console.error('Error creating student record:', studentError);
        throw studentError;
      }
      
      return {
        id: studentData.id,
        ...student,
        createdAt: new Date(studentData.created_at),
        updatedAt: new Date(studentData.updated_at)
      };
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    try {
      // Get student record to find user_id
      const { data: studentData, error: studentFetchError } = await supabase
        .from('students')
        .select('user_id')
        .eq('id', id)
        .single();
      
      if (studentFetchError) {
        console.error('Error fetching student:', studentFetchError);
        throw studentFetchError;
      }
      
      // Update user profile if needed
      if (updates.name || updates.email || updates.phone || updates.department || updates.address) {
        const userUpdates: any = {};
        if (updates.name) userUpdates.name = updates.name;
        if (updates.email) userUpdates.email = updates.email;
        if (updates.phone) userUpdates.phone = updates.phone;
        if (updates.department) userUpdates.department = updates.department;
        if (updates.address) userUpdates.address = updates.address;
        
        const { error: userUpdateError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', studentData.user_id);
        
        if (userUpdateError) {
          console.error('Error updating user profile:', userUpdateError);
          throw userUpdateError;
        }
      }
      
      // Update student record
      const studentUpdates: any = {};
      if (updates.rollNumber) studentUpdates.roll_number = updates.rollNumber;
      if (updates.year) studentUpdates.year = updates.year;
      if (updates.parentName) studentUpdates.parent_name = updates.parentName;
      if (updates.parentPhone) studentUpdates.parent_phone = updates.parentPhone;
      
      const { data: updatedStudentData, error: studentUpdateError } = await supabase
        .from('students')
        .update(studentUpdates)
        .eq('id', id)
        .select(`
          *,
          users:user_id (
            name,
            email,
            department,
            avatar,
            phone,
            address
          )
        `)
        .single();
      
      if (studentUpdateError) {
        console.error('Error updating student record:', studentUpdateError);
        throw studentUpdateError;
      }
      
      return {
        id: updatedStudentData.id,
        name: updatedStudentData.users.name,
        rollNumber: updatedStudentData.roll_number,
        email: updatedStudentData.users.email,
        phone: updatedStudentData.users.phone,
        department: updatedStudentData.users.department,
        year: updatedStudentData.year,
        parentName: updatedStudentData.parent_name,
        parentPhone: updatedStudentData.parent_phone,
        address: updatedStudentData.users.address || '',
        cgpa: updatedStudentData.cgpa,
        attendance: updatedStudentData.attendance_percentage,
        createdAt: new Date(updatedStudentData.created_at),
        updatedAt: new Date(updatedStudentData.updated_at)
      };
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      // Get student record to find user_id
      const { data: studentData, error: studentFetchError } = await supabase
        .from('students')
        .select('user_id')
        .eq('id', id)
        .single();
      
      if (studentFetchError) {
        console.error('Error fetching student:', studentFetchError);
        throw studentFetchError;
      }
      
      // Delete student record
      const { error: studentDeleteError } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (studentDeleteError) {
        console.error('Error deleting student:', studentDeleteError);
        throw studentDeleteError;
      }
      
      // Delete user account
      if (studentData.user_id) {
        const { error: userDeleteError } = await supabase.auth.admin.deleteUser(
          studentData.user_id
        );
        
        if (userDeleteError) {
          console.error('Error deleting user account:', userDeleteError);
          throw userDeleteError;
        }
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  // Attendance Management
  async getAttendance(filters?: { 
    studentId?: string; 
    facultyId?: string; 
    subject?: string; 
    date?: string; 
    dateRange?: { start: string; end: string } 
  }) {
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          students (
            id,
            roll_number,
            users (
              name
            )
          )
        `);
      
      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId);
      }
      
      if (filters?.subject) {
        query = query.eq('subject', filters.subject);
      }
      
      if (filters?.date) {
        query = query.eq('date', filters.date);
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('date', filters.dateRange.start)
          .lte('date', filters.dateRange.end);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching attendance:', error);
        return [];
      }
      
      // Transform data to match the expected format
      return data.map(record => ({
        id: record.id,
        studentId: record.student_id,
        studentName: record.students.users.name,
        rollNumber: record.students.roll_number,
        facultyId: record.faculty_id,
        subject: record.subject,
        date: record.date,
        status: record.status,
        markedAt: new Date(record.marked_at),
        notificationSent: record.notification_sent
      }));
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }

  async markAttendance(records: Omit<AttendanceRecord, 'id' | 'markedAt' | 'notificationSent'>[]): Promise<AttendanceRecord[]> {
    try {
      // Format records for database
      const formattedRecords = records.map(record => ({
        student_id: record.studentId,
        faculty_id: record.facultyId,
        subject: record.subject,
        date: record.date,
        status: record.status,
        marked_at: new Date().toISOString(),
        notification_sent: false
      }));
      
      // Insert records
      const { data, error } = await supabase
        .from('attendance')
        .insert(formattedRecords)
        .select();
      
      if (error) {
        console.error('Error marking attendance:', error);
        throw error;
      }
      
      // Transform data to match the expected format
      return data.map(record => ({
        id: record.id,
        studentId: record.student_id,
        facultyId: record.faculty_id,
        subject: record.subject,
        date: record.date,
        status: record.status,
        markedAt: new Date(record.marked_at),
        notificationSent: record.notification_sent
      }));
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  // Marks Management
  async getMarks(filters?: { 
    studentId?: string; 
    facultyId?: string; 
    subject?: string; 
    examType?: string 
  }) {
    try {
      let query = supabase
        .from('marks')
        .select(`
          *,
          students (
            id,
            roll_number,
            users (
              name
            )
          )
        `);
      
      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId);
      }
      
      if (filters?.subject) {
        query = query.eq('subject', filters.subject);
      }
      
      if (filters?.examType) {
        query = query.eq('exam_type', filters.examType);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching marks:', error);
        return [];
      }
      
      // Transform data to match the expected format
      return data.map(record => ({
        id: record.id,
        studentId: record.student_id,
        studentName: record.students.users.name,
        rollNumber: record.students.roll_number,
        facultyId: record.faculty_id,
        subject: record.subject,
        examType: record.exam_type,
        marks: record.marks,
        maxMarks: record.max_marks,
        percentage: record.percentage,
        grade: record.grade,
        date: record.date,
        notificationSent: record.notification_sent
      }));
    } catch (error) {
      console.error('Error fetching marks:', error);
      return [];
    }
  }

  async saveMarks(records: Omit<MarksRecord, 'id' | 'notificationSent'>[]): Promise<MarksRecord[]> {
    try {
      // Format records for database
      const formattedRecords = records.map(record => {
        // Calculate grade based on percentage
        const percentage = (record.marks / record.maxMarks) * 100;
        let grade = '';
        
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else grade = 'F';
        
        return {
          student_id: record.studentId,
          faculty_id: record.facultyId,
          subject: record.subject,
          exam_type: record.examType,
          marks: record.marks,
          max_marks: record.maxMarks,
          grade,
          date: record.date,
          notification_sent: false
        };
      });
      
      // Insert records
      const { data, error } = await supabase
        .from('marks')
        .insert(formattedRecords)
        .select();
      
      if (error) {
        console.error('Error saving marks:', error);
        throw error;
      }
      
      // Transform data to match the expected format
      return data.map(record => ({
        id: record.id,
        studentId: record.student_id,
        facultyId: record.faculty_id,
        subject: record.subject,
        examType: record.exam_type,
        marks: record.marks,
        maxMarks: record.max_marks,
        percentage: record.percentage,
        grade: record.grade,
        date: record.date,
        notificationSent: record.notification_sent
      }));
    } catch (error) {
      console.error('Error saving marks:', error);
      throw error;
    }
  }

  // Fee Management
  async getFees(filters?: { studentId?: string; status?: string }) {
    try {
      let query = supabase
        .from('fees')
        .select(`
          *,
          students (
            id,
            roll_number,
            users (
              name,
              department
            )
          )
        `);
      
      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query.order('due_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching fees:', error);
        return [];
      }
      
      // Transform data to match the expected format
      return data.map(record => ({
        id: record.id,
        studentId: record.student_id,
        studentName: record.students.users.name,
        rollNumber: record.students.roll_number,
        department: record.students.users.department,
        amount: record.amount,
        paymentMethod: record.payment_method,
        receiptNumber: record.receipt_number,
        status: record.status,
        dueDate: record.due_date,
        paidDate: record.paid_date,
        notificationSent: record.notification_sent
      }));
    } catch (error) {
      console.error('Error fetching fees:', error);
      return [];
    }
  }

  async recordPayment(payment: Omit<FeeRecord, 'id' | 'notificationSent'>): Promise<FeeRecord> {
    try {
      // Format payment for database
      const formattedPayment = {
        student_id: payment.studentId,
        amount: payment.amount,
        payment_method: payment.paymentMethod,
        receipt_number: payment.receiptNumber,
        status: payment.status,
        due_date: payment.dueDate,
        paid_date: payment.paidDate,
        notification_sent: false
      };
      
      // Insert payment record
      const { data, error } = await supabase
        .from('fees')
        .insert([formattedPayment])
        .select()
        .single();
      
      if (error) {
        console.error('Error recording payment:', error);
        throw error;
      }
      
      // Transform data to match the expected format
      return {
        id: data.id,
        studentId: data.student_id,
        amount: data.amount,
        paymentMethod: data.payment_method,
        receiptNumber: data.receipt_number,
        status: data.status,
        dueDate: data.due_date,
        paidDate: data.paid_date,
        notificationSent: data.notification_sent
      };
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalytics(type: 'attendance' | 'marks' | 'fees' | 'overview', filters?: any): Promise<AnalyticsData> {
    try {
      // const response = await apiClient.get(`/analytics/${type}`, { params: filters });
      // return response.data;
      
      // Mock analytics data
      return {
        attendance: {
          overall: 87.5,
          byDepartment: {
            'Computer Science': 89,
            'AI & ML': 92,
            'Data Science': 85
          },
          byMonth: [
            { month: 'Jan', percentage: 85 },
            { month: 'Feb', percentage: 87 },
            { month: 'Mar', percentage: 89 },
            { month: 'Apr', percentage: 88 },
            { month: 'May', percentage: 90 }
          ]
        },
        marks: {
          averageGPA: 8.2,
          bySubject: [
            { subject: 'Data Structures', average: 8.5 },
            { subject: 'Algorithms', average: 8.0 },
            { subject: 'Database Systems', average: 8.3 }
          ],
          distribution: [
            { grade: 'A+', count: 45 },
            { grade: 'A', count: 78 },
            { grade: 'B+', count: 56 },
            { grade: 'B', count: 34 }
          ]
        },
        fees: {
          collectionRate: 94.5,
          totalCollected: 2850000,
          pending: 150000,
          byMonth: [
            { month: 'Jan', collected: 485000, target: 500000 },
            { month: 'Feb', collected: 520000, target: 500000 },
            { month: 'Mar', collected: 495000, target: 500000 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Notifications
  async getNotificationHistory(filters?: { type?: string; status?: string; studentId?: string }) {
    try {
      let query = supabase
        .from('whatsapp_notifications')
        .select(`
          *,
          students (
            id,
            roll_number,
            users (
              name
            )
          )
        `);
      
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notification history:', error);
        return [];
      }
      
      // Transform data to match the expected format
      return data.map(notification => ({
        id: notification.id,
        type: notification.type,
        studentId: notification.student_id,
        studentName: notification.students.users.name,
        rollNumber: notification.students.roll_number,
        parentPhone: notification.parent_phone,
        message: notification.message,
        timestamp: new Date(notification.created_at),
        status: notification.status,
        metadata: notification.metadata
      }));
    } catch (error) {
      console.error('Error fetching notification history:', error);
      return [];
    }
  }

  async markNotificationSent(recordType: 'attendance' | 'marks' | 'fees', recordId: string) {
    try {
      // Update the notification_sent field in the appropriate table
      let table = '';
      
      switch (recordType) {
        case 'attendance':
          table = 'attendance';
          break;
        case 'marks':
          table = 'marks';
          break;
        case 'fees':
          table = 'fees';
          break;
      }
      
      const { error } = await supabase
        .from(table)
        .update({ notification_sent: true })
        .eq('id', recordId);
      
      if (error) {
        console.error(`Error marking ${recordType} notification as sent:`, error);
        throw error;
      }
    } catch (error) {
      console.error('Error marking notification as sent:', error);
      throw error;
    }
  }

  // Create a notification
  async createNotification(notification: any) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          title: notification.title,
          message: notification.message,
          type: notification.type,
          sender: notification.sender,
          audience: notification.audience
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
      
      // If audience is specific, create user_notifications entries
      if (notification.userIds && notification.userIds.length > 0) {
        const userNotifications = notification.userIds.map((userId: string) => ({
          user_id: userId,
          notification_id: data.id
        }));
        
        const { error: userNotifError } = await supabase
          .from('user_notifications')
          .insert(userNotifications);
        
        if (userNotifError) {
          console.error('Error creating user notifications:', userNotifError);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();