import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { useWhatsAppNotifications } from '../hooks/useWhatsAppNotifications';
import { pdfExportService } from '../utils/pdfExport';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Upload,
  MessageCircle,
  Phone,
  Printer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AttendanceManagement = () => {
  const { user } = useAuth();
  const { notifyAttendance, isLoading: isNotifying } = useWhatsAppNotifications();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('CS-301');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [autoNotify, setAutoNotify] = useState(true);

  const isStudent = user?.role === 'student';

  // Mock data for student attendance view
  const studentAttendanceData = [
    { month: 'Jan', attendance: 85 },
    { month: 'Feb', attendance: 92 },
    { month: 'Mar', attendance: 78 },
    { month: 'Apr', attendance: 88 },
    { month: 'May', attendance: 95 },
    { month: 'Jun', attendance: 82 },
  ];

  const studentSubjectAttendance = [
    { subject: 'Data Structures', present: 28, total: 32, percentage: 87.5 },
    { subject: 'Algorithms', present: 25, total: 30, percentage: 83.3 },
    { subject: 'Database Systems', present: 22, total: 25, percentage: 88.0 },
    { subject: 'Software Engineering', present: 30, total: 35, percentage: 85.7 },
    { subject: 'Computer Networks', present: 18, total: 22, percentage: 81.8 },
  ];

  // Mock data for faculty attendance marking
  const mockStudents = [
    { id: '1', name: 'John Smith', rollNumber: 'CS2021001', status: 'present', parentPhone: '+1234567890' },
    { id: '2', name: 'Emily Johnson', rollNumber: 'CS2021002', status: 'present', parentPhone: '+1234567892' },
    { id: '3', name: 'Michael Brown', rollNumber: 'CS2021003', status: 'absent', parentPhone: '+1234567893' },
    { id: '4', name: 'Sarah Davis', rollNumber: 'CS2021004', status: 'present', parentPhone: '+1234567894' },
    { id: '5', name: 'David Wilson', rollNumber: 'CS2021005', status: 'late', parentPhone: '+1234567895' },
    { id: '6', name: 'Lisa Anderson', rollNumber: 'CS2021006', status: 'present', parentPhone: '+1234567896' },
    { id: '7', name: 'James Taylor', rollNumber: 'CS2021007', status: 'absent', parentPhone: '+1234567897' },
    { id: '8', name: 'Maria Garcia', rollNumber: 'CS2021008', status: 'present', parentPhone: '+1234567898' },
  ];

  const [studentAttendance, setStudentAttendance] = useState(
    mockStudents.reduce((acc, student) => {
      acc[student.id] = student.status;
      return acc;
    }, {})
  );

  const handleAttendanceChange = async (studentId, status) => {
    const previousStatus = studentAttendance[studentId];
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));

    if (autoNotify && status === 'absent' && previousStatus !== 'absent') {
      try {
        await notifyAttendance(studentId, false, selectedSubject, selectedDate);
      } catch (error) {
        console.error('Failed to notify parent:', error);
      }
    } else if (autoNotify && status === 'present' && previousStatus === 'absent') {
      try {
        await notifyAttendance(studentId, true, selectedSubject, selectedDate);
      } catch (error) {
        console.error('Failed to notify parent:', error);
      }
    }
  };

  const saveAttendance = async () => {
    if (autoNotify) {
      const absentStudents = mockStudents.filter(student => 
        studentAttendance[student.id] === 'absent'
      );
      for (const student of absentStudents) {
        try {
          await notifyAttendance(student.id, false, selectedSubject, selectedDate);
        } catch (error) {
          console.error(`Failed to notify parent of ${student.name}:`, error);
        }
      }
    }
    alert('Attendance saved successfully! Parents have been notified via WhatsApp.');
  };

  const handleExportPDF = async () => {
    try {
      const attendanceData = mockStudents.map(student => ({
        name: student.name,
        rollNumber: student.rollNumber,
        department: 'Computer Science',
        attendance: Math.floor(Math.random() * 20) + 80,
        status: studentAttendance[student.id]
      }));
      await pdfExportService.exportAttendanceReport(attendanceData, {
        filename: 'attendance-report',
        title: 'Attendance Report',
        subtitle: `${selectedSubject} - ${selectedDate}`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return CheckCircle;
      case 'absent': return XCircle;
      case 'late': return Clock;
      default: return Clock;
    }
  };

  // --- Professional Attendance Background Image ---
  return (
    <Layout>
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80" />
        <img
          src="https://as2.ftcdn.net/v2/jpg/13/34/88/99/1000_F_1334889933_0c0O4BbOyfIefEOiewAitHP5FDgE6Z7V.jpg"
          alt="Attendance Background"
          className="w-full h-full object-cover object-center"
          style={{ filter: "blur(1px) grayscale(0.2)" }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 relative z-10"
      >
        {isStudent ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
                <p className="text-gray-600">Track your attendance across all subjects</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Background Video */}
            <div className="relative rounded-xl overflow-hidden">
              <video
                src="https://cdn.pixabay.com/video/2020/01/14/31251-385265625_large.mp4"
                autoPlay
                loop
                muted
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <h2 className="text-xl font-bold">Attendance </h2>
                  <p className="text-sm opacity-90">Track your academic progress</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Notification Info */}
            <div className="bg-slate-50/80 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">WhatsApp Notifications Active</h3>
                  <p className="text-sm text-gray-600">Your parents receive automatic updates about your attendance via WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                    <p className="text-3xl font-bold text-gray-900">85.2%</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classes Attended</p>
                    <p className="text-3xl font-bold text-gray-900">123</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classes Missed</p>
                    <p className="text-3xl font-bold text-gray-900">21</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Attendance Chart */}
            <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject-wise Attendance */}
            <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Attendance</h3>
              <div className="space-y-4">
                {studentSubjectAttendance.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                      <p className="text-sm text-gray-600">{subject.present}/{subject.total} classes attended</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${subject.percentage >= 85 ? 'text-green-600' : subject.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {subject.percentage}%
                      </p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${subject.percentage >= 85 ? 'bg-green-500' : subject.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-gray-600">Mark attendance and automatically notify parents via WhatsApp</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </button>
              </div>
            </div>

            {/* Background Video */}
            <div className="relative rounded-xl overflow-hidden">
              <video
                src="https://cdn.pixabay.com/video/2020/01/14/31251-385265625_large.mp4"
                autoPlay
                loop
                muted
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <h2 className="text-xl font-bold">Attendance Management System</h2>
                  <p className="text-sm opacity-90">Mark attendance and notify parents instantly</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Notification Settings */}
            <div className="bg-slate-50/80 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">WhatsApp Parent Notifications</h3>
                    <p className="text-sm text-gray-600">Automatically notify parents when students are marked absent or present</p>
                  </div>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoNotify}
                    onChange={(e) => setAutoNotify(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-notify parents</span>
                </label>
              </div>
              {isNotifying && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending WhatsApp notifications...</span>
                </div>
              )}
            </div>

            {/* Attendance Form */}
            <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Attendance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="CS-301">CS-301</option>
                    <option value="CS-302">CS-302</option>
                    <option value="CS-401">CS-401</option>
                    <option value="CS-402">CS-402</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Data Structures">Data Structures</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Database Systems">Database Systems</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={saveAttendance}
                    disabled={isNotifying}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isNotifying ? 'Saving & Notifying...' : 'Save Attendance'}
                  </button>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Students ({mockStudents.length})</h3>
                <div className="flex space-x-2 text-sm">
                  <span className="text-green-600">Present: {Object.values(studentAttendance).filter(s => s === 'present').length}</span>
                  <span className="text-red-600">Absent: {Object.values(studentAttendance).filter(s => s === 'absent').length}</span>
                  <span className="text-yellow-600">Late: {Object.values(studentAttendance).filter(s => s === 'late').length}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {mockStudents.map((student) => {
                  const StatusIcon = getStatusIcon(studentAttendance[student.id]);
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.rollNumber}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span>{student.parentPhone}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(studentAttendance[student.id])}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="capitalize">{studentAttendance[student.id]}</span>
                        </div>
                        
                        <select
                          value={studentAttendance[student.id]}
                          onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
                    <p className="text-3xl font-bold text-gray-900">87.5%</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Parents Notified</p>
                    <p className="text-3xl font-bold text-green-600">{Object.values(studentAttendance).filter(s => s === 'absent').length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Average</p>
                    <p className="text-3xl font-bold text-gray-900">85.7%</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default AttendanceManagement;
