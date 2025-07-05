import React from 'react';
import DashboardCard from '../Dashboard/DashboardCard';
import AttendanceChart from '../Dashboard/AttendanceChart';
import { Calendar, BookOpen, CreditCard, Bell, Award, TrendingUp } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] bg-clip-text text-transparent mb-2">Student Dashboard</h2>
        <p className="text-sage-600">Welcome back! Here's your academic journey at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Attendance Rate"
          value="87%"
          icon={Calendar}
          color="primary"
          trend={{ value: 5, isPositive: true }}
          subtitle="Above average"
        />
        <DashboardCard
          title="Current CGPA"
          value="8.5"
          icon={BookOpen}
          color="secondary"
          trend={{ value: 2, isPositive: true }}
          subtitle="Excellent performance"
        />
        <DashboardCard
          title="Fee Balance"
          value="$1,200"
          icon={CreditCard}
          color="accent"
          subtitle="Due: Feb 15, 2024"
        />
        <DashboardCard
          title="New Notifications"
          value="5"
          icon={Bell}
          color="forest"
          subtitle="2 urgent messages"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        
        <div className="card-nature p-6 animate-slide-up animate-delay-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary-600" />
            <span>Recent Activities</span>
          </h3>
          <div className="space-y-4">
            {[
              { 
                title: 'Mathematics Assignment submitted', 
                time: '2 hours ago', 
                type: 'success',
                icon: '✅'
              },
              { 
                title: 'Physics Lab report due tomorrow', 
                time: '1 day', 
                type: 'warning',
                icon: '⚠️'
              },
              { 
                title: 'Fee payment confirmation received', 
                time: '3 days ago', 
                type: 'success',
                icon: '💰'
              },
              { 
                title: 'New announcement from HOD', 
                time: '1 week ago', 
                type: 'info',
                icon: '📢'
              },
            ].map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#1E3A8A]/5 to-[#9333EA]/5 rounded-xl hover:from-[#1E3A8A]/10 hover:to-[#9333EA]/10 transition-all duration-300 border border-[#1E3A8A]/10"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-sage-600">{activity.time}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-[#1E3A8A]' :
                  activity.type === 'warning' ? 'bg-[#9333EA]' :
                  'bg-gray-500'
                } animate-bounce-gentle`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Progress Section */}
      <div className="card-nature p-6 animate-slide-up animate-delay-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <span>Academic Progress</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { subject: 'Data Structures', progress: 85, grade: 'A' },
            { subject: 'Algorithms', progress: 92, grade: 'A+' },
            { subject: 'Database Systems', progress: 78, grade: 'B+' },
          ].map((subject, index) => (
            <div key={index} className="bg-gradient-to-br from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  subject.grade === 'A+' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]' :
                  subject.grade === 'A' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                  'bg-[#9333EA]/10 text-[#9333EA]'
                }`}>
                  {subject.grade}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-sage-600">{subject.progress}% completed</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;