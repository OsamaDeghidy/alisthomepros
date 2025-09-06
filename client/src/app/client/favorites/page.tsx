'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart,
  Star,
  MapPin,
  Clock,
  Search,
  Grid3X3,
  List,
  ArrowLeft,
  CheckCircle,
  Eye
} from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  avatar: string;
  company: string;
  category: string;
  subcategories: string[];
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseTime: string;
  location: string;
  distance: string;
  hourlyRate: string;
  projectRate: string;
  isVerified: boolean;
  isOnline: boolean;
  badges: string[];
  addedDate: string;
  lastContacted: string;
  projectsWithThem: number;
  totalSpent: string;
  description: string;
  portfolio: string[];
}

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Sample favorite professionals
  const favorites = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'Mitchell Design & Build',
      category: 'Kitchen Remodeling',
      subcategories: ['Kitchen Design', 'Cabinet Installation', 'Countertops'],
      rating: 4.9,
      reviewCount: 127,
      completedProjects: 45,
      responseTime: '2 hours',
      location: 'Los Angeles, CA',
      distance: '5.2 miles',
      hourlyRate: '$85/hour',
      projectRate: '$2,500 - $15,000',
      isVerified: true,
      isOnline: true,
      badges: ['Top Rated', 'Licensed', 'Insured'],
      addedDate: '2024-01-15',
      lastContacted: '2024-01-20',
      projectsWithThem: 2,
      totalSpent: '$12,300',
      description: 'Specializing in high-end kitchen renovations with 15+ years of experience. Known for exceptional craftsmanship and attention to detail.',
      portfolio: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1556909045-f18c06d3e1d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]
    },
    {
      id: 2,
      name: 'David Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'Rodriguez Electrical Services',
      category: 'Electrical Work',
      subcategories: ['Panel Upgrades', 'Wiring', 'Smart Home'],
      rating: 5.0,
      reviewCount: 89,
      completedProjects: 234,
      responseTime: '1 hour',
      location: 'Beverly Hills, CA',
      distance: '8.1 miles',
      hourlyRate: '$95/hour',
      projectRate: '$500 - $5,000',
      isVerified: true,
      isOnline: false,
      badges: ['Top Rated', 'Licensed', 'Emergency Service'],
      addedDate: '2024-01-10',
      lastContacted: '2024-01-18',
      projectsWithThem: 1,
      totalSpent: '$1,200',
      description: 'Licensed electrician with expertise in residential and commercial electrical work. Available for emergency services.',
      portfolio: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]
    },
    {
      id: 3,
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'Green Thumb Landscapes',
      category: 'Landscaping',
      subcategories: ['Garden Design', 'Irrigation', 'Lawn Care'],
      rating: 4.7,
      reviewCount: 156,
      completedProjects: 78,
      responseTime: '4 hours',
      location: 'Santa Monica, CA',
      distance: '12.3 miles',
      hourlyRate: '$65/hour',
      projectRate: '$1,000 - $8,000',
      isVerified: true,
      isOnline: true,
      badges: ['Eco-Friendly', 'Licensed'],
      addedDate: '2024-01-05',
      lastContacted: '2024-01-12',
      projectsWithThem: 1,
      totalSpent: '$3,500',
      description: 'Sustainable landscaping specialist focusing on drought-resistant and native plant designs.',
      portfolio: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]
    },
    {
      id: 4,
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      company: 'Johnson Plumbing Co.',
      category: 'Plumbing',
      subcategories: ['Bathroom Renovation', 'Pipe Repair', 'Fixtures'],
      rating: 4.8,
      reviewCount: 203,
      completedProjects: 187,
      responseTime: '3 hours',
      location: 'Burbank, CA',
      distance: '15.7 miles',
      hourlyRate: '$75/hour',
      projectRate: '$300 - $3,000',
      isVerified: true,
      isOnline: true,
      badges: ['Licensed', 'Insured', '24/7 Service'],
      addedDate: '2023-12-20',
      lastContacted: '2024-01-15',
      projectsWithThem: 3,
      totalSpent: '$4,800',
      description: 'Experienced plumber specializing in residential and commercial plumbing services. Available 24/7 for emergencies.',
      portfolio: [
        'https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
      ]
    }
  ];

  const categories = ['all', 'Kitchen Remodeling', 'Electrical Work', 'Landscaping', 'Plumbing', 'Painting', 'Carpentry'];
  const locations = ['all', 'Los Angeles, CA', 'Beverly Hills, CA', 'Santa Monica, CA', 'Burbank, CA'];

  const filteredFavorites = favorites.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professional.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professional.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || professional.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || professional.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'projects':
        return b.projectsWithThem - a.projectsWithThem;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const removeFavorite = (professionalId: number) => {
    // Here you would remove from favorites
    console.log('Removing from favorites:', professionalId);
  };

  const contactProfessional = (professional: Professional) => {
    // Here you would initiate contact
    console.log('Contacting professional:', professional);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
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
              <h1 className="text-2xl font-bold text-dark-900">My Favorites</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-dark-900 mb-2">
                {favorites.length}
              </div>
              <p className="text-sm text-gray-600">Favorite Professionals</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-dark-900 mb-2">
                {favorites.reduce((sum, p) => sum + p.projectsWithThem, 0)}
              </div>
              <p className="text-sm text-gray-600">Projects Completed</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-dark-900 mb-2">
                ${favorites.reduce((sum, p) => sum + parseFloat(p.totalSpent.replace('$', '').replace(',', '')), 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-dark-900 mb-2">
                {(favorites.reduce((sum, p) => sum + p.rating, 0) / favorites.length).toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search professionals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Highest Rating</option>
                <option value="projects">Most Projects</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professionals List */}
        {filteredFavorites.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredFavorites.map((professional) => (
              <div key={professional.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${viewMode === 'list' ? 'p-6' : 'overflow-hidden'}`}>
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <>
                    {/* Portfolio Images */}
                    <div className="relative h-48">
                      <div className="grid grid-cols-3 h-full">
                        {professional.portfolio.slice(0, 3).map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            alt="Portfolio"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        ))}
                        {professional.portfolio.length === 1 && (
                          <>
                            <div className="bg-gray-200"></div>
                            <div className="bg-gray-200"></div>
                          </>
                        )}
                        {professional.portfolio.length === 2 && (
                          <div className="bg-gray-200"></div>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 flex items-center space-x-2">
                        <button
                          onClick={() => removeFavorite(professional.id)}
                          className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 text-red-500 hover:text-red-600"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                        <div className={`w-3 h-3 rounded-full ${professional.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={professional.avatar}
                            alt={professional.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-dark-900">{professional.name}</h3>
                            <p className="text-sm text-gray-600">{professional.company}</p>
                          </div>
                        </div>
                        {professional.isVerified && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        {renderStars(professional.rating)}
                        <span className="text-sm text-gray-600 ml-2">
                          {professional.rating} ({professional.reviewCount} reviews)
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{professional.category}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{professional.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{professional.responseTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {professional.badges.slice(0, 2).map((badge, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-gray-600">{professional.projectsWithThem} project{professional.projectsWithThem !== 1 ? 's' : ''}</p>
                          <p className="font-medium text-dark-900">{professional.totalSpent} spent</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/professionals/${professional.id}`}
                            className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => contactProfessional(professional)}
                            className="bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                          >
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4 flex-1">
                      <Image
                        src={professional.avatar}
                        alt={professional.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-dark-900">{professional.name}</h3>
                          {professional.isVerified && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <div className={`w-3 h-3 rounded-full ${professional.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <p className="text-gray-600 mb-1">{professional.company} • {professional.category}</p>
                        <div className="flex items-center space-x-1 mb-2">
                          {renderStars(professional.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            {professional.rating} ({professional.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{professional.location} • {professional.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Responds in {professional.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-semibold text-dark-900">{professional.projectsWithThem}</p>
                      <p className="text-sm text-gray-600">Projects</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-semibold text-dark-900">{professional.totalSpent}</p>
                      <p className="text-sm text-gray-600">Spent</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFavorite(professional.id)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </button>
                      <Link
                        href={`/professionals/${professional.id}`}
                        className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => contactProfessional(professional)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all' 
                ? 'No favorites match your filters' 
                : 'No favorites yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all'
                ? 'Try adjusting your filters to see more professionals.'
                : 'Start adding professionals to your favorites as you work with them.'}
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedLocation === 'all' && (
              <Link
                href="/professionals"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Browse Professionals</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 