import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import { 
  Bell, 
  Send, 
  Users, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  X,
  Filter,
  Search,
  Paperclip,
  Upload,
  File
} from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'send'>('received');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Fee Payment Reminder',
      message: 'Your quarterly fee payment is due by the end of this month. Please make the payment to avoid late fees.',
      type: 'warning' as const,
      date: '2024-01-15',
      time: '10:30 AM',
      read: false,
      sender: 'Finance Department',
      audience: 'Students',
      hasAttachment: false
    },
    {
      id: '2',
      title: 'New Course Materials Available',
      message: 'New study materials for Data Structures and Algorithms have been uploaded to the portal.',
      type: 'info' as const,
      date: '2024-01-14',
      time: '2:15 PM',
      read: true,
      sender: 'Dr. Sarah Johnson',
      audience: 'CS Students',
      hasAttachment: true
    },
    {
      id: '3',
      title: 'Exam Schedule Released',
      message: 'Mid-semester examination schedule has been released. Check the academic calendar for details.',
      type: 'announcement' as const,
      date: '2024-01-12',
      time: '9:00 AM',
      read: true,
      sender: 'Academic Office',
      audience: 'All Students',
      hasAttachment: true
    },
    {
      id: '4',
      title: 'Library Maintenance',
      message: 'The library will be closed for maintenance on January 20th. Plan your study schedule accordingly.',
      type: 'warning' as const,
      date: '2024-01-10',
      time: '4:45 PM',
      read: false,
      sender: 'Library Administration',
      audience: 'All Users',
      hasAttachment: false
    },
    {
      id: '5',
      title: 'Faculty Meeting Scheduled',
      message: 'Department faculty meeting scheduled for January 25th at 3:00 PM in Conference Room A.',
      type: 'info' as const,
      date: '2024-01-08',
      time: '11:20 AM',
      read: true,
      sender: 'Prof. Michael Brown',
      audience: 'Faculty',
      hasAttachment: false
    },
    {
      id: '6',
      title: 'System Maintenance Complete',
      message: 'The ERP system maintenance has been completed successfully. All services are now operational.',
      type: 'success' as const,
      date: '2024-01-05',
      time: '8:00 AM',
      read: true,
      sender: 'IT Department',
      audience: 'All Users',
      hasAttachment: false
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    audience: 'all',
    type: 'info' as 'info' | 'warning' | 'success' | 'error' | 'announcement'
  });

  const canSendNotifications = ['hod', 'principal', 'director', 'faculty'].includes(user?.role || '');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'error': return X;
      case 'announcement': return MessageSquare;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'announcement': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendNotification = () => {
    const newNotif = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      sender: user?.name || 'Unknown',
      audience: newNotification.audience,
      hasAttachment: attachedFiles.length > 0
    };

    setNotifications(prev => [newNotif, ...prev]);
    setNewNotification({
      title: '',
      message: '',
      audience: 'all',
      type: 'info'
    });
    setAttachedFiles([]);
    alert('Notification sent successfully!');
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important announcements and messages</p>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-3xl font-bold text-red-600">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-green-600">
                  {notifications.filter(n => new Date(n.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
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
                <p className="text-sm font-medium text-gray-600">Important</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {notifications.filter(n => n.type === 'warning' || n.type === 'error').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {canSendNotifications && (
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('received')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === 'received'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Bell className="w-4 h-4 inline-block mr-2" />
                  Received Notifications
                </button>
                <button
                  onClick={() => setActiveTab('send')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === 'send'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Send className="w-4 h-4 inline-block mr-2" />
                  Send Notification
                </button>
              </nav>
            </div>
          )}

          <div className="p-6">
            {activeTab === 'received' || !canSendNotifications ? (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Showing {filteredNotifications.length} of {notifications.length} notifications
                    </span>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                  {filteredNotifications.map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                          notification.read ? 'bg-gray-50' : 'bg-white shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notification.title}
                                {notification.hasAttachment && (
                                  <Paperclip className="w-4 h-4 inline-block ml-2 text-gray-400" />
                                )}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{notification.date} at {notification.time}</span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'} mb-2`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>From: {notification.sender}</span>
                                <span>To: {notification.audience}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter notification title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your message..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audience
                    </label>
                    <select
                      value={newNotification.audience}
                      onChange={(e) => setNewNotification({ ...newNotification, audience: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students Only</option>
                      <option value="faculty">Faculty Only</option>
                      <option value="department">My Department</option>
                      <option value="year1">1st Year Students</option>
                      <option value="year2">2nd Year Students</option>
                      <option value="year3">3rd Year Students</option>
                      <option value="year4">4th Year Students</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="error">Urgent</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                </div>

                {/* File Attachment Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or click to select
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Choose Files
                      </label>
                    </div>
                    
                    {/* Attached Files List */}
                    {attachedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <File className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleSendNotification}
                    disabled={!newNotification.title || !newNotification.message}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Notification</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewNotification({ title: '', message: '', audience: 'all', type: 'info' });
                      setAttachedFiles([]);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear Form
                  </button>
                </div>

                {/* Preview */}
                {(newNotification.title || newNotification.message) && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                    <div className={`p-4 rounded-lg border ${getNotificationColor(newNotification.type)}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getNotificationColor(newNotification.type)}`}>
                          {React.createElement(getNotificationIcon(newNotification.type), { className: "w-4 h-4" })}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {newNotification.title || 'Notification Title'}
                            {attachedFiles.length > 0 && (
                              <Paperclip className="w-4 h-4 inline-block ml-2 text-gray-400" />
                            )}
                          </h4>
                          <p className="text-sm text-gray-700 mb-2">
                            {newNotification.message || 'Notification message will appear here...'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>From: {user?.name}</span>
                            <span>To: {newNotification.audience}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NotificationsPage;