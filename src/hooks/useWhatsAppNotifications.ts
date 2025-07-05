import { useState, useEffect } from 'react';
import { whatsappService } from '../services/whatsappService';
import { supabase } from '../lib/supabase';

export const useWhatsAppNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-send attendance notification when student is marked absent
  const notifyAttendance = async (studentId: string, isPresent: boolean, subject: string, date: string) => {
    setIsLoading(true);
    setError(null); 

    try {
      // First, check if student exists
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, parent_phone, parent_name, roll_number, users:user_id(name)')
        .eq('id', studentId)
        .single();
        
      if (studentError || !student) {
        throw new Error('Student not found');
      }
      
      // Send notification
      const result = await whatsappService.sendAttendanceNotification(studentId, isPresent, subject, date);
      
      // Show success notification in UI
      if (typeof window !== 'undefined') {
        const message = isPresent 
          ? '✅ Parent notified: Student marked present'
          : '❌ Parent notified: Student marked absent';
        
        // You can integrate with your notification system here
        console.log(message);
      }
    } catch (err) {
      setError('Failed to send WhatsApp notification');
      console.error('WhatsApp notification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send fee payment confirmation
  const notifyFeePayment = async (studentId: string, amount: number, paymentMethod: string, receiptNumber: string) => {
    setIsLoading(true);
    setError(null); 

    try {
      // First, check if student exists
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, parent_phone, parent_name, roll_number, users:user_id(name)')
        .eq('id', studentId)
        .single();
        
      if (studentError || !student) {
        throw new Error('Student not found');
      }
      
      // Send notification
      const result = await whatsappService.sendFeePaymentNotification(studentId, amount, paymentMethod, receiptNumber);
      
      if (typeof window !== 'undefined') {
        console.log('💰 Parent notified: Fee payment confirmed');
      }
    } catch (err) {
      setError('Failed to send payment confirmation');
      console.error('Payment notification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send marks notification
  const notifyMarks = async (studentId: string, subject: string, marks: number, maxMarks: number, examType: string) => {
    setIsLoading(true);
    setError(null); 

    try {
      // First, check if student exists
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, parent_phone, parent_name, roll_number, users:user_id(name)')
        .eq('id', studentId)
        .single();
        
      if (studentError || !student) {
        throw new Error('Student not found');
      }
      
      // Send notification
      const result = await whatsappService.sendMarksNotification(studentId, subject, marks, maxMarks, examType);
      
      if (typeof window !== 'undefined') {
        console.log('📊 Parent notified: New marks published');
      }
    } catch (err) {
      setError('Failed to send marks notification');
      console.error('Marks notification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Send general notification
  const notifyGeneral = async (studentId: string, title: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    setIsLoading(true);
    setError(null); 

    try {
      // First, check if student exists
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, parent_phone, parent_name, roll_number, users:user_id(name)')
        .eq('id', studentId)
        .single();
        
      if (studentError || !student) {
        throw new Error('Student not found');
      }
      
      // Send notification
      const result = await whatsappService.sendGeneralNotification(studentId, title, message, priority);
      
      if (typeof window !== 'undefined') {
        console.log('📢 Parent notified: General notification sent');
      }
    } catch (err) {
      setError('Failed to send notification');
      console.error('General notification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Send emergency notification
  const notifyEmergency = async (studentId: string, message: string, useEmergencyContact: boolean = false) => {
    setIsLoading(true);
    setError(null); 

    try {
      // First, check if student exists
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id, parent_phone, parent_name, emergency_contact, roll_number, users:user_id(name)')
        .eq('id', studentId)
        .single();
        
      if (studentError || !student) {
        throw new Error('Student not found');
      }
      
      // Send notification
      const result = await whatsappService.sendEmergencyNotification(studentId, message, useEmergencyContact);
      
      if (typeof window !== 'undefined') {
        console.log('🚨 Emergency notification sent to parent');
      }
    } catch (err) {
      setError('Failed to send emergency notification');
      console.error('Emergency notification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    notifyAttendance,
    notifyFeePayment,
    notifyMarks,
    notifyGeneral,
    notifyEmergency,
    clearError: () => setError(null)
  };
};