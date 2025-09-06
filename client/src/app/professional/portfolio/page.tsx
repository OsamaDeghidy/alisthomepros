'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { portfolioService } from '@/lib/portfolio';
import { PortfolioItem } from '@/lib/types';
import { 
  Camera, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Heart, 
  Share2, 
  Upload,
  Grid,
  List,
  Search,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  TrendingUp,
  Loader2
} from 'lucide-react';

export default function PortfolioPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Load portfolio data
  useEffect(() => {
    loadPortfolioData();
    loadCategories();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getUserPortfolio({ page_size: 50 });
      setPortfolioItems(response.results);
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('فشل في تحميل بيانات المعرض');
      toast.error('فشل في تحميل بيانات المعرض');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await portfolioService.getCategories();
      if (Array.isArray(categoriesData)) {
        setCategories(['All Categories', ...categoriesData]);
      } else {
        throw new Error('Invalid categories data');
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      // Use default categories if API fails
      setCategories([
        'All Categories',
        'Kitchen Remodeling',
        'Bathroom Renovation',
        'Carpentry',
        'Electrical Work',
        'Landscaping'
      ]);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    
    try {
      await portfolioService.deletePortfolioItem(id);
      setPortfolioItems(prev => prev.filter(item => item.id !== id));
      toast.success('تم حذف العنصر بنجاح');
    } catch (err) {
      console.error('Error deleting portfolio item:', err);
      toast.error('فشل في حذف العنصر');
    }
  };

  const stats = [
    {
      label: 'Total Projects',
      value: portfolioItems.length.toString(),
      change: '+2 this month',
      icon: Camera,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Views',
      value: portfolioItems.reduce((sum, item) => sum + (item.views || 0), 0).toString(),
      change: '+45 this week',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Likes',
      value: portfolioItems.reduce((sum, item) => sum + (item.likes || 0), 0).toString(),
      change: '+8 this week',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Featured Projects',
      value: portfolioItems.filter(item => item.featured).length.toString(),
      change: 'Great showcase!',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];



  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'featured', label: 'Featured First' },
    { value: 'budget', label: 'Highest Budget' }
  ];

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           item.category.toLowerCase() === selectedCategory.toLowerCase() ||
                           selectedCategory === 'All Categories';
    
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (selectedSort) {
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'budget':
        const budgetA = parseInt((a.project_cost || '0').replace(/[$,]/g, ''));
        const budgetB = parseInt((b.project_cost || '0').replace(/[$,]/g, ''));
        return budgetB - budgetA;
      default:
        return new Date(b.completion_date || b.created_at).getTime() - new Date(a.completion_date || a.created_at).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                My Portfolio
              </h1>
              <p className="text-gray-600 mt-1">
                Showcase your best work and attract new clients
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </button>
              <Link
                href="/professional/portfolio/new"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {categories && categories.length > 0 ? categories.map((category) => (
                <option key={category} value={category === 'All Categories' ? 'all' : category}>
                  {category}
                </option>
              )) : (
                <option value="all">All Categories</option>
              )}
            </select>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-600">
                {sortedItems.length} projects found
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">جاري تحميل المعرض...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={loadPortfolioData}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Portfolio Items */}
        {!loading && !error && viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-upwork border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* Image Gallery */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={item.images && item.images.length > 0 ? (item.images[0].image || item.images[0]) : '/placeholder-project.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-project.jpg';
                    }}
                  />
                  {item.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>Featured</span>
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                      {item.images.length} photos
                    </span>

                  </div>
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-opacity duration-200">
                      <Heart className="h-4 w-4 text-red-500" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-opacity duration-200">
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-heading font-semibold text-lg text-dark-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{new Date(item.completion_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.project_duration || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.project_cost || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{item.featured ? 'Featured' : 'Standard'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{item.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{item.likes || 0}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{item.completion_date ? new Date(item.completion_date).toLocaleDateString() : 'غير محدد'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/professional/portfolio/${item.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                      >
                        View
                      </Link>
                      <button 
                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-6">
                    <div className="relative w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.images && item.images.length > 0 ? (item.images[0].image || item.images[0]) : '/placeholder-project.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-project.jpg';
                        }}
                      />
                      {item.featured && (
                        <div className="absolute top-1 left-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-heading font-semibold text-xl text-dark-900">
                          {item.title}
                        </h3>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{item.project_duration || 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{item.project_cost || 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{new Date(item.completion_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">{item.featured ? 'Featured' : 'Standard'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{item.views || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{item.likes || 0}</span>
                          </div>
                          <span className="text-sm text-gray-500">{item.completion_date ? new Date(item.completion_date).toLocaleDateString() : 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/professional/portfolio/${item.id}`}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                          >
                            View Details
                          </Link>
                          <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* No Items Found */}
        {!loading && !error && sortedItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-dark-900 mb-2">
              لا توجد مشاريع
            </h3>
            <p className="text-gray-600 mb-6">
              جرب تعديل المرشحات أو البحث، أو أضف مشروعك الأول للبدء.
            </p>
            <Link
              href="/professional/portfolio/new"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              أضف مشروعك الأول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}