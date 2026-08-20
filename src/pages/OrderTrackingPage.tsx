import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  Bike,
  Home,
  MessageSquare,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Order, OrderStatus } from '../types';
import { RatingStars, VegBadge } from '../components/common/RatingStars';
import { useToast } from '../context/ToastContext';
import { ReviewModal } from '../components/modals/ReviewModal';

interface OrderTrackingPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
  { status: 'placed', label: 'Order Placed', desc: 'Received & forwarded to restaurant', icon: '📝' },
  { status: 'confirmed', label: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: '✅' },
  { status: 'preparing', label: 'Kitchen Preparing', desc: 'Chef is crafting your fresh gourmet dishes', icon: '👨‍🍳' },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is zooming towards your location', icon: '🛵' },
  { status: 'delivered', label: 'Delivered', desc: 'Enjoy your meal with love!', icon: '🎉' },
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const { success } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const ord = StorageService.getOrderById(orderId);
    if (ord) setOrder(ord);
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-sm text-stone-500">Could not locate order #{orderId}.</p>
        <button
          onClick={() => onNavigate('/orders')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const currentStatus = order.orderStatus || order.status || 'placed';
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.status === currentStatus || (s.status === 'confirmed' && currentStatus === 'accepted'));

  // Demo simulator helper to advance next status
  const handleAdvanceStatus = () => {
    const nextStatuses: Record<string, OrderStatus> = {
      placed: 'accepted',
      accepted: 'preparing',
      confirmed: 'preparing',
      preparing: 'out_for_delivery',
      ready: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: 'delivered',
      cancelled: 'cancelled',
    };

    const next = nextStatuses[currentStatus] || 'accepted';
    if (next && next !== currentStatus) {
      const updated = StorageService.updateOrderStatus(order.id, next);
      if (updated) {
        setOrder({ ...updated });
        success(`Order status updated to: ${next.replace(/_/g, ' ').toUpperCase()}`);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Banner with live ETA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-950 text-white shadow-2xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-extrabold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE ORDER TRACKING</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {currentStatus === 'delivered'
              ? 'Order Delivered Successfully!'
              : 'Arriving in 25–30 Minutes'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300">
            Order ID: <strong className="text-white font-mono">{order.id}</strong> • Placed from{' '}
            <strong className="text-orange-400">{order.restaurantName}</strong>
          </p>
        </div>

        {/* Demo Fast Forward Button */}
        {currentStatus !== 'delivered' && (
          <div className="z-10 text-center md:text-right">
            <button
              type="button"
              onClick={handleAdvanceStatus}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Next Stage (Demo)</span>
            </button>
            <span className="text-[10px] text-stone-400 block mt-1">1-click status progression</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Stepper & Map Simulation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Stepper Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-stone-900">Order Progress</h3>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{step.icon}</span>
                        <h4 className={`text-sm font-black ${isCurrent ? 'text-orange-600' : 'text-stone-900'}`}>
                          {step.label}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner Details Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Bike className="w-5 h-5 text-orange-600" />
                <span>Delivery Partner</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Vaccinated & Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center font-bold text-lg text-stone-700">
                  🛵
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{order.driverName || order.driver?.name || 'Suresh Kumar'}</h4>
                  <p className="text-xs text-stone-500">Hero Electric • KA 01 EQ 4589</p>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{order.driverRating || order.driver?.rating || 4.9} (1,420 deliveries)</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${order.driverPhone || order.driver?.phone || '+91 98765 11223'}`}
                className="p-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call Rider</span>
              </a>
            </div>
          </div>

          {/* Review Trigger Card (When Delivered) */}
          {currentStatus === 'delivered' && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-600 fill-current" />
                <span>How was your meal from {order.restaurantName}?</span>
              </div>
              <p className="text-xs text-stone-600">
                Your feedback helps our culinary chefs and delivery partners maintain 5-star quality.
              </p>
              <button
                type="button"
                onClick={() => setIsReviewOpen(true)}
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Star className="w-4 h-4 fill-current" />
                <span>Rate & Review Order</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Details & Address */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
            {/* Delivery Destination */}
            <div className="space-y-2 pb-4 border-b border-stone-100">
              <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                Delivering To
              </span>
              <div className="flex items-start gap-2.5 text-xs text-stone-700">
                <Home className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block font-bold capitalize">
                    {order.deliveryAddress.label}
                  </strong>
                  <p>{order.deliveryAddress.addressLine}, {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                Ordered Items ({order.items.length})
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <VegBadge isVeg={item.isVegetarian} size="sm" />
                      <div>
                        <span className="font-bold text-stone-900">{item.name}</span>
                        <span className="text-stone-400 font-semibold ml-1.5">x{item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-stone-900">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill breakdown */}
            <div className="p-4 rounded-2xl bg-stone-50 space-y-2 text-xs text-stone-600 border border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Packaging</span>
                <span>₹{order.tax + order.packagingFee}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-stone-900">
                <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
                <span className="text-orange-600">₹{order.total}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onNavigate(`/restaurant/${order.restaurantId}`)}
                className="w-full py-3 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Order Again from {order.restaurantName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        orderId={order.id}
        restaurantId={order.restaurantId}
        restaurantName={order.restaurantName}
      />
    </div>
  );
};
