import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product, Order, Review, StoreSettings, DashboardStats } from '@/types';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: {
      ar: 'سماعات لاسلكية فاخرة',
      fr: 'Écouteurs sans fil premium',
      en: 'Premium Wireless Earbuds',
    },
    description: {
      ar: 'سماعات عالية الجودة مع إلغاء الضوضاء النشط',
      fr: 'Écouteurs haute qualité avec réduction active du bruit',
      en: 'High-quality earbuds with active noise cancellation',
    },
    price: { DZD: 15000, EUR: 99, USD: 109 },
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop'],
    category: 'electronics',
    stock: 50,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: {
      ar: 'ساعة ذكية متطورة',
      fr: 'Montre connectée avancée',
      en: 'Advanced Smartwatch',
    },
    description: {
      ar: 'ساعة ذكية مع تتبع اللياقة البدنية ومراقبة الصحة',
      fr: 'Montre connectée avec suivi fitness et surveillance de la santé',
      en: 'Smartwatch with fitness tracking and health monitoring',
    },
    price: { DZD: 25000, EUR: 165, USD: 179 },
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop'],
    category: 'electronics',
    stock: 30,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: {
      ar: 'حقيبة جلدية أنيقة',
      fr: 'Sac en cuir élégant',
      en: 'Elegant Leather Bag',
    },
    description: {
      ar: 'حقيبة يد فاخرة مصنوعة من الجلد الطبيعي',
      fr: 'Sac à main luxueux en cuir véritable',
      en: 'Luxury handbag made from genuine leather',
    },
    price: { DZD: 18000, EUR: 119, USD: 129 },
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop'],
    category: 'fashion',
    stock: 25,
    rating: 4.3,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: {
      ar: 'نظارات شمسية فاخرة',
      fr: 'Lunettes de soleil luxueuses',
      en: 'Luxury Sunglasses',
    },
    description: {
      ar: 'نظارات شمسية عصرية مع حماية UV400',
      fr: 'Lunettes de soleil tendance avec protection UV400',
      en: 'Trendy sunglasses with UV400 protection',
    },
    price: { DZD: 8000, EUR: 53, USD: 59 },
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop'],
    category: 'fashion',
    stock: 40,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: {
      ar: 'ماوس ألعاب احترافي',
      fr: 'Souris gaming professionnelle',
      en: 'Pro Gaming Mouse',
    },
    description: {
      ar: 'ماوس ألعاب مع مستشعر عالي الدقة وإضاءة RGB',
      fr: 'Souris gaming avec capteur haute précision et éclairage RGB',
      en: 'Gaming mouse with high-precision sensor and RGB lighting',
    },
    price: { DZD: 6000, EUR: 40, USD: 44 },
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'],
    category: 'gaming',
    stock: 60,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: {
      ar: 'كيبورد ميكانيكي',
      fr: 'Clavier mécanique',
      en: 'Mechanical Keyboard',
    },
    description: {
      ar: 'كيبورد ميكانيكي مع مفاتيح زرقاء وإضاءة خلفية',
      fr: 'Clavier mécanique avec switches bleus et rétroéclairage',
      en: 'Mechanical keyboard with blue switches and backlighting',
    },
    price: { DZD: 12000, EUR: 79, USD: 87 },
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop'],
    category: 'gaming',
    stock: 35,
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock orders
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: {
      fullName: 'أحمد محمد',
      phone: '0555123456',
      state: 'الجزائر العاصمة',
      address: 'حي حسين داي، شارع 1 ماي',
      deliveryType: 'home',
    },
    items: [
      { product: mockProducts[0], quantity: 1 },
      { product: mockProducts[2], quantity: 2 },
    ],
    total: { DZD: 51000, EUR: 337, USD: 367 },
    status: 'pending',
    paymentMethod: 'ccp',
    deliveryType: 'home',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ORD-002',
    customer: {
      fullName: 'فاطمة الزهراء',
      phone: '0666789012',
      state: 'وهران',
      address: 'حي سانتا كروز، شارع محمد خيضر',
      deliveryType: 'office',
    },
    items: [
      { product: mockProducts[1], quantity: 1 },
    ],
    total: { DZD: 25000, EUR: 165, USD: 179 },
    status: 'processing',
    paymentMethod: 'cod',
    deliveryType: 'office',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ORD-003',
    customer: {
      fullName: 'كريم بن علي',
      phone: '0777345678',
      state: 'قسنطينة',
      address: 'حي الزياتين، شارع أحمد باي',
      deliveryType: 'pickup',
    },
    items: [
      { product: mockProducts[4], quantity: 2 },
      { product: mockProducts[5], quantity: 1 },
    ],
    total: { DZD: 24000, EUR: 159, USD: 175 },
    status: 'delivered',
    paymentMethod: 'cod',
    deliveryType: 'pickup',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  products: Product[];
  orders: Order[];
  reviews: Review[];
  settings: StoreSettings;
  stats: DashboardStats;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
}

const defaultSettings: StoreSettings = {
  name: {
    ar: 'ROlPIN',
    fr: 'ROlPIN',
    en: 'ROlPIN',
  },
  logo: '/logo.png',
  paymentMethods: ['ccp', 'cod'],
  shippingMethods: ['home', 'office', 'pickup'],
  contactInfo: {
    phone: '+213 555 123 456',
    email: 'contact@rolpin.com',
    address: 'Algiers, Algeria',
  },
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  const login = useCallback((username: string, password: string): boolean => {
    // Simple admin authentication (in production, use proper backend)
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, product: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...product, updatedAt: new Date() } : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
      )
    );
  }, []);

  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Calculate stats
  const stats: DashboardStats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce(
      (sum, order) => ({
        DZD: sum.DZD + order.total.DZD,
        EUR: sum.EUR + order.total.EUR,
        USD: sum.USD + order.total.USD,
      }),
      { DZD: 0, EUR: 0, USD: 0 }
    ),
    totalProducts: products.length,
    totalCustomers: new Set(orders.map((o) => o.customer.phone)).size,
    recentOrders: orders.slice(0, 5),
    salesData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [12000, 19000, 15000, 25000, 22000, 30000],
    },
  };

  // Collect all reviews from products
  const reviews = products.flatMap((p) => p.reviews);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        products,
        orders,
        reviews,
        settings,
        stats,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
