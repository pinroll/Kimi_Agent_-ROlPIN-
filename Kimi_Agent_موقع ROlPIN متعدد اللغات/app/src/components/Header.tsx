import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Globe, 
  ChevronDown,
  User,
  Search
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { language, setLanguage, t, dir } = useLanguage();
  const { currency, setCurrency, currencySymbol } = useCurrency();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'ar' as const, label: 'العربية', flag: '🇩🇿' },
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const currencies = [
    { code: 'DZD' as const, label: 'دينار جزائري', symbol: 'د.ج' },
    { code: 'EUR' as const, label: 'Euro', symbol: '€' },
    { code: 'USD' as const, label: 'US Dollar', symbol: '$' },
  ];

  const navItems = [
    { key: 'home', label: t('nav.home'), href: 'home' },
    { key: 'products', label: t('nav.products'), href: 'products' },
    { key: 'cart', label: t('nav.cart'), href: 'cart' },
    { key: 'admin', label: t('nav.admin'), href: 'admin' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass border-b border-border' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl md:text-3xl font-bold gradient-text">ROlPIN</span>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.key}
                onClick={() => onNavigate(item.href)}
                className={`relative text-sm font-medium transition-colors ${
                  currentPage === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {currentPage === item.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navIndicator"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <motion.button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsCurrencyOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </motion.button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 right-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[150px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-secondary transition-colors ${
                          language === lang.code ? 'text-primary bg-primary/10' : ''
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="text-sm">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <motion.button
                onClick={() => {
                  setIsCurrencyOpen(!isCurrencyOpen);
                  setIsLangOpen(false);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{currencySymbol}</span>
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3" />
              </motion.button>

              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 right-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[150px]"
                  >
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-secondary transition-colors ${
                          currency === curr.code ? 'text-primary bg-primary/10' : ''
                        }`}
                      >
                        <span>{curr.symbol}</span>
                        <span className="text-sm">{curr.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <motion.button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {/* User */}
            <motion.button
              onClick={() => onNavigate('admin')}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User className="w-5 h-5" />
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Currency Selector */}
              <div className="border-t border-border mt-2 pt-2">
                <p className="px-4 py-2 text-sm text-muted-foreground">{t('common.select')} Currency</p>
                <div className="flex gap-2 px-4">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrency(curr.code)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                        currency === curr.code
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {curr.symbol} {curr.code}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
