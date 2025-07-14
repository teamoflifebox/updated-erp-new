import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  User,
  GraduationCap,
  Calendar,
  MapPin,
  Hash
} from 'lucide-react';

const StudentManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    rollNumber: '',
    address: ''
  });

  const canManageStudents = ['hod', 'principal', 'director'].includes(user?.role || '');

  // Updated mock students with actual names and departments
  const mockStudents = [
    {
      id: '1',
      name: 'Sridhar',
      email: 'sridhar@oxford.edu',
      phone: '+91 9876543210',
      department: 'Computer Science Engineering with AI',
      year: '1st Year',
      rollNumber: 'CS2023001',
      address: '123 Main St, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 87,
      cgpa: 8.5
    },
    {
      id: '2',
      name: 'Sai',
      email: 'sai@oxford.edu',
      phone: '+91 9876543211',
      department: 'Artificial Intelligence & Machine Learning',
      year: '1st Year',
      rollNumber: 'AI2023002',
      address: '456 Oak Ave, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 92,
      cgpa: 9.1
    },
    {
      id: '3',
      name: 'Santhosh',
      email: 'santhosh@oxford.edu',
      phone: '+91 9876543212',
      department: 'Computer Science Engineering',
      year: '1st Year',
      rollNumber: 'CS2023003',
      address: '789 Pine St, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 78,
      cgpa: 7.8
    },
    {
      id: '4',
      name: 'Sandeep',
      email: 'sandeep@oxford.edu',
      phone: '+91 9876543213',
      department: 'Machine Learning Engineering',
      year: '1st Year',
      rollNumber: 'ML2023004',
      address: '321 Elm St, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 95,
      cgpa: 9.3
    },
    {
      id: '5',
      name: 'Rajkumar',
      email: 'rajkumar@oxford.edu',
      phone: '+91 9876543214',
      department: 'AI & Data Science',
      year: '1st Year',
      rollNumber: 'DS2023005',
      address: '654 Cedar Ave, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 89,
      cgpa: 8.7
    },
    {
      id: '6',
      name: 'Pradeep',
      email: 'pradeep@oxford.edu',
      phone: '+91 9876543215',
      department: 'Data Science & Analytics',
      year: '1st Year',
      rollNumber: 'DA2023006',
      address: '987 Birch St, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 91,
      cgpa: 8.9
    },
    {
      id: '7',
      name: 'Swamy',
      email: 'swamy@oxford.edu',
      phone: '+91 9876543216',
      department: 'Computer Science Engineering with AI',
      year: '1st Year',
      rollNumber: 'CS2023007',
      address: '147 Maple Dr, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 85,
      cgpa: 8.2
    },
    {
      id: '8',
      name: 'Ganasai',
      email: 'ganasai@oxford.edu',
      phone: '+91 9876543217',
      department: 'Artificial Intelligence & Machine Learning',
      year: '1st Year',
      rollNumber: 'AI2023008',
      address: '258 Willow Ln, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 88,
      cgpa: 8.6
    },
    {
      id: '9',
      name: 'Vasanth',
      email: 'vasanth@oxford.edu',
      phone: '+91 9876543218',
      department: 'Machine Learning Engineering',
      year: '1st Year',
      rollNumber: 'ML2023009',
      address: '369 Spruce Rd, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 93,
      cgpa: 9.0
    },
    {
      id: '10',
      name: 'Harsha',
      email: 'harsha@oxford.edu',
      phone: '+91 9876543219',
      department: 'AI & Data Science',
      year: '1st Year',
      rollNumber: 'DS2023010',
      address: '741 Poplar St, Hyderabad',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      attendance: 90,
      cgpa: 8.8
    }
  ];

  const departments = [
    'Computer Science Engineering with AI', 
    'Artificial Intelligence & Machine Learning', 
    'Computer Science Engineering',
    'Machine Learning Engineering', 
    'AI & Data Science',
    'Data Science & Analytics'
  ];

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddStudent = () => {
    console.log('Adding student:', newStudent);
    setShowAddModal(false);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      department: '',
      year: '',
      rollNumber: '',
      address: ''
    });
  };

  if (!canManageStudents) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage students.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Only show background for admin/HOD/principal/director
  const showAdminBg = canManageStudents;

  return (
    <Layout>
      {showAdminBg && (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557734864-c78b6dfef1b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHNjaG9vbCUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`space-y-6 relative z-10`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600">Manage student records and information</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {filteredStudents.length} of {mockStudents.length} students
              </span>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/70 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Hash className="w-3 h-3" />
                    <span>{student.rollNumber}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span className="truncate">{student.department}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{student.year}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Attendance:</span>
                    <span className={`ml-1 font-medium ${student.attendance >= 85 ? 'text-green-600' : student.attendance >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {student.attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">CGPA:</span>
                    <span className="ml-1 font-medium text-gray-900">{student.cgpa}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Student</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newStudent.department}
                    onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={newStudent.year}
                    onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter roll number (e.g., CS2023011)"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleAddStudent}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Student
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default StudentManagement;
