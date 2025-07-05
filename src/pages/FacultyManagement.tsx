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
  Award,
  Briefcase
} from 'lucide-react';

const FacultyManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    jobId: ''
  });

  const canManageFaculty = ['principal', 'director'].includes(user?.role || '');

  // Updated mock faculty with actual names and departments
  const mockFaculty = [
    {
      id: '11',
      name: 'Ajay',
      email: 'ajay@oxford.edu',
      phone: '+91 9876543220',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: 'M.Tech Computer Science',
      experience: '5 years',
      jobId: 'FAC001',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      subjects: ['Data Structures', 'Algorithms', 'Programming'],
      rating: 4.8
    },
    {
      id: '12',
      name: 'Bhanu',
      email: 'bhanu@oxford.edu',
      phone: '+91 9876543221',
      department: 'Cybersecurity',
      designation: 'Associate Professor',
      qualification: 'Ph.D. Cybersecurity',
      experience: '8 years',
      jobId: 'FAC002',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      subjects: ['Network Security', 'Ethical Hacking', 'Cryptography'],
      rating: 4.9
    },
    {
      id: '13',
      name: 'Chakresh',
      email: 'chakresh@oxford.edu',
      phone: '+91 9876543222',
      department: 'AIML',
      designation: 'Assistant Professor',
      qualification: 'M.Tech AI & ML',
      experience: '4 years',
      jobId: 'FAC003',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      subjects: ['Machine Learning', 'Deep Learning', 'Neural Networks'],
      rating: 4.7
    },
    {
      id: '14',
      name: 'Harika',
      email: 'harika@oxford.edu',
      phone: '+91 9876543223',
      department: 'Machine Learning',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. Machine Learning',
      experience: '6 years',
      jobId: 'FAC004',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      subjects: ['ML Algorithms', 'Pattern Recognition', 'Computer Vision'],
      rating: 4.8
    },
    {
      id: '15',
      name: 'Sony',
      email: 'sony@oxford.edu',
      phone: '+91 9876543224',
      department: 'Data Science',
      designation: 'Associate Professor',
      qualification: 'Ph.D. Data Science',
      experience: '7 years',
      jobId: 'FAC005',
      avatar: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      subjects: ['Data Analytics', 'Big Data', 'Statistical Methods'],
      rating: 4.9
    },
    {
      id: '16',
      name: 'Bhanu Prasad',
      email: 'bhanuprasad@oxford.edu',
      phone: '+91 9876543225',
      department: 'AIDS',
      designation: 'Professor',
      qualification: 'Ph.D. Artificial Intelligence',
      experience: '10 years',
      jobId: 'FAC006',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      subjects: ['AI Systems', 'Intelligent Agents', 'Expert Systems'],
      rating: 4.9
    },
    {
      id: '17',
      name: 'Adbuth Singh',
      email: 'adbuth.singh@oxford.edu',
      phone: '+91 9876543226',
      department: 'Computer Science',
      designation: 'HOD',
      qualification: 'Ph.D. Computer Science',
      experience: '15 years',
      jobId: 'HOD001',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      subjects: ['Advanced Algorithms', 'Research Methodology'],
      rating: 4.9
    }
  ];

  const departments = ['Computer Science', 'Cybersecurity', 'AIML', 'Machine Learning', 'Data Science', 'AIDS'];

  const filteredFaculty = mockFaculty.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.jobId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || faculty.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddFaculty = () => {
    console.log('Adding faculty:', newFaculty);
    setShowAddModal(false);
    setNewFaculty({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      qualification: '',
      experience: '',
      jobId: ''
    });
  };

  if (!canManageFaculty && user?.role !== 'hod') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage faculty.</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
            <p className="text-gray-600">Manage faculty members and their information</p>
          </div>
          {canManageFaculty && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search faculty..."
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
                Showing {filteredFaculty.length} of {mockFaculty.length} faculty members
              </span>
            </div>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={faculty.avatar}
                  alt={faculty.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{faculty.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Briefcase className="w-3 h-3" />
                    <span>{faculty.jobId}</span>
                  </div>
                  <p className="text-sm text-gray-600">{faculty.designation}</p>
                </div>
                {canManageFaculty && (
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{faculty.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{faculty.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{faculty.department}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>{faculty.qualification}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{faculty.experience} experience</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Subjects:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {faculty.subjects.map((subject, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-900">{faculty.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 ${i < Math.floor(faculty.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ⭐
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Faculty Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Faculty</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter faculty name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job ID</label>
                  <input
                    type="text"
                    value={newFaculty.jobId}
                    onChange={(e) => setNewFaculty({ ...newFaculty, jobId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter job ID (e.g., FAC007)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newFaculty.phone}
                    onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newFaculty.department}
                    onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <select
                    value={newFaculty.designation}
                    onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Designation</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="HOD">HOD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={newFaculty.qualification}
                    onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter qualification"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleAddFaculty}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Faculty
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

export default FacultyManagement;