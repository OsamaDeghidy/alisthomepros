export interface RouteItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

export type UserRole = 'client' | 'home-pro' | 'specialist' | 'crew-member';

export const userRoles = {
  CLIENT: 'client' as UserRole,
  HOME_PRO: 'home-pro' as UserRole,
  SPECIALIST: 'specialist' as UserRole,
  CREW_MEMBER: 'crew-member' as UserRole,
};

// صفحات عامة (للجميع)
export const publicRoutes: RouteItem[] = [
  { name: 'Home', href: '/', icon: 'Home' },
  { name: 'Login', href: '/login', icon: 'LogIn' },
  { name: 'Register', href: '/register', icon: 'UserPlus' },
  { name: 'Professionals', href: '/professionals', icon: 'Users' },
  { name: 'How It Works', href: '/how-it-works', icon: 'HelpCircle' },
  { name: 'About', href: '/about', icon: 'Info' },
  { name: 'Contact', href: '/contact', icon: 'Phone' },
];

// صفحات العملاء (Client Dashboard)
export const clientRoutes: RouteItem[] = [
  { name: 'Dashboard', href: '/client/dashboard', icon: 'BarChart3', requiresAuth: true, roles: ['client'] },
  { name: 'Post Project', href: '/post-project', icon: 'Plus', requiresAuth: true, roles: ['client'] },
  { name: 'My Projects', href: '/client/projects', icon: 'Briefcase', requiresAuth: true, roles: ['client'] },
  { name: 'Browse Professionals', href: '/professionals', icon: 'Users', requiresAuth: true, roles: ['client'] },
  { name: 'Messages', href: '/messages', icon: 'MessageCircle', requiresAuth: true, roles: ['client'] },
  { name: 'Contracts', href: '/client/contracts', icon: 'FileText', requiresAuth: true, roles: ['client'] },
  { name: 'Payments', href: '/client/payments', icon: 'CreditCard', requiresAuth: true, roles: ['client'] },
  { name: 'Reviews', href: '/client/reviews', icon: 'Star', requiresAuth: true, roles: ['client'] },
  { name: 'Favorites', href: '/client/favorites', icon: 'Heart', requiresAuth: true, roles: ['client'] },
  { name: 'Settings', href: '/settings', icon: 'Settings', requiresAuth: true, roles: ['client'] },
];

// صفحات المحترفين (Professional Dashboard)
export const professionalRoutes: RouteItem[] = [
  { name: 'Dashboard', href: '/professional/dashboard', icon: 'BarChart3', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Find Work', href: '/find-work', icon: 'Search', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'My Jobs', href: '/my-jobs', icon: 'Briefcase', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Proposals', href: '/professional/proposals', icon: 'Send', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Messages', href: '/messages', icon: 'MessageCircle', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Contracts', href: '/professional/contracts', icon: 'FileText', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Earnings', href: '/professional/earnings', icon: 'DollarSign', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Calendar', href: '/professional/calendar', icon: 'Calendar', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Availability', href: '/professional/availability', icon: 'Clock', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Time Tracker', href: '/professional/time-tracker', icon: 'Timer', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Task Management', href: '/professional/tasks', icon: 'CheckSquare', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Profile', href: '/profile', icon: 'User', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Portfolio', href: '/professional/portfolio', icon: 'Camera', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Reviews', href: '/professional/reviews', icon: 'Star', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
  { name: 'Settings', href: '/settings', icon: 'Settings', requiresAuth: true, roles: ['home-pro', 'specialist', 'crew-member'] },
];



// صفحات الإعدادات
export const settingsRoutes: RouteItem[] = [
  { name: 'Profile Settings', href: '/settings/profile', icon: 'User' },
  { name: 'Account Security', href: '/settings/security', icon: 'Lock' },
  { name: 'Notification Settings', href: '/settings/notifications', icon: 'Bell' },
  { name: 'Payment Methods', href: '/settings/payments', icon: 'CreditCard' },
  { name: 'Privacy Settings', href: '/settings/privacy', icon: 'Eye' },
  { name: 'Billing History', href: '/settings/billing', icon: 'Receipt' },
];

// صفحات إضافية
export const additionalRoutes: RouteItem[] = [
  { name: 'Help Center', href: '/help', icon: 'HelpCircle' },
  { name: 'Support', href: '/support', icon: 'MessageCircle' },
  { name: 'Blog', href: '/blog', icon: 'BookOpen' },
  { name: 'Success Stories', href: '/success-stories', icon: 'Star' },
  { name: 'Pricing', href: '/pricing', icon: 'DollarSign' },
  { name: 'Terms of Service', href: '/terms', icon: 'FileText' },
  { name: 'Privacy Policy', href: '/privacy', icon: 'Shield' },
];

// دالة مساعدة لجلب الروابط حسب الدور
export function getRoutesByRole(role: UserRole): RouteItem[] {
  switch (role) {
    case 'client':
      return clientRoutes;
    case 'home-pro':
    case 'specialist':
    case 'crew-member':
      return professionalRoutes;
    default:
      return publicRoutes;
  }
}

// دالة مساعدة لجلب الروابط الرئيسية للنافجيشن
export function getMainNavRoutes(role: UserRole): RouteItem[] {
  switch (role) {
    case 'client':
      return [
        { name: 'Dashboard', href: '/client/dashboard', icon: 'BarChart3' },
        { name: 'Post Project', href: '/post-project', icon: 'Plus' },
        { name: 'My Projects', href: '/client/projects', icon: 'Briefcase' },
        { name: 'Professionals', href: '/professionals', icon: 'Users' },
        { name: 'Messages', href: '/messages', icon: 'MessageCircle' },
      ];
    case 'home-pro':
    case 'specialist':
    case 'crew-member':
      return [
        { name: 'Dashboard', href: '/professional/dashboard', icon: 'BarChart3' },
        { name: 'Find Work', href: '/find-work', icon: 'Search' },
        { name: 'Proposals', href: '/professional/proposals', icon: 'Send' },
        { name: 'Contracts', href: '/professional/contracts', icon: 'FileCheck' },
        { name: 'Messages', href: '/messages', icon: 'MessageCircle' },
      ];
    default:
      return [
        { name: 'Find Professionals', href: '/professionals', icon: 'Users' },
        { name: 'How It Works', href: '/how-it-works', icon: 'HelpCircle' },
        { name: 'About', href: '/about', icon: 'Info' },
      ];
  }
}

// دالة مساعدة لجلب الروابط السريعة
export function getQuickActionRoutes(role: UserRole): RouteItem[] {
  switch (role) {
    case 'client':
      return [
        { name: 'Post New Project', href: '/post-project', icon: 'Plus' },
        { name: 'Browse Professionals', href: '/professionals', icon: 'Users' },
        { name: 'View Messages', href: '/messages', icon: 'MessageCircle' },
      ];
    case 'home-pro':
    case 'specialist':
    case 'crew-member':
      return [
        { name: 'Browse Jobs', href: '/find-work', icon: 'Search' },
        { name: 'Submit Proposal', href: '/professional/proposals/new', icon: 'Send' },
        { name: 'Track Time', href: '/professional/time-tracker', icon: 'Timer' },
        { name: 'View Calendar', href: '/professional/calendar', icon: 'Calendar' },
      ];
    default:
      return [];
  }
}

const routes = {
  publicRoutes,
  clientRoutes,
  professionalRoutes,
  settingsRoutes,
  additionalRoutes,
  getRoutesByRole,
  getMainNavRoutes,
  getQuickActionRoutes,
};

export default routes;