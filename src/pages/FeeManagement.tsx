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
  MessageCircle,
  Phone,
  Printer,
  PieChart,
  BarChart2
} from 'lucide-react';

// Mock analytics for admin dashboard
const feeAnalytics = {
  totalCollected: 42000,
  pending: 12000,
  overdue: 8000,
  upcomingDues: 5000,
  paidPercent: 72,
  overduePercent: 14,
  pendingPercent: 14,
  thisMonth: 15000,
  lastMonth: 12000,
  paidBreakdown: [
    { name: 'Paid', value: 72, color: '#22c55e' },
    { name: 'Pending', value: 14, color: '#f59e42' },
    { name: 'Overdue', value: 14, color: '#ef4444' }
  ],
  collectionTrend: [
    { month: 'Jan', collected: 6000 },
    { month: 'Feb', collected: 7000 },
    { month: 'Mar', collected: 8000 },
    { month: 'Apr', collected: 9000 },
    { month: 'May', collected: 12000 },
    { month: 'Jun', collected: 15000 },
  ]
};

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

  // Mock data for admin fee management (used for export only)
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

  const handleExportPDF = async () => {
    try {
      if (isStudent) {
        await pdfExportService.exportElementAsPDF('student-fee-content', {
          filename: 'fee-statement',
          title: 'Fee Statement',
          subtitle: `${user?.name} - ${user?.rollNumber}`
        });
      } else {
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

  const handlePayment = async () => {
    const receiptNumber = `RCP${Date.now()}`;
    const paymentMethod = 'Credit Card';
    const amount = studentFeeData.pendingAmount;

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

  // --- STUDENT VIEW (unchanged) ---
  if (isStudent) {
    return (
      <Layout>
        {/* Background image + overlay */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://t4.ftcdn.net/jpg/12/33/91/53/240_F_1233915351_pGZmXeSyFb0cqi7IYEAfYD0KCEBCELGN.jpg')`
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col items-center px-2 md:px-0 py-6">
          {/* Header Bar */}
          <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-start md:items-center md:flex-row md:justify-between gap-2 md:gap-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
                <p className="text-gray-600">View and manage your fee payments</p>
              </div>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl mx-auto space-y-8"
          >
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

            <div id="student-fee-content" className="space-y-8">
              {/* Fee Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/90 rounded-xl shadow-sm border border-gray-200 p-6">
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
                <div className="bg-white/90 rounded-xl shadow-sm border border-gray-200 p-6">
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
                <div className="bg-white/90 rounded-xl shadow-sm border border-gray-200 p-6">
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
              <div className="bg-white/90 rounded-xl shadow-sm border border-gray-200 p-6">
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
              <div className="bg-white/90 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
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
              <div className="bg-white/90 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
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
        </div>
      </Layout>
    );
  }

  // --- ADMIN/PRINCIPAL VIEW (analytics dashboard, no student details by default) ---
  if (!canManageFees) {
    return (
      <Layout>
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://t4.ftcdn.net/jpg/12/33/91/53/240_F_1233915351_pGZmXeSyFb0cqi7IYEAfYD0KCEBCELGN.jpg')`
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 min-h-screen p-4 flex items-center justify-center">
          <div className="bg-white/90 rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage fees.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://t4.ftcdn.net/jpg/12/33/91/53/240_F_1233915351_pGZmXeSyFb0cqi7IYEAfYD0KCEBCELGN.jpg')`
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center px-2 md:px-0 py-6">
        {/* Header Bar */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="bg-white/70 rounded-xl shadow p-6 flex flex-col items-start md:items-center md:flex-row md:justify-between gap-2 md:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
              <p className="text-gray-700">Analytics and summary of all student fee payments</p>
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl mx-auto space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/70 rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Collected</p>
                  <p className="text-2xl font-bold text-green-600">${feeAnalytics.totalCollected.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <span className="text-xs text-gray-400">This Month: ${feeAnalytics.thisMonth.toLocaleString()}</span>
            </div>
            <div className="bg-white/70 rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">${feeAnalytics.pending.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <span className="text-xs text-gray-400">Upcoming Dues: ${feeAnalytics.upcomingDues.toLocaleString()}</span>
            </div>
            <div className="bg-white/70 rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">${feeAnalytics.overdue.toLocaleString()}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <span className="text-xs text-gray-400">Overdue %: {feeAnalytics.overduePercent}%</span>
            </div>
            <div className="bg-white/70 rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid %</p>
                  <p className="text-2xl font-bold text-blue-600">{feeAnalytics.paidPercent}%</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <span className="text-xs text-gray-400">Pending %: {feeAnalytics.pendingPercent}%</span>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Fee Collection Trend</h3>
              </div>
              <div className="h-48 flex items-end gap-2">
                {feeAnalytics.collectionTrend.map((item, idx) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-8 rounded-t bg-blue-500 transition-all"
                      style={{
                        height: `${item.collected / 200}px`, // scale for demo
                        minHeight: '10px'
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Last Month: ${feeAnalytics.lastMonth.toLocaleString()}</span>
                <span>This Month: ${feeAnalytics.thisMonth.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white/70 rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Paid vs Pending vs Overdue</h3>
              </div>
              <div className="flex items-center justify-center h-48">
                <svg width="120" height="120" viewBox="0 0 36 36">
                  {(() => {
                    let acc = 0;
                    return feeAnalytics.paidBreakdown.map((slice, idx) => {
                      const val = slice.value / 100 * 100;
                      const dash = `${val} ${100 - val}`;
                      const el = (
                        <circle
                          key={slice.name}
                          r="16"
                          cx="18"
                          cy="18"
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth="6"
                          strokeDasharray={dash}
                          strokeDashoffset={-acc}
                        />
                      );
                      acc -= val;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-bold text-gray-900">{feeAnalytics.paidPercent}%</span>
                  <div className="text-xs text-gray-500">Paid</div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                {feeAnalytics.paidBreakdown.map(slice => (
                  <div key={slice.name} className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: slice.color }}></span>
                    <span>{slice.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default FeeManagement;
