// Language and Currency Types
export type Language = 'ar' | 'fr' | 'en';
export type Currency = 'DZD' | 'EUR' | 'USD';

// Product Types
export interface Product {
  id: string;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  description: {
    ar: string;
    fr: string;
    en: string;
  };
  price: {
    DZD: number;
    EUR: number;
    USD: number;
  };
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'ccp' | 'cod' | 'card';
export type DeliveryType = 'home' | 'office' | 'pickup';

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: {
    DZD: number;
    EUR: number;
    USD: number;
  };
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  deliveryType: DeliveryType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  state: string;
  address: string;
  deliveryType: DeliveryType;
}

// Admin Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: {
    DZD: number;
    EUR: number;
    USD: number;
  };
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  salesData: {
    labels: string[];
    data: number[];
  };
}

// Store Settings
export interface StoreSettings {
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  logo: string;
  paymentMethods: PaymentMethod[];
  shippingMethods: string[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

// Translation Types
export interface Translations {
  [key: string]: {
    ar: string;
    fr: string;
    en: string;
  };
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// Category Types
export interface Category {
  id: string;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  image: string;
  productCount: number;
}
