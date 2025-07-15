import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, db } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string, role: string) => boolean;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data for fallback when database is not available
const mockUsers: User[] = [];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user in Supabase
    const checkUser = async () => {
      setLoading(true);
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile from database
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          } else if (userData) {
            // Get additional data based on role
            if (userData.role === 'student') {
              const { data: studentData } = await supabase
                .from('students')
                .select('*')
                .eq('user_id', userData.id)
                .single();
                
              if (studentData) {
                setUser({
                  ...userData,
                  rollNumber: studentData.roll_number
                });
              } else {
                setUser(userData);
              }
            } else if (userData.role === 'faculty' || userData.role === 'hod' || userData.role === 'principal' || userData.role === 'director') {
              const { data: facultyData } = await supabase
                .from('faculty')
                .select('*')
                .eq('user_id', userData.id)
                .single();
                
              if (facultyData) {
                setUser({
                  ...userData,
                  jobId: facultyData.job_id
                });
              } else {
                setUser(userData);
              }
            } else {
              setUser(userData);
            }
          }
        } else {
          // No active session
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          checkUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (identifier: string, password: string, role: string): boolean => {
    try {
      // For demo purposes, we'll use mock authentication
      // Find the matching demo user
      const mockUsers: User[] = [
        { id: '1', name: 'Sridhar', email: 'sridhar@oxford.edu', role: 'student', department: 'CS with AI', avatar: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543210', address: '123 Main St, Hyderabad', joinDate: '2023-08-01', rollNumber: 'CS2023001' },
        { id: '2', name: 'Sai', email: 'sai@oxford.edu', role: 'student', department: 'AI & ML', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543211', address: '456 Oak Ave, Hyderabad', joinDate: '2023-08-01', rollNumber: 'AI2023002' },
        { id: '3', name: 'Santhosh', email: 'santhosh@oxford.edu', role: 'student', department: 'Computer Science', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543212', address: '789 Pine St, Hyderabad', joinDate: '2023-08-01', rollNumber: 'CS2023003' },
        { id: '4', name: 'Sandeep', email: 'sandeep@oxford.edu', role: 'student', department: 'ML Engineering', avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543213', address: '321 Elm St, Hyderabad', joinDate: '2023-08-01', rollNumber: 'ML2023004' },
        { id: '5', name: 'Rajkumar', email: 'rajkumar@oxford.edu', role: 'student', department: 'AI & Data Science', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543214', address: '654 Cedar Ave, Hyderabad', joinDate: '2023-08-01', rollNumber: 'DS2023005' },
        { id: '11', name: 'Ajay', email: 'ajay@oxford.edu', role: 'faculty', department: 'Computer Science', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543220', address: '123 Faculty Housing, Hyderabad', joinDate: '2020-06-01', jobId: 'FAC001' },
        { id: '12', name: 'Bhanu', email: 'bhanu@oxford.edu', role: 'faculty', department: 'Cybersecurity', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543221', address: '456 Faculty Housing, Hyderabad', joinDate: '2019-06-01', jobId: 'FAC002' },
        { id: '13', name: 'Chakresh', email: 'chakresh@oxford.edu', role: 'faculty', department: 'AIML', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543222', address: '789 Faculty Housing, Hyderabad', joinDate: '2021-06-01', jobId: 'FAC003' },
        { id: '14', name: 'Harika', email: 'harika@oxford.edu', role: 'faculty', department: 'Machine Learning', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543223', address: '101 Faculty Housing, Hyderabad', joinDate: '2022-06-01', jobId: 'FAC004' },
        { id: '17', name: 'Adbuth Singh', email: 'adbuth.singh@oxford.edu', role: 'hod', department: 'Computer Science', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543226', address: '789 Faculty Housing, Hyderabad', joinDate: '2015-06-01', jobId: 'HOD001' },
        { id: '18', name: 'Indhu', email: 'indhu@oxford.edu', role: 'principal', department: 'Administration', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', phone: '+91 9876543227', address: '101 Admin Block, Hyderabad', joinDate: '2010-06-01', jobId: 'PRI001' },
      ];
      
      // Check if password is correct (for demo, we accept "password123" for all users)
      if (password !== 'password123') {
        console.error('Invalid password');
        return false;
      }
      
      // Find user by identifier (roll number, job ID, or email)
      const user = mockUsers.find(u => 
        (role === 'student' && u.rollNumber === identifier && u.role === 'student') ||
        (role !== 'student' && u.jobId === identifier && u.role === role) ||
        (identifier.includes('@') && u.email === identifier && u.role === role)
      );
      
      if (!user) {
        console.error('User not found with identifier:', identifier);
        return false;
      }
      
      // Set the user in state
      setUser(user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // For demo purposes, just clear the user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    // For demo purposes, just update the local state
    setUser({ ...user, ...userData });
    console.log('Profile updated:', { ...user, ...userData });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};