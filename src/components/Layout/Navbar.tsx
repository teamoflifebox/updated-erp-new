import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MapPin,
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Check if user can search students (faculty and above)
  const canSearchStudents = user?.role && ['faculty', 'hod', 'principal', 'director'].includes(user.role);

  // Mock student data for search
  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Arjun Sharma',
      rollNumber: 'CS21001',
      year: '3rd Year',
      department: 'Computer Science',
      email: 'arjun.sharma@college.edu',
      phone: '+91 9876543210',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      cgpa: 8.5,
      attendancePercentage: 87,
      feeStatus: {
        totalFee: 12000,
        paidAmount: 8000,
        pendingAmount: 4000,
        dueDate: '2024-02-15',
        lastPaymentDate: '2024-01-15'
      }
    },
    {
      id: '2',
      name: 'Priya Patel',
      rollNumber: 'AI21002',
      year: '2nd Year',
      department: 'AI & ML',
      email: 'priya.patel@college.edu',
      phone: '+91 9876543211',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      cgpa: 9.2,
      attendancePercentage: 92,
      feeStatus: {
        totalFee: 12000,
        paidAmount: 12000,
        pendingAmount: 0,
        dueDate: '2024-02-15',
        lastPaymentDate: '2024-01-15'
      }
    }
  ];

  // Handle click outside to close search results
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
    if (status.pendingAmount === 0) return 'text-green-600';
    if (status.pendingAmount > 0) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getFeeStatusIcon = (status: { pendingAmount: number }) => {
    if (status.pendingAmount === 0) return CheckCircle;
    if (status.pendingAmount > 0) return AlertCircle;
    return Clock;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/50 shadow-md">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  EduManage Pro
                </h1>
                <p className="text-xs text-neutral-500">Student Management System</p>
              </div>
            </div>
            
            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              {/* Enhanced Search Bar */}
              {canSearchStudents && (
                <div ref={searchRef} className="hidden md:flex items-center relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-96 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden z-50">
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((student) => (
                          <div
                            key={student.id}
                            onClick={() => handleStudentSelect(student)}
                            className="p-4 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=6366f1&color=fff`}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-neutral-900">{student.name}</h4>
                                  <span className="text-xs text-neutral-500">{student.rollNumber}</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-sm text-neutral-600">{student.year} • {student.department}</p>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      CGPA: {student.cgpa}
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
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
              
              {/* Notifications */}
              <button className="relative p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                    <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
                  </div>
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50"
                    >
                      <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-1 border-neutral-200" />
                      <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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

      {/* Student Details Modal */}
      <AnimatePresence>
        {showStudentModal && selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStudentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedStudent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=fff&color=6366f1`}
                      alt={selectedStudent.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                      <p className="text-white/80">{selectedStudent.rollNumber} • {selectedStudent.year}</p>
                      <p className="text-white/80">{selectedStudent.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStudentModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary-600" />
                    <span>Contact Information</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <Mail className="w-5 h-5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-600">Email</p>
                        <p className="font-medium text-neutral-900">{selectedStudent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                      <Phone className="w-5 h-5 text-neutral-500" />
                      <div>
                        <p className="text-sm text-neutral-600">Phone</p>
                        <p className="font-medium text-neutral-900">{selectedStudent.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <span>Academic Performance</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">CGPA</p>
                          <p className="text-2xl font-bold text-blue-900">{selectedStudent.cgpa}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Attendance</p>
                          <p className="text-2xl font-bold text-green-900">{selectedStudent.attendancePercentage}%</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Status */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                    <span>Fee Status</span>
                  </h3>
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-neutral-600">Total Fee</p>
                        <p className="text-xl font-bold text-neutral-900">₹{selectedStudent.feeStatus.totalFee.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-neutral-600">Paid Amount</p>
                        <p className="text-xl font-bold text-green-600">₹{selectedStudent.feeStatus.paidAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-neutral-600">Pending Amount</p>
                        <p className={`text-xl font-bold ${getFeeStatusColor(selectedStudent.feeStatus)}`}>
                          ₹{selectedStudent.feeStatus.pendingAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Due Date:</span>
                        <span className="font-medium text-neutral-900">{selectedStudent.feeStatus.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-neutral-600">Last Payment:</span>
                        <span className="font-medium text-neutral-900">{selectedStudent.feeStatus.lastPaymentDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;