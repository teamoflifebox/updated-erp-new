import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const canEdit = user?.role !== 'student';

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setIsEditing(false);
  };

  // Mock additional profile data based on role
  const getAdditionalInfo = () => {
    switch (user?.role) {
      case 'student':
        return {
          rollNumber: 'CS2021001',
          year: '3rd Year',
          semester: '6th Semester',
          cgpa: '8.7',
          attendance: '87%',
          subjects: ['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'],
          achievements: ['Dean\'s List 2023', 'Best Project Award', 'Coding Competition Winner']
        };
      case 'faculty':
        return {
          employeeId: 'FAC001',
          designation: 'Assistant Professor',
          qualification: 'Ph.D. Computer Science',
          experience: '8 years',
          subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
          publications: ['Research Paper on AI', 'Machine Learning Applications', 'Database Optimization']
        };
      case 'hod':
        return {
          employeeId: 'HOD001',
          designation: 'Head of Department',
          qualification: 'Ph.D. Computer Engineering',
          experience: '15 years',
          department: 'Computer Science',
          facultyCount: '25',
          studentCount: '450'
        };
      default:
        return {
          employeeId: 'ADM001',
          designation: user?.role === 'principal' ? 'Principal' : 'Director',
          qualification: 'Ph.D. Education Management',
          experience: '20+ years',
          departments: '12',
          totalFaculty: '156',
          totalStudents: '2847'
        };
    }
  };

  const additionalInfo = getAdditionalInfo();

  return (
    <Layout>
      {/* Background Image Section - For student and faculty */}
      {user?.role === 'student' && (
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div className="absolute inset-0 bg-black/50"></div>
          <img
            src="https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Student Background"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {user?.role === 'faculty' && (
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div className="absolute inset-0 bg-black/40"></div>
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
            alt="Faculty Background"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {user?.role === 'admin' || user?.role === 'hod' || user?.role === 'principal' ? (
         <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div className="absolute inset-0 bg-black/20"></div>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
            alt="Administration Background"
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Profile</h1>
            <p className="text-gray-100">Manage your personal information and settings</p>
          </div>
          {canEdit && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#9333EA] text-white rounded-lg hover:bg-[#7e22ce] transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#9333EA] text-white rounded-lg hover:bg-[#7e22ce] transition-colors duration-200"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-[#9333EA] to-[#6B21A8] p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={user?.avatar || `https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`}
                      alt={user?.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-100/80"
                    />
                    {canEdit && (
                      <button className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full shadow-lg hover:bg-gray-200 transition-colors">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4">{user?.name}</h3>
                  <p className="text-purple-100 capitalize">{user?.role}</p>
                  <p className="text-purple-200">{user?.department}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{user?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Joined {user?.joinDate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {user?.role === 'student' && (
              <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">CGPA</span>
                    <span className="font-semibold text-gray-800">{additionalInfo.cgpa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance</span>
                    <span className="font-semibold text-gray-800">{additionalInfo.attendance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-semibold text-gray-800">{additionalInfo.year}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </label>
                  {isEditing && canEdit ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300/70 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-gray-50/70"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </label>
                  {isEditing && canEdit ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300/70 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-gray-50/70"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{user?.email}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </label>
                  {isEditing && canEdit ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300/70 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-gray-50/70"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{user?.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{user?.role === 'student' ? 'Roll Number' : 'Employee ID'}</span>
                  </label>
                  <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">
                    {user?.role === 'student' ? additionalInfo.rollNumber : additionalInfo.employeeId}
                  </p>
                </div>
              </div>

              {(isEditing && canEdit) && (
                <div className="mt-6">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Address</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300/70 rounded-lg focus:ring-2 focus:ring-[#9333EA] focus:border-transparent bg-gray-50/70"
                    placeholder="Enter your address..."
                  />
                </div>
              )}
            </div>

            {/* Role-specific Information */}
            <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {user?.role === 'student' ? 'Academic Information' : 'Professional Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.role === 'student' ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Year & Semester</label>
                      <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">
                        {additionalInfo.year} - {additionalInfo.semester}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
                      <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{user?.department}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Designation</label>
                      <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{additionalInfo.designation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Qualification</label>
                      <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{additionalInfo.qualification}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Experience</label>
                      <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{additionalInfo.experience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
                      <p className="text-gray-800 bg-gray-50/70 px-4 py-2 rounded-lg">{user?.department}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Subjects/Publications/Achievements */}
            <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                {user?.role === 'student' ? (
                  <>
                    <BookOpen className="w-5 h-5" />
                    <span>Current Subjects</span>
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    <span>{user?.role === 'faculty' ? 'Teaching Subjects' : 'Responsibilities'}</span>
                  </>
                )}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {(additionalInfo.subjects || additionalInfo.publications || []).map((item: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-[#9333EA]/10 text-[#9333EA] rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements for students */}
            {user?.role === 'student' && additionalInfo.achievements && (
              <div className="bg-gray-100/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </h3>
                
                <div className="space-y-3">
                  {additionalInfo.achievements.map((achievement: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50/70 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-800">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!canEdit && (
              <div className="bg-blue-50/70 border border-blue-200/50 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Students can only view their profile information. Contact administration for any changes.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ProfilePage;
