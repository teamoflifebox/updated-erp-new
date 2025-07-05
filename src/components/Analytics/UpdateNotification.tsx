import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { AnalyticsUpdate } from '../../store/analyticsStore';
import { format } from 'date-fns';

interface UpdateNotificationProps {
  update: AnalyticsUpdate;
  onDismiss: () => void;
  autoHideDuration?: number;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ 
  update, 
  onDismiss, 
  autoHideDuration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Allow animation to complete
    }, autoHideDuration);
    
    return () => clearTimeout(timer);
  }, [autoHideDuration, onDismiss]);

  const getMetricName = (metricType: string, metricName: string) => {
    switch (metricType) {
      case 'enrollment':
        return metricName === 'totalStudents' ? 'Total Students' : 
               metricName === 'totalFaculty' ? 'Total Faculty' : metricName;
      case 'attendance':
        return metricName === 'year1' ? '1st Year Attendance' :
               metricName === 'year2' ? '2nd Year Attendance' :
               metricName === 'year3' ? '3rd Year Attendance' :
               metricName === 'year4' ? '4th Year Attendance' : metricName;
      case 'fees':
        return metricName === 'monthlyBilling' ? 'Monthly Billing' : metricName;
      default:
        return metricName;
    }
  };

  const getIcon = () => {
    switch (update.metricType) {
      case 'enrollment':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'attendance':
        return <Info className="w-5 h-5 text-green-600" />;
      case 'fees':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'placement':
        return <CheckCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-primary-600" />;
    }
  };

  const getNotificationColor = () => {
    switch (update.metricType) {
      case 'enrollment':
        return 'bg-blue-50 border-blue-200';
      case 'attendance':
        return 'bg-green-50 border-green-200';
      case 'fees':
        return 'bg-yellow-50 border-yellow-200';
      case 'placement':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-primary-50 border-primary-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-20 right-4 z-50 w-96 p-4 rounded-lg shadow-lg border ${getNotificationColor()}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-900">
                  {getMetricName(update.metricType, update.metricName)} Updated
                </p>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onDismiss, 300);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Updated by {update.userName} ({update.userRole})
                {update.department && ` in ${update.department}`}
              </p>
              <div className="mt-2 text-xs">
                <div className="flex items-center">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium text-gray-800 mx-1">
                    {update.previousValue !== null ? update.previousValue : 'N/A'}
                  </span>
                  <span className="text-gray-600 mx-1">to</span>
                  <span className="font-medium text-gray-800 mx-1">{update.newValue}</span>
                  {update.percentageChange !== null && (
                    <span className={`ml-2 ${update.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {update.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(update.percentageChange).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {format(new Date(update.timestamp), 'MMM dd, yyyy HH:mm:ss')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;