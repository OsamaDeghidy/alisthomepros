'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/lib/auth';
import { portfolioService } from '@/lib/portfolio';
import { getMediaUrl } from '@/lib/utils';
// Define User interface locally to avoid import issues
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'client' | 'home_pro' | 'specialist' | 'crew_member';
  phone?: string;
  location?: string;
  avatar?: string;
  is_verified: boolean;
  verification_status: string;
  company_name?: string;
  bio?: string;
  website?: string;
  experience_years?: number;
  hourly_rate?: number;
  skills: string[];
  rating_average?: number;
  rating_count: number;
  is_available: boolean;
  last_activity?: string;
  license_number?: string;
  insurance_verified: boolean;
  background_check_verified: boolean;
  notification_preferences: Record<string, any>;
  projects_completed: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

interface PortfolioItem {
  id: number;
  professional: User;
  title: string;
  description: string;
  category: string;
  project_duration: string;
  project_cost: string;
  completion_date: string;
  featured: boolean;
  likes: number;
  views: number;
  images: any[];
  created_at: string;
  updated_at: string;
}
import toast from 'react-hot-toast';
import SessionExpiredModal, { useSessionExpiredModal } from '@/components/SessionExpiredModal';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Camera, 
  Shield, 
  Award, 
  Calendar,
  Briefcase,
  Star,
  Settings,
  Bell,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Globe,
  Clock,
  Users,
  Heart,
  MessageSquare,
  Share2,
  X,
  Save,
  Upload
} from 'lucide-react';
import { User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen: isSessionExpiredOpen, showModal: showSessionExpiredModal, hideModal: hideSessionExpiredModal } = useSessionExpiredModal();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
      fetchUserProfile();
      fetchUserPortfolio();
      // Initialize edit form with current user data
      setEditFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        company_name: user.company_name,
        website: user.website,
        hourly_rate: user.hourly_rate,
        experience_years: user.experience_years,
        skills: user.skills || []
      });
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Listen for session expiry events
  useEffect(() => {
    const handleSessionExpired = () => {
      showSessionExpiredModal();
    };

    window.addEventListener('session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [showSessionExpiredModal]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await authService.getUserProfile();
      setProfileData(profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 401) {
        showSessionExpiredModal();
      } else {
        toast.error('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPortfolio = async () => {
    try {
      setPortfolioLoading(true);
      const portfolioData = await portfolioService.getUserPortfolio({
          page_size: 6 // Limit to 6 items for profile overview
        });
        setPortfolioItems(portfolioData.results || []);
      } catch (error: any) {
      console.error('Error fetching portfolio:', error);
      
      if (error.response?.status === 401) {
        showSessionExpiredModal();
      }
      // Don't show error toast for portfolio as it's not critical for other errors
    } finally {
      setPortfolioLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User data not found</p>
          <Link href="/login" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Use actual user data from backend
   const userInfo = {
     id: user.id,
     name: `${user.first_name} ${user.last_name}`,
     title: user.company_name || getUserTypeDisplay(user.user_type),
     avatar: getMediaUrl(user.avatar),
     email: user.email,
     phone: user.phone || 'Not specified',
     location: user.location || 'Not specified',
     role: getUserTypeDisplay(user.user_type),
     memberSince: new Date(user.created_at).getFullYear().toString(),
     verified: user.is_verified || false,
     topRated: (user.rating_average || 0) >= 4.5,
     rating: user.rating_average || 0,
     reviews: user.rating_count || 0,
     completedProjects: user.projects_completed || 0,
     totalEarned: `$${user.total_earnings || 0}`,
     responseTime: '< 1 hour', // Default value
     successRate: user.projects_completed > 0 ? 95 : 0, // Default calculation
     bio: user.bio || 'No bio added yet',
     skills: user.skills || [],
     certifications: profileData?.profile?.certifications || [],
     languages: ['English'], // Default
     serviceArea: user.location || 'Not specified',
     availability: user.is_available ? 'Available' : 'Unavailable'
   };

   // Helper function to get user type display name
   function getUserTypeDisplay(userType: string) {
     switch (userType) {
       case 'client': return 'Client';
       case 'home_pro': return 'Home Professional';
       case 'specialist': return 'A-List Specialist';
       case 'crew_member': return 'Crew Member';
       default: return 'Platform Member';
     }
   }

  const handleEditProfile = () => {
    setIsEditing(true);
    // Reset form data to current user data
    setEditFormData({
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone: user?.phone,
      location: user?.location,
      bio: user?.bio,
      company_name: user?.company_name,
      website: user?.website,
      hourly_rate: user?.hourly_rate,
      experience_years: user?.experience_years,
      skills: user?.skills || []
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsUpdating(true);
      console.log('🔄 Starting profile update...');
      
      // Update avatar if a new one was selected
      if (avatarFile) {
        console.log('📸 Updating avatar...');
        try {
          await authService.updateAvatar(avatarFile);
          toast.success('Avatar updated successfully!');
          console.log('✅ Avatar updated successfully');
        } catch (avatarError: any) {
          console.error('❌ Avatar update failed:', avatarError);
          const avatarErrorMsg = avatarError.response?.data?.message || 
                                avatarError.response?.data?.error || 
                                'Failed to update avatar';
          toast.error(`Avatar Error: ${avatarErrorMsg}`);
          // Continue with profile update even if avatar fails
        }
      }
      
      // Clean the form data to remove empty strings and null values
      const cleanedData = Object.entries(editFormData).reduce((acc, [key, value]) => {
        // Only include non-empty values
        if (value !== null && value !== undefined && value !== '') {
          // Special handling for phone - ensure it's properly formatted or exclude it
          if (key === 'phone') {
            // Only include phone if it looks like a valid number
            const phoneStr = String(value).trim();
            if (phoneStr && phoneStr.length >= 10) {
              acc[key] = phoneStr;
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as any);
      
      console.log('📝 Updating profile data:', cleanedData);
      
      // Update profile data
      const updatedUser = await authService.updateUser(cleanedData);
      console.log('✅ Profile data updated successfully');
      
      // Update the auth store
      useAuthStore.getState().setUser(updatedUser);
      
      // Refresh profile data
      await fetchUserProfile();
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Failed to update profile';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          // Handle field-specific errors
          const fieldErrors = [];
          for (const [field, errors] of Object.entries(data)) {
            if (Array.isArray(errors)) {
              fieldErrors.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              fieldErrors.push(`${field}: ${errors}`);
            }
          }
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ');
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`Profile Update Error: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !editFormData.skills?.includes(skill.trim())) {
      setEditFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill.trim()]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setEditFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const stats = [
    { label: "Completed Projects", value: userInfo.completedProjects, icon: Briefcase, color: "text-blue-600" },
    { label: "Client Rating", value: `${userInfo.rating}/5.0`, icon: Star, color: "text-yellow-600" },
    { label: "Response Time", value: userInfo.responseTime, icon: Calendar, color: "text-green-600" },
    { label: "Success Rate", value: `${userInfo.successRate}%`, icon: TrendingUp, color: "text-primary-600" }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'projects', label: user?.user_type === 'client' ? 'My Projects' : 'Portfolio', icon: Briefcase },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="relative">
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-24 h-24 rounded-xl object-cover border-4 border-primary-100"
                />
                <button className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="font-heading font-bold text-2xl text-dark-900">{userInfo.name}</h1>
                  {userInfo.verified && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  {userInfo.topRated && (
                    <Award className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <p className="text-lg text-dark-600 font-medium mb-2">{userInfo.title}</p>
                <div className="flex items-center space-x-4 text-dark-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {userInfo.memberSince}</span>
                  </div>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {userInfo.role}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleEditProfile}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <Link
                href="/profile/settings"
                className="bg-gray-100 text-dark-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About Section */}
                <div>
                  <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">About</h3>
                  <p className="text-dark-600 leading-relaxed">{userInfo.bio}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-dark-900">{userInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-dark-900">{userInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio Section */}
                {portfolioItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-xl text-dark-900">Portfolio</h3>
                      <Link
                        href="/portfolio"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {portfolioItems.slice(0, 6).map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                          {item.images && item.images.length > 0 && (
                            <img
                              src={item.images[0].image || item.images[0]}
                              alt={item.title}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h4 className="font-semibold text-dark-900 mb-2">{item.title}</h4>
                          <p className="text-sm text-dark-600 line-clamp-2">{item.description}</p>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills & Certifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {userInfo.skills.length > 0 ? userInfo.skills.map((skill, index) => (
                        <span key={index} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      )) : (
                        <span className="text-gray-500">No skills added yet</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">Certifications</h3>
                    <div className="space-y-2">
                      {userInfo.certifications.length > 0 ? userInfo.certifications.map((cert: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-dark-700">{cert}</span>
                        </div>
                      )) : (
                        <span className="text-gray-500">No certifications added yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                {/* Role-based content: Portfolio for professionals, Projects for clients */}
                {user?.user_type === 'client' ? (
                  // Client Projects Section
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading font-semibold text-xl text-dark-900">My Projects</h3>
                      <Link
                        href="/projects/create"
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 text-sm"
                      >
                        Post New Project
                      </Link>
                    </div>
                    
                    {portfolioLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading projects...</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No projects posted yet</p>
                        <Link
                          href="/projects/create"
                          className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200"
                        >
                          Post Your First Project
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  // Professional Portfolio Section
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading font-semibold text-xl text-dark-900">Portfolio</h3>
                      <Link
                        href="/portfolio/create"
                        className="bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 text-sm"
                      >
                        Add Portfolio Item
                      </Link>
                    </div>
                    
                    {portfolioLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading portfolio...</p>
                      </div>
                    ) : portfolioItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {portfolioItems.map((item) => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200">
                            {item.images && item.images.length > 0 && (
                              <img
                                src={item.images[0].image || item.images[0]}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                              />
                            )}
                            <h4 className="font-semibold text-lg text-dark-900 mb-2">{item.title}</h4>
                            <p className="text-dark-600 mb-4 line-clamp-3">{item.description}</p>
                            

                            
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Created {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No portfolio items yet</p>
                        <Link
                          href="/portfolio/create"
                          className="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200"
                        >
                          Add Your First Portfolio Item
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">Client Reviews</h3>
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Client reviews will appear here when you complete projects</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">Quick Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    href="/profile/settings"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Settings className="h-6 w-6 text-gray-600 mb-2" />
                    <h4 className="font-semibold text-dark-900 mb-1">Account Settings</h4>
                    <p className="text-sm text-gray-600">Manage your account preferences</p>
                  </Link>
                  
                  <Link
                    href="/profile/notifications"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Bell className="h-6 w-6 text-gray-600 mb-2" />
                    <h4 className="font-semibold text-dark-900 mb-1">Notifications</h4>
                    <p className="text-sm text-gray-600">Configure notification preferences</p>
                  </Link>
                  
                  <Link
                    href="/profile/billing"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <CreditCard className="h-6 w-6 text-gray-600 mb-2" />
                    <h4 className="font-semibold text-dark-900 mb-1">Billing</h4>
                    <p className="text-sm text-gray-600">Manage payment methods</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <img
                        src={avatarPreview || getMediaUrl(userInfo.avatar)}
                        alt="Profile"
                        className="w-24 h-24 rounded-xl object-cover border-4 border-primary-100"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg hover:bg-primary-600 transition-colors duration-200"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-600">Click the camera icon to change your profile picture</p>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={editFormData.first_name || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={editFormData.last_name || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editFormData.phone || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="City, State/Country"
                    />
                  </div>

                  {/* Professional Information */}
                  {user?.user_type !== 'client' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                          <input
                            type="text"
                            value={editFormData.company_name || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, company_name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                          <input
                            type="url"
                            value={editFormData.website || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                          <input
                            type="number"
                            value={editFormData.hourly_rate || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                          <input
                            type="number"
                            value={editFormData.experience_years || ''}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            min="0"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={editFormData.bio || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Skills */}
                  {user?.user_type !== 'client' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editFormData.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => handleSkillRemove(skill)}
                              className="text-primary-500 hover:text-primary-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add a skill and press Enter"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSkillAdd(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                      className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isUpdating}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Session Expired Modal */}
      <SessionExpiredModal 
        isOpen={isSessionExpiredOpen} 
        onClose={hideSessionExpiredModal} 
      />
    </div>
  );
}