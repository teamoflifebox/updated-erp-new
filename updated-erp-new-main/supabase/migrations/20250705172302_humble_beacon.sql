/*
  # Initial Database Schema for Oxford ERP

  1. New Tables
    - `users` - User accounts with authentication
    - `students` - Student information
    - `faculty` - Faculty information
    - `attendance` - Student attendance records
    - `marks` - Student marks/grades
    - `fees` - Fee payment records
    - `notifications` - System notifications
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'hod', 'principal', 'director')),
  department TEXT,
  avatar TEXT,
  phone TEXT,
  address TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  roll_number TEXT UNIQUE NOT NULL,
  year TEXT NOT NULL,
  semester TEXT NOT NULL,
  section TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  emergency_contact TEXT,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  nationality TEXT,
  religion TEXT,
  category TEXT,
  previous_school TEXT,
  previous_percentage NUMERIC(5,2),
  entrance_exam TEXT,
  entrance_rank INTEGER,
  hostel_resident BOOLEAN DEFAULT false,
  hostel_block TEXT,
  room_number TEXT,
  transport_mode TEXT,
  bus_route TEXT,
  medical_conditions TEXT,
  allergies TEXT,
  cgpa NUMERIC(3,2) DEFAULT 0,
  attendance_percentage NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id TEXT UNIQUE NOT NULL,
  designation TEXT NOT NULL,
  qualification TEXT,
  experience TEXT,
  subjects JSONB,
  rating NUMERIC(3,1),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_at TIMESTAMPTZ DEFAULT now(),
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject, date)
);

-- Create marks table
CREATE TABLE IF NOT EXISTS marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  marks NUMERIC(5,2) NOT NULL,
  max_marks NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) GENERATED ALWAYS AS (marks * 100 / NULLIF(max_marks, 0)) STORED,
  grade TEXT,
  date DATE DEFAULT CURRENT_DATE,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject, exam_type)
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT,
  receipt_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue')),
  due_date DATE NOT NULL,
  paid_date DATE,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'announcement')),
  sender TEXT,
  audience TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_notifications junction table
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

-- Create whatsapp_notifications table
CREATE TABLE IF NOT EXISTS whatsapp_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('attendance', 'fee_payment', 'marks', 'general', 'emergency')),
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users table policies
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Admin users can view all user data" 
  ON users FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hod', 'principal', 'director')
    )
  );

-- Students table policies
CREATE POLICY "Students can view their own data" 
  ON students FOR SELECT 
  TO authenticated 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('faculty', 'hod', 'principal', 'director')
    )
  );

-- Faculty table policies
CREATE POLICY "Faculty can view their own data" 
  ON faculty FOR SELECT 
  TO authenticated 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('hod', 'principal', 'director')
    )
  );

-- Attendance table policies
CREATE POLICY "Students can view their own attendance" 
  ON attendance FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = attendance.student_id 
      AND students.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('faculty', 'hod', 'principal', 'director')
    )
  );

-- Marks table policies
CREATE POLICY "Students can view their own marks" 
  ON marks FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = marks.student_id 
      AND students.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('faculty', 'hod', 'principal', 'director')
    )
  );

-- Fees table policies
CREATE POLICY "Students can view their own fees" 
  ON fees FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = fees.student_id 
      AND students.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('faculty', 'hod', 'principal', 'director')
    )
  );

-- Notifications table policies
CREATE POLICY "All users can view notifications" 
  ON notifications FOR SELECT 
  TO authenticated 
  USING (true);

-- User notifications table policies
CREATE POLICY "Users can view their own notifications" 
  ON user_notifications FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

-- WhatsApp notifications table policies
CREATE POLICY "Faculty and admins can view WhatsApp notifications" 
  ON whatsapp_notifications FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('faculty', 'hod', 'principal', 'director')
    )
  );

-- Create functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_modtime
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_students_modtime
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_faculty_modtime
  BEFORE UPDATE ON faculty
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_attendance_modtime
  BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_marks_modtime
  BEFORE UPDATE ON marks
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_fees_modtime
  BEFORE UPDATE ON fees
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_notifications_modtime
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_notifications_modtime
  BEFORE UPDATE ON user_notifications
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_whatsapp_notifications_modtime
  BEFORE UPDATE ON whatsapp_notifications
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();