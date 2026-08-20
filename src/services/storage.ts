import {
  Address,
  Category,
  Coupon,
  MenuItem,
  Notification,
  Offer,
  Order,
  OrderStatus,
  PlatformStats,
  Restaurant,
  RestaurantAnalytics,
  Review,
  User,
  UserRole
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_MENU_ITEMS,
  INITIAL_OFFERS,
  INITIAL_RESTAURANTS,
  INITIAL_USERS
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'peters_foody_users_v1',
  CURRENT_USER: 'peters_foody_current_user_v1',
  RESTAURANTS: 'peters_foody_restaurants_v1',
  MENU_ITEMS: 'peters_foody_menu_items_v1',
  CATEGORIES: 'peters_foody_categories_v1',
  COUPONS: 'peters_foody_coupons_v1',
  OFFERS: 'peters_foody_offers_v1',
  ORDERS: 'peters_foody_orders_v1',
  REVIEWS: 'peters_foody_reviews_v1',
  FAVORITES: 'peters_foody_favorites_v1',
  ADDRESSES: 'peters_foody_addresses_v1',
  NOTIFICATIONS: 'peters_foody_notifications_v1',
};

// Initial default user address
const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-customer-1',
    label: 'home',
    name: 'Rohan Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Flat 402, Royal Palms Apartments',
    street: '12th Main, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    landmark: 'Near Corner House Ice Cream',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'user-customer-1',
    label: 'work',
    name: 'Rohan Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Tower B, 7th Floor, RMZ Infinity Tech Park',
    street: 'Old Madras Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560016',
    landmark: 'Opposite Gopalan Signature Mall',
    isDefault: false,
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-customer-1',
    userName: 'Rohan Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    restaurantId: 'rest-1',
    restaurantName: 'Spice Paradise',
    menuItemId: 'menu-1',
    menuItemName: 'Butter Chicken Grand Cru',
    orderId: 'PF-2025-1001',
    rating: 5,
    foodRating: 5,
    deliveryRating: 5,
    comment: 'The Butter Chicken Grand Cru was divine! Perfectly balanced sweetness, rich butter aroma, and the naan was piping hot on arrival.',
    createdAt: '2025-02-10T14:30:00.000Z'
  },
  {
    id: 'rev-2',
    userId: 'user-customer-2',
    userName: 'Ananya Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    restaurantId: 'rest-2',
    restaurantName: 'Pizza Palace',
    menuItemId: 'menu-5',
    menuItemName: 'Truffle Mushroom & Burrata Pizza',
    orderId: 'PF-2025-1002',
    rating: 5,
    foodRating: 5,
    deliveryRating: 4,
    comment: 'Authentic sourdough crust with generous burrata and truffle scent. Easily top 3 pizzas in Bangalore!',
    createdAt: '2025-02-12T19:15:00.000Z'
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-customer-1',
    role: 'customer',
    title: 'Welcome to Peter\'s Foody! 🍴',
    message: 'Use code FIRST50 for 50% discount on your first royal order.',
    type: 'offer',
    read: false,
    link: '/offers',
    createdAt: new Date().toISOString()
  }
];

function get<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to storage', e);
  }
}

export const StorageService = {
  // Initialize default data if not present
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      set(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
      set(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
      set(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      set(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
      set(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      set(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADDRESSES)) {
      set(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      set(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      set(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      set(STORAGE_KEYS.FAVORITES, {
        restaurants: ['rest-1', 'rest-2'],
        foods: ['menu-1', 'menu-5']
      });
    }
  },

  // USERS & AUTH
  getUsers(): User[] {
    return get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getCurrentUser(): User {
    return get<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  setCurrentUser(user: User): void {
    set(STORAGE_KEYS.CURRENT_USER, user);
  },

  login(email: string, role?: UserRole): User | null {
    const users = this.getUsers();
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found && role) {
      found = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        phone: '+91 98000 00000',
        role: role,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      users.push(found);
      set(STORAGE_KEYS.USERS, users);
    }
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    return null;
  },

  signup(name: string, email: string, phone: string, role: UserRole): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      status: 'active',
      restaurantId: role === 'restaurant_owner' ? 'rest-1' : undefined
    };
    users.push(newUser);
    set(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  updateUser(updated: Partial<User> & { id: string }): User {
    const users = this.getUsers().map(u => u.id === updated.id ? { ...u, ...updated } : u);
    set(STORAGE_KEYS.USERS, users);
    const currentUser = this.getCurrentUser();
    if (currentUser.id === updated.id) {
      const merged = { ...currentUser, ...updated };
      this.setCurrentUser(merged);
      return merged;
    }
    return users.find(u => u.id === updated.id)!;
  },

  toggleUserStatus(userId: string): User[] {
    const users = this.getUsers().map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' } as User;
      }
      return u;
    });
    set(STORAGE_KEYS.USERS, users);
    return users;
  },

  // RESTAURANTS
  getRestaurants(): Restaurant[] {
    return get<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
  },

  getRestaurantById(id: string): Restaurant | undefined {
    return this.getRestaurants().find(r => r.id === id);
  },

  saveRestaurant(restaurant: Restaurant): void {
    const restaurants = this.getRestaurants();
    const index = restaurants.findIndex(r => r.id === restaurant.id);
    if (index >= 0) {
      restaurants[index] = restaurant;
    } else {
      restaurants.push(restaurant);
    }
    set(STORAGE_KEYS.RESTAURANTS, restaurants);
  },

  updateRestaurantStatus(id: string, status: Restaurant['status']): Restaurant[] {
    const restaurants = this.getRestaurants().map(r => r.id === id ? { ...r, status } : r);
    set(STORAGE_KEYS.RESTAURANTS, restaurants);
    return restaurants;
  },

  // MENU ITEMS
  getMenuItems(): MenuItem[] {
    return get<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
  },

  getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
    return this.getMenuItems().filter(m => m.restaurantId === restaurantId);
  },

  getMenuItemById(id: string): MenuItem | undefined {
    return this.getMenuItems().find(m => m.id === id);
  },

  saveMenuItem(item: MenuItem): void {
    const items = this.getMenuItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    set(STORAGE_KEYS.MENU_ITEMS, items);
  },

  deleteMenuItem(id: string): void {
    const items = this.getMenuItems().filter(i => i.id !== id);
    set(STORAGE_KEYS.MENU_ITEMS, items);
  },

  toggleMenuItemAvailability(id: string): MenuItem[] {
    const items = this.getMenuItems().map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i);
    set(STORAGE_KEYS.MENU_ITEMS, items);
    return items;
  },

  // CATEGORIES
  getCategories(): Category[] {
    return get<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    set(STORAGE_KEYS.CATEGORIES, categories);
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    set(STORAGE_KEYS.CATEGORIES, categories);
  },

  // COUPONS
  getCoupons(): Coupon[] {
    return get<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  saveCoupon(coupon: Coupon): void {
    const coupons = this.getCoupons();
    const index = coupons.findIndex(c => c.id === coupon.id);
    if (index >= 0) {
      coupons[index] = coupon;
    } else {
      coupons.push(coupon);
    }
    set(STORAGE_KEYS.COUPONS, coupons);
  },

  deleteCoupon(id: string): void {
    const coupons = this.getCoupons().filter(c => c.id !== id);
    set(STORAGE_KEYS.COUPONS, coupons);
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code.' };
    }
    if (!coupon.active) {
      return { valid: false, discount: 0, message: 'This coupon has expired or is inactive.' };
    }
    if (subtotal < coupon.minimumOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ₹${coupon.minimumOrder} required for ${coupon.code}.`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      message: `Coupon applied successfully! You saved ₹${discount}.`,
      coupon
    };
  },

  // OFFERS
  getOffers(): Offer[] {
    return get<Offer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  },

  saveOffer(offer: Offer): void {
    const offers = this.getOffers();
    const index = offers.findIndex(o => o.id === offer.id);
    if (index >= 0) {
      offers[index] = offer;
    } else {
      offers.push(offer);
    }
    set(STORAGE_KEYS.OFFERS, offers);
  },

  deleteOffer(id: string): void {
    const offers = this.getOffers().filter(o => o.id !== id);
    set(STORAGE_KEYS.OFFERS, offers);
  },

  // ADDRESSES
  getAddresses(userId?: string): Address[] {
    const all = get<Address[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
    if (!userId) return all;
    return all.filter(a => a.userId === userId);
  },

  saveAddress(address: Address): Address {
    const addresses = get<Address[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
    const index = addresses.findIndex(a => a.id === address.id);
    if (address.isDefault) {
      addresses.forEach(a => {
        if (a.userId === address.userId) a.isDefault = false;
      });
    }
    if (index >= 0) {
      addresses[index] = address;
    } else {
      addresses.push(address);
    }
    set(STORAGE_KEYS.ADDRESSES, addresses);
    return address;
  },

  deleteAddress(id: string): void {
    const addresses = get<Address[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES).filter(a => a.id !== id);
    set(STORAGE_KEYS.ADDRESSES, addresses);
  },

  // ORDERS
  getOrders(): Order[] {
    return get<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id || o.orderNumber === id);
  },

  getUserOrders(userId: string): Order[] {
    return this.getOrders().filter(o => o.userId === userId);
  },

  getRestaurantOrders(restaurantId: string): Order[] {
    return this.getOrders().filter(o => o.restaurantId === restaurantId);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Order {
    const orders = this.getOrders();
    const dateStr = new Date().toISOString();
    const orderNumber = `PF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: dateStr,
      updatedAt: dateStr,
      statusHistory: [
        {
          status: 'placed',
          timestamp: dateStr,
          title: 'Order Placed',
          description: `Order ${orderNumber} placed successfully with ${orderData.restaurantName}.`
        }
      ],
      driver: {
        name: 'Suresh Kumar',
        phone: '+91 98765 11223',
        vehicle: 'Hero Electric Optima',
        vehicleNumber: 'KA-01-EQ-4421',
        rating: 4.9,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        currentLat: 12.9716,
        currentLng: 77.5946
      }
    };

    orders.unshift(newOrder);
    set(STORAGE_KEYS.ORDERS, orders);

    // Create notifications for user and restaurant
    this.createNotification({
      userId: newOrder.userId,
      role: 'customer',
      title: 'Order Placed! 🍽️',
      message: `Your order #${newOrder.orderNumber} for ₹${newOrder.total} is being confirmed.`,
      type: 'order',
      read: false,
      link: `/orders/${newOrder.id}`
    });

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | undefined {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return undefined;

    const order = orders[index];
    const dateStr = new Date().toISOString();

    const titles: Record<OrderStatus, string> = {
      placed: 'Order Placed',
      accepted: 'Restaurant Confirmed Order',
      confirmed: 'Restaurant Confirmed Order',
      preparing: 'Kitchen Preparing Your Meal',
      ready: 'Food Packed & Ready for Pickup',
      out_for_delivery: 'Out for Delivery with Partner',
      delivered: 'Order Delivered Successfully 🎉',
      cancelled: 'Order Cancelled'
    };

    const descriptions: Record<OrderStatus, string> = {
      placed: 'Order has been placed by the customer.',
      accepted: `${order.restaurantName} accepted your order and sent it to the chef.`,
      confirmed: `${order.restaurantName} accepted your order and sent it to the chef.`,
      preparing: 'The chef is tossing fresh ingredients and cooking your order.',
      ready: 'Your order is packed in insulated thermal packaging and ready for delivery partner.',
      out_for_delivery: `${order.driver?.name || 'Delivery executive'} is on the way to your address.`,
      delivered: 'Enjoy your meal! Please rate your experience with us.',
      cancelled: 'This order was cancelled.'
    };

    const historyItem = {
      status,
      timestamp: dateStr,
      title: titles[status] || status,
      description: note || descriptions[status] || ''
    };

    const updatedOrder: Order = {
      ...order,
      orderStatus: status,
      updatedAt: dateStr,
      statusHistory: [...order.statusHistory, historyItem]
    };

    orders[index] = updatedOrder;
    set(STORAGE_KEYS.ORDERS, orders);

    this.createNotification({
      userId: order.userId,
      role: 'customer',
      title: titles[status],
      message: note || descriptions[status],
      type: 'order',
      read: false,
      link: `/orders/${order.id}`
    });

    return updatedOrder;
  },

  // REVIEWS
  getReviews(restaurantId?: string): Review[] {
    const all = get<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (!restaurantId) return all;
    return all.filter(r => r.restaurantId === restaurantId);
  },

  addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const reviews = get<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    reviews.unshift(newReview);
    set(STORAGE_KEYS.REVIEWS, reviews);

    // Update restaurant average rating
    const restReviews = reviews.filter(r => r.restaurantId === reviewData.restaurantId);
    const avg = Number((restReviews.reduce((sum, r) => sum + r.rating, 0) / restReviews.length).toFixed(1));
    const restaurant = this.getRestaurantById(reviewData.restaurantId);
    if (restaurant) {
      this.saveRestaurant({
        ...restaurant,
        rating: avg,
        reviewCount: restReviews.length
      });
    }

    // Mark order as reviewed
    if (reviewData.orderId) {
      const orders = this.getOrders();
      const oIdx = orders.findIndex(o => o.id === reviewData.orderId);
      if (oIdx >= 0) {
        orders[oIdx].reviewed = true;
        set(STORAGE_KEYS.ORDERS, orders);
      }
    }

    return newReview;
  },

  // FAVORITES
  getFavorites(): { restaurants: string[]; foods: string[] } {
    return get(STORAGE_KEYS.FAVORITES, { restaurants: ['rest-1', 'rest-2'], foods: ['menu-1', 'menu-5'] });
  },

  toggleFavoriteRestaurant(restaurantId: string): string[] {
    const favs = this.getFavorites();
    const index = favs.restaurants.indexOf(restaurantId);
    if (index >= 0) {
      favs.restaurants.splice(index, 1);
    } else {
      favs.restaurants.push(restaurantId);
    }
    set(STORAGE_KEYS.FAVORITES, favs);
    return favs.restaurants;
  },

  toggleFavoriteFood(foodId: string): string[] {
    const favs = this.getFavorites();
    const index = favs.foods.indexOf(foodId);
    if (index >= 0) {
      favs.foods.splice(index, 1);
    } else {
      favs.foods.push(foodId);
    }
    set(STORAGE_KEYS.FAVORITES, favs);
    return favs.foods;
  },

  // NOTIFICATIONS
  getNotifications(userId: string): Notification[] {
    const all = get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => n.userId === userId || !n.userId);
  },

  createNotification(notifData: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const notifs = get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: Notification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    notifs.unshift(newNotif);
    set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  },

  markNotificationRead(id: string): void {
    const notifs = get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS).map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    set(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  markAllNotificationsRead(userId: string): void {
    const notifs = get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS).map(n =>
      n.userId === userId ? { ...n, read: true } : n
    );
    set(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // ANALYTICS & STATS
  getRestaurantAnalytics(restaurantId: string): RestaurantAnalytics {
    const orders = this.getRestaurantOrders(restaurantId);
    const totalOrders = orders.length || 18;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) || 12480;

    return {
      dailyOrders: [
        { date: 'Mon', orders: 12, revenue: 4800 },
        { date: 'Tue', orders: 15, revenue: 6200 },
        { date: 'Wed', orders: 18, revenue: 7400 },
        { date: 'Thu', orders: 14, revenue: 5900 },
        { date: 'Fri', orders: 26, revenue: 11200 },
        { date: 'Sat', orders: 34, revenue: 16800 },
        { date: 'Sun', orders: 38, revenue: 19400 },
      ],
      weeklyRevenue: 71700,
      monthlyRevenue: 284500,
      totalOrders,
      popularItems: [
        { name: 'Butter Chicken Grand Cru', count: 142, revenue: 48280 },
        { name: 'Royal Paneer Butter Masala', count: 98, revenue: 28420 },
        { name: 'Mughlai Chicken Dum Biryani', count: 184, revenue: 64400 },
      ],
      averageOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 580,
      ratingDistribution: [
        { stars: 5, count: 85 },
        { stars: 4, count: 12 },
        { stars: 3, count: 2 },
        { stars: 2, count: 1 },
        { stars: 1, count: 0 },
      ]
    };
  },

  getPlatformStats(): PlatformStats {
    const users = this.getUsers();
    const restaurants = this.getRestaurants();
    const orders = this.getOrders();

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 142500;
    const totalOrders = orders.length + 320;

    return {
      totalUsers: users.length + 1240,
      totalCustomers: users.filter(u => u.role === 'customer').length + 1180,
      totalRestaurantOwners: users.filter(u => u.role === 'restaurant_owner').length + 42,
      totalRestaurants: restaurants.length,
      activeRestaurants: restaurants.filter(r => r.status === 'approved').length,
      pendingRestaurants: restaurants.filter(r => r.status === 'pending').length,
      totalOrders,
      totalRevenue,
      todayOrders: 42,
      todayRevenue: 24850
    };
  },

  // Aliases for component convenience
  getOrdersByUser(userId: string): Order[] {
    return this.getUserOrders(userId);
  },

  getOrdersByRestaurant(restaurantId: string): Order[] {
    return this.getRestaurantOrders(restaurantId);
  },

  getReviewsByRestaurant(restaurantId: string): Review[] {
    return this.getReviews(restaurantId);
  },

  updateRestaurant(id: string, partial: Partial<Restaurant>): Restaurant | undefined {
    const restaurants = this.getRestaurants();
    const index = restaurants.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    restaurants[index] = { ...restaurants[index], ...partial };
    set(STORAGE_KEYS.RESTAURANTS, restaurants);
    return restaurants[index];
  },

  createMenuItem(data: Partial<MenuItem>): MenuItem {
    const items = this.getMenuItems();
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      restaurantId: data.restaurantId || 'rest-1',
      restaurantName: data.restaurantName || '',
      categoryName: data.categoryName || 'Main Course',
      name: data.name || 'Special Dish',
      description: data.description || '',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      price: data.price || 299,
      isVegetarian: !!data.isVegetarian,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      isBestSeller: !!data.isBestSeller,
      isPremium: !!data.isPremium,
      rating: 4.8,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      customAddons: data.customAddons || [],
    };
    items.unshift(newItem);
    set(STORAGE_KEYS.MENU_ITEMS, items);
    return newItem;
  },

  updateMenuItem(id: string, partial: Partial<MenuItem>): MenuItem | undefined {
    const items = this.getMenuItems();
    const index = items.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...partial };
    set(STORAGE_KEYS.MENU_ITEMS, items);
    return items[index];
  },

  createCoupon(data: Partial<Coupon>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: (data.code || 'SAVE20').toUpperCase(),
      title: data.title || `Special Offer`,
      description: data.description || 'Enjoy flat discount on your gourmet order',
      discountType: data.discountType || 'percentage',
      discountValue: data.discountValue || 20,
      minimumOrder: data.minimumOrder || data.minOrderAmount || 299,
      minOrderAmount: data.minOrderAmount || data.minimumOrder || 299,
      maximumDiscount: data.maximumDiscount || data.maxDiscount || 100,
      maxDiscount: data.maxDiscount || data.maximumDiscount || 100,
      expiryDate: data.expiryDate || '2026-12-31',
      active: data.active !== undefined ? data.active : true,
    };
    coupons.unshift(newCoupon);
    set(STORAGE_KEYS.COUPONS, coupons);
    return newCoupon;
  },

  updateCoupon(id: string, partial: Partial<Coupon>): Coupon | undefined {
    const coupons = this.getCoupons();
    const index = coupons.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    coupons[index] = { ...coupons[index], ...partial };
    set(STORAGE_KEYS.COUPONS, coupons);
    return coupons[index];
  }
};

// Initialize right away
StorageService.init();
