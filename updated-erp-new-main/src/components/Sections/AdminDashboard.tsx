import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Users, GraduationCap, Building2, CreditCard,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import DashboardCard from '../Dashboard/DashboardCard';
import useAnalyticsStore from '../../store/analyticsStore';
import { useRealTimeAnalytics } from '../../hooks/useRealTimeAnalytics';

const AdminDashboard = () => {
  const { isConnected, lastUpdate } = useRealTimeAnalytics();
  const {
    totalStudents,
    totalFaculty,
    techDepartments,
    monthlyBilling,
    innovationRate,
    departmentData,
    attendanceData,
    loginTrendsData,
    loginFilter,
    attendanceFilter,
    setLoginFilter,
    setAttendanceFilter,
  } = useAnalyticsStore();

  const getFilteredLoginData = () => {
    return loginTrendsData.map(item => ({
      period: item.period,
      value: item[loginFilter] || item.overall,
    }));
  };

  return (
    <div className="relative min-h-screen">
      {/* ✅ Video Background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        >
          <source src="https://cdn.pixabay.com/video/2024/03/15/204243-923909579_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      </div>

      {/* ✅ Dashboard Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/95 backdrop-blur-sm shadow-md text-white">
          <h2 className="text-2xl font-bold mb-2">Administrative Dashboard</h2>
          <p className="text-slate-300 mb-2">Comprehensive overview of institutional excellence and technology innovation.</p>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>{isConnected ? 'Real-time updates active' : 'Real-time updates inactive'}</span>
            {lastUpdate && (
              <span className="ml-2 text-xs text-slate-400">
                • Last update: {new Date(lastUpdate.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          <Link to="/real-time-analytics" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm">
            <TrendingUp size={16} className="mr-1" /> View full real-time analytics
          </Link>
        </div>

        {/* ✅ Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <GlassCard>
            <DashboardCard title="Total Students" value={totalStudents.toLocaleString()} icon={GraduationCap} />
          </GlassCard>
          <GlassCard>
            <DashboardCard title="Faculty Members" value={totalFaculty.toLocaleString()} icon={Users} />
          </GlassCard>
          <GlassCard>
            <DashboardCard title="Tech Departments" value={techDepartments} icon={Building2} />
          </GlassCard>
          <GlassCard>
            <DashboardCard title="Monthly Billing" value={`$${(monthlyBilling / 1000).toFixed(0)}K`} icon={CreditCard} />
          </GlassCard>
          <GlassCard>
            <DashboardCard title="Innovation Rate" value={`${innovationRate}%`} icon={TrendingUp} />
          </GlassCard>
        </div>

        {/* ✅ Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">Login Trends</h3>
              <select
                value={loginFilter}
                onChange={(e) => setLoginFilter(e.target.value)}
                className="bg-slate-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value="overall">Overall</option>
                <option value="students">Students</option>
                <option value="faculty">Faculty</option>
                <option value="hod">HOD</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getFilteredLoginData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <div className="mb-4">
              <h3 className="font-semibold text-white mb-2">Average Attendance</h3>
              <div className="flex gap-4">
                <select
                  value={attendanceFilter.year}
                  onChange={(e) => setAttendanceFilter({ ...attendanceFilter, year: e.target.value })}
                  className="bg-slate-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="all">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                <select
                  value={attendanceFilter.semester}
                  onChange={(e) => setAttendanceFilter({ ...attendanceFilter, semester: e.target.value })}
                  className="bg-slate-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="all">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="department" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }} />
                <Bar dataKey="year1" fill="#4f46e5" />
                <Bar dataKey="year2" fill="#22c55e" />
                <Bar dataKey="year3" fill="#f59e0b" />
                <Bar dataKey="year4" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        <GlassCard>
          <h3 className="font-semibold text-white mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};

const GlassCard = ({ children }) => (
  <div className="rounded-xl border border-slate-700 bg-slate-800/95 backdrop-blur-sm shadow-sm p-4 transition-all duration-300">
    {children}
  </div>
);

export default AdminDashboard;
