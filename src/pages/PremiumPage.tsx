import React from 'react';
import { Sparkles, Award, ShieldCheck, Clock, ArrowRight, Star } from 'lucide-react';
import { StorageService } from '../services/storage';
import { FoodCard } from '../components/cards/FoodCard';

interface PremiumPageProps {
  onNavigate: (path: string) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const premiumDishes = StorageService.getMenuItems().filter(m => m.isPremium && m.isAvailable);
  const premiumRestaurants = StorageService.getRestaurants().filter(r => r.isPremium && r.status === 'approved');

  return (
    <div className="space-y-16 pb-24">
      {/* Luxury Hero Banner */}
      <section className="relative bg-stone-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800 overflow-hidden">
        {/* Background glow and subtle luxury patterns */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 font-black text-xs tracking-widest uppercase shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
            <span>THE GOLD STANDARD OF DINING</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            👑 PETER'S <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">PREMIUM</span>
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Heirloom recipes, imported black truffles, artisanal slow fermentations, and prime heritage meats prepared by master culinary craftsmen.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs font-bold text-stone-400">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Master Chef Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>VIP Insulated Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Priority Fleet Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dishes Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              RESERVE COLLECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Curated Premium Dishes
            </h2>
          </div>
          <span className="text-xs font-extrabold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
            {premiumDishes.length} Masterpieces
          </span>
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
      </section>

      {/* Premium Partner Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            ICONIC KITCHENS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Peter's Premium Partner Restaurants
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {premiumRestaurants.map(restaurant => (
            <div
              key={restaurant.id}
              onClick={() => onNavigate(`/restaurant/${restaurant.id}`)}
              className="p-6 rounded-3xl bg-stone-900 text-white border border-stone-800 hover:border-amber-400 shadow-xl transition-all flex flex-col sm:flex-row items-center gap-6 cursor-pointer group"
            >
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-stone-700 group-hover:scale-105 transition-transform"
              />
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                    {restaurant.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-bold text-[10px]">
                    ★ {restaurant.rating}
                  </span>
                </div>
                <p className="text-xs text-stone-400 line-clamp-2">{restaurant.description}</p>
                <div className="text-xs text-stone-300 font-semibold flex items-center justify-center sm:justify-start gap-3">
                  <span>{restaurant.deliveryTime}</span>
                  <span>•</span>
                  <span>₹{restaurant.priceForTwo} for two</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
