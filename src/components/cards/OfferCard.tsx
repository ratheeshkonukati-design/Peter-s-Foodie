import React, { useState } from 'react';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Offer } from '../../types';
import { useToast } from '../../context/ToastContext';

interface OfferCardProps {
  offer: Offer;
  onOrderNow?: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onOrderNow }) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(offer.couponCode);
    setCopied(true);
    success(`Copied code "${offer.couponCode}"!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGradient = () => {
    switch (offer.accentColor) {
      case 'orange':
        return 'from-orange-500 via-amber-500 to-yellow-500';
      case 'rose':
        return 'from-rose-500 via-pink-500 to-purple-600';
      case 'emerald':
        return 'from-emerald-500 via-teal-500 to-cyan-600';
      case 'purple':
        return 'from-purple-600 via-indigo-600 to-blue-600';
      default:
        return 'from-orange-500 to-amber-500';
    }
  };

  return (
    <div
      id={`offer-card-${offer.id}`}
      className="relative bg-white rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Banner with Image & Gradient Overlay */}
      <div className="relative h-40 overflow-hidden bg-stone-900">
        <img
          src={offer.imageUrl}
          alt={offer.title}
          className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${getGradient()} opacity-80 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 font-extrabold text-xs shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-500 fill-current" />
            {offer.badge}
          </span>
        </div>

        {/* Big Discount Tag */}
        <div className="absolute bottom-3 left-3 text-white">
          <h4 className="text-2xl font-black tracking-tight drop-shadow-md">{offer.discount}</h4>
          <p className="text-xs font-semibold text-white/90">{offer.title}</p>
        </div>
      </div>

      {/* Body details */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mb-3">
            {offer.description}
          </p>
          <p className="text-[11px] font-medium text-stone-400">
            Valid till {offer.expiryDate}
          </p>
        </div>

        {/* Coupon Code Pill + Copy + Action */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/50">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-orange-600 tracking-wider">CODE:</span>
              <span className="font-mono font-black text-sm text-stone-900">{offer.couponCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-xs hover:shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onOrderNow}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 group"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
