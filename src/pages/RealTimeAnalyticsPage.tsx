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
import { Plus, History } from 'lucide-react';

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
    if (user?.id) {
      window.location.reload();
    }
  };

  return (
    <Layout>
      {/* Fixed background and lighter glass overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1634097537825-b446635b2f7f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Lighter overlay for more visible background */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1.5px]" />
      </div>

      {/* Main content with lighter glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-start px-2 py-8"
      >
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Connection Status Bar */}
          <div className="bg-white/70 backdrop-blur rounded-xl shadow border border-white/40 p-0">
            <ConnectionStatusBar
              isConnected={isConnected}
              isFallbackMode={isFallbackMode}
              connectionError={connectionError}
              onReconnect={handleReconnect}
              lastUpdateTime={lastUpdate?.timestamp || null}
            />
          </div>

          {/* Action Buttons */}
          {canUpdateMetrics && (
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => setShowAuditLog(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 bg-white/70 text-gray-700 rounded-lg hover:bg-blue-50 transition-colors shadow"
              >
                <History className="w-4 h-4" />
                <span>View Audit Log</span>
              </button>
              <button
                onClick={() => setShowUpdateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Update Metric</span>
              </button>
            </div>
          )}

          {/* Main Dashboard */}
          <div className="bg-white/75 backdrop-blur rounded-2xl shadow border border-white/40 p-6">
            <RealTimeDashboard />
          </div>
        </div>

        {/* Update Notifications */}
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <UpdateNotification
              key={notification.id}
              update={notification}
              onDismiss={() => handleDismissNotification(notification.id)}
              autoHideDuration={5000 + (index * 1000)}
            />
          ))}
        </AnimatePresence>

        {/* Metric Update Form */}
        <AnimatePresence>
          {showUpdateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
              >
                <MetricUpdateForm
                  onClose={() => setShowUpdateForm(false)}
                  onSubmit={handleSubmitUpdate}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Audit Log Viewer */}
        <AnimatePresence>
          {showAuditLog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4"
              >
                <AuditLogViewer
                  auditLog={auditLog}
                  onClose={() => setShowAuditLog(false)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default RealTimeAnalyticsPage;
