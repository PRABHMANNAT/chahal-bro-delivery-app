'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Plus,
  TicketPercent,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type CartItem = {
  id: string;
  name: string;
  weight: string;
  unitPrice: number;
  quantity: number;
  gradient: string;
  accent: string;
  emoji: string;
};

type PaymentMethod = 'online' | 'cod';
type AddressType = 'home' | 'office' | 'other';
type DeliveryAddress = {
  badge: string;
  fullAddress: string;
  compactAddress: string;
};
type SavedProfile = {
  addressType?: AddressType;
  fullAddress?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

const fallbackDeliveryAddress: DeliveryAddress = {
  badge: '\u{1F3E0} Home',
  fullAddress: 'House 204, Model Town Extension, Ludhiana, Punjab 141002',
  compactAddress: 'Model Town, Ludhiana',
};

const addressTypeBadges: Record<AddressType, string> = {
  home: '\u{1F3E0} Home',
  office: '\u{1F3E2} Office',
  other: '\u{1F4CD} Other',
};

const initialCartItems: CartItem[] = [
  {
    id: 'aashirvaad-atta-5kg',
    name: 'Aashirvaad Atta',
    weight: '5 kg',
    unitPrice: 240,
    quantity: 1,
    gradient: 'from-[#FFF1E6] via-[#FFE3CC] to-[#FAD0B1]',
    accent: '#C67C2A',
    emoji: '\u{1F33E}',
  },
  {
    id: 'india-gate-rice-5kg',
    name: 'India Gate Rice',
    weight: '5 kg',
    unitPrice: 420,
    quantity: 1,
    gradient: 'from-[#E8F7FF] via-[#D8F1FF] to-[#C7E8FF]',
    accent: '#2299DD',
    emoji: '\u{1F35A}',
  },
  {
    id: 'fortune-oil-1l',
    name: 'Fortune Oil',
    weight: '1 L',
    unitPrice: 135,
    quantity: 2,
    gradient: 'from-[#FFF4CC] via-[#FFE59A] to-[#FFD76F]',
    accent: '#D4A017',
    emoji: '\u{1F9C8}',
  },
  {
    id: 'tata-salt-1kg',
    name: 'Tata Salt',
    weight: '1 kg',
    unitPrice: 28,
    quantity: 1,
    gradient: 'from-[#F5F7FA] via-[#E9EDF4] to-[#DFE5EF]',
    accent: '#6B7280',
    emoji: '\u{1F9C2}',
  },
];

function formatCurrency(amount: number) {
  return `\u20B9${new Intl.NumberFormat('en-IN').format(amount)}`;
}

function buildDeliveryAddress(profile: SavedProfile): DeliveryAddress {
  const fullAddress = [
    profile.fullAddress?.trim(),
    profile.landmark?.trim(),
    profile.city?.trim(),
    profile.state?.trim(),
    profile.pincode?.trim(),
  ]
    .filter(Boolean)
    .join(', ');

  if (!fullAddress) {
    return fallbackDeliveryAddress;
  }

  const compactAddress =
    [profile.landmark?.trim(), profile.city?.trim()].filter(Boolean).join(', ') ||
    [profile.city?.trim(), profile.state?.trim()].filter(Boolean).join(', ') ||
    profile.fullAddress?.split(',').map((segment) => segment.trim()).filter(Boolean).slice(0, 2).join(', ') ||
    fallbackDeliveryAddress.compactAddress;

  return {
    badge: addressTypeBadges[profile.addressType ?? 'home'] ?? addressTypeBadges.home,
    fullAddress,
    compactAddress,
  };
}

function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  reducedMotion,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  reducedMotion: boolean;
}) {
  const initial = item.name.charAt(0).toUpperCase();
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
      transition={{ duration: reducedMotion ? 0.14 : 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3 py-4"
    >
      <div className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#EEF2F6]">
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
        <div
          className="relative flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/[0.9] text-2xl font-black shadow-[0_10px_22px_rgba(26,26,46,0.10)]"
          style={{ color: item.accent }}
        >
          {initial}
        </div>
        <span className="absolute bottom-1.5 right-1.5 text-sm">{item.emoji}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold leading-5 text-[#1A1A2E]">{item.name}</h3>
        <p className="mt-1 text-sm font-medium text-[#6B7280]">{item.weight}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="flex h-9 items-center justify-between rounded-xl bg-[#F2F5F8] px-1.5 shadow-inner">
          <button
            type="button"
            onClick={onDecrement}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#1A1A2E] shadow-[0_6px_16px_rgba(26,26,46,0.06)]"
            aria-label={`Decrease quantity for ${item.name}`}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="w-8 text-center text-sm font-extrabold text-[#1A1A2E]">{item.quantity}</span>

          <button
            type="button"
            onClick={onIncrement}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#CC2222,#E03030)] text-white shadow-[0_10px_18px_rgba(204,34,34,0.22)]"
            aria-label={`Increase quantity for ${item.name}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="text-sm font-extrabold text-[#1A1A2E]">{formatCurrency(lineTotal)}</p>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF1F1] text-[#CC2222]"
          aria-label={`Remove ${item.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function BillRow({
  label,
  value,
  valueClassName = 'text-[#1A1A2E]',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <span className="font-medium text-[#6B7280]">{label}</span>
      <span className={`font-bold ${valueClassName}`}>{value}</span>
    </div>
  );
}

type CartCheckoutPageProps = {
  initialView?: 'cart' | 'checkout';
};

export default function CartCheckoutPage({
  initialView = 'cart',
}: CartCheckoutPageProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const [cartItems, setCartItems] = useState(initialCartItems);
  const [activeView, setActiveView] = useState<'cart' | 'checkout'>(initialView);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [placeOrderState, setPlaceOrderState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>(fallbackDeliveryAddress);

  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const itemsTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems],
  );

  const couponDiscount = useMemo(() => {
    if (appliedCoupon !== 'CHAHAL20') {
      return 0;
    }

    return Math.min(Math.round(itemsTotal * 0.2), 100);
  }, [appliedCoupon, itemsTotal]);

  const deliveryFee = itemsTotal === 0 || itemsTotal >= 299 ? 0 : 25;
  const taxableAmount = Math.max(itemsTotal - couponDiscount, 0);
  const gst = Math.round(taxableAmount * 0.05);
  const grandTotal = taxableAmount + gst + deliveryFee;

  useEffect(() => {
    const savedProfile = window.localStorage.getItem('chahalbros_profile');

    if (!savedProfile) {
      return;
    }

    try {
      setDeliveryAddress(buildDeliveryAddress(JSON.parse(savedProfile) as SavedProfile));
    } catch {
      window.localStorage.removeItem('chahalbros_profile');
    }
  }, []);

  useEffect(() => {
    if (itemCount > 0) {
      return;
    }

    setActiveView('cart');
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setIsCouponOpen(false);
  }, [itemCount]);

  useEffect(() => {
    if (activeView !== 'checkout') {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeView]);

  useEffect(() => {
    if (activeView !== 'checkout' || placeOrderState !== 'idle') {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveView('cart');
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeView, placeOrderState]);

  useEffect(() => {
    if (placeOrderState !== 'loading') {
      return;
    }

    const successDelay = shouldReduceMotion ? 500 : 1100;
    const redirectDelay = shouldReduceMotion ? 1050 : 1900;

    const successTimer = window.setTimeout(() => {
      setPlaceOrderState('success');
    }, successDelay);

    const redirectTimer = window.setTimeout(() => {
      const params = new URLSearchParams({
        items: String(itemCount),
        payment: paymentMethod,
        total: String(grandTotal),
      });

      router.push(`/orders/CB2024001?${params.toString()}`);
    }, redirectDelay);

    return () => {
      window.clearTimeout(successTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [grandTotal, itemCount, paymentMethod, placeOrderState, router, shouldReduceMotion]);

  function updateQuantity(id: string, nextQuantity: number) {
    setCartItems((current) => {
      if (nextQuantity <= 0) {
        return current.filter((item) => item.id !== id);
      }

      return current.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item));
    });
  }

  function applyCoupon() {
    const normalized = couponInput.trim().toUpperCase();

    if (!normalized) {
      setCouponError('Enter a coupon code.');
      return;
    }

    if (normalized !== 'CHAHAL20') {
      setCouponError('Invalid coupon code.');
      return;
    }

    setAppliedCoupon(normalized);
    setCouponInput(normalized);
    setCouponError('');
    setIsCouponOpen(true);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  }

  function handleProceedToCheckout() {
    if (itemCount === 0) {
      return;
    }

    setActiveView('checkout');
  }

  function handlePlaceOrder() {
    if (placeOrderState !== 'idle' || itemCount === 0) {
      return;
    }

    setPlaceOrderState('loading');
  }

  function handleChangeAddress() {
    router.push('/onboarding');
  }

  function handleCloseCheckout() {
    if (placeOrderState !== 'idle') {
      return;
    }

    setActiveView('cart');
  }

  return (
    <>
      <main
        className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        <div className="mx-auto max-w-5xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
          <motion.header
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.18 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">My Cart</h1>
              <p className="mt-1 text-sm text-[#6B7280]">Everything you need, almost at your door.</p>
            </div>

            <span className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-2xl bg-[#CC2222] px-3 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(204,34,34,0.22)]">
              {itemCount}
            </span>
          </motion.header>

          <motion.button
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.34,
              delay: shouldReduceMotion ? 0 : 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            type="button"
            onClick={handleChangeAddress}
            className="mt-5 flex w-full items-start gap-3 rounded-[24px] bg-white p-4 text-left shadow-[0_14px_34px_rgba(26,26,46,0.05)]"
          >
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#CC2222]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="truncate text-sm font-bold text-[#1A1A2E]">{deliveryAddress.compactAddress}</p>
                <span className="shrink-0 text-sm font-bold text-[#2299DD]">Change</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
                <Zap className="h-4 w-4 text-[#F59E0B]" />
                <span>Delivery in 25-30 min</span>
              </div>
            </div>
          </motion.button>

          <AnimatePresence mode="wait">
            {itemCount === 0 ? (
              <motion.section
                key="empty-cart"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[56vh] flex-col items-center justify-center px-4 text-center"
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl shadow-[0_20px_42px_rgba(26,26,46,0.08)]">
                  {'\u{1F6D2}'}
                </div>
                <h2 className="mt-6 text-[24px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                  Your cart is empty
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#6B7280]">
                  Add a few pantry staples and we will get them delivered in minutes.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/home')}
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-6 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)]"
                >
                  Start Shopping
                </button>
              </motion.section>
            ) : (
              <motion.div
                key="cart-filled"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.18 : 0.34,
                  delay: shouldReduceMotion ? 0 : 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-5 space-y-5"
              >
                <section className="overflow-hidden rounded-[28px] bg-white px-4 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item, index) => (
                      <div key={item.id} className={index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}>
                        <CartItemRow
                          item={item}
                          onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                          onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                          onRemove={() => updateQuantity(item.id, 0)}
                          reducedMotion={shouldReduceMotion}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                </section>

                <section className="rounded-[24px] bg-white p-4 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCouponOpen((current) => !current);
                      setCouponError('');
                    }}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF3F3] text-[#CC2222]">
                        <TicketPercent className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[15px] font-extrabold text-[#1A1A2E]">Apply Coupon</p>
                        <p className="mt-1 text-sm text-[#6B7280]">
                          Use CHAHAL20 to get up to {formatCurrency(100)} off
                        </p>
                      </div>
                    </div>
                    <motion.span animate={{ rotate: isCouponOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className="h-5 w-5 text-[#2299DD]" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isCouponOpen ? (
                      <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={
                          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0 }
                        }
                        transition={{ duration: shouldReduceMotion ? 0.14 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        {appliedCoupon ? (
                          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#ECFDF3] px-4 py-3">
                            <p className="text-sm font-bold text-[#16A34A]">
                              {appliedCoupon} applied {'\u2014'} {formatCurrency(couponDiscount)} saved!
                            </p>
                            <button
                              type="button"
                              onClick={removeCoupon}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#16A34A]"
                              aria-label="Remove coupon"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={couponInput}
                                onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="h-12 flex-1 rounded-2xl border border-gray-200 bg-[#F8FAFC] px-4 text-sm font-semibold text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF] focus:border-[#2299DD] focus:ring-2 focus:ring-[#2299DD]/20"
                              />
                              <button
                                type="button"
                                onClick={applyCoupon}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-5 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(204,34,34,0.22)]"
                              >
                                Apply
                              </button>
                            </div>
                            {couponError ? (
                              <p className="mt-3 text-sm font-semibold text-[#CC2222]">{couponError}</p>
                            ) : null}
                          </>
                        )}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </section>

                <section className="rounded-[24px] bg-white p-4 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
                  <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Bill Details</h2>

                  <div className="mt-3 divide-y divide-gray-100">
                    <BillRow label="Items Total" value={formatCurrency(itemsTotal)} />
                    <BillRow
                      label="Delivery Fee"
                      value={deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                      valueClassName={deliveryFee === 0 ? 'text-[#16A34A]' : 'text-[#1A1A2E]'}
                    />
                    <BillRow label="GST (5%)" value={formatCurrency(gst)} />
                    {couponDiscount > 0 ? (
                      <BillRow
                        label="Coupon Discount"
                        value={`-${formatCurrency(couponDiscount)}`}
                        valueClassName="text-[#16A34A]"
                      />
                    ) : null}
                  </div>

                  <div className="mt-3 border-t-2 border-dashed border-gray-200 pt-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[16px] font-extrabold text-[#1A1A2E]">Grand Total</span>
                      <span className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {itemCount > 0 ? (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.32,
              delay: shouldReduceMotion ? 0 : 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/[0.97] shadow-[0_-18px_40px_rgba(26,26,46,0.08)] backdrop-blur-xl"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
          >
            <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-3 px-4 pb-3 pt-3 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6B7280]">Grand Total</p>
                <p className="mt-1 text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                  {formatCurrency(grandTotal)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-5 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)]"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </main>

      <AnimatePresence>
        {activeView === 'checkout' ? (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <button
              type="button"
              aria-label="Close checkout"
              onClick={handleCloseCheckout}
              className="absolute inset-0 bg-black/20"
            />

            <motion.section
              initial={shouldReduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: shouldReduceMotion ? 0.18 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`${plusJakartaSans.className} absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col bg-[#F5F7FA] text-[#1A1A2E] shadow-[-24px_0_60px_rgba(26,26,46,0.16)]`}
            >
              <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4 sm:px-6 lg:px-8">
                <header className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseCheckout}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1A1A2E] shadow-[0_10px_24px_rgba(26,26,46,0.05)]"
                    aria-label="Back to cart"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div>
                    <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">Checkout</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      One last step before your groceries are on the way.
                    </p>
                  </div>
                </header>

                <section className="mt-5 rounded-[24px] bg-white p-4 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#CC2222]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full bg-[#FFF3F3] px-3 py-1 text-[12px] font-bold text-[#CC2222]">
                          {deliveryAddress.badge}
                        </span>
                        <button
                          type="button"
                          onClick={handleChangeAddress}
                          className="text-sm font-bold text-[#2299DD]"
                        >
                          Change
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#1A1A2E]">{deliveryAddress.fullAddress}</p>
                    </div>
                  </div>
                </section>

                <section className="mt-5 rounded-[24px] bg-white p-4 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
                  <h3 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Payment Method</h3>

                  <div className="mt-4 space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`flex w-full items-start justify-between gap-3 rounded-[22px] border p-4 text-left transition ${
                        paymentMethod === 'online'
                          ? 'border-[#CC2222] bg-[#FFF3F3] shadow-[0_12px_24px_rgba(204,34,34,0.08)]'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#CC2222] shadow-[0_8px_18px_rgba(26,26,46,0.05)]">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-extrabold text-[#1A1A2E]">Pay Online (UPI, Cards, Netbanking)</p>
                            <span className="rounded-full bg-[#EAF4FF] px-2.5 py-1 text-[11px] font-bold text-[#2299DD]">
                              Razorpay
                            </span>
                            <span className="rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[11px] font-bold text-[#16A34A]">
                              Recommended
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#6B7280]">
                            Faster checkout and instant payment confirmation.
                          </p>
                        </div>
                      </div>

                      <span
                        className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          paymentMethod === 'online'
                            ? 'border-[#CC2222] bg-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            paymentMethod === 'online' ? 'bg-[#CC2222]' : 'bg-transparent'
                          }`}
                        />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex w-full items-start justify-between gap-3 rounded-[22px] border p-4 text-left transition ${
                        paymentMethod === 'cod'
                          ? 'border-[#CC2222] bg-[#FFF3F3] shadow-[0_12px_24px_rgba(204,34,34,0.08)]'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#CC2222] shadow-[0_8px_18px_rgba(26,26,46,0.05)]">
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-[#1A1A2E]">Cash on Delivery</p>
                          <p className="mt-2 text-sm text-[#6B7280]">
                            Pay {formatCurrency(grandTotal)} to the delivery partner.
                          </p>
                        </div>
                      </div>

                      <span
                        className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          paymentMethod === 'cod'
                            ? 'border-[#CC2222] bg-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            paymentMethod === 'cod' ? 'bg-[#CC2222]' : 'bg-transparent'
                          }`}
                        />
                      </span>
                    </button>
                  </div>
                </section>

                <section className="mt-5 rounded-[24px] bg-white p-4 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
                  <button
                    type="button"
                    onClick={() => setSummaryExpanded((current) => !current)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">{itemCount} items</p>
                      <p className="mt-1 text-sm font-semibold text-[#6B7280]">{formatCurrency(grandTotal)}</p>
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-bold text-[#2299DD]">
                      See details
                      <motion.span animate={{ rotate: summaryExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {summaryExpanded ? (
                      <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={
                          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0 }
                        }
                        transition={{ duration: shouldReduceMotion ? 0.14 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="divide-y divide-gray-100 rounded-2xl bg-[#F8FAFC] px-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                              <div className="min-w-0">
                                <p className="font-bold text-[#1A1A2E]">{item.name}</p>
                                <p className="mt-1 text-[#6B7280]">
                                  {item.weight} x {item.quantity}
                                </p>
                              </div>
                              <p className="shrink-0 font-extrabold text-[#1A1A2E]">
                                {formatCurrency(item.unitPrice * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 rounded-2xl border border-dashed border-gray-200 px-4">
                          <BillRow label="Items Total" value={formatCurrency(itemsTotal)} />
                          <BillRow
                            label="Delivery Fee"
                            value={deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                            valueClassName={deliveryFee === 0 ? 'text-[#16A34A]' : 'text-[#1A1A2E]'}
                          />
                          <BillRow label="GST (5%)" value={formatCurrency(gst)} />
                          {couponDiscount > 0 ? (
                            <BillRow
                              label="Coupon Discount"
                              value={`-${formatCurrency(couponDiscount)}`}
                              valueClassName="text-[#16A34A]"
                            />
                          ) : null}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </section>
              </div>

              <div
                className="border-t border-black/5 bg-white/[0.98] px-4 pb-3 pt-3 shadow-[0_-18px_40px_rgba(26,26,46,0.08)] backdrop-blur-xl sm:px-6 lg:px-8"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
              >
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placeOrderState !== 'idle'}
                  className={`flex h-14 w-full items-center justify-center gap-2 rounded-[20px] text-sm font-extrabold text-white transition ${
                    placeOrderState === 'success'
                      ? 'bg-[#16A34A] shadow-[0_18px_34px_rgba(22,163,74,0.24)]'
                      : 'bg-[linear-gradient(135deg,#CC2222,#E03030)] shadow-[0_18px_34px_rgba(204,34,34,0.24)]'
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={placeOrderState}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: shouldReduceMotion ? 0.12 : 0.18 }}
                      className="inline-flex items-center gap-2"
                    >
                      {placeOrderState === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {placeOrderState === 'success' ? <Check className="h-4 w-4" /> : null}
                      {placeOrderState === 'idle' ? `Place Order \u2014 ${formatCurrency(grandTotal)}` : null}
                      {placeOrderState === 'loading' ? 'Placing Order...' : null}
                      {placeOrderState === 'success' ? 'Order Confirmed' : null}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>

              <AnimatePresence>
                {placeOrderState === 'success' ? (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.16 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#F5F7FA]/85 px-6 backdrop-blur-sm"
                  >
                    <div className="w-full max-w-sm rounded-[30px] bg-white px-6 py-8 text-center shadow-[0_24px_60px_rgba(26,26,46,0.14)]">
                      <motion.div
                        initial={shouldReduceMotion ? false : { scale: 0.7, rotate: -8 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0.2 : 0.34, type: 'spring', bounce: 0.35 }}
                        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]"
                      >
                        <Check className="h-9 w-9" />
                      </motion.div>
                      <h3 className="mt-5 text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                        Order placed
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                        Your groceries are confirmed. Opening live tracking now.
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
