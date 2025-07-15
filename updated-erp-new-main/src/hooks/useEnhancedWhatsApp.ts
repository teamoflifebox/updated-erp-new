import { useState } from 'react';
import { enhancedWhatsAppService } from '../services/enhancedWhatsAppService';
import { supabase } from '../lib/supabase';

export const useEnhancedWhatsApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<any>(null);

  const sendAttendanceNotification = async (studentId: string, isPresent: boolean, subject: string, date: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await enhancedWhatsAppService.sendAttendanceNotification(studentId, isPresent, subject, date);
      setLastNotification({
        type: 'attendance',
        studentId,
        isPresent,
        subject,
        date,
        timestamp: new Date(),
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send attendance notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeePaymentNotification = async (studentId: string, amount: number, paymentMethod: string, receiptNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await enhancedWhatsAppService.sendFeePaymentNotification(studentId, amount, paymentMethod, receiptNumber);
      setLastNotification({
        type: 'fee_payment',
        studentId,
        amount,
        paymentMethod,
        receiptNumber,
        timestamp: new Date(),
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send fee payment notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMarksNotification = async (studentId: string, subject: string, marks: number, maxMarks: number, examType: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await enhancedWhatsAppService.sendMarksNotification(studentId, subject, marks, maxMarks, examType);
      setLastNotification({
        type: 'marks',
        studentId,
        subject,
        marks,
        maxMarks,
        examType,
        timestamp: new Date(),
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send marks notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmergencyNotification = async (studentId: string, message: string, useEmergencyContact: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await enhancedWhatsAppService.sendEmergencyNotification(studentId, message, useEmergencyContact);
      setLastNotification({
        type: 'emergency',
        studentId,
        message,
        useEmergencyContact,
        timestamp: new Date(),
      });
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send emergency notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendBulkNotification = async (studentIds: string[], title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    setIsLoading(true);
    setError(null);

    try {
      // Create notification in database
      const { data: notificationData, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          type: priority === 'high' ? 'warning' : priority === 'medium' ? 'info' : 'info',
          sender: 'System',
          audience: 'Selected Students'
        })
        .select()
        .single();
        
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
      
      // Send WhatsApp notifications
      const results = await enhancedWhatsAppService.sendBulkNotification(
        studentIds, 
        title, 
        message, 
        priority
      );
      
      setLastNotification({
        type: 'bulk',
        studentIds,
        title,
        message,
        priority,
        results,
        timestamp: new Date(),
      });
      return results;
    } catch (err: any) {
      setError(err.message || 'Failed to send bulk notification');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isHealthy = await enhancedWhatsAppService.healthCheck();
      return isHealthy;
    } catch (err: any) {
      setError(err.message || 'Health check failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    lastNotification,
    sendAttendanceNotification,
    sendFeePaymentNotification,
    sendMarksNotification,
    sendEmergencyNotification,
    sendBulkNotification,
    checkHealth,
    clearError: () => setError(null),
  };
};