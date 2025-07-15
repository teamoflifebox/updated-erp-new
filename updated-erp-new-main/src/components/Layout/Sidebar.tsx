import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, User, Calendar, BookOpen, Users, CreditCard, Bell, BarChart3,
  Settings, FileText, GraduationCap, Building2, MessageCircle,
  Clock, TrendingUp, ChevronRight, Menu, Layers,
  Paperclip
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
      { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
      { id: 'timetable', label: 'Timetable', icon: Clock, path: '/timetable' },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          { id: 'attendance', label: 'Attendance', icon: Calendar, path: '/attendance' },
          { id: 'marks', label: 'Marks', icon: BookOpen, path: '/marks' },
          { id: 'fees', label: 'Fees', icon: CreditCard, path: '/fees' },
          { id: 'documents', label : 'Documents', icon: Paperclip , path:'/documents'},
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      
      case 'faculty':
        return [
          ...baseItems,
          { id: 'attendance', label: 'Mark Attendance', icon: Calendar, path: '/attendance' },
          { id: 'marks', label: 'Upload Marks', icon: BookOpen, path: '/marks' },
          { id: 'students', label: 'My Students', icon: Users, path: '/students' },
          { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
          { id: 'whatsapp', label: 'WhatsApp Center', icon: MessageCircle, path: '/whatsapp' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      
      case 'hod':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: GraduationCap, path: '/students' },
          { id: 'faculty', label: 'Faculty', icon: Users, path: '/faculty' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
          { id: 'real-time-analytics', label: 'Real-Time Analytics', icon: TrendingUp, path: '/real-time-analytics', isNew: true },
          { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
          { id: 'whatsapp', label: 'WhatsApp Center', icon: MessageCircle, path: '/whatsapp' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      
      case 'principal':
      case 'director':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: GraduationCap, path: '/students' },
          { id: 'faculty', label: 'Faculty', icon: Users, path: '/faculty' },
          { id: 'fees', label: 'Fee Management', icon: CreditCard, path: '/fees' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
          { id: 'real-time-analytics', label: 'Real-Time Analytics', icon: TrendingUp, path: '/real-time-analytics', isNew: true },
          { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
          { id: 'whatsapp', label: 'WhatsApp Center', icon: MessageCircle, path: '/whatsapp' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="relative">
      <div 
        className={`transition-all duration-300 ${isExpanded ? "w-64" : "w-20"} min-h-screen bg-slate-800 text-white fixed left-0 top-0 pt-16 z-40 shadow-xl flex flex-col`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Expand/Collapse Button */}
        <button 
          className={`absolute top-4 right-0 translate-x-1/2 bg-white text-slate-800 p-1.5 rounded-full shadow-md z-50 ${isExpanded ? "rotate-180" : ""} hover:bg-slate-100 transition-all`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Header */}
        <div className={`px-4 py-5 ${isExpanded ? "" : "flex justify-center"}`}>
          <div className={`flex items-center ${isExpanded ? "gap-3" : "justify-center"} mb-2`}>
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] p-2 rounded-lg shadow-md">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <span className={`font-medium text-white ${isExpanded ? "" : "hidden"}`}>Menu</span>
          </div>
          <div className={`h-px bg-slate-700 ${isExpanded ? "" : "hidden"} mt-2`}></div>
        </div>
        
        {/* Menu Items with scrollable area */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full text-left transition-all duration-200 group flex items-center px-3 py-2.5 rounded-lg ${
                    isActive ? 'bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  } ${isExpanded ? "justify-start" : "justify-center"} overflow-hidden`}
                >
                  <Icon className={`w-5 h-5 min-w-5 transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`} />
                  <span className={`font-medium truncate ${isExpanded ? "ml-3" : "hidden"}`}>{item.label}</span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className={`ml-auto flex items-center ${isExpanded ? "" : "hidden"}`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  
                  {/* New Feature Indicator */}
                  {item.isNew && (
                    <div className={`ml-auto ${isExpanded ? "" : "absolute -top-1 -right-1"}`}>
                      <span className="px-1.5 py-0.5 text-xs bg-[#9333EA] text-white rounded-full text-center">
                        {isExpanded ? "New" : ""}
                      </span>
                    </div>
                  )}
                  
                  {/* WhatsApp Indicator */}
                  {item.id === 'whatsapp' && (
                    <div className={`ml-auto w-2 h-2 bg-[#9333EA] rounded-full ${isExpanded ? "" : "absolute -top-1 -right-1"}`}></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card - Adjusted with proper spacing */}
        <div className={`p-3 bg-slate-700/50 backdrop-blur-sm rounded-lg border border-slate-600/30 mx-3 mb-4 mt-auto ${isExpanded ? "" : "hidden"}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Oxford ERP</p>
              <p className="text-xs text-slate-300">v2.1.0</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering minds with technology
          </p>
          
          <div className="mt-2 w-full bg-slate-600/50 rounded-full h-1">
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] h-1 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Status: Online</p>
        </div>
      </div>
      
      {/* Main content spacer */}
      <div className={`${isExpanded ? "w-64" : "w-20"} transition-all duration-300`}></div>
    </div>
  );
};

export default Sidebar;