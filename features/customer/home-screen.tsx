'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Bell,
  ChevronRight,
  House,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type CategoryChip = {
  id: string;
  label: string;
  emoji: string;
};

type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  gradient: string;
  accent: string;
  chips: string[];
};

type Product = {
  id: string;
  name: string;
  quantityLabel: string;
  price: number;
  mrp: number;
  discount?: string;
  category: string;
  emoji: string;
  placeholderGradient: string;
  accent: string;
  image?: string;
};

type CartLine = {
  id: string;
  quantity: number;
};

const categoryChips: CategoryChip[] = [
  { id: 'atta', emoji: '🌾', label: 'Atta & Flour' },
  { id: 'rice', emoji: '🍚', label: 'Rice & Grains' },
  { id: 'dal', emoji: '🫘', label: 'Dal & Pulses' },
  { id: 'oil', emoji: '🧈', label: 'Oils & Ghee' },
  { id: 'spices', emoji: '🌶️', label: 'Spices' },
  { id: 'snacks', emoji: '🍪', label: 'Snacks' },
  { id: 'beverages', emoji: '🥤', label: 'Beverages' },
  { id: 'household', emoji: '🧹', label: 'Household' },
  { id: 'care', emoji: '🧴', label: 'Personal Care' },
  { id: 'dairy', emoji: '🥛', label: 'Dairy' },
];

const shopCategories = [
  { id: 'atta-grid', emoji: '🌾', label: 'Atta', image: '/categories/atta.png', gradient: 'from-[#FFF1E6] to-[#FAD0B1]', accent: '#C67C2A' },
  { id: 'rice-grid', emoji: '🍚', label: 'Rice', image: '/categories/rice.png', gradient: 'from-[#E8F7FF] to-[#C7E8FF]', accent: '#2299DD' },
  { id: 'dal-grid', emoji: '🫘', label: 'Dal', image: '/categories/dal.png', gradient: 'from-[#FFF3CF] to-[#FFD96D]', accent: '#D4A017' },
  { id: 'oil-grid', emoji: '🧈', label: 'Oil', image: '/categories/oil.png', gradient: 'from-[#FFF4CC] to-[#FFD76F]', accent: '#D4A017' },
  { id: 'spices-grid', emoji: '🌶️', label: 'Spices', image: '/categories/spices.png', gradient: 'from-[#FFE8E8] to-[#FFB5B5]', accent: '#CC2222' },
  { id: 'sugar-grid', emoji: '🍬', label: 'Sugar', gradient: 'from-[#F3E8FF] to-[#DDD6FE]', accent: '#7C3AED' },
  { id: 'snacks-grid', emoji: '🍪', label: 'Snacks', gradient: 'from-[#FDE7D8] to-[#F6B78D]', accent: '#C76B2A' },
  { id: 'drinks-grid', emoji: '🥤', label: 'Drinks', gradient: 'from-[#E0F7FA] to-[#B2EBF2]', accent: '#00897B' },
  { id: 'dairy-grid', emoji: '🥛', label: 'Dairy', gradient: 'from-[#FFF9C4] to-[#FFF176]', accent: '#F9A825' },
  { id: 'household-grid', emoji: '🧹', label: 'Household', gradient: 'from-[#E8F5E9] to-[#C8E6C9]', accent: '#388E3C' },
];

const banners: Banner[] = [
  {
    id: 'offer',
    eyebrow: 'First Order Perk',
    title: 'Get 20% OFF on first order!',
    subtitle: 'Use code CHAHAL20 and stock your kitchen in one go.',
    gradient: 'from-[#CC2222] via-[#D62929] to-[#F35A5A]',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_22%)]',
    chips: ['Fast slots', 'Fresh staples', 'Quick checkout'],
  },
  {
    id: 'delivery',
    eyebrow: 'Delivery Saver',
    title: 'Free delivery on orders above ₹299',
    subtitle: 'Build a smart basket with pantry essentials and save more every time.',
    gradient: 'from-[#1C79D6] via-[#2299DD] to-[#4AB3EE]',
    accent:
      'bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_24%)]',
    chips: ['No surge fee', 'Doorstep drop', 'Real-time tracking'],
  },
  {
    id: 'staples',
    eyebrow: 'Pantry Essentials',
    title: 'Fresh Atta, Rice & Dal delivered in 30 min',
    subtitle: 'Daily stock-up, premium brands, and local favorites all in one fast basket.',
    gradient: 'from-[#CC2222] via-[#E0472B] to-[#F59E0B]',
    accent:
      'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.17),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_24%)]',
    chips: ['Trusted brands', 'Sealed packs', 'Fresh inventory'],
  },
];

const bestsellers: Product[] = [
  {
    id: 'aashirvaad-atta-5kg',
    name: 'Aashirvaad Atta',
    quantityLabel: '5 kg',
    price: 240,
    mrp: 280,
    discount: '15% OFF',
    category: 'Atta & Flour',
    emoji: '🌾',
    placeholderGradient: 'from-[#FFF1E6] via-[#FFE3CC] to-[#FAD0B1]',
    accent: '#C67C2A',
    image: '/products/atta.png',
  },
  {
    id: 'india-gate-basmati-rice-5kg',
    name: 'India Gate Basmati Rice',
    quantityLabel: '5 kg',
    price: 420,
    mrp: 480,
    discount: '13% OFF',
    category: 'Rice & Grains',
    emoji: '🍚',
    placeholderGradient: 'from-[#E8F7FF] via-[#D8F1FF] to-[#C7E8FF]',
    accent: '#2299DD',
    image: '/products/rice.png',
  },
  {
    id: 'tata-salt-1kg',
    name: 'Tata Salt',
    quantityLabel: '1 kg',
    price: 28,
    mrp: 28,
    category: 'Spices',
    emoji: '🧂',
    placeholderGradient: 'from-[#F5F7FA] via-[#E9EDF4] to-[#DFE5EF]',
    accent: '#6B7280',
    image: '/products/salt.png',
  },
  {
    id: 'fortune-sunflower-oil-1l',
    name: 'Fortune Sunflower Oil',
    quantityLabel: '1 L',
    price: 135,
    mrp: 160,
    discount: '16% OFF',
    category: 'Oils & Ghee',
    emoji: '🧈',
    placeholderGradient: 'from-[#FFF4CC] via-[#FFE59A] to-[#FFD76F]',
    accent: '#D4A017',
    image: '/products/sunflower_oil.png',
  },
  {
    id: 'mdh-garam-masala-100g',
    name: 'MDH Garam Masala',
    quantityLabel: '100 g',
    price: 85,
    mrp: 95,
    discount: '11% OFF',
    category: 'Spices',
    emoji: '🌶️',
    placeholderGradient: 'from-[#FFE8E8] via-[#FFD1D1] to-[#FFB5B5]',
    accent: '#CC2222',
    image: '/products/garam_masala.png',
  },
  {
    id: 'maggi-noodles-pack-12',
    name: 'Maggi Noodles',
    quantityLabel: 'Pack of 12',
    price: 168,
    mrp: 192,
    discount: '13% OFF',
    category: 'Snacks',
    emoji: '🍜',
    placeholderGradient: 'from-[#FFF6D8] via-[#FFEFB3] to-[#FFE37A]',
    accent: '#E39A00',
    image: '/products/maggi.png',
  },
  {
    id: 'amul-butter-500g',
    name: 'Amul Butter',
    quantityLabel: '500 g',
    price: 270,
    mrp: 290,
    discount: '7% OFF',
    category: 'Dairy',
    emoji: '🥛',
    placeholderGradient: 'from-[#FFF1B8] via-[#FFE98D] to-[#FFD85B]',
    accent: '#D18A00',
    image: '/products/butter.png',
  },
  {
    id: 'parle-g-biscuits-800g',
    name: 'Parle-G Biscuits',
    quantityLabel: '800 g',
    price: 80,
    mrp: 90,
    discount: '11% OFF',
    category: 'Snacks',
    emoji: '🍪',
    placeholderGradient: 'from-[#FDE7D8] via-[#FAD0B0] to-[#F6B78D]',
    accent: '#C76B2A',
    image: '/products/parle_g.png',
  },
];

const dailyEssentials: Product[] = [
  {
    id: 'chana-dal-1kg',
    name: 'Chana Dal',
    quantityLabel: '1 kg',
    price: 92,
    mrp: 108,
    discount: '15% OFF',
    category: 'Dal & Pulses',
    emoji: '🫘',
    placeholderGradient: 'from-[#FFF3CF] via-[#FFE59A] to-[#FFD96D]',
    accent: '#D4A017',
    image: '/products/chana_dal.png',
  },
  {
    id: 'moong-dal-1kg',
    name: 'Moong Dal',
    quantityLabel: '1 kg',
    price: 118,
    mrp: 132,
    discount: '11% OFF',
    category: 'Dal & Pulses',
    emoji: '🫘',
    placeholderGradient: 'from-[#EDF9D7] via-[#DDF4B1] to-[#CBE98C]',
    accent: '#6E9E2B',
    image: '/products/moong_dal.png',
  },
  {
    id: 'sugar-5kg',
    name: 'Sugar',
    quantityLabel: '5 kg',
    price: 225,
    mrp: 250,
    discount: '10% OFF',
    category: 'Daily Essentials',
    emoji: '🍬',
    placeholderGradient: 'from-[#F6F8FC] via-[#E9EDF5] to-[#D9E2EF]',
    accent: '#94A3B8',
    image: '/products/sugar.png',
  },
  {
    id: 'mustard-oil-1l',
    name: 'Mustard Oil',
    quantityLabel: '1 L',
    price: 175,
    mrp: 198,
    discount: '12% OFF',
    category: 'Oils & Ghee',
    emoji: '🧈',
    placeholderGradient: 'from-[#FFF2C4] via-[#FFE38A] to-[#FFD04C]',
    accent: '#D69200',
    image: '/products/mustard_oil.png',
  },
];

const navItems = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'profile', label: 'Profile', icon: User },
] as const;

function formatCurrency(amount: number) {
  return `₹${new Intl.NumberFormat('en-IN').format(amount)}`;
}

function getSectionMotion(delay: number, reducedMotion: boolean) {
  return {
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reducedMotion ? 0.18 : 0.42,
      delay: reducedMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  };
}

function ProductCard({
  product,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  reducedMotion,
  compact = false,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  reducedMotion: boolean;
  compact?: boolean;
}) {
  const initial = product.name.charAt(0).toUpperCase();

  return (
    <motion.article
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.02 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`group overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-[0_12px_30px_rgba(26,26,46,0.05)] ${
        compact ? 'w-[15.5rem] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-none' : ''
      }`}
    >
      <div className="relative overflow-hidden bg-[#F5F7FA] p-3" style={{ aspectRatio: '1 / 1' }}>
        {product.discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#22C55E] px-2.5 py-1 text-[0.65rem] font-extrabold tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(34,197,94,0.28)]">
            {product.discount}
          </span>
        ) : null}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_42%)]" />
        <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/60 blur-xl" />
        <div className={`absolute inset-3 rounded-[24px] bg-gradient-to-br ${product.placeholderGradient} overflow-hidden`}>
          {product.image && (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          )}
        </div>

        {!product.image && (
          <div className="relative flex h-full items-center justify-center rounded-[24px]">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-white/90 text-4xl font-black shadow-[0_16px_34px_rgba(26,26,46,0.10)]"
              style={{ color: product.accent }}
            >
              {initial}
            </div>
            <span className="absolute bottom-4 right-4 text-2xl drop-shadow-sm">{product.emoji}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="min-h-[2.75rem]">
          <h3 className="product-name-clamp text-[14px] font-semibold leading-[1.35] text-[#1A1A2E]">
            {product.name}
          </h3>
        </div>
        <p className="mt-1 text-[12px] font-medium text-[#6B7280]">{product.quantityLabel}</p>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-[16px] font-extrabold text-[#1A1A2E]">{formatCurrency(product.price)}</span>
          {product.mrp > product.price ? (
            <span className="pb-0.5 text-[12px] font-medium text-[#9CA3AF] line-through">
              {formatCurrency(product.mrp)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 h-9">
          <AnimatePresence initial={false} mode="wait">
            {quantity === 0 ? (
              <motion.button
                key="add"
                layout
                initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={onAdd}
                className="flex h-full w-full items-center justify-center rounded-xl border-2 border-[#CC2222] bg-white text-[13px] font-extrabold tracking-[0.08em] text-[#CC2222] transition hover:bg-[#FFF5F5]"
              >
                ADD
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                layout
                initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full items-center justify-between rounded-xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-1.5 text-white shadow-[0_14px_26px_rgba(204,34,34,0.24)]"
              >
                <motion.button
                  whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                  onClick={onDecrement}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.14] transition hover:bg-white/[0.18]"
                  aria-label={`Remove one ${product.name}`}
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="text-sm font-extrabold">{quantity}</span>
                <motion.button
                  whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                  onClick={onIncrement}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.14] transition hover:bg-white/[0.18]"
                  aria-label={`Add one more ${product.name}`}
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`shimmer rounded-2xl bg-[#E9EDF4] ${className}`} />;
}

function HomeSkeleton() {
  return (
    <div className="space-y-6 pb-28">
      <section className="sticky top-0 z-20 bg-[#F5F7FA]/[0.95] px-4 pb-4 pt-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-5 w-48" />
            </div>
            <SkeletonBlock className="h-11 w-11 rounded-full" />
          </div>
          <SkeletonBlock className="h-12 w-full rounded-2xl" />
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={`chip-${index}`} className="h-10 w-32 shrink-0 rounded-full" />
          ))}
        </div>
        <SkeletonBlock className="h-[160px] w-full rounded-[28px] sm:h-[200px]" />
        <section className="space-y-4">
          <SkeletonBlock className="h-6 w-40" />
          <div className="grid grid-flow-col auto-cols-[88px] grid-rows-2 gap-3 overflow-hidden sm:grid-cols-5 sm:grid-flow-row sm:auto-cols-auto">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonBlock key={`cat-card-${index}`} className="h-[96px] w-[88px] rounded-2xl sm:h-[104px] sm:w-auto" />
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-6 w-36" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`product-skeleton-${index}`} className="overflow-hidden rounded-[22px] border border-gray-100 bg-white p-3">
                <SkeletonBlock className="h-40 w-full rounded-[20px]" />
                <SkeletonBlock className="mt-3 h-4 w-3/4" />
                <SkeletonBlock className="mt-2 h-3 w-1/3" />
                <SkeletonBlock className="mt-4 h-4 w-1/2" />
                <SkeletonBlock className="mt-4 h-9 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

type CustomerHomePageProps = {
  showBottomNav?: boolean;
};

export default function CustomerHomePage({
  showBottomNav = true,
}: CustomerHomePageProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [activeCategory, setActiveCategory] = useState(categoryChips[0].id);
  const [activeTab, setActiveTab] = useState<(typeof navItems)[number]['id']>('home');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('Sarabha Nagar, Ludhiana');
  const [hasScrolled, setHasScrolled] = useState(false);

  const allProducts = useMemo(() => {
    const map = new Map<string, Product>();

    [...bestsellers, ...dailyEssentials].forEach((product) => {
      map.set(product.id, product);
    });

    return Array.from(map.values());
  }, []);

  const productLookup = useMemo(
    () =>
      allProducts.reduce<Record<string, Product>>((accumulator, product) => {
        accumulator[product.id] = product;
        return accumulator;
      }, {}),
    [allProducts],
  );

  const quantityById = useMemo(
    () =>
      cartItems.reduce<Record<string, number>>((accumulator, item) => {
        accumulator[item.id] = item.quantity;
        return accumulator;
      }, {}),
    [cartItems],
  );

  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const product = productLookup[item.id];
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [cartItems, productLookup],
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredBestsellers = useMemo(() => {
    if (!normalizedQuery) {
      return bestsellers;
    }

    return bestsellers.filter((product) =>
      `${product.name} ${product.quantityLabel} ${product.category}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const filteredDailyEssentials = useMemo(() => {
    if (!normalizedQuery) {
      return dailyEssentials;
    }

    return dailyEssentials.filter((product) =>
      `${product.name} ${product.quantityLabel} ${product.category}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, shouldReduceMotion ? 120 : 950);

    return () => {
      window.clearTimeout(timer);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem('chahalbros_profile');

    if (!savedProfile) {
      return;
    }

    try {
      const profile = JSON.parse(savedProfile) as {
        landmark?: string;
        city?: string;
        state?: string;
        fullAddress?: string;
      };

      if (profile.landmark && profile.city) {
        setDeliveryAddress(`${profile.landmark}, ${profile.city}`);
        return;
      }

      if (profile.city && profile.state) {
        setDeliveryAddress(`${profile.city}, ${profile.state}`);
        return;
      }

      if (profile.fullAddress) {
        const segments = profile.fullAddress
          .split(',')
          .map((segment) => segment.trim())
          .filter(Boolean);

        if (segments.length >= 2) {
          setDeliveryAddress(`${segments[segments.length - 2]}, ${segments[segments.length - 1]}`);
        } else if (segments.length === 1) {
          setDeliveryAddress(segments[0]);
        }
      }
    } catch {
      window.localStorage.removeItem('chahalbros_profile');
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setBannerIndex((current) => (current + 1) % banners.length);
    }, 4000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isLoading]);

  function setQuantity(productId: string, nextQuantity: number) {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === productId);

      if (nextQuantity <= 0) {
        return current.filter((item) => item.id !== productId);
      }

      if (!existing) {
        return [...current, { id: productId, quantity: nextQuantity }];
      }

      return current.map((item) => (item.id === productId ? { ...item, quantity: nextQuantity } : item));
    });
  }

  function incrementQuantity(productId: string) {
    setQuantity(productId, (quantityById[productId] ?? 0) + 1);
  }

  function decrementQuantity(productId: string) {
    setQuantity(productId, (quantityById[productId] ?? 0) - 1);
  }

  function nextBanner() {
    setBannerIndex((current) => (current + 1) % banners.length);
  }

  function previousBanner() {
    setBannerIndex((current) => (current - 1 + banners.length) % banners.length);
  }

  function handleNavChange(nextTab: (typeof navItems)[number]['id']) {
    setActiveTab(nextTab);

    if (nextTab === 'search') {
      router.push('/search');
      return;
    }

    if (nextTab === 'cart') {
      router.push('/cart');
      return;
    }

    if (nextTab === 'orders') {
      router.push('/orders');
      return;
    }

    if (nextTab === 'profile') {
      router.push('/profile');
    }
  }

  const currentBanner = banners[bannerIndex];

  return (
    <>
      <main
        className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <>
            <motion.header
              {...getSectionMotion(0, shouldReduceMotion)}
              className={`sticky top-0 z-30 bg-white/[0.92] backdrop-blur-xl transition ${
                hasScrolled ? 'border-b border-black/5 shadow-[0_12px_30px_rgba(26,26,46,0.06)]' : ''
              }`}
            >
              <div className="mx-auto max-w-6xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
                <div className="flex items-start justify-between gap-4">
                  <button type="button" className="min-w-0 text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#6B7280]">
                      <MapPin className="h-4 w-4 shrink-0 text-[#CC2222]" />
                      Deliver to
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="truncate text-[15px] font-extrabold tracking-[-0.01em] text-[#1A1A2E]">
                        {deliveryAddress}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#6B7280]" />
                    </div>
                  </button>

                  <button
                    type="button"
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#1A1A2E] shadow-[0_8px_20px_rgba(26,26,46,0.06)] transition hover:bg-white"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#CC2222] ring-2 ring-white" />
                  </button>
                </div>

                <div className="mt-4 flex h-12 items-center gap-3 rounded-2xl bg-[#F0F2F5] px-4 shadow-inner">
                  <Search className="h-5 w-5 shrink-0 text-[#6B7280]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search for atta, rice, dal, ghee..."
                    className="h-full w-full border-0 bg-transparent text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>
            </motion.header>

            <div className="mx-auto max-w-6xl px-4 pb-40 pt-5 sm:px-6 lg:px-8">
              <motion.section
                {...getSectionMotion(0.1, shouldReduceMotion)}
                className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
              >
                {categoryChips.map((chip) => {
                  const isActive = chip.id === activeCategory;

                  return (
                    <motion.button
                      key={chip.id}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                      type="button"
                      onClick={() => setActiveCategory(chip.id)}
                      className={`snap-start whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'border-[#CC2222] bg-[#CC2222] text-white shadow-[0_14px_26px_rgba(204,34,34,0.22)]'
                          : 'border-gray-200 bg-white text-[#1A1A2E] hover:border-[#CC2222]/[0.25]'
                      }`}
                    >
                      <span className="mr-1.5">{chip.emoji}</span>
                      {chip.label}
                    </motion.button>
                  );
                })}
              </motion.section>

              <motion.section {...getSectionMotion(0.2, shouldReduceMotion)} className="mt-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentBanner.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x <= -60) {
                        nextBanner();
                      } else if (info.offset.x >= 60) {
                        previousBanner();
                      }
                    }}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
                    transition={{ duration: shouldReduceMotion ? 0.18 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative h-[160px] overflow-hidden rounded-[28px] bg-gradient-to-br ${currentBanner.gradient} ${currentBanner.accent} sm:h-[180px] lg:h-[200px]`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_0%,transparent_36%,rgba(255,255,255,0.08)_100%)]" />
                    <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute -right-6 top-0 h-28 w-28 rounded-full bg-white/[0.12] blur-xl" />

                    <div className="relative flex h-full items-end justify-between gap-4 p-5 sm:p-6">
                      <div className="max-w-[75%] text-white">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/[0.78]">
                          {currentBanner.eyebrow}
                        </p>
                        <h2 className="mt-2 max-w-md text-[1.55rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[1.9rem]">
                          {currentBanner.title}
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-white/[0.82]">{currentBanner.subtitle}</p>

                        <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
                          {currentBanner.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-white/[0.18] bg-white/[0.12] px-3 py-1 text-xs font-semibold text-white/[0.92] backdrop-blur-sm"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="hidden h-full flex-1 items-center justify-end sm:flex">
                        <div className="relative h-28 w-36 lg:h-32 lg:w-40">
                          <div className="absolute bottom-1 left-0 h-24 w-16 rounded-[22px] bg-white/[0.18] backdrop-blur-sm" />
                          <div className="absolute bottom-3 left-10 h-20 w-20 rounded-[26px] bg-white/[0.22] backdrop-blur-sm" />
                          <div className="absolute right-1 top-0 h-24 w-20 rounded-[28px] bg-white/[0.18] backdrop-blur-sm" />
                          <div className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.88] text-2xl">
                            {bannerIndex === 0 ? '🛍️' : bannerIndex === 1 ? '🚚' : '🌾'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {banners.map((banner, index) => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => setBannerIndex(index)}
                      className={`h-2 w-2 rounded-full transition ${
                        index === bannerIndex ? 'scale-110 bg-[#CC2222]' : 'bg-[#D1D5DB]'
                      }`}
                      aria-label={`Go to banner ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.section>

              <motion.section {...getSectionMotion(0.3, shouldReduceMotion)} className="mt-8">
                <div className="mb-4">
                  <h2 className="text-[1.05rem] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Shop by Category</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">Pick a lane and fill your basket fast.</p>
                </div>

                <div className="no-scrollbar grid grid-flow-col auto-cols-[88px] grid-rows-2 gap-3 overflow-x-auto pb-1 sm:grid-cols-5 sm:grid-flow-row sm:auto-cols-auto sm:overflow-visible">
                  {shopCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.04 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_12px_28px_rgba(26,26,46,0.06)] sm:w-auto"
                      style={{ width: 88, minWidth: 88 }}
                    >
                      <div
                        className={`relative flex h-[58px] w-full items-center justify-center bg-gradient-to-br ${category.gradient} overflow-hidden`}
                      >
                        {(category as { image?: string }).image ? (
                          <Image
                            src={(category as { image?: string }).image!}
                            alt={category.label}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-[2rem] drop-shadow-sm">{category.emoji}</span>
                        )}
                      </div>
                      <div className="px-1.5 py-2">
                        <span className="block text-center text-[11px] font-bold leading-tight text-[#1A1A2E]">{category.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.section>

              <motion.section {...getSectionMotion(0.4, shouldReduceMotion)} className="mt-8">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-[1.1rem] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">🔥 Bestsellers</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">Fast-moving staples everyone is reordering.</p>
                  </div>
                  <button type="button" className="flex items-center gap-1 text-sm font-bold text-[#2299DD]">
                    See all
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {filteredBestsellers.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-gray-200 bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
                    No bestsellers matched "{searchQuery}". Try another staple or clear the search.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {filteredBestsellers.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={quantityById[product.id] ?? 0}
                        onAdd={() => incrementQuantity(product.id)}
                        onIncrement={() => incrementQuantity(product.id)}
                        onDecrement={() => decrementQuantity(product.id)}
                        reducedMotion={shouldReduceMotion}
                      />
                    ))}
                  </div>
                )}
              </motion.section>

              <motion.section {...getSectionMotion(0.5, shouldReduceMotion)} className="mt-8">
                <div className="mb-4">
                  <h2 className="text-[1.05rem] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Daily Essentials</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">Regular pantry refills, ready for a quick restock.</p>
                </div>

                {filteredDailyEssentials.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-gray-200 bg-white px-5 py-10 text-center text-sm text-[#6B7280]">
                    No daily essentials matched "{searchQuery}".
                  </div>
                ) : (
                  <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
                    {filteredDailyEssentials.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={quantityById[product.id] ?? 0}
                        onAdd={() => incrementQuantity(product.id)}
                        onIncrement={() => incrementQuantity(product.id)}
                        onDecrement={() => decrementQuantity(product.id)}
                        reducedMotion={shouldReduceMotion}
                        compact
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            </div>
          </>
        )}

        <AnimatePresence>
          {totalItems > 0 ? (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 26 }}
              transition={{ duration: shouldReduceMotion ? 0.18 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 z-40 px-4 sm:px-6 lg:px-8"
              style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)' }}
            >
              <div className="mx-auto max-w-6xl">
                <button
                  type="button"
                  onClick={() => handleNavChange('cart')}
                  className="flex w-full items-center justify-between rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-5 py-4 text-left text-white shadow-[0_18px_36px_rgba(204,34,34,0.28)]"
                >
                  <div>
                    <p className="text-sm font-semibold text-white/[0.85]">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} <span className="px-1.5">|</span>{' '}
                      <span className="font-extrabold">{formatCurrency(cartTotal)}</span>
                    </p>
                    <p className="mt-1 text-xs text-white/[0.78]">Basket ready for a fast checkout</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-extrabold">
                    View Cart
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {showBottomNav ? (
          <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/[0.96] shadow-[0_-12px_30px_rgba(26,26,46,0.08)] backdrop-blur-xl"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.45rem)' }}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pb-1 pt-2 sm:px-6 lg:px-8">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavChange(item.id)}
                    className="relative flex min-w-[58px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center"
                  >
                    <div className="relative">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-[#CC2222]' : 'text-[#6B7280]'}`} />

                      {item.id === 'cart' && totalItems > 0 ? (
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={totalItems}
                            initial={shouldReduceMotion ? false : { scale: 0.65, y: 2 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0.15 : 0.26, ease: [0.34, 1.56, 0.64, 1] }}
                            className="absolute -right-2.5 -top-2 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#CC2222] px-1 text-[10px] font-extrabold text-white shadow-[0_10px_18px_rgba(204,34,34,0.24)]"
                          >
                            {totalItems}
                          </motion.span>
                        </AnimatePresence>
                      ) : null}
                    </div>

                    <span className={`text-[12px] font-semibold ${isActive ? 'text-[#CC2222]' : 'text-[#6B7280]'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        ) : null}
      </main>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .product-name-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 2;
        }

        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
