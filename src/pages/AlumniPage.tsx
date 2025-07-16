import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Award, Building, MapPin, Calendar, Mail, Linkedin, Star } from 'lucide-react';

const AlumniPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'achievements' | 'network'>('featured');

  const featuredAlumni = [
    {
      name: 'Dr. Sarah Johnson',
      batch: '2010',
      department: 'Computer Science',
      position: 'CTO, TechCorp Industries',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      achievement: 'Led the development of AI-powered healthcare solutions',
      location: 'Silicon Valley, USA'
    },
    {
      name: 'Rajesh Kumar',
      batch: '2008',
      department: 'Mechanical Engineering',
      position: 'Senior Engineer, Tesla',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      achievement: 'Pioneered sustainable manufacturing processes',
      location: 'Austin, Texas'
    },
    {
      name: 'Priya Sharma',
      batch: '2012',
      department: 'Electronics',
      position: 'Founder, IoT Solutions Inc.',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
      achievement: 'Built India\'s leading IoT platform',
      location: 'Bangalore, India'
    },
    {
      name: 'Michael Chen',
      batch: '2009',
      department: 'Civil Engineering',
      position: 'Project Director, Burj Khalifa',
      image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
      achievement: 'Managed construction of world\'s tallest building',
      location: 'Dubai, UAE'
    }
  ];

  const achievements = [
    {
      year: '2023',
      title: 'Forbes 30 Under 30',
      recipient: 'Anita Patel (2015 Batch)',
      description: 'Recognized for revolutionary work in renewable energy'
    },
    {
      year: '2022',
      title: 'Innovation Excellence Award',
      recipient: 'Vikram Singh (2011 Batch)',
      description: 'NASA recognition for contributions to Mars mission'
    },
    {
      year: '2021',
      title: 'Entrepreneur of the Year',
      recipient: 'Lisa Wang (2013 Batch)',
      description: 'Founded successful fintech startup valued at $1B'
    },
    {
      year: '2020',
      title: 'Research Excellence Award',
      recipient: 'Dr. James Miller (2007 Batch)',
      description: 'Breakthrough research in quantum computing'
    }
  ];

  const networkStats = [
    { label: 'Total Alumni', value: '25,000+' },
    { label: 'Countries', value: '50+' },
    { label: 'Fortune 500 Companies', value: '200+' },
    { label: 'Successful Startups', value: '500+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Alumni Network</h1>
          <p className="text-gray-600 mt-2">Connect with our global community of successful graduates</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Oxford College Alumni</h2>
          <p className="text-xl mb-8">Making a difference across the globe</p>
          <div className="grid md:grid-cols-4 gap-8">
            {networkStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'featured'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Featured Alumni
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'achievements'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'network'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Network
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'featured' && (
          <div className="grid md:grid-cols-2 gap-8">
            {featuredAlumni.map((alumnus, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={alumnus.image}
                      alt={alumnus.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{alumnus.name}</h3>
                      <p className="text-gray-600">{alumnus.position}</p>
                      <p className="text-sm text-gray-500">
                        {alumnus.department} • Class of {alumnus.batch}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Key Achievement</span>
                    </div>
                    <p className="text-gray-600">{alumnus.achievement}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{alumnus.location}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                      <Mail className="w-5 h-5 text-gray-400 hover:text-orange-600 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notable Achievements</h2>
              <p className="text-gray-600">Celebrating the outstanding accomplishments of our alumni</p>
            </div>
            
            <div className="grid gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 rounded-full p-3">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {achievement.year}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{achievement.title}</h3>
                      </div>
                      <p className="text-lg text-gray-700 mb-2">{achievement.recipient}</p>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Alumni Network</h2>
              <p className="text-gray-600">Join our vibrant community of professionals worldwide</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">Network with fellow alumni across industries and locations</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Building className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Opportunities</h3>
                <p className="text-gray-600">Discover career opportunities and business partnerships</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
                <p className="text-gray-600">Give back by mentoring current students and recent graduates</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Alumni Network</h3>
              <p className="text-gray-600 mb-6">
                Connect with over 25,000 alumni worldwide and expand your professional network
              </p>
              <button className="bg-orange-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-700 transition-colors">
                Register Now
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Alumni Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">March 25, 2024</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Annual Alumni Meet 2024</h3>
              <p className="text-gray-600">Join us for networking, awards ceremony, and campus tour</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">April 15, 2024</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tech Talk Series</h3>
              <p className="text-gray-600">Monthly webinar series featuring industry leaders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniPage;