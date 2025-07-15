import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealTimeAnalytics } from '../../hooks/useRealTimeAnalytics';
import useAnalyticsStore from '../../store/analyticsStore';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Award, 
  Calendar,
  Filter,
  Download,
  Printer,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  Bell,
  Activity,
  BarChart2,
  AlertCircle,
  CheckCircle,
  Database,
  History
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

const RealTimeDashboard: React.FC = () => {
  const { 
    isConnected, 
    connectionError, 
    lastUpdate, 
    isFallbackMode,
    recentUpdates,
    clearRecentUpdates
  } = useRealTimeAnalytics();
  
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  
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
    auditLog,
    setLoginFilter,
    setBillingFilter,
    setAttendanceFilter
  } = useAnalyticsStore();

  // Show notification when new update comes in
  useEffect(() => {
    if (lastUpdate) {
      setShowUpdateNotification(true);
      const timer = setTimeout(() => {
        setShowUpdateNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

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

  const formatTimestamp = (date: Date) => {
    return format(date, 'MMM dd, yyyy HH:mm:ss');
  };

  const getMetricName = (metricType: string, metricName: string) => {
    switch (metricType) {
      case 'enrollment':
        return metricName === 'totalStudents' ? 'Total Students' : 
               metricName === 'totalFaculty' ? 'Total Faculty' : metricName;
      case 'attendance':
        return metricName === 'year1' ? '1st Year Attendance' :
               metricName === 'year2' ? '2nd Year Attendance' :
               metricName === 'year3' ? '3rd Year Attendance' :
               metricName === 'year4' ? '4th Year Attendance' : metricName;
      case 'fees':
        return metricName === 'monthlyBilling' ? 'Monthly Billing' : metricName;
      default:
        return metricName;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Real-Time Analytics Dashboard</h2>
        <p className="text-sage-600">Live data insights with instant updates and comprehensive monitoring.</p>
      </div>

      {/* Connection Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isConnected ? 'Real-time Connected' : 'Disconnected'}
            </span>
          </div>
          
          {isFallbackMode && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Fallback Mode Active</span>
            </div>
          )}
          
          {connectionError && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{connectionError}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>{showAuditLog ? 'Hide Audit Log' : 'Show Audit Log'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={() => {
              // Export dashboard data as JSON
              const dataStr = JSON.stringify({
                metrics: {
                  totalStudents,
                  totalFaculty,
                  techDepartments,
                  monthlyBilling,
                  innovationRate
                },
                charts: {
                  departmentData,
                  attendanceData,
                  monthlyGrowth,
                  loginTrendsData,
                  monthlyBillingData
                },
                auditLog
              }, null, 2);
              
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const exportFileDefaultName = `analytics-export-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
              
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
            }}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Real-time Update Notification */}
      <AnimatePresence>
        {showUpdateNotification && lastUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-primary-600 animate-pulse" />
                <div>
                  <p className="font-medium text-primary-900">Real-time Update</p>
                  <p className="text-sm text-primary-700">
                    {getMetricName(lastUpdate.metricType, lastUpdate.metricName)} updated by {lastUpdate.userName} ({lastUpdate.userRole})
                  </p>
                  <p className="text-xs text-primary-600">
                    {lastUpdate.previousValue !== null ? 
                      `Changed from ${lastUpdate.previousValue} to ${lastUpdate.newValue} (${lastUpdate.percentageChange?.toFixed(2)}%)` : 
                      `New value: ${lastUpdate.newValue}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary-600">{formatTimestamp(lastUpdate.timestamp)}</p>
                <button 
                  onClick={() => setShowUpdateNotification(false)}
                  className="text-primary-500 hover:text-primary-700 text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="dashboard-card group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-neutral-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                {totalStudents.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500">Growing community</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-success-600">
                <span className="text-lg">↗</span>
                <span className="font-medium">8%</span>
                <span className="text-neutral-500">vs last month</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-primary text-white group-hover:scale-110 transition-all duration-300">
              <GraduationCap className="w-7 h-7" />
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-gradient-primary w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="dashboard-card group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600 mb-1">Faculty Members</p>
              <p className="text-3xl font-bold text-neutral-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                {totalFaculty.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500">Expert educators</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-success-600">
                <span className="text-lg">↗</span>
                <span className="font-medium">3%</span>
                <span className="text-neutral-500">vs last month</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-secondary text-white group-hover:scale-110 transition-all duration-300">
              <Users className="w-7 h-7" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-gradient-primary w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="dashboard-card group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600 mb-1">Tech Departments</p>
              <p className="text-3xl font-bold text-neutral-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                {techDepartments}
              </p>
              <p className="text-xs text-neutral-500">AI-focused programs</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 text-white group-hover:scale-110 transition-all duration-300">
              <Database className="w-7 h-7" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-gradient-primary w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="dashboard-card group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600 mb-1">Monthly Billing</p>
              <p className="text-3xl font-bold text-neutral-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                ${(monthlyBilling/1000).toFixed(0)}K
              </p>
              <p className="text-xs text-neutral-500">Technology growth</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-success-600">
                <span className="text-lg">↗</span>
                <span className="font-medium">12%</span>
                <span className="text-neutral-500">vs last month</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-accent text-white group-hover:scale-110 transition-all duration-300">
              <BarChart2 className="w-7 h-7" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-gradient-primary w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="dashboard-card group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600 mb-1">Innovation Rate</p>
              <p className="text-3xl font-bold text-neutral-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                {innovationRate}%
              </p>
              <p className="text-xs text-neutral-500">Tech advancement</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-success-600">
                <span className="text-lg">↗</span>
                <span className="font-medium">2.3%</span>
                <span className="text-neutral-500">vs last month</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 text-white group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 rounded-b-2xl overflow-hidden">
            <div className="h-full bg-gradient-primary w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
          </div>
        </motion.div>
      </div>

      {/* Recent Updates Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-nature p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary-600" />
            <span>Real-time Updates</span>
          </h3>
          <button
            onClick={clearRecentUpdates}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {recentUpdates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent updates. Changes will appear here in real-time.</p>
            </div>
          ) : (
            recentUpdates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary-50/50 to-secondary-50/50 rounded-xl hover:from-primary-100/50 hover:to-secondary-100/50 transition-all duration-300 border border-primary-100/50"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  {update.metricType === 'enrollment' ? (
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  ) : update.metricType === 'attendance' ? (
                    <Calendar className="w-5 h-5 text-green-600" />
                  ) : update.metricType === 'fees' ? (
                    <BarChart2 className="w-5 h-5 text-accent-600" />
                  ) : (
                    <Activity className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {getMetricName(update.metricType, update.metricName)} Updated
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(update.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>
                  <p className="text-xs text-sage-600">
                    {update.userName} ({update.userRole})
                    {update.department && ` • ${update.department}`}
                  </p>
                  <div className="mt-1 flex items-center text-xs">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium text-gray-800 mx-1">
                      {update.previousValue !== null ? update.previousValue : 'N/A'}
                    </span>
                    <span className="text-gray-600 mx-1">to</span>
                    <span className="font-medium text-gray-800 mx-1">{update.newValue}</span>
                    {update.percentageChange !== null && (
                      <span className={`ml-2 ${update.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {update.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(update.percentageChange).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Login Trends with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="card-nature p-6"
      >
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
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #3b82f6',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Average Attendance with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="card-nature p-6"
      >
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
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="year1" fill="#3b82f6" name="1st Year" />
              <Bar dataKey="year2" fill="#10b981" name="2nd Year" />
              <Bar dataKey="year3" fill="#f59e0b" name="3rd Year" />
              <Bar dataKey="year4" fill="#ef4444" name="4th Year" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card-nature p-6"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="card-nature p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <span>Enrollment Growth</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #3b82f6',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="students" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                  name="Students"
                />
                <Area 
                  type="monotone" 
                  dataKey="faculty" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6} 
                  name="Faculty"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Monthly Billing with Department Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="card-nature p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-primary-600" />
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
              <Legend />
              <Bar dataKey="total" fill="url(#billingGradient)" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="tuition" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tuition" />
              <Bar dataKey="hostel" fill="#10b981" radius={[4, 4, 0, 0]} name="Hostel" />
              <Bar dataKey="misc" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Miscellaneous" />
              <defs>
                <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#84cc16" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Audit Log */}
      {showAuditLog && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card-nature p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <History className="w-5 h-5 text-primary-600" />
              <span>Audit Log</span>
            </h3>
            <div className="text-sm text-gray-500">
              Showing {auditLog.length} updates
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLog.slice(0, 50).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(new Date(log.timestamp))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                      <div className="text-sm text-gray-500">{log.userRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getMetricName(log.metricType, log.metricName)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.previousValue !== null ? (
                        <div className="flex items-center">
                          <span>{log.previousValue}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{log.newValue}</span>
                          {log.percentageChange !== null && (
                            <span className={`ml-2 ${log.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {log.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(log.percentageChange).toFixed(2)}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>New value: {log.newValue}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.department || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Last Update Timestamp */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>
            Last updated: {lastUpdate ? formatTimestamp(lastUpdate.timestamp) : 'Never'}
          </span>
        </div>
        <div className="mt-1">
          {isConnected ? (
            <span className="text-green-600 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Real-time updates active
            </span>
          ) : (
            <span className="text-red-600 flex items-center justify-center">
              <AlertCircle className="w-3 h-3 mr-1" /> Real-time updates inactive
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;