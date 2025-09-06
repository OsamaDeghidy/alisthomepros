'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  Calendar,
  Filter,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useApiError } from '../hooks/useApiError';
import ErrorDisplay from './ErrorDisplay';
import { contractsService } from '../lib/contracts';

interface PaymentReportExportProps {
  contractId?: number;
  professionalId?: number;
  className?: string;
}

interface ExportFilters {
  startDate: string;
  endDate: string;
  status: 'all' | 'pending' | 'approved' | 'processed' | 'rejected' | 'held' | 'completed';
  format: 'json' | 'csv' | 'excel';
  includeDetails: boolean;
  paymentType: 'all' | 'milestone' | 'full_payment' | 'partial';
}

export default function PaymentReportExport({
  contractId,
  professionalId,
  className = ''
}: PaymentReportExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { error, handleApiError, clearError } = useApiError();
  
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
    endDate: new Date().toISOString().split('T')[0], // Today
    status: 'all',
    format: 'json',
    includeDetails: true,
    paymentType: 'all'
  });

  const handleFilterChange = (key: keyof ExportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const validateFilters = (): boolean => {
    if (!filters.startDate || !filters.endDate) {
      handleApiError({ message: 'Please select both start and end dates', type: 'validation' });
      return false;
    }

    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      handleApiError({ message: 'Start date cannot be after end date', type: 'validation' });
      return false;
    }

    const daysDiff = Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      handleApiError({ message: 'Date range cannot exceed 365 days', type: 'validation' });
      return false;
    }

    return true;
  };

  const handleExport = async () => {
    if (!validateFilters()) {
      return;
    }

    try {
      setIsExporting(true);
      clearError();

      // Prepare export parameters
      const exportParams = {
        start_date: filters.startDate,
        end_date: filters.endDate,
        status: filters.status !== 'all' ? filters.status : undefined,
        format: filters.format,
        include_details: filters.includeDetails,
        contract_id: contractId,
        professional_id: professionalId,
        payment_type: filters.paymentType !== 'all' ? filters.paymentType : undefined
      };

      const response = await contractsService.exportPaymentReport(exportParams);
      
      setSuccessMessage(response.message || `Payment report exported successfully as ${filters.format.toUpperCase()}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setIsExporting(false);
    }
  };

  const getContentType = (format: string): string => {
    switch (format) {
      case 'json':
        return 'application/json';
      case 'excel':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'csv':
        return 'text/csv';
      default:
        return 'application/octet-stream';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'excel':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'csv':
        return <FileText className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Download className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Payment Report</h3>
            <p className="text-sm text-gray-600">Download detailed payment reports in various formats</p>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <ErrorDisplay
            error={error}
            onDismiss={clearError}
          />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="processed">Processed</option>
                <option value="rejected">Rejected</option>
                <option value="held">Held</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <select
                value={filters.format}
                onChange={(e) => handleFilterChange('format', e.target.value as 'json' | 'excel' | 'csv')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="json">JSON Data</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
              </select>
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                value={filters.paymentType}
                onChange={(e) => handleFilterChange('paymentType', e.target.value as 'all' | 'milestone' | 'full_payment' | 'partial')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payment Types</option>
                <option value="milestone">Milestone Payments</option>
                <option value="full_payment">Full Payments</option>
                <option value="partial">Partial Payments</option>
              </select>
            </div>

            {/* Include Details */}
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="includeDetails"
                checked={filters.includeDetails}
                onChange={(e) => handleFilterChange('includeDetails', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeDetails" className="text-sm font-medium text-gray-700">
                Include detailed transaction information
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Quick Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">JSON Report</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Structured data for API integration and processing</p>
          <button
            onClick={async () => {
              setIsExporting(true);
              clearError();
              try {
                const response = await contractsService.exportPaymentReport({
                  start_date: filters.startDate,
                  end_date: filters.endDate,
                  status: filters.status !== 'all' ? filters.status : undefined,
                  format: 'json',
                  include_details: filters.includeDetails,
                  contract_id: contractId,
                  professional_id: professionalId,
                  payment_type: filters.paymentType !== 'all' ? filters.paymentType : undefined
                });
                setSuccessMessage(response.message || 'JSON report exported successfully');
                setTimeout(() => setSuccessMessage(null), 5000);
              } catch (err: any) {
                handleApiError(err);
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              'Export JSON'
            )}
          </button>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">Excel Spreadsheet</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Detailed data for analysis and calculations</p>
          <button
            onClick={async () => {
              setIsExporting(true);
              clearError();
              try {
                const response = await contractsService.exportPaymentReport({
                  start_date: filters.startDate,
                  end_date: filters.endDate,
                  status: filters.status !== 'all' ? filters.status : undefined,
                  format: 'excel',
                  include_details: filters.includeDetails,
                  contract_id: contractId,
                  professional_id: professionalId,
                  payment_type: filters.paymentType !== 'all' ? filters.paymentType : undefined
                });
                setSuccessMessage(response.message || 'Excel report exported successfully');
                setTimeout(() => setSuccessMessage(null), 5000);
              } catch (err: any) {
                handleApiError(err);
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              'Export Excel'
            )}
          </button>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">CSV Data</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">Raw data for custom processing</p>
          <button
            onClick={async () => {
              setIsExporting(true);
              clearError();
              try {
                const response = await contractsService.exportPaymentReport({
                  start_date: filters.startDate,
                  end_date: filters.endDate,
                  status: filters.status !== 'all' ? filters.status : undefined,
                  format: 'csv',
                  include_details: filters.includeDetails,
                  contract_id: contractId,
                  professional_id: professionalId,
                  payment_type: filters.paymentType !== 'all' ? filters.paymentType : undefined
                });
                setSuccessMessage(response.message || 'CSV report exported successfully');
                setTimeout(() => setSuccessMessage(null), 5000);
              } catch (err: any) {
                handleApiError(err);
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              'Export CSV'
            )}
          </button>
        </div>
      </div>

      {/* Custom Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              {getFormatIcon(filters.format)}
              <span>Export Custom Report ({filters.format.toUpperCase()})</span>
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Export Information:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Reports include all payment transactions within the selected date range</li>
              <li>JSON format provides structured data for API integration</li>
              <li>Excel and CSV formats provide raw data for further analysis</li>
              <li>Filter by payment type: milestone, full payment, or partial payments</li>
              <li>Maximum date range is 365 days per export</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}