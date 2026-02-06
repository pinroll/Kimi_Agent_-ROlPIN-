import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

export function Hero3D() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 15]);

  // Transform for parallax layers
  const layer1X = useTransform(smoothMouseX, [-0.5, 0.5], [30, -30]);
  const layer1Y = useTransform(smoothMouseY, [-0.5, 0.5], [30, -30]);
  const layer2X = useTransform(smoothMouseX, [-0.5, 0.5], [60, -60]);
  const layer2Y = useTransform(smoothMouseY, [-0.5, 0.5], [60, -60]);
  const layer3X = useTransform(smoothMouseX, [-0.5, 0.5], [90, -90]);
  const layer3Y = useTransform(smoothMouseY, [-0.5, 0.5], [90, -90]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(normalizedX * 0.5);
      mouseY.set(normalizedY * 0.5);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 1 - Far */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            x: layer3X,
            y: layer3Y,
            background: 'radial-gradient(circle, rgba(0, 212, 170, 0.08) 0%, transparent 70%)',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            x: layer3X,
            y: layer3Y,
            background: 'radial-gradient(circle, rgba(0, 180, 216, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Layer 2 - Mid */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full"
          style={{
            x: layer2X,
            y: layer2Y,
            background: 'radial-gradient(circle, rgba(0, 212, 170, 0.12) 0%, transparent 70%)',
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full"
          style={{
            x: layer2X,
            y: layer2Y,
            background: 'radial-gradient(circle, rgba(0, 119, 182, 0.12) 0%, transparent 70%)',
          }}
        />

        {/* Layer 3 - Near */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
          style={{
            x: layer1X,
            y: layer1Y,
          }}
        >
          <div className="w-full h-full rounded-full bg-primary/20 blur-2xl" />
        </motion.div>

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 170, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 170, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main content with 3D effect */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto perspective-1000"
        style={{
          rotateX: isHovering ? rotateX : 0,
          rotateY: isHovering ? rotateY : 0,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Welcome to the Future
          </span>
        </motion.div>

        {/* Main title with letter animation */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="block text-white mb-2">
            {'The Future of'.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.03,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </span>
          <span className="block gradient-text">
            {'Shopping'.split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + i * 0.05,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.button
            onClick={scrollToProducts}
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('hero.cta')}
          </motion.button>
          <motion.button
            className="btn-secondary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {[
            { value: '10K+', label: 'Products' },
            { value: '50K+', label: 'Customers' },
            { value: '99%', label: 'Satisfaction' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          onClick={scrollToProducts}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm">{t('hero.scroll')}</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </section>
  );
}
