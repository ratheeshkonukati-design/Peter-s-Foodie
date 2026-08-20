import React, { useState } from 'react';
import { Search, ArrowRight, Utensils } from 'lucide-react';
import { StorageService } from '../services/storage';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const categories = StorageService.getCategories();
  const menuItems = StorageService.getMenuItems();

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            CULINARY COLLECTIONS
          </span>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse through our wide spectrum of authentic cuisines and dining cravings
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
          />
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories.map(cat => {
          const count = menuItems.filter(
            m => m.categoryName.toLowerCase() === cat.name.toLowerCase() || m.categoryName.toLowerCase() === cat.slug.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/restaurants?category=${cat.slug}`)}
              className="group relative rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-xl font-black">{cat.name}</h3>
                  <span className="text-[11px] font-semibold text-white/80">
                    {count > 0 ? `${count}+ Special Dishes` : 'Explore Curated Menu'}
                  </span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-4 flex items-center justify-between bg-stone-50/50 group-hover:bg-orange-50/50 transition-colors">
                <span className="text-xs font-bold text-stone-600 group-hover:text-orange-600 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Discover Restaurants</span>
                </span>
                <div className="w-7 h-7 rounded-full bg-white shadow-xs flex items-center justify-center text-stone-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
