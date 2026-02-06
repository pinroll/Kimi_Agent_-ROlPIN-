import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { 
  CreditCard, 
  Truck, 
  Upload, 
  Check,
  MapPin,
  User,
  Building,
  Home,
  Package
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

const algerianStates = [
  'الجزائر العاصمة', 'وهران', 'قسنطينة', 'عنابة', 'باتنة', 'بجاية', 'بليدة', 'بويرة',
  'تلمسان', 'تيزي وزو', 'الجلفة', 'سطيف', 'سعيدة', 'سكيكدة', 'ميلة', 'المدية',
  'مستغانم', 'الوادي', 'البيض', 'بسكرة', 'بشار', 'الطارف', 'تندوف', 'تمنراست',
  'الأغواط', 'غرداية', ' Illizi', 'خنشلة', 'سوق أهراس', 'تيبازة', 'عين تموشنت',
  'غليزان', 'المسيلة', 'الشلف', 'برج بوعريريج', 'بومرداس', 'النعامة', 'أدرار',
  'تيسمسيلت', 'الوادي', 'خميس مليانة', 'أولاد جلال', 'بني عباس', 'عين صالح',
  'عين قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
];

export function Checkout({ onNavigate }: CheckoutProps) {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { items, totalPrice, clearCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    state: '',
    address: '',
    deliveryType: 'home' as const,
    paymentMethod: 'ccp' as const,
  });

  const shippingCost = { DZD: 500, EUR: 5, USD: 6 };
  const totalWithShipping = {
    DZD: totalPrice.DZD + shippingCost.DZD,
    EUR: totalPrice.EUR + shippingCost.EUR,
    USD: totalPrice.USD + shippingCost.USD,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
    clearCart();
  };

  const isStep1Valid = formData.fullName && formData.phone && formData.state && formData.address;
  const isStep2Valid = formData.paymentMethod && (formData.paymentMethod !== 'ccp' || paymentProof);

  if (items.length === 0 && !showSuccess) {
    return (
      <section className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">{t('checkout.title')}</span>
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 rounded ${
                    step > s ? 'bg-primary' : 'bg-secondary'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="checkout-section"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {t('checkout.customerInfo')}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.fullName')} *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.phone')} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="05XX XX XX XX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.state')} *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">{t('common.select')} State</option>
                        {algerianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.address')} *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-input min-h-[100px]"
                        placeholder="Enter your detailed address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.deliveryType')}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'home', icon: Home, label: t('checkout.deliveryHome') },
                          { id: 'office', icon: Building, label: t('checkout.deliveryOffice') },
                          { id: 'pickup', icon: MapPin, label: t('checkout.deliveryPickup') },
                        ].map((type) => (
                          <motion.button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, deliveryType: type.id as any }))}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                              formData.deliveryType === type.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <type.icon className="w-6 h-6" />
                            <span className="text-xs text-center">{type.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid}
                    className="w-full btn-primary mt-6 py-4"
                    whileHover={{ scale: isStep1Valid ? 1.02 : 1 }}
                    whileTap={{ scale: isStep1Valid ? 0.98 : 1 }}
                  >
                    {t('common.next')}
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="checkout-section"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    {t('checkout.paymentMethod')}
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: 'ccp', label: t('checkout.paymentCCP'), description: 'Pay via CCP transfer' },
                      { id: 'cod', label: t('checkout.paymentCOD'), description: 'Pay when you receive' },
                    ].map((method) => (
                      <motion.button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.paymentMethod === method.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="font-medium">{method.label}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </motion.button>
                    ))}

                    {/* CCP Payment Proof Upload */}
                    <AnimatePresence>
                      {formData.paymentMethod === 'ccp' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-secondary/50 rounded-xl">
                            <p className="text-sm mb-3">
                              Please transfer the amount to CCP account: <strong>123456789</strong>
                            </p>
                            <label className="file-upload">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium">
                                {paymentProof ? paymentProof.name : t('checkout.uploadProof')}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Click to upload screenshot
                              </p>
                            </label>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <motion.button
                      onClick={() => setStep(1)}
                      className="flex-1 btn-secondary py-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('common.back')}
                    </motion.button>
                    <motion.button
                      onClick={() => setStep(3)}
                      disabled={!isStep2Valid}
                      className="flex-1 btn-primary py-4"
                      whileHover={{ scale: isStep2Valid ? 1.02 : 1 }}
                      whileTap={{ scale: isStep2Valid ? 0.98 : 1 }}
                    >
                      {t('common.next')}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="checkout-section"
                >
                  <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name[language]}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name[language]}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">{formatPrice(item.product.price)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Customer Info Summary */}
                  <div className="p-4 bg-secondary/50 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Delivery Information</h3>
                    <p className="text-sm text-muted-foreground">{formData.fullName}</p>
                    <p className="text-sm text-muted-foreground">{formData.phone}</p>
                    <p className="text-sm text-muted-foreground">{formData.state}</p>
                    <p className="text-sm text-muted-foreground">{formData.address}</p>
                  </div>

                  {/* Total */}
                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('cart.total')}</span>
                      <span className="gradient-text">{formatPrice(totalWithShipping)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setStep(2)}
                      className="flex-1 btn-secondary py-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('common.back')}
                    </motion.button>
                    <motion.button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
                      whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          {t('checkout.processing')}
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          {t('checkout.placeOrder')}
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            className="lg:sticky lg:top-24 h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={() => {}}>
        <DialogContent className="max-w-md bg-card border-border text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Placed Successfully!</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We will contact you soon to confirm the details.
          </p>
          <motion.button
            onClick={() => onNavigate('home')}
            className="btn-primary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Shopping
          </motion.button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
