import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, AlertCircle, Database } from 'lucide-react';

interface ConnectionStatusBarProps {
  isConnected: boolean;
  isFallbackMode: boolean;
  connectionError: string | null;
  onReconnect: () => void;
  lastUpdateTime: Date | null;
}

const ConnectionStatusBar: React.FC<ConnectionStatusBarProps> = ({
  isConnected,
  isFallbackMode,
  connectionError,
  onReconnect,
  lastUpdateTime
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isConnected ? 'Real-time Connected' : 'Disconnected'}
            </span>
          </div>
          
          {isFallbackMode && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <Database className="w-4 h-4" />
              <span className="text-sm font-medium">Fallback Mode Active</span>
            </div>
          )}
          
          {connectionError && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{connectionError}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {lastUpdateTime && (
            <div className="text-sm text-gray-600">
              Last update: {lastUpdateTime.toLocaleTimeString()}
            </div>
          )}
          
          <button
            onClick={onReconnect}
            disabled={isConnected && !isFallbackMode}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reconnect</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectionStatusBar;