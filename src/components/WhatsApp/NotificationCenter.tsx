import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';
import { whatsappService, WhatsAppNotification } from '../../services/whatsappService';
import { supabase } from '../../lib/supabase';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([]);
  const [stats, setStats] = useState(whatsappService.getNotificationStats());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { 
    // Load notification history
    const loadNotifications = async () => {
      try {
        const notificationHistory = await whatsappService.getNotificationHistory();
        setNotifications(notificationHistory);
        
        const notificationStats = await whatsappService.getNotificationStats();
        setStats(notificationStats);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };
    
    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.parentPhone.includes(searchTerm);
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attendance': return 'bg-blue-100 text-blue-800';
      case 'fee_payment': return 'bg-green-100 text-green-800';
      case 'marks': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Notification Center</h1>
        <p className="text-gray-600">Monitor and manage parent notifications via WhatsApp</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-primary-600">{stats.successRate.toFixed(1)}%</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-primary-600" />
          <span>Recent Notifications</span>
        </h3>
        
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
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
                          notification.type === 'attendance' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]' :
                          notification.type === 'fee_payment' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                          notification.type === 'marks' ? 'bg-[#9333EA]/10 text-[#9333EA]' :
                          notification.type === 'emergency' ? 'bg-red-100/10 text-red-600' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{notification.status.toUpperCase()}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone className="w-4 h-4" />
                        <span>{notification.parentPhone}</span>
                        <span>•</span>
                        <span>{notification.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {notification.message}
                      </p>
                    </div>
                    <div>
                      {notification.type?.replace('_', ' ').toUpperCase()}
                    </div>
                    {notification.metadata && (
                      <div className="mt-2 text-xs text-gray-500">
                        <strong>Metadata:</strong> {JSON.stringify(notification.metadata)}
                      </div>
                    )}
                    <div>
                      <span>{notification.status?.toUpperCase()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Send className="w-5 h-5 text-primary-600" />
          <span>Quick Actions</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Send Bulk Attendance</p>
              <p className="text-sm text-gray-600">Notify all parents about today's attendance</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <div className="bg-green-100 p-2 rounded-lg">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Send Announcement</p>
              <p className="text-sm text-gray-600">Broadcast important information</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Emergency Alert</p>
              <p className="text-sm text-gray-600">Send urgent notifications</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;