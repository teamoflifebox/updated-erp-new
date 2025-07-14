import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, 
  Briefcase, 
  ChevronRight, 
  Code, 
  GraduationCap, 
  Hash, 
  Lock, 
  User, 
  Sparkles, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Heart 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    role: 'student',
    identifier: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const success = login(formData.identifier, formData.password, formData.role);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use password123 for all demo accounts.');
    }
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'student', identifier: 'CS2023001', name: 'Sridhar', icon: '🎓', dept: 'CS with AI', password: 'password123' },
    { role: 'student', identifier: 'AI2023002', name: 'Sai', icon: '🎓', dept: 'AI & ML', password: 'password123' },
    { role: 'student', identifier: 'CS2023003', name: 'Santhosh', icon: '🎓', dept: 'Computer Science', password: 'password123' },
    { role: 'student', identifier: 'ML2023004', name: 'Sandeep', icon: '🎓', dept: 'ML Engineering', password: 'password123' },
    { role: 'student', identifier: 'DS2023005', name: 'Rajkumar', icon: '🎓', dept: 'AI & Data Science', password: 'password123' },
    { role: 'faculty', identifier: 'FAC001', name: 'Ajay', icon: '👨‍🏫', dept: 'Computer Science', password: 'password123' },
    { role: 'faculty', identifier: 'FAC002', name: 'Bhanu', icon: '👨‍🏫', dept: 'Cybersecurity', password: 'password123' },
    { role: 'faculty', identifier: 'FAC003', name: 'Chakresh', icon: '👨‍🏫', dept: 'AIML', password: 'password123' },
    { role: 'faculty', identifier: 'FAC004', name: 'Harika', icon: '👩‍🏫', dept: 'Machine Learning', password: 'password123' },
    { role: 'hod', identifier: 'HOD001', name: 'Adbuth Singh', icon: '👨‍💼', dept: 'Computer Science', password: 'password123' },
    { role: 'principal', identifier: 'PRI001', name: 'Indhu', icon: '👩‍💼', dept: 'Administration', password: 'password123' },
  ];

  const fillDemoCredentials = (identifier: string, role: string, password: string = 'password123') => {
    setFormData({ ...formData, identifier, role, password });
  };

  // Testimonials for slider
  const testimonials = [
    {
      quote: "Oxford College's AI program gave me the perfect foundation for my career in machine learning.",
      author: "Sarah Johnson",
      role: "AI Engineer at Google",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "The hands-on approach and industry connections helped me land my dream job in tech.",
      author: "Michael Chen",
      role: "Data Scientist at Microsoft",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      quote: "The comprehensive curriculum prepared me to work on cutting-edge autonomous systems.",
      author: "Emily Davis",
      role: "ML Engineer at Tesla",
      avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  // Features for the about tab
  const features = [
    { title: "AI Research Labs", description: "State-of-the-art facilities for cutting-edge research", icon: Cpu },
    { title: "Industry Experts", description: "Learn from professionals with real-world experience", icon: Briefcase },
    { title: "Placement Success", description: "95% placement rate at top tech companies", icon: ChevronRight },
    { title: "Modern Curriculum", description: "Constantly updated to match industry demands", icon: Code }
  ];

  const getPlaceholderText = () => {
    return formData.role === 'student' 
      ? 'Enter your roll number (e.g., CS2023001)' 
      : 'Enter your job ID (e.g., FAC001)';
  };

  const getIdentifierIcon = () => {
    return formData.role === 'student' ? Hash : Briefcase;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#9333EA]/5 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-[#1E3A8A]/10 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] p-2 rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div> 
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] bg-clip-text text-transparent">Oxford College</span>
                <p className="text-xs text-gray-600 -mt-1">Technology Excellence</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#courses" className="text-gray-600 hover:text-blue-600 transition-colors">Courses</a>
              <a href="#facilities" className="text-gray-600 hover:text-blue-600 transition-colors">Facilities</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full -translate-y-48 translate-x-48 blur-3xl animate-pulse-gentle"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-success-200/30 to-warning-200/30 rounded-full translate-y-32 -translate-x-32 blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-accent-200/20 to-primary-200/20 rounded-full blur-xl"></div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 relative z-10">
        <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 items-center">
          {/* Left side - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card relative overflow-hidden w-full md:w-1/2 max-w-md"
          >
            {/* Card Background Pattern */}
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === 'login' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === 'about' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                About ERP
              </button>
            </div>

            {activeTab === 'login' ? (
              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="bg-gradient-primary p-4 rounded-2xl shadow-md">
                        <GraduationCap className="w-8 h-8 text-white animate-float" />
                      </div>
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent-500 animate-bounce-gentle" />
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gradient-hero mb-2">Oxford ERP</h1>
                  <p className="text-slate-600 mb-2">Technology Education Portal</p>
                  <div className="flex items-center justify-center gap-2">
                    <Code className="w-4 h-4 text-primary-500" />
                    <span className="text-xs text-slate-500">AI & Tech Learning</span>
                    <Cpu className="w-4 h-4 text-accent-500" />
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                      <User className="w-4 h-4" />
                      <span>Role</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value, identifier: '' })}
                      className="input"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="hod">HOD</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                      {React.createElement(getIdentifierIcon(), { className: "w-4 h-4" })}
                      <span>{formData.role === 'student' ? 'Roll Number' : 'Job ID'}</span>
                    </label>
                    <input
                      type="text"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="input"
                      placeholder={getPlaceholderText()}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input"
                      placeholder="Enter your password"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="notification-error"
                    >
                      <div className="w-5 h-5 bg-error-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full justify-center"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      'Sign In to ERP'
                    )}
                  </button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-8">
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary-500" />
                      <span>Demo Accounts (Password: password123)</span>
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {demoCredentials.map((cred) => (
                        <button
                          key={`${cred.role}-${cred.identifier}`}
                          onClick={() => fillDemoCredentials(cred.identifier, cred.role, cred.password)}
                          className="w-full text-left p-4 bg-gradient-to-r from-slate-50 to-[#1E3A8A]/5 hover:from-[#1E3A8A]/5 hover:to-[#9333EA]/5 rounded-lg transition-all duration-200 border border-slate-200 hover:border-[#1E3A8A]/30 hover:shadow-md group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{cred.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 group-hover:text-[#1E3A8A]">
                                  {cred.name}
                                </span>
                                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                                  {cred.identifier}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">{cred.dept}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gradient-hero mb-6 text-center">Oxford ERP Features</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#1E3A8A]/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <feature.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{feature.title}</h3>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <p className="text-sm text-blue-800 text-center">
                    Oxford ERP is a comprehensive educational resource planning system designed to streamline academic management.
                  </p>
                </div>
                
                <button
                  onClick={() => setActiveTab('login')}
                  className="w-full btn-primary justify-center"
                >
                  Sign In to Experience
                </button>
              </div>
            )}
          </motion.div>
          
          {/* Right side - Testimonials and Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full md:w-1/2 hidden md:block"
          >
            <div className="relative h-full">
              {/* Background image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/80 to-[#9333EA]/90 mix-blend-multiply"></div>
                <img 
                  src="https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="Campus" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="relative p-8 text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Welcome to Oxford College</h2>
                  <p className="text-blue-100 mb-8">
                    Leading the way in AI, Machine Learning, and Computer Science education
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <h3 className="text-2xl font-bold">95%</h3>
                      <p className="text-sm text-blue-100">Placement Rate</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <h3 className="text-2xl font-bold">200+</h3>
                      <p className="text-sm text-blue-100">Industry Partners</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Slider */}
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Student Testimonials</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentSlide(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                        className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                      <button 
                        onClick={() => setCurrentSlide(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                        className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative overflow-hidden">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <img 
                        src={testimonials[currentSlide].avatar} 
                        alt={testimonials[currentSlide].author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/50"
                      />
                      <div>
                        <p className="text-sm italic mb-2">"{testimonials[currentSlide].quote}"</p>
                        <p className="text-sm font-medium">{testimonials[currentSlide].author}</p>
                        <p className="text-xs text-blue-200">{testimonials[currentSlide].role}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-md border-t border-slate-200/50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] p-2 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">Oxford College</span>
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-sm text-slate-600">123 Tech Valley, Oxford City</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-sm text-slate-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-[#9333EA]" />
                <span className="text-sm text-slate-600">info@oxfordcollege.edu</span>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-sm text-slate-600">Powered by <strong className="text-gradient">Lifebox NextGen</strong></p>
                <Heart className="w-4 h-4 text-error-500 animate-pulse-gentle" />
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <a href="#" className="text-slate-500 hover:text-[#1E3A8A] transition-colors">Privacy</a>
                <span className="text-slate-400">•</span>
                <a href="#" className="text-slate-500 hover:text-[#1E3A8A] transition-colors">Terms</a>
                <span className="text-slate-400">•</span>
                <a href="#" className="text-slate-500 hover:text-[#1E3A8A] transition-colors">Contact</a>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                © 2024 Oxford College. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;