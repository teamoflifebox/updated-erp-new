import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { Calendar, MapPin, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '9:00 AM', '10:00 AM', '11:15 AM', '12:15 PM',
  '2:00 PM', '3:00 PM', '4:15 PM', '5:15 PM'
];

const colors = {
  lecture: 'bg-stone-50 border-stone-200',
  lab: 'bg-stone-50 border-stone-200',
  break: 'bg-stone-100 border-stone-300',
  free: 'bg-stone-50 border-stone-200',
  currentDay: 'bg-stone-400 text-stone-800',
  inactiveDay: 'bg-stone-200 text-stone-700 hover:bg-stone-300',
  timeHeader: 'bg-stone-300 text-stone-800',
  cardBg: 'bg-stone-50/90',
  cardBorder: 'border-stone-200',
  textPrimary: 'text-stone-800',
  textSecondary: 'text-stone-600',
  accent: 'bg-stone-400'
};

// Example: Faculty teaches Data Structures to CS-301 and Algorithms to CS-302
const facultyAssignments = [
  { day: 'Mon', slot: 0, subject: 'Data Structures', section: 'CS-301', room: 'A-101' },
  { day: 'Mon', slot: 4, subject: 'Data Structures', section: 'CS-301', room: 'A-101' },
  { day: 'Tue', slot: 1, subject: 'Algorithms', section: 'CS-302', room: 'B-201' },
  { day: 'Thu', slot: 6, subject: 'Algorithms', section: 'CS-302', room: 'B-201' },
  { day: 'Fri', slot: 2, subject: 'Data Structures', section: 'CS-301', room: 'A-101' },
  // ...add more as needed
];

// For students, reuse your original data:
const timetableData = {
  Mon: ['Data Structures', 'Mathematics', 'DS Lab', 'Lunch Break', 'Database Systems', 'Software Eng', 'Free', 'Study Hall'],
  Tue: ['Algorithms', 'Computer Networks', 'DB Lab', 'Lunch Break', 'Operating Systems', 'Web Dev', 'Project', 'Free'],
  Wed: ['Discrete Math', 'Comp Architecture', 'OS Lab', 'Lunch Break', 'AI Fundamentals', 'Elective', 'Tutorial', 'Free'],
  Thu: ['Theory of Comp', 'Data Structures', 'AI Lab', 'Lunch Break', 'Software Eng', 'Seminar', 'Free', 'Study Hall'],
  Fri: ['Mathematics', 'Database Systems', 'Web Lab', 'Lunch Break', 'Computer Networks', 'Workshop', 'Free', 'Meeting'],
  Sat: ['Special Topic', 'Project Work', 'Project Work', 'Lunch Break', 'Elective', 'Sports', 'Free', 'Free']
};

const roomData = {
  Mon: ['A-101', 'B-201', 'Lab-1', '', 'A-102', 'B-202', '', 'Library'],
  Tue: ['A-103', 'B-203', 'Lab-2', '', 'A-104', 'Lab-3', 'A-101', ''],
  Wed: ['C-101', 'B-204', 'Lab-4', '', 'A-105', 'Varies', 'Library', ''],
  Thu: ['D-101', 'A-101', 'Lab-5', '', 'B-202', 'Auditorium', '', 'Library'],
  Fri: ['B-201', 'A-102', 'Lab-3', '', 'B-203', 'Seminar Hall', '', 'Offices'],
  Sat: ['A-106', 'Project Lab', 'Project Lab', '', 'Varies', 'Sports Complex', '', '']
};

const getTypeStyle = (subject: string) => {
  if (subject.includes('Lab')) return 'border-l-4 border-stone-400';
  if (subject.includes('Break')) return 'italic text-stone-500';
  return '';
};

// ----------------- ADMIN MEETINGS DATA (for principal/admin) -----------------
const adminMeetings = [
  {
    day: 'Mon',
    time: '10:00 AM',
    title: 'Staff Meeting',
    participants: 'All Faculty',
    location: 'Conference Room 1'
  },
  {
    day: 'Tue',
    time: '2:00 PM',
    title: 'Parent-Teacher Meet',
    participants: 'Parents, Faculty',
    location: 'Auditorium'
  },
  {
    day: 'Wed',
    time: '11:15 AM',
    title: 'Student Council',
    participants: 'Council Members',
    location: 'Principal Office'
  },
  {
    day: 'Thu',
    time: '3:00 PM',
    title: 'Department Review',
    participants: 'HODs',
    location: 'Conference Room 2'
  },
  {
    day: 'Fri',
    time: '12:15 PM',
    title: 'Guest Lecture',
    participants: 'All Students',
    location: 'Seminar Hall'
  },
  {
    day: 'Sat',
    time: '9:00 AM',
    title: 'Campus Inspection',
    participants: 'Admin Staff',
    location: 'Campus'
  }
];

// ----------------- MAIN COMPONENT -----------------
const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const isFaculty = user?.role === 'faculty';
  const isAdmin = user?.role === 'principal' || user?.role === 'admin';

  const handlePrint = () => {
    const printContents = document.getElementById('weekly-timetable');
    if (!printContents) return;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents.outerHTML;
    window.print();
    document.body.innerHTML = originalContents;
  };

  // Faculty Timetable Matrix (week x slots)
  const facultyMatrix = days.map(day =>
    timeSlots.map((_, slotIdx) =>
      facultyAssignments.find(a => a.day === day && a.slot === slotIdx) || null
    )
  );

  // ----------------- ADMIN VIEWS -----------------
  const renderAdminDayView = () => {
    const dayName = days[selectedDay];
    const meetings = adminMeetings.filter(m => m.day === dayName);
    return (
      <div className={`${colors.cardBg} rounded-lg shadow-sm overflow-hidden border ${colors.cardBorder} backdrop-blur-sm`}>
        <div className={`p-3 ${colors.timeHeader} font-medium`}>
          {fullDays[selectedDay]}'s Meetings & Events
        </div>
        {meetings.length === 0 ? (
          <div className="p-6 text-stone-500 italic">No meetings or events scheduled for this day.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={colors.inactiveDay}>
                <th className="p-3 text-left w-24 font-medium">Time</th>
                <th className="p-3 text-left font-medium">Title</th>
                <th className="p-3 text-left font-medium">Participants</th>
                <th className="p-3 text-left w-32 font-medium">Location</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting, idx) => (
                <tr key={meeting.time + idx} className={`border-t ${colors.cardBorder} hover:bg-stone-100`}>
                  <td className={`p-3 font-medium ${colors.textPrimary}`}>{meeting.time}</td>
                  <td className={`p-3 ${colors.textPrimary}`}>{meeting.title}</td>
                  <td className={`p-3 ${colors.textSecondary}`}>{meeting.participants}</td>
                  <td className={`p-3 ${colors.textSecondary}`}>
                    {meeting.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-stone-500" />
                        {meeting.location}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderAdminWeekView = () => (
    <div id="weekly-timetable" className={`${colors.cardBg} rounded-lg shadow-sm overflow-hidden border ${colors.cardBorder} backdrop-blur-sm`}>
      <div className={`p-3 ${colors.timeHeader} font-medium`}>
        Weekly Meetings & Events
      </div>
      <table className="w-full">
        <thead>
          <tr className={colors.inactiveDay}>
            {days.map((day, idx) => (
              <th key={day} className="p-3 text-center font-medium">{fullDays[idx]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map((day, idx) => {
              const meetings = adminMeetings.filter(m => m.day === day);
              return (
                <td key={day} className="align-top p-2 border-l border-stone-200 min-w-[180px]">
                  {meetings.length === 0 ? (
                    <div className="text-stone-400 italic text-sm p-2">No meetings</div>
                  ) : (
                    meetings.map((meeting, mIdx) => (
                      <div key={mIdx} className="mb-2 p-2 bg-stone-100 rounded shadow-sm">
                        <div className="font-medium text-stone-800 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-stone-500" /> {meeting.time}
                        </div>
                        <div className="text-stone-700">{meeting.title}</div>
                        <div className="text-xs text-stone-500">{meeting.participants}</div>
                        <div className="flex items-center text-xs text-stone-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" /> {meeting.location}
                        </div>
                      </div>
                    ))
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );

  // ----------------- STUDENT & FACULTY VIEWS (UNCHANGED) -----------------
  const renderStudentDayView = () => (
    <div className={`${colors.cardBg} rounded-lg shadow-sm overflow-hidden border ${colors.cardBorder} backdrop-blur-sm`}>
      <div className={`p-3 ${colors.timeHeader} font-medium`}>
        {fullDays[selectedDay]}'s Schedule
      </div>
      <table className="w-full">
        <thead>
          <tr className={colors.inactiveDay}>
            <th className="p-3 text-left w-24 font-medium">Time</th>
            <th className="p-3 text-left font-medium">Class</th>
            <th className="p-3 text-left w-32 font-medium">Room</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, index) => {
            const dayName = days[selectedDay];
            const subject = timetableData[dayName as keyof typeof timetableData][index];
            const room = roomData[dayName as keyof typeof roomData][index];
            return (
              <tr key={time} className={`border-t ${colors.cardBorder} hover:bg-stone-100`}>
                <td className={`p-3 font-medium ${colors.textPrimary}`}>{time}</td>
                <td className={`p-3 ${getTypeStyle(subject)} ${colors.textPrimary}`}>{subject}</td>
                <td className={`p-3 ${colors.textSecondary}`}>
                  {room && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-stone-500" />
                      {room}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderStudentWeekView = () => (
    <div id="weekly-timetable" className={`${colors.cardBg} rounded-lg shadow-sm overflow-hidden border ${colors.cardBorder} backdrop-blur-sm`}>
      <div className={`p-3 ${colors.timeHeader} font-medium`}>
        Weekly Timetable • {user?.department || 'Computer Science'}
      </div>
      <table className="w-full">
        <thead>
          <tr className={colors.inactiveDay}>
            <th className="p-3 text-left w-24 font-medium">Time</th>
            {days.map(day => (
              <th key={day} className="p-3 text-center font-medium">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, timeIndex) => (
            <tr key={time} className={`border-t ${colors.cardBorder}`}>
              <td className={`p-3 font-medium ${colors.textPrimary}`}>{time}</td>
              {days.map(day => {
                const subject = timetableData[day as keyof typeof timetableData][timeIndex];
                const room = roomData[day as keyof typeof roomData][timeIndex];
                return (
                  <td key={`${day}-${time}`} className={`p-2 border-l ${colors.cardBorder}`}>
                    <div className={`p-2 rounded ${getTypeStyle(subject)} h-full ${colors.lecture}`}>
                      <div className={`font-medium text-sm ${colors.textPrimary}`}>{subject}</div>
                      {room && (
                        <div className={`text-xs ${colors.textSecondary} mt-1`}>{room}</div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFacultyDayView = () => (
    <div className={`${colors.cardBg} rounded-lg shadow-sm overflow-hidden border ${colors.cardBorder} backdrop-blur-sm`}>
      <div className={`p-3 ${colors.timeHeader} font-medium`}>
        {fullDays[selectedDay]}'s Teaching Schedule
      </div>
      <table className="w-full">
        <thead>
          <tr className={colors.inactiveDay}>
            <th className="p-3 text-left w-24 font-medium">Time</th>
            <th className="p-3 text-left font-medium">Subject</th>
            <th className="p-3 text-left font-medium">Section</th>
            <th className="p-3 text-left w-32 font-medium">Room</th>
          </tr>
        </thead>
        <tbody>
          {facultyMatrix[selectedDay].map((slot, idx) => (
            <tr key={timeSlots[idx]} className={`border-t ${colors.cardBorder} hover:bg-stone-100`}>
              <td className={`p-3 font-medium ${colors.textPrimary}`}>{timeSlots[idx]}</td>
              <td className={`p-3 ${colors.textPrimary}`}>{slot ? slot.subject : <span className="text-stone-400">Free</span>}</td>
              <td className={`p-3 ${colors.textSecondary}`}>{slot ? slot.section : '-'}</td>
              <td className={`p-3 ${colors.textSecondary}`}>
                {slot && slot.room ? (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-stone-500" />
                    {slot.room}
                  </div>
                ) : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFacultyWeekView = () => (
    <div id="weekly-timetable" className={`${colors.cardBg} rounded-lg shadow-sm overflow-hidden border ${colors.cardBorder} backdrop-blur-sm`}>
      <div className={`p-3 ${colors.timeHeader} font-medium`}>
        Weekly Teaching Schedule
      </div>
      <table className="w-full">
        <thead>
          <tr className={colors.inactiveDay}>
            <th className="p-3 text-left w-24 font-medium">Time</th>
            {days.map(day => (
              <th key={day} className="p-3 text-center font-medium">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, slotIdx) => (
            <tr key={time} className={`border-t ${colors.cardBorder}`}>
              <td className={`p-3 font-medium ${colors.textPrimary}`}>{time}</td>
              {days.map((day, dayIdx) => {
                const slot = facultyMatrix[dayIdx][slotIdx];
                return (
                  <td key={day + time} className={`p-2 border-l ${colors.cardBorder}`}>
                    {slot ? (
                      <div className={`p-2 rounded h-full ${colors.lecture}`}>
                        <div className="font-medium text-sm">{slot.subject}</div>
                        <div className="text-xs text-stone-500 mt-1">Section: {slot.section}</div>
                        <div className="text-xs text-stone-500">{slot.room}</div>
                      </div>
                    ) : (
                      <div className="text-stone-300 text-xs text-center">Free</div>
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

  // ----------------- MAIN RENDER -----------------
  return (
    <Layout>
      {/* Background with subtle overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-stone-100/30"></div>
        <img
          src="https://t3.ftcdn.net/jpg/04/46/95/98/240_F_446959837_ud38y0tq3BLXku5g72xfD4JT087Cz5R7.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div>
            <h1 className={`text-xl font-semibold ${colors.textPrimary}`}>
              {isAdmin
                ? 'Principal Meeting Schedule'
                : isFaculty
                ? 'Faculty Timetable'
                : 'Academic Timetable'}
            </h1>
            <p className={`${colors.textSecondary} text-sm`}>
              {isAdmin
                ? (viewMode === 'day'
                    ? fullDays[selectedDay] + " (Meetings & Events)"
                    : "Weekly Meetings & Events")
                : viewMode === 'day'
                ? fullDays[selectedDay] + (isFaculty ? " (Your Classes)" : "")
                : isFaculty ? 'Weekly Teaching Overview' : 'Weekly Overview'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-stone-200 rounded-md p-1">
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'day' ? `${colors.accent} ${colors.textPrimary}` : `${colors.textSecondary} hover:${colors.textPrimary}`}`}
              >
                Day View
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded text-sm ${viewMode === 'week' ? `${colors.accent} ${colors.textPrimary}` : `${colors.textSecondary} hover:${colors.textPrimary}`}`}
              >
                Week View
              </button>
            </div>
            {viewMode === 'week' && (
              <button 
                onClick={handlePrint}
                className={`flex items-center gap-2 px-3 py-1 ${colors.accent} ${colors.textPrimary} rounded text-sm hover:bg-stone-500`}
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            )}
          </div>
        </div>

        {isAdmin ? (
          viewMode === 'day' ? (
            <>
              {/* Day selector */}
              <div className="flex overflow-x-auto pb-2 mb-4 gap-1">
                {days.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(index)}
                    className={`px-4 py-2 rounded-md text-sm font-medium min-w-[70px] transition-colors ${
                      selectedDay === index 
                        ? `${colors.currentDay}` 
                        : `${colors.inactiveDay}`
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {renderAdminDayView()}
              {/* Day navigation */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setSelectedDay(prev => prev > 0 ? prev - 1 : days.length - 1)}
                  className={`flex items-center gap-2 px-4 py-2 ${colors.accent} ${colors.textPrimary} rounded-md hover:bg-stone-500`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Day
                </button>
                <button
                  onClick={() => setSelectedDay(prev => prev < days.length - 1 ? prev + 1 : 0)}
                  className={`flex items-center gap-2 px-4 py-2 ${colors.accent} ${colors.textPrimary} rounded-md hover:bg-stone-500`}
                >
                  Next Day
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              {renderAdminWeekView()}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handlePrint}
                  className={`flex items-center gap-2 px-4 py-2 ${colors.accent} ${colors.textPrimary} rounded-md hover:bg-stone-500`}
                >
                  <Printer className="w-4 h-4" />
                  Print Weekly Meetings
                </button>
              </div>
            </>
          )
        ) : viewMode === 'day' ? (
          <>
            {/* Day selector */}
            <div className="flex overflow-x-auto pb-2 mb-4 gap-1">
              {days.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={`px-4 py-2 rounded-md text-sm font-medium min-w-[70px] transition-colors ${
                    selectedDay === index 
                      ? `${colors.currentDay}` 
                      : `${colors.inactiveDay}`
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {isFaculty ? renderFacultyDayView() : renderStudentDayView()}
            {/* Day navigation */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setSelectedDay(prev => prev > 0 ? prev - 1 : days.length - 1)}
                className={`flex items-center gap-2 px-4 py-2 ${colors.accent} ${colors.textPrimary} rounded-md hover:bg-stone-500`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Day
              </button>
              <button
                onClick={() => setSelectedDay(prev => prev < days.length - 1 ? prev + 1 : 0)}
                className={`flex items-center gap-2 px-4 py-2 ${colors.accent} ${colors.textPrimary} rounded-md hover:bg-stone-500`}
              >
                Next Day
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            {isFaculty ? renderFacultyWeekView() : renderStudentWeekView()}
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handlePrint}
                className={`flex items-center gap-2 px-4 py-2 ${colors.accent} ${colors.textPrimary} rounded-md hover:bg-stone-500`}
              >
                <Printer className="w-4 h-4" />
                Print Weekly Timetable
              </button>
            </div>
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default TimetablePage;
