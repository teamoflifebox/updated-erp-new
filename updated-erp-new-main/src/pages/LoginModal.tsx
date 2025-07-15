import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const success = login(formData.identifier, formData.password, formData.role);

    if (!success) {
      setError('Invalid credentials. Use password123 for all demo accounts.');
    } else {
      onClose(); // ✅ Close modal if login is successful
    }

    setIsLoading(false);
  };

 const demoCredentials = [
  { role: 'student', identifier: 'CS2023001', name: 'Sridhar', dept: 'CS with AI' },
  { role: 'student', identifier: 'AI2023002', name: 'Sai', dept: 'AI & ML' },
  { role: 'student', identifier: 'CS2023003', name: 'Santhosh', dept: 'Computer Science' },
  { role: 'student', identifier: 'ML2023004', name: 'Sandeep', dept: 'ML Engineering' },
  { role: 'student', identifier: 'DS2023005', name: 'Rajkumar', dept: 'AI & Data Science' },
  { role: 'faculty', identifier: 'FAC001', name: 'Ajay', dept: 'Computer Science' },
  { role: 'faculty', identifier: 'FAC002', name: 'Bhanu', dept: 'Cybersecurity' },
  { role: 'faculty', identifier: 'FAC003', name: 'Chakresh', dept: 'AIML' },
  { role: 'faculty', identifier: 'FAC004', name: 'Harika', dept: 'Machine Learning' },
  { role: 'hod', identifier: 'HOD001', name: 'Adbuth Singh', dept: 'Computer Science' },
  { role: 'principal', identifier: 'PRI001', name: 'Indhu', dept: 'Administration' },
];

  const fillDemoCredentials = (identifier: string, role: string, password: string = 'password123') => {
    setFormData({ ...formData, identifier, role, password });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                &times;
              </button>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary-600 p-3 rounded-full">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Oxford ERP</h1>
                <p className="text-gray-600">Educational Management System</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    <span>Role</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="hod">HOD</option>
                    <option value="principal">Principal</option>
                    <option value="director">Director</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>{formData.role === 'student' ? 'Roll Number' : 'Job ID'}</span>

                  </label>
                  <input
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder={formData.role === 'student' ? 'Enter your roll number' : 'Enter your job ID'}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4" />
                    <span>Password</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <div className="flex items-center mt-2">
                 <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2"
                 />
                <label htmlFor="showPassword" className="text-sm text-gray-700">
                  Show Password
                </label>
</div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-8">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Demo Accounts (Password: password123)
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {demoCredentials
                      .filter(cred => cred.role === formData.role)
                      .map((cred) => (
                        <button
                          key={`${cred.role}-${cred.identifier}`}
                          onClick={() => fillDemoCredentials(cred.identifier, cred.role, 'password123')}
                          className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900">{cred.name}</span>
                              <span className="text-xs text-gray-500 ml-2">({cred.identifier})</span>
                            </div>
                            <span className="text-xs text-gray-600">{cred.dept}</span>
                          </div>
                        </button>
                      ))}
                  </div>
                  {demoCredentials.filter(cred => cred.role === formData.role).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No demo accounts available for this role
                    </p>
                  )}
                </div>
              </div>

              <footer className="mt-8 text-center text-sm text-gray-600">
                <p>Powered by <strong>Lifebox NextGen Pvt Ltd</strong></p>
                <div className="mt-2 space-x-4">
                  <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                  <span>|</span>
                  <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                  <span>|</span>
                  <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
                </div>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;

