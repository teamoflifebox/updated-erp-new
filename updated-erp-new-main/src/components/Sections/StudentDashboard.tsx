import React, { useState, useEffect } from 'react';
import { 
  Calendar, BookOpen, Bell, Award, TrendingUp, 
  ChevronRight, Clock, Users, FileText, 
  GraduationCap, MapPin, User, CheckCircle, 
  AlertCircle, Book, CreditCard, Sun, Moon
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const LiveBackground = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 -z-10">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      >
        <source src="https://cdn.pixabay.com/video/2024/03/15/204243-923909579_large.mp4" type="video/mp4" />
      </video>
      
      {/* Dynamic overlay based on mode */}
      <div className={`absolute inset-0 ${darkMode ? 'bg-slate-900/30' : 'bg-slate-100/30'}`} />
    </div>
  );
};

const GlassCard = ({ children, className = "", hover = true, darkMode }) => (
  <div className={`
    ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-50/95 border-slate-200'}
    backdrop-blur-sm rounded-xl border shadow-sm
    ${hover ? darkMode ? 'hover:bg-slate-800 hover:shadow-md' : 'hover:bg-slate-50 hover:shadow-md' : ''}
    transition-all duration-300 ease-out
    ${className}
  `}>
    {children}
  </div>
);

const ProfileHeader = ({ darkMode, toggleDarkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`mb-6 p-6 rounded-xl shadow-md ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-700 text-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-1">EduManage Pro</h1>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-200'}`}>Student Management System</p>
        </div>
        <button 
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-slate-700 text-amber-300' : 'bg-slate-600 text-white'}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">John Smith</h2>
            <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-200'}`}>
              <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-600'}`}>ID: CS21001</span>
              <span>•</span>
              <span>Computer Science Engineering</span>
              <span>•</span>
              <span>Semester 6</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-200'} mb-1`}>Current Time</div>
          <div className="text-xl font-medium">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStats = ({ darkMode }) => {
  return (
    <GlassCard className="p-6 mb-6" darkMode={darkMode}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { value: '92%', label: 'Attendance', icon: CheckCircle },
          { value: '3.85', label: 'Current GPA', icon: Award },
          { value: '12', label: 'Courses', icon: BookOpen },
          { value: '4', label: 'Pending Tasks', icon: AlertCircle }
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} mb-1`}>
              {stat.value}
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'} mb-2`}>
              {stat.label}
            </div>
            {index < 2 ? (
              <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div 
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: index === 0 ? '92%' : '96%' }}
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <stat.icon className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

const AttendanceChart = ({ darkMode }) => {
  const attendanceData = [
    { month: 'Aug', percentage: 92 },
    { month: 'Sep', percentage: 83 },
    { month: 'Oct', percentage: 88 },
    { month: 'Nov', percentage: 79 },
    { month: 'Dec', percentage: 96 },
    { month: 'Jan', percentage: 91 },
  ];

  return (
    <GlassCard className="p-6" darkMode={darkMode}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Attendance Overview
        </h3>
        <button className={`flex items-center text-sm transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
          View Details <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceData}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                borderRadius: '8px',
                color: darkMode ? '#f8fafc' : '#1e293b',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#attendanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

const AcademicProgress = ({ darkMode }) => {
  const subjects = [
    { name: 'Computer Science', grade: 'A+', percentage: 95, credits: 4 },
    { name: 'Mathematics', grade: 'A', percentage: 88, credits: 3 },
    { name: 'Physics', grade: 'A-', percentage: 85, credits: 3 },
    { name: 'English', grade: 'B+', percentage: 82, credits: 2 },
    { name: 'Data Structures', grade: 'A', percentage: 89, credits: 4 },
  ];

  return (
    <GlassCard className="p-6" darkMode={darkMode}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Academic Performance
        </h3>
        <div className="text-right">
          <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
            Current GPA
          </div>
          <div className={`text-xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            3.85
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-4 border ${darkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} transition-colors`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {subject.name}
              </h4>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                  {subject.credits} Credits
                </span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                  {subject.grade}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex-1 rounded-full h-2 ${darkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                <div 
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
              <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'} w-12`}>
                {subject.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

const RecentActivities = ({ darkMode }) => {
  const activities = [
    {
      title: 'Data Structures Assignment',
      course: 'CS-301',
      time: '2 hours ago',
      icon: FileText
    },
    {
      title: 'Mid-term Examination',
      course: 'MATH-201',
      time: '1 day ago',
      icon: Award
    },
    {
      title: 'Class Schedule Update',
      course: 'Department',
      time: '3 days ago',
      icon: Bell
    },
    {
      title: 'Semester Fee Payment',
      course: 'Finance',
      time: '1 week ago',
      icon: CreditCard
    },
    {
      title: 'Physics Lab Result',
      course: 'PHY-201',
      time: '2 days ago',
      icon: Book
    }
  ];

  return (
    <GlassCard className="p-6" darkMode={darkMode}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Recent Activities
        </h3>
        <button className={`flex items-center text-sm transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-3 p-3 rounded-lg border ${darkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} transition-colors`}
          >
            <div className={`flex-shrink-0 p-2 rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-indigo-50'}`}>
              <activity.icon className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {activity.title}
              </p>
              <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                {activity.course}
              </p>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-400'} mt-1`}>
                {activity.time}
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

const UpcomingSchedule = ({ darkMode }) => {
  const schedule = [
    { time: '09:00 AM', subject: 'Computer Science', room: 'Lab-A', type: 'lecture' },
    { time: '11:00 AM', subject: 'Mathematics', room: 'Room-203', type: 'tutorial' },
    { time: '02:00 PM', subject: 'Physics', room: 'Lab-B', type: 'practical' },
    { time: '04:00 PM', subject: 'English', room: 'Room-105', type: 'lecture' },
  ];

  return (
    <GlassCard className="p-6" darkMode={darkMode}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Today's Schedule
        </h3>
        <div className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-4 p-4 rounded-lg border ${darkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} transition-colors`}
          >
            <div className="flex-shrink-0 text-center">
              <div className={`text-sm font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {item.time}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {item.subject}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-slate-600 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                  {item.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                <span className={darkMode ? 'text-slate-300' : 'text-slate-500'}>{item.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

const StudentDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen relative ${darkMode ? 'dark' : ''}`}>
      <LiveBackground darkMode={darkMode} />
      
      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        <ProfileHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <QuickStats darkMode={darkMode} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2">
            <AttendanceChart darkMode={darkMode} />
          </div>
          <RecentActivities darkMode={darkMode} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AcademicProgress darkMode={darkMode} />
          <UpcomingSchedule darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;