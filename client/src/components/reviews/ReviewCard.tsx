import React from 'react';
import { Star, ThumbsUp, Calendar, User, Award } from 'lucide-react';
import { Review } from '../../services/reviewApi';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  showReviewee?: boolean;
  showReviewer?: boolean;
  compact?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  showReviewee = true, 
  showReviewer = true, 
  compact = false 
}) => {
  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderDetailedRatings = () => {
    if (review.review_type === 'client_to_professional') {
      return (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {review.quality_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quality:</span>
              {renderStars(review.quality_rating)}
            </div>
          )}
          {review.communication_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Communication:</span>
              {renderStars(review.communication_rating)}
            </div>
          )}
          {review.timeliness_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Timeliness:</span>
              {renderStars(review.timeliness_rating)}
            </div>
          )}
          {review.professionalism_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Professionalism:</span>
              {renderStars(review.professionalism_rating)}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {review.cooperation_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cooperation:</span>
              {renderStars(review.cooperation_rating)}
            </div>
          )}
          {review.payment_timeliness_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment:</span>
              {renderStars(review.payment_timeliness_rating)}
            </div>
          )}
          {review.clarity_rating && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Clarity:</span>
              {renderStars(review.clarity_rating)}
            </div>
          )}
        </div>
      );
    }
  };

  const getReviewTypeLabel = () => {
    return review.review_type === 'client_to_professional' 
      ? 'Client Review' 
      : 'Professional Review';
  };

  const getReviewTypeColor = () => {
    return review.review_type === 'client_to_professional'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${
      compact ? 'p-4' : 'p-6'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {showReviewer && (
            <div className="flex items-center gap-2">
              {review.reviewer.avatar ? (
                <img
                  src={review.reviewer.avatar}
                  alt={review.reviewer.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {review.reviewer.first_name} {review.reviewer.last_name}
                  </span>
                  {review.reviewer.is_verified && (
                    <Award className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <span className="text-sm text-gray-500">@{review.reviewer.username}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getReviewTypeColor()
          }`}>
            {getReviewTypeLabel()}
          </span>
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Reviewee Info */}
      {showReviewee && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Review for:</span>
            <div className="flex items-center gap-2">
              {review.reviewee.avatar ? (
                <img
                  src={review.reviewee.avatar}
                  alt={review.reviewee.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
              )}
              <span className="font-medium text-gray-900">
                {review.reviewee.first_name} {review.reviewee.last_name}
              </span>
              {review.reviewee.is_verified && (
                <Award className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Project/Contract Info */}
      {(review.project_info || review.contract_info) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          {review.project_info && (
            <div>
              <span className="text-sm text-gray-600">Project: </span>
              <span className="font-medium text-blue-900">{review.project_info.title}</span>
            </div>
          )}
          {review.contract_info && (
            <div>
              <span className="text-sm text-gray-600">Contract: </span>
              <span className="font-medium text-blue-900">{review.contract_info.title}</span>
            </div>
          )}
        </div>
      )}

      {/* Overall Rating */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Overall Rating</span>
          {renderStars(review.rating, 'md')}
        </div>
      </div>

      {/* Detailed Ratings */}
      {!compact && renderDetailedRatings()}

      {/* Comment */}
      {review.comment && (
        <div className="mt-4">
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          {review.would_recommend && (
            <div className="flex items-center gap-1 text-green-600">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">Recommends</span>
            </div>
          )}
          {review.helpful_count > 0 && (
            <span className="text-sm text-gray-500">
              {review.helpful_count} found this helpful
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!review.is_public && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              Private
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;