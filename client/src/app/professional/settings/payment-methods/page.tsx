'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { paymentMethodsApi, PaymentMethod as ApiPaymentMethod, PaymentMethodCreate } from '@/services/paymentsApi';
import {
  CreditCard,
  Building2,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';

// Use the PaymentMethod interface from the API service
type PaymentMethod = ApiPaymentMethod;

interface PaymentMethodForm {
  type: 'card' | 'bank_account' | 'paypal';
  provider: string;
  cardholder_name: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  routing_number: string;
  iban: string;
  swift_code: string;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;
  is_default: boolean;
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<PaymentMethodForm>({
    type: 'card',
    provider: '',
    cardholder_name: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    routing_number: '',
    iban: '',
    swift_code: '',
    billing_address_line1: '',
    billing_address_line2: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: 'US',
    is_default: false
  });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const methods = await paymentMethodsApi.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (err: any) {
      console.error('Error loading payment methods:', err);
      setError(err.errorInfo?.message || 'Error loading payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert form data to API format - only include fields that exist in PaymentMethodCreateSerializer
      const apiData: PaymentMethodCreate = {
        type: formData.type,
        is_default: formData.is_default
      };
      
      // Add provider if specified
      if (formData.provider) {
        apiData.provider = formData.provider;
      }
      
      // Add card-specific fields if type is card
      if (formData.type === 'card') {
        if (formData.cardholder_name) {
          apiData.cardholder_name = formData.cardholder_name;
        }
        if (formData.card_number) {
          apiData.card_number = formData.card_number;
        }
        if (formData.expiry_date) {
          apiData.expiry_date = formData.expiry_date;
        }
        if (formData.cvv) {
          apiData.cvv = formData.cvv;
        }
      }
      
      // Add bank account fields if type is bank_account
      if (formData.type === 'bank_account') {
        if (formData.bank_name) {
          apiData.bank_name = formData.bank_name;
        }
        if (formData.account_holder_name) {
          apiData.account_holder_name = formData.account_holder_name;
        }
        if (formData.account_number) {
          apiData.account_number = formData.account_number;
        }
        if (formData.routing_number) {
          apiData.routing_number = formData.routing_number;
        }
        if (formData.iban) {
          apiData.iban = formData.iban;
        }
        if (formData.swift_code) {
          apiData.swift_code = formData.swift_code;
        }
      }
      
      // Add billing address fields if provided
      if (formData.billing_address_line1) {
        apiData.billing_address_line1 = formData.billing_address_line1;
      }
      if (formData.billing_address_line2) {
        apiData.billing_address_line2 = formData.billing_address_line2;
      }
      if (formData.billing_city) {
        apiData.billing_city = formData.billing_city;
      }
      if (formData.billing_state) {
        apiData.billing_state = formData.billing_state;
      }
      if (formData.billing_postal_code) {
        apiData.billing_postal_code = formData.billing_postal_code;
      }
      if (formData.billing_country) {
        apiData.billing_country = formData.billing_country;
      }

      if (editingMethod) {
        await paymentMethodsApi.updatePaymentMethod(editingMethod.id, apiData as any);
        alert('Payment method updated!');
      } else {
        await paymentMethodsApi.createPaymentMethod(apiData);
        alert('Payment method added!');
      }
      
      await loadPaymentMethods();
      resetForm();
      setShowAddModal(false);
      setEditingMethod(null);
    } catch (err: any) {
      console.error('Error saving payment method:', err);
      alert(err.errorInfo?.message || 'Error occurred while saving');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      await paymentMethodsApi.deletePaymentMethod(id);
      await loadPaymentMethods();
      alert('Payment method deleted!');
    } catch (err: any) {
      console.error('Error deleting payment method:', err);
      alert(err.errorInfo?.message || 'Error occurred while deleting');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await paymentMethodsApi.setDefaultPaymentMethod(id);
      await loadPaymentMethods();
      alert('Default payment method updated!');
    } catch (err: any) {
      console.error('Error setting default:', err);
      alert(err.errorInfo?.message || 'Error occurred while setting default');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'card',
      provider: '',
      cardholder_name: '',
      card_number: '',
      expiry_date: '',
      cvv: '',
      bank_name: '',
      account_holder_name: '',
      account_number: '',
      routing_number: '',
      iban: '',
      swift_code: '',
      billing_address_line1: '',
      billing_address_line2: '',
      billing_city: '',
      billing_state: '',
      billing_postal_code: '',
      billing_country: 'US',
      is_default: false
    });
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      provider: method.provider,
      cardholder_name: method.cardholder_name || '',
      card_number: '',
      expiry_date: '',
      cvv: '',
      bank_name: '',
      account_holder_name: method.cardholder_name || '',
      account_number: '',
      routing_number: '',
      iban: '',
      swift_code: '',
      billing_address_line1: '',
      billing_address_line2: '',
      billing_city: '',
      billing_state: '',
      billing_postal_code: '',
      billing_country: 'US',
      is_default: method.is_default
    });
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadPaymentMethods}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/professional/earnings"
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          </div>
          <p className="text-gray-600">
            Manage your credit cards and bank accounts for deposits and withdrawals
          </p>
        </div>

        {/* Add Payment Method Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm();
              setEditingMethod(null);
              setShowAddModal(true);
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Payment Method</span>
          </button>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      {method.type === 'card' ? (
                        <CreditCard className="h-6 w-6 text-gray-600" />
                      ) : (
                        <Building2 className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {method.provider}
                        </h3>
                        {method.is_default && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        {method.is_verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-gray-600">
                        {method.type === 'card' ? (
                          `**** **** **** ${method.last4}`
                        ) : (
                          `Account ending in ${method.last4}`
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.cardholder_name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!method.is_default && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(method)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Payment Methods
              </h3>
              <p className="text-gray-600 mb-4">
                Add a credit card or bank account to start receiving payments
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setEditingMethod(null);
                  setShowAddModal(true);
                }}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Your First Payment Method
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Payment Method Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingMethod(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'card' })}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          formData.type === 'card'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'bank_account' })}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            formData.type === 'bank_account'
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        <Building2 className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Bank Account</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Fields */}
                  {formData.type === 'card' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            value={formData.cardholder_name}
                            onChange={(e) => setFormData({ ...formData, cardholder_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Provider
                          </label>
                          <select
                            value={formData.provider}
                            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="">Select Provider</option>
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="American Express">American Express</option>
                            <option value="Discover">Discover</option>
                          </select>
                        </div>
                      </div>

                      {!editingMethod && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              value={formData.card_number}
                              onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date *
                              </label>
                              <input
                                type="text"
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV *
                              </label>
                              <input
                                type="text"
                                value={formData.cvv}
                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                placeholder="123"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Billing Address */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address Line 1
                            </label>
                            <input
                              type="text"
                              value={formData.billing_address_line1}
                              onChange={(e) => setFormData({ ...formData, billing_address_line1: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address Line 2
                            </label>
                            <input
                              type="text"
                              value={formData.billing_address_line2}
                              onChange={(e) => setFormData({ ...formData, billing_address_line2: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                value={formData.billing_city}
                                onChange={(e) => setFormData({ ...formData, billing_city: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                              </label>
                              <input
                                type="text"
                                value={formData.billing_state}
                                onChange={(e) => setFormData({ ...formData, billing_state: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Postal Code
                              </label>
                              <input
                                type="text"
                                value={formData.billing_postal_code}
                                onChange={(e) => setFormData({ ...formData, billing_postal_code: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                              </label>
                              <select
                                value={formData.billing_country}
                                onChange={(e) => setFormData({ ...formData, billing_country: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="GB">United Kingdom</option>
                                <option value="AU">Australia</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bank Fields */}
                  {formData.type === 'bank_account' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name *
                          </label>
                          <input
                            type="text"
                            value={formData.bank_name}
                            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name *
                          </label>
                          <input
                            type="text"
                            value={formData.account_holder_name}
                            onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>

                      {!editingMethod && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Account Number *
                            </label>
                            <input
                              type="text"
                              value={formData.account_number}
                              onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Routing Number
                              </label>
                              <input
                                type="text"
                                value={formData.routing_number}
                                onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                SWIFT Code
                              </label>
                              <input
                                type="text"
                                value={formData.swift_code}
                                onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              IBAN (International)
                            </label>
                            <input
                              type="text"
                              value={formData.iban}
                              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Default Option */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                      Set as default payment method
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingMethod(null);
                        resetForm();
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{editingMethod ? 'Update' : 'Add'} Payment Method</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}