import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import {
  Bell,
  Send,
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
    },
    {
      id: '7',
      title: 'Admin Policy Update',
      message: 'Admin panel policies have been updated. Please review the changes.',
      type: 'info' as const,
      date: '2024-01-04',
      time: '5:00 PM',
      read: false,
      sender: 'Principal',
      audience: 'Admin',
      hasAttachment: false
    },
    {
      id: '8',
      title: 'Principal’s Address',
      message: 'Principal will address all faculty and HODs on Friday at 10am.',
      type: 'announcement' as const,
      date: '2024-01-03',
      time: '10:00 AM',
      read: false,
      sender: 'Principal',
      audience: 'Faculty, HOD',
      hasAttachment: false
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    audience: 'all',
    type: 'info' as 'info' | 'warning' | 'success' | 'error' | 'announcement'
  });

  const canSendNotifications = ['hod', 'principal', 'director', 'faculty'].includes(user?.role?.toLowerCase() || '');

  // Role-based notification filtering
  const role = user?.role?.toLowerCase();

  function isNotificationForUser(notification) {
    const audience = (notification.audience || '').toLowerCase();

    if (audience === 'all users') return true;
    if (audience === 'all students' && role === 'student') return true;
    if (audience === 'all faculty' && role === 'faculty') return true;
    if (audience === 'admin' && role === 'admin') return true;
    if (audience === 'faculty' && role === 'faculty') return true;
    if (audience === 'students' && role === 'student') return true;
    if (audience === 'hod' && role === 'hod') return true;
    if (audience === 'principal' && role === 'principal') return true;
    if (audience === 'director' && role === 'director') return true;
    // For more specific audiences, like "CS Students" or "AI Faculty"
    if (role && audience.includes(role)) return true;
    // For comma-separated audiences
    if (audience.split(',').map(a => a.trim()).includes(role)) return true;
    return false;
  }

  const roleBasedNotifications = notifications.filter(isNotificationForUser);

  const filteredNotifications = roleBasedNotifications.filter(notification => {
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
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'announcement': return 'text-purple-500';
      default: return 'text-blue-500';
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
      {/* Fixed background and overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1584543515885-b8981dbf0b5d?w=1200&q=80&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex flex-col items-center justify-center relative z-10"
      >
        <div className="w-full max-w-3xl mx-auto py-10">

          {/* Header section with solid background */}
          <div className="mb-8">
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 px-6 py-5 flex flex-col items-start">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Stay updated with important announcements and messages</p>
            </div>
            <div className="h-2" />
            <hr className="border-t-2 border-gray-200" />
          </div>

          {/* Notification Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/60 rounded-lg border border-gray-100 p-4 flex flex-col items-center shadow-sm">
              <Bell className="w-5 h-5 text-blue-400 mb-2" />
              <span className="text-xs text-gray-600 mb-1">Total</span>
              <span className="text-xl font-semibold text-gray-900">{filteredNotifications.length}</span>
            </div>
            <div className="bg-white/60 rounded-lg border border-gray-100 p-4 flex flex-col items-center shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
              <span className="text-xs text-gray-600 mb-1">Unread</span>
              <span className="text-xl font-semibold text-red-500">
                {filteredNotifications.filter(n => !n.read).length}
              </span>
            </div>
            <div className="bg-white/60 rounded-lg border border-gray-100 p-4 flex flex-col items-center shadow-sm">
              <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
              <span className="text-xs text-gray-600 mb-1">This Week</span>
              <span className="text-xl font-semibold text-green-500">
                {filteredNotifications.filter(n => new Date(n.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </span>
            </div>
            <div className="bg-white/60 rounded-lg border border-gray-100 p-4 flex flex-col items-center shadow-sm">
              <MessageSquare className="w-5 h-5 text-yellow-400 mb-2" />
              <span className="text-xs text-gray-600 mb-1">Important</span>
              <span className="text-xl font-semibold text-yellow-500">
                {filteredNotifications.filter(n => n.type === 'warning' || n.type === 'error').length}
              </span>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg border border-gray-100 shadow-sm">
            {canSendNotifications && (
              <div className="border-b border-gray-100">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('received')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'received'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Bell className="w-4 h-4 inline-block mr-2" />
                    Received
                  </button>
                  <button
                    onClick={() => setActiveTab('send')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                      activeTab === 'send'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Send className="w-4 h-4 inline-block mr-2" />
                    Send
                  </button>
                </nav>
              </div>
            )}
            <div className="p-6">
              {activeTab === 'received' || !canSendNotifications ? (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-transparent bg-white/60"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-transparent bg-white/60"
                      >
                        <option value="all">All Types</option>
                        <option value="info">Information</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                        <option value="announcement">Announcement</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-sm text-gray-400">
                        {filteredNotifications.length} / {roleBasedNotifications.length} shown
                      </span>
                    </div>
                  </div>
                  {/* Notifications List */}
                  <div className="space-y-3">
                    {filteredNotifications.map((notification, index) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.07 }}
                          className={`flex items-start gap-3 p-4 rounded-md border border-gray-100 shadow-sm bg-white/70 hover:bg-white/80 transition ${
                            notification.read ? 'opacity-80' : 'opacity-100'
                          }`}
                        >
                          <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${notification.read ? 'text-gray-500' : 'text-gray-800'}`}>
                                {notification.title}
                                {notification.hasAttachment && (
                                  <Paperclip className="w-4 h-4 inline-block ml-2 text-gray-300" />
                                )}
                              </h4>
                              <span className="text-xs text-gray-400">{notification.date} {notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span>From: {notification.sender}</span>
                                <span>To: {notification.audience}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-blue-500 hover:underline"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-red-400 hover:underline"
                                >
                                  Delete
                                </button>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notification Title
                    </label>
                    <input
                      type="text"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-transparent bg-white/60"
                      placeholder="Enter notification title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-transparent bg-white/60"
                      placeholder="Enter your message..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Audience
                      </label>
                      <select
                        value={newNotification.audience}
                        onChange={(e) => setNewNotification({ ...newNotification, audience: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-transparent bg-white/60"
                      >
                        <option value="all users">All Users</option>
                        <option value="students">Students Only</option>
                        <option value="faculty">Faculty Only</option>
                        <option value="admin">Admins Only</option>
                        <option value="hod">HOD Only</option>
                        <option value="principal">Principal Only</option>
                        <option value="director">Director Only</option>
                        <option value="cs students">CS Students</option>
                        <option value="ai faculty">AI Faculty</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={newNotification.type}
                        onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-transparent bg-white/60"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-md p-4 bg-white/60">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 mb-2">
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
                          className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
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
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                              <div className="flex items-center space-x-2">
                                <File className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:text-red-600"
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
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Notification</span>
                    </button>
                    <button
                      onClick={() => {
                        setNewNotification({ title: '', message: '', audience: 'all', type: 'info' });
                        setAttachedFiles([]);
                      }}
                      className="px-6 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Clear Form
                    </button>
                  </div>
                  {/* Preview */}
                  {(newNotification.title || newNotification.message) && (
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                      <div className={`p-4 rounded-md border border-gray-100 bg-white/60 flex items-start gap-3`}>
                        <div className={`mt-1 ${getNotificationColor(newNotification.type)}`}>
                          {React.createElement(getNotificationIcon(newNotification.type), { className: "w-4 h-4" })}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {newNotification.title || 'Notification Title'}
                            {attachedFiles.length > 0 && (
                              <Paperclip className="w-4 h-4 inline-block ml-2 text-gray-300" />
                            )}
                          </h4>
                          <p className="text-sm text-gray-700 mb-2">
                            {newNotification.message || 'Notification message will appear here...'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>From: {user?.name}</span>
                            <span>To: {newNotification.audience}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NotificationsPage;
