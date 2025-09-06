import React, { useState, useEffect } from 'react';
import { Star, Save, X } from 'lucide-react';
import { CreateReviewData, Review } from '../../services/reviewApi';

interface ReviewFormProps {
  onSubmit: (data: CreateReviewData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Review>;
  reviewType: 'client_to_professional' | 'professional_to_client';
  revieweeId: number;
  projectId?: number;
  contractId?: number;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  reviewType,
  revieweeId,
  projectId,
  contractId,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateReviewData>({
    reviewee: revieweeId,
    review_type: reviewType,
    rating: initialData?.rating || 5,
    comment: initialData?.comment || '',
    quality_rating: initialData?.quality_rating || 5,
    communication_rating: initialData?.communication_rating || 5,
    timeliness_rating: initialData?.timeliness_rating || 5,
    professionalism_rating: initialData?.professionalism_rating || 5,
    cooperation_rating: initialData?.cooperation_rating || 5,
    payment_timeliness_rating: initialData?.payment_timeliness_rating || 5,
    clarity_rating: initialData?.clarity_rating || 5,
    would_recommend: initialData?.would_recommend ?? true,
    is_public: initialData?.is_public ?? true,
    ...(projectId && { project: projectId }),
    ...(contractId && { contract: contractId })
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void, label: string) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= value
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
        </div>
      </div>
    );
  };

  const renderClientToProfessionalRatings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderStarRating(
        formData.quality_rating || 5,
        (rating) => setFormData(prev => ({ ...prev, quality_rating: rating })),
        'Quality of Work'
      )}
      {renderStarRating(
        formData.communication_rating || 5,
        (rating) => setFormData(prev => ({ ...prev, communication_rating: rating })),
        'Communication'
      )}
      {renderStarRating(
        formData.timeliness_rating || 5,
        (rating) => setFormData(prev => ({ ...prev, timeliness_rating: rating })),
        'Timeliness'
      )}
      {renderStarRating(
        formData.professionalism_rating || 5,
        (rating) => setFormData(prev => ({ ...prev, professionalism_rating: rating })),
        'Professionalism'
      )}
    </div>
  );

  const renderProfessionalToClientRatings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderStarRating(
        formData.cooperation_rating || 5,
        (rating) => setFormData(prev => ({ ...prev, cooperation_rating: rating })),
        'Cooperation'
      )}
      {renderStarRating(
        formData.payment_timeliness_rating || 5,
        (rating) => setFormData(prev => ({ ...prev, payment_timeliness_rating: rating })),
        'Payment Timeliness'
      )}
      {renderStarRating(
        formData.clarity_rating || 5,
        (rating) => setFormData(prev => ({ ...prev, clarity_rating: rating })),
        'Project Clarity'
      )}
    </div>
  );

  const getFormTitle = () => {
    if (reviewType === 'client_to_professional') {
      return initialData ? 'Edit Professional Review' : 'Review Professional';
    } else {
      return initialData ? 'Edit Client Review' : 'Review Client';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{getFormTitle()}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Overall Rating */}
        <div>
          {renderStarRating(
            formData.rating,
            (rating) => setFormData(prev => ({ ...prev, rating })),
            'Overall Rating'
          )}
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Detailed Ratings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Ratings</h3>
          {reviewType === 'client_to_professional' 
            ? renderClientToProfessionalRatings()
            : renderProfessionalToClientRatings()
          }
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Review Comment *
          </label>
          <textarea
            id="comment"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.comment ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Share your experience working together..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
          )}
        </div>

        {/* Recommendation */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.would_recommend}
              onChange={(e) => setFormData(prev => ({ ...prev, would_recommend: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {reviewType === 'client_to_professional' 
                ? 'I would recommend this professional to others'
                : 'I would recommend this client to other professionals'
              }
            </span>
          </label>
        </div>

        {/* Privacy */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Make this review public
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Public reviews help other users make informed decisions
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2 inline" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            {isLoading ? 'Saving...' : (initialData ? 'Update Review' : 'Submit Review')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;