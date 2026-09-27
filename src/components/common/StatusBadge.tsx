import React from 'react';
import { RiskLevel, DataQualityGrade, ProjectStatus, AlertSeverity } from '../../types/project';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Clock, Eye } from 'lucide-react';

export const RiskBadge: React.FC<{ level: RiskLevel; size?: 'sm' | 'md' | 'lg'; showIcon?: boolean }> = ({
  level,
  size = 'md',
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5'
  };

  switch (level) {
    case 'LOW':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses[size]}`}>
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
          <span>LOW RISK</span>
        </span>
      );
    case 'MODERATE':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses[size]}`}>
          {showIcon && <Eye className="w-3.5 h-3.5 text-amber-600" />}
          <span>MODERATE RISK</span>
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-orange-50 text-orange-800 border border-orange-300 ${sizeClasses[size]}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />}
          <span>HIGH RISK</span>
        </span>
      );
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-800 border border-red-300 animate-pulse ${sizeClasses[size]}`}>
          {showIcon && <AlertOctagon className="w-3.5 h-3.5 text-red-600" />}
          <span>CRITICAL RISK</span>
        </span>
      );
  }
};

export const DataQualityBadge: React.FC<{ grade: DataQualityGrade; score?: number }> = ({ grade, score }) => {
  switch (grade) {
    case 'GOOD':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>GOOD {score ? `(${score}%)` : ''}</span>
        </span>
      );
    case 'WATCH':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
          <Eye className="w-3 h-3 text-amber-600" />
          <span>WATCH {score ? `(${score}%)` : ''}</span>
        </span>
      );
    case 'POOR':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-800 border border-red-200">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          <span>POOR {score ? `(${score}%)` : ''}</span>
        </span>
      );
  }
};

export const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  switch (status) {
    case 'ON_SCHEDULE':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-900 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>On Schedule</span>
        </span>
      );
    case 'DELAYED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300">
          <Clock className="w-3 h-3 text-amber-700" />
          <span>Delayed</span>
        </span>
      );
    case 'CRITICAL_DELAY':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-900 border border-red-300">
          <AlertOctagon className="w-3 h-3 text-red-700" />
          <span>Critical Delay</span>
        </span>
      );
    case 'STALLED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-200 text-gray-800 border border-gray-400">
          <AlertTriangle className="w-3 h-3 text-gray-700" />
          <span>Stalled Work</span>
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-900 border border-blue-300">
          <CheckCircle2 className="w-3 h-3 text-blue-700" />
          <span>Completed</span>
        </span>
      );
  }
};

export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
          <AlertOctagon className="w-3 h-3" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange-500 text-white">
          <AlertTriangle className="w-3 h-3" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500 text-white">
          MEDIUM
        </span>
      );
    case 'WATCH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-sky-600 text-white">
          WATCH
        </span>
      );
  }
};
