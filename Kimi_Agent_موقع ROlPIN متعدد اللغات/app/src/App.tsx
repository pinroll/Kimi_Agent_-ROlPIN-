import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { CartProvider } from '@/contexts/CartContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Header } from '@/components/Header';
import { Hero3D } from '@/components/Hero3D';
import { Products } from '@/components/Products';
import { Cart } from '@/components/Cart';
import { Checkout } from '@/components/Checkout';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Footer } from '@/components/Footer';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Header onNavigate={handleNavigate} currentPage={currentPage} />
            
            <main>
              <AnimatePresence mode="wait">
                {currentPage === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Hero3D />
                    <Products onNavigate={handleNavigate} />
                  </motion.div>
                )}

                {currentPage === 'products' && (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pt-20">
                      <Products onNavigate={handleNavigate} />
                    </div>
                  </motion.div>
                )}

                {currentPage === 'cart' && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Cart onNavigate={handleNavigate} />
                  </motion.div>
                )}

                {currentPage === 'checkout' && (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Checkout onNavigate={handleNavigate} />
                  </motion.div>
                )}

                {currentPage === 'admin' && (
                  <motion.div
                    key="admin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AdminDashboard onNavigate={handleNavigate} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {currentPage !== 'admin' && <Footer onNavigate={handleNavigate} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
          <AdminProvider>
            <AppContent />
          </AdminProvider>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;
