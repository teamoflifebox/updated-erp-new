import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = login(formData.email, formData.password, formData.role);
    
    if (!success) {
      setError('Invalid credentials. Use password123 for all demo accounts.');
    }
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'student', email: 'john.student@oxford.edu', name: 'John Smith' },
    { role: 'faculty', email: 'sarah.faculty@oxford.edu', name: 'Dr. Sarah Johnson' },
    { role: 'hod', email: 'michael.hod@oxford.edu', name: 'Prof. Michael Brown' },
    { role: 'principal', email: 'emily.principal@oxford.edu', name: 'Dr. Emily Davis' },
    { role: 'director', email: 'robert.director@oxford.edu', name: 'Mr. Robert Wilson' },
  ];

  const fillDemoCredentials = (email: string, role: string) => {
    setFormData({ ...formData, email, role });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#9333EA]/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] p-3 rounded-full">
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
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] text-white py-3 px-4 rounded-lg font-medium hover:from-[#1E3A8A]/90 hover:to-[#9333EA]/90 focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts (Password: password123)</h3>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.role}
                    onClick={() => fillDemoCredentials(cred.email, cred.role)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-[#1E3A8A]/5 rounded-lg transition-colors duration-200 border border-transparent hover:border-[#1E3A8A]/10"
                  >
                    <span className="font-medium capitalize">{cred.role}:</span> {cred.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>Powered by <strong>Lifebox NextGen Pvt Ltd</strong></p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-[#1E3A8A] transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1E3A8A] transition-colors">Terms</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1E3A8A] transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;