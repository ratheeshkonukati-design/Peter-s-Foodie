import React, { useState } from 'react';
import { Heart, Sparkles, ShieldCheck, Award, Clock, Users, Mail, MapPin, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerRest, setPartnerRest] = useState('');

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success('Thank you! Our restaurant onboarding specialist will contact you within 24 hours.');
    setPartnerName('');
    setPartnerEmail('');
    setPartnerRest('');
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Hero */}
      <section className="bg-stone-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-extrabold text-xs tracking-wider uppercase">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>OUR STORY & PHILOSOPHY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            "Premium Food. Local Restaurants. <br />
            <span className="text-orange-500">Delivered with Love."</span>
          </h1>

          <p className="text-stone-300 text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Peter's Foody was founded with a single mission: to bridge the gap between discerning food lovers and passionate culinary masters who pour their soul into every recipe.
          </p>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            THE PILLARS OF EXCELLENCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            What Sets Peter's Foody Apart
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
              🍲
            </div>
            <h3 className="font-bold text-base text-stone-900">Authentic Recipes Only</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We partner exclusively with authentic restaurants that prioritize hand-ground spices, heirloom gravies, and slow wood-fire cooking over industrial shortcuts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
              ⭐
            </div>
            <h3 className="font-bold text-base text-stone-900">Hygiene Audited</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every partner kitchen passes our unannounced 25-point cleanliness inspection and uses food-grade biodegradable thermal packaging.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
              🛵
            </div>
            <h3 className="font-bold text-base text-stone-900">Priority Cold/Hot Fleet</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Our insulated thermal bags maintain precise temperatures so your charcoal biryani arrives piping hot and artisanal gelatos never melt.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">
              👑
            </div>
            <h3 className="font-bold text-base text-stone-900">Peter's Premium Club</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Special access to secret menus, truffle-infused delicacies, and VIP priority courier dispatch with zero delivery fees on orders above ₹499.
            </p>
          </div>
        </div>
      </section>

      {/* Partner With Us Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-white shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              EXPAND YOUR CULINARY REACH
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Partner Your Restaurant with Peter's Foody
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto">
              Join India's most loved gourmet food platform and connect with thousands of food lovers daily.
            </p>
          </div>

          <form onSubmit={handlePartnerSubmit} className="space-y-4 max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Singhania"
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@restaurant.com"
                  value={partnerEmail}
                  onChange={e => setPartnerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Restaurant Name & City</label>
              <input
                type="text"
                placeholder="e.g. Royal Nawabi Dine, Indiranagar Bengaluru"
                value={partnerRest}
                onChange={e => setPartnerRest(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Partnership Request</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
