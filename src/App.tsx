import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { LocationSelectorModal } from './components/modals/LocationSelectorModal';
import { AuthModal } from './components/modals/AuthModal';
import { RestaurantConflictModal } from './components/modals/RestaurantConflictModal';

import { HomePage } from './pages/HomePage';
import { RestaurantListingPage } from './pages/RestaurantListingPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { OffersPage } from './pages/OffersPage';
import { PremiumPage } from './pages/PremiumPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { RestaurantDashboardPage } from './pages/RestaurantDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentLocation, setCurrentLocation] = useState<string>('Indiranagar, Bengaluru');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', path);
    } catch {
      // ignore
    }
  };

  // Listen to browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut ⌘K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper route resolver
  const renderCurrentPage = () => {
    // 1. Restaurant detail page: /restaurant/:id
    if (currentPath.startsWith('/restaurant/')) {
      const restaurantId = currentPath.replace('/restaurant/', '').split('?')[0];
      return (
        <RestaurantDetailPage
          restaurantId={restaurantId}
          onNavigate={navigate}
        />
      );
    }

    // 2. Order live tracking page: /order-tracking/:id
    if (currentPath.startsWith('/order-tracking/')) {
      const orderId = currentPath.replace('/order-tracking/', '').split('?')[0];
      return (
        <OrderTrackingPage
          orderId={orderId}
          onNavigate={navigate}
        />
      );
    }

    // 3. Restaurants listing: /restaurants or /restaurants?category=...
    if (currentPath.startsWith('/restaurants')) {
      let initialCat: string | undefined = undefined;
      if (currentPath.includes('category=')) {
        const parts = currentPath.split('category=');
        if (parts[1]) initialCat = decodeURIComponent(parts[1].split('&')[0]);
      }
      return (
        <RestaurantListingPage
          key={initialCat || 'all'}
          initialCategory={initialCat}
          onNavigate={navigate}
        />
      );
    }

    // 4. Other dedicated pages
    switch (currentPath) {
      case '/offers':
        return <OffersPage onNavigate={navigate} />;
      case '/premium':
        return <PremiumPage onNavigate={navigate} />;
      case '/categories':
        return <CategoriesPage onNavigate={navigate} />;
      case '/checkout':
        return (
          <CheckoutPage
            onNavigate={navigate}
            onOrderPlaced={(orderId) => navigate(`/order-tracking/${orderId}`)}
          />
        );
      case '/orders':
        return <OrdersPage onNavigate={navigate} />;
      case '/favorites':
        return <FavoritesPage onNavigate={navigate} />;
      case '/profile':
        return <UserProfilePage onNavigate={navigate} />;
      case '/restaurant-dashboard':
        return <RestaurantDashboardPage onNavigate={navigate} />;
      case '/admin':
        return <AdminDashboardPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigate}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenLocation={() => setIsLocationOpen(true)}
            currentLocation={currentLocation}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-stone-900 selection:bg-orange-500 selection:text-white font-sans antialiased">
      {/* Global Navigation Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenAuth={(mode = 'login') => setAuthModalConfig({ isOpen: true, mode })}
        currentLocation={currentLocation}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => navigate('/checkout')}
        onNavigateToRestaurants={() => navigate('/restaurants')}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRestaurant={(id) => navigate(`/restaurant/${id}`)}
        onSelectCategory={(slug) => navigate(`/restaurants?category=${slug}`)}
      />

      {/* Location Picker Modal */}
      <LocationSelectorModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ isOpen: false, mode: 'login' })}
      />

      {/* Restaurant Cart Conflict Modal */}
      <RestaurantConflictModal />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
