import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, CheckCircle, Users, Clock, Award } from 'lucide-react';

const AdmissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'undergraduate' | 'postgraduate'>('undergraduate');

  const admissionSteps = [
    {
      step: 1,
      title: 'Online Application',
      description: 'Complete the online application form with all required details',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Document Submission',
      description: 'Upload all necessary documents and certificates',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Entrance Examination',
      description: 'Appear for the entrance test (if applicable)',
      icon: <Award className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Merit List',
      description: 'Check merit list and counseling dates',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      step: 5,
      title: 'Final Admission',
      description: 'Complete admission formalities and fee payment',
      icon: <Users className="w-6 h-6" />
    }
  ];

  const importantDates = [
    { event: 'Application Opens', date: 'January 15, 2024' },
    { event: 'Application Deadline', date: 'March 31, 2024' },
    { event: 'Entrance Test', date: 'April 15-20, 2024' },
    { event: 'Merit List Release', date: 'May 10, 2024' },
    { event: 'Counseling Begins', date: 'May 20, 2024' },
    { event: 'Classes Begin', date: 'July 1, 2024' }
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
          <h1 className="text-3xl font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-600 mt-2">Join Oxford College of Engineering - Your gateway to excellence</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              Undergraduate
            </button>
            <button
              onClick={() => setActiveTab('postgraduate')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'postgraduate'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Postgraduate
            </button>
          </div>
        </div>

        {/* Admission Requirements */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeTab === 'undergraduate' ? 'Undergraduate' : 'Postgraduate'} Requirements
            </h2>
            
            {activeTab === 'undergraduate' ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Educational Qualification</h3>
                    <p className="text-gray-600">12th standard with Physics, Chemistry, Mathematics (60% minimum)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Age Limit</h3>
                    <p className="text-gray-600">17-23 years as on July 1, 2024</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Entrance Test</h3>
                    <p className="text-gray-600">JEE Main/State CET scores accepted</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Educational Qualification</h3>
                    <p className="text-gray-600">B.Tech/B.E. in relevant field (60% minimum)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Entrance Test</h3>
                    <p className="text-gray-600">GATE scores preferred (not mandatory)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Work Experience</h3>
                    <p className="text-gray-600">For some programs, relevant work experience preferred</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Dates</h2>
            <div className="space-y-4">
              {importantDates.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold">{item.event}</h3>
                    <p className="text-gray-600">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admission Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admission Process</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {admissionSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <div className="text-orange-600">{step.icon}</div>
                </div>
                <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fee Structure (Annual)</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Undergraduate Programs</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tuition Fee</span>
                  <span className="font-semibold">₹1,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Fee</span>
                  <span className="font-semibold">₹80,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Fees</span>
                  <span className="font-semibold">₹20,000</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹2,50,000</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Postgraduate Programs</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tuition Fee</span>
                  <span className="font-semibold">₹1,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostel Fee</span>
                  <span className="font-semibold">₹80,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Fees</span>
                  <span className="font-semibold">₹15,000</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹1,95,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-lg mb-6">Start your journey with Oxford College of Engineering today!</p>
          <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsPage;