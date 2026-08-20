import React, { useState } from 'react';
import {
  ChefHat,
  TrendingUp,
  ShoppingBag,
  Star,
  Plus,
  Check,
  Clock,
  CheckCircle2,
  DollarSign,
  Flame,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { OrderStatus, MenuItem } from '../types';
import { VegBadge } from '../components/common/RatingStars';

interface RestaurantDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const RestaurantDashboardPage: React.FC<RestaurantDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'stats'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('active');

  // Load restaurant owned or default to Spice Paradise for demo
  const restaurantId = user?.restaurantId || 'rest-1';
  const restaurant = StorageService.getRestaurantById(restaurantId) || StorageService.getRestaurants()[0];

  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    StorageService.getMenuItemsByRestaurant(restaurant.id)
  );
  const [orders, setOrders] = useState(
    StorageService.getOrdersByRestaurant(restaurant.id)
  );

  // New Item Modal Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('320');
  const [newItemCategory, setNewItemCategory] = useState('Main Course');
  const [newItemIsVeg, setNewItemIsVeg] = useState(false);
  const [newItemIsPremium, setNewItemIsPremium] = useState(false);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = StorageService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(StorageService.getOrdersByRestaurant(restaurant.id));
      success(`Order #${orderId} moved to ${newStatus.replace(/_/g, ' ').toUpperCase()}`);
    }
  };

  const handleToggleAvailability = (item: MenuItem) => {
    const updated = StorageService.updateMenuItem(item.id, {
      isAvailable: !item.isAvailable,
    });
    if (updated) {
      setMenuItems(StorageService.getMenuItemsByRestaurant(restaurant.id));
      success(`${item.name} is now ${!item.isAvailable ? 'In Stock' : 'Out of Stock'}`);
    }
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) {
      error('Please fill in dish name and price.');
      return;
    }

    const created = StorageService.createMenuItem({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      name: newItemName.trim(),
      description: newItemDesc.trim() || 'Freshly prepared specialty of the house.',
      price: parseInt(newItemPrice) || 299,
      categoryName: newItemCategory,
      isVegetarian: newItemIsVeg,
      isBestSeller: false,
      isPremium: newItemIsPremium,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 1,
      isAvailable: true,
      customAddons: [
        { id: `add-${Date.now()}-1`, name: 'Extra Gravy', price: 50 },
        { id: `add-${Date.now()}-2`, name: 'Mint Chutney & Onions', price: 20 },
      ],
    });

    setMenuItems(StorageService.getMenuItemsByRestaurant(restaurant.id));
    setIsAddingItem(false);
    setNewItemName('');
    setNewItemDesc('');
    success(`"${created.name}" added to menu!`);
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (orderFilter === 'completed') return o.status === 'delivered';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-4">
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase">
                Owner Portal
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-emerald-700 font-bold">Kitchen Open 🟢</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">{restaurant.name} Dashboard</h1>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Queue ({pendingOrders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'menu' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Menu Manager ({menuItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'stats' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Sales</span>
          <p className="text-2xl font-black text-stone-900">₹{totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold">+18% this week</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Orders</span>
          <p className="text-2xl font-black text-orange-600">{pendingOrders.length}</p>
          <span className="text-[11px] text-stone-400">Avg prep time: 14 mins</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Kitchen Rating</span>
          <p className="text-2xl font-black text-amber-500">★ {restaurant.rating}</p>
          <span className="text-[11px] text-stone-400">{restaurant.reviewCount || restaurant.reviewsCount || 48} verified reviews</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Menu Dishes</span>
          <p className="text-2xl font-black text-purple-600">{menuItems.length}</p>
          <span className="text-[11px] text-stone-400">{menuItems.filter(m => m.isAvailable).length} in stock</span>
        </div>
      </div>

      {/* 1. ORDERS QUEUE TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Filter Pills */}
          <div className="flex gap-2">
            {[
              { id: 'active', label: `Active Orders (${pendingOrders.length})` },
              { id: 'all', label: `All Orders (${orders.length})` },
              { id: 'completed', label: 'Delivered History' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setOrderFilter(f.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  orderFilter === f.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200 p-6">
              <p className="font-bold text-stone-800">No orders in this status</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-stone-900">Order #{order.id}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 font-extrabold text-[10px] uppercase">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Customer: <strong className="text-stone-700">{order.userName}</strong> ({order.userPhone})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-stone-900">₹{order.total}</span>
                      <span className="block text-[11px] text-stone-400">{order.paymentMethod.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-1 text-xs text-stone-700">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-semibold">₹{it.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Status Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-stone-500">
                      Rider: <strong className="text-stone-800">{order.driverName}</strong>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {order.status === 'placed' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(order.id, 'accepted')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Accept Order
                        </button>
                      )}
                      {(order.status === 'placed' || order.status === 'accepted' || order.status === 'confirmed') && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Start Cooking 👨‍🍳
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(order.id, 'out_for_delivery')}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Handover to Rider 🛵
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Mark Delivered ✓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MENU MANAGER TAB */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Restaurant Menu Catalog</h3>
              <p className="text-xs text-stone-500">Toggle live stock availability and add new delicacies</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingItem(true)}
              className="py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Add Item Form */}
          {isAddingItem && (
            <form onSubmit={handleCreateMenuItem} className="p-6 rounded-3xl bg-stone-50 border border-orange-200 space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-sm text-stone-900">Add New Dish to Menu</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dish Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kashmiri Dum Aloo"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Ingredients and culinary notes..."
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border text-xs"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemIsVeg}
                    onChange={e => setNewItemIsVeg(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>🥦 Vegetarian Dish</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemIsPremium}
                    onChange={e => setNewItemIsPremium(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  <span>👑 Peter's Premium Tag</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
                  Save Dish
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  item.isAvailable ? 'bg-white border-stone-200' : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <VegBadge isVeg={item.isVegetarian} size="sm" />
                      <h4 className="font-bold text-sm text-stone-900">{item.name}</h4>
                    </div>
                    <span className="font-extrabold text-xs text-stone-700">₹{item.price}</span>
                    <p className="text-[11px] text-stone-400">{item.categoryName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      item.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. STATS TAB */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">Performance Summary</h3>
            <p className="text-xs text-stone-500">
              Kitchen operating at high efficiency with 98.4% on-time driver dispatch rate.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-50 border text-center space-y-1">
                <span className="text-xs text-stone-500 font-semibold">Average Order Value</span>
                <p className="text-xl font-black text-stone-900">₹640</p>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border text-center space-y-1">
                <span className="text-xs text-stone-500 font-semibold">Customer Repeat Rate</span>
                <p className="text-xl font-black text-emerald-600">62%</p>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border text-center space-y-1">
                <span className="text-xs text-stone-500 font-semibold">Order Acceptance Speed</span>
                <p className="text-xl font-black text-blue-600">45 sec</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
