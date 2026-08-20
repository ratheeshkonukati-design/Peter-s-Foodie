import React from 'react';
import { Heart, Clock, Bike, Sparkles, MapPin } from 'lucide-react';
import { Restaurant } from '../../types';
import { RatingStars, VegBadge } from '../common/RatingStars';
import { useFavorites } from '../../context/FavoritesContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const { isRestaurantFavorite, toggleRestaurantFavorite } = useFavorites();
  const isFav = isRestaurantFavorite(restaurant.id);

  return (
    <div
      onClick={onClick}
      id={`restaurant-card-${restaurant.id}`}
      className="group relative bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={restaurant.bannerUrl || restaurant.logoUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleRestaurantFavorite(restaurant.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md text-stone-700 hover:text-rose-600 hover:bg-white hover:scale-110 transition-all z-10"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {restaurant.isPremium && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-md tracking-wide">
              <Sparkles className="w-3 h-3 fill-current" />
              PREMIUM
            </span>
          )}
          {restaurant.isPureVeg && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-medium text-xs shadow-md">
              <VegBadge isVeg={true} size="sm" />
              Pure Veg
            </span>
          )}
        </div>

        {/* Featured Offer Banner on Image */}
        {restaurant.featuredOffer && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <span className="inline-block px-3 py-1 rounded-lg bg-orange-600/90 backdrop-blur-sm text-white font-semibold text-xs tracking-wide shadow-sm">
              🏷️ {restaurant.featuredOffer}
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4.5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-lg text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <RatingStars rating={restaurant.rating} count={restaurant.reviewCount} showBadge />
          </div>

          <p className="text-xs text-stone-500 font-medium line-clamp-1 mb-2">
            {restaurant.cuisine.join(' • ')}
          </p>

          <p className="text-xs text-stone-600 line-clamp-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span>{restaurant.address}, {restaurant.city}</span>
          </p>
        </div>

        {/* Footer Meta: Time, Fee, Price */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-1 text-stone-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{restaurant.deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1 text-stone-700">
            <Bike className="w-3.5 h-3.5 text-emerald-600" />
            <span>{restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`}</span>
          </div>

          <div className="text-stone-800 font-semibold">
            ₹{restaurant.priceForTwo} for two
          </div>
        </div>
      </div>
    </div>
  );
};
