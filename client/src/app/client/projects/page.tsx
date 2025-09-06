'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Grid, 
  List, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star, 
  MessageCircle, 
  Plus,
  Briefcase,
  Eye,
  Heart
} from 'lucide-react';
import { projectsService } from '@/lib/projects';
import { Project, Category } from '@/lib/types';

export default function ClientProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, categoriesResponse] = await Promise.all([
           projectsService.getMyProjects({
             status: selectedStatus !== 'all' ? selectedStatus : undefined,
             category: selectedCategory !== 'all' ? selectedCategory : undefined,
             search: searchQuery || undefined
           }),
           projectsService.getCategories()
         ]);
        
        setProjects(projectsResponse.results);
        setCategories(categoriesResponse);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
   }, [selectedStatus, selectedCategory, searchQuery]);

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({
      value: cat.slug,
      label: cat.name
    }))
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'budget', label: 'Budget' },
    { value: 'progress', label: 'Progress' },
    { value: 'priority', label: 'Priority' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'published':
        return 'text-yellow-600 bg-yellow-50';
      case 'draft':
        return 'text-gray-600 bg-gray-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // const getProgressBarColor = (status: string) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'bg-green-500';
  //     case 'in_progress':
  //       return 'bg-blue-500';
  //     case 'published':
  //       return 'bg-yellow-500';
  //     case 'draft':
  //       return 'bg-gray-500';
  //     case 'cancelled':
  //       return 'bg-red-500';
  //     default:
  //       return 'bg-gray-500';
  //   }
  // };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'published': return 'Published';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatBudget = (project: Project) => {
    if (project.budget_type === 'fixed' && project.budget_min) {
      return `$${project.budget_min.toLocaleString()}`;
    } else if (project.budget_min && project.budget_max) {
      return `$${project.budget_min.toLocaleString()} - $${project.budget_max.toLocaleString()}`;
    } else if (project.budget_min) {
      return `From $${project.budget_min.toLocaleString()}`;
    } else if (project.budget_max) {
      return `Up to $${project.budget_max.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedProjects = React.useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (project.assigned_professional && 
                            `${project.assigned_professional.first_name} ${project.assigned_professional.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
       
      const matchesCategory = selectedCategory === 'all' || project.category?.slug === selectedCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated_at':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'budget':
          const budgetA = a.budget_min || 0;
          const budgetB = b.budget_min || 0;
          return budgetB - budgetA;
        case 'deadline':
          if (!a.end_date && !b.end_date) return 0;
          if (!a.end_date) return 1;
          if (!b.end_date) return -1;
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return filtered;
  }, [projects, searchQuery, selectedStatus, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                My Projects
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track your projects
              </p>
            </div>
            <Link
              href="/post-project"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Project</span>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredAndSortedProjects.length} projects found
              </span>
              {(searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
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
          </div>
        </div>

        {/* Projects Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">An Error Occurred</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-upwork border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Project Header with Status and Priority */}
                <div className="relative">
                  {project.images && project.images.length > 0 ? (
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={project.images[0].file}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                      <Briefcase className="h-12 w-12 text-primary-300" />
                    </div>
                  )}
                  
                  {/* Status and Priority Badges */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                    {project.urgency && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getPriorityColor(project.urgency)}`}>
                        {project.urgency.charAt(0).toUpperCase() + project.urgency.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  {/* Project ID Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-mono text-gray-600 shadow-sm">
                      #{project.id}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Project Title and Category */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-bold text-xl text-dark-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                        {project.title}
                      </h3>
                    </div>
                    
                    {/* Category and Timeline */}
                    <div className="flex items-center space-x-3 mb-3">
                      {project.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {project.category.name}
                        </span>
                      )}
                      {project.timeline && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project.timeline}
                        </span>
                      )}
                      {project.is_remote_allowed && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Remote OK
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Professional Info */}
                  {project.assigned_professional ? (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Image
                            src={project.assigned_professional.avatar || '/default-avatar.svg'}
                            alt={project.assigned_professional.first_name + ' ' + project.assigned_professional.last_name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-dark-900 text-sm">
                            {project.assigned_professional.first_name} {project.assigned_professional.last_name}
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 font-medium">
                                {project.assigned_professional.rating_average || 0}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">
                              {project.assigned_professional.rating_count || 0} reviews
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Assigned Pro</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <p className="text-sm text-yellow-800 font-medium">Awaiting Professional Assignment</p>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {project.status === 'in_progress' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-900">Project Progress</span>
                        <span className="text-sm font-bold text-blue-900">{project.completion_percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-3 shadow-inner">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(project.completion_percentage || 0)} shadow-sm`}
                          style={{ width: `${project.completion_percentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-blue-700 mt-1">
                        <span>Started</span>
                        <span>In Progress</span>
                        <span>Complete</span>
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="space-y-3 mb-4">
                    {/* Budget and Location */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 bg-green-50 rounded-lg p-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-900">{formatBudget(project)}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-purple-50 rounded-lg p-2">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-900 truncate">{project.location}</span>
                      </div>
                    </div>
                    
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      {project.end_date && (
                        <div className="flex items-center space-x-2 bg-orange-50 rounded-lg p-2">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-xs text-orange-700">Deadline</p>
                            <p className="text-sm font-medium text-orange-900">{formatDate(project.end_date)}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-700">Created</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(project.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center space-x-1 bg-blue-50 rounded-lg p-2">
                        <Eye className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-900">{project.views_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-red-50 rounded-lg p-2">
                        <Heart className="h-3 w-3 text-red-600" />
                        <span className="text-xs font-medium text-red-900">{project.favorites_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-indigo-50 rounded-lg p-2">
                        <MessageCircle className="h-3 w-3 text-indigo-600" />
                        <span className="text-xs font-medium text-indigo-900">{project.proposals_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                   
                    {project.status === 'published' && (
                      <button
                        className="p-2.5 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Add to Favorites"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredAndSortedProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50 transition-all duration-300 border-l-4 border-transparent hover:border-primary-500 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-mono text-gray-600 shadow-sm">
                          #{project.id}
                        </span>
                        <h3 className="font-heading font-bold text-xl text-dark-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                          {project.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                        {project.urgency && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(project.urgency)}`}>
                            {project.urgency.charAt(0).toUpperCase() + project.urgency.slice(1)}
                          </span>
                        )}
                      </div>
                      
                      {/* Category and Tags */}
                      <div className="flex items-center space-x-2 mb-3">
                        {project.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {project.category.name}
                          </span>
                        )}
                        {project.timeline && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {project.timeline}
                          </span>
                        )}
                        {project.is_remote_allowed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Remote OK
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Professional Info */}
                      {project.assigned_professional ? (
                        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Image
                                src={project.assigned_professional.avatar || '/default-avatar.png'}
                                alt={project.assigned_professional.first_name + ' ' + project.assigned_professional.last_name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-dark-900 text-sm">
                                {project.assigned_professional.first_name} {project.assigned_professional.last_name}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600 font-medium">
                                    {project.assigned_professional.rating_average || 0}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-600">
                                  {project.assigned_professional.rating_count || 0} reviews
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">Assigned Pro</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <p className="text-sm text-yellow-800 font-medium">Awaiting Professional Assignment</p>
                          </div>
                        </div>
                      )}

                      {/* Project Details Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="flex items-center space-x-2 bg-green-50 rounded-lg p-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-900 truncate">{formatBudget(project)}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-purple-50 rounded-lg p-2">
                          <MapPin className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-purple-900 truncate">{project.location}</span>
                        </div>
                        {project.end_date && (
                          <div className="flex items-center space-x-2 bg-orange-50 rounded-lg p-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span className="text-sm text-orange-900 truncate">{formatDate(project.end_date)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-center space-x-2 bg-blue-50 rounded-lg p-2">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-900">{project.views_count || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-600" />
                            <span className="text-xs font-medium text-red-900">{project.favorites_count || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {project.status === 'in_progress' && (
                          <div className="flex-1 max-w-xs bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-gray-800">Progress</span>
                              <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow-sm">{project.completion_percentage || 0}%</span>
                            </div>
                            <div className="relative">
                              <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                                <div 
                                  className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.completion_percentage || 0)} shadow-sm`}
                                  style={{ width: `${project.completion_percentage || 0}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span className="font-medium">Started</span>
                                <span className="font-medium">Complete</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">
                          Last updated {formatDate(project.updated_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-6">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                      {project.status === 'published' && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                          <Heart className="h-4 w-4" />
                          <span>Favorite</span>
                        </button>
                      )}
                      <Link
                        href={`/client/messages?project=${project.id}`}
                        className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Projects Found */}
        {!loading && !error && filteredAndSortedProjects.length === 0 && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-dark-900 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t created any projects yet or no projects match the selected filters.
            </p>
            <Link
              href="/post-project"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}