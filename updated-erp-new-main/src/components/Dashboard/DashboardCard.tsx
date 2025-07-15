import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend,
  subtitle 
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-md',
    secondary: 'bg-gradient-to-r from-[#475569] to-[#64748B] text-white shadow-md',
    accent: 'bg-gradient-to-r from-[#9333EA] to-[#C026D3] text-white shadow-md',
    success: 'bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white shadow-md',
    warning: 'bg-gradient-to-br from-warning-500 to-warning-600 text-white shadow-md',
    error: 'bg-gradient-to-br from-error-500 to-error-600 text-white shadow-md',
  };

  return (
    <div className="dashboard-card group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-1 group-hover:scale-105 transition-transform duration-200">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.isPositive ? 'text-success-600' : 'text-error-500'
            }`}>
              <span className="text-lg">{trend.isPositive ? '↗' : '↘'}</span>
              <span className="font-medium">{Math.abs(trend.value)}%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-all duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
      
      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 rounded-b-lg overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
      </div>
    </div>
  );
};

export default DashboardCard;