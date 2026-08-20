import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { RestaurantCard } from '../components/cards/RestaurantCard';

interface RestaurantListingPageProps {
  onNavigate: (path: string) => void;
  initialCategory?: string;
}

export const RestaurantListingPage: React.FC<RestaurantListingPageProps> = ({
  onNavigate,
  initialCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [minRating, setMinRating] = useState<number>(0);
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [hasOffersOnly, setHasOffersOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60);
  const [priceTier, setPriceTier] = useState<'all' | 'budget' | 'mid' | 'luxury'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'delivery'>('recommended');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const restaurants = StorageService.getRestaurants().filter(r => r.status === 'approved');
  const categories = StorageService.getCategories();

  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter(r => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchCuisine = r.cuisine.some(c => c.toLowerCase().includes(q));
          const matchDesc = r.description.toLowerCase().includes(q);
          if (!matchName && !matchCuisine && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== 'all') {
          const cat = categories.find(c => c.slug === selectedCategory);
          const targetName = cat ? cat.name.toLowerCase() : selectedCategory.toLowerCase();
          const matchCat = r.cuisine.some(c => c.toLowerCase().includes(targetName) || targetName.includes(c.toLowerCase()));
          if (!matchCat) return false;
        }

        // Rating
        if (minRating > 0 && r.rating < minRating) return false;

        // Pure Veg
        if (pureVegOnly && !r.isPureVeg) return false;

        // Offers
        if (hasOffersOnly && !r.featuredOffer) return false;

        // Premium
        if (premiumOnly && !r.isPremium) return false;

        // Max Delivery Time
        const deliveryMins = parseInt(r.deliveryTime) || 30;
        if (deliveryMins > maxDeliveryTime) return false;

        // Price Tier
        if (priceTier === 'budget' && r.priceForTwo > 350) return false;
        if (priceTier === 'mid' && (r.priceForTwo <= 350 || r.priceForTwo > 600)) return false;
        if (priceTier === 'luxury' && r.priceForTwo <= 600) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.priceForTwo - b.priceForTwo;
        if (sortBy === 'price_desc') return b.priceForTwo - a.priceForTwo;
        if (sortBy === 'delivery') {
          return (parseInt(a.deliveryTime) || 30) - (parseInt(b.deliveryTime) || 30);
        }
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    restaurants,
    categories,
    searchQuery,
    selectedCategory,
    minRating,
    pureVegOnly,
    hasOffersOnly,
    premiumOnly,
    maxDeliveryTime,
    priceTier,
    sortBy,
  ]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (pureVegOnly ? 1 : 0) +
    (hasOffersOnly ? 1 : 0) +
    (premiumOnly ? 1 : 0) +
    (maxDeliveryTime < 60 ? 1 : 0) +
    (priceTier !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinRating(0);
    setPureVegOnly(false);
    setHasOffersOnly(false);
    setPremiumOnly(false);
    setMaxDeliveryTime(60);
    setPriceTier('all');
    setSortBy('recommended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            DISCOVER CUISINES & DINING
          </span>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Explore Restaurants
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Showing {filteredRestaurants.length} top dining destinations in your city
          </p>
        </div>

        {/* Search input in page */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter restaurants by name, cuisine..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          All Cuisines
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.slug
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-orange-50 text-stone-700'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
        {/* Toggle Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pure Veg Toggle */}
          <button
            type="button"
            onClick={() => setPureVegOnly(!pureVegOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              pureVegOnly
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-500'
            }`}
          >
            🥦 Pure Veg
          </button>

          {/* 4.5+ Rating Toggle */}
          <button
            type="button"
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              minRating === 4.5
                ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:border-amber-400'
            }`}
          >
            ★ 4.5+ Rating
          </button>

          {/* Offers Toggle */}
          <button
            type="button"
            onClick={() => setHasOffersOnly(!hasOffersOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              hasOffersOnly
                ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:border-orange-400'
            }`}
          >
            🏷️ Has Offers
          </button>

          {/* Premium Toggle */}
          <button
            type="button"
            onClick={() => setPremiumOnly(!premiumOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
              premiumOnly
                ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                : 'bg-white border-stone-200 text-stone-700 hover:border-purple-400'
            }`}
          >
            <Sparkles className="w-3 h-3 fill-current" />
            <span>👑 Premium</span>
          </button>

          {/* Filter Drawer button on mobile */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
            <span>More Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Top Rated (Highest)</option>
            <option value="delivery">Fastest Delivery</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-stone-500">Active Filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs font-semibold">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </span>
          )}
          {pureVegOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
              Pure Veg
              <X className="w-3 h-3 cursor-pointer" onClick={() => setPureVegOnly(false)} />
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold">
              ★ {minRating}+
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
            </span>
          )}
          {premiumOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 text-xs font-semibold">
              👑 Premium
              <X className="w-3 h-3 cursor-pointer" onClick={() => setPremiumOnly(false)} />
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-600 hover:underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-3xl">
            🍽️
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">No restaurants match your filters</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your price range, delivery speed, or cuisine filters to see more results.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => onNavigate(`/restaurant/${restaurant.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
