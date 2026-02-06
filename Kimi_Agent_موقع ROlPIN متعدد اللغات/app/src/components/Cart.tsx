// Cart component
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  Package
} from 'lucide-react';

interface CartProps {
  onNavigate: (page: string) => void;
}

export function Cart({ onNavigate }: CartProps) {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const shippingCost = { DZD: 500, EUR: 5, USD: 6 };
  const totalWithShipping = {
    DZD: totalPrice.DZD + shippingCost.DZD,
    EUR: totalPrice.EUR + shippingCost.EUR,
    USD: totalPrice.USD + shippingCost.USD,
  };

  if (items.length === 0) {
    return (
      <section className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
            <p className="text-muted-foreground mb-8">
              Discover our amazing products and add them to your cart.
            </p>
            <motion.button
              onClick={() => onNavigate('products')}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('cart.continueShopping')}
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">{t('cart.title')}</span>
          </h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="cart-item"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name[language]}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {item.product.name[language]}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate">
                        {item.product.category}
                      </p>
                      <p className="text-primary font-bold mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                        <motion.button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <motion.button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <motion.button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Clear Cart */}
            <motion.div
              className="mt-6 flex justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => onNavigate('products')}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                whileHover={{ x: -5 }}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                {t('cart.continueShopping')}
              </motion.button>
              <motion.button
                onClick={clearCart}
                className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </motion.button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:sticky lg:top-24 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">{t('cart.orderSummary')}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {t('cart.shipping')}
                  </span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="gradient-text">{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => onNavigate('checkout')}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('cart.checkout')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
