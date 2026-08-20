import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Bell,
  ChefHat,
  ShieldCheck,
  LogOut,
  ShoppingBag as OrderIcon,
  Settings,
  Bookmark,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { StorageService } from '../../services/storage';
import { UserRole } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenLocation: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  currentLocation: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  onOpenLocation,
  onOpenAuth,
  currentLocation,
}) => {
  const { user, isAuthenticated, logout, switchRole, role } = useAuth();
  const { itemCount, total, openCartDrawer } = useCart();
  const { favoriteRestaurants, favoriteFoods } = useFavorites();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = user ? StorageService.getNotifications(user.id) : [];
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const totalFavs = favoriteRestaurants.length + favoriteFoods.length;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Restaurants', path: '/restaurants' },
    { label: 'Offers', path: '/offers', badge: '50% OFF' },
    { label: '👑 Premium', path: '/premium', isHighlight: true },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setProfileDropdownOpen(false);
    if (newRole === 'restaurant_owner') {
      onNavigate('/restaurant-dashboard');
    } else if (newRole === 'admin') {
      onNavigate('/admin');
    } else {
      onNavigate('/');
    }
  };

  const handleNotificationClick = (notifId: string, link?: string) => {
    StorageService.markNotificationRead(notifId);
    setNotificationsOpen(false);
    if (link) onNavigate(link);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-2 sm:gap-4">
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 focus:outline-none group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                🍴
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors flex items-center gap-1">
                  Peter's <span className="text-orange-600">Foody</span>
                </span>
                <span className="hidden lg:block text-[10px] font-bold text-stone-500 tracking-wider uppercase">
                  Premium Food Delivery
                </span>
              </div>
            </button>

            {/* Location Selector Pill */}
            <button
              type="button"
              onClick={onOpenLocation}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100/80 hover:bg-orange-50 hover:border-orange-300 border border-stone-200/60 text-stone-700 hover:text-orange-700 transition-all max-w-[220px]"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
              <span className="text-xs font-semibold truncate text-left">
                {currentLocation || 'Select Location'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 shadow-2xs'
                      : link.isHighlight
                      ? 'text-purple-700 hover:bg-purple-50'
                      : 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-orange-600 text-white text-[9px] font-extrabold tracking-wide">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-stone-700 hover:text-orange-600 hover:bg-stone-100 transition-all flex items-center gap-2 border border-transparent hover:border-stone-200"
              aria-label="Search food or restaurants"
            >
              <Search className="w-4 h-4 text-stone-600" />
              <span className="hidden lg:inline text-xs font-medium text-stone-500">
                Search...
              </span>
              <kbd className="hidden lg:inline text-[10px] font-mono bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded border border-stone-200">
                ⌘K
              </kbd>
            </button>

            {/* Favorites button */}
            <button
              type="button"
              onClick={() => onNavigate('/favorites')}
              className="relative p-2.5 rounded-xl text-stone-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="View favorites"
            >
              <Heart className="w-5 h-5" />
              {totalFavs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                  {totalFavs}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl text-stone-700 hover:text-orange-600 hover:bg-stone-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200/80 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Notifications
                    </h4>
                    {user && (
                      <button
                        onClick={() => {
                          StorageService.markAllNotificationsRead(user.id);
                          setNotificationsOpen(false);
                        }}
                        className="text-[11px] text-orange-600 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n.id, n.link)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.read
                              ? 'bg-stone-50 border-stone-100 text-stone-600'
                              : 'bg-orange-50/70 border-orange-200 text-stone-900 font-medium'
                          }`}
                        >
                          <p className="font-bold text-stone-900 mb-0.5">{n.title}</p>
                          <p className="text-stone-600 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={openCartDrawer}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-stone-900 text-white font-black text-[9px] flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {total > 0 && (
                <span className="bg-orange-700/80 px-2 py-0.5 rounded-md font-extrabold text-xs">
                  ₹{total}
                </span>
              )}
            </button>

            {/* User Profile / Role Switcher Menu */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-bold text-stone-900 leading-none line-clamp-1">
                        {user.name.split(' ')[0]}
                      </p>
                      <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">
                        {role === 'restaurant_owner' ? 'Owner' : role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden md:block" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200/80 p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onClick={e => e.stopPropagation()}
                    >
                      {/* User Info Header */}
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <p className="text-xs font-bold text-stone-900 line-clamp-1">{user.name}</p>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{user.email}</p>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-extrabold text-[10px] uppercase">
                            Role: {role}
                          </span>
                        </div>
                      </div>

                      {/* Demo Role Switcher */}
                      <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600 fill-current" /> Switch Role Demo
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['customer', 'restaurant_owner', 'admin'] as UserRole[]).map(r => (
                            <button
                              key={r}
                              onClick={() => handleRoleChange(r)}
                              className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center transition-all ${
                                role === r
                                  ? 'bg-orange-600 text-white shadow-2xs'
                                  : 'bg-white hover:bg-amber-100 text-stone-700 border border-amber-200'
                              }`}
                            >
                              {r === 'restaurant_owner' ? 'Owner' : r}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <div className="space-y-0.5 pt-1 text-xs font-semibold text-stone-700">
                        {role === 'customer' && (
                          <>
                            <button
                              onClick={() => {
                                onNavigate('/profile');
                                setProfileDropdownOpen(false);
                              }}
                              className="w-full p-2 rounded-lg hover:bg-stone-100 text-left flex items-center gap-2.5"
                            >
                              <UserIcon className="w-4 h-4 text-stone-400" />
                              <span>My Profile</span>
                            </button>
                            <button
                              onClick={() => {
                                onNavigate('/orders');
                                setProfileDropdownOpen(false);
                              }}
                              className="w-full p-2 rounded-lg hover:bg-stone-100 text-left flex items-center gap-2.5"
                            >
                              <OrderIcon className="w-4 h-4 text-stone-400" />
                              <span>My Orders</span>
                            </button>
                            <button
                              onClick={() => {
                                onNavigate('/favorites');
                                setProfileDropdownOpen(false);
                              }}
                              className="w-full p-2 rounded-lg hover:bg-stone-100 text-left flex items-center gap-2.5"
                            >
                              <Bookmark className="w-4 h-4 text-stone-400" />
                              <span>Saved Favorites</span>
                            </button>
                          </>
                        )}

                        {role === 'restaurant_owner' && (
                          <button
                            onClick={() => {
                              onNavigate('/restaurant-dashboard');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full p-2 rounded-lg bg-orange-50 text-orange-700 text-left flex items-center gap-2.5 font-bold"
                          >
                            <ChefHat className="w-4 h-4 text-orange-600" />
                            <span>Restaurant Dashboard</span>
                          </button>
                        )}

                        {role === 'admin' && (
                          <button
                            onClick={() => {
                              onNavigate('/admin');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full p-2 rounded-lg bg-purple-50 text-purple-700 text-left flex items-center gap-2.5 font-bold"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>Admin Portal</span>
                          </button>
                        )}

                        <div className="pt-1 border-t border-stone-100">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full p-2 rounded-lg hover:bg-rose-50 text-rose-600 text-left flex items-center gap-2.5 font-bold"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 xl:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <button
            type="button"
            onClick={() => {
              onOpenLocation();
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-between text-xs font-semibold"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="truncate">{currentLocation}</span>
            </div>
            <span className="text-orange-600 font-bold">Change</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-left text-xs font-bold flex items-center justify-between ${
                  currentPath === link.path
                    ? 'bg-orange-50 text-orange-600'
                    : 'bg-stone-50 text-stone-800'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-orange-600 text-white text-[9px]">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">Quick Role Switch</span>
            <div className="flex gap-1.5">
              {(['customer', 'restaurant_owner', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    handleRoleChange(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    role === r
                      ? 'bg-orange-600 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {r === 'restaurant_owner' ? 'Owner' : r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
