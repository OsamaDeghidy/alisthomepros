'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Filter, Star, Clock, Shield, CheckCircle, Heart, DollarSign, Users, Calendar, Map, Grid3x3, Award, TrendingUp, ChevronDown, X, Loader2, SlidersHorizontal, Briefcase, Eye } from 'lucide-react';
import { projectsService } from '@/lib/projects';
import { Project, Category } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

export default function FindWorkPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSort, setSelectedSort] = useState('recent');
  
  // Backend data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const budgetRanges = [
    'All Budgets',
    'Paid Projects Only',
    'Unpaid/Volunteer Only',
    'Under $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+'
  ];

  const skillLevels = [
    'All Experience Levels',
    'Entry Level',
    'Intermediate',
    'Expert Level',
    'Master Level'
  ];

  const roleFilters = [
    'All Roles',
    'Home Pro',
    'A-List Specialist',
    'Crew Member'
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'budget-high', label: 'Highest Budget' },
    { value: 'budget-low', label: 'Lowest Budget' },
    { value: 'proposals', label: 'Most Proposals' },
    { value: 'deadline', label: 'Urgent Deadline' },
    { value: 'rating', label: 'Best Client Rating' }
  ];

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load categories and projects in parallel
        const [categoriesData, projectsData] = await Promise.all([
          projectsService.getCategories(),
          projectsService.getProjects({
            page: currentPage,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            location: selectedLocation || undefined,
            search: searchQuery || undefined
          })
        ]);
        
        setCategories(categoriesData);
        setProjects(projectsData.results);
        setTotalProjects(projectsData.count);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load projects');
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentPage, selectedCategory, selectedLocation, searchQuery]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await projectsService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
        toast.error('Error loading categories');
      }
    };
    
    loadCategories();
  }, []);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBudget('all');
    setSelectedSkills([]);
    setSelectedRole('all');
    setSearchQuery('');
    setSelectedLocation('');
  };

  // Sample job data
  const jobs = [
    {
      id: 1,
      title: "Kitchen Renovation - Modern Design",
      description: "Looking for an experienced contractor to renovate our 150 sq ft kitchen. We want a modern design with quartz countertops, new cabinets, and updated lighting. The project includes demolition, electrical updates, plumbing modifications, and full installation of new fixtures and appliances.",
      budget: "$8,000 - $12,000",
      location: "Los Angeles, CA",
      postedTime: "2 hours ago",
      category: "Kitchen Remodeling",
      requiredRole: "Home Pro",
      experienceLevel: "Expert Level",
      client: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 23,
        verified: true,
        paymentVerified: true,
        location: "Los Angeles, CA"
      },
      tags: ["Modern Design", "Quartz Countertops", "Lighting", "Licensed Required"],
      proposals: 8,
      urgency: "Within 2 weeks",
      featured: true,
      skills: ["Licensed Professional Required", "Insurance Required", "Quality Materials"]
    },
    {
      id: 2,
      title: "Bathroom Tile Installation",
      description: "Need a skilled professional to install ceramic tiles in a master bathroom. The space is 80 sq ft. Materials will be provided. Looking for someone with experience in waterproofing and precision tile work.",
      budget: "$2,500 - $4,000",
      location: "Miami, FL",
      postedTime: "5 hours ago",
      category: "Bathroom Renovation",
      requiredRole: "Home Pro",
      experienceLevel: "Intermediate",
      client: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 5.0,
        reviews: 12,
        verified: true,
        paymentVerified: true,
        location: "Miami, FL"
      },
      tags: ["Ceramic Tiles", "Master Bathroom", "Materials Provided", "Waterproofing"],
      proposals: 15,
      urgency: "Within 1 week",
      featured: false,
      skills: ["Experience with Permits", "Quality Materials", "Cleanup Included"]
    },
    {
      id: 3,
      title: "Electrical Panel Upgrade",
      description: "Seeking a licensed electrician to upgrade our home's electrical panel from 100A to 200A. Must be certified and insured. Project includes permit acquisition and inspection coordination.",
      budget: "$1,500 - $2,500",
      location: "Chicago, IL",
      postedTime: "1 day ago",
      category: "Electrical Work",
      requiredRole: "Home Pro",
      experienceLevel: "Expert Level",
      client: {
        name: "Lisa Anderson",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        reviews: 45,
        verified: true,
        paymentVerified: true,
        location: "Chicago, IL"
      },
      tags: ["Licensed Required", "Panel Upgrade", "Insurance Required", "Permits"],
      proposals: 6,
      urgency: "Within 1 month",
      featured: true,
      skills: ["Licensed Professional Required", "Insurance Required", "Experience with Permits"]
    },
    {
      id: 4,
      title: "Garden Landscaping Project",
      description: "Transform our backyard into a beautiful garden space. Include lawn installation, flower beds, and irrigation system. Looking for creative design ideas and sustainable solutions.",
      budget: "$5,000 - $8,000",
      location: "Phoenix, AZ",
      postedTime: "2 days ago",
      category: "Landscaping",
      requiredRole: "A-List Specialist",
      experienceLevel: "Intermediate",
      client: {
        name: "David Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.7,
        reviews: 18,
        verified: true,
        paymentVerified: true,
        location: "Phoenix, AZ"
      },
      tags: ["Lawn Installation", "Irrigation", "Flower Beds", "Design Required"],
      proposals: 12,
      urgency: "Within 3 weeks",
      featured: false,
      skills: ["Quality Materials", "Warranty Provided", "References Available"]
    },
    {
      id: 5,
      title: "Interior House Painting",
      description: "Professional painting services needed for entire 3-bedroom house interior. Approximately 2,000 sq ft. Paint will be provided. Looking for clean, professional work with attention to detail.",
      budget: "$3,000 - $5,000",
      location: "Denver, CO",
      postedTime: "3 days ago",
      category: "Painting",
      requiredRole: "Crew Member",
      experienceLevel: "Entry Level",
      client: {
        name: "Jennifer Walsh",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.6,
        reviews: 31,
        verified: true,
        paymentVerified: true,
        location: "Denver, CO"
      },
      tags: ["Interior Painting", "3 Bedrooms", "Paint Provided", "Clean Work"],
      proposals: 22,
      urgency: "Within 2 weeks",
      featured: false,
      skills: ["Quality Materials", "Cleanup Included", "References Available"]
    },
    {
      id: 6,
      title: "Roof Repair and Maintenance",
      description: "Need experienced roofer to fix leaks and perform general maintenance on asphalt shingle roof. Safety equipment required. Emergency repair needed due to recent storm damage.",
      budget: "$1,000 - $2,000",
      location: "Seattle, WA",
      postedTime: "4 days ago",
      category: "Roofing",
      requiredRole: "Home Pro",
      experienceLevel: "Expert Level",
      client: {
        name: "Robert Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        rating: 4.8,
        reviews: 27,
        verified: true,
        paymentVerified: true,
        location: "Seattle, WA"
      },
      tags: ["Leak Repair", "Asphalt Shingles", "Safety Required", "Emergency"],
      proposals: 9,
      urgency: "ASAP",
      featured: true,
      skills: ["Licensed Professional Required", "Insurance Required", "Emergency Service"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.1),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,206,0,0.08),transparent_60%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-12">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-900 leading-tight">
                Find Your Next
                <span className="block text-gradient-primary">Home Project</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-dark-600 leading-relaxed max-w-3xl mx-auto px-4">
                Browse thousands of home improvement projects and connect with homeowners looking for skilled professionals.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-upwork-lg p-4 sm:p-6 border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      What service are you offering?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., Kitchen remodeling, Plumbing..."
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <button className="w-full bg-gradient-primary text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base touch-target">
                      <Search className="h-4 w-4 inline mr-2 lg:hidden" />
                      Search Projects
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
              {[
                { value: '2,847', label: 'Active Projects' },
                { value: '$2.8M+', label: 'Total Value' },
                { value: '98%', label: 'Success Rate' },
                { value: '24h', label: 'Avg Response' },
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-dark-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors touch-target"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="font-medium">Filters & Sort</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:sticky lg:top-24 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-lg text-dark-900 flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary-500" />
                    Filters
                  </h3>
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear All
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
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Budget Range</label>
                    <select 
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {budgetRanges.map((budget, index) => {
                        let value = budget.toLowerCase().replace(/\s+/g, '-');
                        // Handle special cases for paid/unpaid filters
                        if (budget === 'Paid Projects Only') value = 'paid-only';
                        if (budget === 'Unpaid/Volunteer Only') value = 'unpaid-only';
                        return (
                          <option key={index} value={value}>
                            {budget}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Experience Level</label>
                    <select 
                      value={Array.isArray(selectedSkills) ? selectedSkills[0] || 'all' : selectedSkills}
                      onChange={(e) => setSelectedSkills(e.target.value === 'all' ? [] : [e.target.value])}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {skillLevels.map((skill, index) => (
                        <option key={index} value={skill.toLowerCase().replace(/\s+/g, '-')}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-3">Required Role</label>
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
                    <label className="block text-sm font-medium text-dark-700 mb-3">Project Type</label>
                    <div className="space-y-2">
                      {[
                        { id: 'featured', label: 'Featured Projects', icon: '⭐' },
                        { id: 'urgent', label: 'Urgent Projects', icon: '🚨' },
                        { id: 'high-budget', label: 'High Budget ($5K+)', icon: '💰' },
                        { id: 'verified-client', label: 'Verified Clients', icon: '✅' },
                        { id: 'payment-verified', label: 'Payment Verified', icon: '🛡️' },
                        { id: 'remote-ok', label: 'Remote OK', icon: '🌐' }
                      ].map((filter) => (
                        <label key={filter.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500" 
                          />
                          <span className="text-sm">{filter.icon}</span>
                          <span className="text-sm text-dark-700">{filter.label}</span>
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
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <h2 className="font-heading font-semibold text-xl sm:text-2xl text-dark-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
                    Available Projects
                  </h2>
                  <p className="text-dark-600 mt-1 text-sm sm:text-base">{loading ? 'Loading...' : `${projects.filter(project => {
                    const matchesSearch = searchQuery === '' || 
                      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      project.required_skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
                    
                    const matchesLocation = !selectedLocation || selectedLocation === '' || 
                           (selectedLocation && project.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
                    
                    const matchesCategory = selectedCategory === 'all' || project.category?.slug === selectedCategory;
                    
                    const matchesBudget = selectedBudget === 'all' || (
                      selectedBudget === 'paid-only' && project.is_paid ||
                      selectedBudget === 'unpaid-only' && !project.is_paid ||
                      selectedBudget === 'under-500' && (project.budget_max || project.budget_min || 0) < 500 ||
                      selectedBudget === '500-1000' && (project.budget_min || 0) >= 500 && (project.budget_max || project.budget_min || 0) <= 1000 ||
                      selectedBudget === '1000-5000' && (project.budget_min || 0) >= 1000 && (project.budget_max || project.budget_min || 0) <= 5000 ||
                      selectedBudget === 'over-5000' && (project.budget_min || 0) > 5000
                    );
                    
                    const matchesSkills = selectedSkills.length === 0 || 
                      selectedSkills.some(skill => project.required_skills?.includes(skill));
                    
                    const matchesRole = selectedRole === 'all' || project.required_roles?.includes(selectedRole);
                    
                    return matchesSearch && matchesLocation && matchesCategory && matchesBudget && matchesSkills && matchesRole;
                  }).length} projects found`}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list' 
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
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-0 flex-shrink-0"
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
                      <h3 className="text-lg font-medium text-dark-900 mb-2">Project Locations</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Interactive map showing project locations across the United States.
                        Click on markers to view project details and submit proposals.
                      </p>
                    </div>
                    
                    {/* Simulated map markers legend */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-dark-900">New Projects</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-dark-900">Active Projects</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-dark-900">Urgent Projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                        <span className="text-sm font-medium text-dark-900">Featured</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                  <span className="ml-2 text-dark-600">Loading projects...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-red-700 hover:text-red-800 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && !loading && !error && (
                <div className="space-y-6">
                  {projects.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No projects found matching your criteria.</p>
                    </div>
                  ) : (
                    projects.filter(project => {
                      const matchesSearch = searchQuery === '' || 
                        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.required_skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
                      
                      const matchesLocation = !selectedLocation || selectedLocation === '' || 
                           (selectedLocation && project.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
                      
                      const matchesCategory = selectedCategory === 'all' || project.category?.slug === selectedCategory;
                      
                      const matchesBudget = selectedBudget === 'all' || (
                        selectedBudget === 'paid-only' && project.is_paid ||
                        selectedBudget === 'unpaid-only' && !project.is_paid ||
                        selectedBudget === 'under-500' && (project.budget_max || project.budget_min || 0) < 500 ||
                        selectedBudget === '500-1000' && (project.budget_min || 0) >= 500 && (project.budget_max || project.budget_min || 0) <= 1000 ||
                        selectedBudget === '1000-5000' && (project.budget_min || 0) >= 1000 && (project.budget_max || project.budget_min || 0) <= 5000 ||
                        selectedBudget === 'over-5000' && (project.budget_min || 0) > 5000
                      );
                      
                      const matchesSkills = selectedSkills.length === 0 || 
                        selectedSkills.some(skill => project.required_skills?.includes(skill));
                      
                      const matchesRole = selectedRole === 'all' || project.required_roles?.includes(selectedRole);
                      
                      return matchesSearch && matchesLocation && matchesCategory && matchesBudget && matchesSkills && matchesRole;
                    }).map((project) => (
                     <div key={project.id} className={`bg-white rounded-2xl shadow-upwork hover:shadow-upwork-lg transition-all duration-300 border overflow-hidden group ${
                       project.is_featured ? 'border-primary-200 bg-gradient-to-r from-primary-50/50 to-white' : 'border-gray-200'
                     }`}>
                       {project.is_featured && (
                         <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 text-sm font-medium">
                           <div className="flex items-center space-x-2">
                             <Award className="h-4 w-4" />
                             <span>Featured Project</span>
                           </div>
                         </div>
                       )}
                      
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-4">
                               <div className="flex-1 min-w-0 pr-4">
                                 <Link href={`/projects/${project.slug}`} className="block group">
                                   <h3 className="font-heading font-semibold text-lg sm:text-xl text-dark-900 group-hover:text-primary-600 transition-colors duration-200 mb-3 line-clamp-2">
                                     {project.title}
                                   </h3>
                                 </Link>
                                 
                                 <div className="flex flex-wrap items-center gap-2 mb-4">
                                   <span className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                     {project.category?.name || 'General'}
                                   </span>
                                   {/* Payment Type Badge */}
                                   {project.is_paid ? (
                                     <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1">
                                       <DollarSign className="h-3 w-3" />
                                       <span>PAID</span>
                                     </span>
                                   ) : (
                                     <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1">
                                       <DollarSign className="h-3 w-3" />
                                       <span>UNPAID</span>
                                     </span>
                                   )}
                                   {project.required_roles?.length > 0 && (
                                     <span className="bg-accent-100 text-accent-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                       {project.required_roles[0]}
                                     </span>
                                   )}
                                   <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                     {project.status === 'published' ? 'Open' : project.status}
                                   </span>
                                   {project.urgency === 'urgent' && (
                                     <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1">
                                       <TrendingUp className="h-3 w-3" />
                                       <span>URGENT</span>
                                     </span>
                                   )}
                                 </div>
                               </div>
                              
                              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0">
                                <Heart className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <p className="text-dark-600 leading-relaxed mb-4 line-clamp-3">
                               {project.description}
                             </p>

                             {project.required_skills?.length > 0 && (
                               <div className="mb-4">
                                 <div className="flex flex-wrap gap-2">
                                   {project.required_skills.slice(0, 6).map((skill, index) => (
                                     <span key={index} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm">
                                       {skill}
                                     </span>
                                   ))}
                                   {project.required_skills.length > 6 && (
                                     <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm">
                                       +{project.required_skills.length - 6} more
                                     </span>
                                   )}
                                 </div>
                               </div>
                             )}

                             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs sm:text-sm text-dark-600 mb-4">
                               <div className="flex items-center">
                                 {project.is_paid ? (
                                   <>
                                     <DollarSign className="h-4 w-4 mr-1 text-green-600 flex-shrink-0" />
                                     <span className="font-medium text-green-600 truncate">
                                       {project.budget_display || `$${project.budget_min || 0} - $${project.budget_max || 0}`}
                                     </span>
                                   </>
                                 ) : (
                                   <>
                                     <DollarSign className="h-4 w-4 mr-1 text-orange-500 flex-shrink-0" />
                                     <span className="font-medium text-orange-500 truncate">Unpaid/Volunteer</span>
                                   </>
                                 )}
                               </div>
                               <div className="flex items-center">
                                 <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                 <span className="truncate">{project.location}</span>
                               </div>
                               <div className="flex items-center">
                                 <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                                 <span className="truncate">{new Date(project.created_at).toLocaleDateString()}</span>
                               </div>
                               <div className="flex items-center">
                                 <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                                 <span className="truncate">{project.proposals_count || 0} proposals</span>
                               </div>
                               <div className="flex items-center">
                                 <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                                 <span className="truncate">{project.timeline || project.urgency}</span>
                               </div>
                             </div>
                          </div>

                          <div className="xl:w-80 flex-shrink-0">
                             <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                               <div className="flex items-center space-x-3">
                                 <img
                                   src={getMediaUrl(project.client?.avatar)}
                                   alt={project.client?.first_name || 'Client'}
                                   className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                   onError={(e) => {
                                     const target = e.target as HTMLImageElement;
                                     target.src = getMediaUrl(null);
                                   }}
                                 />
                                 <div className="flex-1 min-w-0">
                                   <div className="flex items-center space-x-2 mb-1">
                                     <span className="font-semibold text-dark-900 truncate">
                                       {project.client?.first_name} {project.client?.last_name}
                                     </span>
                                     {project.client?.is_verified && (
                                       <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                     )}
                                     {project.client?.insurance_verified && (
                                       <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                     )}
                                   </div>
                                   <div className="flex items-center space-x-1 mb-1">
                                     <Star className="h-4 w-4 text-yellow-400 fill-current flex-shrink-0" />
                                     <span className="text-sm text-dark-600 truncate">
                                       {typeof project.client?.rating_average === 'number' ? project.client.rating_average.toFixed(1) : '0.0'} ({project.client?.rating_count || 0})
                                     </span>
                                   </div>
                                   <div className="flex items-center space-x-1 text-sm text-dark-600">
                                     <MapPin className="h-3 w-3 flex-shrink-0" />
                                     <span className="truncate">{project.client?.location || 'Not specified'}</span>
                                   </div>
                                 </div>
                               </div>
                              
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-dark-600">Timeline:</span>
                                  <span className="font-medium text-dark-900 text-right">{project.timeline || project.urgency || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-dark-600">Proposals:</span>
                                  <span className="font-medium text-dark-900">{project.proposals_count || 0}</span>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row xl:flex-col gap-2">
                          
                                <Link
                                  href={`/projects/${project.slug}`}
                                  className="flex-1 xl:flex-none px-4 py-2.5 border border-gray-300 rounded-lg text-dark-700 hover:bg-gray-50 transition-colors duration-200 text-center text-sm"
                                >
                                  <Eye className="h-4 w-4 inline mr-1" />
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              )}

              {/* Pagination - Only for list view */}
              {viewMode === 'list' && !loading && !error && totalProjects > 0 && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, Math.ceil(totalProjects / 10)) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                        page === currentPage
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(Math.min(Math.ceil(totalProjects / 10), currentPage + 1))}
                    disabled={currentPage >= Math.ceil(totalProjects / 10)}
                    className="px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
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