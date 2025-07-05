import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  Building, 
  MapPin, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Download,
  LogIn,
  Code,
  Cpu,
  Database,
  Play,
  Activity,
  Calendar,
  MessageCircle,
  X
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<null | {
    name: string;
    duration: string;
    seats: number;
    icon: string;
  }>(null);

  const courses = [
    { name: 'Computer Science Engineering with AI', duration: '4 Years', seats: 120, icon: '🤖' },
    { name: 'Artificial Intelligence & Machine Learning', duration: '4 Years', seats: 100, icon: '🧠' },
    { name: 'Computer Science Engineering', duration: '4 Years', seats: 150, icon: '💻' },
    { name: 'Machine Learning Engineering', duration: '4 Years', seats: 80, icon: '⚙️' },
    { name: 'AI & Data Science', duration: '4 Years', seats: 90, icon: '📊' },
    { name: 'Data Science & Analytics', duration: '4 Years', seats: 70, icon: '📈' }
  ];

  const facilities = [
    { icon: Code, title: 'AI Research Labs', desc: 'State-of-the-art AI and ML research facilities' },
    { icon: BookOpen, title: 'Digital Library', desc: 'Extensive tech resources and e-learning platforms' },
    { icon: Users, title: 'Industry Experts', desc: 'Faculty with real-world tech industry experience' },
    { icon: Database, title: 'Computing Labs', desc: 'Advanced labs with latest hardware and software' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'AI Engineer at Google',
      text: 'Oxford College\'s AI program gave me the perfect foundation for my career in machine learning.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist at Microsoft',
      text: 'The hands-on approach and industry connections helped me land my dream job in tech.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'ML Engineer at Tesla',
      text: 'The comprehensive curriculum prepared me to work on cutting-edge autonomous systems.',
      rating: 5
    }
  ];

  const stats = [
    { label: 'Tech Placement Rate', value: '95%', icon: TrendingUp },
    { label: 'Average Package', value: '$85K', icon: Award },
    { label: 'Industry Partners', value: '200+', icon: Building },
    { label: 'Alumni Network', value: '10K+', icon: Users }
  ];

  // Recent Activities Data
  const recentActivities = [
    {
      id: 1,
      title: 'New AI Research Lab Inaugurated',
      description: 'State-of-the-art artificial intelligence research facility opened with latest GPU clusters',
      date: '2024-01-15',
      type: 'facility',
      icon: '🔬'
    },
    {
      id: 2,
      title: 'Industry Partnership with Google',
      description: 'Strategic collaboration for student internships and research projects',
      date: '2024-01-12',
      type: 'partnership',
      icon: '🤝'
    },
    {
      id: 3,
      title: 'Student Team Wins National Hackathon',
      description: 'Oxford College team secured first place in National AI Innovation Challenge',
      date: '2024-01-10',
      type: 'achievement',
      icon: '🏆'
    },
    {
      id: 4,
      title: 'New Course: Quantum Computing',
      description: 'Introduction to Quantum Computing course added to curriculum',
      date: '2024-01-08',
      type: 'academic',
      icon: '⚛️'
    },
    {
      id: 5,
      title: 'Faculty Research Published',
      description: 'Dr. Smith\'s research on neural networks published in Nature AI',
      date: '2024-01-05',
      type: 'research',
      icon: '📚'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#9333EA]/5">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-[#1E3A8A]/10 z-50 shadow-lg"
      >
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
              <a href="#about" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">About</a>
              <a href="#courses" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">Courses</a>
              <a href="#facilities" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">Facilities</a>
              <a href="#activities" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">Activities</a>
              <a href="#contact" className="text-gray-600 hover:text-[#1E3A8A] transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                <span>Prospectus</span>
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] text-white rounded-lg hover:from-[#1E3A8A]/90 hover:to-[#9333EA]/90 transition-all shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Video */}
      <section className="pt-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#1E3A8A]/20 to-[#9333EA]/20 rounded-full -translate-y-48 translate-x-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1E3A8A]/10 to-[#9333EA]/10 rounded-full translate-y-32 -translate-x-32 blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Cpu className="w-6 h-6 text-[#1E3A8A] animate-pulse" />
                <span className="text-[#1E3A8A] font-medium">AI & Technology Education</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Shape Your Future at
                <span className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] bg-clip-text text-transparent block">Oxford College</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Leading the way in AI, Machine Learning, and Computer Science education. Join our tech-focused community and become an industry leader.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] text-white rounded-lg hover:from-[#1E3A8A]/90 hover:to-[#9333EA]/90 transition-all shadow-lg transform hover:scale-105"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Access ERP Portal</span>
                </button>
                <button 
                  onClick={() => setShowVideo(true)}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-sm"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Intro Video</span>
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Oxford College Tech Campus"
                  className="rounded-3xl shadow-2xl object-cover h-full w-full"
                />
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl hover:bg-black/30 transition-colors group"
                >
                  <div className="bg-white/90 p-4 rounded-full group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-8 h-8 text-[#1E3A8A]" />
                  </div>
                </button>
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] p-3 rounded-xl">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">NAAC A+ Accredited</p>
                      <p className="text-sm text-gray-600">Top Tech Institution</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Oxford College Introduction"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}

      {/* Platform Information Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete ERP Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive Educational Resource Planning system integrates all aspects of academic management
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Student Management', desc: 'Complete student lifecycle management', icon: '👨‍🎓', features: ['Admissions', 'Academic Records', 'Progress Tracking'] },
              { title: 'Faculty Portal', desc: 'Comprehensive faculty management system', icon: '👨‍🏫', features: ['Course Management', 'Attendance', 'Grade Management'] },
              { title: 'Real-time Analytics', desc: 'Advanced reporting and analytics', icon: '📊', features: ['Performance Metrics', 'Attendance Reports', 'Financial Analytics'] },
              { title: 'WhatsApp Integration', desc: 'Automated parent communication', icon: '📱', features: ['Instant Notifications', 'Attendance Alerts', 'Fee Reminders'] }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-[#1E3A8A]/20"
              >
                <div className="text-4xl mb-4 transform transition-transform group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.desc}</p>
                <ul className="space-y-1">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section id="activities" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Activity className="w-6 h-6 text-[#1E3A8A]" />
              <span className="text-[#1E3A8A] font-medium">Latest Updates</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <p className="text-xl text-gray-600">Stay updated with the latest happenings at Oxford College</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-[#1E3A8A]/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.type === 'facility' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'partnership' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]' :
                        activity.type === 'achievement' ? 'bg-[#9333EA]/10 text-[#9333EA]' :
                        activity.type === 'academic' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Code className="w-6 h-6 text-[#1E3A8A]" />
              <span className="text-blue-600 font-medium">About Oxford</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology Education Pioneer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Since 1985, Oxford College has been at the forefront of technology education, 
              nurturing innovative minds and tech leaders for over three decades.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '35+', label: 'Years of Tech Excellence', icon: Code },
              { number: '10,000+', label: 'Tech Professionals Graduated', icon: Users },
              { number: '95%', label: 'Industry Placement Rate', icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-[#1E3A8A]/20 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Cpu className="w-6 h-6 text-[#1E3A8A]" />
              <span className="text-[#1E3A8A] font-medium">Tech Curriculum</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cutting-Edge Courses</h2>
            <p className="text-xl text-gray-600">Choose from our AI and technology-focused programs designed for the future</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-[#1E3A8A]/20"
              >
                <div className="text-4xl mb-4">{course.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.name}
                </h3>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Duration: {course.duration}</span>
                  <span>Seats: {course.seats}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCourse(course);
                  }}
                  className="w-full py-2 text-[#1E3A8A] border border-[#1E3A8A]/20 rounded-xl hover:bg-[#1E3A8A]/5 transition-colors"
                >
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] p-6 relative">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedCourse.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedCourse.name}</h3>
                  <p className="text-blue-100">Duration: {selectedCourse.duration} • Seats: {selectedCourse.seats}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Course Overview</h4>
                <p className="text-gray-700 leading-relaxed">
                  Our {selectedCourse.name} program is designed to equip students with cutting-edge skills and knowledge in the rapidly evolving field of technology. This comprehensive program combines theoretical foundations with practical applications, preparing graduates for successful careers in the tech industry.
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Highlights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 bg-[#1E3A8A]/5 rounded-lg">
                    <div className="p-2 bg-[#1E3A8A]/10 rounded-lg">
                      <Cpu className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Industry-Aligned Curriculum</h5>
                      <p className="text-sm text-gray-600">Regularly updated with input from tech leaders</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-[#9333EA]/5 rounded-lg">
                    <div className="p-2 bg-[#9333EA]/10 rounded-lg">
                      <Users className="w-5 h-5 text-[#9333EA]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Expert Faculty</h5>
                      <p className="text-sm text-gray-600">Learn from industry professionals and researchers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-[#1E3A8A]/5 rounded-lg">
                    <div className="p-2 bg-[#1E3A8A]/10 rounded-lg">
                      <Database className="w-5 h-5 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">State-of-the-art Labs</h5>
                      <p className="text-sm text-gray-600">Access to cutting-edge technology and equipment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-[#9333EA]/5 rounded-lg">
                    <div className="p-2 bg-[#9333EA]/10 rounded-lg">
                      <Award className="w-5 h-5 text-[#9333EA]" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Placement Assistance</h5>
                      <p className="text-sm text-gray-600">95% placement rate with top tech companies</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Course Structure</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">Year 1</h5>
                      <span className="text-sm text-[#1E3A8A]">Foundation</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Core programming, mathematics, and fundamental concepts</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">Year 2</h5>
                      <span className="text-sm text-[#1E3A8A]">Specialization</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Advanced algorithms, data structures, and domain-specific modules</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">Year 3</h5>
                      <span className="text-sm text-[#1E3A8A]">Application</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Industry projects, internships, and specialized electives</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">Year 4</h5>
                      <span className="text-sm text-[#1E3A8A]">Capstone</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Final year project, research, and career preparation</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Application Deadline:</span> June 30, 2024
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      // This would typically navigate to an application form
                      alert('Application form would open here');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] text-white rounded-lg hover:from-[#1E3A8A]/90 hover:to-[#9333EA]/90 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Facilities Section */}
      <section id="facilities" className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="w-6 h-6 text-[#1E3A8A]" />
              <span className="text-blue-600 font-medium">Tech Infrastructure</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">World-Class Facilities</h2>
            <p className="text-xl text-gray-600">Experience learning in our state-of-the-art tech campus</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#1E3A8A]/20"
              >
                <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <facility.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.title}</h3>
                <p className="text-gray-600">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Stats */}
      <section className="py-20 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Tech Career Excellence</h2>
            <p className="text-xl text-blue-100">Our graduates lead innovation at top tech companies worldwide</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-[#9333EA]" />
              <span className="text-[#1E3A8A] font-medium">Success Stories</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Tech Alumni Say</h2>
            <p className="text-xl text-gray-600">Voices from our technology success stories</p>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-600 mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div>
                <h4 className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
              </div>
            </motion.div>
            
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Cpu className="w-12 h-12 text-white mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Innovate?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join Oxford College and become part of the technology revolution
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-[#1E3A8A] rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              <LogIn className="w-5 h-5" />
              <span>Access ERP Portal</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Visit our tech campus or contact us for more information</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Address', info: '123 Tech Valley, Oxford City, State 12345' },
              { icon: Phone, title: 'Phone', info: '+1 (555) 123-4567' },
              { icon: Mail, title: 'Email', info: 'info@oxfordcollege.edu' }
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-[#1E3A8A]/20 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <contact.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-gray-600">{contact.info}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] p-2 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Oxford College</span>
            </div>
            <p className="text-gray-300 mb-6">Innovating minds, building futures since 1985</p>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm mb-2">
                Powered by <strong className="text-white">Lifebox NextGen Pvt Ltd</strong>
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;