import React, { useState, useMemo } from 'react';
import { Search, X, Utensils, Store, Tag, ArrowRight } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { VegBadge } from '../common/RatingStars';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurant: (id: string) => void;
  onSelectCategory: (slug: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectRestaurant,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');

  const restaurants = useMemo(() => StorageService.getRestaurants(), []);
  const menuItems = useMemo(() => StorageService.getMenuItems(), []);
  const categories = useMemo(() => StorageService.getCategories(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        restaurants: [],
        dishes: [],
        categories: [],
      };
    }

    const matchedRestaurants = restaurants.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q)) ||
        r.description.toLowerCase().includes(q)
    );

    const matchedDishes = menuItems.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.categoryName.toLowerCase().includes(q)
    );

    const matchedCategories = categories.filter(
      c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );

    return {
      restaurants: matchedRestaurants,
      dishes: matchedDishes,
      categories: matchedCategories,
    };
  }, [query, restaurants, menuItems, categories]);

  if (!isOpen) return null;

  const totalResults =
    results.restaurants.length + results.dishes.length + results.categories.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search delicious biryanis, pizzas, restaurants, cuisines..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 font-medium text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 px-2 py-1 rounded-lg hover:bg-stone-200/50"
          >
            ESC
          </button>
        </div>

        {/* Search Body Results */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {query.trim() === '' ? (
            /* Quick Trends when empty */
            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-2.5">
                  Popular Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-2.5">
                  Trending Dishes
                </h4>
                <div className="space-y-2">
                  {menuItems.slice(0, 4).map(dish => (
                    <button
                      key={dish.id}
                      onClick={() => {
                        onSelectRestaurant(dish.restaurantId);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-stone-800 group-hover:text-orange-600">
                            {dish.name}
                          </p>
                          <p className="text-xs text-stone-400">{dish.restaurantName}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-stone-700">
                        ₹{dish.discountPrice || dish.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : totalResults === 0 ? (
            /* No Results */
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-2xl">
                🍽️
              </div>
              <h4 className="text-base font-bold text-stone-900">No matching culinary treasures found</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try searching for "Biryani", "Pizza", "Burger", "Spice Paradise", or explore our top categories.
              </p>
            </div>
          ) : (
            /* Result Lists */
            <div className="space-y-6">
              {/* Matched Restaurants */}
              {results.restaurants.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-orange-600" />
                    <span>Restaurants ({results.restaurants.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.restaurants.map(rest => (
                      <button
                        key={rest.id}
                        onClick={() => {
                          onSelectRestaurant(rest.id);
                          onClose();
                        }}
                        className="w-full p-3 rounded-2xl border border-stone-200/80 hover:border-orange-500 hover:bg-orange-50/40 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={rest.logoUrl}
                            alt={rest.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <h5 className="font-bold text-sm text-stone-900 group-hover:text-orange-600">
                              {rest.name}
                            </h5>
                            <p className="text-xs text-stone-500">{rest.cuisine.join(', ')}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-600">
                              <span className="font-bold text-emerald-700">★ {rest.rating}</span>
                              <span>•</span>
                              <span>{rest.deliveryTime}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Dishes */}
              {results.dishes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-orange-600" />
                    <span>Dishes & Delights ({results.dishes.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.dishes.map(dish => (
                      <button
                        key={dish.id}
                        onClick={() => {
                          onSelectRestaurant(dish.restaurantId);
                          onClose();
                        }}
                        className="w-full p-3 rounded-2xl border border-stone-200/80 hover:border-orange-500 hover:bg-orange-50/40 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <VegBadge isVeg={dish.isVegetarian} size="sm" />
                              <h5 className="font-bold text-sm text-stone-900 group-hover:text-orange-600">
                                {dish.name}
                              </h5>
                            </div>
                            <p className="text-xs text-amber-700 font-semibold">{dish.restaurantName}</p>
                            <p className="text-xs text-stone-400 line-clamp-1">{dish.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-sm text-stone-900">
                            ₹{dish.discountPrice || dish.price}
                          </span>
                          {dish.discountPrice && (
                            <span className="block text-[11px] text-stone-400 line-through">
                              ₹{dish.price}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Categories */}
              {results.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-orange-600" />
                    <span>Categories ({results.categories.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          onClose();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-600 hover:text-white text-xs font-bold text-orange-800 transition-all flex items-center gap-2"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
