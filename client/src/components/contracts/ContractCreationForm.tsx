'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, DollarSign, FileText, Clock, MapPin, User } from 'lucide-react';
import { contractsService } from '../../lib/contracts';
import { useAuthStore } from '../../lib/store';
import toast from 'react-hot-toast';

interface ContractCreationFormProps {
  professionalId: number;
  professional: {
    id: number;
    display_name?: string;
    full_name?: string;
    avatar?: string;
    hourly_rate?: number;
    user_type?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface ContractFormData {
  title: string;
  description: string;
  total_amount: number;
  payment_type: 'fixed' | 'hourly';
  hourly_rate?: number;
  start_date: string;
  end_date: string;
  terms_and_conditions: string;
  payment_terms: string;
}

export default function ContractCreationForm({ 
  professionalId, 
  professional, 
  isOpen, 
  onClose 
}: ContractCreationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContractFormData>({
    title: '',
    description: '',
    total_amount: 0,
    payment_type: 'fixed',
    hourly_rate: professional.hourly_rate || 0,
    start_date: '',
    end_date: '',
    terms_and_conditions: '',
    payment_terms: 'Payment will be made upon completion of milestones as agreed.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_amount' || name === 'hourly_rate' ? parseFloat(value) || 0 : value
    }));
  };

  const { isAuthenticated, user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        toast.error('You need to login to create a contract');
        router.push('/login');
        onClose();
        return;
      }

      // Validate form data
      if (!formData.title.trim()) {
        throw new Error('Project title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Project description is required');
      }
      if (formData.payment_type === 'fixed' && formData.total_amount <= 0) {
        throw new Error('Project budget must be greater than 0');
      }
      if (formData.payment_type === 'hourly' && (!formData.hourly_rate || formData.hourly_rate <= 0)) {
        throw new Error('Hourly rate must be greater than 0');
      }
      if (!formData.start_date) {
        throw new Error('Start date is required');
      }
      if (!formData.end_date) {
        throw new Error('End date is required');
      }

      // Create the contract data based on payment type
      const contractData: any = {
        title: formData.title,
        description: formData.description,
        payment_type: formData.payment_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        terms_and_conditions: formData.terms_and_conditions,
        payment_terms: formData.payment_terms,
        professional: professionalId,
        client: user.id
      };

      // Add payment-specific fields
      if (formData.payment_type === 'fixed') {
        contractData.total_amount = formData.total_amount;
      } else if (formData.payment_type === 'hourly') {
        contractData.hourly_rate = formData.hourly_rate;
        // For hourly contracts, we still need a total_amount (can be estimated)
        contractData.total_amount = (formData.hourly_rate || 0) * 40; // Default 40 hours estimate
      }

      const contract = await contractsService.createContract(contractData);
      
      toast.success('Contract created successfully!');
      // Redirect to contracts page
      router.push('/client/contracts');
      onClose();
    } catch (error) {
      console.error('Error creating contract:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create contract';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-dark-900">Create Contract</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Professional Info */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={professional.avatar || '/default-avatar.png'}
              alt={professional.display_name || professional.full_name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-dark-900">
                {professional.display_name || professional.full_name}
              </h3>
              <p className="text-sm text-primary-600">${professional.hourly_rate || 0}/hr</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter project title"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the project"
                required
              />
            </div>

            {/* Payment Type & Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Payment Type *
                </label>
                <select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  {formData.payment_type === 'fixed' ? 'Budget ($)' : 'Rate ($)'} *
                </label>
                <input
                  type="number"
                  name={formData.payment_type === 'fixed' ? 'total_amount' : 'hourly_rate'}
                  value={formData.payment_type === 'fixed' ? formData.total_amount : formData.hourly_rate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Contract</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}