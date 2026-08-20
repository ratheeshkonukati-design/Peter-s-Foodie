import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  ChefHat,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { RestaurantCard } from '../components/cards/RestaurantCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { OfferCard } from '../components/cards/OfferCard';
import { FoodCard } from '../components/cards/FoodCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenLocation: () => void;
  currentLocation: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenLocation,
  currentLocation,
}) => {
  const [restaurantFilter, setRestaurantFilter] = useState<'all' | 'veg' | 'top_rated' | 'fast'>('all');

  const restaurants = StorageService.getRestaurants().filter(r => r.status === 'approved');
  const categories = StorageService.getCategories().filter(c => c.active);
  const offers = StorageService.getOffers().filter(o => o.active);
  const premiumDishes = StorageService.getMenuItems().filter(m => m.isPremium && m.isAvailable).slice(0, 6);

  const filteredRestaurants = restaurants.filter(r => {
    if (restaurantFilter === 'veg') return r.isPureVeg;
    if (restaurantFilter === 'top_rated') return r.rating >= 4.7;
    if (restaurantFilter === 'fast') return parseInt(r.deliveryTime) <= 25;
    return true;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Background Image with dark luxury gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80"
            alt="Delicious food feast"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Brand Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>PETER'S FOODY • CRAFTED WITH LOVE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Delicious Food, <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Delivered to Your Door.
              </span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Discover the best local restaurants, authentic royal dum biryanis, wood-fired sourdough pizzas, and exclusive offers near you.
            </p>

            {/* Location Selector Pill & Search Bar */}
            <div className="p-2 sm:p-3 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl max-w-2xl space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
              {/* Location button */}
              <button
                type="button"
                onClick={onOpenLocation}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs font-semibold text-white flex items-center justify-between gap-2 transition-all flex-shrink-0"
              >
                <div className="flex items-center gap-2 truncate max-w-[170px]">
                  <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="truncate">{currentLocation}</span>
                </div>
                <span className="text-[10px] text-amber-400 uppercase font-bold">Change</span>
              </button>

              {/* Search input trigger */}
              <div
                onClick={onOpenSearch}
                className="flex-1 px-4 py-3 rounded-xl bg-white text-stone-700 hover:bg-stone-50 transition-all flex items-center justify-between cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-orange-600" />
                  <span className="text-xs sm:text-sm font-medium text-stone-500">
                    Search restaurants, food or cuisines...
                  </span>
                </div>
                <kbd className="hidden sm:inline text-[10px] font-mono bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/restaurants')}
                className="py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-102 transition-all flex items-center gap-2"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/offers')}
                className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <Percent className="w-4 h-4 text-amber-400" />
                <span>View Offers (50% OFF)</span>
              </button>
            </div>

            {/* Highlights metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-stone-300">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">500+</span>
                <p className="text-xs text-stone-400">Curated Dishes</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">25-30m</span>
                <p className="text-xs text-stone-400">Avg. Delivery</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white">4.9 ★</span>
                <p className="text-xs text-stone-400">Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Right Hero Floating Cards / Visual */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md">
              {/* Main hero image card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/5] relative">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                  alt="Hyderabadi Dum Biryani"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] tracking-wider uppercase">
                    👑 CHEF'S SIGNATURE
                  </span>
                  <h3 className="text-xl font-black">Royal Dum Biryani</h3>
                  <p className="text-xs text-stone-300">Slow cooked on charcoal with Kashmiri saffron & tender spices.</p>
                </div>
              </div>

              {/* Floating Floating card 1: Fast Delivery */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-3.5 shadow-2xl border border-stone-100 flex items-center gap-3 text-stone-900 animate-bounce duration-1000">
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Superfast Delivery</span>
                  <span className="text-[11px] text-stone-500">Under 30 minutes</span>
                </div>
              </div>

              {/* Floating card 2: Offer */}
              <div className="absolute -bottom-6 -right-6 bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 text-white flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-stone-950 font-black text-sm">
                  50%
                </div>
                <div>
                  <span className="text-xs font-bold block">Flat 50% OFF</span>
                  <span className="text-[10px] text-amber-400 font-mono">Use code: FIRST50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              EXPLORE WHAT YOU CRAVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Popular Food Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/categories')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View All ({categories.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Scrollable / Grid Category list */}
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 sm:overflow-visible">
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={() => onNavigate(`/restaurants?category=${cat.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* 3. OFFERS & DEALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5" /> EXCLUSIVE DISCOUNTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Handpicked Offers for You
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/offers')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>All Deals</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map(offer => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onOrderNow={() => onNavigate('/restaurants')}
            />
          ))}
        </div>
      </section>

      {/* 4. POPULAR RESTAURANTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              TOP RATED DINING
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Popular Restaurants Near You
            </h2>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: 'all' },
              { label: '🥦 Pure Veg', value: 'veg' },
              { label: '★ 4.7+ Top Rated', value: 'top_rated' },
              { label: '⚡ Fast Delivery (<25m)', value: 'fast' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setRestaurantFilter(f.value as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  restaurantFilter === f.value
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRestaurants.slice(0, 8).map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => onNavigate(`/restaurant/${restaurant.id}`)}
            />
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => onNavigate('/restaurants')}
            className="py-3 px-8 rounded-2xl bg-stone-100 hover:bg-orange-600 hover:text-white text-stone-800 font-bold text-xs shadow-xs transition-all inline-flex items-center gap-2 group"
          >
            <span>View All Restaurants ({restaurants.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 5. 👑 PETER'S PREMIUM FOOD SECTION */}
      <section className="bg-stone-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-800 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                CHEF CURATED EXCELLENCE
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                👑 PETER'S PREMIUM
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Exclusive dishes and heirloom recipes crafted by master culinary artists.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/premium')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Explore Peter's Premium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumDishes.map(dish => (
              <FoodCard
                key={dish.id}
                item={dish}
                showRestaurantName={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE PETER'S FOODY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-orange-50 via-amber-50/50 to-stone-50 rounded-3xl p-8 sm:p-12 border border-orange-200/60 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              THE PETER'S FOODY PROMISE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              Why Food Lovers Choose Peter's Foody
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              We connect you with authentic local culinary masters with guaranteed freshness, live tracking, and warm hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                🍲
              </div>
              <h4 className="font-bold text-base text-stone-900">100% Insulated Packaging</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Specialized triple-layer thermal containers keep tandoori breads crisp, biryanis piping hot, and gourmet gelatos frozen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                ⚡
              </div>
              <h4 className="font-bold text-base text-stone-900">Real-Time Kitchen Tracking</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Watch your order progress live from the chef's pan to the delivery partner's insulated backpack.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">
                💎
              </div>
              <h4 className="font-bold text-base text-stone-900">Chef Hygiene Standards</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Every restaurant partner is regularly audited with stringent 5-star cleanliness and food quality ratings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
