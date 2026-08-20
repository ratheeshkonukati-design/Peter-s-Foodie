import React, { useState, useMemo } from 'react';
import {
  Heart,
  Search,
  Clock,
  MapPin,
  Sparkles,
  Share2,
  Phone,
  LayoutGrid,
  List,
  MessageSquarePlus,
  CheckCircle2,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { FoodCard } from '../components/cards/FoodCard';
import { RatingStars, VegBadge } from '../components/common/RatingStars';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ReviewModal } from '../components/modals/ReviewModal';

interface RestaurantDetailPageProps {
  restaurantId: string;
  onNavigate: (path: string) => void;
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({
  restaurantId,
  onNavigate,
}) => {
  const { isRestaurantFavorite, toggleRestaurantFavorite } = useFavorites();
  const { items, total, openCartDrawer, restaurant: cartRestaurant } = useCart();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('all');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const restaurant = useMemo(() => StorageService.getRestaurantById(restaurantId), [restaurantId]);
  const menuItems = useMemo(() => StorageService.getMenuItemsByRestaurant(restaurantId), [restaurantId]);
  const reviews = useMemo(() => StorageService.getReviewsByRestaurant(restaurantId), [restaurantId]);

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Restaurant Not Found</h2>
        <p className="text-sm text-stone-500">The restaurant you are looking for does not exist or has been relocated.</p>
        <button
          onClick={() => onNavigate('/restaurants')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Browse All Restaurants
        </button>
      </div>
    );
  }

  const isFav = isRestaurantFavorite(restaurant.id);

  // Group menu by categories
  const menuCategories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map(m => m.categoryName)));
    return ['all', ...cats];
  }, [menuItems]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      if (vegOnly && !item.isVegetarian) return false;
      if (selectedMenuCategory !== 'all' && item.categoryName !== selectedMenuCategory) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [menuItems, vegOnly, selectedMenuCategory, menuSearch]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success(`Restaurant link copied to clipboard!`);
  };

  const isCartFromHere = cartRestaurant?.id === restaurant.id && items.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-28">
      {/* 1. RESTAURANT HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-xl">
        {/* Cover image */}
        <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/30" />

          {/* Action buttons top right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-stone-950 hover:bg-white shadow-md transition-all"
              aria-label="Share restaurant"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleRestaurantFavorite(restaurant.id)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-600 hover:bg-white shadow-md transition-all"
              aria-label="Favorite restaurant"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Info header overlapping cover */}
        <div className="p-6 sm:p-8 relative -mt-16 sm:-mt-20 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 text-white">
          <div className="flex items-end gap-4 sm:gap-6">
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white p-1 shadow-2xl border-2 border-white/20 flex-shrink-0">
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{restaurant.name}</h1>
                {restaurant.isPureVeg && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                    🥦 Pure Veg
                  </span>
                )}
                {restaurant.isPremium && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold uppercase flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-current" /> Premium
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-300 line-clamp-1">
                {restaurant.cuisine.join(' • ')}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <RatingStars rating={restaurant.rating} count={restaurant.reviewsCount} showBadge />
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <span>•</span>
                <span>₹{restaurant.priceForTwo} for two</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span className="truncate">{restaurant.address}, {restaurant.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Offer Badge */}
          {restaurant.featuredOffer && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-600/90 to-amber-600/90 border border-orange-400/40 text-white text-xs font-bold flex items-center gap-2 shadow-lg flex-shrink-0">
              <span className="text-lg">🏷️</span>
              <div>
                <span className="block font-black uppercase text-[11px] tracking-wide">SPECIAL OFFER</span>
                <span className="text-white/95">{restaurant.featuredOffer}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. SUB-NAV TABS */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'menu'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Menu ({menuItems.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'reviews'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Reviews ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'info'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Restaurant Info
        </button>
      </div>

      {/* 3. MENU TAB CONTENT */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Menu Search, Veg Toggle & Category filter */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search within this menu..."
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Veg toggle & Layout switch */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  vegOnly
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-500'
                }`}
              >
                <VegBadge isVeg={true} size="sm" />
                <span>Veg Only</span>
              </button>

              {/* Grid / List switch */}
              <div className="flex bg-white border border-stone-200 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    layout === 'grid' ? 'bg-orange-600 text-white' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Grid layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    layout === 'list' ? 'bg-orange-600 text-white' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="List layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {menuCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedMenuCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all capitalize ${
                  selectedMenuCategory === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-orange-50 text-stone-700'
                }`}
              >
                {cat === 'all' ? 'Full Menu' : cat}
              </button>
            ))}
          </div>

          {/* Dishes List */}
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-2">
              <p className="font-bold text-stone-800">No items match your search or filter</p>
              <p className="text-xs text-stone-500">Try resetting the search or veg filter</p>
            </div>
          ) : (
            <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
              {filteredMenuItems.map(dish => (
                <FoodCard
                  key={dish.id}
                  item={dish}
                  layout={layout}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. REVIEWS TAB CONTENT */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Rating overview card */}
          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div>
                <span className="text-4xl font-black text-stone-900">{restaurant.rating}</span>
                <div className="flex justify-center md:justify-start pt-1">
                  <RatingStars rating={restaurant.rating} size="md" />
                </div>
                <p className="text-xs text-stone-500 mt-1">Based on {restaurant.reviewsCount} customer reviews</p>
              </div>

              <div className="hidden sm:block border-l border-stone-200 pl-6 space-y-1 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Verified Customer Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Regular Quality & Hygiene Audits</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="py-3 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Customer Review Cards */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-10">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{rev.userName}</h4>
                        <p className="text-[11px] text-stone-400">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={rev.rating} size="sm" showBadge />
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>

                  {(rev.foodRating || rev.deliveryRating) && (
                    <div className="flex gap-4 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                      {rev.foodRating && <span>Food: ★ {rev.foodRating}/5</span>}
                      {rev.deliveryRating && <span>Delivery: ★ {rev.deliveryRating}/5</span>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. RESTAURANT INFO TAB */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-stone-900">About {restaurant.name}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{restaurant.description}</p>

            <div className="space-y-3 pt-4 border-t border-stone-100 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Address</span>
                  <span className="text-stone-600">{restaurant.address}, {restaurant.city}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Opening Hours</span>
                  <span className="text-stone-600">11:00 AM – 11:30 PM (Mon - Sun)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Restaurant Contact</span>
                  <span className="text-stone-600">+91 (80) 2345-6789</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">Safety & Quality Highlights</h3>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Daily kitchen temperature & sanitization logs maintained</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>FSSAI Certified Commercial Grade Kitchen</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tamper-evident food safety packaging seals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Contactless delivery support</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Floating Bottom Cart Bar for this restaurant */}
      {isCartFromHere && (
        <div className="fixed bottom-4 inset-x-4 max-w-2xl mx-auto z-40">
          <div
            onClick={openCartDrawer}
            className="p-3.5 sm:p-4 rounded-2xl bg-stone-950 text-white shadow-2xl border border-stone-700 flex items-center justify-between cursor-pointer hover:bg-black transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'} IN CART
                  </span>
                </div>
                <span className="text-base font-black text-white">₹{total}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        orderId={`ord-rev-${Date.now()}`}
      />
    </div>
  );
};
