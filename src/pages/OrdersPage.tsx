import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { ReviewModal } from '../components/modals/ReviewModal';

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<any>(null);

  const orders = user
    ? StorageService.getOrdersByUser(user.id)
    : StorageService.getOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold animate-pulse">
            <Truck className="w-3.5 h-3.5" /> Out for Delivery
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Preparing in Kitchen
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Order Placed
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track active deliveries and review your past food orders
          </p>
        </div>
        <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-3xl">
            🍽️
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">No Orders Yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You haven't placed any orders yet. Discover our top-rated restaurants and start your first order!
            </p>
          </div>
          <button
            onClick={() => onNavigate('/restaurants')}
            className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-700 transition-all"
          >
            Explore Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Order Card Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <img
                    src={order.restaurantLogo}
                    alt={order.restaurantName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{order.restaurantName}</h3>
                    <p className="text-xs text-stone-400">
                      Order #{order.id} • {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="font-black text-base text-stone-900">₹{order.total}</span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-1 text-xs text-stone-600">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-stone-500">
                  Delivered to: <strong className="text-stone-700">{order.deliveryAddress.street}, {order.deliveryAddress.city}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {order.status !== 'delivered' ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(`/order-tracking/${order.id}`)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <span>Track Live Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForReview(order)}
                        className="px-3.5 py-2 rounded-xl border border-stone-300 hover:border-orange-500 hover:text-orange-600 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span>Rate Order</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/restaurant/${order.restaurantId}`)}
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      {selectedOrderForReview && (
        <ReviewModal
          isOpen={!!selectedOrderForReview}
          onClose={() => setSelectedOrderForReview(null)}
          orderId={selectedOrderForReview.id}
          restaurantId={selectedOrderForReview.restaurantId}
          restaurantName={selectedOrderForReview.restaurantName}
        />
      )}
    </div>
  );
};
