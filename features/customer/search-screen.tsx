'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  IndianRupee,
  LayoutGrid,
  Minus,
  Plus,
  Search,
  Tags,
  X,
} from 'lucide-react';
import Image from 'next/image';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type Product = {
  id: string;
  name: string;
  brand: string;
  quantityLabel: string;
  price: number;
  mrp: number;
  discount?: string;
  category: string;
  emoji: string;
  placeholderGradient: string;
  accent: string;
  inStock: boolean;
  popularity: number;
  newestRank: number;
  image?: string;
};

type CartLine = {
  id: string;
  quantity: number;
};

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'popularity' | 'newest';
type SheetType = 'sort' | 'category' | 'price' | 'brand' | null;

const recentSearches = ['Atta', 'Rice', 'Ghee', 'Sugar'];

const products: Product[] = [
  {
    id: 'aashirvaad-atta-5kg',
    name: 'Aashirvaad Atta',
    brand: 'Aashirvaad',
    quantityLabel: '5 kg',
    price: 240,
    mrp: 280,
    discount: '15% OFF',
    category: 'Atta & Flour',
    emoji: '\u{1F33E}',
    placeholderGradient: 'from-[#FFF1E6] via-[#FFE3CC] to-[#FAD0B1]',
    accent: '#C67C2A',
    inStock: true,
    popularity: 98,
    newestRank: 6,
    image: '/products/atta.png',
  },
  {
    id: 'india-gate-basmati-rice-5kg',
    name: 'India Gate Basmati Rice',
    brand: 'India Gate',
    quantityLabel: '5 kg',
    price: 420,
    mrp: 480,
    discount: '13% OFF',
    category: 'Rice & Grains',
    emoji: '\u{1F35A}',
    placeholderGradient: 'from-[#E8F7FF] via-[#D8F1FF] to-[#C7E8FF]',
    accent: '#2299DD',
    inStock: true,
    popularity: 95,
    newestRank: 5,
    image: '/products/rice.png',
  },
  {
    id: 'tata-salt-1kg',
    name: 'Tata Salt',
    brand: 'Tata',
    quantityLabel: '1 kg',
    price: 28,
    mrp: 28,
    category: 'Spices',
    emoji: '\u{1F9C2}',
    placeholderGradient: 'from-[#F5F7FA] via-[#E9EDF4] to-[#DFE5EF]',
    accent: '#6B7280',
    inStock: true,
    popularity: 87,
    newestRank: 2,
    image: '/products/salt.png',
  },
  {
    id: 'fortune-sunflower-oil-1l',
    name: 'Fortune Sunflower Oil',
    brand: 'Fortune',
    quantityLabel: '1 L',
    price: 135,
    mrp: 160,
    discount: '16% OFF',
    category: 'Oils & Ghee',
    emoji: '\u{1F9C8}',
    placeholderGradient: 'from-[#FFF4CC] via-[#FFE59A] to-[#FFD76F]',
    accent: '#D4A017',
    inStock: true,
    popularity: 93,
    newestRank: 4,
    image: '/products/sunflower_oil.png',
  },
  {
    id: 'mdh-garam-masala-100g',
    name: 'MDH Garam Masala',
    brand: 'MDH',
    quantityLabel: '100 g',
    price: 85,
    mrp: 95,
    discount: '11% OFF',
    category: 'Spices',
    emoji: '\u{1F336}\uFE0F',
    placeholderGradient: 'from-[#FFE8E8] via-[#FFD1D1] to-[#FFB5B5]',
    accent: '#CC2222',
    inStock: true,
    popularity: 84,
    newestRank: 7,
    image: '/products/garam_masala.png',
  },
  {
    id: 'amul-ghee-1l',
    name: 'Amul Pure Ghee',
    brand: 'Amul',
    quantityLabel: '1 L',
    price: 610,
    mrp: 655,
    discount: '7% OFF',
    category: 'Oils & Ghee',
    emoji: '\u{1FAD9}',
    placeholderGradient: 'from-[#FFF3BE] via-[#FFE58A] to-[#FFD456]',
    accent: '#D18A00',
    inStock: true,
    popularity: 90,
    newestRank: 10,
  },
  {
    id: 'chana-dal-1kg',
    name: 'Chana Dal',
    brand: 'Chahal Bros',
    quantityLabel: '1 kg',
    price: 92,
    mrp: 108,
    discount: '15% OFF',
    category: 'Dal & Pulses',
    emoji: '\u{1FAD8}',
    placeholderGradient: 'from-[#FFF3CF] via-[#FFE59A] to-[#FFD96D]',
    accent: '#D4A017',
    inStock: true,
    popularity: 88,
    newestRank: 8,
    image: '/products/chana_dal.png',
  },
  {
    id: 'moong-dal-1kg',
    name: 'Moong Dal',
    brand: 'Chahal Bros',
    quantityLabel: '1 kg',
    price: 118,
    mrp: 132,
    discount: '11% OFF',
    category: 'Dal & Pulses',
    emoji: '\u{1FAD8}',
    placeholderGradient: 'from-[#EDF9D7] via-[#DDF4B1] to-[#CBE98C]',
    accent: '#6E9E2B',
    inStock: false,
    popularity: 82,
    newestRank: 3,
    image: '/products/moong_dal.png',
  },
  {
    id: 'sugar-5kg',
    name: 'Sugar',
    brand: 'Chahal Bros',
    quantityLabel: '5 kg',
    price: 225,
    mrp: 250,
    discount: '10% OFF',
    category: 'Daily Essentials',
    emoji: '\u{1F36C}',
    placeholderGradient: 'from-[#F6F8FC] via-[#E9EDF5] to-[#D9E2EF]',
    accent: '#94A3B8',
    inStock: true,
    popularity: 81,
    newestRank: 9,
    image: '/products/sugar.png',
  },
  {
    id: 'mustard-oil-1l',
    name: 'Mustard Oil',
    brand: 'Chahal Bros',
    quantityLabel: '1 L',
    price: 175,
    mrp: 198,
    discount: '12% OFF',
    category: 'Oils & Ghee',
    emoji: '\u{1F9C8}',
    placeholderGradient: 'from-[#FFF2C4] via-[#FFE38A] to-[#FFD04C]',
    accent: '#D69200',
    inStock: true,
    popularity: 79,
    newestRank: 1,
    image: '/products/mustard_oil.png',
  },
  {
    id: 'parle-g-biscuits-800g',
    name: 'Parle-G Biscuits',
    brand: 'Parle',
    quantityLabel: '800 g',
    price: 80,
    mrp: 90,
    discount: '11% OFF',
    category: 'Snacks',
    emoji: '\u{1F36A}',
    placeholderGradient: 'from-[#FDE7D8] via-[#FAD0B0] to-[#F6B78D]',
    accent: '#C76B2A',
    inStock: true,
    popularity: 92,
    newestRank: 11,
    image: '/products/parle_g.png',
  },
  {
    id: 'maggi-noodles-pack-12',
    name: 'Maggi Noodles',
    brand: 'Maggi',
    quantityLabel: 'Pack of 12',
    price: 168,
    mrp: 192,
    discount: '13% OFF',
    category: 'Snacks',
    emoji: '\u{1F35C}',
    placeholderGradient: 'from-[#FFF6D8] via-[#FFEFB3] to-[#FFE37A]',
    accent: '#E39A00',
    inStock: true,
    popularity: 96,
    newestRank: 12,
    image: '/products/maggi.png',
  },
  {
    id: 'amul-butter-500g',
    name: 'Amul Butter',
    brand: 'Amul',
    quantityLabel: '500 g',
    price: 270,
    mrp: 290,
    discount: '7% OFF',
    category: 'Dairy',
    emoji: '\u{1F9C8}',
    placeholderGradient: 'from-[#FFF1B8] via-[#FFE98D] to-[#FFD85B]',
    accent: '#D18A00',
    inStock: true,
    popularity: 85,
    newestRank: 14,
    image: '/products/butter.png',
  },
  {
    id: 'surf-excel-detergent-2kg',
    name: 'Surf Excel Easy Wash',
    brand: 'Surf Excel',
    quantityLabel: '2 kg',
    price: 315,
    mrp: 355,
    discount: '11% OFF',
    category: 'Household',
    emoji: '\u{1F9FC}',
    placeholderGradient: 'from-[#EAF4FF] via-[#D4E9FF] to-[#BADBFF]',
    accent: '#2299DD',
    inStock: false,
    popularity: 74,
    newestRank: 13,
  },
  {
    id: 'dabur-honey-500g',
    name: 'Dabur Honey',
    brand: 'Dabur',
    quantityLabel: '500 g',
    price: 210,
    mrp: 245,
    discount: '14% OFF',
    category: 'Breakfast & Spreads',
    emoji: '\u{1F36F}',
    placeholderGradient: 'from-[#FFF2D7] via-[#FFE2A6] to-[#FFCF6E]',
    accent: '#C67C2A',
    inStock: true,
    popularity: 77,
    newestRank: 15,
  },
];

const sortOptions: { id: Exclude<SortKey, 'relevance'>; label: string }[] = [
  { id: 'price-asc', label: 'Price Low to High' },
  { id: 'price-desc', label: 'Price High to Low' },
  { id: 'popularity', label: 'Popularity' },
  { id: 'newest', label: 'Newest' },
];

function formatCurrency(amount: number) {
  return `\u20B9${new Intl.NumberFormat('en-IN').format(amount)}`;
}

function FilterPill({
  label,
  icon,
  active,
  count,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
        active
          ? 'border-[#CC2222] bg-[#FFF3F3] text-[#CC2222] shadow-[0_10px_20px_rgba(204,34,34,0.08)]'
          : 'border-gray-200 bg-white text-[#1A1A2E]'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
      {count ? (
        <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-[#CC2222] px-1.5 py-0.5 text-[11px] font-extrabold text-white">
          {count}
        </span>
      ) : null}
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

function ProductCard({
  product,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  reducedMotion,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  reducedMotion: boolean;
}) {
  const initial = product.name.charAt(0).toUpperCase();

  return (
    <motion.article
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.02 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-[0_12px_30px_rgba(26,26,46,0.05)]"
    >
      <div className="relative overflow-hidden bg-[#F5F7FA] p-3" style={{ aspectRatio: '1 / 1' }}>
        {product.discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#22C55E] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(34,197,94,0.28)]">
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
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2299DD]">{product.brand}</p>

        <div className="mt-2 min-h-[2.75rem]">
          <h3 className="product-name-clamp text-[14px] font-semibold leading-[1.35] text-[#1A1A2E]">
            {product.name}
          </h3>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-[12px] font-medium text-[#6B7280]">{product.quantityLabel}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              product.inStock ? 'bg-[#ECFDF3] text-[#22C55E]' : 'bg-[#FEECEC] text-[#CC2222]'
            }`}
          >
            {product.inStock ? 'In Stock' : 'Out'}
          </span>
        </div>

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
            {quantity > 0 ? (
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
            ) : (
              <motion.button
                key="add"
                layout
                initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                onClick={onAdd}
                disabled={!product.inStock}
                className={`flex h-full w-full items-center justify-center rounded-xl border-2 text-[13px] font-extrabold tracking-[0.08em] transition ${
                  product.inStock
                    ? 'border-[#CC2222] bg-white text-[#CC2222] hover:bg-[#FFF5F5]'
                    : 'cursor-not-allowed border-gray-200 bg-[#F3F4F6] text-[#9CA3AF]'
                }`}
              >
                {product.inStock ? 'ADD' : 'OUT OF STOCK'}
              </motion.button>
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

function ResultsSkeleton() {
  return (
    <div className="pb-8">
      <SkeletonBlock className="mb-5 h-5 w-36" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="overflow-hidden rounded-[22px] border border-gray-100 bg-white p-3">
            <SkeletonBlock className="h-40 w-full rounded-[20px]" />
            <SkeletonBlock className="mt-3 h-3 w-20" />
            <SkeletonBlock className="mt-3 h-4 w-4/5" />
            <SkeletonBlock className="mt-2 h-3 w-1/3" />
            <SkeletonBlock className="mt-4 h-4 w-1/2" />
            <SkeletonBlock className="mt-4 h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomSheet({
  open,
  title,
  onClose,
  onApply,
  onClear,
  children,
  reducedMotion,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  children: ReactNode;
  reducedMotion: boolean;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close filter sheet"
            onClick={onClose}
            className="absolute inset-0 bg-black/30"
          />

          <motion.div
            initial={reducedMotion ? false : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: reducedMotion ? 0.18 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[78vh] w-full max-w-2xl flex-col rounded-t-[28px] bg-white shadow-[0_-24px_60px_rgba(26,26,46,0.16)]"
          >
            <div className="flex items-center justify-center pt-3">
              <span className="h-1.5 w-14 rounded-full bg-[#D1D5DB]" />
            </div>

            <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-4">
              <h2 className="text-[18px] font-extrabold text-[#1A1A2E]">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#1A1A2E]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-5">{children}</div>

            <div className="border-t border-gray-100 px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={onClear} className="text-sm font-bold text-[#2299DD]">
                  Clear
                </button>
                <button
                  type="button"
                  onClick={onApply}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-6 text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(204,34,34,0.22)]"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function SearchBrowsePage() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const filterPulseRef = useRef<number | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isTypingSearch, setIsTypingSearch] = useState(false);
  const [isFilterSearching, setIsFilterSearching] = useState(false);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);

  const [sortBy, setSortBy] = useState<SortKey>('relevance');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const [draftSortBy, setDraftSortBy] = useState<SortKey>('relevance');
  const [draftCategories, setDraftCategories] = useState<string[]>([]);
  const [draftBrands, setDraftBrands] = useState<string[]>([]);
  const [draftMaxPrice, setDraftMaxPrice] = useState(1000);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort((left, right) => left.localeCompare(right)),
    [],
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brand))).sort((left, right) => left.localeCompare(right)),
    [],
  );

  const quantityById = useMemo(
    () =>
      cartItems.reduce<Record<string, number>>((accumulator, item) => {
        accumulator[item.id] = item.quantity;
        return accumulator;
      }, {}),
    [cartItems],
  );

  useEffect(() => {
    return () => {
      if (filterPulseRef.current) {
        window.clearTimeout(filterPulseRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const normalizedInput = searchInput.trim().toLowerCase();

    if (normalizedInput === debouncedQuery) {
      setIsTypingSearch(false);
      return;
    }

    setIsTypingSearch(true);

    const timeout = window.setTimeout(() => {
      setDebouncedQuery(normalizedInput);
      setIsTypingSearch(false);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput, debouncedQuery]);

  useEffect(() => {
    if (!activeSheet) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSheet(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeSheet]);

  function pulseFilterSearch() {
    if (filterPulseRef.current) {
      window.clearTimeout(filterPulseRef.current);
    }

    setIsFilterSearching(true);

    filterPulseRef.current = window.setTimeout(() => {
      setIsFilterSearching(false);
      filterPulseRef.current = null;
    }, 220);
  }

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

  function toggleDraftValue(value: string, list: string[], setList: (next: string[]) => void) {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }

    setList([...list, value]);
  }

  function openSheet(sheet: Exclude<SheetType, null>) {
    if (sheet === 'sort') {
      setDraftSortBy(sortBy);
    }

    if (sheet === 'category') {
      setDraftCategories(selectedCategories);
    }

    if (sheet === 'brand') {
      setDraftBrands(selectedBrands);
    }

    if (sheet === 'price') {
      setDraftMaxPrice(maxPrice);
    }

    setActiveSheet(sheet);
  }

  function clearActiveSheet() {
    if (activeSheet === 'sort') {
      setDraftSortBy('relevance');
    }

    if (activeSheet === 'category') {
      setDraftCategories([]);
    }

    if (activeSheet === 'brand') {
      setDraftBrands([]);
    }

    if (activeSheet === 'price') {
      setDraftMaxPrice(1000);
    }
  }

  function applyActiveSheet() {
    if (activeSheet === 'sort') {
      setSortBy(draftSortBy);
    }

    if (activeSheet === 'category') {
      setSelectedCategories(draftCategories);
    }

    if (activeSheet === 'brand') {
      setSelectedBrands(draftBrands);
    }

    if (activeSheet === 'price') {
      setMaxPrice(draftMaxPrice);
    }

    pulseFilterSearch();
    setActiveSheet(null);
  }

  function clearSearch() {
    setSearchInput('');
    setDebouncedQuery('');
    setIsTypingSearch(false);
  }

  const filteredProducts = useMemo(() => {
    let results = products.filter((product) => {
      const haystack = `${product.name} ${product.brand} ${product.category} ${product.quantityLabel}`.toLowerCase();
      const matchesQuery = !debouncedQuery || haystack.includes(debouncedQuery);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price <= maxPrice;
      const matchesStock = !inStockOnly || product.inStock;

      return matchesQuery && matchesCategory && matchesBrand && matchesPrice && matchesStock;
    });

    if (sortBy === 'price-asc') {
      results = [...results].sort((left, right) => left.price - right.price);
    } else if (sortBy === 'price-desc') {
      results = [...results].sort((left, right) => right.price - left.price);
    } else if (sortBy === 'popularity') {
      results = [...results].sort((left, right) => right.popularity - left.popularity);
    } else if (sortBy === 'newest') {
      results = [...results].sort((left, right) => right.newestRank - left.newestRank);
    }

    return results;
  }, [debouncedQuery, inStockOnly, maxPrice, selectedBrands, selectedCategories, sortBy]);

  const sortCount = sortBy === 'relevance' ? 0 : 1;
  const categoryCount = selectedCategories.length;
  const priceCount = maxPrice < 1000 ? 1 : 0;
  const brandCount = selectedBrands.length;
  const stockCount = inStockOnly ? 1 : 0;
  const isSearching = isTypingSearch || isFilterSearching;

  return (
    <>
      <main
        className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.18 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-0 z-40 border-b border-black/5 bg-white/[0.92] backdrop-blur-xl"
        >
          <div className="mx-auto max-w-6xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
            <div className="relative flex h-12 items-center rounded-2xl bg-[#F0F2F5] px-4 shadow-inner">
              <Search className="h-5 w-5 shrink-0 text-[#6B7280]" />
              <input
                autoFocus
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search for atta, rice, dal..."
                className="h-full w-full border-0 bg-transparent px-3 text-[15px] font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                aria-label="Search products"
              />

              {searchInput ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6B7280] shadow-[0_4px_10px_rgba(26,26,46,0.06)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {!searchInput ? (
              <div className="mt-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Recent Searches</p>
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSearchInput(item)}
                      className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1A1A2E] shadow-[0_8px_20px_rgba(26,26,46,0.04)]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
              <FilterPill
                label="Sort"
                icon={<ArrowUpDown className="h-4 w-4" />}
                active={sortCount > 0}
                count={sortCount}
                onClick={() => openSheet('sort')}
              />
              <FilterPill
                label="Category"
                icon={<LayoutGrid className="h-4 w-4" />}
                active={categoryCount > 0}
                count={categoryCount}
                onClick={() => openSheet('category')}
              />
              <FilterPill
                label="Price"
                icon={<IndianRupee className="h-4 w-4" />}
                active={priceCount > 0}
                count={priceCount}
                onClick={() => openSheet('price')}
              />
              <FilterPill
                label="Brand"
                icon={<Tags className="h-4 w-4" />}
                active={brandCount > 0}
                count={brandCount}
                onClick={() => openSheet('brand')}
              />

              <button
                type="button"
                onClick={() => {
                  setInStockOnly((current) => !current);
                  pulseFilterSearch();
                }}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                  inStockOnly
                    ? 'border-[#CC2222] bg-[#FFF3F3] text-[#CC2222] shadow-[0_10px_20px_rgba(204,34,34,0.08)]'
                    : 'border-gray-200 bg-white text-[#1A1A2E]'
                }`}
              >
                <span>In Stock Only</span>
                {stockCount ? (
                  <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-[#CC2222] px-1.5 py-0.5 text-[11px] font-extrabold text-white">
                    {stockCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="loading"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ResultsSkeleton />
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <motion.section
                key="empty"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[58vh] flex-col items-center justify-center px-4 text-center"
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl shadow-[0_20px_40px_rgba(26,26,46,0.08)]">
                  {'\u{1F50D}'}
                </div>
                <h2 className="mt-6 text-[22px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">No products found</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#6B7280]">Try searching for something else.</p>
                <button
                  type="button"
                  onClick={() => openSheet('category')}
                  className="mt-5 text-sm font-bold text-[#2299DD]"
                >
                  Browse Categories
                </button>
              </motion.section>
            ) : (
              <motion.section
                key="results"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[#6B7280]">
                    <span className="font-extrabold text-[#1A1A2E]">{filteredProducts.length}</span> products found
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((product) => (
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
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <BottomSheet
        open={activeSheet === 'sort'}
        title="Sort Results"
        onClose={() => setActiveSheet(null)}
        onApply={applyActiveSheet}
        onClear={clearActiveSheet}
        reducedMotion={shouldReduceMotion}
      >
        <div className="space-y-3">
          {sortOptions.map((option) => {
            const checked = draftSortBy === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setDraftSortBy(option.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                  checked ? 'border-[#CC2222] bg-[#FFF3F3]' : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-sm font-semibold text-[#1A1A2E]">{option.label}</span>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                    checked ? 'border-[#CC2222] bg-[#CC2222] text-white' : 'border-gray-300 text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === 'category'}
        title="Filter by Category"
        onClose={() => setActiveSheet(null)}
        onApply={applyActiveSheet}
        onClear={clearActiveSheet}
        reducedMotion={shouldReduceMotion}
      >
        <div className="space-y-3">
          {categories.map((category) => {
            const checked = draftCategories.includes(category);

            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleDraftValue(category, draftCategories, setDraftCategories)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                  checked ? 'border-[#CC2222] bg-[#FFF3F3]' : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-sm font-semibold text-[#1A1A2E]">{category}</span>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${
                    checked ? 'border-[#CC2222] bg-[#CC2222] text-white' : 'border-gray-300 text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === 'price'}
        title="Filter by Price"
        onClose={() => setActiveSheet(null)}
        onApply={applyActiveSheet}
        onClear={clearActiveSheet}
        reducedMotion={shouldReduceMotion}
      >
        <div className="rounded-[24px] bg-[#F8FAFC] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Price Range</p>
              <p className="mt-2 text-[18px] font-extrabold text-[#1A1A2E]">
                {formatCurrency(0)} - {formatCurrency(draftMaxPrice)}
              </p>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#CC2222] shadow-[0_8px_18px_rgba(26,26,46,0.05)]">
              Max {formatCurrency(draftMaxPrice)}
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={1000}
            step={25}
            value={draftMaxPrice}
            onChange={(event) => setDraftMaxPrice(Number(event.target.value))}
            className="mt-6 h-2 w-full cursor-pointer accent-[#CC2222]"
            aria-label="Maximum price"
          />

          <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#6B7280]">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(1000)}</span>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === 'brand'}
        title="Filter by Brand"
        onClose={() => setActiveSheet(null)}
        onApply={applyActiveSheet}
        onClear={clearActiveSheet}
        reducedMotion={shouldReduceMotion}
      >
        <div className="space-y-3">
          {brands.map((brand) => {
            const checked = draftBrands.includes(brand);

            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleDraftValue(brand, draftBrands, setDraftBrands)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                  checked ? 'border-[#CC2222] bg-[#FFF3F3]' : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-sm font-semibold text-[#1A1A2E]">{brand}</span>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${
                    checked ? 'border-[#CC2222] bg-[#CC2222] text-white' : 'border-gray-300 text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </BottomSheet>

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
            rgba(255, 255, 255, 0.58) 50%,
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
