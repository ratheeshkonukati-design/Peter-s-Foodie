import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const RestaurantConflictModal: React.FC = () => {
  const { conflictData, resolveConflict, restaurant: currentRestaurant } = useCart();

  if (!conflictData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 space-y-5 animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-stone-900">Replace Cart Items?</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Your cart already contains delicious items from{' '}
            <strong className="text-stone-900">{currentRestaurant?.name || 'another restaurant'}</strong>.
            Ordering from <strong className="text-orange-600">{conflictData.newRestaurant.name}</strong> will
            reset your current cart.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => resolveConflict(false)}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
          >
            Keep Existing Cart
          </button>
          <button
            type="button"
            onClick={() => resolveConflict(true)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Start Fresh Order
          </button>
        </div>
      </div>
    </div>
  );
};
