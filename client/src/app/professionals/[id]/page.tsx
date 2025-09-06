'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  Shield, 
  Award, 
  Calendar,
  Heart,
  Share2,
  Flag,
  MessageCircle,
  ThumbsUp,
  Eye,
  Grid,
  List,
  Loader2,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { professionalDetailApi } from '../../../services/professionalDetailApi';
import { messagingService } from '../../../lib/messaging';
import ContractCreationForm from '../../../components/contracts/ContractCreationForm';
import { useAuthStore } from '../../../lib/store';
import toast from 'react-hot-toast';

export default function ProfessionalProfilePage() {
  const params = useParams();
  const router = useRouter();
  const professionalId = parseInt(params?.id as string);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professional, setProfessional] = useState<any>(null);
  const [displayData, setDisplayData] = useState<any>(null);
  const [contactingProfessional, setContactingProfessional] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  
  // Fetch professional data
  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await professionalDetailApi.getCompleteProfessionalData(professionalId);
        
        if (!data.profile) {
          setError('المحترف غير موجود');
          return;
        }
        
        setProfessional(data.profile);
        setDisplayData({
          portfolio: data.portfolio || [],
          reviews: data.reviews || [],
          availability: data.availability || [],
          projects: data.projects || [],
          stats: data.stats || null,
          location: data.location || null
        });
      } catch (error) {
        console.error('Error fetching professional data:', error);
        setError('حدث خطأ في تحميل بيانات المحترف');
      } finally {
        setLoading(false);
      }
    };
    
    if (professionalId) {
      fetchProfessionalData();
    }
  }, [professionalId]);
  
  // Handle contact professional
  const handleContactProfessional = async () => {
    try {
      setContactingProfessional(true);
      
      const conversation = await messagingService.startConversationWithUser(
        professionalId,
        'مرحباً، أود التحدث معك حول خدماتك.'
      );
      
      router.push(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setContactingProfessional(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">جاري تحميل بيانات المحترف...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">خطأ</h2>
            <p className="text-red-600 mb-4">{error || 'المحترف غير موجود'}</p>
            <Link 
              href="/professionals" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للمحترفين
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate portfolio stats
  const portfolioStats = {
    totalProjects: displayData?.portfolio?.length || 0,
    categories: [...new Set(displayData?.portfolio?.map((p: any) => p.category) || [])].length
  };
  
  // Get reviews data
  const reviews = displayData?.reviews || [];
  
  // Get additional professional data with fallbacks
  const education = professional?.education || 'غير محدد';
  const experience = professional?.experience_years ? `${professional.experience_years}+ سنوات من الخبرة` : 'غير محدد';
  const serviceArea = displayData?.location?.city && displayData?.location?.state ? 
    `${displayData.location.city}, ${displayData.location.state}` : professional?.location || 'غير محدد';
  const languages = professional?.languages || ['العربية', 'الإنجليزية'];
  const availability = professional?.availability_status || 'متاح للمشاريع الجديدة';
  const badges = professional?.verification_badges || [];

  // Get portfolio categories from actual data
  const portfolioCategories = ['all', ...new Set(displayData?.portfolio?.map((p: any) => p.category) || [])] as string[];
  
  const filteredPortfolio = selectedCategory === 'all' 
    ? (displayData?.portfolio || []) 
    : (displayData?.portfolio || []).filter((item: any) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/professionals" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-xl md:text-2xl text-dark-900">
                {professional?.display_name || professional?.full_name || 'غير محدد'}
              </h1>
              <p className="text-gray-600 mt-1">{professional?.user_type || 'محترف'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg transition-colors duration-200">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-500 border border-gray-300 rounded-lg transition-colors duration-200">
                <Heart className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-500 border border-gray-300 rounded-lg transition-colors duration-200">
                <Flag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Overview */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <img
                    src={professional.avatar}
                    alt={professional.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  {professional.online && (
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 border-3 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="font-heading font-bold text-2xl text-dark-900">{professional?.display_name || professional?.full_name || 'غير محدد'}</h2>
                    {professional?.is_verified && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                    {professional?.verification_badges?.includes('top_rated') && (
                      <Award className="h-6 w-6 text-yellow-500" />
                    )}
                  </div>
                  
                  <p className="text-lg text-dark-600 font-medium mb-3">{professional?.user_type || 'محترف'}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-semibold text-dark-900">{professional?.rating_average || 0}</span>
                      <span className="text-dark-600">({professional?.rating_count || 0} reviews)</span>
                    </div>
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {professional?.user_type || 'محترف'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-dark-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{professional?.location || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>يرد خلال {professional?.response_time || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>عضو منذ {new Date(professional?.created_at || Date.now()).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">About</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-dark-600 leading-relaxed whitespace-pre-line">
                  {professional?.bio || 'لا يوجد وصف متاح'}
                </p>
              </div>
            </div>

            {/* Skills & Specializations */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">Skills & Specializations</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-dark-900 mb-3">Core Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(professional?.skills || []).map((skill: string, index: number) => (
                    <span key={index} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-dark-900 mb-3">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {(professional?.specializations || []).map((spec: string, index: number) => (
                    <span key={index} className="bg-accent-50 text-accent-700 px-3 py-1 rounded-full text-sm font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-dark-900 mb-3">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {(professional?.certifications || []).map((cert: string, index: number) => (
                    <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-semibold text-xl text-dark-900">Portfolio</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {displayData?.portfolio?.length || 0} projects • {portfolioCategories.length - 1} categories
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {portfolioCategories.map((category: string) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPortfolio.map((item: any) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium">
                          {item.category}
                        </div>
                      </div>
                      <h4 className="font-semibold text-dark-900 mb-2">{item.title}</h4>
                      <p className="text-dark-600 text-sm mb-3">{item.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{item.budget}</span>
                        <span>{item.duration}</span>
                        <span>{item.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPortfolio.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-dark-900 mb-1">{item.title}</h4>
                        <p className="text-dark-600 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{item.category}</span>
                          <span>{item.budget}</span>
                          <span>{item.duration}</span>
                          <span>{item.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-xl text-dark-900">Client Reviews</h3>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{professional?.rating_average || 0}</span>
                  <span className="text-gray-600">({displayData?.reviews?.length || 0} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {(displayData?.reviews || []).map((review: any) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.client.avatar}
                        alt={review.client.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-dark-900">{review.client.name}</h4>
                            <p className="text-sm text-gray-600">{review.client.location}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">{review.date}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                            {review.project}
                          </span>
                        </div>
                        
                        <p className="text-dark-600 leading-relaxed mb-3">{review.comment}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors duration-200">
                            <ThumbsUp className="h-4 w-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-1">${professional?.hourly_rate || 0}/hr</div>
                <div className="text-sm text-gray-600">Starting Rate</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-semibold text-dark-900">{professional?.response_time || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-semibold text-dark-900">{professional?.completion_rate || 0}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Completed Projects:</span>
                  <span className="font-semibold text-dark-900">{professional?.projects_completed || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Earned:</span>
                  <span className="font-semibold text-dark-900">${professional?.total_earnings || 0}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (!isAuthenticated || !user) {
                      toast.error('Please login to hire a professional');
                      router.push('/login');
                      return;
                    }
                    setShowContractForm(true);
                  }}
                  className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200"
                >
                  {isAuthenticated ? 'Hire Now' : 'Login to Hire'}
                </button>
                <button className="w-full bg-gray-100 text-dark-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Payment protected</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Identity verified</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>Top rated professional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">Professional Info</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-dark-900 mb-2">Education</h4>
                  <p className="text-dark-600 text-sm">{professional?.education || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-dark-900 mb-2">Experience</h4>
                  <p className="text-dark-600 text-sm">{professional?.experience || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-dark-900 mb-2">Service Area</h4>
                  <p className="text-dark-600 text-sm">{professional?.serviceArea || professional?.location || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-dark-900 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {(professional?.languages || []).map((lang: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-dark-900 mb-2">Availability</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      professional?.is_available ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-dark-600 text-sm">{professional?.availability || 'Not available'}</span>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-dark-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    {professional?.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-dark-600">{professional.phone}</span>
                      </div>
                    )}
                    {professional?.email && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-dark-600">{professional.email}</span>
                      </div>
                    )}
                    {professional?.website && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a 
                          href={professional.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {professional.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">Badges & Achievements</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {(professional?.badges || []).map((badge: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-lg p-3 text-center">
                    <Award className="h-6 w-6 text-primary-600 mx-auto mb-1" />
                    <span className="text-sm font-medium text-dark-900">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Creation Form Modal */}
      {professional && (
        <ContractCreationForm
          professionalId={professionalId}
          professional={{
            id: professional.id,
            display_name: professional.display_name,
            full_name: professional.full_name,
            avatar: professional.avatar,
            hourly_rate: professional.hourly_rate,
            user_type: professional.user_type
          }}
          isOpen={showContractForm}
          onClose={() => setShowContractForm(false)}
        />
      )}
    </div>
  );
}