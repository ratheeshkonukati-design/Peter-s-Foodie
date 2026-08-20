import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { AddonOption, MenuItem } from '../../types';
import { VegBadge, RatingStars } from '../common/RatingStars';
import { useCart } from '../../context/CartContext';

interface FoodCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FoodCustomizerModal: React.FC<FoodCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isOpen || !item) return null;

  const basePrice = item.discountPrice || item.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleAddon = (addon: AddonOption) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedAddons, specialInstructions);
    onClose();
    // Reset
    setQuantity(1);
    setSelectedAddons([]);
    setSpecialInstructions('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-stone-100 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 w-full bg-stone-100 flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VegBadge isVeg={item.isVegetarian} size="md" />
              {item.isPremium && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs">
                  <Sparkles className="w-3 h-3 fill-current" />
                  PREMIUM DISH
                </span>
              )}
            </div>
            <RatingStars rating={item.rating} count={item.reviewsCount} showBadge />
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title & Description */}
          <div>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="text-xl font-bold text-stone-900 leading-snug">{item.name}</h2>
              <div className="text-right flex-shrink-0">
                <span className="text-xl font-extrabold text-orange-600">₹{basePrice}</span>
                {item.discountPrice && (
                  <span className="text-xs text-stone-400 line-through ml-1.5 font-medium">
                    ₹{item.price}
                  </span>
                )}
              </div>
            </div>
            {item.restaurantName && (
              <p className="text-xs font-semibold text-amber-700 mb-2">By {item.restaurantName}</p>
            )}
            <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
          </div>

          {/* Spice & Prep Time */}
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {item.spicyLevel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Spice Level: {item.spicyLevel === 3 ? 'Extra Hot 🔥🔥🔥' : item.spicyLevel === 2 ? 'Medium Spicy 🔥🔥' : 'Mild'}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
              ⏱️ Prep Time: {item.preparationTime}
            </span>
          </div>

          {/* Allergens & Ingredients if present */}
          {((item.allergens && item.allergens.length > 0) || (item.ingredients && item.ingredients.length > 0)) && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
              {item.ingredients && item.ingredients.length > 0 && (
                <p className="text-stone-600">
                  <strong className="text-stone-800 font-semibold">Ingredients:</strong> {item.ingredients.join(', ')}
                </p>
              )}
              {item.allergens && item.allergens.length > 0 && (
                <p className="text-amber-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span><strong>Allergens:</strong> {item.allergens.join(', ')}</span>
                </p>
              )}
            </div>
          )}

          {/* Add-ons Section */}
          {item.customAddons && item.customAddons.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                Customize / Add Toppings
              </h3>
              <div className="space-y-2">
                {item.customAddons.map(addon => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-orange-600 border-orange-600 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-medium text-stone-800">{addon.name}</span>
                      </div>
                      <span className="text-sm font-bold text-stone-900">+₹{addon.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div>
            <label htmlFor="cooking-instructions" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Special Cooking Request (Optional)
            </label>
            <input
              id="cooking-instructions"
              type="text"
              placeholder="e.g. Less spicy, no cutlery, extra napkins..."
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              maxLength={120}
            />
          </div>
        </div>

        {/* Footer Actions: Quantity & Add Button */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center font-bold text-sm text-stone-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <span>Add to Cart</span>
            <span className="bg-orange-700/60 px-2.5 py-0.5 rounded-lg font-extrabold text-sm">
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
