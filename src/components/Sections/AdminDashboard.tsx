import React, { useState } from 'react';
import DashboardCard from '../Dashboard/DashboardCard';
import { Users, GraduationCap, Building2, CreditCard, TrendingUp, Activity, Award, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import useAnalyticsStore from '../../store/analyticsStore';
import { useRealTimeAnalytics } from '../../hooks/useRealTimeAnalytics';

const AdminDashboard: React.FC = () => {
  const { isConnected, lastUpdate } = useRealTimeAnalytics();
  
  const {
    totalStudents,
    totalFaculty,
    techDepartments,
    monthlyBilling,
    innovationRate,
    departmentData,
    attendanceData,
    monthlyGrowth,
    loginTrendsData,
    monthlyBillingData,
    loginFilter,
    billingFilter,
    attendanceFilter,
    setLoginFilter,
    setBillingFilter,
    setAttendanceFilter
  } = useAnalyticsStore();

  const getFilteredLoginData = () => {
    return loginTrendsData.map(item => ({
      period: item.period,
      value: item[loginFilter] || item.overall
    }));
  };

  const getFilteredBillingData = () => {
    if (billingFilter === 'all') return monthlyBillingData;
    
    // Filter by department (mock implementation)
    return monthlyBillingData.map(item => ({
      ...item,
      total: item.total * (billingFilter === 'cs' ? 0.4 : billingFilter === 'ai' ? 0.3 : 0.3)
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] bg-clip-text text-transparent mb-2">Administrative Dashboard</h2>
        <p className="text-sage-600">Comprehensive overview of institutional excellence and technology innovation.</p>
        
        {/* Real-time indicator */}
        <div className="mt-2 flex items-center">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="ml-2 text-sm text-gray-600">
            {isConnected ? 'Real-time updates active' : 'Real-time updates inactive'}
          </span>
          {lastUpdate && (
            <span className="ml-2 text-xs text-gray-500">
              Last update: {new Date(lastUpdate.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
        
        {/* Link to full real-time analytics */}
        <div className="mt-2">
          <Link 
            to="/real-time-analytics" 
            className="text-[#1E3A8A] hover:text-[#1E3A8A]/80 text-sm font-medium flex items-center"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            View full real-time analytics dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <DashboardCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={GraduationCap}
          color="primary"
          trend={{ value: 8, isPositive: true }}
          subtitle="Growing community"
        />
        <DashboardCard
          title="Faculty Members"
          value={totalFaculty.toLocaleString()}
          icon={Users}
          color="secondary"
          trend={{ value: 3, isPositive: true }}
          subtitle="Expert educators"
        />
        <DashboardCard
          title="Tech Departments"
          value={techDepartments.toString()}
          icon={Building2}
          color="forest"
          subtitle="AI-focused programs"
        />
        <DashboardCard
          title="Monthly Billing"
          value={`$${(monthlyBilling/1000).toFixed(0)}K`}
          icon={CreditCard}
          color="accent"
          trend={{ value: 12, isPositive: true }}
          subtitle="Technology growth"
        />
        <DashboardCard
          title="Innovation Rate"
          value={`${innovationRate}%`}
          icon={TrendingUp}
          color="sage"
          trend={{ value: 2.3, isPositive: true }}
          subtitle="Tech advancement"
        />
      </div>

      {/* Login Trends with Filters */}
      <div className="card-nature p-6 animate-slide-up animate-delay-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <span>Trends in {loginFilter === 'overall' ? 'Overall' : loginFilter.charAt(0).toUpperCase() + loginFilter.slice(1)} Logins</span>
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={loginFilter}
              onChange={(e) => setLoginFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="overall">Overall</option>
              <option value="students">Students Only</option>
              <option value="faculty">Faculty Only</option>
              <option value="hod">HOD Only</option>
              <option value="admin">Admin Only</option>
            </select>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getFilteredLoginData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Attendance with Filters */}
      <div className="card-nature p-6 animate-slide-up animate-delay-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <span>Average Attendance</span>
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={attendanceFilter.year}
              onChange={(e) => setAttendanceFilter({...attendanceFilter, year: e.target.value})}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <select
              value={attendanceFilter.semester}
              onChange={(e) => setAttendanceFilter({...attendanceFilter, semester: e.target.value})}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
            </select>
            <select
              value={attendanceFilter.section}
              onChange={(e) => setAttendanceFilter({...attendanceFilter, section: e.target.value})}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="department" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="year1" fill="#3b82f6" name="1st Year" />
              <Bar dataKey="year2" fill="#10b981" name="2nd Year" />
              <Bar dataKey="year3" fill="#f59e0b" name="3rd Year" />
              <Bar dataKey="year4" fill="#ef4444" name="4th Year" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-nature p-6 animate-slide-up animate-delay-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
            <span>Department Distribution</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #22c55e',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-nature p-6 animate-slide-up animate-delay-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <span>Recent Activities</span>
          </h3>
          <div className="space-y-4">
            {[
              { 
                title: 'New AI research lab inaugurated', 
                time: '1 hour ago', 
                type: 'success',
                user: 'Computer Science Dept',
                icon: '🤖'
              },
              { 
                title: 'Machine Learning workshop completed', 
                time: '3 hours ago', 
                type: 'success',
                user: 'AI Department',
                icon: '🧠'
              },
              { 
                title: 'Student tech project presentation', 
                time: '5 hours ago', 
                type: 'info',
                user: 'Student Affairs',
                icon: '💻'
              },
              { 
                title: 'Faculty AI training session', 
                time: '1 day ago', 
                type: 'info',
                user: 'Prof. Michael Brown',
                icon: '📚'
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 rounded-xl hover:from-primary-100/50 hover:to-secondary-100/50 transition-all duration-300 border border-primary-100/50">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-sage-600">{activity.user} • {activity.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-primary-500' :
                  activity.type === 'warning' ? 'bg-accent-500' :
                  'bg-secondary-500'
                } animate-bounce-gentle`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Billing with Department Filter */}
      <div className="card-nature p-6 animate-slide-up animate-delay-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary-600" />
            <span>Monthly Billing Trends</span>
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={billingFilter}
              onChange={(e) => setBillingFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="cs">Computer Science</option>
              <option value="ai">AI & ML</option>
              <option value="ds">Data Science</option>
            </select>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getFilteredBillingData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #22c55e',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.1)'
                }}
              />
              <Bar dataKey="total" fill="url(#billingGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#84cc16" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technology Metrics */}
      <div className="card-nature p-6 animate-slide-up animate-delay-400">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-primary-600" />
          <span>Technology Achievements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { metric: 'AI Research Projects', value: '45+', icon: '🤖', color: 'primary' },
            { metric: 'Industry Partnerships', value: '85%', icon: '🤝', color: 'secondary' },
            { metric: 'Tech Innovation Rate', value: '92%', icon: '💡', color: 'forest' },
            { metric: 'Student Placement', value: '98%', icon: '🏆', color: 'accent' },
          ].map((achievement, index) => (
            <div key={index} className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100 text-center">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className="font-medium text-gray-900 mb-1">{achievement.metric}</h4>
              <p className="text-2xl font-bold text-primary-600">{achievement.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;