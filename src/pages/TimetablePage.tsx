import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { pdfExportService } from '../utils/pdfExport';
import { Calendar, Clock, MapPin, User, BookOpen, Filter, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedView, setSelectedView] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(0);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:15 AM - 12:15 PM',
    '12:15 PM - 1:15 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:15 PM - 5:15 PM',
    '5:15 PM - 6:15 PM'
  ];

  // Mock timetable data based on user role
  const getTimetableData = () => {
    if (user?.role === 'student') {
      return {
        Monday: [
          { time: '9:00 AM - 10:00 AM', subject: 'Data Structures', faculty: 'Dr. Smith', room: 'A-101', type: 'lecture' },
          { time: '10:00 AM - 11:00 AM', subject: 'Mathematics', faculty: 'Prof. Johnson', room: 'B-201', type: 'lecture' },
          { time: '11:15 AM - 12:15 PM', subject: 'Data Structures Lab', faculty: 'Dr. Smith', room: 'Lab-1', type: 'lab' },
          { time: '12:15 PM - 1:15 PM', subject: 'Lunch Break', faculty: '', room: '', type: 'break' },
          { time: '2:00 PM - 3:00 PM', subject: 'Database Systems', faculty: 'Dr. Brown', room: 'A-102', type: 'lecture' },
          { time: '3:00 PM - 4:00 PM', subject: 'Software Engineering', faculty: 'Prof. Davis', room: 'B-202', type: 'lecture' },
          { time: '4:15 PM - 5:15 PM', subject: 'Free Period', faculty: '', room: '', type: 'free' },
          { time: '5:15 PM - 6:15 PM', subject: 'Study Hall', faculty: '', room: 'Library', type: 'study' }
        ],
        Tuesday: [
          { time: '9:00 AM - 10:00 AM', subject: 'Algorithms', faculty: 'Dr. Wilson', room: 'A-103', type: 'lecture' },
          { time: '10:00 AM - 11:00 AM', subject: 'Computer Networks', faculty: 'Prof. Taylor', room: 'B-203', type: 'lecture' },
          { time: '11:15 AM - 12:15 PM', subject: 'Database Lab', faculty: 'Dr. Brown', room: 'Lab-2', type: 'lab' },
          { time: '12:15 PM - 1:15 PM', subject: 'Lunch Break', faculty: '', room: '', type: 'break' },
          { time: '2:00 PM - 3:00 PM', subject: 'Operating Systems', faculty: 'Dr. Anderson', room: 'A-104', type: 'lecture' },
          { time: '3:00 PM - 4:00 PM', subject: 'Web Development', faculty: 'Prof. Garcia', room: 'Lab-3', type: 'lab' },
          { time: '4:15 PM - 5:15 PM', subject: 'Project Work', faculty: 'Dr. Smith', room: 'A-101', type: 'project' },
          { time: '5:15 PM - 6:15 PM', subject: 'Free Period', faculty: '', room: '', type: 'free' }
        ],
        // Add more days...
      };
    } else if (user?.role === 'faculty') {
      return {
        Monday: [
          { time: '9:00 AM - 10:00 AM', subject: 'Data Structures', class: 'CS-301', room: 'A-101', type: 'lecture' },
          { time: '10:00 AM - 11:00 AM', subject: 'Free Period', class: '', room: '', type: 'free' },
          { time: '11:15 AM - 12:15 PM', subject: 'Data Structures Lab', class: 'CS-301', room: 'Lab-1', type: 'lab' },
          { time: '12:15 PM - 1:15 PM', subject: 'Lunch Break', class: '', room: '', type: 'break' },
          { time: '2:00 PM - 3:00 PM', subject: 'Advanced Algorithms', class: 'CS-401', room: 'A-102', type: 'lecture' },
          { time: '3:00 PM - 4:00 PM', subject: 'Research Guidance', class: 'PhD Students', room: 'Research Lab', type: 'research' },
          { time: '4:15 PM - 5:15 PM', subject: 'Faculty Meeting', class: '', room: 'Conference Room', type: 'meeting' },
          { time: '5:15 PM - 6:15 PM', subject: 'Office Hours', class: '', room: 'Office', type: 'office' }
        ],
        // Add more days...
      };
    } else {
      // HOD/Principal view - overview of all activities
      return {
        Monday: [
          { time: '9:00 AM - 10:00 AM', activity: 'Morning Assembly', location: 'Main Hall', type: 'assembly' },
          { time: '10:00 AM - 11:00 AM', activity: 'Department Meetings', location: 'Various Rooms', type: 'meeting' },
          { time: '11:15 AM - 12:15 PM', activity: 'Class Observations', location: 'Classrooms', type: 'observation' },
          { time: '12:15 PM - 1:15 PM', activity: 'Lunch Break', location: '', type: 'break' },
          { time: '2:00 PM - 3:00 PM', activity: 'Administrative Work', location: 'Office', type: 'admin' },
          { time: '3:00 PM - 4:00 PM', activity: 'Student Counseling', location: 'Counseling Room', type: 'counseling' },
          { time: '4:15 PM - 5:15 PM', activity: 'Faculty Evaluation', location: 'Office', type: 'evaluation' },
          { time: '5:15 PM - 6:15 PM', activity: 'Planning Session', location: 'Conference Room', type: 'planning' }
        ],
        // Add more days...
      };
    }
  };

  const timetableData = getTimetableData();

  const handleExportPDF = async () => {
    try {
      await pdfExportService.exportTimetable(timetableData, {
        filename: 'timetable',
        title: 'Class Timetable',
        subtitle: `${user?.role === 'student' ? 'Student Schedule' : user?.role === 'faculty' ? 'Faculty Schedule' : 'Administrative Schedule'}`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'break': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'free': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'study': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'project': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'research': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'meeting': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'office': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'assembly': return 'bg-red-100 text-red-800 border-red-200';
      case 'observation': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'admin': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'counseling': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'evaluation': return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'planning': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const renderWeekView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-3 bg-gray-50 text-left font-medium text-gray-900 min-w-32">
              Time
            </th>
            {days.map((day) => (
              <th key={day} className="border border-gray-300 p-3 bg-gray-50 text-center font-medium text-gray-900 min-w-48">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, timeIndex) => (
            <tr key={timeIndex}>
              <td className="border border-gray-300 p-3 bg-gray-50 font-medium text-sm text-gray-700">
                {timeSlot}
              </td>
              {days.map((day) => {
                const dayData = timetableData[day] || [];
                const classData = dayData[timeIndex];
                
                return (
                  <td key={day} className="border border-gray-300 p-2">
                    {classData && classData.subject !== 'Free Period' && classData.activity !== 'Free Period' ? (
                      <div className={`p-3 rounded-lg border ${getTypeColor(classData.type)} h-full`}>
                        <div className="font-medium text-sm mb-1">
                          {classData.subject || classData.activity}
                        </div>
                        {user?.role === 'student' && (
                          <>
                            {classData.faculty && (
                              <div className="flex items-center text-xs mb-1">
                                <User className="w-3 h-3 mr-1" />
                                {classData.faculty}
                              </div>
                            )}
                            {classData.room && (
                              <div className="flex items-center text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {classData.room}
                              </div>
                            )}
                          </>
                        )}
                        {user?.role === 'faculty' && (
                          <>
                            {classData.class && (
                              <div className="flex items-center text-xs mb-1">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {classData.class}
                              </div>
                            )}
                            {classData.room && (
                              <div className="flex items-center text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {classData.room}
                              </div>
                            )}
                          </>
                        )}
                        {(user?.role === 'hod' || user?.role === 'principal' || user?.role === 'director') && (
                          <>
                            {classData.location && (
                              <div className="flex items-center text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {classData.location}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-gray-400 text-sm">
                        {classData?.subject || classData?.activity || 'Free'}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDayView = () => {
    const selectedDayName = days[selectedDay];
    const dayData = timetableData[selectedDayName] || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{selectedDayName}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedDay(prev => prev > 0 ? prev - 1 : days.length - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDay(prev => prev < days.length - 1 ? prev + 1 : 0)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {dayData.map((classData, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getTypeColor(classData.type)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-lg">
                  {classData.subject || classData.activity}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {timeSlots[index]}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {user?.role === 'student' && (
                  <>
                    {classData.faculty && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>Faculty: {classData.faculty}</span>
                      </div>
                    )}
                    {classData.room && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Room: {classData.room}</span>
                      </div>
                    )}
                  </>
                )}
                
                {user?.role === 'faculty' && (
                  <>
                    {classData.class && (
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>Class: {classData.class}</span>
                      </div>
                    )}
                    {classData.room && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Room: {classData.room}</span>
                      </div>
                    )}
                  </>
                )}
                
                {(user?.role === 'hod' || user?.role === 'principal' || user?.role === 'director') && (
                  <>
                    {classData.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Location: {classData.location}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
            <p className="text-gray-600">
              {user?.role === 'student' ? 'Your class schedule and academic timetable' :
               user?.role === 'faculty' ? 'Your teaching schedule and faculty duties' :
               'Institutional schedule overview and management'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value as 'week' | 'day')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="week">Week View</option>
                <option value="day">Day View</option>
              </select>
            </div>
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

        {/* Current Time Indicator */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-medium text-primary-900">Current Time</h3>
                <p className="text-sm text-primary-700">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} - {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-600 font-medium">Next Class</p>
              <p className="text-xs text-primary-700">
                {user?.role === 'student' ? 'Database Systems at 2:00 PM' :
                 user?.role === 'faculty' ? 'Advanced Algorithms at 2:00 PM' :
                 'Department Meeting at 2:00 PM'}
              </p>
            </div>
          </div>
        </div>

        {/* Timetable Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <span>
                {selectedView === 'week' ? 'Weekly Schedule' : 'Daily Schedule'}
              </span>
            </h3>
            
            {selectedView === 'week' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedWeek(prev => prev - 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 px-3">
                  Week {selectedWeek + 1}
                </span>
                <button
                  onClick={() => setSelectedWeek(prev => prev + 1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div id="timetable-content">
            {selectedView === 'week' ? renderWeekView() : renderDayView()}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { type: 'lecture', label: 'Lecture' },
              { type: 'lab', label: 'Laboratory' },
              { type: 'break', label: 'Break' },
              { type: 'free', label: 'Free Period' },
              { type: 'study', label: 'Study Hall' },
              { type: 'project', label: 'Project Work' },
              { type: 'research', label: 'Research' },
              { type: 'meeting', label: 'Meeting' },
              { type: 'office', label: 'Office Hours' },
              { type: 'assembly', label: 'Assembly' },
              { type: 'observation', label: 'Observation' },
              { type: 'admin', label: 'Administrative' }
            ].map((item) => (
              <div key={item.type} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded border ${getTypeColor(item.type)}`}></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default TimetablePage;