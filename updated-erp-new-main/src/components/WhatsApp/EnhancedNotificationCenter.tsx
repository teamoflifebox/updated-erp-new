import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout/Layout';
import { useEnhancedWhatsApp } from '../../hooks/useEnhancedWhatsApp';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates'; 
import { supabase } from '../../lib/supabase';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users,
  TrendingUp,
  Filter,
  Search,
  Phone,
  AlertCircle,
  Wifi,
  WifiOff,
  Bell,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

const EnhancedNotificationCenter: React.FC = () => {
  const { 
    isLoading, 
    error, 
    lastNotification, 
    sendBulkNotification, 
    checkHealth,
    clearError 
  } = useEnhancedWhatsApp();
  
  const { isConnected, lastUpdate } = useRealTimeUpdates();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
    successRate: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [bulkMessage, setBulkMessage] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    audience: 'all',
  });

  useEffect(() => {
    loadNotificationHistory();
    performHealthCheck();
  }, []); 

  useEffect(() => {
    if (lastUpdate) {
      // Update UI with real-time data
      loadNotificationHistory();
    }
  }, [lastUpdate]);

  const loadNotificationHistory = async () => {
    try {
      // Get notification history from database
      const { data, error } = await supabase
        .from('whatsapp_notifications')
        .select(`
          *,
          students (
            id,
            roll_number,
            users:user_id (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Failed to load notification history:', error);
        return;
      }
      
      // Transform data to match expected format
      const formattedHistory = data.map(notification => ({
        id: notification.id,
        studentId: notification.student_id,
        studentName: notification.students?.users?.name || '',
        rollNumber: notification.students?.roll_number || '',
        parentPhone: notification.parent_phone,
        type: notification.type,
        message: notification.message,
        timestamp: new Date(notification.created_at),
        status: notification.status,
        metadata: notification.metadata
      }));
      
      setNotifications(formattedHistory);
      
      // Calculate stats
      const total = formattedHistory.length;
      const sent = formattedHistory.filter(n => n.status === 'sent').length;
      const failed = formattedHistory.filter(n => n.status === 'failed').length;
      const pending = formattedHistory.filter(n => n.status === 'pending').length;
      
      setStats({
        total,
        sent,
        failed,
        pending,
        successRate: total > 0 ? (sent / total) * 100 : 0,
      });
    } catch (error) {
      console.error('Failed to load notification history:', error);
    }
  };

  const performHealthCheck = async () => {
    const healthy = await checkHealth();
    setIsHealthy(healthy);
  };

  const handleBulkSend = async () => {
    if (!bulkMessage.title || !bulkMessage.message) {
      alert('Please fill in all fields');
      return; 
    }

    try {
      // Get student IDs based on audience filter
      let query = supabase
        .from('students')
        .select('id, users:user_id(department)');
        
      if (bulkMessage.audience !== 'all') {
        query = query.eq('users.department', bulkMessage.audience);
      }
      
      const { data: students, error } = await query;
      
      if (error) {
        console.error('Failed to get students:', error);
        alert('Failed to get students');
        return;
      }
      
      const studentIds = students.map(s => s.id);
      
      if (studentIds.length === 0) {
        alert('No students found matching the selected criteria');
        return;
      }
      
      await sendBulkNotification(
        studentIds,
        bulkMessage.title,
        bulkMessage.message,
        bulkMessage.priority
      );
      
      setBulkMessage({
        title: '',
        message: '',
        priority: 'medium',
        audience: 'all',
      });
      
      alert('Bulk notification sent successfully!');
      loadNotificationHistory();
    } catch (error) {
      console.error('Failed to send bulk notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.parentPhone?.includes(searchTerm);
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return CheckCircle;
      case 'failed': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attendance': return '📋';
      case 'fee_payment': return '💰';
      case 'marks': return '📊';
      case 'emergency': return '🚨';
      default: return '📢';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enhanced WhatsApp Center</h1>
            <p className="text-gray-600">Real-time parent communication & notification management</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {/* WhatsApp API Health */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              isHealthy === true ? 'bg-green-100 text-green-800' : 
              isHealthy === false ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isHealthy === true ? 'API Healthy' : 
                 isHealthy === false ? 'API Error' : 
                 'Checking...'}
              </span>
            </div>
            
            <button
              onClick={performHealthCheck}
              className="btn-secondary"
            >
              <Activity className="w-4 h-4" />
              <span>Check Status</span>
            </button>
          </div>
        </div>

        {/* Real-time Updates Banner */}
        {lastUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-primary-600 animate-pulse" />
              <div>
                <p className="font-medium text-primary-900">Real-time Update</p>
                <p className="text-sm text-primary-700">
                  {lastUpdate.type.replace('_', ' ').toUpperCase()} - {lastUpdate.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">All notifications</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
                <p className="text-sm text-gray-500 mt-1">Successfully sent</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
                <p className="text-sm text-gray-500 mt-1">Delivery failed</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-primary-600">{stats.successRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">Delivery success</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Notification Sender */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Send className="w-5 h-5 text-primary-600" />
            <span>Send Bulk Notification</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={bulkMessage.title}
                  onChange={(e) => setBulkMessage({ ...bulkMessage, title: e.target.value })}
                  className="input"
                  placeholder="Enter notification title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={bulkMessage.message}
                  onChange={(e) => setBulkMessage({ ...bulkMessage, message: e.target.value })}
                  rows={4}
                  className="input"
                  placeholder="Enter your message..."
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={bulkMessage.priority}
                  onChange={(e) => setBulkMessage({ ...bulkMessage, priority: e.target.value as any })}
                  className="input"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                <select
                  value={bulkMessage.audience}
                  onChange={(e) => setBulkMessage({ ...bulkMessage, audience: e.target.value })}
                  className="input"
                >
                  <option value="all">All Parents</option>
                  <option value="Computer Science Engineering with AI">Computer Science with AI</option>
                  <option value="Artificial Intelligence & Machine Learning">AI & ML</option>
                  <option value="Computer Science Engineering">Computer Science</option>
                  <option value="Machine Learning Engineering">ML Engineering</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Data Science & Analytics">Data Science</option>
                </select>
              </div>
              
              <button
                onClick={handleBulkSend}
                disabled={isLoading || !bulkMessage.title || !bulkMessage.message}
                className="btn-primary w-full justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send to All Parents</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input pl-10"
              >
                <option value="all">All Types</option>
                <option value="attendance">Attendance</option>
                <option value="fee_payment">Fee Payment</option>
                <option value="marks">Marks</option>
                <option value="general">General</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredNotifications.length} of {notifications.length}
              </span>
              <button
                onClick={loadNotificationHistory}
                className="btn-ghost"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary-600" />
            <span>Recent Notifications</span>
          </h3>
          
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.slice(0, 10).map((notification, index) => {
                const StatusIcon = getStatusIcon(notification.status);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.type === 'attendance' ? 'bg-blue-100 text-blue-800' :
                            notification.type === 'fee_payment' ? 'bg-green-100 text-green-800' :
                            notification.type === 'marks' ? 'bg-purple-100 text-purple-800' :
                            notification.type === 'emergency' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.type?.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{notification.status?.toUpperCase()}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span>{notification.parentPhone}</span>
                          <span>•</span>
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EnhancedNotificationCenter;