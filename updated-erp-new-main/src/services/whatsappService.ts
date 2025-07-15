import { supabase } from '../lib/supabase';

export interface WhatsAppNotification {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  parentPhone: string;
  type: 'attendance' | 'fee_payment' | 'marks' | 'general' | 'emergency';
  message: string;
  timestamp: Date;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  metadata?: any;
}

export interface StudentParentInfo {
  studentId: string;
  studentName: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  emergencyContact?: string;
}

class WhatsAppService {
  private apiUrl = import.meta.env.VITE_WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
  private apiToken = import.meta.env.VITE_WHATSAPP_API_TOKEN;
  private phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;

  // Updated parent data with actual student names
  private parentContacts: StudentParentInfo[] = [
    {
      studentId: '1',
      studentName: 'Sridhar',
      rollNumber: 'CS2023001',
      parentName: 'Mr. Sridhar Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '2',
      studentName: 'Sai',
      rollNumber: 'AI2023002',
      parentName: 'Mr. Sai Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '3',
      studentName: 'Santhosh',
      rollNumber: 'CS2023003',
      parentName: 'Mr. Santhosh Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '4',
      studentName: 'Sandeep',
      rollNumber: 'ML2023004',
      parentName: 'Mr. Sandeep Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '5',
      studentName: 'Rajkumar',
      rollNumber: 'DS2023005',
      parentName: 'Mr. Rajkumar Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '6',
      studentName: 'Pradeep',
      rollNumber: 'DA2023006',
      parentName: 'Mr. Pradeep Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '7',
      studentName: 'Swamy',
      rollNumber: 'CS2023007',
      parentName: 'Mr. Swamy Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '8',
      studentName: 'Ganasai',
      rollNumber: 'AI2023008',
      parentName: 'Mr. Ganasai Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '9',
      studentName: 'Vasanth',
      rollNumber: 'ML2023009',
      parentName: 'Mr. Vasanth Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    },
    {
      studentId: '10',
      studentName: 'Harsha',
      rollNumber: 'DS2023010',
      parentName: 'Mr. Harsha Father',
      parentPhone: '+91 9542156929',
      emergencyContact: '+91 9542156929'
    }
  ];

  // Send attendance notification
  async sendAttendanceNotification(studentId: string, isPresent: boolean, subject: string, date: string) {
    const parentInfo = this.getParentInfo(studentId);
    if (!parentInfo) return;

    const message = isPresent 
      ? `✅ ATTENDANCE UPDATE\n\nDear ${parentInfo.parentName},\n\nYour child ${parentInfo.studentName} (${parentInfo.rollNumber}) was PRESENT in ${subject} class today (${date}).\n\n🎓 Oxford College\nTechnology Excellence`
      : `❌ ATTENDANCE ALERT\n\nDear ${parentInfo.parentName},\n\nYour child ${parentInfo.studentName} (${parentInfo.rollNumber}) was ABSENT from ${subject} class today (${date}).\n\nPlease contact the college if this is unexpected.\n\n🎓 Oxford College\nTechnology Excellence`;

    return this.sendNotification(studentId, parentInfo.parentPhone, 'attendance', message, {
      subject,
      date,
      isPresent
    });
  }

  // Send fee payment notification
  async sendFeePaymentNotification(studentId: string, amount: number, paymentMethod: string, receiptNumber: string) {
    const parentInfo = this.getParentInfo(studentId);
    if (!parentInfo) return;

    const message = `💰 FEE PAYMENT CONFIRMATION\n\nDear ${parentInfo.parentName},\n\nFee payment received successfully!\n\n👤 Student: ${parentInfo.studentName} (${parentInfo.rollNumber})\n💵 Amount: ₹${amount.toLocaleString()}\n💳 Method: ${paymentMethod}\n📄 Receipt: ${receiptNumber}\n📅 Date: ${new Date().toLocaleDateString()}\n\nThank you for your payment.\n\n🎓 Oxford College\nTechnology Excellence`;

    return this.sendNotification(studentId, parentInfo.parentPhone, 'fee_payment', message, {
      amount,
      paymentMethod,
      receiptNumber
    });
  }

  // Send marks notification
  async sendMarksNotification(studentId: string, subject: string, marks: number, maxMarks: number, examType: string) {
    const parentInfo = this.getParentInfo(studentId);
    if (!parentInfo) return;

    const percentage = (marks / maxMarks) * 100;
    const grade = this.calculateGrade(percentage);
    const emoji = percentage >= 90 ? '🏆' : percentage >= 80 ? '🌟' : percentage >= 70 ? '👍' : percentage >= 60 ? '📚' : '⚠️';

    const message = `${emoji} MARKS UPDATE\n\nDear ${parentInfo.parentName},\n\nNew marks published for ${parentInfo.studentName} (${parentInfo.rollNumber})\n\n📚 Subject: ${subject}\n📝 Exam: ${examType}\n📊 Marks: ${marks}/${maxMarks}\n📈 Percentage: ${percentage.toFixed(1)}%\n🎯 Grade: ${grade}\n📅 Date: ${new Date().toLocaleDateString()}\n\n${percentage >= 75 ? 'Excellent performance! 🎉' : 'Keep up the good work! 💪'}\n\n🎓 Oxford College\nTechnology Excellence`;

    return this.sendNotification(studentId, parentInfo.parentPhone, 'marks', message, {
      subject,
      marks,
      maxMarks,
      percentage,
      grade,
      examType
    });
  }

  // Send general notification
  async sendGeneralNotification(studentId: string, title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const parentInfo = this.getParentInfo(studentId);
    if (!parentInfo) return;

    const priorityEmoji = priority === 'high' ? '🚨' : priority === 'medium' ? '📢' : 'ℹ️';
    
    const whatsappMessage = `${priorityEmoji} ${title.toUpperCase()}\n\nDear ${parentInfo.parentName},\n\n${message}\n\n👤 Student: ${parentInfo.studentName} (${parentInfo.rollNumber})\n📅 Date: ${new Date().toLocaleDateString()}\n\n🎓 Oxford College\nTechnology Excellence`;

    return this.sendNotification(studentId, parentInfo.parentPhone, 'general', whatsappMessage, {
      title,
      priority
    });
  }

  // Send emergency notification
  async sendEmergencyNotification(studentId: string, message: string, useEmergencyContact: boolean = false) {
    const parentInfo = this.getParentInfo(studentId);
    if (!parentInfo) return;

    const phone = useEmergencyContact && parentInfo.emergencyContact ? parentInfo.emergencyContact : parentInfo.parentPhone;
    
    const whatsappMessage = `🚨 EMERGENCY ALERT\n\nDear ${parentInfo.parentName},\n\n${message}\n\n👤 Student: ${parentInfo.studentName} (${parentInfo.rollNumber})\n📅 Time: ${new Date().toLocaleString()}\n\nPlease contact the college immediately.\n📞 College: +91 (555) 123-4567\n\n🎓 Oxford College\nTechnology Excellence`;

    return this.sendNotification(studentId, phone, 'emergency', whatsappMessage, {
      isEmergency: true,
      useEmergencyContact
    });
  }

  // Core notification sending method
  private async sendNotification(studentId: string, phone: string, type: WhatsAppNotification['type'], message: string, metadata?: any): Promise<WhatsAppNotification> {
    const notification: WhatsAppNotification = {
      id: crypto.randomUUID(),
      studentId,
      parentPhone: phone,
      type,
      message,
      timestamp: new Date(),
      status: 'pending',
      metadata
    };

    try {
      // In a real implementation, you would integrate with WhatsApp Business API
      // Save the notification to the database
      const { data, error } = await supabase
        .from('whatsapp_notifications')
        .insert([{
          id: notification.id,
          student_id: notification.studentId,
          parent_phone: notification.parentPhone,
          type: notification.type,
          message: notification.message,
          status: 'sent',
          metadata: metadata || {}
        }])
        .select();
      
      if (error) {
        console.error('Error saving WhatsApp notification:', error);
        notification.status = 'failed';
        throw error;
      }
      
      notification.status = 'sent';
      
      // Log for demo purposes
      console.log(`📱 WhatsApp sent to ${phone}:`, message);
      
      return notification;
    } catch (error) {
      notification.status = 'failed';
      // Save failed notification
      await supabase
        .from('whatsapp_notifications')
        .insert([{
          id: notification.id,
          student_id: notification.studentId,
          parent_phone: notification.parentPhone,
          type: notification.type,
          message: notification.message,
          status: 'failed',
          metadata: metadata || {}
        }]);
        
      console.error('Failed to send WhatsApp notification:', error);
      throw error;
    }
  }

  // Simulate WhatsApp API call
  private async simulateWhatsAppAPI(phone: string, message: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate occasional failures (5% failure rate)
    if (Math.random() < 0.05) {
      throw new Error('WhatsApp API error');
    }
  }

  // Get parent information
  private getParentInfo(studentId: string): StudentParentInfo | null {
    return this.parentContacts.find(contact => contact.studentId === studentId) || null;
  }

  // Get notification history
  async getNotificationHistory(studentId?: string): Promise<WhatsAppNotification[]> {
    try {
      let query = supabase
        .from('whatsapp_notifications')
        .select(`
          *,
          students (
            id,
            roll_number,
            users (
              name
            )
          )
        `);
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      
      const { data: notifications, error: fetchError } = await query.order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching notifications:', fetchError);
        return [];
      }
      
      return notifications.map(notification => ({
        id: notification.id,
        studentId: notification.student_id || '',
        studentName: notification.students?.users?.name || '',
        rollNumber: notification.students?.roll_number || '',
        parentPhone: notification.parent_phone,
        type: notification.type,
        message: notification.message,
        timestamp: new Date(notification.created_at),
        status: notification.status,
        metadata: notification.metadata
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    try {
      // First, get total count
      const { count: total, error: countError } = await supabase
        .from('whatsapp_notifications')
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
        
      // Get sent count
      const { count: sent, error: sentError } = await supabase
        .from('whatsapp_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sent');
        
      if (sentError) throw sentError;
        
      // Get failed count
      const { count: failed, error: failedError } = await supabase
        .from('whatsapp_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed');
        
      if (failedError) throw failedError;
        
      // Get pending count
      const { count: pending, error: pendingError } = await supabase
        .from('whatsapp_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
        
      if (pendingError) throw pendingError;
        
      return {
        total: total || 0,
        sent: sent || 0,
        failed: failed || 0,
        pending: pending || 0,
        successRate: total > 0 ? ((sent || 0) / total) * 100 : 0
      };
    } catch (error) {
      console.error('Error calculating notification stats:', error);
      return {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
        successRate: 0
      };
    }
  }

  // Bulk send notifications
  async sendBulkNotifications(notifications: Array<{
    studentId: string;
    type: WhatsAppNotification['type'];
    message: string;
    metadata?: any;
  }>) {
    const results = await Promise.allSettled(
      notifications.map(async (notif) => {
        const parentInfo = this.getParentInfo(notif.studentId);
        if (!parentInfo) throw new Error(`Parent info not found for student ${notif.studentId}`);
        
        return this.sendNotification(
          notif.studentId,
          parentInfo.parentPhone,
          notif.type,
          notif.message,
          notif.metadata
        );
      })
    );

    return results;
  }
  
  // Update notification status
  async updateNotificationStatus(id: string, status: 'sent' | 'delivered' | 'failed') {
    try {
      const { error } = await supabase
        .from('whatsapp_notifications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating notification status:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating notification status:', error);
      return false;
    }
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }
}

export const whatsappService = new WhatsAppService();