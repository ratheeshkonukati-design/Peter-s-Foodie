import React from 'react';
import { Sparkles, Percent, Tag, ShieldCheck, Gift } from 'lucide-react';
import { StorageService } from '../services/storage';
import { OfferCard } from '../components/cards/OfferCard';

interface OffersPageProps {
  onNavigate: (path: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate }) => {
  const offers = StorageService.getOffers();
  const coupons = StorageService.getCoupons();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 font-extrabold text-xs tracking-wider uppercase">
          <Percent className="w-3.5 h-3.5 text-orange-600" />
          <span>EXCLUSIVE DEALS & DISCOUNTS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Peter's Foody Offers & Coupons
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Save big on every meal with verified promotional coupons, free delivery vouchers, and partner bank offers.
        </p>
      </div>

      {/* Featured Offers Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
          <span>Trending Offers</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map(offer => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onOrderNow={() => onNavigate('/restaurants')}
            />
          ))}
        </div>
      </div>

      {/* Available Coupon Codes Table / Grid */}
      <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-600" />
              <span>All Active Coupon Codes</span>
            </h3>
            <p className="text-xs text-stone-500">Apply these at checkout or in your cart</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            {coupons.length} Active Vouchers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map(coupon => (
            <div
              key={coupon.id}
              className="p-4 rounded-2xl bg-white border border-dashed border-stone-300 hover:border-orange-500 transition-all space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-base text-orange-600 tracking-wider">
                  {coupon.code}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-bold text-[10px]">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-snug">{coupon.description}</p>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 flex justify-between font-medium">
                <span>Min Order: ₹{coupon.minOrderAmount}</span>
                <span>Max: ₹{coupon.maxDiscount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bank & Payment Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
            💳
          </div>
          <h4 className="font-bold text-sm text-stone-900">HDFC & ICICI Bank Cards</h4>
          <p className="text-xs text-stone-500">Get 10% instant cashback up to ₹150 on orders above ₹799 on weekends.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <h4 className="font-bold text-sm text-stone-900">UPI Instant Cashback</h4>
          <p className="text-xs text-stone-500">Pay using Google Pay or PhonePe to get scratch cards with up to ₹100 cash rewards.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
            🎁
          </div>
          <h4 className="font-bold text-sm text-stone-900">Birthday & Anniversary Treats</h4>
          <p className="text-xs text-stone-500">Registered members receive a complimentary gourmet dessert coupon on their special day.</p>
        </div>
      </div>
    </div>
  );
};
