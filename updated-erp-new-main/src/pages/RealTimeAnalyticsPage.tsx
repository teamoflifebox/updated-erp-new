import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import RealTimeDashboard from '../components/Analytics/RealTimeDashboard';
import UpdateNotification from '../components/Analytics/UpdateNotification';
import AuditLogViewer from '../components/Analytics/AuditLogViewer';
import MetricUpdateForm from '../components/Analytics/MetricUpdateForm';
import ConnectionStatusBar from '../components/Analytics/ConnectionStatusBar';
import { useRealTimeAnalytics } from '../hooks/useRealTimeAnalytics';
import { useAuth } from '../context/AuthContext';
import { AnalyticsUpdate } from '../store/analyticsStore';
import { Plus, History, RefreshCw } from 'lucide-react';

const RealTimeAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    isConnected, 
    connectionError, 
    lastUpdate, 
    isFallbackMode,
    sendAnalyticsUpdate,
    recentUpdates,
    auditLog
  } = useRealTimeAnalytics();
  
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [notifications, setNotifications] = useState<AnalyticsUpdate[]>([]);
  
  const canUpdateMetrics = ['hod', 'principal', 'director'].includes(user?.role || '');
  
  // Add new updates to notifications
  useEffect(() => {
    if (lastUpdate) {
      setNotifications(prev => [...prev, lastUpdate]);
    }
  }, [lastUpdate]);
  
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  const handleSubmitUpdate = (update: Omit<AnalyticsUpdate, 'id' | 'timestamp'>) => {
    sendAnalyticsUpdate(update);
  };
  
  const handleReconnect = () => {
    // Reconnect to WebSocket
    if (user?.id) {
      // This would typically reconnect the WebSocket
      window.location.reload(); // Simple reload for demo purposes
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Connection Status Bar */}
        <ConnectionStatusBar
          isConnected={isConnected}
          isFallbackMode={isFallbackMode}
          connectionError={connectionError}
          onReconnect={handleReconnect}
          lastUpdateTime={lastUpdate?.timestamp || null}
        />
        
        {/* Action Buttons */}
        {canUpdateMetrics && (
          <div className="flex justify-end mb-6 space-x-3">
            <button
              onClick={() => setShowAuditLog(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <History className="w-4 h-4" />
              <span>View Audit Log</span>
            </button>
            <button
              onClick={() => setShowUpdateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Update Metric</span>
            </button>
          </div>
        )}
        
        {/* Main Dashboard */}
        <RealTimeDashboard />
        
        {/* Update Notifications */}
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <UpdateNotification
              key={notification.id}
              update={notification}
              onDismiss={() => handleDismissNotification(notification.id)}
              autoHideDuration={5000 + (index * 1000)} // Stagger notifications
            />
          ))}
        </AnimatePresence>
        
        {/* Metric Update Form */}
        <AnimatePresence>
          {showUpdateForm && (
            <MetricUpdateForm
              onClose={() => setShowUpdateForm(false)}
              onSubmit={handleSubmitUpdate}
            />
          )}
        </AnimatePresence>
        
        {/* Audit Log Viewer */}
        <AnimatePresence>
          {showAuditLog && (
            <AuditLogViewer
              auditLog={auditLog}
              onClose={() => setShowAuditLog(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default RealTimeAnalyticsPage;