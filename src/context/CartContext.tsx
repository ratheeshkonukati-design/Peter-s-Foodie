import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AddonOption, CartItem, Coupon, MenuItem, Restaurant } from '../types';
import { StorageService } from '../services/storage';
import { useToast } from './ToastContext';

interface RestaurantConflictModalData {
  newRestaurant: Restaurant;
  pendingItem: {
    menuItem: MenuItem;
    quantity: number;
    addons: AddonOption[];
    instructions?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  restaurant: Restaurant | null;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  packagingFee: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (
    menuItem: MenuItem,
    quantity?: number,
    addons?: AddonOption[],
    instructions?: string
  ) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  conflictData: RestaurantConflictModalData | null;
  resolveConflict: (replace: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'peters_foody_cart_session_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [conflictData, setConflictData] = useState<RestaurantConflictModalData | null>(null);

  const { success, error, info } = useToast();

  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [items]);

  // Derive restaurant from first item in cart
  const restaurant = useMemo(() => {
    if (items.length === 0) return null;
    const restId = items[0].menuItem.restaurantId;
    return StorageService.getRestaurantById(restId) || null;
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    // Free delivery if subtotal > 499
    if (subtotal >= 499) return 0;
    return restaurant?.deliveryFee ?? 35;
  }, [items, subtotal, restaurant]);

  const packagingFee = useMemo(() => {
    if (items.length === 0) return 0;
    return 20;
  }, [items]);

  // 5% standard restaurant GST
  const tax = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round(subtotal * 0.05);
  }, [items, subtotal]);

  // Calculate discount from coupon
  const discount = useMemo(() => {
    if (!appliedCoupon || items.length === 0) return 0;
    if (subtotal < appliedCoupon.minimumOrder) return 0;

    if (appliedCoupon.discountType === 'percentage') {
      const disc = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      return appliedCoupon.maximumDiscount ? Math.min(disc, appliedCoupon.maximumDiscount) : disc;
    } else {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
  }, [appliedCoupon, items, subtotal]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee + packagingFee + tax - discount);
  }, [items, subtotal, deliveryFee, packagingFee, tax, discount]);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (
    menuItem: MenuItem,
    quantity = 1,
    addons: AddonOption[] = [],
    instructions?: string
  ) => {
    const itemRestaurant = StorageService.getRestaurantById(menuItem.restaurantId);

    // If there are existing items from a different restaurant
    if (items.length > 0 && items[0].menuItem.restaurantId !== menuItem.restaurantId) {
      if (itemRestaurant) {
        setConflictData({
          newRestaurant: itemRestaurant,
          pendingItem: { menuItem, quantity, addons, instructions }
        });
      }
      return;
    }

    const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
    const basePrice = menuItem.discountPrice || menuItem.price;
    const unitPrice = basePrice + addonsPrice;

    // Create unique key for item + selected addons
    const addonKey = addons.map(a => a.id).sort().join(',');
    const cartItemId = `${menuItem.id}-${addonKey}`;

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
          specialInstructions: instructions || updated[existingIndex].specialInstructions
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItem,
          quantity,
          selectedAddons: addons,
          specialInstructions: instructions,
          unitPrice,
          itemTotal: quantity * unitPrice
        };
        return [...prev, newItem];
      }
    });

    success(`Added ${quantity}x "${menuItem.name}" to cart`);
  };

  const resolveConflict = (replace: boolean) => {
    if (!conflictData) return;
    if (replace) {
      const { menuItem, quantity, addons, instructions } = conflictData.pendingItem;
      const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
      const basePrice = menuItem.discountPrice || menuItem.price;
      const unitPrice = basePrice + addonsPrice;
      const addonKey = addons.map(a => a.id).sort().join(',');
      const cartItemId = `${menuItem.id}-${addonKey}`;

      const newItem: CartItem = {
        cartItemId,
        menuItem,
        quantity,
        selectedAddons: addons,
        specialInstructions: instructions,
        unitPrice,
        itemTotal: quantity * unitPrice
      };

      setItems([newItem]);
      setAppliedCoupon(null);
      info(`Cart updated to ${conflictData.newRestaurant.name}`);
    }
    setConflictData(null);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: newQuantity * item.unitPrice
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => {
      const filtered = prev.filter(item => item.cartItemId !== cartItemId);
      if (filtered.length === 0) {
        setAppliedCoupon(null);
      }
      return filtered;
    });
    info('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError(null);
    info('Cart cleared');
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code.');
      error('Please enter a coupon code.');
      return false;
    }

    const res = StorageService.validateCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponError(null);
      success(res.message);
      return true;
    } else {
      setCouponError(res.message);
      error(res.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    info('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
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
        couponError,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        conflictData,
        resolveConflict
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
