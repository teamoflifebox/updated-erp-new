import React, { useState, useEffect } from 'react';

import LoginModal from './LoginModal';
import {
  ChevronDown, Users, Award, Calendar, MapPin, Phone, Mail, ExternalLink,
  Menu, X, Star, Building, GraduationCap, Trophy, ChevronRight, PlayCircle,
  Globe, BookOpen, Zap, Target, TrendingUp, Facebook, Instagram, Linkedin, Youtube, CheckCircle, LogIn
} from 'lucide-react';
import LoginPage from './LoginPage';

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

function LandingPage(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

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

//   if (isLoggedIn) {
//     switch (userType) {
//       case 'student':
//         return <StudentDashboard userData={userData} onLogout={handleLogout} />;
//       case 'faculty':
//         return <FacultyDashboard userData={userData} onLogout={handleLogout} />;
//       case 'admin':
//         return <AdminDashboard userData={userData} onLogout={handleLogout} />;
//       default:
//         return <LoginPage onLogin={handleLogin} />;
//     }
//   }

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
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
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
                <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center gap-2">
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
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
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
                      // Fallback to text if image fails to load
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
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">Get in Touch with Us</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">123 Education Lane, Oxford City, State 12345</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">info@oxfordcollege.edu</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Inquiry</h3>
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Your Message" 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    ></textarea>
                  </div>
                  <button className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8 h-96">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Campus</h3>
                <div className="bg-gray-200 rounded-lg h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive Map Coming Soon</p>
                  </div>
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
                <li><a href="#" className="hover:text-orange-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Admissions</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Alumni</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Academics</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Undergraduate</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Postgraduate</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Library</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">E-Learning</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Student Portal</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Faculty Portal</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Career Services</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Downloads</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">News</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Oxford College of Engineering. All rights reserved.</p>
          </div>
        </div>
      </footer>
          {showLoginModal && (
        // <LoginModal onClose={() => setShowLoginModal(false)} isOpen={false} />
        <LoginModal onClose={() => setShowLoginModal(false)} isOpen={showLoginModal} />

)}
    </div>
  );
}

export default LandingPage;
