import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { pdfExportService } from '../utils/pdfExport';
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
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Award, 
  Calendar,
  Download,
  Printer
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('semester');

  const canViewAnalytics = ['hod', 'principal', 'director'].includes(user?.role || '');

  // Mock analytics data
  const enrollmentData = [
    { year: '2020', students: 2200, faculty: 140 },
    { year: '2021', students: 2450, faculty: 145 },
    { year: '2022', students: 2680, faculty: 150 },
    { year: '2023', students: 2750, faculty: 155 },
    { year: '2024', students: 2847, faculty: 156 },
  ];

  const departmentData = [
    { name: 'Computer Science', students: 850, faculty: 45, color: '#3b82f6' },
    { name: 'Business Admin', students: 620, faculty: 35, color: '#10b981' },
    { name: 'Mechanical Eng', students: 580, faculty: 32, color: '#f59e0b' },
    { name: 'Electronics', students: 520, faculty: 28, color: '#ef4444' },
    { name: 'Civil Eng', students: 277, faculty: 16, color: '#8b5cf6' },
  ];

  const performanceData = [
    { semester: 'Sem 1', avgGPA: 7.2, passRate: 85 },
    { semester: 'Sem 2', avgGPA: 7.5, passRate: 88 },
    { semester: 'Sem 3', avgGPA: 7.8, passRate: 90 },
    { semester: 'Sem 4', avgGPA: 8.0, passRate: 92 },
    { semester: 'Sem 5', avgGPA: 8.2, passRate: 94 },
    { semester: 'Sem 6', avgGPA: 8.1, passRate: 91 },
  ];

  const attendanceData = [
    { month: 'Aug', attendance: 87 },
    { month: 'Sep', attendance: 89 },
    { month: 'Oct', attendance: 85 },
    { month: 'Nov', attendance: 91 },
    { month: 'Dec', attendance: 88 },
    { month: 'Jan', attendance: 90 },
  ];

  const placementData = [
    { year: '2020', placed: 180, total: 220, percentage: 82 },
    { year: '2021', placed: 195, total: 235, percentage: 83 },
    { year: '2022', placed: 210, total: 250, percentage: 84 },
    { year: '2023', placed: 225, total: 260, percentage: 87 },
    { year: '2024', placed: 240, total: 275, percentage: 87 },
  ];

  const feeCollectionData = [
    { month: 'Aug', collected: 450000, target: 500000 },
    { month: 'Sep', collected: 480000, target: 500000 },
    { month: 'Oct', collected: 520000, target: 500000 },
    { month: 'Nov', collected: 490000, target: 500000 },
    { month: 'Dec', collected: 510000, target: 500000 },
    { month: 'Jan', collected: 470000, target: 500000 },
  ];

  const handleExportPDF = async () => {
    try {
      const analyticsData = {
        totalStudents: 2847,
        totalFaculty: 156,
        overallAttendance: 88.5,
        averageCGPA: 8.2,
        feeCollectionRate: 94.5,
        placementRate: 87
      };

      await pdfExportService.exportAnalyticsReport(analyticsData, {
        filename: 'analytics-report',
        title: 'Analytics Report',
        subtitle: `Period: ${selectedPeriod === 'semester' ? 'Current Semester' : 
                           selectedPeriod === 'year' ? 'Current Year' : 'All Time'}`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!canViewAnalytics) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view analytics.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Full-page background image and overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1543286386-713bdd548da4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGFuYWx5dGljc3xlbnwwfHwwfHx8MA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100vw'
        }}
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 relative z-10"
      >
        {/* Header (no white bar, just text) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Analytics Dashboard</h1>
            <div className="h-1 w-16 bg-blue-500 rounded mb-2" />
            <p className="text-gray-600">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 bg-white/80 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            >
              <option value="semester">This Semester</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button 
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-200 bg-white/80 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-200 bg-white/80 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <div id="analytics-content" className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">2,847</p>
                  <p className="text-xs text-green-600 mt-1">↗ 3.5% from last year</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Faculty Members</p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
                  <p className="text-xs text-green-600 mt-1">↗ 0.6% from last year</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Avg Attendance</p>
                  <p className="text-3xl font-bold text-gray-900">88.5%</p>
                  <p className="text-xs text-green-600 mt-1">↗ 2.1% from last month</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Placement Rate</p>
                  <p className="text-3xl font-bold text-gray-900">87%</p>
                  <p className="text-xs text-green-600 mt-1">↗ 3% from last year</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trends */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="students" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Area type="monotone" dataKey="faculty" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Distribution */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
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
                      dataKey="students"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="avgGPA" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Trends */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Placement and Fee Collection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Placement Statistics */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Placement Statistics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={placementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="placed" fill="#10b981" name="Placed" />
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fee Collection */}
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Collection vs Target</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feeCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="collected" fill="#3b82f6" name="Collected" />
                    <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Department Performance Table */}
          <div className="bg-white/90 rounded-2xl shadow border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Students</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Faculty</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Ratio</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Avg GPA</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Attendance</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Placement</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((dept, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{dept.students}</td>
                      <td className="py-3 px-4 text-center text-gray-700">{dept.faculty}</td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {Math.round(dept.students / dept.faculty)}:1
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {(7.5 + Math.random() * 1.5).toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {Math.round(85 + Math.random() * 10)}%
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">
                        {Math.round(80 + Math.random() * 15)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights and Recommendations */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Key Insights & Recommendations</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Enrollment Growth</h4>
                <p className="text-sm text-gray-600">
                  Student enrollment has grown by 29% over the past 5 years. Consider expanding infrastructure 
                  and faculty to maintain quality education standards.
                </p>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Attendance Improvement</h4>
                <p className="text-sm text-gray-600">
                  Overall attendance has improved to 88.5%. Focus on departments with lower attendance rates 
                  through targeted interventions and engagement programs.
                </p>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Placement Success</h4>
                <p className="text-sm text-gray-600">
                  Placement rate of 87% is excellent. Strengthen industry partnerships and skill development 
                  programs to maintain this performance.
                </p>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Fee Collection</h4>
                <p className="text-sm text-gray-600">
                  Fee collection efficiency is at 94%. Implement automated reminders and flexible payment 
                  options to achieve 100% collection rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AnalyticsPage;
