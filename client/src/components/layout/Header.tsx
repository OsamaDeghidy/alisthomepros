'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Menu, X, Bell, User, Briefcase, Users, MessageCircle, Settings, Plus, Search, BarChart3, DollarSign, Heart, FileText, Home, Info, Phone, HelpCircle, Calendar, Clock, CheckSquare, Timer, ChevronDown, LogOut, Crown, FileCheck, Send, Star, Eye, CreditCard, Shield } from 'lucide-react';
import { getMainNavRoutes, type UserRole } from '@/lib/routes';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/lib/auth';
import { getMediaUrl } from '@/lib/utils';
import NotificationDropdown from '../NotificationDropdown';
import { notificationsApi } from '@/services/notificationsApi';
import Cookies from 'js-cookie';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Prevent hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated) {
        try {
          const count = await notificationsApi.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
        }
      }
    };

    fetchUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Listen for custom refresh notifications event
    const handleRefreshNotifications = () => {
      fetchUnreadCount();
    };
    
    window.addEventListener('refreshNotifications', handleRefreshNotifications);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    };
  }, [isAuthenticated]);
  
  // Real-time notifications via WebSocket (Django Channels)
  useEffect(() => {
    if (!isAuthenticated) return;

    const token = Cookies.get('access_token');
    if (!token) return;

    try {
      // Build WebSocket URL from backend API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const wsBase = apiUrl.replace(/\/api$/, '').replace(/^http/, 'ws');
      const wsUrl = `${wsBase}/ws/notifications/?token=${encodeURIComponent(token)}`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        // console.log('Notifications WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.type === 'notification') {
            // Increase unread count for new incoming notification
            setUnreadCount((prev) => prev + 1);
            // Notify other parts to refresh if they need fresh data
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('refreshNotifications'));
            }
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = () => {};

      return () => {
        try { ws.close(); } catch {}
      };
    } catch {}
  }, [isAuthenticated]);
  
  // Get user role from authenticated user or default to guest
  const getUserRole = (): UserRole | 'guest' => {
    if (user) {
      // Map backend user types to frontend roles
      switch (user.user_type) {
        case 'home_pro':
        case 'specialist':
        case 'crew_member':
          return 'home_pro';
        case 'client':
        default:
          return 'client';
      }
    }
    
    // Return guest for non-authenticated users to avoid hydration mismatch
    return 'guest';
  };

  const userRole = getUserRole();
  
  // Define guest navigation for non-authenticated users
  const guestNavigation = [
    { name: 'Home', href: '/', icon: 'Home' },
    { name: 'Find Work', href: '/find-work', icon: 'Users' },
    { name: 'How It Works', href: '/how-it-works', icon: 'HelpCircle' },
    { name: 'Pricing', href: '/pricing', icon: 'CreditCard' },
    { name: 'About Us', href: '/about', icon: 'Info' },
    { name: 'Help', href: '/help', icon: 'HelpCircle' },
    { name: 'Privacy', href: '/privacy', icon: 'FileText', submenu: [
      { name: 'Privacy Policy', href: '/privacy', icon: 'Shield' },
      { name: 'Terms of Service', href: '/terms', icon: 'FileText' }
    ] },
  ];
  
  // Conditionally set navigation routes based on user role
  const navigationRoutes = userRole === 'guest' 
    ? guestNavigation
    : getMainNavRoutes(userRole);

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logout successful');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      logout();
      router.push('/');
    }
  };

  // Icon mapping
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'BarChart3': BarChart3,
    'Plus': Plus,
    'Briefcase': Briefcase,
    'Users': Users,
    'MessageCircle': MessageCircle,
    'Search': Search,
    'DollarSign': DollarSign,
    'Calendar': Calendar,
    'Timer': Timer,
    'CheckSquare': CheckSquare,
    'Clock': Clock,
    'HelpCircle': HelpCircle,
    'Info': Info,
    'Home': Home,
    'Phone': Phone,
    'User': User,
    'Settings': Settings,
    'Heart': Heart,
    'FileText': FileText,
    'Send': Send,
    'Star': Star,
    'Eye': Eye,
    'CreditCard': CreditCard,
    'Shield': Shield,
    'Bell': Bell
  };

  const isActivePage = (href: string) => {
    return pathname === href;
  };

  // Get user dropdown menu items based on role
  const getUserDropdownItems = () => {
    if (userRole === 'client') {
      return [
        { name: 'Dashboard', href: '/client/dashboard', icon: 'BarChart3' },
        { name: 'My Projects', href: '/client/projects', icon: 'Briefcase' },
        { name: 'Contracts', href: '/client/contracts', icon: 'FileText' },
        { name: 'Messages', href: '/messages', icon: 'MessageCircle' },
        { name: 'Notifications', href: '/notifications', icon: 'Bell' },
        { name: 'Payments', href: '/client/payments', icon: 'DollarSign' },
        { name: 'Reviews', href: '/client/reviews', icon: 'Star' },
        { name: 'Profile', href: '/profile', icon: 'User' },
        { name: 'Settings', href: '/settings', icon: 'Settings' },
      ];
    } else if (userRole === 'home_pro') {
      return [
        { name: 'Dashboard', href: '/professional/dashboard', icon: 'BarChart3' },
        { name: 'Find Work', href: '/find-work', icon: 'Search' },
        { name: 'My Jobs', href: '/professional/contracts', icon: 'Briefcase' },
        { name: 'Messages', href: '/messages', icon: 'MessageCircle' },
        { name: 'Notifications', href: '/notifications', icon: 'Bell' },
        { name: 'Earnings', href: '/professional/earnings', icon: 'DollarSign' },
        { name: 'Calendar', href: '/professional/calendar', icon: 'Calendar' },
        { name: 'Portfolio', href: '/professional/portfolio', icon: 'Eye' },
        { name: 'Reviews', href: '/professional/reviews', icon: 'Star' },
        { name: 'Profile', href: '/profile', icon: 'User' },
        { name: 'Settings', href: '/settings', icon: 'Settings' },
      ];
    }
    return [];
  };

  const userDropdownItems = getUserDropdownItems();

  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-blue-100/50 shadow-lg">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 to-cyan-50/30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="A-List Home Pros" 
                width={120}
                height={60}
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationRoutes.map((item) => (
              item.submenu ? (
                <div key={item.name} className="relative group">
                  <button
                    className={`group relative px-3 py-2 font-medium text-xs rounded-lg transition-all duration-300 flex items-center space-x-1 ${
                      isActivePage(item.href) || item.submenu.some(sub => isActivePage(sub.href))
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative px-3 py-2 font-medium text-xs rounded-lg transition-all duration-300 ${
                    isActivePage(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActivePage(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg"></div>
                  )}
                  {!isActivePage(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Authenticated User Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* Action Button */}
                <Link
                  href={userRole === 'client' ? '/post-project' : '/find-work'}
                  className="hidden md:flex bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {userRole === 'client' ? 'Post Project' : 'Find Work'}
                </Link>

                {/* Notifications */}
                <div className="hidden md:block relative">
                  <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    unreadCount={unreadCount}
                    onUnreadCountChange={setUnreadCount}
                  />
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={getMediaUrl(user.avatar)}
                        alt={`${user.first_name} ${user.last_name}`}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.user_type === 'home_pro' ? 'Professional' : user.user_type}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {userDropdownItems.map((item) => {
                        const IconComponent = iconMap[item.icon] || User;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <IconComponent className="h-4 w-4 text-gray-400" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Guest User Buttons */
              <div className="flex items-center space-x-4">
                {isClient && (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {/* Authenticated User Mobile Section */}
            {isAuthenticated && user ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                     <Image
                       src={getMediaUrl(user.avatar)}
                       alt={`${user.first_name} ${user.last_name}`}
                       width={40}
                       height={40}
                       className="w-full h-full object-cover"
                     />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.user_type === 'home_pro' ? 'Professional' : user.user_type}
                    </div>
                  </div>
                </div>

                {/* Action Button - Mobile */}
                <Link
                  href={userRole === 'client' ? '/post-project' : '/find-work'}
                  className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg mb-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {userRole === 'client' ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Project
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Find Work
                    </>
                  )}
                </Link>

                {/* User Menu Items */}
                <div className="space-y-1 mb-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Account</div>
                  {userDropdownItems.map((item) => {
                    const IconComponent = iconMap[item.icon] || User;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              /* Guest Mobile Auth Buttons */
              <>
                {isClient && (
                  <div className="flex space-x-3 mb-4">
                    <Link
                      href="/login"
                      className="flex-1 text-center bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Navigation */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Navigation</div>
              {navigationRoutes.map((item) => {
                const IconComponent = item.icon ? iconMap[item.icon] || Users : Users;
                if (item.submenu) {
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                        isActivePage(item.href) || item.submenu.some(sub => isActivePage(sub.href))
                          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600'
                          : 'text-gray-700'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          isActivePage(item.href) || item.submenu.some(sub => isActivePage(sub.href)) ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="ml-8 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIconComponent = subItem.icon ? iconMap[subItem.icon] || FileText : FileText;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 group text-sm ${
                                isActivePage(subItem.href)
                                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600'
                                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600'
                              }`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <SubIconComponent className={`h-4 w-4 ${
                                isActivePage(subItem.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                              }`} />
                              <span>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                        isActivePage(item.href)
                          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent className={`h-5 w-5 ${
                        isActivePage(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                      }`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;