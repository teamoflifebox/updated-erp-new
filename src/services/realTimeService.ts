export interface RealTimeEvent {
  type: 'attendance_update' | 'fee_payment' | 'marks_update' | 'notification' | 'emergency';
  data: any;
  timestamp: Date;
  userId?: string;
  studentId?: string;
}

class RealTimeService {
  private eventListeners: Map<string, Function[]> = new Map();
  private isConnected = true;

  connect(userId: string) {
    console.log('Mock real-time service connected for user:', userId);
    this.isConnected = true;
    this.emit('connection_status', { connected: true });
  }

  disconnect() {
    console.log('Mock real-time service disconnected');
    this.isConnected = false;
    this.emit('connection_status', { connected: false });
  }

  // Event emitter methods
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Send real-time updates
  sendAttendanceUpdate(studentId: string, isPresent: boolean, subject: string, date: string) {
    if (this.isConnected) {
      this.emit('attendance_update', {
        studentId,
        isPresent,
        subject,
        date,
        timestamp: new Date(),
      });
    }
  }

  sendFeePayment(studentId: string, amount: number, receiptNumber: string) {
    if (this.isConnected) {
      this.emit('fee_payment', {
        studentId,
        amount,
        receiptNumber,
        timestamp: new Date(),
      });
    }
  }

  sendMarksUpdate(studentId: string, subject: string, marks: number, examType: string) {
    if (this.isConnected) {
      this.emit('marks_update', {
        studentId,
        subject,
        marks,
        examType,
        timestamp: new Date(),
      });
    }
  }

  sendEmergencyAlert(message: string, studentIds?: string[]) {
    if (this.isConnected) {
      this.emit('emergency', {
        message,
        studentIds,
        timestamp: new Date(),
      });
    }
  }

  sendNotification(title: string, message: string, recipients: string[]) {
    if (this.isConnected) {
      this.emit('notification', {
        title,
        message,
        recipients,
        timestamp: new Date(),
      });
    }
  }

  // Browser notification
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }

  // Simulate real-time data for demo
  simulateRealTimeData() {
    if (!this.isConnected) return;

    // Simulate attendance updates
    setInterval(() => {
      if (Math.random() > 0.8) {
        this.emit('attendance_update', {
          studentName: 'John Doe',
          isPresent: Math.random() > 0.3,
          subject: 'Mathematics',
          timestamp: new Date()
        });
      }
    }, 30000);

    // Simulate fee payments
    setInterval(() => {
      if (Math.random() > 0.9) {
        this.emit('fee_payment', {
          studentName: 'Jane Smith',
          amount: 5000,
          receiptNumber: `RCP${Date.now()}`,
          timestamp: new Date()
        });
      }
    }, 45000);

    // Simulate marks updates
    setInterval(() => {
      if (Math.random() > 0.85) {
        this.emit('marks_update', {
          studentName: 'Mike Johnson',
          subject: 'Physics',
          marks: Math.floor(Math.random() * 40) + 60,
          timestamp: new Date()
        });
      }
    }, 60000);
  }
}

export const realTimeService = new RealTimeService();