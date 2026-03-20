'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Check, ChevronDown, Clock3, Minus, Plus, Share2, Truck } from 'lucide-react';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type Variant = {
  id: string;
  label: string;
  price: number;
  mrp: number;
  discount: string;
  inStock: boolean;
};

type GalleryImage = {
  id: string;
  accent: string;
  gradient: string;
  emoji: string;
  image?: string;
};

type SimilarProduct = {
  id: string;
  name: string;
  weight: string;
  price: number;
  mrp: number;
  discount?: string;
  accent: string;
  gradient: string;
  emoji: string;
  image?: string;
};

type Product = {
  id: string;
  brand: string;
  name: string;
  category: string;
  shelfLife: string;
  description: string;
  defaultVariantId: string;
  gallery: GalleryImage[];
  variants: Variant[];
  similar: SimilarProduct[];
};

const defaultProduct: Product = {
  id: 'aashirvaad-atta',
  brand: 'Aashirvaad',
  name: 'Aashirvaad Atta',
  category: 'Atta & Flour',
  shelfLife: '6 months',
  defaultVariantId: '5kg',
  description:
    'Aashirvaad Atta is made from carefully selected whole wheat grains to deliver soft rotis, consistent dough texture, and reliable daily performance in the kitchen. The flour is milled for balanced absorption and a fine feel, making it ideal for chapati, paratha, poori, and everyday home cooking. Packed fresh and sealed for pantry storage, it is a trusted staple for families who want dependable quality in every meal.',
  gallery: [
    {
      id: 'front-pack',
      accent: '#C67C2A',
      gradient: 'from-[#FFF2E2] via-[#FFE1BE] to-[#FFD099]',
      emoji: '\u{1F33E}',
      image: '/products/atta.png',
    },
    {
      id: 'kitchen-bowl',
      accent: '#2299DD',
      gradient: 'from-[#EAF6FF] via-[#D8EEFF] to-[#C2E3FF]',
      emoji: '\u{1F963}',
    },
    {
      id: 'daily-cook',
      accent: '#CC2222',
      gradient: 'from-[#FFE9E9] via-[#FFD3D3] to-[#FFB9B9]',
      emoji: '\u{1FAD3}',
    },
  ],
  variants: [
    { id: '1kg', label: '1 kg', price: 58, mrp: 65, discount: '11% OFF', inStock: true },
    { id: '5kg', label: '5 kg', price: 240, mrp: 280, discount: '15% OFF', inStock: true },
    { id: '10kg', label: '10 kg', price: 455, mrp: 520, discount: '12% OFF', inStock: false },
  ],
  similar: [
    {
      id: 'india-gate-basmati-rice',
      name: 'India Gate Basmati Rice',
      weight: '5 kg',
      price: 420,
      mrp: 480,
      discount: '13% OFF',
      accent: '#2299DD',
      gradient: 'from-[#E8F7FF] via-[#D8F0FF] to-[#C6E7FF]',
      emoji: '\u{1F35A}',
      image: '/products/rice.png',
    },
    {
      id: 'fortune-sunflower-oil',
      name: 'Fortune Sunflower Oil',
      weight: '1 L',
      price: 135,
      mrp: 160,
      discount: '16% OFF',
      accent: '#D4A017',
      gradient: 'from-[#FFF5D6] via-[#FFE7A3] to-[#FFD66E]',
      emoji: '\u{1F9C8}',
      image: '/products/sunflower_oil.png',
    },
    {
      id: 'tata-salt',
      name: 'Tata Salt',
      weight: '1 kg',
      price: 28,
      mrp: 28,
      accent: '#6B7280',
      gradient: 'from-[#F7F9FC] via-[#E8EDF5] to-[#DBE3EF]',
      emoji: '\u{1F9C2}',
      image: '/products/salt.png',
    },
    {
      id: 'chana-dal',
      name: 'Chana Dal',
      weight: '1 kg',
      price: 92,
      mrp: 108,
      discount: '15% OFF',
      accent: '#C99822',
      gradient: 'from-[#FFF3D5] via-[#FFE6A8] to-[#FFD877]',
      emoji: '\u{1FAD8}',
      image: '/products/chana_dal.png',
    },
    {
      id: 'mdh-garam-masala',
      name: 'MDH Garam Masala',
      weight: '100 g',
      price: 85,
      mrp: 95,
      discount: '11% OFF',
      accent: '#CC2222',
      gradient: 'from-[#FFE8E8] via-[#FFD3D3] to-[#FFBBBB]',
      emoji: '\u{1F336}\uFE0F',
      image: '/products/garam_masala.png',
    },
    {
      id: 'amul-butter',
      name: 'Amul Butter',
      weight: '500 g',
      price: 270,
      mrp: 290,
      discount: '7% OFF',
      accent: '#D18A00',
      gradient: 'from-[#FFF3C7] via-[#FFE599] to-[#FFD76A]',
      emoji: '\u{1F9C8}',
      image: '/products/butter.png',
    },
  ],
};

const productCatalog: Record<string, Product> = {
  'aashirvaad-atta': defaultProduct,
  'aashirvaad-atta-5kg': defaultProduct,
};

function formatCurrency(value: number) {
  return `\u20B9${new Intl.NumberFormat('en-IN').format(value)}`;
}

function SimilarProductCard({
  item,
  reducedMotion,
}: {
  item: SimilarProduct;
  reducedMotion: boolean;
}) {
  const initial = item.name.charAt(0).toUpperCase();

  return (
    <motion.article
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.02 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-[140px] shrink-0 overflow-hidden rounded-[22px] border border-gray-100 bg-white shadow-[0_14px_30px_rgba(26,26,46,0.05)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#EEF2F6] p-3">
        {item.discount ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#22C55E] px-2 py-1 text-[9px] font-extrabold tracking-[0.08em] text-white">
            {item.discount}
          </span>
        ) : null}

        <div className={`absolute inset-3 rounded-[20px] bg-gradient-to-br ${item.gradient} overflow-hidden`}>
          {item.image && (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          )}
        </div>
        {!item.image && (
          <div className="relative flex h-full items-center justify-center rounded-[20px]">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/[0.9] text-[30px] font-black shadow-[0_12px_28px_rgba(26,26,46,0.10)]"
              style={{ color: item.accent }}
            >
              {initial}
            </div>
            <span className="absolute bottom-3 right-3 text-xl">{item.emoji}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="similar-name-clamp text-[13px] font-semibold leading-[1.35] text-[#1A1A2E]">{item.name}</h3>
        <p className="mt-1 text-[11px] font-medium text-[#6B7280]">{item.weight}</p>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-[15px] font-extrabold text-[#1A1A2E]">{formatCurrency(item.price)}</span>
          {item.mrp > item.price ? (
            <span className="pb-0.5 text-[11px] font-medium text-[#9CA3AF] line-through">
              {formatCurrency(item.mrp)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="mt-3 flex h-8 w-full items-center justify-center rounded-lg border-2 border-[#CC2222] bg-white text-[12px] font-extrabold tracking-[0.08em] text-[#CC2222]"
        >
          ADD
        </button>
      </div>
    </motion.article>
  );
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const routeId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const product = useMemo(() => {
    if (!routeId) {
      return defaultProduct;
    }

    return productCatalog[routeId] ?? defaultProduct;
  }, [routeId]);

  const [selectedVariantId, setSelectedVariantId] = useState(product.defaultVariantId);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [ctaState, setCtaState] = useState<'idle' | 'success'>('idle');
  const [shareState, setShareState] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    setSelectedVariantId(product.defaultVariantId);
    setImageIndex(0);
    setQuantity(1);
    setDescriptionExpanded(false);
    setIsInCart(false);
    setCtaState('idle');
    setShareState('idle');
  }, [product]);

  useEffect(() => {
    if (ctaState !== 'success') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCtaState('idle');
    }, shouldReduceMotion ? 450 : 1100);

    return () => window.clearTimeout(timeout);
  }, [ctaState, shouldReduceMotion]);

  useEffect(() => {
    if (shareState !== 'success') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShareState('idle');
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [shareState]);

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const selectedImage = product.gallery[imageIndex] ?? product.gallery[0];
  const cartTotal = selectedVariant.price * quantity;

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const payload = {
      title: `${product.name} | Chahal Bros`,
      text: `Check out ${product.name} on Chahal Bros`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }

      setShareState('success');
    } catch {
      setShareState('idle');
    }
  }

  function handleCartAction() {
    if (!selectedVariant.inStock) {
      return;
    }

    setIsInCart(true);
    setCtaState('success');
  }

  const buttonLabel =
    ctaState === 'success'
      ? 'Added to Cart'
      : isInCart
        ? `Update Cart \u2014 ${formatCurrency(cartTotal)}`
        : `Add to Cart \u2014 ${formatCurrency(cartTotal)}`;

  return (
    <>
      <main
        className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        <div className="mx-auto max-w-5xl px-4 pb-40 pt-4 sm:px-6 lg:px-8">
          <motion.header
            initial={shouldReduceMotion ? false : { opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.18 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between gap-3"
          >
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1A1A2E] shadow-[0_12px_26px_rgba(26,26,46,0.05)]"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <h1 className="text-[16px] font-extrabold tracking-[-0.01em] text-[#1A1A2E]">Product Details</h1>

            <button
              type="button"
              onClick={() => void handleShare()}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-[0_12px_26px_rgba(26,26,46,0.05)] ${
                shareState === 'success' ? 'text-[#22C55E]' : 'text-[#1A1A2E]'
              }`}
              aria-label="Share product"
            >
              {shareState === 'success' ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
            </button>
          </motion.header>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.18 : 0.38, delay: shouldReduceMotion ? 0 : 0.06 }}
            className="mt-4"
          >
            <div className="relative mx-auto aspect-square w-full max-w-[400px] overflow-hidden rounded-[30px] border border-gray-100 bg-[#EEF2F6] shadow-[0_18px_42px_rgba(26,26,46,0.06)]">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-[#22C55E] px-3 py-1.5 text-[11px] font-extrabold tracking-[0.08em] text-white shadow-[0_12px_24px_rgba(34,197,94,0.22)]">
                {selectedVariant.discount}
              </span>

              <div className={`absolute inset-0 bg-gradient-to-br ${selectedImage.gradient}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_42%)]" />
              <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-white/[0.28] blur-2xl" />
              <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-white/[0.3] blur-2xl" />

              <div className="relative flex h-full items-center justify-center p-8">
                <motion.div
                  key={selectedImage.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.18 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-48 w-48 items-center justify-center rounded-full bg-white/[0.9] shadow-[0_24px_52px_rgba(26,26,46,0.14)] overflow-hidden"
                >
                  {selectedImage.image ? (
                    <Image src={selectedImage.image} alt={product.name} fill className="object-cover" />
                  ) : (
                    <>
                      <div
                        className="flex h-28 w-28 items-center justify-center rounded-full text-[64px] font-black shadow-[0_16px_36px_rgba(26,26,46,0.10)]"
                        style={{ backgroundColor: selectedImage.accent, color: '#FFFFFF' }}
                      >
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute bottom-6 right-6 text-[34px]">{selectedImage.emoji}</span>
                    </>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {product.gallery.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    imageIndex === index ? 'scale-110 bg-[#CC2222]' : 'bg-[#D1D5DB]'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.4,
              delay: shouldReduceMotion ? 0 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 space-y-5"
          >
            <div className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#2299DD]">{product.brand}</p>
              <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">{product.name}</h2>

              <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
                {product.variants.map((variant) => {
                  const active = variant.id === selectedVariant.id;

                  return (
                    <motion.button
                      key={variant.id}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-200 ${
                        active
                          ? 'border-[#CC2222] bg-[#FFF1F1] text-[#CC2222] shadow-[0_10px_20px_rgba(204,34,34,0.08)]'
                          : 'border-gray-200 bg-white text-[#1A1A2E]'
                      }`}
                    >
                      {variant.label}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
                <span className="text-[28px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                  {formatCurrency(selectedVariant.price)}
                </span>
                <span className="text-[16px] font-semibold text-[#9CA3AF] line-through">
                  {formatCurrency(selectedVariant.mrp)}
                </span>
                <span className="rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[12px] font-bold text-[#22C55E]">
                  {selectedVariant.discount}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    selectedVariant.inStock ? 'bg-[#22C55E]' : 'bg-[#CC2222]'
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${
                    selectedVariant.inStock ? 'text-[#22C55E]' : 'text-[#CC2222]'
                  }`}
                >
                  {selectedVariant.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#EDF2F7] p-4">
              <div className="rounded-2xl bg-white/[0.76] px-4 py-3">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#CC2222]" />
                  <div>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{'\u26A1 Express Delivery'}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">Get it in 25-30 minutes</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-white/[0.76] px-4 py-3">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#2299DD]" />
                  <div>
                    <p className="text-sm font-extrabold text-[#1A1A2E]">{'\u{1F193} Free delivery'}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">Free delivery on orders above {formatCurrency(299)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.4,
              delay: shouldReduceMotion ? 0 : 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]"
          >
            <h3 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Product Details</h3>

            <div className="relative mt-4">
              <motion.div
                initial={false}
                animate={{ height: descriptionExpanded ? 'auto' : 72 }}
                transition={{ duration: shouldReduceMotion ? 0.16 : 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p
                  className={`text-sm leading-6 text-[#4B5563] ${
                    descriptionExpanded ? '' : 'description-clamp'
                  }`}
                >
                  {product.description}
                </p>
              </motion.div>

              {!descriptionExpanded ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-[linear-gradient(180deg,rgba(255,255,255,0),#FFFFFF)]" />
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setDescriptionExpanded((current) => !current)}
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#2299DD]"
            >
              {descriptionExpanded ? 'Read less' : 'Read more'}
              <motion.span animate={{ rotate: descriptionExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Weight</p>
                <p className="mt-2 text-sm font-extrabold text-[#1A1A2E]">{selectedVariant.label}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Brand</p>
                <p className="mt-2 text-sm font-extrabold text-[#1A1A2E]">{product.brand}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Category</p>
                <p className="mt-2 text-sm font-extrabold text-[#1A1A2E]">{product.category}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">Shelf Life</p>
                <p className="mt-2 text-sm font-extrabold text-[#1A1A2E]">{product.shelfLife}</p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.4,
              delay: shouldReduceMotion ? 0 : 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5"
          >
            <h3 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">You may also like</h3>

            <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
              {product.similar.map((item) => (
                <SimilarProductCard key={item.id} item={item} reducedMotion={shouldReduceMotion} />
              ))}
            </div>
          </motion.section>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.18 : 0.34,
            delay: shouldReduceMotion ? 0 : 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/[0.97] shadow-[0_-18px_40px_rgba(26,26,46,0.08)] backdrop-blur-xl"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
        >
          <div className="mx-auto grid max-w-5xl grid-cols-[132px_1fr] gap-3 px-4 pb-3 pt-3 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between rounded-2xl bg-[#F2F5F8] px-2 shadow-inner">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1A1A2E] shadow-[0_8px_20px_rgba(26,26,46,0.06)]"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="text-base font-extrabold text-[#1A1A2E]">{quantity}</span>

              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#CC2222,#E03030)] text-white shadow-[0_12px_24px_rgba(204,34,34,0.24)]"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <motion.button
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              type="button"
              onClick={handleCartAction}
              disabled={!selectedVariant.inStock}
              className={`flex h-14 items-center justify-center gap-2 rounded-[18px] px-5 text-sm font-extrabold text-white transition ${
                selectedVariant.inStock
                  ? 'bg-[linear-gradient(135deg,#CC2222,#E03030)] shadow-[0_18px_34px_rgba(204,34,34,0.24)]'
                  : 'cursor-not-allowed bg-[#9CA3AF] shadow-none'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={buttonLabel}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: shouldReduceMotion ? 0.12 : 0.18 }}
                  className="inline-flex items-center gap-2"
                >
                  {ctaState === 'success' ? <Check className="h-4 w-4" /> : null}
                  {selectedVariant.inStock ? buttonLabel : 'Out of Stock'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </main>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .description-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 3;
        }

        .similar-name-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </>
  );
}
