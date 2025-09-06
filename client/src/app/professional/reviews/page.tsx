'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { getMyReviews, Review } from '@/services/reviewApi';
import { toast } from 'react-hot-toast';
import { 
  Star,
  Search,
  User,
  MapPin,
  MessageCircle,
  ThumbsUp,
  Reply,
  Share2,
  Download,
  CheckCircle,
  ArrowLeft,
  MoreVertical,
  X
} from 'lucide-react';

export default function ProfessionalReviewsPage() {
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentReply, setCurrentReply] = useState('');
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const fetchedReviews = await getMyReviews(activeTab);
        setReviews(fetchedReviews.results);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user, activeTab]);

  const filteredReviews = reviews.filter(review => {
    const reviewerName = `${review.reviewer.first_name} ${review.reviewer.last_name}`;
    const projectTitle = review.project_info?.title || review.contract_info?.title || '';
    
    const matchesSearch = reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === '5-star') return matchesSearch && review.rating === 5;
    if (selectedFilter === '4-star') return matchesSearch && review.rating === 4;
    if (selectedFilter === '3-star') return matchesSearch && review.rating === 3;
    if (selectedFilter === '2-star') return matchesSearch && review.rating === 2;
    if (selectedFilter === '1-star') return matchesSearch && review.rating === 1;
    if (selectedFilter === 'recent') return matchesSearch && new Date(review.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (selectedFilter === 'public') return matchesSearch && review.is_public;
    if (selectedFilter === 'with-images') return matchesSearch; // Images not available in current interface
    if (selectedFilter === 'no-response') return matchesSearch; // Response not available in current interface
    
    return matchesSearch;
  });

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const totalReviews = reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const renderStars = (rating: number, size: string = 'h-4 w-4') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className={`${size} fill-yellow-400 text-yellow-400`} />);
      } else {
        stars.push(<Star key={i} className={`${size} text-gray-300`} />);
      }
    }
    return stars;
  };

  const handleReply = (review: typeof reviews[0]) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const submitReply = () => {
    // Here you would typically send the reply to your backend
    console.log('Reply submitted:', currentReply);
    setShowReplyModal(false);
    setCurrentReply('');
    setSelectedReview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/professional/dashboard" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-dark-900">
                {activeTab === 'received' ? 'Received Reviews' : 'Given Reviews'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Download className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-xl shadow-sm p-1 mb-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === 'received'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Received Reviews
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === 'given'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Given Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Rating */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-dark-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(Math.round(averageRating), 'h-5 w-5')}
              </div>
              <p className="text-sm text-gray-600">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-dark-900 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-8">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalReviews > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating as keyof typeof ratingDistribution]}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-dark-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Public Reviews</span>
                <span className="text-sm font-medium text-dark-900">
                  {reviews.filter(r => r.is_public).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Would Recommend</span>
                <span className="text-sm font-medium text-dark-900">
                  {reviews.filter(r => r.would_recommend).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verified</span>
                <span className="text-sm font-medium text-dark-900">
                  {reviews.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Helpful Votes</span>
                <span className="text-sm font-medium text-dark-900">
                  {reviews.reduce((sum, r) => sum + (r.helpful_count || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Reviews</option>
                <option value="5-star">5 Star</option>
                <option value="4-star">4 Star</option>
                <option value="3-star">3 Star</option>
                <option value="2-star">2 Star</option>
                <option value="1-star">1 Star</option>
                <option value="with-images">With Images</option>
                <option value="no-response">No Response</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={review.reviewer.avatar || '/default-avatar.png'}
                  alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-dark-900">
                        {`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                      </h3>
                      {review.reviewer.is_verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>
                        {review.project_info?.title || review.contract_info?.title || 'Project'}
                      </strong>
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {activeTab === 'given' && (
                        <span className="text-primary-600">• Review for Client</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">{review.helpful_count || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'received' ? 'No received reviews found' : 'No given reviews found'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'received' 
                ? 'You haven\'t received any reviews yet. Complete more projects to get reviews from clients.' 
                : 'You haven\'t given any reviews yet. Leave reviews for clients you\'ve worked with.'}
            </p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">Reply to Review</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={selectedReview.reviewer.avatar || '/default-avatar.png'}
                    alt={`${selectedReview.reviewer.first_name} ${selectedReview.reviewer.last_name}`}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-dark-900">{selectedReview.reviewer.first_name} {selectedReview.reviewer.last_name}</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedReview.rating, 'h-3 w-3')}
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{selectedReview.comment}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={currentReply}
                  onChange={(e) => setCurrentReply(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Thank you for your review..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReply}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}