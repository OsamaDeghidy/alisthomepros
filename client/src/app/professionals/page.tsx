'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, CheckCircle, Heart, Filter, DollarSign, Clock, Award, Mail, Map, Grid3x3, Loader2 } from 'lucide-react';
import { useProfessionals } from '../../hooks/useProfessionals';
import { Professional, ProfessionalsFilters } from '../../services/professionalsApi';
import { messagingService } from '../../lib/messaging';

export default function ProfessionalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [selectedSort, setSelectedSort] = useState('-rating_average');
  const [contactingProfessional, setContactingProfessional] = useState<number | null>(null);
  
  // Quick filters state
  const [filters, setFilters] = useState({
    online: false,
    licensed: false
  });
  
  const { professionals, loading, error, totalCount, fetchProfessionals } = useProfessionals();

  // Handle contact button click
  const handleContactProfessional = async (professionalId: number) => {
    try {
      setContactingProfessional(professionalId);
      
      // Start conversation with the professional
      const conversation = await messagingService.startConversationWithUser(
        professionalId,
        'مرحباً، أود التحدث معك حول خدماتك.'
      );
      
      // Redirect to messages page with the new conversation
      router.push(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      // You might want to show an error toast here
    } finally {
      setContactingProfessional(null);
    }
  };
  
  // Fetch professionals when form values change
  useEffect(() => {
    const newFilters: ProfessionalsFilters = {
      search: searchQuery || undefined,
      location: selectedLocation || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      is_verified: filters.licensed || undefined,
      is_available: filters.online || undefined,
      ordering: selectedSort,
    };
    
    // Handle rating filter
    if (selectedRating !== 'all') {
      if (selectedRating === '5 Stars') newFilters.min_rating = 5;
      else if (selectedRating === '4+ Stars') newFilters.min_rating = 4;
      else if (selectedRating === '3+ Stars') newFilters.min_rating = 3;
    }
    
    // Handle budget filter
    if (selectedBudget !== 'all') {
      if (selectedBudget === 'Under $50/hr') newFilters.max_hourly_rate = 50;
      else if (selectedBudget === '$50-75/hr') { newFilters.min_hourly_rate = 50; newFilters.max_hourly_rate = 75; }
      else if (selectedBudget === '$75-100/hr') { newFilters.min_hourly_rate = 75; newFilters.max_hourly_rate = 100; }
      else if (selectedBudget === '$100-150/hr') { newFilters.min_hourly_rate = 100; newFilters.max_hourly_rate = 150; }
      else if (selectedBudget === '$150-200/hr') { newFilters.min_hourly_rate = 150; newFilters.max_hourly_rate = 200; }
      else if (selectedBudget === '$200+/hr') newFilters.min_hourly_rate = 200;
    }
    
    // Handle role filter
    if (selectedRole !== 'all') {
      if (selectedRole === 'Home Pro') newFilters.user_type = 'home_pro';
      else if (selectedRole === 'A-List Specialist') newFilters.user_type = 'specialist';
      else if (selectedRole === 'Crew Member') newFilters.user_type = 'crew_member';
    }
    
    fetchProfessionals(newFilters);
  }, [searchQuery, selectedLocation, selectedCategory, selectedRating, selectedBudget, selectedRole, filters.licensed, filters.online, selectedSort, fetchProfessionals]);

  const categories = [
    'All Categories',
    'Kitchen Remodeling',
    'Bathroom Renovation',
    'Electrical Work',
    'Plumbing',
    'Roofing',
    'HVAC Services',
    'Landscaping',
    'Painting',
    'Flooring',
    'Carpentry'
  ];

  const ratingFilters = [
    'All Ratings',
    '5 Stars',
    '4+ Stars',
    '3+ Stars'
  ];

  const budgetFilters = [
    'All Budgets',
    'Under $50/hr',
    '$50-75/hr',
    '$75-100/hr',
    '$100-150/hr',
    '$150-200/hr',
    '$200+/hr'
  ];

  const roleFilters = [
    'All Roles',
    'Home Pro',
    'A-List Specialist',
    'Crew Member'
  ];

  const sortOptions = [
    { value: '-rating_average', label: 'Highest Rated' },
    { value: '-rating_count', label: 'Most Reviews' },
    { value: 'hourly_rate', label: 'Lowest Rate' },
    { value: '-hourly_rate', label: 'Highest Rate' },
    { value: '-projects_completed', label: 'Most Projects' },
    { value: '-created_at', label: 'Recently Joined' }
  ];

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedRating('all');
    setSelectedBudget('all');
    setSelectedRole('all');
    setSearchQuery('');
    setSelectedLocation('');
    setFilters({
      online: false,
      licensed: false,
    });
    setSelectedSort('-rating_average');
  };

  // Handle quick filter changes
  const handleQuickFilterChange = (filterType: string, checked: boolean) => {
    if (filterType === 'online') {
      setFilters(prev => ({
        ...prev,
        online: checked
      }));
    } else if (filterType === 'licensed') {
      setFilters(prev => ({
        ...prev,
        licensed: checked
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.1),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,206,0,0.08),transparent_60%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-dark-900 leading-tight">
                Find Trusted
                <span className="block text-gradient-primary">Home Professionals</span>
              </h1>
              <p className="text-xl lg:text-2xl text-dark-600 leading-relaxed max-w-3xl mx-auto">
                Browse verified professionals with proven track records. Read reviews, compare rates, and hire with confidence.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-upwork-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      What service do you need?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., Kitchen designer, Electrician..."
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        placeholder="Enter city or zip"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button className="w-full bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      Find Pros
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {[
                { value: '5,000+', label: 'Verified Pros' },
                { value: '4.9★', label: 'Average Rating' },
                { value: '50,000+', label: 'Completed Projects' },
                { value: '2h', label: 'Avg Response' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gradient-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-dark-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-lg text-dark-900">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 text-gray-600 hover:text-primary-500 rounded-lg"
                  >
                    <Filter className="h-5 w-5" />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Category</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.map((category, index) => (
                        <option key={index} value={category.toLowerCase().replace(/\s+/g, '-')}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Minimum Rating</label>
                    <select 
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {ratingFilters.map((rating, index) => (
                        <option key={index} value={rating.toLowerCase().replace(/\s+/g, '-')}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Hourly Rate</label>
                    <select 
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {budgetFilters.map((budget, index) => (
                        <option key={index} value={budget.toLowerCase().replace(/\s+/g, '-')}>
                          {budget}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Professional Role</label>
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {roleFilters.map((role, index) => (
                        <option key={index} value={role.toLowerCase().replace(/\s+/g, '-')}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Quick Filters</label>
                    <div className="space-y-2">
                      {[
                        { id: 'online', label: 'Currently Available', icon: '🟢' },
                        { id: 'licensed', label: 'Verified & Licensed', icon: '🛡️' },
                      ].map((filter) => (
                        <label key={filter.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={filters[filter.id as keyof typeof filters] as boolean}
                            onChange={(e) => handleQuickFilterChange(filter.id, e.target.checked)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500" 
                          />
                          <span className="text-sm">{filter.icon}</span>
                          <span className="text-sm text-dark-700">{filter.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Range */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Travel Distance</label>
                    <div className="space-y-2">
                      {[
                        'Within 5 miles',
                        'Within 10 miles',
                        'Within 25 miles',
                        'Within 50 miles',
                        'Any distance'
                      ].map((distance, index) => (
                        <label key={index} className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name="distance" 
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500" 
                          />
                          <span className="text-sm text-dark-700">{distance}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button 
                    onClick={clearAllFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-dark-700 font-medium text-sm py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-semibold text-2xl text-dark-900">Available Professionals</h2>
                  <p className="text-dark-600 mt-1">
                    {loading ? 'Loading...' : `${totalCount || 0} professionals found`}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'map' 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      <Map className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <select 
                    value={selectedSort}
                    onChange={(e) => {
                      setSelectedSort(e.target.value);
                      setFilters(prev => ({ ...prev, ordering: e.target.value }));
                    }}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Map View */}
              {viewMode === 'map' && (
                <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 overflow-hidden mb-6">
                  <div className="h-96 relative bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-dark-900 mb-2">Professional Locations</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Interactive map showing professional locations will be displayed here.
                        This requires Google Maps API or similar mapping service integration.
                      </p>
                    </div>
                    
                    {/* Simulated map markers */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                        <span className="text-sm font-medium text-dark-900">Home Pro</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                        <span className="text-sm font-medium text-dark-900">A-List Specialist</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-dark-900">Crew Member</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                  <span className="ml-2 text-dark-600">Loading professionals...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600">Error loading professionals: {error}</p>
                  <button 
                    onClick={() => fetchProfessionals({})}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && !loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {professionals.map((pro) => (
                    <div key={pro.id} className="bg-white rounded-2xl shadow-upwork hover:shadow-upwork-lg transition-all duration-300 border border-gray-200 overflow-hidden group">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div className="relative flex-shrink-0">
                              <img
                                src={pro.avatar || '/default-avatar.png'}
                                alt={pro.full_name}
                                className="w-16 h-16 rounded-xl object-cover"
                              />
                              {pro.is_available && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-heading font-semibold text-lg text-dark-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                                  <Link href={`/professionals/${pro.id}`}>
                                    {pro.display_name}
                                  </Link>
                                </h3>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {pro.is_verified && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                  {pro.rating_average >= 4.5 && (
                                    <Award className="h-5 w-5 text-yellow-500" />
                                  )}
                                </div>
                              </div>
                              <p className="text-dark-600 font-medium truncate">{pro.company_name || pro.user_type.replace('_', ' ').toUpperCase()}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {pro.user_type.replace('_', ' ').toUpperCase()}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-medium text-dark-900">{typeof pro.rating_average === 'number' ? pro.rating_average.toFixed(1) : '0.0'}</span>
                                  <span className="text-sm text-dark-600">({pro.rating_count || 0} reviews)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-dark-600 leading-relaxed mb-4 line-clamp-3">
                          {pro.bio || 'Professional service provider'}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pro.skills?.slice(0, 4).map((skill, index) => (
                            <span key={index} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium truncate max-w-[120px]">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center bg-gray-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-dark-900">{pro.projects_completed || 0}</div>
                            <div className="text-xs text-dark-600">Projects</div>
                          </div>
                          <div className="text-center bg-gray-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-dark-900">{pro.completion_rate || 0}%</div>
                            <div className="text-xs text-dark-600">Completion Rate</div>
                          </div>
                        </div>

                        {/* Portfolio Preview */}
                        {pro.portfolio_images && pro.portfolio_images.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-dark-900 mb-2">Recent Work</h4>
                            <div className="flex space-x-2">
                              {pro.portfolio_images.slice(0, 3).map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Work by ${pro.display_name}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {pro.verification_badges?.map((badge, index) => (
                            <span key={index} className="bg-accent-50 text-accent-700 px-2 py-1 rounded-full text-xs font-medium truncate max-w-[100px]">
                              {badge}
                            </span>
                          ))}
                          {pro.is_verified && (
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              Verified
                            </span>
                          )}
                          {pro.insurance_verified && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              Insured
                            </span>
                          )}
                          {pro.background_check_verified && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                              Background Checked
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          {/* Professional Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-dark-600">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="font-medium truncate">${pro.hourly_rate || 'N/A'}/hr</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{pro.response_time}</span>
                            </div>
                            <div className="flex items-center">
                               <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                               <span className="truncate">{pro.location || 'Location not specified'}</span>
                             </div>
                           </div>
                           {/* Action Buttons */}
                           <div className="flex flex-col sm:flex-row gap-2">
                             <button 
                               onClick={() => handleContactProfessional(pro.id)}
                               disabled={contactingProfessional === pro.id}
                               className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                             >
                               {contactingProfessional === pro.id ? (
                                 <>
                                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                   جاري الاتصال...
                                 </>
                               ) : (
                                 'Contact'
                               )}
                             </button>
                             <Link 
                               href={`/professionals/${pro.id}`}
                               className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-dark-700 hover:bg-gray-50 transition-colors duration-200 text-center inline-block"
                             >
                               View Profile
                             </Link>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More - Only for grid view */}
              {viewMode === 'grid' && (
                <div className="text-center mt-12">
                  <button className="bg-white border border-gray-300 text-dark-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                    Load More Professionals
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}