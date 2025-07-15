import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { useWhatsAppNotifications } from '../hooks/useWhatsAppNotifications';
import { pdfExportService } from '../utils/pdfExport';
import {
  BookOpen,
  Upload,
  Download,
  Edit,
  Save,
  X,
  TrendingUp,
  Award,
  Target,
  MessageCircle,
  Phone,
  Printer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MarksManagement: React.FC = () => {
  const { user } = useAuth();
  const { notifyMarks, isLoading: isNotifying } = useWhatsAppNotifications();
  const [selectedExam, setSelectedExam] = useState('mid-term');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [autoNotify, setAutoNotify] = useState(true);

  const isStudent = user?.role === 'student';
  const isFaculty = user?.role === 'faculty';

  // Mock data for student marks view
  const studentMarksData = [
    { exam: 'Unit 1', marks: 85 },
    { exam: 'Unit 2', marks: 78 },
    { exam: 'Mid Term', marks: 82 },
    { exam: 'Unit 3', marks: 88 },
    { exam: 'Unit 4', marks: 91 },
    { exam: 'Final', marks: 87 },
  ];

  const studentSubjectMarks = [
    { subject: 'Data Structures', internal: 85, external: 78, total: 163, grade: 'A' },
    { subject: 'Algorithms', internal: 88, external: 82, total: 170, grade: 'A+' },
    { subject: 'Database Systems', internal: 82, external: 75, total: 157, grade: 'A' },
    { subject: 'Software Engineering', internal: 90, external: 85, total: 175, grade: 'A+' },
    { subject: 'Computer Networks', internal: 78, external: 72, total: 150, grade: 'B+' },
  ];

  // Mock data for faculty marks entry
  const mockStudentMarks = [
    { id: '1', name: 'John Smith', rollNumber: 'CS2021001', marks: 85, maxMarks: 100, parentPhone: '+1234567890' },
    { id: '2', name: 'Emily Johnson', rollNumber: 'CS2021002', marks: 92, maxMarks: 100, parentPhone: '+1234567892' },
    { id: '3', name: 'Michael Brown', rollNumber: 'CS2021003', marks: 78, maxMarks: 100, parentPhone: '+1234567893' },
    { id: '4', name: 'Sarah Davis', rollNumber: 'CS2021004', marks: 88, maxMarks: 100, parentPhone: '+1234567894' },
    { id: '5', name: 'David Wilson', rollNumber: 'CS2021005', marks: 76, maxMarks: 100, parentPhone: '+1234567895' },
    { id: '6', name: 'Lisa Anderson', rollNumber: 'CS2021006', marks: 94, maxMarks: 100, parentPhone: '+1234567896' },
    { id: '7', name: 'James Taylor', rollNumber: 'CS2021007', marks: 82, maxMarks: 100, parentPhone: '+1234567897' },
    { id: '8', name: 'Maria Garcia', rollNumber: 'CS2021008', marks: 89, maxMarks: 100, parentPhone: '+1234567898' },
  ];

  const [studentMarks, setStudentMarks] = useState(
    mockStudentMarks.reduce((acc, student) => {
      acc[student.id] = student.marks;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleMarksChange = (studentId: string, marks: number) => {
    setStudentMarks(prev => ({
      ...prev,
      [studentId]: marks
    }));
  };

  const saveMarks = async () => {
    if (autoNotify) {
      for (const student of mockStudentMarks) {
        const marks = studentMarks[student.id];
        try {
          await notifyMarks(student.id, selectedSubject, marks, student.maxMarks, selectedExam);
        } catch (error) {
          console.error(`Failed to notify parent of ${student.name}:`, error);
        }
      }
    }
    alert('Marks saved successfully! Parents have been notified via WhatsApp.');
    setEditingStudent(null);
  };

  const saveIndividualMarks = async (studentId: string) => {
    const student = mockStudentMarks.find(s => s.id === studentId);
    if (!student) return;
    const marks = studentMarks[studentId];
    if (autoNotify) {
      try {
        await notifyMarks(studentId, selectedSubject, marks, student.maxMarks, selectedExam);
        alert(`Marks saved for ${student.name}! Parent notified via WhatsApp.`);
      } catch (error) {
        console.error('Failed to notify parent:', error);
        alert('Marks saved but failed to send WhatsApp notification');
      }
    } else {
      alert(`Marks saved for ${student.name}!`);
    }
    setEditingStudent(null);
  };

  const handleExportPDF = async () => {
    try {
      const marksData = mockStudentMarks.map(student => ({
        name: student.name,
        rollNumber: student.rollNumber,
        subject: selectedSubject,
        examType: selectedExam,
        marks: studentMarks[student.id],
        maxMarks: student.maxMarks,
        percentage: (studentMarks[student.id] / student.maxMarks) * 100,
        grade: getGrade((studentMarks[student.id] / student.maxMarks) * 100)
      }));

      await pdfExportService.exportMarksReport(marksData, {
        filename: 'marks-report',
        title: 'Marks Report',
        subtitle: `${selectedSubject} - ${selectedExam}`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-700 bg-green-100';
      case 'A': return 'text-blue-700 bg-blue-100';
      case 'B+': return 'text-yellow-700 bg-yellow-100';
      case 'B': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getMarksColor = (marks: number, maxMarks: number) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'text-green-700';
    if (percentage >= 80) return 'text-blue-700';
    if (percentage >= 70) return 'text-yellow-700';
    if (percentage >= 60) return 'text-orange-700';
    return 'text-red-700';
  };

  // --- STUDENT VIEW ---
  if (isStudent) {
    return (
      <Layout>
        {/* Background Image */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: `url('https://as2.ftcdn.net/v2/jpg/13/95/86/43/1000_F_1395864328_ZEdk3fqBqvnOZdMFs5FIY6oJwuutBOOa.jpg')`,
            filter: 'brightness(0.6)'
          }}
        />
        <div className="min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 p-4 md:p-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Marks</h1>
                <p className="text-gray-900">View your academic performance and grades</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-indigo-700 bg-white/80 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-indigo-700 bg-white/80 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Notification Info */}
            <div className="bg-green-50/90 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Marks Updates via WhatsApp</h3>
                  <p className="text-sm text-gray-700">Your parents receive automatic notifications when new marks are published</p>
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall CGPA</p>
                    <p className="text-3xl font-bold text-gray-900">8.7</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Semester</p>
                    <p className="text-3xl font-bold text-gray-900">8.9</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Class Rank</p>
                    <p className="text-3xl font-bold text-gray-900">3rd</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-purple-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Marks Trend Chart */}
            <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentMarksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="marks" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject-wise Marks */}
            <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subject-wise Performance</h3>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-indigo-700 bg-white/80 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Internal</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">External</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Total</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSubjectMarks.map((subject, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-indigo-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{subject.subject}</td>
                        <td className="py-3 px-4 text-center text-gray-700">{subject.internal}/100</td>
                        <td className="py-3 px-4 text-center text-gray-700">{subject.external}/100</td>
                        <td className="py-3 px-4 text-center font-medium text-gray-900">{subject.total}/200</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.grade)}`}>
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // --- FACULTY VIEW ---
  return (
    <Layout>
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url('https://as2.ftcdn.net/v2/jpg/13/95/86/43/1000_F_1395864328_ZEdk3fqBqvnOZdMFs5FIY6oJwuutBOOa.jpg')`,
          filter: 'brightness(0.6)'
        }}
      />
      <div className="min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 p-4 md:p-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marks Management</h1>
              <p className="text-gray-900">Upload marks and automatically notify parents via WhatsApp</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-indigo-700 bg-white/80 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-indigo-700 bg-white/80 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-indigo-700 bg-white/80 rounded-lg hover:bg-indigo-50 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Notification Settings */}
          <div className="bg-green-50/90 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">WhatsApp Marks Notifications</h3>
                  <p className="text-sm text-gray-700">Automatically notify parents when marks are published or updated</p>
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

          {/* Marks Entry Form */}
          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Marks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="unit-1">Unit Test 1</option>
                  <option value="unit-2">Unit Test 2</option>
                  <option value="mid-term">Mid Term</option>
                  <option value="unit-3">Unit Test 3</option>
                  <option value="unit-4">Unit Test 4</option>
                  <option value="final">Final Exam</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Database Systems">Database Systems</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={saveMarks}
                  disabled={isNotifying}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isNotifying ? 'Saving & Notifying...' : 'Save All Marks'}
                </button>
              </div>
            </div>
          </div>

          {/* Student Marks Table */}
          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Marks ({mockStudentMarks.length})</h3>
              <div className="text-sm text-gray-600">
                Max Marks: 100 | Average: {Math.round(Object.values(studentMarks).reduce((a, b) => a + b, 0) / Object.values(studentMarks).length)}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Roll Number</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Marks</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Percentage</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Parent Contact</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudentMarks.map((student) => {
                    const marks = studentMarks[student.id];
                    const percentage = (marks / student.maxMarks) * 100;
                    const isEditing = editingStudent === student.id;
                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-indigo-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                        <td className="py-3 px-4 text-gray-700">{student.rollNumber}</td>
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max={student.maxMarks}
                              value={marks}
                              onChange={(e) => handleMarksChange(student.id, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          ) : (
                            <span className={`font-medium ${getMarksColor(marks, student.maxMarks)}`}>
                              {marks}/{student.maxMarks}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-medium ${getMarksColor(marks, student.maxMarks)}`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{student.parentPhone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => saveIndividualMarks(student.id)}
                                disabled={isNotifying}
                                className="p-1 text-green-700 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingStudent(null)}
                                className="p-1 text-red-700 hover:bg-red-100 rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingStudent(student.id)}
                              className="p-1 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Highest Score</p>
                  <p className="text-3xl font-bold text-gray-900">{Math.max(...Object.values(studentMarks))}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Class Average</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(Object.values(studentMarks).reduce((a, b) => a + b, 0) / Object.values(studentMarks).length)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round((Object.values(studentMarks).filter(mark => mark >= 40).length / Object.values(studentMarks).length) * 100)}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Parents Notified</p>
                  <p className="text-3xl font-bold text-green-700">
                    {autoNotify ? mockStudentMarks.length : 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MarksManagement;
