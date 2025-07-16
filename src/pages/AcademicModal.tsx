import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, BookOpen, Users, Award } from 'lucide-react';

const AcademicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'undergraduate' | 'postgraduate'>('undergraduate');

  const undergraduatePrograms = [
    {
      name: 'Computer Science Engineering',
      duration: '4 years',
      eligibility: '12th with Physics, Chemistry, Mathematics (60% minimum)',
      description: 'Comprehensive program covering programming, algorithms, software engineering, and emerging technologies.',
      subjects: ['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering', 'Machine Learning', 'Web Development']
    },
    {
      name: 'Mechanical Engineering',
      duration: '4 years',
      eligibility: '12th with Physics, Chemistry, Mathematics (60% minimum)',
      description: 'Focus on design, manufacturing, thermal systems, and mechanical systems.',
      subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes', 'CAD/CAM', 'Robotics']
    },
    {
      name: 'Electrical Engineering',
      duration: '4 years',
      eligibility: '12th with Physics, Chemistry, Mathematics (60% minimum)',
      description: 'Power systems, electronics, control systems, and electrical machines.',
      subjects: ['Circuit Analysis', 'Power Systems', 'Control Systems', 'Electrical Machines', 'Power Electronics', 'Renewable Energy']
    },
    {
      name: 'Civil Engineering',
      duration: '4 years',
      eligibility: '12th with Physics, Chemistry, Mathematics (60% minimum)',
      description: 'Infrastructure development, structural engineering, and construction management.',
      subjects: ['Structural Analysis', 'Concrete Technology', 'Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering', 'Construction Management']
    },
    {
      name: 'Electronics & Communication',
      duration: '4 years',
      eligibility: '12th with Physics, Chemistry, Mathematics (60% minimum)',
      description: 'Communication systems, VLSI design, and embedded systems.',
      subjects: ['Digital Electronics', 'Communication Systems', 'VLSI Design', 'Embedded Systems', 'Signal Processing', 'Microprocessors']
    },
    {
      name: 'Information Technology',
      duration: '4 years',
      eligibility: '12th with Physics, Chemistry, Mathematics (60% minimum)',
      description: 'IT infrastructure, database management, and network systems.',
      subjects: ['Network Security', 'Database Management', 'Cloud Computing', 'System Administration', 'IT Project Management', 'Cybersecurity']
    }
  ];

  const postgraduatePrograms = [
    {
      name: 'M.Tech Computer Science',
      duration: '2 years',
      eligibility: 'B.Tech/B.E. in relevant field with 60% minimum',
      description: 'Advanced computer science with specializations in AI, ML, and Data Science.',
      subjects: ['Advanced Algorithms', 'Machine Learning', 'Data Mining', 'Artificial Intelligence', 'Big Data Analytics', 'Research Methodology']
    },
    {
      name: 'M.Tech Mechanical Engineering',
      duration: '2 years',
      eligibility: 'B.Tech/B.E. in Mechanical Engineering with 60% minimum',
      description: 'Specializations in Design, Manufacturing, and Thermal Engineering.',
      subjects: ['Advanced Manufacturing', 'Finite Element Analysis', 'Computational Fluid Dynamics', 'Advanced Materials', 'Design Optimization', 'Thermal Systems']
    },
    {
      name: 'M.Tech VLSI Design',
      duration: '2 years',
      eligibility: 'B.Tech/B.E. in ECE/EEE with 60% minimum',
      description: 'Advanced VLSI design, semiconductor technology, and chip design.',
      subjects: ['VLSI Design', 'Semiconductor Physics', 'Digital IC Design', 'Analog IC Design', 'System on Chip', 'FPGA Programming']
    },
    {
      name: 'MBA (Technical)',
      duration: '2 years',
      eligibility: 'B.Tech/B.E. in any discipline with 60% minimum',
      description: 'Management program tailored for engineering professionals.',
      subjects: ['Strategic Management', 'Operations Management', 'Technology Management', 'Project Management', 'Financial Management', 'Leadership']
    },
    {
      name: 'M.Sc. Data Science',
      duration: '2 years',
      eligibility: 'B.Sc./B.Tech in relevant field with 60% minimum',
      description: 'Advanced data analytics, machine learning, and big data technologies.',
      subjects: ['Statistical Analysis', 'Machine Learning', 'Data Visualization', 'Big Data Technologies', 'Deep Learning', 'Business Analytics']
    }
  ];

  const programs = activeTab === 'undergraduate' ? undergraduatePrograms : postgraduatePrograms;
  const title = activeTab === 'undergraduate' ? 'Undergraduate Programs' : 'Postgraduate Programs';

  const academicFeatures = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Industry-Relevant Curriculum',
      description: 'Updated curriculum designed with industry experts to meet current market demands'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Faculty',
      description: 'Learn from experienced professors and industry professionals'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Research Opportunities',
      description: 'Engage in cutting-edge research projects and publications'
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Academic Programs</h1>
          <p className="text-gray-600 mt-2">Explore our comprehensive range of engineering programs</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Excellence in Engineering Education</h2>
          <p className="text-xl mb-8">Choose from our wide range of undergraduate and postgraduate programs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Academic Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {academicFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-orange-600 mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Program Selection */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTab('undergraduate')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'undergraduate'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Undergraduate Programs
            </button>
            <button
              onClick={() => setActiveTab('postgraduate')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'postgraduate'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Postgraduate Programs
            </button>
          </div>
        </div>

        {/* Programs List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="grid gap-6">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
                  <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                    {program.duration}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{program.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {program.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>Eligibility: {program.eligibility}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.subjects.map((subject, subIndex) => (
                      <span
                        key={subIndex}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">For Undergraduate Programs</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  Complete 12th standard with required subjects
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  Appear for JEE Main or State CET
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  Apply through online portal
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  Attend counseling process
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Postgraduate Programs</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  Complete B.Tech/B.E. with required percentage
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  GATE score preferred (not mandatory)
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  Submit application with documents
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  Interview process (if required)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6">Explore our programs and take the first step towards your engineering career</p>
          <div className="space-x-4">
            <Link
              to="/admissions"
              className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-block"
            >
              Apply Now
            </Link>
            <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-orange-600 transition-colors">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicPage;