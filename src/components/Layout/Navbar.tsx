import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  year: string;
  department: string;
  email: string;
  phone: string;
  avatar?: string;
  cgpa: number;
  attendancePercentage: number;
  feeStatus: {
    totalFee: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: string;
    lastPaymentDate: string;
  };
}

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const canSearchStudents = user?.role && ['faculty', 'hod', 'principal', 'director'].includes(user.role);

  const mockStudents: Student[] = [/* mock data omitted for brevity */];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = mockStudents.filter(student =>
        student.name.toLowerCase().includes(term.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(term.toLowerCase()) ||
        student.department.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const getFeeStatusColor = (status: { pendingAmount: number }) => {
    if (status.pendingAmount === 0) return 'text-green-400';
    if (status.pendingAmount > 0) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-lg border-b border-slate-700 shadow-xl">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#9333EA] p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] bg-clip-text text-transparent">
                Oxford College
              </h1>
              <p className="text-xs text-slate-400">Student Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {canSearchStudents && (
              <div ref={searchRef} className="hidden md:flex items-center relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-96 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((student) => (
                        <div
                          key={student.id}
                          onClick={() => handleStudentSelect(student)}
                          className="p-4 hover:bg-slate-700/80 cursor-pointer border-b border-slate-700 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366f1&color=fff`}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{student.name}</h4>
                                <span className="text-xs text-slate-400">{student.rollNumber}</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-slate-400">{student.year} • {student.department}</p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                                    CGPA: {student.cgpa}
                                  </span>
                                  <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">
                                    {student.attendancePercentage}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notification icon - navigates to NotificationsPage */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-50"
                  >
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-1 border-slate-700" />
                  <button
                   onClick={() => {
                     logout();
                    navigate('/');
                    }}
                     className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50"
                    >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                    </button>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
