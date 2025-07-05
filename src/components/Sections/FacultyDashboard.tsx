import React from 'react';
import DashboardCard from '../Dashboard/DashboardCard';
import { Users, BookOpen, Calendar, BarChart3, Clock, CheckCircle } from 'lucide-react';

const FacultyDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] bg-clip-text text-transparent mb-2">Faculty Dashboard</h2>
        <p className="text-sage-600">Manage your classes and nurture student growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Students"
          value="120"
          icon={Users}
          color="primary"
          subtitle="Under your guidance"
        />
        <DashboardCard
          title="Classes Today"
          value="6"
          icon={Calendar}
          color="secondary"
          subtitle="Scheduled sessions"
        />
        <DashboardCard
          title="Assignments Pending"
          value="23"
          icon={BookOpen}
          color="accent"
          subtitle="Awaiting review"
        />
        <DashboardCard
          title="Average Performance"
          value="82%"
          icon={BarChart3}
          color="forest"
          trend={{ value: 3, isPositive: true }}
          subtitle="Class average"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-nature p-6 animate-slide-up animate-delay-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary-600" />
            <span>Today's Schedule</span>
          </h3>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', subject: 'Data Structures', class: 'CS-301', room: 'A-101', status: 'upcoming' },
              { time: '11:00 AM', subject: 'Algorithms', class: 'CS-302', room: 'A-102', status: 'current' },
              { time: '02:00 PM', subject: 'Database Systems', class: 'CS-401', room: 'B-201', status: 'upcoming' },
              { time: '04:00 PM', subject: 'Software Engineering', class: 'CS-402', room: 'B-202', status: 'upcoming' },
            ].map((schedule, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  schedule.status === 'current' 
                    ? 'bg-gradient-to-r from-[#1E3A8A]/5 to-[#9333EA]/5 border-[#1E3A8A]/20' 
                    : 'bg-gradient-to-r from-gray-50 to-[#1E3A8A]/5 border-gray-200'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">{schedule.subject}</p>
                  <p className="text-sm text-sage-600">{schedule.class} • Room {schedule.room}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    schedule.status === 'current' ? 'text-[#1E3A8A]' : 'text-gray-600'
                  }`}>
                    {schedule.time}
                  </span>
                  {schedule.status === 'current' && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-bounce-gentle"></div>
                      <span className="text-xs text-[#1E3A8A]">Now</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-nature p-6 animate-slide-up animate-delay-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-primary-600" />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Mark Attendance', color: 'bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E3A8A]/90 hover:to-[#3B82F6]/90', icon: '📋' },
              { title: 'Upload Marks', color: 'bg-gradient-to-r from-[#9333EA] to-[#C026D3] hover:from-[#9333EA]/90 hover:to-[#C026D3]/90', icon: '📊' },
              { title: 'Create Assignment', color: 'bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] hover:from-[#1E3A8A]/90 hover:to-[#9333EA]/90', icon: '📝' },
              { title: 'Send Notice', color: 'bg-gradient-to-r from-[#3B82F6] to-[#9333EA] hover:from-[#3B82F6]/90 hover:to-[#9333EA]/90', icon: '📢' },
            ].map((action, index) => (
              <button
                key={index}
                className={`p-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-nature ${action.color}`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm">{action.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Performance Overview */}
      <div className="card-nature p-6 animate-slide-up animate-delay-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <span>Student Performance Overview</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { subject: 'Data Structures', avgScore: 85, students: 40, trend: 'up' },
            { subject: 'Algorithms', avgScore: 78, students: 35, trend: 'up' },
            { subject: 'Database Systems', avgScore: 82, students: 38, trend: 'down' },
          ].map((subject, index) => (
            <div key={index} className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                <span className={`text-sm ${subject.trend === 'up' ? 'text-primary-600' : 'text-accent-600'}`}>
                  {subject.trend === 'up' ? '↗' : '↘'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-sage-600">Average Score:</span>
                  <span className="font-medium text-gray-900">{subject.avgScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-sage-600">Students:</span>
                  <span className="font-medium text-gray-900">{subject.students}</span>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${subject.avgScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;