'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star,
  Plus,
  ArrowLeft,
  CheckCircle,
  Edit2,
  Share2,
  ThumbsUp,
  ThumbsDown,
  User,
  Eye,
  MessageCircle,
  X,
  Camera,
  Send,
  Search,
  XCircle
} from 'lucide-react';
import { getMyReviews, Review } from '@/services/reviewApi';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-hot-toast';

interface Project {
  id: number;
  name: string;
  professionalName: string;
  professionalAvatar: string;
  projectType: string;
  completedDate: string;
  canReview: boolean;
}

export default function ClientReviewsPage() {
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    wouldRecommend: true,
    isPublic: true
  });

  // Fetch reviews from API
  const fetchReviews = async (type: 'given' | 'received' = 'given') => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await getMyReviews(type);
      if (type === 'given') {
        setReviews(response.results || []);
      } else {
        setReceivedReviews(response.results || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type} reviews:`, error);
      toast.error(`Failed to load ${type} reviews`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both given and received reviews
  const fetchAllReviews = async () => {
    if (user) {
      await Promise.all([
        fetchReviews('given'),
        fetchReviews('received')
      ]);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, [user]);

  // Handle tab change
  const handleTabChange = (tab: 'given' | 'received') => {
    setActiveTab(tab);
  };

  // Get current reviews based on active tab
  const currentReviews = activeTab === 'given' ? reviews : receivedReviews;

  // Sample projects that can be reviewed
  const completedProjects = [
    {
      id: 5,
      name: 'Living Room Redesign',
      professionalName: 'Maria Santos',
      professionalAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      completedDate: '2024-01-18',
      projectType: 'Interior Design',
      canReview: true
    },
    {
      id: 6,
      name: 'Deck Installation',
      professionalName: 'James Wilson',
      professionalAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      completedDate: '2024-01-16',
      projectType: 'Carpentry',
      canReview: true
    }
  ];

  const filteredReviews = currentReviews.filter(review => {
    const matchesSearch = (review.project_info?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.reviewee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.reviewee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === '5-star') return matchesSearch && review.rating === 5;
    if (selectedFilter === '4-star') return matchesSearch && review.rating === 4;
    if (selectedFilter === '3-star') return matchesSearch && review.rating === 3;
    if (selectedFilter === '2-star') return matchesSearch && review.rating === 2;
    if (selectedFilter === '1-star') return matchesSearch && review.rating === 1;
    if (selectedFilter === 'with-response') return matchesSearch && review.reviewee;
    if (selectedFilter === 'recent') return matchesSearch && new Date(review.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return matchesSearch;
  });

  const averageRating = currentReviews.length > 0 ? currentReviews.reduce((sum, review) => sum + review.rating, 0) / currentReviews.length : 0;
  const totalReviews = currentReviews.length;

  const renderStars = (rating: number, size: string = 'h-4 w-4', interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    const safeRating = rating && !isNaN(rating) ? rating : 0;
    
    if (interactive) {
      return Array.from({ length: 5 }, (_, index) => {
        const i = index + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onRatingChange && onRatingChange(i)}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <Star className={`h-5 w-5 ${i <= safeRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          </button>
        );
      });
    }
    
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < safeRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddReview = (project: Project) => {
    setSelectedProject(project);
    setShowAddReviewModal(true);
  };

  const submitReview = () => {
    // Here you would submit the review to your backend
    console.log('Submitting review:', {
      project: selectedProject,
      review: newReview
    });
    setShowAddReviewModal(false);
    setSelectedProject(null);
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      wouldRecommend: true,
      isPublic: true
    });
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/client/dashboard" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-dark-900">My Reviews</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddReviewModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Write Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('given')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'given'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Given Reviews ({reviews.length})
              </button>
              <button
                onClick={() => handleTabChange('received')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Received Reviews ({receivedReviews.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Average Rating */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-dark-900 mb-2">
                {(averageRating && !isNaN(averageRating) ? averageRating.toFixed(1) : '0.0')}
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(Math.round(averageRating), 'h-5 w-5')}
              </div>
              <p className="text-sm text-gray-600">
                {activeTab === 'given' ? 'Your average rating' : 'Average rating received'}
              </p>
            </div>
          </div>
          
          {/* Total Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-dark-900 mb-2">
                {totalReviews}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {activeTab === 'given' ? 'Total reviews written' : 'Total reviews received'}
              </p>
              <div className="text-xs text-green-600">
                +2 this month
              </div>
            </div>
          </div>
          
          {/* Helpful Votes */}

        </div>

        {/* Pending Reviews */}
        {activeTab === 'given' && completedProjects.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-900">Projects Awaiting Review</h2>
              <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                {completedProjects.length} pending
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={project.professionalAvatar}
                      alt={project.professionalName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-dark-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.professionalName} • {project.projectType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-xs text-gray-500">{project.completedDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddReview(project)}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                  >
                    Write Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'given' ? 'Search given reviews...' : 'Search received reviews...'}
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
                <option value="with-response">With Response</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading reviews...</span>
          </div>
        ) : (
          /* Reviews List */
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {activeTab === 'given' ? (
                        review.reviewee.avatar ? (
                          <img
                            src={review.reviewee.avatar}
                            alt={`${review.reviewee.first_name} ${review.reviewee.last_name}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )
                      ) : (
                        review.reviewer.avatar ? (
                          <img
                            src={review.reviewer.avatar}
                            alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-900">
                        {activeTab === 'given' 
                          ? `${review.reviewee.first_name} ${review.reviewee.last_name}`
                          : `${review.reviewer.first_name} ${review.reviewer.last_name}`
                        }
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activeTab === 'given'
                          ? (review.reviewee.user_type === 'professional' ? 'Service Provider' : 'Client')
                          : (review.reviewer.user_type === 'professional' ? 'Service Provider' : 'Client')
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {review.reviewee.is_verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                
                {/* Review Content */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
                
                {/* Project/Contract Details */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {review.project_info && (
                      <div>
                        <span className="text-gray-500">Project:</span>
                        <p className="font-medium text-dark-900">{review.project_info.title}</p>
                      </div>
                    )}
                    {review.contract_info && (
                      <div>
                        <span className="text-gray-500">Contract:</span>
                        <p className="font-medium text-dark-900">{review.contract_info.title}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Review Type:</span>
                      <p className="font-medium text-dark-900">
                        {review.review_type === 'client_to_professional' ? 'Service Provider Review' : 'Client Review'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Overall Rating:</span>
                      <p className="font-medium text-dark-900">{(review.average_rating && !isNaN(review.average_rating) ? review.average_rating.toFixed(1) : '0.0')}/5.0</p>
                    </div>
                  </div>
                </div>
                
                {/* Detailed Ratings */}
                {review.review_type === 'client_to_professional' && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Detailed Ratings:</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {review.quality_rating && (
                        <div className="flex justify-between">
                          <span>Quality:</span>
                          <div className="flex">{renderStars(review.quality_rating, 'h-3 w-3')}</div>
                        </div>
                      )}
                      {review.communication_rating && (
                        <div className="flex justify-between">
                          <span>Communication:</span>
                          <div className="flex">{renderStars(review.communication_rating, 'h-3 w-3')}</div>
                        </div>
                      )}
                      {review.timeliness_rating && (
                        <div className="flex justify-between">
                          <span>Timeliness:</span>
                          <div className="flex">{renderStars(review.timeliness_rating, 'h-3 w-3')}</div>
                        </div>
                      )}
                      {review.professionalism_rating && (
                        <div className="flex justify-between">
                          <span>Professionalism:</span>
                          <div className="flex">{renderStars(review.professionalism_rating, 'h-3 w-3')}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Recommendation */}
                <div className="flex items-center space-x-2 mb-4">
                  {review.would_recommend ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {review.would_recommend ? 'Would recommend' : 'Would not recommend'}
                  </span>
                </div>
                
                {/* Review Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{review.helpful_count} helpful</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{review.is_public ? 'Public' : 'Private'} review</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-500 mb-6">
               {searchQuery || selectedFilter !== 'all' 
                 ? 'No reviews match your current filters. Try adjusting your search or filter criteria.'
                 : 'You haven\'t written any reviews yet. Complete a project to leave your first review.'}
             </p>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">
                {selectedProject ? `Review: ${selectedProject.name}` : 'Write a Review'}
              </h3>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {selectedProject && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-6">
                <img
                  src={selectedProject.professionalAvatar}
                  alt={selectedProject.professionalName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-dark-900">{selectedProject.professionalName}</p>
                  <p className="text-sm text-gray-600">{selectedProject.projectType}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(newReview.rating, 'h-8 w-8', true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                  <span className="ml-3 text-sm text-gray-600">({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})</span>
                </div>
              </div>
              
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Summarize your experience"
                />
              </div>
              
              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Review *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Share details about your experience..."
                />
              </div>
              
              {/* Recommendation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you recommend this professional?
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      checked={newReview.wouldRecommend === true}
                      onChange={() => setNewReview(prev => ({ ...prev, wouldRecommend: true }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Yes, I would recommend</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      checked={newReview.wouldRecommend === false}
                      onChange={() => setNewReview(prev => ({ ...prev, wouldRecommend: false }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">No, I would not recommend</span>
                  </label>
                </div>
              </div>
              

              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={!newReview.title || !newReview.comment}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}