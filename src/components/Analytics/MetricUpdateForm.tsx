import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, TrendingUp, Users, Calendar, BarChart2 } from 'lucide-react';
import { useRealTimeAnalytics } from '../../hooks/useRealTimeAnalytics';
import { AnalyticsUpdate } from '../../store/analyticsStore';

interface MetricUpdateFormProps {
  onClose: () => void;
  onSubmit: (update: Omit<AnalyticsUpdate, 'id' | 'timestamp'>) => void;
}

const MetricUpdateForm: React.FC<MetricUpdateFormProps> = ({ onClose, onSubmit }) => {
  const { isConnected } = useRealTimeAnalytics();
  
  const [formData, setFormData] = useState<Omit<AnalyticsUpdate, 'id' | 'timestamp'>>({
    userId: '',
    userName: '',
    userRole: '',
    metricType: 'enrollment',
    metricName: 'totalStudents',
    previousValue: null,
    newValue: 0,
    percentageChange: null,
    department: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Cannot submit update: Real-time connection is not active');
      return;
    }
    
    setIsSubmitting(true);
    
    // Calculate percentage change if previous value is provided
    let updatedFormData = { ...formData };
    if (formData.previousValue !== null) {
      const percentageChange = ((formData.newValue - formData.previousValue) / formData.previousValue) * 100;
      updatedFormData.percentageChange = percentageChange;
    }
    
    onSubmit(updatedFormData);
    setIsSubmitting(false);
    onClose();
  };
  
  const getMetricOptions = () => {
    switch (formData.metricType) {
      case 'enrollment':
        return [
          { value: 'totalStudents', label: 'Total Students' },
          { value: 'totalFaculty', label: 'Total Faculty' }
        ];
      case 'attendance':
        return [
          { value: 'year1', label: '1st Year Attendance' },
          { value: 'year2', label: '2nd Year Attendance' },
          { value: 'year3', label: '3rd Year Attendance' },
          { value: 'year4', label: '4th Year Attendance' }
        ];
      case 'fees':
        return [
          { value: 'monthlyBilling', label: 'Monthly Billing' },
          { value: 'feeCollectionRate', label: 'Fee Collection Rate' }
        ];
      case 'marks':
        return [
          { value: 'averageGPA', label: 'Average GPA' },
          { value: 'passRate', label: 'Pass Rate' }
        ];
      case 'placement':
        return [
          { value: 'placementRate', label: 'Placement Rate' },
          { value: 'averagePackage', label: 'Average Package' }
        ];
      default:
        return [];
    }
  };
  
  const getDepartmentOptions = () => {
    return [
      { value: '', label: 'All Departments' },
      { value: 'Computer Science', label: 'Computer Science' },
      { value: 'AI & ML', label: 'AI & ML' },
      { value: 'Data Science', label: 'Data Science' },
      { value: 'Software Eng', label: 'Software Engineering' }
    ];
  };
  
  const getMetricTypeIcon = () => {
    switch (formData.metricType) {
      case 'enrollment':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'attendance':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'fees':
        return <BarChart2 className="w-5 h-5 text-yellow-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-primary-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6" />
              <h2 className="text-xl font-bold">Update Metric</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Connection Status Warning */}
          {!isConnected && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              Warning: Real-time connection is not active. Updates may not be synchronized in real-time.
            </div>
          )}
          
          {/* User Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
              <select
                value={formData.userRole}
                onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Role</option>
                <option value="hod">HOD</option>
                <option value="principal">Principal</option>
                <option value="director">Director</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          {/* Metric Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
            <div className="grid grid-cols-5 gap-2">
              {['enrollment', 'attendance', 'fees', 'marks', 'placement'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    metricType: type as any,
                    metricName: '' // Reset metric name when type changes
                  })}
                  className={`p-3 rounded-lg border text-center ${
                    formData.metricType === type
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    {type === 'enrollment' && <Users className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'attendance' && <Calendar className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'fees' && <BarChart2 className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'marks' && <TrendingUp className="w-5 h-5 mx-auto mb-1" />}
                    {type === 'placement' && <TrendingUp className="w-5 h-5 mx-auto mb-1" />}
                    <span className="text-xs capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Metric Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {getMetricTypeIcon()}
              </div>
              <select
                value={formData.metricName}
                onChange={(e) => setFormData({ ...formData, metricName: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Metric</option>
                {getMetricOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Department (optional for some metrics) */}
          {(formData.metricType === 'attendance' || formData.metricType === 'marks') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                {getDepartmentOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* Values */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Value (Optional)</label>
              <input
                type="number"
                value={formData.previousValue === null ? '' : formData.previousValue}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  previousValue: e.target.value === '' ? null : Number(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Value</label>
              <input
                type="number"
                value={formData.newValue}
                onChange={(e) => setFormData({ ...formData, newValue: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                step="0.01"
                required
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isConnected}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Update'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MetricUpdateForm;