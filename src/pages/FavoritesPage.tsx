import React, { useState } from 'react';
import { Heart, Store, Utensils, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { StorageService } from '../services/storage';
import { RestaurantCard } from '../components/cards/RestaurantCard';
import { FoodCard } from '../components/cards/FoodCard';

interface FavoritesPageProps {
  onNavigate: (path: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
  const { favoriteRestaurants, favoriteFoods } = useFavorites();
  const [tab, setTab] = useState<'restaurants' | 'foods'>('restaurants');

  const allRestaurants = StorageService.getRestaurants();
  const allMenuItems = StorageService.getMenuItems();

  const savedRestaurants = allRestaurants.filter(r => favoriteRestaurants.includes(r.id));
  const savedFoods = allMenuItems.filter(f => favoriteFoods.includes(f.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs tracking-wider uppercase mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>SAVED FAVORITES</span>
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Your Bookmarked Cravings
          </h1>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('restaurants')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              tab === 'restaurants'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Restaurants ({savedRestaurants.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('foods')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              tab === 'foods'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dishes ({savedFoods.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {tab === 'restaurants' ? (
        savedRestaurants.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-3xl">
              ❤️
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">No Saved Restaurants</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Tap the heart icon on any restaurant to save it to your bookmarks for fast access.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/restaurants')}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
            >
              Discover Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => onNavigate(`/restaurant/${restaurant.id}`)}
              />
            ))}
          </div>
        )
      ) : (
        savedFoods.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-3xl">
              🍲
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">No Saved Dishes</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Bookmark specific biryanis, pizzas, burgers, or desserts to easily add them to your cart later.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/restaurants')}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
            >
              Browse Gourmet Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedFoods.map(dish => (
              <FoodCard
                key={dish.id}
                item={dish}
                showRestaurantName={true}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
