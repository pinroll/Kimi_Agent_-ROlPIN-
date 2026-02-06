import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  // Navigation
  'nav.home': {
    ar: 'الرئيسية',
    fr: 'Accueil',
    en: 'Home',
  },
  'nav.products': {
    ar: 'المنتجات',
    fr: 'Produits',
    en: 'Products',
  },
  'nav.cart': {
    ar: 'السلة',
    fr: 'Panier',
    en: 'Cart',
  },
  'nav.checkout': {
    ar: 'إتمام الطلب',
    fr: 'Commande',
    en: 'Checkout',
  },
  'nav.admin': {
    ar: 'لوحة التحكم',
    fr: 'Admin',
    en: 'Admin',
  },
  'nav.login': {
    ar: 'تسجيل الدخول',
    fr: 'Connexion',
    en: 'Login',
  },
  'nav.logout': {
    ar: 'تسجيل الخروج',
    fr: 'Déconnexion',
    en: 'Logout',
  },

  // Hero Section
  'hero.title': {
    ar: 'مستقبل التسوق',
    fr: 'L\'avenir du shopping',
    en: 'The Future of Shopping',
  },
  'hero.subtitle': {
    ar: 'اكتشف مجموعتنا الفريدة من المنتجات المتميزة',
    fr: 'Découvrez notre collection unique de produits premium',
    en: 'Discover our unique collection of premium products',
  },
  'hero.cta': {
    ar: 'تسوق الآن',
    fr: 'Acheter maintenant',
    en: 'Shop Now',
  },
  'hero.scroll': {
    ar: 'اسحب للأسفل',
    fr: 'Défiler vers le bas',
    en: 'Scroll Down',
  },

  // Products Section
  'products.title': {
    ar: 'منتجاتنا',
    fr: 'Nos Produits',
    en: 'Our Products',
  },
  'products.subtitle': {
    ar: 'اختيارنا المميز لأفضل المنتجات',
    fr: 'Notre sélection des meilleurs produits',
    en: 'Our curated selection of the best products',
  },
  'products.addToCart': {
    ar: 'أضف إلى السلة',
    fr: 'Ajouter au panier',
    en: 'Add to Cart',
  },
  'products.outOfStock': {
    ar: 'نفذت الكمية',
    fr: 'Rupture de stock',
    en: 'Out of Stock',
  },
  'products.viewDetails': {
    ar: 'عرض التفاصيل',
    fr: 'Voir les détails',
    en: 'View Details',
  },

  // Cart Section
  'cart.title': {
    ar: 'سلة التسوق',
    fr: 'Panier d\'achat',
    en: 'Shopping Cart',
  },
  'cart.empty': {
    ar: 'سلة التسوق فارغة',
    fr: 'Votre panier est vide',
    en: 'Your cart is empty',
  },
  'cart.continueShopping': {
    ar: 'مواصلة التسوق',
    fr: 'Continuer les achats',
    en: 'Continue Shopping',
  },
  'cart.subtotal': {
    ar: 'المجموع الفرعي',
    fr: 'Sous-total',
    en: 'Subtotal',
  },
  'cart.shipping': {
    ar: 'الشحن',
    fr: 'Livraison',
    en: 'Shipping',
  },
  'cart.total': {
    ar: 'المجموع الكلي',
    fr: 'Total',
    en: 'Total',
  },
  'cart.checkout': {
    ar: 'إتمام الطلب',
    fr: 'Passer la commande',
    en: 'Proceed to Checkout',
  },
  'cart.remove': {
    ar: 'إزالة',
    fr: 'Supprimer',
    en: 'Remove',
  },
  'cart.quantity': {
    ar: 'الكمية',
    fr: 'Quantité',
    en: 'Quantity',
  },

  // Checkout Section
  'checkout.title': {
    ar: 'إتمام الطلب',
    fr: 'Finaliser la commande',
    en: 'Complete Your Order',
  },
  'checkout.customerInfo': {
    ar: 'معلومات العميل',
    fr: 'Informations client',
    en: 'Customer Information',
  },
  'checkout.fullName': {
    ar: 'الاسم الكامل',
    fr: 'Nom complet',
    en: 'Full Name',
  },
  'checkout.phone': {
    ar: 'رقم الهاتف',
    fr: 'Téléphone',
    en: 'Phone Number',
  },
  'checkout.state': {
    ar: 'الولاية',
    fr: 'Wilaya',
    en: 'State',
  },
  'checkout.address': {
    ar: 'العنوان التفصيلي',
    fr: 'Adresse détaillée',
    en: 'Detailed Address',
  },
  'checkout.deliveryType': {
    ar: 'نوع التوصيل',
    fr: 'Type de livraison',
    en: 'Delivery Type',
  },
  'checkout.deliveryHome': {
    ar: 'توصيل إلى المنزل',
    fr: 'Livraison à domicile',
    en: 'Home Delivery',
  },
  'checkout.deliveryOffice': {
    ar: 'توصيل إلى المكتب',
    fr: 'Livraison au bureau',
    en: 'Office Delivery',
  },
  'checkout.deliveryPickup': {
    ar: 'نقطة الاستلام',
    fr: 'Point de retrait',
    en: 'Pickup Point',
  },
  'checkout.paymentMethod': {
    ar: 'طريقة الدفع',
    fr: 'Mode de paiement',
    en: 'Payment Method',
  },
  'checkout.paymentCCP': {
    ar: 'الدفع عبر CCP',
    fr: 'Paiement CCP',
    en: 'CCP Payment',
  },
  'checkout.paymentCOD': {
    ar: 'الدفع عند الاستلام',
    fr: 'Paiement à la livraison',
    en: 'Cash on Delivery',
  },
  'checkout.paymentCard': {
    ar: 'بطاقة بنكية',
    fr: 'Carte bancaire',
    en: 'Bank Card',
  },
  'checkout.uploadProof': {
    ar: 'رفع إثبات الدفع',
    fr: 'Télécharger la preuve de paiement',
    en: 'Upload Payment Proof',
  },
  'checkout.orderSummary': {
    ar: 'ملخص الطلب',
    fr: 'Résumé de la commande',
    en: 'Order Summary',
  },
  'checkout.placeOrder': {
    ar: 'تأكيد الطلب',
    fr: 'Confirmer la commande',
    en: 'Place Order',
  },
  'checkout.processing': {
    ar: 'جاري المعالجة...',
    fr: 'Traitement en cours...',
    en: 'Processing...',
  },

  // Admin Dashboard
  'admin.dashboard': {
    ar: 'لوحة التحكم',
    fr: 'Tableau de bord',
    en: 'Dashboard',
  },
  'admin.products': {
    ar: 'إدارة المنتجات',
    fr: 'Gestion des produits',
    en: 'Product Management',
  },
  'admin.orders': {
    ar: 'إدارة الطلبات',
    fr: 'Gestion des commandes',
    en: 'Order Management',
  },
  'admin.settings': {
    ar: 'إعدادات المتجر',
    fr: 'Paramètres du magasin',
    en: 'Store Settings',
  },
  'admin.reviews': {
    ar: 'تقييمات المنتجات',
    fr: 'Avis des produits',
    en: 'Product Reviews',
  },
  'admin.totalOrders': {
    ar: 'إجمالي الطلبات',
    fr: 'Total des commandes',
    en: 'Total Orders',
  },
  'admin.totalRevenue': {
    ar: 'إجمالي الإيرادات',
    fr: 'Revenus totaux',
    en: 'Total Revenue',
  },
  'admin.totalProducts': {
    ar: 'إجمالي المنتجات',
    fr: 'Total des produits',
    en: 'Total Products',
  },
  'admin.totalCustomers': {
    ar: 'إجمالي العملاء',
    fr: 'Total des clients',
    en: 'Total Customers',
  },
  'admin.recentOrders': {
    ar: 'أحدث الطلبات',
    fr: 'Commandes récentes',
    en: 'Recent Orders',
  },
  'admin.salesChart': {
    ar: 'مبيعات الشهر',
    fr: 'Ventes du mois',
    en: 'Monthly Sales',
  },

  // Common
  'common.search': {
    ar: 'بحث',
    fr: 'Rechercher',
    en: 'Search',
  },
  'common.filter': {
    ar: 'تصفية',
    fr: 'Filtrer',
    en: 'Filter',
  },
  'common.sort': {
    ar: 'ترتيب',
    fr: 'Trier',
    en: 'Sort',
  },
  'common.save': {
    ar: 'حفظ',
    fr: 'Sauvegarder',
    en: 'Save',
  },
  'common.cancel': {
    ar: 'إلغاء',
    fr: 'Annuler',
    en: 'Cancel',
  },
  'common.edit': {
    ar: 'تعديل',
    fr: 'Modifier',
    en: 'Edit',
  },
  'common.delete': {
    ar: 'حذف',
    fr: 'Supprimer',
    en: 'Delete',
  },
  'common.add': {
    ar: 'إضافة',
    fr: 'Ajouter',
    en: 'Add',
  },
  'common.view': {
    ar: 'عرض',
    fr: 'Voir',
    en: 'View',
  },
  'common.loading': {
    ar: 'جاري التحميل...',
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'common.error': {
    ar: 'حدث خطأ',
    fr: 'Une erreur s\'est produite',
    en: 'An error occurred',
  },
  'common.success': {
    ar: 'تم بنجاح',
    fr: 'Succès',
    en: 'Success',
  },
  'common.close': {
    ar: 'إغلاق',
    fr: 'Fermer',
    en: 'Close',
  },
  'common.back': {
    ar: 'رجوع',
    fr: 'Retour',
    en: 'Back',
  },
  'common.next': {
    ar: 'التالي',
    fr: 'Suivant',
    en: 'Next',
  },
  'common.submit': {
    ar: 'إرسال',
    fr: 'Soumettre',
    en: 'Submit',
  },
  'common.required': {
    ar: 'مطلوب',
    fr: 'Requis',
    en: 'Required',
  },
  'common.optional': {
    ar: 'اختياري',
    fr: 'Optionnel',
    en: 'Optional',
  },

  // Footer
  'footer.about': {
    ar: 'من نحن',
    fr: 'À propos',
    en: 'About Us',
  },
  'footer.contact': {
    ar: 'اتصل بنا',
    fr: 'Contact',
    en: 'Contact',
  },
  'footer.privacy': {
    ar: 'سياسة الخصوصية',
    fr: 'Politique de confidentialité',
    en: 'Privacy Policy',
  },
  'footer.terms': {
    ar: 'شروط الاستخدام',
    fr: 'Conditions d\'utilisation',
    en: 'Terms of Use',
  },
  'footer.rights': {
    ar: 'جميع الحقوق محفوظة',
    fr: 'Tous droits réservés',
    en: 'All rights reserved',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'ar';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key as keyof typeof translations];
      if (translation) {
        return translation[language];
      }
      return key;
    },
    [language]
  );

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
