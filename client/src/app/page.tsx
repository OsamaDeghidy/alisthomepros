'use client';

import { useState, useEffect } from 'react';
import Hero from "@/components/sections/Hero";
import { Search, CheckCircle, Star, Shield, ArrowRight, Sparkles, Target, Calendar, MessageSquare, BookOpen, UserPlus, Crown, Briefcase, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { homepageApi, type HomepageData, type PopularService, type FeaturedProfessional, type CustomerTestimonial, type BlogPost, type HomepageStats } from '../services/homepageApi';
import { professionalsApi, type Professional } from '../services/professionalsApi';
import { getMediaUrl } from '@/lib/utils';

export default function Home() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load homepage data and featured professionals
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load homepage data and featured professionals in parallel
        const [homepageResponse, professionalsResponse] = await Promise.all([
          homepageApi.getHomepageData().catch(() => null),
          professionalsApi.getProfessionals({
            ordering: '-rating_average',
            page_size: 5,
            is_verified: true
          }).catch(() => ({ results: [] }))
        ]);
        
        // Set homepage data with fallback
        setHomepageData(homepageResponse || {
          stats: {
            total_professionals: 50000,
            total_projects: 1000000,
            customer_satisfaction: 98,
            total_earnings: 2800000,
            active_professionals: 45000,
            completed_projects: 950000
          },
          popular_services: [],
          featured_professionals: [],
          testimonials: [],
          blog_posts: []
        });
        
        // Set featured professionals from API
        setFeaturedProfessionals(professionalsResponse.results || []);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-lg text-dark-600">Loading homepage...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !homepageData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-lg text-dark-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, popular_services, featured_professionals, testimonials, blog_posts } = homepageData || {
    stats: { total_professionals: 50000, total_projects: 1000000, customer_satisfaction: 98, total_earnings: 2800000, active_professionals: 45000, completed_projects: 950000 },
    popular_services: [],
    featured_professionals: [],
    testimonials: [],
    blog_posts: []
  };
  // How It Works Steps
  const howItWorksSteps = [
    {
      step: "01", 
      title: "Post Your Project",
      description: "Tell us what you need done in minutes.",
      icon: UserPlus,
      color: "primary"
    },
    {
      step: "02",
      title: "Get Matched Instantly",
      description: "We connect you with verified pros who fit your job perfectly.",
      icon: MessageSquare, 
      color: "accent"
    },
    {
      step: "03",
      title: "Hire with Confidence",
      description: "Review bids, compare profiles, and choose the right fit with signed agreements.",
      icon: BookOpen,
      color: "success"
    },
    {
      step: "04",
      title: "Pay Securely",
      description: "Funds are held in escrow with secure payment protection until work is completed.",
      icon: Shield,
      color: "primary"
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      <Hero stats={stats} />
      
      {/* Our Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Our Projects
            </div>
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-6">
              Browse Latest 
              <span className="text-gradient-primary"> Available Projects</span>
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Browse the latest projects posted by homeowners. See which opportunities align with your business and choose the ones that fit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample projects data - replace with actual data from find-work page */}
            {[
              {
                title: "Modern Kitchen Renovation",
                description: "Complete kitchen renovation with new cabinets and modern appliances installation",
                category: "Renovation",
                budget: "$5,000 - $10,000",
                location: "Riyadh",
                proposals: 12,
                urgency: "Within a month",
                tags: ["Kitchen", "Renovation", "Cabinets"]
              },
              {
                title: "Electrical System Repair",
                description: "Professional electrician needed to repair and upgrade home electrical system",
                category: "Electrical",
                budget: "$1,500 - $3,000",
                location: "Jeddah",
                proposals: 8,
                urgency: "Urgent",
                tags: ["Electrical", "Repair", "Upgrade"]
              },
              {
                title: "Hardwood Flooring Installation",
                description: "Install high-quality hardwood flooring in living rooms and bedrooms",
                category: "Flooring",
                budget: "$3,000 - $6,000",
                location: "Dammam",
                proposals: 15,
                urgency: "Within 2 weeks",
                tags: ["Flooring", "Hardwood", "Installation"]
              },
              {
                title: "Exterior House Painting",
                description: "Complete exterior house painting with high-quality paints",
                category: "Painting",
                budget: "$2,000 - $4,000",
                location: "Mecca",
                proposals: 10,
                urgency: "Within 3 weeks",
                tags: ["Painting", "Exterior", "House"]
              },
              {
                title: "Home Garden Design",
                description: "Design and landscape home garden with modern irrigation system and diverse plants",
                category: "Landscaping",
                budget: "$4,000 - $8,000",
                location: "Taif",
                proposals: 7,
                urgency: "Within 2 months",
                tags: ["Garden", "Landscaping", "Irrigation"]
              }
            ].slice(0, 5).map((project, index) => (
              <Link key={index} href="/find-work">
                <div className="group bg-white rounded-2xl shadow-upwork hover:shadow-upwork-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-full">
                        {project.category}
                      </div>
                      <div className="text-sm text-dark-500">
                        {project.proposals} proposals
                      </div>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-dark-900 group-hover:text-primary-600 transition-colors mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-dark-600 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-primary-600">
                        {project.budget}
                      </span>
                      <span className="text-sm text-dark-500">
                        📍 {project.location}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-500">
                        ⏰ {project.urgency}
                      </span>
                      <span className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center group">
                        View Details
                        <ArrowRight className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/find-work"
              className="inline-flex items-center bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target className="h-4 w-4 mr-2" />
              How It Works
            </div>
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-6">
              Get Started in 
              <span className="text-gradient-accent"> 4 Simple Steps</span>
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              With A-List Home Pros, hiring and working with professionals has never been easier. Post your project in minutes, get matched with vetted experts instantly, and manage everything in one place—from contracts to secure payments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-dark-900 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-dark-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              href="/how-it-works"
              className="inline-flex items-center bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Crown className="h-4 w-4 mr-2" />
              Featured Professionals
            </div>
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-6">
              Meet Our 
              <span className="text-gradient-primary"> Top-Rated Experts</span>
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Work with verified professionals who consistently deliver exceptional results and exceed customer expectations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProfessionals.length > 0 ? featuredProfessionals.map((pro, index) => (
              <div key={pro.id || index} className="group bg-white rounded-2xl shadow-upwork hover:shadow-upwork-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <Image
                        src={getMediaUrl(pro.avatar)}
                        alt={pro.display_name || pro.full_name || 'Professional'}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover mx-auto shadow-lg"
                      />
                      {pro.is_verified && (
                        <div className="absolute -bottom-2 -right-2 bg-primary-500 rounded-full p-2 shadow-lg">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-dark-900 mt-4 mb-1">{pro.display_name || pro.full_name || 'Professional'}</h3>
                    <p className="text-dark-600 text-sm mb-2">{pro.skills && pro.skills.length > 0 ? pro.skills[0] : 'Professional'}</p>
                    <p className="text-dark-500 text-xs">{pro.location || 'N/A'}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-semibold text-dark-900">{pro.rating_average || 5.0}</span>
                        <span className="ml-1 text-sm text-dark-500">({pro.rating_count || 0})</span>
                      </div>
                      <span className="text-sm font-semibold text-dark-900">${pro.hourly_rate || 85}/hr</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="font-semibold text-dark-900">{pro.projects_completed || 0}</div>
                        <div className="text-dark-600 text-xs">Projects</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <div className="font-semibold text-dark-900">{pro.response_time || 'Within 2h'}</div>
                        <div className="text-dark-600 text-xs">Response</div>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/professionals/${pro.id}`}>
                    <button className="w-full bg-primary-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 shadow-sm hover:shadow-md">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            )) : (
              // Fallback content when no professionals are loaded
              [...Array(4)].map((_, index) => (
                <div key={index} className="group bg-white rounded-2xl shadow-upwork hover:shadow-upwork-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto shadow-lg animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded mt-4 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 py-2.5 px-4 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/professionals"
              className="inline-flex items-center bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Browse All Professionals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-success-100 text-success-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <MessageSquare className="h-4 w-4 mr-2" />
              Customer Stories
            </div>
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-6">
              What Our 
              <span className="text-gradient-primary"> Customers Say</span>
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Read real reviews from homeowners who found their perfect professionals through A-List Home Pros.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id || index} className="bg-gray-50 rounded-2xl p-8 shadow-upwork hover:shadow-upwork-lg transition-all duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-dark-700 leading-relaxed mb-6">
                  &quot;{testimonial.comment || 'Great service!'}&quot;
                </blockquote>
                <div className="flex items-center">
                  <Image
                    src={getMediaUrl(testimonial.client?.avatar)}
                    alt={testimonial.client?.full_name || 'Customer'}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <div className="font-semibold text-dark-900">{testimonial.client?.full_name || 'Customer'}</div>
                    <div className="text-dark-600 text-sm">{testimonial.client?.location || 'N/A'}</div>
                    <div className="text-primary-600 text-sm font-medium">{testimonial.project_category || 'Home Project'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Latest Articles
            </div>
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-6">
              Home Improvement 
              <span className="text-gradient-accent"> Tips & Guides</span>
            </h2>
            <p className="text-xl text-dark-600 max-w-3xl mx-auto">
              Stay informed with expert advice, industry insights, and helpful tips for your home improvement projects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blog_posts.map((post, index) => (
              <Link key={post.id || index} href={`/blog/${post.slug || index}`}>
                <article className="group bg-white rounded-2xl shadow-upwork hover:shadow-upwork-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300">
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.featured_image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={post.title || 'Blog Post'}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                      {typeof post.category === 'object' ? post.category.name : post.category || 'Tips'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-xl text-dark-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight">
                      {post.title || 'Blog Post Title'}
                    </h3>
                    <p className="text-dark-600 leading-relaxed mb-4">
                      {post.excerpt || 'Blog post excerpt...'}
                    </p>
                    <div className="flex items-center justify-between text-sm text-dark-500">
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Recent'}</span>
                      <span>{post.read_time ? `${post.read_time} min read` : '5 min read'}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/blog"
              className="inline-flex items-center bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Read More Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Join as Pro / Pricing CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <UserPlus className="h-4 w-4 mr-2" />
              Join Our Network
            </div>
            
            <h2 className="font-heading font-bold text-4xl lg:text-6xl text-white mb-6 leading-tight">
              Ready to Grow Your
              <span className="block text-yellow-200">Business?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who are growing their businesses with A-List Home Pros. 
              Get access to qualified leads, secure payments, and powerful tools to manage your work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">$2.8M+</div>
              <div className="text-blue-100">Earned by professionals</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Active professionals</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Customer satisfaction</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/pricing"
              className="group relative inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <Briefcase className="mr-3 h-6 w-6" />
              View Pricing Plans
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center justify-center border-2 border-white/50 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
            >
              <UserPlus className="mr-3 h-6 w-6" />
              Join as Professional
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
