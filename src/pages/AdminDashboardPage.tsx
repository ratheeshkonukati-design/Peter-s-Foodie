import React, { useState } from 'react';
import {
  ShieldCheck,
  Store,
  Tag,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { useToast } from '../context/ToastContext';
import { Restaurant, Coupon } from '../types';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'coupons' | 'overview'>('restaurants');

  const [restaurants, setRestaurants] = useState<Restaurant[]>(StorageService.getRestaurants());
  const [coupons, setCoupons] = useState<Coupon[]>(StorageService.getCoupons());
  const orders = StorageService.getOrders();

  // New Coupon Form state
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('20');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('399');
  const [newCouponMaxDisc, setNewCouponMaxDisc] = useState('100');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);

  const handleToggleRestaurantStatus = (restaurantId: string, newStatus: 'approved' | 'pending' | 'rejected') => {
    const updated = StorageService.updateRestaurant(restaurantId, { status: newStatus });
    if (updated) {
      setRestaurants(StorageService.getRestaurants());
      success(`Restaurant status updated to ${newStatus.toUpperCase()}`);
    }
  };

  const handleToggleFeatured = (restaurant: Restaurant) => {
    const updated = StorageService.updateRestaurant(restaurant.id, {
      isFeatured: !restaurant.isFeatured,
    });
    if (updated) {
      setRestaurants(StorageService.getRestaurants());
      success(`Updated featured status for ${restaurant.name}`);
    }
  };

  const handleTogglePremium = (restaurant: Restaurant) => {
    const updated = StorageService.updateRestaurant(restaurant.id, {
      isPremium: !restaurant.isPremium,
    });
    if (updated) {
      setRestaurants(StorageService.getRestaurants());
      success(`Updated 👑 Premium status for ${restaurant.name}`);
    }
  };

  const handleToggleCoupon = (couponId: string) => {
    const target = coupons.find(c => c.id === couponId);
    if (!target) return;
    const updated = StorageService.updateCoupon(couponId, { active: !target.active });
    if (updated) {
      setCoupons(StorageService.getCoupons());
      success(`Coupon ${target.code} is now ${!target.active ? 'Active' : 'Disabled'}`);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      error('Please provide a coupon code.');
      return;
    }
    const created = StorageService.createCoupon({
      code: newCouponCode.trim().toUpperCase(),
      description: newCouponDesc.trim() || `Get ${newCouponDiscount}% discount on your gourmet order`,
      discountType: newCouponType,
      discountValue: parseInt(newCouponDiscount) || 20,
      minOrderAmount: parseInt(newCouponMinOrder) || 299,
      maxDiscount: parseInt(newCouponMaxDisc) || 100,
      active: true,
      expiryDate: '2026-12-31',
    });
    setCoupons(StorageService.getCoupons());
    setIsAddingCoupon(false);
    setNewCouponCode('');
    setNewCouponDesc('');
    success(`Coupon "${created.code}" created and activated!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
              Admin Console
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500 font-semibold">Super Administrator: Peter Fernandez</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
            Platform Master Console
          </h1>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'restaurants' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Restaurants ({restaurants.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'coupons' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons & Offers ({coupons.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Platform Overview</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Platform Gross GMV</span>
          <p className="text-2xl font-black text-stone-900">₹{(totalGMV + 148200).toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold">Processed in Indian Rupees (₹)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Verified Restaurants</span>
          <p className="text-2xl font-black text-orange-600">
            {restaurants.filter(r => r.status === 'approved').length}
          </p>
          <span className="text-[11px] text-stone-400">Across Bengaluru, Mumbai, Delhi</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Customer Orders</span>
          <p className="text-2xl font-black text-blue-600">{orders.length + 342}</p>
          <span className="text-[11px] text-stone-400">99.2% satisfaction score</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Promo Coupons</span>
          <p className="text-2xl font-black text-purple-600">{coupons.filter(c => c.active).length}</p>
          <span className="text-[11px] text-stone-400">50% max discount voucher</span>
        </div>
      </div>

      {/* 1. RESTAURANTS APPROVAL & CURATION TAB */}
      {activeTab === 'restaurants' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Partner Restaurant Directory</h3>
              <p className="text-xs text-stone-500">Approve onboarding requests, feature top dining, and manage premium flags</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Restaurant</th>
                    <th className="p-4">Cuisine & City</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {restaurants.map(rest => (
                    <tr key={rest.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={rest.logoUrl} alt={rest.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <span className="font-bold text-sm text-stone-900 block">{rest.name}</span>
                            <span className="text-[11px] text-stone-400">₹{rest.priceForTwo} for two</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="block font-semibold">{rest.cuisine.join(', ')}</span>
                        <span className="text-stone-400">{rest.city}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-amber-600">★ {rest.rating}</span>
                        <span className="text-stone-400 block text-[11px]">({rest.reviewsCount})</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                          rest.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rest.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rest.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(rest)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                              rest.isFeatured
                                ? 'bg-amber-500 text-stone-950 border-amber-500'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                          >
                            Featured
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePremium(rest)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all flex items-center gap-0.5 ${
                              rest.isPremium
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                          >
                            👑 Premium
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {rest.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleToggleRestaurantStatus(rest.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                            >
                              Approve
                            </button>
                          )}
                          {rest.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleToggleRestaurantStatus(rest.id, 'rejected')}
                              className="px-2.5 py-1 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-lg font-bold text-[11px]"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. COUPONS & PROMOS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Promotions & Vouchers</h3>
              <p className="text-xs text-stone-500">Create discount codes and manage customer loyalty rewards</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingCoupon(true)}
              className="py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Coupon</span>
            </button>
          </div>

          {isAddingCoupon && (
            <form onSubmit={handleCreateCoupon} className="p-6 rounded-3xl bg-stone-50 border border-orange-200 space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-sm text-stone-900">Create Promotional Coupon</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. MONSOON30"
                    value={newCouponCode}
                    onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-white border text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount (% or ₹)</label>
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={e => setNewCouponDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={newCouponMaxDisc}
                    onChange={e => setNewCouponMaxDisc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 30% discount on all biryani and pizza orders"
                  value={newCouponDesc}
                  onChange={e => setNewCouponDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
                  Publish Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCoupon(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map(c => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  c.active ? 'bg-white border-stone-200 shadow-2xs' : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base text-orange-600">{c.code}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCoupon(c.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {c.active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-snug">{c.description}</p>

                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 flex justify-between font-medium">
                  <span>Min: ₹{c.minOrderAmount}</span>
                  <span>Max: ₹{c.maxDiscount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PLATFORM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">Platform System Health</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-stone-50">
                <span className="font-semibold text-stone-700">API Gateway & Router</span>
                <span className="text-emerald-600 font-bold">Healthy (99.99% Uptime)</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-stone-50">
                <span className="font-semibold text-stone-700">Database Read/Write Engine</span>
                <span className="text-emerald-600 font-bold">Synchronized (0ms latency)</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-stone-50">
                <span className="font-semibold text-stone-700">Driver Dispatch Fleet</span>
                <span className="text-blue-600 font-bold">148 Active Couriers Online</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">City Hub Distribution</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Bengaluru (Indiranagar, Koramangala, Whitefield)</span>
                <span className="font-bold text-stone-900">54% volume</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-600 h-full w-[54%]" />
              </div>

              <div className="flex justify-between pt-2">
                <span>Mumbai (Bandra, Juhu, Powai)</span>
                <span className="font-bold text-stone-900">28% volume</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[28%]" />
              </div>

              <div className="flex justify-between pt-2">
                <span>Delhi NCR (Connaught Place, Cyber Hub)</span>
                <span className="font-bold text-stone-900">18% volume</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full w-[18%]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
