import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import websocketService from '../services/websocketService';
import { supabase } from '../lib/supabase';
import useAnalyticsStore, { AnalyticsUpdate } from '../store/analyticsStore';

export const useRealTimeAnalytics = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<AnalyticsUpdate | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  
  const analyticsStore = useAnalyticsStore();

  useEffect(() => {
    if (!user?.id) return;
    
    // Set up real-time subscription to analytics updates
    const analyticsSubscription = supabase
      .channel('analytics-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'analytics_updates'
      }, (payload) => {
        // Transform the payload to match AnalyticsUpdate type
        const update: AnalyticsUpdate = {
          id: payload.new.id,
          timestamp: new Date(payload.new.created_at),
          userId: payload.new.user_id,
          userName: payload.new.user_name,
          userRole: payload.new.user_role,
          metricType: payload.new.metric_type,
          metricName: payload.new.metric_name,
          previousValue: payload.new.previous_value,
          newValue: payload.new.new_value,
          percentageChange: payload.new.percentage_change,
          department: payload.new.department
        };
        
        setLastUpdate(update);
        analyticsStore.updateMetric(update);
      })
      .subscribe();

    // Connect to WebSocket service
    websocketService.connect(user.id, user.role);

    // Listen for connection status
    const handleConnectionStatus = (data: any) => {
      setIsConnected(data.connected);
      setConnectionError(data.error || null);
    };

    // Listen for analytics updates
    const handleAnalyticsUpdate = (data: AnalyticsUpdate) => {
      setLastUpdate(data);
    };

    // Listen for fallback mode
    const handleFallbackMode = (data: any) => {
      setIsFallbackMode(data.active);
    };

    // Register event listeners
    websocketService.on('connection_status', handleConnectionStatus);
    websocketService.on('analytics_update', handleAnalyticsUpdate);
    websocketService.on('fallback_mode', handleFallbackMode);
    
    // Load initial analytics data
    const loadInitialData = async () => {
      try {
        // Get recent analytics updates
        const { data, error } = await supabase
          .from('analytics_updates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          console.error('Error loading analytics data:', error);
          return;
        }
        
        // Transform and add to store
        const updates = data.map(item => ({
          id: item.id,
          timestamp: new Date(item.created_at),
          userId: item.user_id,
          userName: item.user_name,
          userRole: item.user_role,
          metricType: item.metric_type,
          metricName: item.metric_name,
          previousValue: item.previous_value,
          newValue: item.new_value,
          percentageChange: item.percentage_change,
          department: item.department
        }));
        
        // Add to audit log
        analyticsStore.setAuditLog(updates);
      } catch (error) {
        console.error('Error loading initial analytics data:', error);
      }
    };
    
    loadInitialData();

    // Start simulation for demo purposes
    websocketService.simulateUpdates();

    return () => {
      // Cleanup
      websocketService.off('connection_status', handleConnectionStatus);
      websocketService.off('analytics_update', handleAnalyticsUpdate);
      websocketService.off('fallback_mode', handleFallbackMode);
      analyticsSubscription.unsubscribe();
      websocketService.disconnect();
    };
  }, [user?.id, user?.role]);

  // Function to send analytics update
  const sendAnalyticsUpdate = (update: Omit<AnalyticsUpdate, 'id' | 'timestamp'>) => {
    return websocketService.sendAnalyticsUpdate({
      ...update,
      userId: user?.id || 'unknown',
      userName: user?.name || 'Unknown User',
      userRole: user?.role || 'unknown'
    });
  };

  return {
    isConnected,
    connectionError,
    lastUpdate,
    isFallbackMode,
    sendAnalyticsUpdate,
    recentUpdates: analyticsStore.recentUpdates,
    auditLog: analyticsStore.auditLog,
    clearRecentUpdates: analyticsStore.clearRecentUpdates
  };
};