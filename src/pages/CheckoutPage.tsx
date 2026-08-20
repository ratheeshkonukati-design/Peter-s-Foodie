import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Building,
  Home,
  Briefcase
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StorageService } from '../services/storage';
import { PaymentMethod, Address } from '../types';
import { VegBadge } from '../components/common/RatingStars';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigate,
  onOrderPlaced,
}) => {
  const {
    items,
    restaurant,
    subtotal,
    deliveryFee,
    tax,
    packagingFee,
    discount,
    total,
    appliedCoupon,
    clearCart,
  } = useCart();
  const { user, addresses, addAddress, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || 'addr-default'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'home' | 'work' | 'other'>('home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Bengaluru');
  const [newAddrZip, setNewAddrZip] = useState('560038');

  const [deliveryInstruction, setDeliveryInstruction] = useState<string>('Leave at door');
  const [driverTip, setDriverTip] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (items.length === 0 || !restaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-3xl">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500">Add delicious food from our partner restaurants before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('/restaurants')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  const finalPayableTotal = total + driverTip;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim() || !newAddrLine.trim()) {
      error('Please complete the address details.');
      return;
    }
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      addressLine: newAddrLine.trim(),
      street: newAddrStreet.trim(),
      city: newAddrCity,
      state: 'Karnataka',
      zipCode: newAddrZip,
      isDefault: false,
    };
    addAddress(newAddr);
    setSelectedAddressId(newAddr.id);
    setIsAddingNewAddress(false);
    success('Address saved and selected!');
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId && addresses.length === 0) {
      error('Please select or add a delivery address.');
      return;
    }

    const currentAddress =
      addresses.find(a => a.id === selectedAddressId) ||
      addresses[0] || {
        id: 'addr-temp',
        label: 'home',
        addressLine: 'Flat 402, Lotus Residency',
        street: '100ft Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560038',
        isDefault: true,
      };

    setIsPlacingOrder(true);

    setTimeout(() => {
      const order = StorageService.createOrder({
        userId: user?.id || 'user-customer-1',
        userName: user?.name || 'Rohan Sharma',
        userPhone: user?.phone || '+91 98765 43210',
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantLogo: restaurant.logoUrl,
        restaurantAddress: `${restaurant.address}, ${restaurant.city}`,
        items: items.map(ci => ({
          menuItemId: ci.menuItem.id,
          name: ci.menuItem.name,
          quantity: ci.quantity,
          unitPrice: ci.unitPrice,
          totalPrice: ci.totalPrice,
          isVegetarian: ci.menuItem.isVegetarian,
          selectedAddons: ci.selectedAddons,
          specialInstructions: ci.specialInstructions,
        })),
        subtotal,
        deliveryFee,
        tax,
        packagingFee,
        discount,
        couponCode: appliedCoupon?.code,
        total: finalPayableTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        orderStatus: 'placed',
        status: 'placed',
        deliveryAddress: currentAddress,
        deliveryInstructions: deliveryInstruction,
        estimatedDeliveryTime: '25-30 mins',
        driverName: 'Suresh Kumar',
        driverPhone: '+91 98765 11223',
        driverRating: 4.9,
      });

      clearCart();
      setIsPlacingOrder(false);
      success('Order placed successfully! Tracking your delivery.');
      onOrderPlaced(order.id);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
        <button
          onClick={() => onNavigate(`/restaurant/${restaurant.id}`)}
          className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
          aria-label="Go back to restaurant"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-stone-500">Ordering from <strong className="text-stone-900">{restaurant.name}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address, Instructions, Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. DELIVERY ADDRESS */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>1. Delivery Address</span>
              </h3>
              {!isAddingNewAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {isAddingNewAddress ? (
              <form onSubmit={handleSaveNewAddress} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in duration-200">
                <div className="flex gap-2 mb-2">
                  {(['home', 'work', 'other'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setNewAddrLabel(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        newAddrLabel === l ? 'bg-orange-600 text-white' : 'bg-white text-stone-700 border'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                    Flat / House / Apartment No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 302, Green Valley Apts"
                    value={newAddrLine}
                    onChange={e => setNewAddrLine(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                    Street / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12th Main, HAL 2nd Stage, Indiranagar"
                    value={newAddrStreet}
                    onChange={e => setNewAddrStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      value={newAddrCity}
                      onChange={e => setNewAddrCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={newAddrZip}
                      onChange={e => setNewAddrZip(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold"
                  >
                    Save & Use
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-4 py-2 bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2.5">
                {addresses.map(addr => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white text-stone-700 shadow-2xs">
                          {addr.label === 'home' ? (
                            <Home className="w-4 h-4 text-emerald-600" />
                          ) : addr.label === 'work' ? (
                            <Briefcase className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Building className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-stone-900">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] bg-stone-200 font-bold px-1.5 py-0.2 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600">{addr.addressLine}, {addr.street}, {addr.city}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. DELIVERY INSTRUCTIONS */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-stone-900">2. Delivery Instructions for Rider</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '🚪 Leave at door', val: 'Leave at door' },
                { label: '🔕 Avoid ringing bell', val: 'Avoid ringing bell' },
                { label: '📞 Call upon arrival', val: 'Call upon arrival' },
                { label: '🛡️ Contactless drop', val: 'Contactless drop' },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDeliveryInstruction(opt.val)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                    deliveryInstruction === opt.val
                      ? 'border-orange-500 bg-orange-50 text-orange-800'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. TIP DELIVERY PARTNER */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Tip Your Delivery Partner</h3>
                <p className="text-xs text-stone-500">100% of the tip goes directly to your driver</p>
              </div>
              {driverTip > 0 && (
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  +₹{driverTip} added
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {[0, 20, 30, 50, 100].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDriverTip(amt)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    driverTip === amt
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {amt === 0 ? 'No Tip' : `₹${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. PAYMENT METHOD */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <span>4. Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50/50' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-sm font-bold text-stone-900 block">UPI Instant Payment (Recommended)</span>
                      <span className="text-xs text-stone-500">Google Pay, PhonePe, Paytm, BHIM UPI</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                </div>

                {paymentMethod === 'upi' && (
                  <div className="pt-2 border-t border-orange-200/60 grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm UPI' },
                      { id: 'custom', name: 'Custom UPI' },
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setUpiProvider(p.id as any)}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          upiProvider === p.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cards Option */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'card' ? 'border-orange-500 bg-orange-50/50' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-sm font-bold text-stone-900 block">Credit / Debit Card</span>
                    <span className="text-xs text-stone-500">Visa, Mastercard, RuPay, Amex</span>
                  </div>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-orange-600 focus:ring-orange-500"
                />
              </div>

              {/* Cash On Delivery Option */}
              <div
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'cash_on_delivery' ? 'border-orange-500 bg-orange-50/50' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-sm font-bold text-stone-900 block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-stone-500">Pay cash or scan QR upon doorstep arrival</span>
                  </div>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="text-orange-600 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Bill */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xl space-y-6 sticky top-24">
            {/* Restaurant Badge */}
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-base text-stone-900">{restaurant.name}</h3>
                <p className="text-xs text-stone-500">{restaurant.address}, {restaurant.city}</p>
              </div>
            </div>

            {/* Items review */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.cartItemId} className="flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2 flex-1">
                    <VegBadge isVeg={item.menuItem.isVegetarian} size="sm" />
                    <div>
                      <span className="font-bold text-stone-900">{item.menuItem.name}</span>
                      <span className="text-stone-400 font-semibold ml-1.5">x{item.quantity}</span>
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          + {item.selectedAddons.map(a => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-extrabold text-stone-900">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="p-4 rounded-2xl bg-stone-50 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-semibold text-stone-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-semibold text-stone-900">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant Packaging</span>
                <span className="font-semibold text-stone-900">₹{packagingFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Govt Taxes (GST 5%)</span>
                <span className="font-semibold text-stone-900">₹{tax}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              {driverTip > 0 && (
                <div className="flex justify-between text-stone-900 font-bold">
                  <span>Driver Tip</span>
                  <span>+₹{driverTip}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-black text-stone-900">
                <span>Total Payable</span>
                <span className="text-orange-600">₹{finalPayableTotal}</span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe 256-Bit Encrypted Secure Checkout</span>
            </div>

            {/* Submit Order Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 text-white font-black text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <span>Processing Order...</span>
              ) : (
                <span>Place Order • ₹{finalPayableTotal}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
