import React, { useState } from 'react';
import { Heart, Plus, Minus, Sparkles, Flame } from 'lucide-react';
import { MenuItem } from '../../types';
import { VegBadge, RatingStars } from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { FoodCustomizerModal } from '../modals/FoodCustomizerModal';

interface FoodCardProps {
  item: MenuItem;
  layout?: 'grid' | 'list';
  showRestaurantName?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  layout = 'grid',
  showRestaurantName = false,
}) => {
  const { items, addToCart, updateQuantity } = useCart();
  const { isFoodFavorite, toggleFoodFavorite } = useFavorites();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const isFav = isFoodFavorite(item.id);

  // Check if item exists in cart (matching without add-ons for simple count)
  const cartItem = items.find(ci => ci.menuItem.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const basePrice = item.discountPrice || item.price;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.customAddons && item.customAddons.length > 0) {
      setIsCustomizerOpen(true);
    } else {
      addToCart(item, 1, []);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    } else {
      handleAddClick(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    }
  };

  if (layout === 'list') {
    return (
      <>
        <div
          id={`food-card-${item.id}`}
          onClick={() => setIsCustomizerOpen(true)}
          className="group p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer"
        >
          {/* Text details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <VegBadge isVeg={item.isVegetarian} size="sm" />
              {item.isBestSeller && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                  ⭐ Bestseller
                </span>
              )}
              {item.isPremium && (
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[10px] uppercase tracking-wider flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 fill-current" /> Premium
                </span>
              )}
            </div>

            <h4 className="font-bold text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {item.name}
            </h4>

            {showRestaurantName && item.restaurantName && (
              <p className="text-xs font-semibold text-amber-700 mb-1">{item.restaurantName}</p>
            )}

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="font-extrabold text-stone-900 text-sm">₹{basePrice}</span>
              {item.discountPrice && (
                <span className="text-xs text-stone-400 line-through">₹{item.price}</span>
              )}
            </div>

            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Image & Action */}
          <div className="relative flex flex-col items-center flex-shrink-0">
            <div className="w-28 h-24 rounded-xl overflow-hidden bg-stone-100 relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFoodFavorite(item.id);
                }}
                className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-rose-500 transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Add Button overlapping image bottom */}
            <div className="-mt-3 z-10">
              {quantityInCart > 0 ? (
                <div className="flex items-center bg-orange-600 text-white rounded-lg shadow-md overflow-hidden text-xs font-bold">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-2 py-1.5 hover:bg-orange-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 min-w-[20px] text-center">{quantityInCart}</span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="px-2 py-1.5 hover:bg-orange-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="px-4 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-orange-500 hover:bg-orange-50 text-orange-600 font-extrabold text-xs shadow-md transition-all flex items-center gap-1 uppercase tracking-wider"
                >
                  ADD <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {item.customAddons && item.customAddons.length > 0 && (
              <span className="text-[10px] text-stone-400 font-medium mt-1">Customizable</span>
            )}
          </div>
        </div>

        <FoodCustomizerModal
          item={item}
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
        />
      </>
    );
  }

  // Grid layout
  return (
    <>
      <div
        id={`food-card-${item.id}`}
        onClick={() => setIsCustomizerOpen(true)}
        className="group relative bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <VegBadge isVeg={item.isVegetarian} size="md" />
            {item.isBestSeller && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-bold text-[10px] tracking-wide shadow-sm">
                BESTSELLER
              </span>
            )}
            {item.isPremium && (
              <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-bold text-[10px] tracking-wide shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-current" /> PREMIUM
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFoodFavorite(item.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-600 hover:bg-white transition-all shadow-md z-10"
            aria-label="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Rating tag bottom left */}
          <div className="absolute bottom-2.5 left-3 z-10">
            <RatingStars rating={item.rating} count={item.reviewsCount} showBadge />
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                {item.name}
              </h3>
            </div>

            {showRestaurantName && item.restaurantName && (
              <p className="text-xs font-semibold text-amber-700 mb-1.5">
                From {item.restaurantName}
              </p>
            )}

            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-2">
              {item.description}
            </p>

            {item.spicyLevel && (
              <div className="flex items-center gap-1 text-[11px] text-orange-600 font-medium">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>{item.spicyLevel === 3 ? 'Extra Spicy' : item.spicyLevel === 2 ? 'Medium Spicy' : 'Mild'}</span>
              </div>
            )}
          </div>

          {/* Price and Add to Cart */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900">₹{basePrice}</span>
              {item.discountPrice && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  ₹{item.price}
                </span>
              )}
            </div>

            {quantityInCart > 0 ? (
              <div className="flex items-center bg-orange-600 text-white rounded-xl shadow-md overflow-hidden text-xs font-bold">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="px-2.5 py-1.5 hover:bg-orange-700 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 min-w-[20px] text-center">{quantityInCart}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="px-2.5 py-1.5 hover:bg-orange-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddClick}
                className="px-4 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-600 font-bold text-xs border border-orange-200 hover:border-orange-600 shadow-xs transition-all flex items-center gap-1 uppercase tracking-wider"
              >
                ADD <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <FoodCustomizerModal
        item={item}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </>
  );
};
