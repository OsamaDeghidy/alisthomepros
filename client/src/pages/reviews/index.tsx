import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Star, Users, TrendingUp, Award, Plus, Filter } from 'lucide-react';
import ReviewsList from '../../components/reviews/ReviewsList';
import ReviewForm from '../../components/reviews/ReviewForm';
import { 
  getMyReviews, 
  createReview, 
  CreateReviewData,
  Review 
} from '../../services/reviewApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ReviewsPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'received' | 'given'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReceived: 0,
    totalGiven: 0,
    averageRating: 0,
    recommendationRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchReviewStats();
  }, [isAuthenticated, router]);

  const fetchReviewStats = async () => {
    try {
      setLoading(true);
      
      // Fetch received reviews
      const receivedResponse = await getMyReviews('received');
      const givenResponse = await getMyReviews('given');
      
      const receivedReviews = receivedResponse.results;
      const givenReviews = givenResponse.results;
      
      // Calculate stats
      const totalReceived = receivedReviews.length;
      const totalGiven = givenReviews.length;
      
      const averageRating = totalReceived > 0 
        ? receivedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReceived
        : 0;
      
      const recommendationRate = totalReceived > 0
        ? (receivedReviews.filter(review => review.would_recommend).length / totalReceived) * 100
        : 0;
      
      setReviewStats({
        totalReceived,
        totalGiven,
        averageRating: Math.round(averageRating * 10) / 10,
        recommendationRate: Math.round(recommendationRate)
      });
    } catch (error) {
      console.error('Error fetching review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (reviewData: CreateReviewData) => {
    try {
      setCreateLoading(true);
      await createReview(reviewData);
      setShowCreateForm(false);
      // Refresh stats and current tab data
      fetchReviewStats();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your reviews and see feedback from your collaborations
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4" />
                Write Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    {renderStars(reviewStats.averageRating)}
                  </div>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{reviewStats.totalReceived}</p>
                  <p className="text-sm text-gray-500">Reviews Received</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{reviewStats.totalGiven}</p>
                  <p className="text-sm text-gray-500">Reviews Given</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{reviewStats.recommendationRate}%</p>
                  <p className="text-sm text-gray-500">Recommendation Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { key: 'all', label: 'All Reviews', count: reviewStats.totalReceived + reviewStats.totalGiven },
                { key: 'received', label: 'Reviews Received', count: reviewStats.totalReceived },
                { key: 'given', label: 'Reviews Given', count: reviewStats.totalGiven }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'all' | 'received' | 'given')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Reviews Content */}
        <div className="space-y-6">
          {activeTab === 'all' && (
            <ReviewsList
              showFilters={true}
              compact={false}
            />
          )}
          
          {activeTab === 'received' && (
            <ReviewsList
              userId={user?.id}
              userType={user?.user_type as 'client' | 'professional'}
              showFilters={true}
              compact={false}
            />
          )}
          
          {activeTab === 'given' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reviews You've Given</h3>
              <p className="text-gray-500 mb-6">
                Here you can see all the reviews you've submitted for your collaborations.
              </p>
              {/* This would show reviews where current user is the reviewer */}
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Reviews you've given will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Review Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ReviewForm
              onSubmit={handleCreateReview}
              onCancel={() => setShowCreateForm(false)}
              reviewType="client_to_professional" // This would be dynamic based on context
              revieweeId={1} // This would be dynamic based on selected user
              isLoading={createLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;