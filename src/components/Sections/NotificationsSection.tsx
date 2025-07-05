import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Send, Users, MessageSquare, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const NotificationsSection: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'send'>('received');
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '', 
    audience: 'all',
    type: 'info' as 'info' | 'warning' | 'success' | 'error'
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const canSendNotifications = ['hod', 'principal', 'director'].includes(user?.role || '');
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get notifications for the user
        let query;
        
        if (['hod', 'principal', 'director'].includes(user.role)) {
          // Admins can see all notifications
          query = supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });
        } else {
          // Regular users see their own notifications
          query = supabase
            .from('user_notifications')
            .select(`
              *,
              notification:notification_id (*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }
        
        // Format notifications
        let formattedNotifications;
        
        if (['hod', 'principal', 'director'].includes(user.role)) {
          formattedNotifications = data.map(notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            date: new Date(notification.created_at).toISOString().split('T')[0],
            read: notification.read,
            sender: notification.sender || 'System',
            audience: notification.audience || 'All Users'
          }));
        } else {
          formattedNotifications = data.map(userNotification => ({
            id: userNotification.notification.id,
            title: userNotification.notification.title,
            message: userNotification.notification.message,
            type: userNotification.notification.type,
            date: new Date(userNotification.notification.created_at).toISOString().split('T')[0],
            read: userNotification.read,
            sender: userNotification.notification.sender || 'System',
            audience: userNotification.notification.audience || 'All Users'
          }));
        }
        
        setNotifications(formattedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'error': return X;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleSendNotification = async () => {
    console.log('Sending notification:', newNotification);
    
    try {
      // Create notification in database
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          sender: user?.name || 'Unknown',
          audience: newNotification.audience
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating notification:', error);
        alert('Failed to send notification. Please try again.');
        return;
      }
      
      // Create user_notifications entries based on audience
      if (newNotification.audience === 'all') {
        // Get all users
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id');
          
        if (usersError) {
          console.error('Error fetching users:', usersError);
        } else {
          // Create user_notifications for all users
          const userNotifications = users.map(user => ({
            user_id: user.id,
            notification_id: data.id
          }));
          
          const { error: insertError } = await supabase
            .from('user_notifications')
            .insert(userNotifications);
            
          if (insertError) {
            console.error('Error creating user notifications:', insertError);
          }
        }
      } else if (newNotification.audience === 'students') {
        // Get all student users
        const { data: students, error: studentsError } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'student');
          
        if (studentsError) {
          console.error('Error fetching students:', studentsError);
        } else {
          // Create user_notifications for students
          const userNotifications = students.map(student => ({
            user_id: student.id,
            notification_id: data.id
          }));
          
          const { error: insertError } = await supabase
            .from('user_notifications')
            .insert(userNotifications);
            
          if (insertError) {
            console.error('Error creating user notifications:', insertError);
          }
        }
      } else if (newNotification.audience === 'faculty') {
        // Get all faculty users
        const { data: faculty, error: facultyError } = await supabase
          .from('users')
          .select('id')
          .eq('role', 'faculty');
          
        if (facultyError) {
          console.error('Error fetching faculty:', facultyError);
        } else {
          // Create user_notifications for faculty
          const userNotifications = faculty.map(faculty => ({
            user_id: faculty.id,
            notification_id: data.id
          }));
          
          const { error: insertError } = await supabase
            .from('user_notifications')
            .insert(userNotifications);
            
          if (insertError) {
            console.error('Error creating user notifications:', insertError);
          }
        }
      } else if (newNotification.audience === 'department') {
        // Get users in the same department
        const { data: departmentUsers, error: deptError } = await supabase
          .from('users')
          .select('id')
          .eq('department', user?.department);
          
        if (deptError) {
          console.error('Error fetching department users:', deptError);
        } else {
          // Create user_notifications for department users
          const userNotifications = departmentUsers.map(deptUser => ({
            user_id: deptUser.id,
            notification_id: data.id
          }));
          
          const { error: insertError } = await supabase
            .from('user_notifications')
            .insert(userNotifications);
            
          if (insertError) {
            console.error('Error creating user notifications:', insertError);
          }
        }
      }
      
      // Reset form
      setNewNotification({
        title: '',
        message: '',
        audience: 'all',
        type: 'info'
      });
      
      // Add the new notification to the list
      setNotifications([
        {
          id: data.id,
          title: data.title,
          message: data.message,
          type: data.type,
          date: new Date(data.created_at).toISOString().split('T')[0],
          read: false,
          sender: data.sender,
          audience: data.audience
        },
        ...notifications
      ]);
      
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification. Please try again.');
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      if (['hod', 'principal', 'director'].includes(user?.role || '')) {
        // Update notification directly
        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notificationId);
          
        if (error) {
          console.error('Error marking notification as read:', error);
          return;
        }
      } else {
        // Update user_notification
        const { error } = await supabase
          .from('user_notifications')
          .update({ read: true })
          .eq('notification_id', notificationId)
          .eq('user_id', user?.id);
          
        if (error) {
          console.error('Error marking notification as read:', error);
          return;
        }
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      if (['hod', 'principal', 'director'].includes(user?.role || '')) {
        // Delete notification completely
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId);
          
        if (error) {
          console.error('Error deleting notification:', error);
          return;
        }
      } else {
        // Delete user_notification
        const { error } = await supabase
          .from('user_notifications')
          .delete()
          .eq('notification_id', notificationId)
          .eq('user_id', user?.id);
          
        if (error) {
          console.error('Error deleting notification:', error);
          return;
        }
      }
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600">Stay updated with important announcements and messages.</p>
      </div>

      {canSendNotifications && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                Received
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

          <div className="p-6">
            {activeTab === 'received' ? (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                ) : notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
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
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">{notification.date}</span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'} mb-2`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">From: {notification.sender}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
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
                    </select>
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
                    onClick={() => setNewNotification({ title: '', message: '', audience: 'all', type: 'info' })}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!canSendNotifications && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications found</p>
              </div>
            ) : notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
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
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{notification.date}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'} mb-2`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">From: {notification.sender}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;