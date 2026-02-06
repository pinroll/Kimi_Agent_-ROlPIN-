import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  Star,
  LogOut,
  Users,
  DollarSign,
  Menu,
  X,
  Edit,
  Trash2,
  Check,
  XCircle,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { isAuthenticated, login, logout, stats, orders, products, updateOrderStatus } = useAdmin();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginData.username, loginData.password);
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">ROlPIN</h1>
              <p className="text-muted-foreground">Admin Dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  className="form-input"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Default: admin / admin123
              </p>
              <motion.button
                type="submit"
                className="w-full btn-primary py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('nav.login')}
              </motion.button>
            </form>

            <motion.button
              onClick={() => onNavigate('home')}
              className="w-full mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('common.back')} to Home
            </motion.button>
          </div>
        </motion.div>
      </section>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: LayoutDashboard },
    { id: 'products', label: t('admin.products'), icon: Package },
    { id: 'orders', label: t('admin.orders'), icon: ShoppingBag },
    { id: 'reviews', label: t('admin.reviews'), icon: Star },
    { id: 'settings', label: t('admin.settings'), icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-processing';
      case 'delivered': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return TrendingUp;
      case 'shipped': return Package;
      case 'delivered': return Check;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  return (
    <section className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
        <span className="text-xl font-bold gradient-text">ROlPIN Admin</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className={`${isSidebarOpen ? 'fixed inset-0 z-50 bg-background' : 'hidden lg:block'} lg:relative lg:w-64 lg:bg-card lg:border-r border-border`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold gradient-text">ROlPIN</h1>
                  <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </motion.button>
                  ))}
                </nav>

                <motion.button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors mt-8"
                  whileHover={{ x: 5 }}
                >
                  <LogOut className="w-5 h-5" />
                  {t('nav.logout')}
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <AnimatePresence mode="wait">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">{t('admin.dashboard')}</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: t('admin.totalOrders'), value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
                    { label: t('admin.totalRevenue'), value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-green-500' },
                    { label: t('admin.totalProducts'), value: stats.totalProducts, icon: Package, color: 'bg-purple-500' },
                    { label: t('admin.totalCustomers'), value: stats.totalCustomers, icon: Users, color: 'bg-orange-500' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="bg-card rounded-xl p-6 border border-border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="chart-container">
                    <h3 className="text-lg font-bold mb-4">{t('admin.salesChart')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.salesData.labels.map((label, i) => ({
                        name: label,
                        value: stats.salesData.data[i]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', border: '1px solid #2a2a2a' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#00d4aa" 
                          strokeWidth={2}
                          dot={{ fill: '#00d4aa' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-container">
                    <h3 className="text-lg font-bold mb-4">{t('admin.recentOrders')}</h3>
                    <div className="space-y-3">
                      {stats.recentOrders.map((order, i) => (
                        <motion.div
                          key={order.id}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.fullName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(order.total)}</p>
                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{t('admin.products')}</h2>
                  <motion.button
                    className="btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    + {t('common.add')} Product
                  </motion.button>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name[language]}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium">{product.name[language]}</span>
                          </td>
                          <td className="capitalize">{product.category}</td>
                          <td>{formatPrice(product.price)}</td>
                          <td>
                            <span className={product.stock < 10 ? 'text-red-500' : ''}>
                              {product.stock}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <motion.button
                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6">{t('admin.orders')}</h2>

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="font-medium">{order.id}</td>
                          <td>
                            <div>
                              <p>{order.customer.fullName}</p>
                              <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                            </div>
                          </td>
                          <td className="font-bold">{formatPrice(order.total)}</td>
                          <td>
                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <motion.button
                              onClick={() => setSelectedOrder(order)}
                              className="text-primary hover:underline"
                              whileHover={{ scale: 1.05 }}
                            >
                              View
                            </motion.button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6">{t('admin.reviews')}</h2>
                <div className="text-center py-20 text-muted-foreground">
                  <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet</p>
                </div>
              </motion.div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold mb-6">{t('admin.settings')}</h2>
                
                <div className="space-y-6 max-w-2xl">
                  <div className="checkout-section">
                    <h3 className="text-lg font-bold mb-4">Store Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Store Name</label>
                        <input type="text" className="form-input" defaultValue="ROlPIN" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Email</label>
                        <input type="email" className="form-input" defaultValue="contact@rolpin.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Phone</label>
                        <input type="tel" className="form-input" defaultValue="+213 555 123 456" />
                      </div>
                    </div>
                  </div>

                  <div className="checkout-section">
                    <h3 className="text-lg font-bold mb-4">Payment Methods</h3>
                    <div className="space-y-2">
                      {['CCP', 'Cash on Delivery', 'Bank Card'].map((method) => (
                        <label key={method} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    className="btn-primary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('common.save')} Changes
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Order {selectedOrder.id}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Customer</p>
                    <p className="font-medium">{selectedOrder.customer.fullName}</p>
                    <p className="text-sm">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Delivery</p>
                    <p className="font-medium">{selectedOrder.customer.state}</p>
                    <p className="text-sm">{selectedOrder.deliveryType}</p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Items</p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span>{item.product.name[language]} x{item.quantity}</span>
                      <span>{formatPrice(item.product.price)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold">
                    <span>Total</span>
                    <span className="gradient-text">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, status as any);
                        setSelectedOrder(null);
                      }}
                      className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
