import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { StatusLevel, OverallStatus } from '../../features/analyzer/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusLevel | OverallStatus | 'info' | 'teal';
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  status = 'normal',
  label,
  showIcon = true,
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'normal':
      case 'good':
        return {
          bg: 'bg-green-50 text-green-800 border-green-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />,
          defaultText: 'Normal Range',
        };
      case 'low':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          defaultText: 'Low',
        };
      case 'high':
      case 'attention':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          defaultText: status === 'attention' ? 'Attention Needed' : 'High',
        };
      case 'critical':
      case 'urgent':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />,
          defaultText: status === 'urgent' ? 'Urgent Doctor Review' : 'Critical',
        };
      case 'teal':
        return {
          bg: 'bg-primary-light text-primary-900 border-teal-200',
          icon: <Info className="w-3.5 h-3.5 text-primary shrink-0" />,
          defaultText: 'Verified',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
          defaultText: 'Information',
        };
    }
  };

  const config = getStatusConfig();
  const text = label || children || config.defaultText;
  const sizeStyles = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeStyles} ${className}`}
      {...props}
    >
      {showIcon && config.icon}
      <span>{text}</span>
    </span>
  );
};

