import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { VegBadge } from '../common/RatingStars';
import { StorageService } from '../../services/storage';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToRestaurants: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onNavigateToRestaurants,
}) => {
  const {
    items,
    restaurant,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    packagingFee,
    discount,
    total,
    appliedCoupon,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const coupons = StorageService.getCoupons().filter(c => c.active);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = applyCoupon(couponInput.trim());
      if (ok) setCouponInput('');
    }
  };

  const handleProceed = () => {
    closeCartDrawer();
    onNavigateToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900">Your Food Cart</h3>
                <p className="text-xs text-stone-500">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto text-4xl">
                  🍽️
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-stone-800">Your cart is empty</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Explore our top restaurants and add your favorite gourmet dishes to start an order.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    onNavigateToRestaurants();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <>
                {/* Restaurant Card Header */}
                {restaurant && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={restaurant.logoUrl}
                        alt={restaurant.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{restaurant.name}</h4>
                        <p className="text-xs text-stone-500">{restaurant.address}, {restaurant.city}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold p-1 hover:bg-rose-50 rounded-lg"
                      title="Clear Cart"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3.5 divide-y divide-stone-100">
                  {items.map(item => (
                    <div key={item.cartItemId} className="pt-3.5 first:pt-0 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <VegBadge isVeg={item.menuItem.isVegetarian} size="sm" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm text-stone-900 line-clamp-1">
                            {item.menuItem.name}
                          </h5>
                          <p className="text-xs font-extrabold text-stone-700">₹{item.unitPrice}</p>

                          {/* Selected Addons */}
                          {item.selectedAddons.length > 0 && (
                            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                              + {item.selectedAddons.map(a => `${a.name} (₹${a.price})`).join(', ')}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-[10px] italic text-amber-700 mt-0.5">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-0.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 text-stone-600 hover:bg-white rounded"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 text-stone-600 hover:bg-white rounded"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free Delivery Goal Bar */}
                {subtotal < 499 ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>Add ₹{499 - subtotal} more for FREE delivery</span>
                      <span>₹{subtotal}/₹499</span>
                    </div>
                    <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 fill-current" />
                    <span>Yay! You've unlocked FREE Delivery on this order 🎉</span>
                  </div>
                )}

                {/* Coupons Section */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-orange-600" />
                    <span>Apply Coupon</span>
                  </span>

                  {appliedCoupon ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900">
                            '{appliedCoupon.code}' Applied!
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Saved ₹{discount} on this order
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. FIRST50, WEEKEND20"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Available coupon chips */}
                  {!appliedCoupon && coupons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {coupons.slice(0, 3).map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => applyCoupon(c.code)}
                          className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-mono font-bold text-[11px] transition-colors"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs text-stone-600">
                  <h5 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-1">
                    Bill Details
                  </h5>
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-semibold text-stone-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="font-semibold text-stone-900">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Restaurant Packaging Charges</span>
                    <span className="font-semibold text-stone-900">₹{packagingFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Government Taxes (GST 5%)</span>
                    <span className="font-semibold text-stone-900">₹{tax}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
                    <span>To Pay</span>
                    <span className="text-orange-600">₹{total}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Proceed Button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-100 bg-white space-y-3">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-3.5 px-5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-xs opacity-90 block text-left">Total Amount</span>
                  <span className="text-base font-black">₹{total}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
