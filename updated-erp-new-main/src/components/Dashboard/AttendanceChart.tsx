import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const defaultAttendanceData = [
  { month: 'Jan', attendance: 0 },
  { month: 'Feb', attendance: 0 },
  { month: 'Mar', attendance: 0 },
  { month: 'Apr', attendance: 0 },
  { month: 'May', attendance: 0 },
  { month: 'Jun', attendance: 0 },
]; 

const AttendanceChart: React.FC = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState(defaultAttendanceData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        if (user.role === 'student') {
          // Get student ID
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (studentError || !studentData) {
            console.error('Error fetching student data:', studentError);
            return;
          }
          
          // Get attendance data for the last 6 months
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          const { data: attendanceRecords, error: attendanceError } = await supabase
            .from('attendance')
            .select('date, status')
            .eq('student_id', studentData.id)
            .gte('date', sixMonthsAgo.toISOString().split('T')[0]);
            
          if (attendanceError) {
            console.error('Error fetching attendance data:', attendanceError);
            return;
          }
          
          // Process attendance data by month
          const monthlyData = new Map();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          // Initialize with last 6 months
          const today = new Date();
          for (let i = 5; i >= 0; i--) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
            monthlyData.set(monthKey, {
              month: monthNames[month.getMonth()],
              total: 0,
              present: 0
            });
          }
          
          // Count attendance by month
          attendanceRecords.forEach(record => {
            const date = new Date(record.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (monthlyData.has(monthKey)) {
              const data = monthlyData.get(monthKey);
              data.total++;
              if (record.status === 'present') {
                data.present++;
              }
            }
          });
          
          // Calculate attendance percentage
          const formattedData = Array.from(monthlyData.values()).map(data => ({
            month: data.month,
            attendance: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
          }));
          
          setAttendanceData(formattedData);
        } else {
          // For faculty and admin, show average attendance
          // This would typically come from analytics data
          setAttendanceData(defaultAttendanceData);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [user]);

  return (
    <div className="card-nature p-6 animate-slide-up animate-delay-100 relative">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <div className="w-3 h-3 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] rounded-full"></div>
        <span>Attendance Overview</span>
      </h3>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #1E3A8A',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(30, 58, 138, 0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Attendance']}
              />
              <Bar 
                dataKey="attendance" 
                fill="url(#attendanceGradient)" 
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
              </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
};

export default AttendanceChart;