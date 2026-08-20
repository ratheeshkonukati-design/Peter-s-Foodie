export type UserRole = 'customer' | 'restaurant_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  restaurantId?: string; // For restaurant owners
}

export interface Address {
  id: string;
  userId?: string;
  label: 'home' | 'work' | 'other';
  name?: string;
  phone?: string;
  addressLine: string;
  street: string;
  city: string;
  state: string;
  pincode?: string;
  zipCode?: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  cuisine: string[];
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  rating: number;
  reviewCount: number;
  reviewsCount?: number;
  deliveryTime: string; // e.g. "25-35 mins"
  deliveryFee: number;
  minimumOrder: number;
  priceForTwo: number;
  isPureVeg: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  status: 'approved' | 'pending' | 'rejected' | 'suspended';
  openingHours: string;
  featuredOffer?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  imageUrl: string;
  itemCount: number;
  active: boolean;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  categoryId?: string;
  categoryName: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  isVegetarian: boolean;
  isPremium?: boolean;
  isAvailable: boolean;
  isBestSeller?: boolean;
  preparationTime?: string;
  spicyLevel?: 1 | 2 | 3;
  allergens?: string[];
  ingredients?: string[];
  rating: number;
  reviewsCount: number;
  customAddons?: AddonOption[];
  createdAt?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: AddonOption[];
  specialInstructions?: string;
  unitPrice: number;
  itemTotal: number;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'cash_on_delivery' | 'cod' | 'netbanking';

export interface OrderItem {
  menuItemId?: string;
  id?: string;
  name: string;
  price?: number;
  unitPrice?: number;
  totalPrice?: number;
  quantity: number;
  isVegetarian: boolean;
  selectedAddons?: AddonOption[];
  specialInstructions?: string;
  imageUrl?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
}

export interface DriverInfo {
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  rating: number;
  avatarUrl: string;
  currentLat?: number;
  currentLng?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  restaurantAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  packagingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  contactlessDelivery?: boolean;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  status?: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  driver?: DriverInfo;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
  reviewed?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  restaurantId: string;
  restaurantName?: string;
  menuItemId?: string;
  menuItemName?: string;
  orderId: string;
  rating: number;
  foodRating?: number;
  deliveryRating?: number;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  title?: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder?: number;
  minOrderAmount?: number;
  maximumDiscount?: number;
  maxDiscount?: number;
  expiryDate: string;
  active: boolean;
  bannerColor?: string;
  tag?: string;
}

export interface Offer {
  id: string;
  restaurantId?: string;
  restaurantName?: string;
  title: string;
  description: string;
  discount: string;
  couponCode: string;
  expiryDate: string;
  active: boolean;
  imageUrl: string;
  badge: string;
  accentColor: string;
}

export interface Notification {
  id: string;
  userId: string;
  role?: UserRole;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'system' | 'review' | 'account';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface RestaurantAnalytics {
  dailyOrders: { date: string; orders: number; revenue: number }[];
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  popularItems: { name: string; count: number; revenue: number }[];
  averageOrderValue: number;
  ratingDistribution: { stars: number; count: number }[];
}

export interface PlatformStats {
  totalUsers: number;
  totalCustomers: number;
  totalRestaurantOwners: number;
  totalRestaurants: number;
  activeRestaurants: number;
  pendingRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}
