import React, { useState, useEffect } from 'react';
import { Filter, Search, SortAsc, SortDesc, Star, Users, Award } from 'lucide-react';
import { Review, ReviewFilters, getReviews } from '../../services/reviewApi';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface ReviewsListProps {
  userId?: number;
  userType?: 'client' | 'professional';
  reviewType?: 'client_to_professional' | 'professional_to_client' | 'all';
  showFilters?: boolean;
  compact?: boolean;
  limit?: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  userId,
  userType,
  reviewType = 'all',
  showFilters = true,
  compact = false,
  limit
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ReviewFilters>({
    ...(userId && userType === 'professional' && { reviewee_id: userId }),
    ...(userId && userType === 'client' && { reviewee_id: userId }),
    ...(reviewType !== 'all' && { review_type: reviewType }),
    ordering: '-created_at'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const itemsPerPage = limit || 10;

  useEffect(() => {
    fetchReviews();
  }, [filters, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryFilters = {
        ...filters,
        ...(searchTerm && { search: searchTerm }),
        page: currentPage,
        page_size: itemsPerPage
      };
      
      const response = await getReviews(queryFilters);
      setReviews(response.results);
      setTotalCount(response.count);
    } catch (err) {
      setError('Failed to load reviews. Please try again.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: string) => {
    const currentOrdering = filters.ordering || '';
    let newOrdering = field;
    
    if (currentOrdering === field) {
      newOrdering = `-${field}`;
    } else if (currentOrdering === `-${field}`) {
      newOrdering = field;
    }
    
    handleFilterChange({ ordering: newOrdering });
  };

  const getSortIcon = (field: string) => {
    const currentOrdering = filters.ordering || '';
    if (currentOrdering === field) {
      return <SortAsc className="w-4 h-4" />;
    } else if (currentOrdering === `-${field}`) {
      return <SortDesc className="w-4 h-4" />;
    }
    return null;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRecommendationRate = () => {
    if (reviews.length === 0) return 0;
    const recommendCount = reviews.filter(review => review.would_recommend).length;
    return Math.round((recommendCount / reviews.length) * 100);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews {reviewType !== 'all' && `(${reviewType.replace('_', ' ').replace('to', 'to')})`}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">{getAverageRating()}</span>
              </div>
              <span className="text-sm text-gray-500">Average Rating</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-xl font-bold">{totalCount}</span>
              </div>
              <span className="text-sm text-gray-500">Total Reviews</span>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Award className="w-5 h-5 text-green-500" />
                <span className="text-xl font-bold">{getRecommendationRate()}%</span>
              </div>
              <span className="text-sm text-gray-500">Recommend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Review Type Filter */}
              {reviewType === 'all' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Type
                  </label>
                  <select
                    value={filters.review_type || ''}
                    onChange={(e) => handleFilterChange({ 
                      review_type: e.target.value as 'client_to_professional' | 'professional_to_client' | undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="client_to_professional">Client to Professional</option>
                    <option value="professional_to_client">Professional to Client</option>
                  </select>
                </div>
              )}

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating_min || ''}
                  onChange={(e) => handleFilterChange({ 
                    rating_min: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSortChange('created_at')}
                    className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md ${
                      filters.ordering?.includes('created_at')
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Date {getSortIcon('created_at')}
                  </button>
                  <button
                    onClick={() => handleSortChange('rating')}
                    className={`flex items-center gap-1 px-3 py-2 text-sm border rounded-md ${
                      filters.ordering?.includes('rating')
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Rating {getSortIcon('rating')}
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({
                      ...(userId && userType === 'professional' && { reviewee_id: userId }),
                      ...(userId && userType === 'client' && { reviewee_id: userId }),
                      ...(reviewType !== 'all' && { review_type: reviewType }),
                      ordering: '-created_at'
                    });
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {reviews.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {searchTerm || Object.keys(filters).length > 1
              ? 'Try adjusting your search or filters'
              : 'No reviews have been submitted yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              compact={compact}
              showReviewee={!userId || userType !== 'professional'}
              showReviewer={!userId || userType !== 'client'}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-md">
          <div className="flex items-center text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} reviews
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {loading && reviews.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default ReviewsList;