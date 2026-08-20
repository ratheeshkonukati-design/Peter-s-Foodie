import React, { useState } from 'react';
import { Send, Heart, ShieldCheck, Clock, Award, PhoneCall, Mail, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      success('Thank you for subscribing to Peter\'s Foody gourmet newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Value Props Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-800/50">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Lightning 30 Min Delivery</h5>
              <p className="text-xs text-stone-400">Hot and fresh insulated bags</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-800/50">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Top Rated Restaurants</h5>
              <p className="text-xs text-stone-400">Strict hygiene certified dining</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-800/50">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Safe & Secure Payments</h5>
              <p className="text-xs text-stone-400">UPI, Cards & Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-800/50">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">24/7 Foodie Support</h5>
              <p className="text-xs text-stone-400">Instant customer assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-xl">
                🍴
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Peter's <span className="text-orange-500">Foody</span>
              </span>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              "Premium Food. Local Restaurants. Delivered with Love." Discover authentic Mughlai biryanis, wood-fired sourdough pizzas, artisanal burgers, and healthy nourish bowls right at your doorstep.
            </p>

            <div className="space-y-1.5 text-xs text-stone-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Headquarters: 42, 100ft Road, Indiranagar, Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>support@petersfoody.com | +91 (80) 4567-8900</span>
              </div>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Discover & Eat
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('/restaurants')} className="hover:text-orange-400 transition-colors">
                  All Restaurants
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/offers')} className="hover:text-orange-400 transition-colors">
                  Discounts & Deals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/premium')} className="hover:text-orange-400 transition-colors">
                  👑 Peter's Premium
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/categories')} className="hover:text-orange-400 transition-colors">
                  Food Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/favorites')} className="hover:text-orange-400 transition-colors">
                  Saved Favorites
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & Business */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Portals & Roles
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('/restaurant-dashboard')} className="hover:text-orange-400 transition-colors">
                  Restaurant Owner Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-orange-400 transition-colors">
                  Platform Admin Console
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/orders')} className="hover:text-orange-400 transition-colors">
                  Customer Order Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-orange-400 transition-colors">
                  Our Story & Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Gourmet Newsletter
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              Get exclusive weekend coupons and secret chef releases sent to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Peter's Foody Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for food lovers across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
