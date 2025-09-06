'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  XCircle,
  Wifi,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export interface ErrorInfo {
  message: string;
  type: 'validation' | 'auth' | 'permission' | 'not_found' | 'conflict' | 'rate_limit' | 'server_error' | 'service_unavailable' | 'network' | 'unknown';
  details?: any;
}

interface ErrorDisplayProps {
  error: ErrorInfo | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showDetails?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
  showDetails = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  // Handle string errors
  const errorInfo: ErrorInfo = typeof error === 'string' 
    ? { message: error, type: 'unknown' }
    : error;

  const getErrorIcon = () => {
    switch (errorInfo.type) {
      case 'network':
        return <Wifi className="h-5 w-5" />;
      case 'auth':
      case 'permission':
        return <XCircle className="h-5 w-5" />;
      case 'validation':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getErrorColor = () => {
    switch (errorInfo.type) {
      case 'network':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'auth':
      case 'permission':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'validation':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'server_error':
      case 'service_unavailable':
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getRetryText = () => {
    switch (errorInfo.type) {
      case 'network':
        return 'Check Connection';
      case 'server_error':
      case 'service_unavailable':
        return 'Try Again';
      default:
        return 'Retry';
    }
  };

  const shouldShowRetry = () => {
    return onRetry && ['network', 'server_error', 'service_unavailable', 'unknown'].includes(errorInfo.type);
  };

  return (
    <div className={`border rounded-lg p-4 ${getErrorColor()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getErrorIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {errorInfo.message}
            </p>
            
            {/* Show details if available and requested */}
            {showDetails && errorInfo.details && (
              <div className="mt-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-1 text-xs opacity-75 hover:opacity-100 transition-opacity"
                >
                  <Info className="h-3 w-3" />
                  <span>Details</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="mt-2 p-2 bg-black bg-opacity-5 rounded text-xs font-mono overflow-auto max-h-32">
                    <pre>{JSON.stringify(errorInfo.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          {shouldShowRetry() && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-md bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{getRetryText()}</span>
            </button>
          )}
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;