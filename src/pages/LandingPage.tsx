import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, Users, Award, Calendar, MapPin, Phone, Mail, ExternalLink,
  Menu, X, Star, Building, GraduationCap, Trophy, ChevronRight, PlayCircle,
  Globe, BookOpen, Zap, Target, TrendingUp, Facebook, Instagram, Linkedin, Youtube, CheckCircle, LogIn,
  User, Lock, Eye, EyeOff, Clock
} from 'lucide-react';

interface UserData {
  name?: string;
  email?: string;
  [key: string]: any;
}

interface Course {
  name: string;
  code: string;
  icon: JSX.Element;
  duration: string;
}

interface Event {
  title: string;
  date: string;
  description: string;
  type: string;
}

interface Company {
  name: string;
  logo: string;
}

interface Faculty {
  name: string;
  subject: string;
  experience: string;
  image: string;
}

// Login Modal Component
const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { ...formData, userType: activeTab });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'student', label: 'Student' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'admin', label: 'Admin' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'student' | 'faculty' | 'admin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Login as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Don't have an account?{' '}
              <button className="text-orange-600 hover:text-orange-700 font-medium">
                Contact Admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Course Modal Component
const CourseModal: React.FC<{ isOpen: boolean; onClose: () => void; course: Course | null }> = ({ isOpen, onClose, course }) => {
  if (!isOpen || !course) return null;

  const getCourseDetails = (courseName: string) => {
    const courseDetails: { [key: string]: any } = {
      'Computer Science Engineering': {
        description: 'Computer Science Engineering focuses on the design and development of computer systems and computational processes. Students learn programming, software engineering, algorithms, data structures, and emerging technologies.',
        subjects: ['Programming Languages', 'Data Structures & Algorithms', 'Database Management', 'Software Engineering', 'Computer Networks', 'Artificial Intelligence', 'Machine Learning', 'Web Development'],
        careerProspects: ['Software Developer', 'Data Scientist', 'System Analyst', 'AI Engineer', 'Cybersecurity Specialist', 'Full Stack Developer', 'Mobile App Developer', 'DevOps Engineer'],
        facilities: ['Advanced Computer Labs', 'High-Performance Computing Center', 'Software Development Labs', 'AI & ML Research Center'],
        eligibilityRequirements: 'Pass in 10+2 with Physics, Chemistry, and Mathematics with minimum 60% marks',
        fees: '₹1,50,000 per year'
      },
      'Electronics & Communication': {
        description: 'Electronics & Communication Engineering deals with electronic devices, circuits, communication equipment, and systems. Students learn about signal processing, telecommunications, and electronic system design.',
        subjects: ['Electronic Circuits', 'Digital Signal Processing', 'Communication Systems', 'Microprocessors', 'VLSI Design', 'Antenna Theory', 'Wireless Communication', 'Embedded Systems'],
        careerProspects: ['Electronics Engineer', 'Communication Engineer', 'VLSI Engineer', 'RF Engineer', 'Embedded Systems Developer', 'Network Engineer', 'Hardware Designer', 'Telecom Specialist'],
        facilities: ['Electronics Labs', 'Communication Labs', 'VLSI Design Lab', 'Microwave Lab', 'Digital Signal Processing Lab'],
        eligibilityRequirements: 'Pass in 10+2 with Physics, Chemistry, and Mathematics with minimum 60% marks',
        fees: '₹1,40,000 per year'
      },
      'Electrical Engineering': {
        description: 'Electrical Engineering focuses on the study and application of electricity, electronics, and electromagnetism. Students learn about power systems, control systems, and electrical machinery.',
        subjects: ['Electrical Circuits', 'Power Systems', 'Control Systems', 'Electrical Machines', 'Power Electronics', 'Renewable Energy', 'High Voltage Engineering', 'Smart Grid Technology'],
        careerProspects: ['Electrical Engineer', 'Power Systems Engineer', 'Control Systems Engineer', 'Renewable Energy Engineer', 'Project Manager', 'Electrical Designer', 'Automation Engineer', 'Energy Consultant'],
        facilities: ['Electrical Machines Lab', 'Power Systems Lab', 'Control Systems Lab', 'High Voltage Lab', 'Renewable Energy Lab'],
        eligibilityRequirements: 'Pass in 10+2 with Physics, Chemistry, and Mathematics with minimum 60% marks',
        fees: '₹1,35,000 per year'
      },
      'Mechanical Engineering': {
        description: 'Mechanical Engineering involves the design, analysis, and manufacturing of mechanical systems. Students learn about thermodynamics, fluid mechanics, materials science, and manufacturing processes.',
        subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes', 'Heat Transfer', 'Automotive Engineering', 'Robotics', 'CAD/CAM'],
        careerProspects: ['Mechanical Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Automotive Engineer', 'Project Engineer', 'Quality Control Engineer', 'R&D Engineer', 'Production Manager'],
        facilities: ['Mechanical Workshop', 'CAD/CAM Lab', 'Fluid Mechanics Lab', 'Thermal Engineering Lab', 'Manufacturing Lab'],
        eligibilityRequirements: 'Pass in 10+2 with Physics, Chemistry, and Mathematics with minimum 60% marks',
        fees: '₹1,30,000 per year'
      },
      'Civil Engineering': {
        description: 'Civil Engineering focuses on the design, construction, and maintenance of infrastructure projects. Students learn about structural engineering, transportation, water resources, and environmental engineering.',
        subjects: ['Structural Engineering', 'Transportation Engineering', 'Water Resources Engineering', 'Environmental Engineering', 'Construction Management', 'Geotechnical Engineering', 'Surveying', 'Building Technology'],
        careerProspects: ['Civil Engineer', 'Structural Engineer', 'Transportation Engineer', 'Environmental Engineer', 'Project Manager', 'Construction Manager', 'Urban Planner', 'Site Engineer'],
        facilities: ['Structural Engineering Lab', 'Environmental Engineering Lab', 'Transportation Lab', 'Geotechnical Lab', 'Survey Lab'],
        eligibilityRequirements: 'Pass in 10+2 with Physics, Chemistry, and Mathematics with minimum 60% marks',
        fees: '₹1,25,000 per year'
      },
      'Information Technology': {
        description: 'Information Technology focuses on the application of computing technology to solve business and organizational problems. Students learn about software development, database management, and IT systems.',
        subjects: ['Programming', 'Database Management', 'Web Technologies', 'Network Security', 'System Analysis', 'Mobile Computing', 'Cloud Computing', 'IT Project Management'],
        careerProspects: ['IT Consultant', 'Systems Administrator', 'Web Developer', 'Database Administrator', 'Network Administrator', 'IT Manager', 'Software Tester', 'Business Analyst'],
        facilities: ['IT Labs', 'Network Lab', 'Database Lab', 'Web Development Lab', 'Mobile App Development Lab'],
        eligibilityRequirements: 'Pass in 10+2 with Physics, Chemistry, and Mathematics with minimum 60% marks',
        fees: '₹1,45,000 per year'
      }
    };

    return courseDetails[courseName] || {};
  };

  const details = getCourseDetails(course.name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 rounded-full p-3">
              <div className="text-orange-600">
                {course.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{course.name}</h2>
              <p className="text-gray-600">{course.code} • {course.duration}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Program Overview</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{details.description}</p>

              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Program Highlights
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                    Industry-aligned curriculum
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                    Hands-on practical training
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                    Expert faculty guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                    Modern lab facilities
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  Admission Requirements
                </h4>
                <p className="text-gray-700 mb-4">{details.eligibilityRequirements}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Fees: {details.fees}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Core Subjects</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {details.subjects?.map((subject: string, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                    {subject}
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Career Prospects</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {details.careerProspects?.map((career: string, index: number) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
                    {career}
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Facilities</h3>
              <div className="space-y-2 mb-6">
                {details.facilities?.map((facility: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <ChevronRight className="w-4 h-4 text-orange-600" />
                    {facility}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            <button className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
              Apply Now
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Registration Modal Component
const EventRegistrationModal: React.FC<{ isOpen: boolean; onClose: () => void; event: Event | null }> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Event Registration</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Completed!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in this event. This event has already been completed successfully.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-semibold text-gray-900 mb-3">{event.title}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                  {event.type}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mt-3 text-sm">{event.description}</p>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <p className="mb-2">Stay tuned for upcoming events!</p>
            <p>Follow our social media or check our events page for the latest updates.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Close
            </button>
            <button className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
              View More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showCourseModal, setShowCourseModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const galleryImages: string[] = [
    'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const courses: Course[] = [
    { name: 'Computer Science Engineering', code: 'CSE', icon: <BookOpen className="w-8 h-8" />, duration: '4 Years' },
    { name: 'Electronics & Communication', code: 'ECE', icon: <Zap className="w-8 h-8" />, duration: '4 Years' },
    { name: 'Electrical Engineering', code: 'EEE', icon: <Target className="w-8 h-8" />, duration: '4 Years' },
    { name: 'Mechanical Engineering', code: 'ME', icon: <Building className="w-8 h-8" />, duration: '4 Years' },
    { name: 'Civil Engineering', code: 'CIVIL', icon: <Trophy className="w-8 h-8" />, duration: '4 Years' },
    { name: 'Information Technology', code: 'IT', icon: <Globe className="w-8 h-8" />, duration: '4 Years' }
  ];

  const events: Event[] = [
    {
      title: 'Annual Tech Fest 2024',
      date: '15-17 March 2024',
      description: 'Join us for three days of innovation, competitions, and networking with industry leaders.',
      type: 'Festival'
    },
    {
      title: 'AI & Machine Learning Workshop',
      date: '22 March 2024',
      description: 'Hands-on workshop covering latest trends in artificial intelligence and machine learning.',
      type: 'Workshop'
    },
    {
      title: 'Industry Guest Lecture Series',
      date: '28 March 2024',
      description: 'Industry experts share insights on emerging technologies and career opportunities.',
      type: 'Lecture'
    },
    {
      title: 'Inter-College Hackathon',
      date: '5-6 April 2024',
      description: '36-hour coding challenge with exciting prizes and mentorship opportunities.',
      type: 'Competition'
    }
  ];

  const companies: Company[] = [
    { name: 'TCS', logo: 'https://logos-world.net/wp-content/uploads/2020/09/TCS-Logo.png' },
    { name: 'Infosys', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Infosys-Logo.png' },
    { name: 'Wipro', logo: 'https://logos-world.net/wp-content/uploads/2020/09/Wipro-Logo.png' },
    { name: 'Accenture', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Accenture-Logo.png' },
    { name: 'Cognizant', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Cognizant-Logo.png' },
    { name: 'HCL', logo: 'https://logos-world.net/wp-content/uploads/2020/09/HCL-Logo.png' },
    { name: 'Tech Mahindra', logo: 'https://logos-world.net/wp-content/uploads/2020/09/Tech-Mahindra-Logo.png' },
    { name: 'IBM', logo: 'https://logos-world.net/wp-content/uploads/2020/09/IBM-Logo.png' },
    { name: 'Microsoft', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Microsoft-Logo.png' },
    { name: 'Google', logo: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png' },
    { name: 'Amazon', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png' },
    { name: 'Capgemini', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Capgemini-Logo.png' }
  ];

  const faculty: Faculty[] = [
    {
      name: 'Dr. Sarah Johnson',
      subject: 'Computer Science',
      experience: '15+ Years',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Prof. Michael Chen',
      subject: 'Electronics Engineering',
      experience: '12+ Years',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Dr. Emily Rodriguez',
      subject: 'Mechanical Engineering',
      experience: '18+ Years',
      image: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Prof. David Kumar',
      subject: 'Civil Engineering',
      experience: '20+ Years',
      image: 'https://images.pexels.com/photos/3184341/pexels-photo-3184341.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogin = (type: string, data: UserData) => {
    setUserType(type);
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('');
    setUserData(null);
  };

  const handleCourseLearnMore = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleEventRegister = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Announcement Bar */}
      <div className="bg-orange-600 text-white py-2 px-4 text-center text-sm font-medium">
        <span className="flex items-center justify-center gap-2">
          <span className="animate-pulse">🚨</span>
          Admissions Open for 2024-25 | Application Deadline: April 30, 2024
          <span className="animate-pulse">🚨</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Oxford College of Engineering</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-orange-600 transition-colors">About</button>
              <button onClick={() => scrollToSection('courses')} className="text-gray-700 hover:text-orange-600 transition-colors">Courses</button>
              <button onClick={() => scrollToSection('events')} className="text-gray-700 hover:text-orange-600 transition-colors">Events</button>
              <button onClick={() => scrollToSection('placements')} className="text-gray-700 hover:text-orange-600 transition-colors">Placements</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-orange-600 transition-colors">Contact</button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors">About</button>
              <button onClick={() => scrollToSection('courses')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors">Courses</button>
              <button onClick={() => scrollToSection('events')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors">Events</button>
              <button onClick={() => scrollToSection('placements')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors">Placements</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors">Contact</button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img 
            src="https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Campus" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Oxford College of Engineering
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Igniting Innovation, Shaping Engineers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Apply Now
            </button>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Explore Programs
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Our College</h2>
            <p className="text-xl text-gray-600">Excellence in Engineering Education Since 1995</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                To provide world-class engineering education that combines theoretical knowledge with practical skills, 
                fostering innovation, creativity, and leadership among our students to meet the challenges of tomorrow.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">5000+</h4>
                  <p className="text-gray-600">Students</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">AICTE</h4>
                  <p className="text-gray-600">Approved</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Achievements</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Ranked #1 Engineering College in the Region</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">95% Placement Rate with Top Companies</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">State-of-the-Art Research Facilities</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">International Collaborations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Award-Winning Faculty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600">Comprehensive Engineering Education</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-orange-200 group">
                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors">
                  <div className="text-orange-600">
                    {course.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{course.name}</h3>
                <p className="text-gray-600 mb-4">Duration: {course.duration}</p>
                <p className="text-gray-600 mb-6">Bachelor of Technology program designed to provide comprehensive knowledge and practical skills in {course.name.toLowerCase()}.</p>
                <button 
                  onClick={() => handleCourseLearnMore(course)}
                  className="text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center gap-2"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Stay Updated with Our Latest Activities</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <Calendar className="w-8 h-8 text-orange-600" />
                  <div>
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                      {event.type}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">{event.date}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-6">{event.description}</p>
                <button 
                  onClick={() => handleEventRegister(event)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placements Section */}
      <section id="placements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Placements & Recruiters</h2>
            <p className="text-xl text-gray-600">Building Successful Careers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Placement Rate</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">₹25 LPA</h3>
              <p className="text-gray-600">Highest Package</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">₹8.5 LPA</h3>
              <p className="text-gray-600">Average CTC</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Recruiting Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {companies.map((company, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center group">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-gray-700 font-medium text-sm">${company.name}</span>`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Campus Life</h2>
            <p className="text-xl text-gray-600">Experience Our Vibrant Campus</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video relative">
              <img 
                src={galleryImages[currentSlide]} 
                alt="Campus Life" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Distinguished Faculty</h2>
            <p className="text-xl text-gray-600">Learn from Industry Experts</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-600 font-semibold mb-2">{member.subject}</p>
                <p className="text-gray-600">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">We'd love to hear from you! Reach out with any questions or feedback.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <ul className="space-y-5 text-gray-700 text-base">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p>
                        8-256/1, Dasaripalem (V),<br />
                        Vipparla (Post), Palnadu (Dist),<br />
                        Andhra Pradesh - 522615
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p>+91 9133843912</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-orange-600 mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p>careers@lifeboxnextgen.co.site</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Inquiry</h3>
                <form className="space-y-5">
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none"
                  ></textarea>
                  <button 
                    type="submit"
                    className="w-full bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                <h3 className="text-2xl font-bold text-gray-900 px-8 pt-8">Visit Our Campus</h3>
                <div className="mt-6">
                  <iframe
                    title="Campus Location"
                    width="100%"
                    height="360"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119052.3732031214!2d79.61010132858258!3d16.290234678257885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4b20a92c7b2eb3%3A0xfdb3c8d3932a820e!2sPalnadu%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1628949581449!5m2!1sen!2sin"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="w-8 h-8 text-orange-600" />
              <span className="text-xl font-bold">Oxford College</span>
            </div>
            <p className="text-gray-400 mb-4">
              Igniting Innovation, Shaping Engineers for a Better Tomorrow
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
              <Linkedin className="w-6 h-6 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
              <Youtube className="w-6 h-6 text-gray-400 hover:text-orange-600 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="hover:text-orange-600 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('programs')}
                  className="hover:text-orange-600 transition-colors text-left"
                >
                  Courses
                </button>
              </li>
              <li>
                <a href="/admissions" className="hover:text-orange-600 transition-colors">
                  Admissions
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('events')}
                  className="hover:text-orange-600 transition-colors text-left"
                >
                  Events
                </button>
              </li>
              <li>
                <a href="/alumni" className="hover:text-orange-600 transition-colors">
                  Alumni
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Academics</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/academics" className="hover:text-orange-600 transition-colors">
                  Academic Programs
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">Research</a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">Library</a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">E-Learning</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/login" className="hover:text-orange-600 transition-colors">
                  Student Portal
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-orange-600 transition-colors">
                  Faculty Portal
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('programs')}
                  className="hover:text-orange-600 transition-colors text-left"
                >
                  Career Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('placements')}
                  className="hover:text-orange-600 transition-colors text-left"
                >
                  Records
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('events')}
                  className="hover:text-orange-600 transition-colors text-left"
                >
                  News
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Oxford College of Engineering. All rights reserved.</p>
        </div>
      </div>
    </footer>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} isOpen={showLoginModal} />
      )}

      <CourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        course={selectedCourse}
      />

      <EventRegistrationModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
      />
    </div>
  );
}

export default App;