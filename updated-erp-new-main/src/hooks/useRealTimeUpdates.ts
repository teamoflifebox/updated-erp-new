import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { realTimeService, RealTimeEvent } from '../services/realTimeService';

export const useRealTimeUpdates = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<RealTimeEvent | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      // Connect to real-time service
      realTimeService.connect(user.id);

      // Request notification permission
      realTimeService.requestNotificationPermission();

      // Listen for connection status
      const handleConnectionStatus = (data: any) => {
        setIsConnected(data.connected);
        setConnectionError(data.error || null);
      };

      // Listen for real-time events
      const handleAttendanceUpdate = (data: any) => {
        setLastUpdate({
          type: 'attendance_update',
          data,
          timestamp: new Date(),
        });
      };

      const handleFeePayment = (data: any) => {
        setLastUpdate({
          type: 'fee_payment',
          data,
          timestamp: new Date(),
        });
      };

      const handleMarksUpdate = (data: any) => {
        setLastUpdate({
          type: 'marks_update',
          data,
          timestamp: new Date(),
        });
      };

      const handleNotification = (data: any) => {
        setLastUpdate({
          type: 'notification',
          data,
          timestamp: new Date(),
        });
      };

      const handleEmergency = (data: any) => {
        setLastUpdate({
          type: 'emergency',
          data,
          timestamp: new Date(),
        });
      };

      // Register event listeners
      realTimeService.on('connection_status', handleConnectionStatus);
      realTimeService.on('attendance_update', handleAttendanceUpdate);
      realTimeService.on('fee_payment', handleFeePayment);
      realTimeService.on('marks_update', handleMarksUpdate);
      realTimeService.on('notification', handleNotification);
      realTimeService.on('emergency', handleEmergency);

      // Start simulation for demo purposes
      realTimeService.simulateRealTimeData();

      return () => {
        // Cleanup
        realTimeService.off('connection_status', handleConnectionStatus);
        realTimeService.off('attendance_update', handleAttendanceUpdate);
        realTimeService.off('fee_payment', handleFeePayment);
        realTimeService.off('marks_update', handleMarksUpdate);
        realTimeService.off('notification', handleNotification);
        realTimeService.off('emergency', handleEmergency);
        realTimeService.disconnect();
        setIsConnected(false);
      };
    }
  }, [user?.id]);

  // Manually trigger real-time updates for demo
  const triggerUpdate = (type: string, data: any) => {
    switch (type) {
      case 'attendance':
        realTimeService.sendAttendanceUpdate(data.studentId, data.isPresent, data.subject, data.date);
        break;
      case 'fee':
        realTimeService.sendFeePayment(data.studentId, data.amount, data.receiptNumber);
        break;
      case 'marks':
        realTimeService.sendMarksUpdate(data.studentId, data.subject, data.marks, data.examType);
        break;
      case 'notification':
        realTimeService.sendNotification(data.title, data.message, data.recipients);
        break;
      case 'emergency':
        realTimeService.sendEmergencyAlert(data.message, data.studentIds);
        break;
    }
  };

  return {
    isConnected,
    lastUpdate,
    connectionError,
    triggerUpdate,
  };
};