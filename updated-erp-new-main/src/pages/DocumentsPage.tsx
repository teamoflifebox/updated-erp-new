import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { pdfExportService } from '../utils/pdfExport';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Printer
} from 'lucide-react';

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: '',
    purpose: '',
    urgency: 'normal'
  });

  const isStudent = user?.role === 'student';

  // Mock documents data
  const mockDocuments = [
    {
      id: '1',
      name: 'Bonafide Certificate',
      type: 'certificate',
      status: 'approved',
      requestDate: '2024-01-10',
      approvedDate: '2024-01-12',
      downloadUrl: '#',
      purpose: 'Bank Loan Application'
    },
    {
      id: '2',
      name: 'Transfer Certificate',
      type: 'certificate',
      status: 'pending',
      requestDate: '2024-01-15',
      approvedDate: null,
      downloadUrl: null,
      purpose: 'College Transfer'
    },
    {
      id: '3',
      name: 'Mark Sheet - Semester 5',
      type: 'marksheet',
      status: 'approved',
      requestDate: '2024-01-08',
      approvedDate: '2024-01-09',
      downloadUrl: '#',
      purpose: 'Job Application'
    },
    {
      id: '4',
      name: 'Character Certificate',
      type: 'certificate',
      status: 'rejected',
      requestDate: '2024-01-05',
      approvedDate: null,
      downloadUrl: null,
      purpose: 'Scholarship Application',
      rejectionReason: 'Incomplete application form'
    },
    {
      id: '5',
      name: 'Fee Receipt - Q3 2024',
      type: 'receipt',
      status: 'approved',
      requestDate: '2024-01-03',
      approvedDate: '2024-01-03',
      downloadUrl: '#',
      purpose: 'Tax Filing'
    }
  ];

  const documentTypes = [
    { value: 'bonafide', label: 'Bonafide Certificate' },
    { value: 'transfer', label: 'Transfer Certificate' },
    { value: 'character', label: 'Character Certificate' },
    { value: 'marksheet', label: 'Mark Sheet' },
    { value: 'receipt', label: 'Fee Receipt' },
    { value: 'transcript', label: 'Official Transcript' }
  ];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExportPDF = async (document: any) => {
    try {
      // Create a simple document object for the PDF
      const documentData = {
        name: document.name,
        type: document.type,
        requestDate: document.requestDate,
        approvedDate: document.approvedDate || 'N/A',
        purpose: document.purpose,
        status: document.status,
        studentName: user?.name,
        studentId: user?.rollNumber,
        department: user?.department,
        issuedBy: 'Oxford College Administration'
      };

      await pdfExportService.exportElementAsPDF('document-content', {
        filename: document.name.toLowerCase().replace(/\s+/g, '-'),
        title: document.name,
        subtitle: `Requested on ${document.requestDate}`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-800 bg-yellow-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return AlertCircle;
      default: return Clock;
    }
  };

  const handleRequestDocument = () => {
    setShowRequestModal(false);
    setNewRequest({ type: '', purpose: '', urgency: 'normal' });
    alert('Document request submitted successfully!');
  };

  const handleDownload = (document: any) => {
    handleExportPDF(document);
  };

  const handleView = (documentId: string, documentName: string) => {
    alert(`Opening ${documentName} in viewer...`);
  };

  if (!isStudent) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Document management is available for students only.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Background Image Container */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          filter: 'brightness(0.8)'
        }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 p-4 md:p-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="bg-white/60 rounded-xl shadow p-4 mb-2">
             <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
             <p className="text-gray-700">Manage your academic documents and requests</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all"
            >
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { title: 'Total', value: mockDocuments.length, icon: FileText, color: 'bg-indigo-100 text-indigo-700' },
            { title: 'Approved', value: mockDocuments.filter(d => d.status === 'approved').length, icon: CheckCircle, color: 'bg-green-100 text-green-700' },
            { title: 'Pending', value: mockDocuments.filter(d => d.status === 'pending').length, icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
            { title: 'Rejected', value: mockDocuments.filter(d => d.status === 'rejected').length, icon: AlertCircle, color: 'bg-red-100 text-red-700' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-xl bg-white shadow border ${stat.color}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">{stat.title} Documents</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-white bg-opacity-80`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white bg-opacity-90 p-5 rounded-xl border border-gray-200 shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white bg-opacity-80 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white bg-opacity-80 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="certificate">Certificates</option>
                <option value="marksheet">Mark Sheets</option>
                <option value="receipt">Receipts</option>
              </select>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600">
                Showing {filteredDocuments.length} of {mockDocuments.length} documents
              </span>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white bg-opacity-60 p-5 rounded-xl border border-gray-200 shadow">
          <h3 className="text-xl font-semibold text-indigo-900 mb-5 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-indigo-400" />
            Document Requests
          </h3>

          <div className="space-y-3">
            {filteredDocuments.map((document, index) => {
              const StatusIcon = getStatusIcon(document.status);
              return (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white bg-opacity-80 hover:bg-indigo-50 border border-gray-200 rounded-lg transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <FileText className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{document.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">Purpose: {document.purpose}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Requested: {document.requestDate}</span>
                        {document.approvedDate && (
                          <span>Approved: {document.approvedDate}</span>
                        )}
                      </div>
                      {document.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">Reason: {document.rejectionReason}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${getStatusColor(document.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="capitalize">{document.status}</span>
                    </div>
                    {document.status === 'approved' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(document.id, document.name)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(document)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-200 rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-400" />
                Request New Document
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <select
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <textarea
                    value={newRequest.purpose}
                    onChange={(e) => setNewRequest({ ...newRequest, purpose: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Explain why you need this document..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="normal">Normal (5-7 days)</option>
                    <option value="urgent">Urgent (2-3 days) (+$10)</option>
                    <option value="emergency">Emergency (24h) (+$25)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestDocument}
                  disabled={!newRequest.type || !newRequest.purpose}
                  className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200 shadow">
          <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-indigo-400" />
            Request Guidelines
          </h3>
          <ul className="text-indigo-800 text-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Normal processing takes 5-7 working days</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Urgent requests available for additional fee</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Digital signatures verify document authenticity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contact registrar@university.edu for questions</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </Layout>
  );
};

export default DocumentsPage;
