import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { useWhatsAppNotifications } from '../hooks/useWhatsAppNotifications';
import { pdfExportService } from '../utils/pdfExport';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Download,
  Search,
  Filter,
  Plus,
  MessageCircle,
  Phone,
  Printer
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const FeeManagement: React.FC = () => {
  const { user } = useAuth();
  const { notifyFeePayment, isLoading: isNotifying } = useWhatsAppNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [autoNotify, setAutoNotify] = useState(true);

  const isStudent = user?.role === 'student';
  const canManageFees = ['principal', 'director'].includes(user?.role || '');

  // Mock data for student fee view
  const studentFeeData = {
    totalFee: 12000,
    paidAmount: 8000,
    pendingAmount: 4000,
    dueDate: '2024-02-15',
    installments: [
      { id: 1, name: 'First Installment', amount: 4000, dueDate: '2023-08-15', status: 'paid', paidDate: '2023-08-10' },
      { id: 2, name: 'Second Installment', amount: 4000, dueDate: '2023-12-15', status: 'paid', paidDate: '2023-12-12' },
      { id: 3, name: 'Third Installment', amount: 4000, dueDate: '2024-02-15', status: 'pending', paidDate: null },
    ]
  };

  // Mock data for admin fee management
  const mockStudentFees = [
    { 
      id: '1', 
      name: 'John Smith', 
      rollNumber: 'CS2021001', 
      department: 'Computer Science',
      totalFee: 12000, 
      paidAmount: 12000, 
      pendingAmount: 0, 
      status: 'paid',
      lastPayment: '2024-01-15',
      parentPhone: '+1234567890'
    },
    { 
      id: '2', 
      name: 'Emily Johnson', 
      rollNumber: 'CS2021002', 
      department: 'Computer Science',
      totalFee: 12000, 
      paidAmount: 8000, 
      pendingAmount: 4000, 
      status: 'partial',
      lastPayment: '2023-12-10',
      parentPhone: '+1234567892'
    },
    { 
      id: '3', 
      name: 'Michael Brown', 
      rollNumber: 'CS2021003', 
      department: 'Computer Science',
      totalFee: 12000, 
      paidAmount: 4000, 
      pendingAmount: 8000, 
      status: 'overdue',
      lastPayment: '2023-08-15',
      parentPhone: '+1234567893'
    },
    { 
      id: '4', 
      name: 'Sarah Davis', 
      rollNumber: 'CS2021004', 
      department: 'Business Administration',
      totalFee: 10000, 
      paidAmount: 10000, 
      pendingAmount: 0, 
      status: 'paid',
      lastPayment: '2024-01-20',
      parentPhone: '+1234567894'
    },
  ];

  const feeCollectionData = [
    { month: 'Aug', collected: 450000, target: 500000 },
    { month: 'Sep', collected: 480000, target: 500000 },
    { month: 'Oct', collected: 520000, target: 500000 },
    { month: 'Nov', collected: 490000, target: 500000 },
    { month: 'Dec', collected: 510000, target: 500000 },
    { month: 'Jan', collected: 470000, target: 500000 },
  ];

  const feeStatusData = [
    { name: 'Paid', value: 65, color: '#10b981' },
    { name: 'Partial', value: 25, color: '#f59e0b' },
    { name: 'Overdue', value: 10, color: '#ef4444' },
  ];

  const filteredStudents = mockStudentFees.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportPDF = async () => {
    try {
      if (isStudent) {
        // Export student fee details
        const feeData = studentFeeData.installments.map(installment => ({
          name: installment.name,
          amount: installment.amount,
          dueDate: installment.dueDate,
          status: installment.status,
          paidDate: installment.paidDate || 'N/A'
        }));

        await pdfExportService.exportElementAsPDF('student-fee-content', {
          filename: 'fee-statement',
          title: 'Fee Statement',
          subtitle: `${user?.name} - ${user?.rollNumber}`
        });
      } else {
        // Export fee management report
        await pdfExportService.exportFeeReport(mockStudentFees, {
          filename: 'fee-management-report',
          title: 'Fee Management Report',
          subtitle: new Date().toLocaleDateString()
        });
      }
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
      case 'paid': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'partial': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const handlePayment = async () => {
    const receiptNumber = `RCP${Date.now()}`;
    const paymentMethod = 'Credit Card';
    const amount = studentFeeData.pendingAmount;
    
    console.log('Processing payment...');
    
    // Simulate payment processing
    if (autoNotify && isStudent) {
      try {
        await notifyFeePayment('1', amount, paymentMethod, receiptNumber);
      } catch (error) {
        console.error('Failed to notify parent:', error);
      }
    }
    
    alert('Payment processed successfully! Receipt sent to parent via WhatsApp.');
    setShowPaymentModal(false);
  };

  const processPaymentForStudent = async (studentId: string, amount: number) => {
    const receiptNumber = `RCP${Date.now()}`;
    const paymentMethod = 'Online Payment';
    
    if (autoNotify) {
      try {
        await notifyFeePayment(studentId, amount, paymentMethod, receiptNumber);
        alert(`Payment processed! Parent notified via WhatsApp with receipt ${receiptNumber}`);
      } catch (error) {
        console.error('Failed to notify parent:', error);
        alert('Payment processed but failed to send WhatsApp notification');
      }
    } else {
      alert(`Payment of $${amount} processed successfully!`);
    }
  };

  if (isStudent) {
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
              <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
              <p className="text-gray-600">View and manage your fee payments</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Notification Info */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Payment Receipts via WhatsApp</h3>
                <p className="text-sm text-gray-600">Your parents receive automatic payment confirmations and receipts via WhatsApp</p>
              </div>
            </div>
          </div>

          <div id="student-fee-content">
            {/* Fee Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Fee</p>
                    <p className="text-3xl font-bold text-gray-900">${studentFeeData.totalFee.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                    <p className="text-3xl font-bold text-green-600">${studentFeeData.paidAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                    <p className="text-3xl font-bold text-red-600">${studentFeeData.pendingAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Paid: ${studentFeeData.paidAmount.toLocaleString()}</span>
                  <span>Total: ${studentFeeData.totalFee.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(studentFeeData.paidAmount / studentFeeData.totalFee) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((studentFeeData.paidAmount / studentFeeData.totalFee) * 100)}% completed
                </p>
              </div>
            </div>

            {/* Installments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Fee Installments</h3>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={isNotifying}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isNotifying ? 'Processing...' : 'Make Payment'}</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {studentFeeData.installments.map((installment) => {
                  const StatusIcon = getStatusIcon(installment.status);
                  return (
                    <div key={installment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(installment.status)}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{installment.name}</h4>
                          <p className="text-sm text-gray-600">
                            Due: {installment.dueDate}
                            {installment.paidDate && ` | Paid: ${installment.paidDate}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${installment.amount.toLocaleString()}</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(installment.status)}`}>
                          {installment.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                <button 
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {studentFeeData.installments.filter(i => i.status === 'paid').map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{payment.name}</p>
                        <p className="text-sm text-gray-600">Paid on {payment.paidDate} • Receipt sent to parent</p>
                      </div>
                    </div>
                    <p className="font-medium text-green-600">${payment.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Make Payment</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      value={studentFeeData.pendingAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="card">Credit/Debit Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">Receipt will be sent to parent via WhatsApp</span>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handlePayment}
                    disabled={isNotifying}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isNotifying ? 'Processing...' : `Pay $${studentFeeData.pendingAmount.toLocaleString()}`}
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </Layout>
    );
  }

  if (!canManageFees) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage fees.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
            <p className="text-gray-600">Manage student fees and send payment confirmations via WhatsApp</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Fee Record</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Notification Settings */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">WhatsApp Payment Notifications</h3>
                <p className="text-sm text-gray-600">Automatically send payment receipts and confirmations to parents</p>
              </div>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoNotify}
                onChange={(e) => setAutoNotify(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Auto-notify parents</span>
            </label>
          </div>
          {isNotifying && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Sending WhatsApp receipt...</span>
            </div>
          )}
        </div>

        {/* Fee Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collection</p>
                <p className="text-3xl font-bold text-gray-900">$2.8M</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-3xl font-bold text-red-600">$450K</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-3xl font-bold text-green-600">86%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receipts Sent</p>
                <p className="text-3xl font-bold text-green-600">1,247</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Collection</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="collected" fill="#3b82f6" name="Collected" />
                  <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {feeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
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
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {filteredStudents.length} of {mockStudentFees.length} students
              </span>
            </div>
          </div>
        </div>

        {/* Student Fee Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Fee Records</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Total Fee</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Paid</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Pending</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Parent Contact</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const StatusIcon = getStatusIcon(student.status);
                  return (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.rollNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{student.department}</td>
                      <td className="py-3 px-4 text-center font-medium text-gray-900">
                        ${student.totalFee.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-green-600">
                        ${student.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-red-600">
                        ${student.pendingAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="capitalize">{student.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{student.parentPhone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {student.pendingAmount > 0 && (
                          <button
                            onClick={() => processPaymentForStudent(student.id, student.pendingAmount)}
                            disabled={isNotifying}
                            className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm disabled:opacity-50"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Process Payment</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default FeeManagement;