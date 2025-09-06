'use client';

import React, { useState } from 'react';
import { Star, X, User, CheckCircle } from 'lucide-react';
import { createReview, CreateReviewData, ReviewEligibility } from '@/services/reviewApi';
import { toast } from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  eligibility: ReviewEligibility;
  onReviewSubmitted?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  eligibility,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [specificRatings, setSpecificRatings] = useState({
    quality_rating: 0,
    communication_rating: 0,
    timeliness_rating: 0,
    professionalism_rating: 0,
    cooperation_rating: 0,
    payment_timeliness_rating: 0,
    clarity_rating: 0
  });
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isClientToProReview = eligibility.review_type === 'client_to_professional';

  const handleStarClick = (value: number, field?: string) => {
    if (field) {
      setSpecificRatings(prev => ({ ...prev, [field]: value }));
    } else {
      setRating(value);
    }
  };

  const renderStars = (currentRating: number, onStarClick: (value: number) => void, hoverValue?: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onStarClick(star)}
            onMouseEnter={() => hoverValue !== undefined && setHoverRating(star)}
            onMouseLeave={() => hoverValue !== undefined && setHoverRating(0)}
            className="focus:outline-none transition-colors"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hoverValue || currentRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !comment.trim()) {
      toast.error('Please provide a rating and comment');
      return;
    }

    if (!eligibility.reviewee || !eligibility.contract) {
      toast.error('Invalid review data');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: CreateReviewData = {
        contract: eligibility.contract.id,
        reviewee: eligibility.reviewee.id,
        review_type: eligibility.review_type!,
        rating,
        comment: comment.trim(),
        would_recommend: wouldRecommend,
        is_public: isPublic
      };

      // Add specific ratings based on review type
      if (isClientToProReview) {
        reviewData.quality_rating = specificRatings.quality_rating;
        reviewData.communication_rating = specificRatings.communication_rating;
        reviewData.timeliness_rating = specificRatings.timeliness_rating;
        reviewData.professionalism_rating = specificRatings.professionalism_rating;
      } else {
        reviewData.cooperation_rating = specificRatings.cooperation_rating;
        reviewData.payment_timeliness_rating = specificRatings.payment_timeliness_rating;
        reviewData.clarity_rating = specificRatings.clarity_rating;
      }

      await createReview(reviewData);
      toast.success('Review submitted successfully!');
      onReviewSubmitted?.();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isClientToProReview ? 'Review Service Provider' : 'Review Client'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Reviewee Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{eligibility.reviewee?.name}</h3>
                <p className="text-sm text-gray-600">
                  {eligibility.reviewee?.user_type === 'professional' ? 'Service Provider' : 'Client'}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Contract:</strong> {eligibility.contract?.title}
              </p>
              <p className="text-sm text-gray-500">
                Contract #{eligibility.contract?.contract_number}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Overall Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              {renderStars(rating, setRating, hoverRating)}
            </div>

            {/* Specific Ratings */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Detailed Ratings
              </h3>
              <div className="space-y-4">
                {isClientToProReview ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Quality of Work</span>
                      {renderStars(specificRatings.quality_rating, (value) => handleStarClick(value, 'quality_rating'))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Communication</span>
                      {renderStars(specificRatings.communication_rating, (value) => handleStarClick(value, 'communication_rating'))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Timeliness</span>
                      {renderStars(specificRatings.timeliness_rating, (value) => handleStarClick(value, 'timeliness_rating'))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Professionalism</span>
                      {renderStars(specificRatings.professionalism_rating, (value) => handleStarClick(value, 'professionalism_rating'))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Cooperation</span>
                      {renderStars(specificRatings.cooperation_rating, (value) => handleStarClick(value, 'cooperation_rating'))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Payment Timeliness</span>
                      {renderStars(specificRatings.payment_timeliness_rating, (value) => handleStarClick(value, 'payment_timeliness_rating'))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Clarity of Requirements</span>
                      {renderStars(specificRatings.clarity_rating, (value) => handleStarClick(value, 'clarity_rating'))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Comment *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Share your experience working with this ${isClientToProReview ? 'service provider' : 'client'}...`}
                required
              />
            </div>

            {/* Options */}
            <div className="mb-6 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={wouldRecommend}
                  onChange={(e) => setWouldRecommend(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I would recommend this {isClientToProReview ? 'service provider' : 'client'} to others
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Make this review public
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !rating || !comment.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;