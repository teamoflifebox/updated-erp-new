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
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
    console.log('Requesting document:', newRequest);
    setShowRequestModal(false);
    setNewRequest({ type: '', purpose: '', urgency: 'normal' });
    alert('Document request submitted successfully!');
  };

  const handleDownload = (document: any) => {
    handleExportPDF(document);
  };

  const handleView = (documentId: string, documentName: string) => {
    console.log('Viewing document:', documentId);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600">Request and download your academic documents</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Request Document</span>
            </button>
          </div>
        </div>

        <div id="document-content">
          {/* Document Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{mockDocuments.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {mockDocuments.filter(d => d.status === 'approved').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {mockDocuments.filter(d => d.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">
                    {mockDocuments.filter(d => d.status === 'rejected').length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="certificate">Certificates</option>
                  <option value="marksheet">Mark Sheets</option>
                  <option value="receipt">Receipts</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {filteredDocuments.length} of {mockDocuments.length} documents
                </span>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Requests</h3>
            
            <div className="space-y-4">
              {filteredDocuments.map((document, index) => {
                const StatusIcon = getStatusIcon(document.status);
                return (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{document.name}</h4>
                        <p className="text-sm text-gray-600">Purpose: {document.purpose}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
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
                    
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="capitalize">{document.status}</span>
                      </div>
                      
                      {document.status === 'approved' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(document.id, document.name)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(document)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Request Document Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Request Document</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <select
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter the purpose for this document..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="normal">Normal (5-7 days)</option>
                    <option value="urgent">Urgent (2-3 days)</option>
                    <option value="emergency">Emergency (Same day)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleRequestDocument}
                  disabled={!newRequest.type || !newRequest.purpose}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Document Request Guidelines</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Normal processing time is 5-7 working days</li>
            <li>• Urgent requests may incur additional charges</li>
            <li>• Emergency requests require valid justification</li>
            <li>• All documents will be digitally signed and verified</li>
            <li>• Contact administration for any queries or issues</li>
          </ul>
        </div>
      </motion.div>
    </Layout>
  );
};

export default DocumentsPage;