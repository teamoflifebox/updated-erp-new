import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Download, Search, Filter, X } from 'lucide-react';
import { AnalyticsUpdate } from '../../store/analyticsStore';
import { format } from 'date-fns';

interface AuditLogViewerProps {
  auditLog: AnalyticsUpdate[];
  onClose: () => void;
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ auditLog, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  
  // Get unique users from audit log
  const uniqueUsers = Array.from(new Set(auditLog.map(log => log.userName)));
  
  // Filter audit log
  const filteredLog = auditLog.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.metricName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.department && log.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || log.metricType === filterType;
    const matchesUser = filterUser === 'all' || log.userName === filterUser;
    
    return matchesSearch && matchesType && matchesUser;
  });
  
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
  
  const exportAuditLog = () => {
    const dataStr = JSON.stringify(filteredLog, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `audit-log-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6" />
              <h2 className="text-xl font-bold">Audit Log</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportAuditLog}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                title="Export Audit Log"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="enrollment">Enrollment</option>
                <option value="attendance">Attendance</option>
                <option value="fees">Fees</option>
                <option value="marks">Marks</option>
                <option value="placement">Placement</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Audit Log Table */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No audit log entries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLog.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                      <div className="text-sm text-gray-500">{log.userRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.metricType === 'enrollment' ? 'bg-blue-100 text-blue-800' :
                        log.metricType === 'attendance' ? 'bg-green-100 text-green-800' :
                        log.metricType === 'fees' ? 'bg-yellow-100 text-yellow-800' :
                        log.metricType === 'marks' ? 'bg-purple-100 text-purple-800' :
                        log.metricType === 'placement' ? 'bg-pink-100 text-pink-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getMetricName(log.metricType, log.metricName)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.previousValue !== null ? log.previousValue : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.newValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.percentageChange !== null && (
                        <span className={`${log.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {log.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(log.percentageChange).toFixed(2)}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.department || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredLog.length} of {auditLog.length} entries
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuditLogViewer;