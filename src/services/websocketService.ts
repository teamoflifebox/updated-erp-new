import { AnalyticsUpdate } from '../store/analyticsStore';
import { supabase } from '../lib/supabase';

class WebSocketService {
  private eventHandlers: Map<string, Function[]> = new Map();
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error' = 'connected';

  // Initialize the WebSocket connection
  connect(userId: string, userRole: string) {
    console.log('Mock WebSocket service initialized');
    this.connectionStatus = 'connected';
    
    // Simulate successful connection
    setTimeout(() => {
      this.triggerEvent('connection_status', { 
        connected: true, 
        status: this.connectionStatus 
      });
    }, 500);
  }

  // Disconnect the WebSocket
  disconnect() {
    this.connectionStatus = 'disconnected';
    this.triggerEvent('connection_status', { 
      connected: false, 
      status: this.connectionStatus 
    });
  }

  // Event subscription methods
  on(event: string, callback: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private triggerEvent(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event handler:`, error);
        }
      });
    }
  }

  // Send analytics update to the server
  async sendAnalyticsUpdate(update: Omit<AnalyticsUpdate, 'id' | 'timestamp'>) {
    try {
      // Create a complete update with ID and timestamp
      const completeUpdate = {
        ...update,
        id: crypto.randomUUID(), 
        timestamp: new Date()
      };
      
      // Save to database
      try {
        const { data, error } = await supabase
          .from('analytics_updates')
          .insert({
            id: completeUpdate.id,
            user_id: completeUpdate.userId,
            user_name: completeUpdate.userName,
            user_role: completeUpdate.userRole,
            metric_type: completeUpdate.metricType,
            metric_name: completeUpdate.metricName,
            previous_value: completeUpdate.previousValue,
            new_value: completeUpdate.newValue,
            percentage_change: completeUpdate.percentageChange,
            department: completeUpdate.department
          });
          
        if (error) {
          console.error('Error saving analytics update:', error);
          return false;
        }
        
        // Trigger event (will be handled by real-time subscription)
        this.triggerEvent('analytics_update', completeUpdate);
      } catch (error) {
        console.error('Error saving analytics update:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to send analytics update:', error);
      return false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: true,
      status: this.connectionStatus
    };
  }

  // Simulate real-time updates for demo purposes
  simulateUpdates() {
    console.log('Starting analytics simulation');

    // Fetch initial analytics data
    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from('analytics_metrics')
          .select('*');
          
        if (error) {
          console.error('Error fetching analytics metrics:', error);
          return;
        }
        
        // If no metrics exist, create initial ones
        if (data.length === 0) {
          // Create initial metrics
          const initialMetrics = [
            { metric_type: 'enrollment', metric_name: 'totalStudents', value: 2847 },
            { metric_type: 'enrollment', metric_name: 'totalFaculty', value: 156 },
            { metric_type: 'attendance', metric_name: 'year1', value: 87, department: 'Computer Science' },
            { metric_type: 'attendance', metric_name: 'year2', value: 89, department: 'Computer Science' },
            { metric_type: 'attendance', metric_name: 'year3', value: 85, department: 'Computer Science' },
            { metric_type: 'attendance', metric_name: 'year4', value: 91, department: 'Computer Science' },
            { metric_type: 'attendance', metric_name: 'year1', value: 92, department: 'AI & ML' },
            { metric_type: 'attendance', metric_name: 'year2', value: 88, department: 'AI & ML' },
            { metric_type: 'attendance', metric_name: 'year3', value: 90, department: 'AI & ML' },
            { metric_type: 'attendance', metric_name: 'year4', value: 89, department: 'AI & ML' },
            { metric_type: 'fees', metric_name: 'monthlyBilling', value: 515000 }
          ];
          
          await supabase.from('analytics_metrics').insert(initialMetrics);
        }
      } catch (error) {
        console.error('Error initializing analytics data:', error);
      }
    };
    
    fetchInitialData();
    
    // Set up real-time subscription to analytics_updates
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
        
        this.triggerEvent('analytics_update', update);
      })
      .subscribe();
      
    // Simulate updates periodically
    const simulateUpdate = async () => {
      if (Math.random() > 0.7 && this.connectionStatus === 'connected') {
        try {
          // Get a random metric to update
          const { data: metrics, error } = await supabase
            .from('analytics_metrics')
            .select('*');
            
          if (error || !metrics || metrics.length === 0) {
            console.error('Error fetching metrics:', error);
            return;
          }
          
          const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
          
          // Generate a random change
          const previousValue = randomMetric.value;
          const change = Math.floor(Math.random() * 10) - 3; // Random change between -3 and +6
          const newValue = previousValue + change;
          
          // Create update
          const update = {
            id: crypto.randomUUID(),
            user_id: 'system',
            user_name: 'System',
            user_role: 'system',
            metric_type: randomMetric.metric_type,
            metric_name: randomMetric.metric_name,
            previous_value: previousValue,
            new_value: newValue,
            percentage_change: ((newValue - previousValue) / previousValue) * 100,
            department: randomMetric.department
          };
          
          // Insert update
          await supabase.from('analytics_updates').insert(update);
          
          // Update metric value
          await supabase
            .from('analytics_metrics')
            .update({ value: newValue, last_updated: new Date().toISOString() })
            .eq('id', randomMetric.id);
        } catch (error) {
          console.error('Error simulating update:', error);
        }
      }
    };
    
    // Run simulation every 30 seconds
    const simulationInterval = setInterval(simulateUpdate, 30000);
    
    // Return cleanup function
    return () => {
      clearInterval(simulationInterval);
      analyticsSubscription.unsubscribe();
    };
  }
}

export const websocketService = new WebSocketService();
export default websocketService;