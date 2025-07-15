import axios from 'axios';
import { config } from '../config/environment';
import { databaseService } from './databaseService';
import { realTimeService } from './realTimeService'; 
import { supabase } from '../lib/supabase';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: any[];
  };
}

export interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

class EnhancedWhatsAppService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.apiUrl = config.whatsapp.apiUrl;
    this.accessToken = config.whatsapp.apiToken;
    this.phoneNumberId = config.whatsapp.phoneNumberId;
  }

  // Core WhatsApp API integration
  private async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('WhatsApp API credentials not configured, using mock implementation');
      // Mock implementation for development
      return {
        messaging_product: 'whatsapp',
        contacts: [{ input: message.to, wa_id: message.to }],
        messages: [{ id: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` }]
      };
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          ...message,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('WhatsApp API Error:', error);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  // Enhanced attendance notification with real-time updates
  async sendAttendanceNotification(studentId: string, isPresent: boolean, subject: string, date: string) {
    try {
      // Get student data from Supabase
      const { data: student, error } = await supabase
        .from('students')
        .select(`
          *,
          users:user_id (
            name,
            email
          )
        `)
        .eq('id', studentId)
        .single();
      
      if (error || !student) {
        console.error('Error fetching student:', error);
        throw new Error('Student not found');
      }
      
      const message = isPresent 
        ? `✅ *ATTENDANCE CONFIRMED*\n\nDear ${student.parent_name},\n\nYour child *${student.users.name}* (${student.roll_number}) was *PRESENT* in ${subject} class today (${date}).\n\n📚 Subject: ${subject}\n📅 Date: ${date}\n⏰ Time: ${new Date().toLocaleTimeString()}\n\n🎓 *Oxford College*\n_Technology Excellence_\n\nFor any queries, contact: +91 (555) 123-4567`
        : `❌ *ATTENDANCE ALERT*\n\nDear ${student.parent_name},\n\nYour child *${student.users.name}* (${student.roll_number}) was *ABSENT* from ${subject} class today (${date}).\n\n📚 Subject: ${subject}\n📅 Date: ${date}\n⏰ Time: ${new Date().toLocaleTimeString()}\n\n⚠️ Please contact the college if this is unexpected.\n\n🎓 *Oxford College*\n_Technology Excellence_\n\nContact: +91 (555) 123-4567`;

      const whatsappMessage: WhatsAppMessage = {
        to: student.parent_phone,
        type: 'text',
        text: {
          body: message,
        },
      };

      const response = await this.sendMessage(whatsappMessage);
      
      // Update database with notification status
      // Save notification to database
      await supabase.from('whatsapp_notifications').insert({
        student_id: studentId,
        parent_phone: student.parent_phone,
        type: 'attendance',
        message: message,
        status: 'sent',
        metadata: {
          subject,
          date,
          isPresent
        }
      });
      
      // Mark attendance notification as sent
      await supabase
        .from('attendance')
        .update({ notification_sent: true })
        .eq('student_id', studentId)
        .eq('date', date)
        .eq('subject', subject);
      
      // Send real-time update
      realTimeService.sendAttendanceUpdate(studentId, isPresent, subject, date);
      
      console.log(`📱 Attendance notification sent to ${student.parent_phone}`);
      return response;
    } catch (error) {
      console.error('Failed to send attendance notification:', error);
      throw error;
    }
  }

  // Enhanced fee payment notification with receipt
  async sendFeePaymentNotification(studentId: string, amount: number, paymentMethod: string, receiptNumber: string) {
    try {
      // Get student data from Supabase
      const { data: student, error } = await supabase
        .from('students')
        .select(`
          *,
          users:user_id (
            name,
            email
          )
        `)
        .eq('id', studentId)
        .single();
      
      if (error || !student) {
        console.error('Error fetching student:', error);
        throw new Error('Student not found');
      }
      
      const message = `💰 *FEE PAYMENT CONFIRMED*\n\nDear ${student.parent_name},\n\nFee payment received successfully! 🎉\n\n👤 *Student:* ${student.users.name} (${student.roll_number})\n💵 *Amount:* ₹${amount.toLocaleString()}\n💳 *Method:* ${paymentMethod}\n📄 *Receipt:* ${receiptNumber}\n📅 *Date:* ${new Date().toLocaleDateString()}\n⏰ *Time:* ${new Date().toLocaleTimeString()}\n\n✅ Payment Status: *CONFIRMED*\n\nThank you for your payment! 🙏\n\n🎓 *Oxford College*\n_Technology Excellence_\n\nFor receipt copy or queries: +91 (555) 123-4567`;

      const whatsappMessage: WhatsAppMessage = {
        to: student.parent_phone,
        type: 'text',
        text: {
          body: message,
        },
      };

      const response = await this.sendMessage(whatsappMessage);
      
      // Record payment in database
      const { data: feeData, error: feeError } = await supabase.from('fees').insert({
        student_id: studentId,
        amount: amount,
        payment_method: paymentMethod,
        receipt_number: receiptNumber,
        status: 'paid',
        due_date: new Date().toISOString().split('T')[0],
        paid_date: new Date().toISOString().split('T')[0],
        notification_sent: true
      });
      
      if (feeError) {
        console.error('Error recording payment:', feeError);
      }
      
      // Save notification to database
      await supabase.from('whatsapp_notifications').insert({
        student_id: studentId,
        parent_phone: student.parent_phone,
        type: 'fee_payment',
        message: message,
        status: 'sent',
        metadata: {
          amount,
          paymentMethod,
          receiptNumber
        }
      });
      
      // Send real-time update
      realTimeService.sendFeePayment(studentId, amount, receiptNumber);
      
      console.log(`💰 Fee payment notification sent to ${student.parent_phone}`);
      return response;
    } catch (error) {
      console.error('Failed to send fee payment notification:', error);
      throw error;
    }
  }

  // Enhanced marks notification with detailed analysis
  async sendMarksNotification(studentId: string, subject: string, marks: number, maxMarks: number, examType: string) {
    try {
      // Get student data from Supabase
      const { data: student, error } = await supabase
        .from('students')
        .select(`
          *,
          users:user_id (
            name,
            email
          )
        `)
        .eq('id', studentId)
        .single();
      
      if (error || !student) {
        console.error('Error fetching student:', error);
        throw new Error('Student not found');
      }
      
      const percentage = (marks / maxMarks) * 100;
      const grade = this.calculateGrade(percentage);
      const emoji = percentage >= 90 ? '🏆' : percentage >= 80 ? '🌟' : percentage >= 70 ? '👍' : percentage >= 60 ? '📚' : '⚠️';
      const performance = percentage >= 85 ? 'Excellent' : percentage >= 75 ? 'Good' : percentage >= 60 ? 'Satisfactory' : 'Needs Improvement';

      const message = `${emoji} *MARKS PUBLISHED*\n\nDear ${student.parent_name},\n\nNew marks published for *${student.users.name}* (${student.roll_number})\n\n📚 *Subject:* ${subject}\n📝 *Exam:* ${examType}\n📊 *Marks:* ${marks}/${maxMarks}\n📈 *Percentage:* ${percentage.toFixed(1)}%\n🎯 *Grade:* ${grade}\n⭐ *Performance:* ${performance}\n📅 *Date:* ${new Date().toLocaleDateString()}\n\n${percentage >= 75 ? '🎉 Excellent performance! Keep it up!' : '💪 Keep working hard! You can do better!'}\n\n🎓 *Oxford College*\n_Technology Excellence_\n\nFor detailed report: +91 (555) 123-4567`;

      const whatsappMessage: WhatsAppMessage = {
        to: student.parent_phone,
        type: 'text',
        text: {
          body: message,
        },
      };

      const response = await this.sendMessage(whatsappMessage);
      
      // Save marks in database
      const { data: marksData, error: marksError } = await supabase.from('marks').insert({
        student_id: studentId,
        faculty_id: null, // This should come from context
        subject: subject,
        exam_type: examType,
        marks: marks,
        max_marks: maxMarks,
        grade: grade,
        date: new Date().toISOString().split('T')[0],
        notification_sent: true
      });
      
      if (marksError) {
        console.error('Error saving marks:', marksError);
      }
      
      // Save notification to database
      await supabase.from('whatsapp_notifications').insert({
        student_id: studentId,
        parent_phone: student.parent_phone,
        type: 'marks',
        message: message,
        status: 'sent',
        metadata: {
          subject,
          marks,
          maxMarks,
          percentage,
          grade,
          examType
        }
      });
      
      // Send real-time update
      realTimeService.sendMarksUpdate(studentId, subject, marks, examType);
      
      console.log(`📊 Marks notification sent to ${student.parent_phone}`);
      return response;
    } catch (error) {
      console.error('Failed to send marks notification:', error);
      throw error;
    }
  }

  // Emergency notification with immediate delivery
  async sendEmergencyNotification(studentId: string, message: string, useEmergencyContact: boolean = false) {
    try {
      // Get student data from Supabase
      const { data: student, error } = await supabase
        .from('students')
        .select(`
          *,
          users:user_id (
            name,
            email
          )
        `)
        .eq('id', studentId)
        .single();
      
      if (error || !student) {
        console.error('Error fetching student:', error);
        throw new Error('Student not found');
      }
      
      const phone = useEmergencyContact && student.emergency_contact ? student.emergency_contact : student.parent_phone;
      
      const emergencyMessage = `🚨 *EMERGENCY ALERT*\n\nDear ${student.parent_name},\n\n${message}\n\n👤 *Student:* ${student.users.name} (${student.roll_number})\n📅 *Time:* ${new Date().toLocaleString()}\n\n🚨 *IMMEDIATE ATTENTION REQUIRED*\n\nPlease contact the college immediately:\n📞 Emergency: +91 (555) 123-4567\n📞 Principal: +91 (555) 123-4568\n\n🎓 *Oxford College*\n_Technology Excellence_`;

      const whatsappMessage: WhatsAppMessage = {
        to: phone,
        type: 'text',
        text: {
          body: emergencyMessage,
        },
      };

      const response = await this.sendMessage(whatsappMessage);
      
      // Send real-time emergency alert
      // Save notification to database
      await supabase.from('whatsapp_notifications').insert({
        student_id: studentId,
        parent_phone: phone,
        type: 'emergency',
        message: emergencyMessage,
        status: 'sent',
        metadata: {
          isEmergency: true,
          useEmergencyContact
        }
      });
      
      realTimeService.sendEmergencyAlert(message, [studentId]);
      
      console.log(`🚨 Emergency notification sent to ${phone}`);
      return response;
    } catch (error) {
      console.error('Failed to send emergency notification:', error);
      throw error;
    }
  }

  // Bulk notifications for announcements
  async sendBulkNotification(studentIds: string[], title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const results = [];
    
    for (const studentId of studentIds) {
      try {
        // Get student data from Supabase
        const { data: student, error } = await supabase
          .from('students')
          .select(`
            *,
            users:user_id (
              name,
              email
            )
          `)
          .eq('id', studentId)
          .single();
        
        if (error || !student) {
          console.error('Error fetching student:', error);
          results.push({ studentId, status: 'failed', error: 'Student not found' });
          continue;
        }
        
        const priorityEmoji = priority === 'high' ? '🚨' : priority === 'medium' ? '📢' : 'ℹ️';
        
        const whatsappMessage = `${priorityEmoji} *${title.toUpperCase()}*\n\nDear ${student.parent_name},\n\n${message}\n\n👤 *Student:* ${student.users.name} (${student.roll_number})\n📅 *Date:* ${new Date().toLocaleDateString()}\n\n🎓 *Oxford College*\n_Technology Excellence_\n\nFor queries: +91 9542156929`;

        const response = await this.sendMessage({
          to: student.parent_phone,
          type: 'text',
          text: {
            body: whatsappMessage,
          },
        });

        results.push({ studentId, status: 'sent', response });
        
        // Save notification to database
        await supabase.from('whatsapp_notifications').insert({
          student_id: studentId,
          parent_phone: student.parent_phone,
          type: 'general',
          message: whatsappMessage,
          status: 'sent',
          metadata: {
            title,
            priority
          }
        });
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({ studentId, status: 'failed', error: error.message });
      }
    }
    
    return results;
  }

  // Webhook handler for delivery status
  async handleWebhook(webhookData: any) {
    try {
      if (webhookData.entry) {
        for (const entry of webhookData.entry) {
          if (entry.changes) {
            for (const change of entry.changes) {
              if (change.value.statuses) {
                for (const status of change.value.statuses) {
                  console.log(`Message ${status.id} status: ${status.status}`);
                  // Update notification status in database
                  // await this.updateNotificationStatus(status.id, status.status);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  // Utility methods
  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Test database connectivity
      const { data, error } = await supabase
        .from('whatsapp_notifications')
        .select('count(*)', { count: 'exact', head: true });
        
      return !error;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export const enhancedWhatsAppService = new EnhancedWhatsAppService();