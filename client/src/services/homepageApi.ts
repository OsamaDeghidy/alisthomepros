import api from '../lib/api';
import { professionalsApi, Professional } from './professionalsApi';

export interface HomepageStats {
  total_professionals: number;
  total_projects: number;
  customer_satisfaction: number;
  total_earnings: number;
  active_professionals: number;
  completed_projects: number;
}

export interface PopularService {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  image: string;
  average_price: number;
  professionals_count: number;
  projects_count: number;
  rating_average: number;
  is_featured: boolean;
  created_at: string;
}

export interface FeaturedProfessional {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  email: string;
  avatar: string | null;
  user_type: 'home_pro' | 'specialist' | 'crew_member';
  is_verified: boolean;
  company_name: string | null;
  location: string | null;
  bio: string | null;
  skills: string[] | null;
  rating_average: number;
  rating_count: number;
  hourly_rate: number | null;
  experience_years: number | null;
  is_available: boolean;
  projects_completed: number;
  total_earnings: number;
  verification_badges: string[];
  completion_rate: number;
  response_time: string;
  created_at: string;
  is_featured: boolean;
  specialization: string;
}

export interface CustomerTestimonial {
  id: number;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string | null;
    location: string | null;
  };
  professional: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    specialization: string;
  };
  rating: number;
  comment: string;
  project_title: string;
  project_category: string;
  is_featured: boolean;
  helpful_count: number;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string | null;
  };
  slug: string;
  read_time: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageData {
  stats: HomepageStats;
  popular_services: PopularService[];
  featured_professionals: FeaturedProfessional[];
  testimonials: CustomerTestimonial[];
  blog_posts: BlogPost[];
}

class HomepageApiService {
  private baseUrl = '/homepage';

  // Get complete homepage data
  async getHomepageData(): Promise<HomepageData> {
    try {
      // Since backend is not available, use fallback data directly
      return this.getFallbackHomepageData();
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return this.getFallbackHomepageData();
    }
  }

  // Get homepage statistics
  async getHomepageStats(): Promise<HomepageStats> {
    try {
      // Use mock data directly since backend is not available
      return this.getMockStats();
    } catch (error) {
      console.error('Error fetching homepage stats:', error);
      return this.getMockStats();
    }
  }

  // Get popular services
  async getPopularServices(limit: number = 6): Promise<PopularService[]> {
    try {
      // Use mock data directly since backend is not available
      return this.getMockPopularServices();
    } catch (error) {
      console.error('Error fetching popular services:', error);
      return this.getMockPopularServices();
    }
  }

  // Get featured professionals
  async getFeaturedProfessionals(limit: number = 4): Promise<FeaturedProfessional[]> {
    try {
      // Use mock data directly since backend is not available
      return [
         {
           id: 1,
           username: "ahmed_mohamed",
           first_name: "أحمد",
           last_name: "محمد",
           full_name: "أحمد محمد",
           display_name: "أحمد محمد",
           email: "ahmed@example.com",
           avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
           user_type: "home_pro" as const,
           is_verified: true,
           company_name: null,
           location: "الرياض",
           bio: "كهربائي محترف مع خبرة 10 سنوات",
           skills: ["كهرباء", "إضاءة", "أنظمة أمان"],
           rating_average: 4.9,
           rating_count: 127,
           hourly_rate: 150,
           experience_years: 10,
           is_available: true,
           projects_completed: 89,
           total_earnings: 45000,
           verification_badges: ["verified", "background_check"],
           completion_rate: 98,
           response_time: "خلال ساعة",
           created_at: new Date().toISOString(),
           is_featured: true,
           specialization: "كهربائي محترف"
         },
         {
           id: 2,
           username: "fatima_ali",
           first_name: "فاطمة",
           last_name: "العلي",
           full_name: "فاطمة العلي",
           display_name: "فاطمة العلي",
           email: "fatima@example.com",
           avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
           user_type: "specialist" as const,
           is_verified: true,
           company_name: "تصاميم فاطمة",
           location: "جدة",
           bio: "مصممة داخلية متخصصة في التصاميم العصرية",
           skills: ["تصميم داخلي", "ديكور", "إضاءة"],
           rating_average: 4.8,
           rating_count: 95,
           hourly_rate: 200,
           experience_years: 8,
           is_available: true,
           projects_completed: 67,
           total_earnings: 38000,
           verification_badges: ["verified", "portfolio_verified"],
           completion_rate: 96,
           response_time: "خلال 30 دقيقة",
           created_at: new Date().toISOString(),
           is_featured: true,
           specialization: "مصممة داخلية"
         },
         {
           id: 3,
           username: "mohamed_saad",
           first_name: "محمد",
           last_name: "السعد",
           full_name: "محمد السعد",
           display_name: "محمد السعد",
           email: "mohamed@example.com",
           avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
           user_type: "home_pro" as const,
           is_verified: true,
           company_name: null,
           location: "الدمام",
           bio: "سباك خبير في جميع أعمال السباكة",
           skills: ["سباكة", "تسليك", "تركيبات صحية"],
           rating_average: 4.7,
           rating_count: 156,
           hourly_rate: 120,
           experience_years: 12,
           is_available: true,
           projects_completed: 134,
           total_earnings: 52000,
           verification_badges: ["verified"],
           completion_rate: 94,
           response_time: "خلال ساعتين",
           created_at: new Date().toISOString(),
           is_featured: true,
           specialization: "سباك خبير"
         }
       ].slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured professionals:', error);
      return [];
    }
  }

  // Get customer testimonials
  async getTestimonials(limit: number = 3): Promise<CustomerTestimonial[]> {
    try {
      // Use mock data directly since backend is not available
      return this.getMockTestimonials();
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return this.getMockTestimonials();
    }
  }

  // Get blog posts
  async getBlogPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      // Use mock data directly since backend is not available
      return this.getMockBlogPosts();
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return this.getMockBlogPosts();
    }
  }

  // Search services
  async searchServices(query: string, location?: string): Promise<{
    professionals: Professional[];
    services: PopularService[];
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/search/`, {
        params: { q: query, location }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching services:', error);
      // Fallback to professionals search
      try {
        const professionalsResponse = await professionalsApi.searchProfessionals(query, {
          location,
          page_size: 10
        });
        return {
          professionals: professionalsResponse.results,
          services: []
        };
      } catch (fallbackError) {
        return {
          professionals: [],
          services: []
        };
      }
    }
  }

  // Private helper methods for fallback data
  private async getFallbackHomepageData(): Promise<HomepageData> {
    try {
      const [stats, services, professionals, testimonials, blogPosts] = await Promise.allSettled([
        this.getHomepageStats(),
        this.getPopularServices(),
        this.getFeaturedProfessionals(),
        this.getTestimonials(),
        this.getBlogPosts()
      ]);

      return {
        stats: stats.status === 'fulfilled' ? stats.value : this.getMockStats(),
        popular_services: services.status === 'fulfilled' ? services.value : this.getMockPopularServices(),
        featured_professionals: professionals.status === 'fulfilled' ? professionals.value : [],
        testimonials: testimonials.status === 'fulfilled' ? testimonials.value : this.getMockTestimonials(),
        blog_posts: blogPosts.status === 'fulfilled' ? blogPosts.value : this.getMockBlogPosts()
      };
    } catch (error) {
      console.error('Error getting fallback homepage data:', error);
      return {
        stats: this.getMockStats(),
        popular_services: this.getMockPopularServices(),
        featured_professionals: [],
        testimonials: this.getMockTestimonials(),
        blog_posts: this.getMockBlogPosts()
      };
    }
  }

  private getMockStats(): HomepageStats {
    return {
      total_professionals: 50000,
      total_projects: 1000000,
      customer_satisfaction: 98,
      total_earnings: 2800000,
      active_professionals: 45000,
      completed_projects: 950000
    };
  }

  private getMockPopularServices(): PopularService[] {
    return [
      {
        id: 1,
        name: 'Kitchen Remodeling',
        description: 'Transform your kitchen with expert designers',
        category: 'Home Improvement',
        icon: '🏠',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        average_price: 85,
        professionals_count: 1200,
        projects_count: 5400,
        rating_average: 4.8,
        is_featured: true,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Bathroom Renovation',
        description: 'Modern bathroom designs and installation',
        category: 'Home Improvement',
        icon: '🚿',
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        average_price: 92,
        professionals_count: 850,
        projects_count: 3200,
        rating_average: 4.7,
        is_featured: true,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Electrical Work',
        description: 'Licensed electricians for all your needs',
        category: 'Electrical',
        icon: '⚡',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        average_price: 78,
        professionals_count: 650,
        projects_count: 2800,
        rating_average: 4.9,
        is_featured: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  private getMockTestimonials(): CustomerTestimonial[] {
    return [
      {
        id: 1,
        client: {
          id: 1,
          first_name: 'Jennifer',
          last_name: 'Walsh',
          full_name: 'Jennifer Walsh',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          location: 'San Francisco, CA'
        },
        professional: {
          id: 1,
          first_name: 'Sarah',
          last_name: 'Mitchell',
          full_name: 'Sarah Mitchell',
          specialization: 'Kitchen Designer'
        },
        rating: 5,
        comment: 'Finding the right contractor for our kitchen remodel seemed impossible until we discovered A-List Home Pros. Within 48 hours, we had three qualified contractors bidding on our project.',
        project_title: 'Kitchen Remodel',
        project_category: 'Home Improvement',
        is_featured: true,
        helpful_count: 24,
        created_at: new Date().toISOString()
      }
    ];
  }

  private getMockBlogPosts(): BlogPost[] {
    return [
      {
        id: 1,
        title: '10 Essential Questions to Ask Before Hiring a Contractor',
        excerpt: 'Learn what questions to ask to ensure you hire the right professional for your home improvement project.',
        content: '',
        featured_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: {
          id: 1,
          name: 'Tips & Guides',
          slug: 'tips-guides'
        },
        author: {
          id: 1,
          first_name: 'Admin',
          last_name: 'User',
          full_name: 'Admin User',
          avatar: null
        },
        slug: 'questions-to-ask-contractor',
        read_time: 5,
        is_featured: true,
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}

export const homepageApi = new HomepageApiService();
export default homepageApi;