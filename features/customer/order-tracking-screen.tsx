'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  MapPin,
  Navigation,
  Phone,
  Star,
  Truck,
  X,
} from 'lucide-react';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type AddressType = 'home' | 'office' | 'other';
type PaymentMethod = 'online' | 'cod';
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
type OrderItem = {
  id: string;
  name: string;
  weight: string;
  quantity: number;
  lineTotal: number;
};
type OrderStatusKey =
  | 'placed'
  | 'confirmed'
  | 'packing'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';
type StepVisualState = 'completed' | 'current' | 'pending';

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

const orderItems: OrderItem[] = [
  { id: 'atta', name: 'Aashirvaad Atta', weight: '5 kg', quantity: 1, lineTotal: 240 },
  { id: 'rice', name: 'India Gate Rice', weight: '5 kg', quantity: 1, lineTotal: 420 },
  { id: 'oil', name: 'Fortune Oil', weight: '1 L', quantity: 2, lineTotal: 270 },
  { id: 'salt', name: 'Tata Salt', weight: '1 kg', quantity: 1, lineTotal: 28 },
];

const timelineStages = [
  {
    key: 'placed',
    label: 'Order Placed',
    timestamp: '2:30 PM',
    title: 'Order Placed',
    eta: 'Confirming your slot now',
    description: 'We have received your grocery basket and started creating the order.',
  },
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    timestamp: '2:31 PM',
    title: 'Order Confirmed',
    eta: 'Store starts processing next',
    description: 'Payment is verified and your delivery slot has been locked in.',
  },
  {
    key: 'packing',
    label: 'Being Packed',
    timestamp: '2:35 PM',
    title: 'Being Packed',
    eta: 'Packing your groceries now',
    description: 'Fresh staples are being packed carefully at the nearest dark store.',
  },
  {
    key: 'assigned',
    label: 'Assigned to Delivery Partner',
    timestamp: '2:40 PM',
    title: 'Assigned to Delivery Partner',
    eta: 'Partner is reaching the store',
    description: 'Ravi Kumar is assigned and getting ready for pickup.',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    timestamp: '2:45 PM',
    title: 'Out for Delivery',
    eta: 'Arriving in ~12 minutes',
    description: 'Your order has left the store and is heading straight to your address.',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    timestamp: '2:57 PM',
    title: 'Order Delivered',
    eta: 'Delivered successfully',
    description: 'Your groceries have been handed over. Enjoy your order.',
  },
] as const satisfies ReadonlyArray<{
  key: Exclude<OrderStatusKey, 'cancelled'>;
  label: string;
  timestamp: string;
  title: string;
  eta: string;
  description: string;
}>;

const outForDeliveryIndex = timelineStages.findIndex((stage) => stage.key === 'out_for_delivery');
const deliveredIndex = timelineStages.length - 1;
const transitionDurations = [3000, 3000, 4000, 3000, 5000];
const timelineStageIndexByKey = timelineStages.reduce<Record<(typeof timelineStages)[number]['key'], number>>(
  (accumulator, stage, index) => {
    accumulator[stage.key] = index;
    return accumulator;
  },
  {} as Record<(typeof timelineStages)[number]['key'], number>,
);

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

function inferCouponDiscount(grandTotal: number, itemsTotal: number, deliveryFee: number) {
  let closestDiscount = 0;
  let closestDelta = Number.POSITIVE_INFINITY;

  for (let discount = 0; discount <= 100; discount += 1) {
    const taxableAmount = Math.max(itemsTotal - discount, 0);
    const gst = Math.round(taxableAmount * 0.05);
    const computedGrandTotal = taxableAmount + gst + deliveryFee;
    const delta = Math.abs(computedGrandTotal - grandTotal);

    if (delta < closestDelta) {
      closestDelta = delta;
      closestDiscount = discount;
    }

    if (delta === 0) {
      return discount;
    }
  }

  return closestDelta <= 2 ? closestDiscount : 0;
}

function TimelineStep({
  label,
  timestamp,
  isReached,
  visualState,
  showConnector,
  connectorDone,
  reducedMotion,
}: {
  label: string;
  timestamp: string;
  isReached: boolean;
  visualState: StepVisualState;
  showConnector: boolean;
  connectorDone: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: isReached ? 1 : 0.62, y: 0 }}
      transition={{ duration: reducedMotion ? 0.14 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4"
    >
      <div className="relative flex w-7 shrink-0 justify-center">
        {showConnector ? (
          connectorDone ? (
            <span className="absolute left-1/2 top-4 h-[calc(100%-0.25rem)] w-px -translate-x-1/2 bg-[#22C55E]" />
          ) : (
            <span className="absolute left-1/2 top-4 h-[calc(100%-0.25rem)] -translate-x-1/2 border-l border-dashed border-[#D1D5DB]" />
          )
        ) : null}

        <div className="relative mt-1 flex h-4 w-4 items-center justify-center">
          {visualState === 'completed' ? (
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E] text-white">
              <Check className="h-2.5 w-2.5" />
            </span>
          ) : null}

          {visualState === 'current' ? (
            <>
              <motion.span
                className="absolute h-4 w-4 rounded-full border-2 border-[#2299DD]/40"
                animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                transition={{
                  duration: reducedMotion ? 1.6 : 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeOut',
                }}
              />
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-[#2299DD] shadow-[0_0_0_3px_rgba(34,153,221,0.12)]" />
            </>
          ) : null}

          {visualState === 'pending' ? <span className="inline-flex h-4 w-4 rounded-full bg-[#E5E7EB]" /> : null}
        </div>
      </div>

      <div className="flex flex-1 items-start justify-between gap-4 pb-6">
        <p className={`text-sm font-extrabold ${isReached ? 'text-[#1A1A2E]' : 'text-[#6B7280]'}`}>{label}</p>
        <span className={`shrink-0 text-sm font-semibold ${isReached ? 'text-[#1A1A2E]' : 'text-[#9CA3AF]'}`}>
          {isReached ? timestamp : '--'}
        </span>
      </div>
    </motion.div>
  );
}

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const statusParam = searchParams.get('status') as OrderStatusKey | null;
  const stageParam = searchParams.get('stage') as (typeof timelineStages)[number]['key'] | null;
  const hasPresetStatus = Boolean(statusParam);
  const resolvedPresetIndex = useMemo(() => {
    if (statusParam === 'cancelled') {
      return timelineStageIndexByKey[stageParam ?? 'confirmed'] ?? timelineStageIndexByKey.confirmed;
    }

    if (statusParam && statusParam in timelineStageIndexByKey) {
      return timelineStageIndexByKey[statusParam as (typeof timelineStages)[number]['key']];
    }

    return 0;
  }, [stageParam, statusParam]);

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>(fallbackDeliveryAddress);
  const [statusIndex, setStatusIndex] = useState(resolvedPresetIndex);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(statusParam === 'cancelled');
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasTriggeredCelebration, setHasTriggeredCelebration] = useState(hasPresetStatus);

  const rawOrderId = params?.id;
  const orderId = (Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId || 'CB2024001').toUpperCase();
  const paymentMethod: PaymentMethod = searchParams.get('payment') === 'cod' ? 'cod' : 'online';

  const totalItemCount = useMemo(() => orderItems.reduce((sum, item) => sum + item.quantity, 0), []);
  const itemCount = useMemo(() => {
    const parsed = Number(searchParams.get('items'));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : totalItemCount;
  }, [searchParams, totalItemCount]);

  const itemsTotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.lineTotal, 0), []);
  const deliveryFee = itemsTotal >= 299 ? 0 : 25;
  const grandTotal = useMemo(() => {
    const parsed = Number(searchParams.get('total'));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : itemsTotal + Math.round(itemsTotal * 0.05) + deliveryFee;
  }, [deliveryFee, itemsTotal, searchParams]);

  const couponDiscount = useMemo(
    () => inferCouponDiscount(grandTotal, itemsTotal, deliveryFee),
    [deliveryFee, grandTotal, itemsTotal],
  );
  const taxableAmount = Math.max(itemsTotal - couponDiscount, 0);
  const gst = Math.round(taxableAmount * 0.05);

  const currentStage = timelineStages[statusIndex];
  const canCancel = !isCancelled && statusIndex < outForDeliveryIndex;
  const partnerVisible = !isCancelled && statusIndex >= 3;
  const paymentBadge = paymentMethod === 'cod' ? '\u{1F4B5} Cash on Delivery' : '\u{1F4B3} Paid via UPI';

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
    setStatusIndex(resolvedPresetIndex);
    setIsCancelled(statusParam === 'cancelled');
    setShowCelebration(false);
    setHasTriggeredCelebration(hasPresetStatus);
  }, [hasPresetStatus, resolvedPresetIndex, statusParam]);

  useEffect(() => {
    if (isCancelled || hasPresetStatus) {
      return;
    }

    const timers: number[] = [];
    const delays = shouldReduceMotion ? [450, 450, 550, 450, 700] : transitionDurations;
    let elapsed = 0;

    delays.forEach((delay, index) => {
      elapsed += delay;
      timers.push(window.setTimeout(() => setStatusIndex(index + 1), elapsed));
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [hasPresetStatus, isCancelled, shouldReduceMotion]);

  useEffect(() => {
    if (isCancelled || hasPresetStatus || statusIndex !== deliveredIndex || hasTriggeredCelebration) {
      return;
    }

    setShowCelebration(true);
    setHasTriggeredCelebration(true);
  }, [hasPresetStatus, hasTriggeredCelebration, isCancelled, statusIndex]);

  useEffect(() => {
    if (!cancelModalOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCancelModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [cancelModalOpen]);

  function getStatusTone() {
    if (isCancelled) {
      return {
        eyebrow: 'Order Update',
        title: 'Order Cancelled',
        eta: 'Cancellation confirmed',
        description: 'Your order has been cancelled before dispatch. If applicable, refunds will reflect shortly.',
        badgeClassName: 'bg-[#FFF1F1] text-[#CC2222]',
        badgeLabel: 'Cancelled',
        emoji: '\u26D4',
      };
    }

    if (statusIndex === deliveredIndex) {
      return {
        eyebrow: 'Order Update',
        title: currentStage.title,
        eta: 'Delivered at 2:57 PM',
        description: currentStage.description,
        badgeClassName: 'bg-[#ECFDF3] text-[#16A34A]',
        badgeLabel: 'Completed',
        emoji: '\u{1F389}',
      };
    }

    return {
      eyebrow: 'Live Status',
      title: currentStage.title,
      eta: currentStage.eta,
      description: currentStage.description,
      badgeClassName: 'bg-[#EAF4FF] text-[#2299DD]',
      badgeLabel: 'Live',
      emoji: '\u{1F69A}',
    };
  }

  function getStepState(stepIndex: number): StepVisualState {
    if (isCancelled) {
      if (stepIndex < statusIndex) {
        return 'completed';
      }
      if (stepIndex === statusIndex) {
        return 'current';
      }
      return 'pending';
    }

    if (statusIndex === deliveredIndex) {
      return 'completed';
    }
    if (stepIndex < statusIndex) {
      return 'completed';
    }
    if (stepIndex === statusIndex) {
      return 'current';
    }
    return 'pending';
  }

  function handleCallPartner() {
    window.location.href = 'tel:+919876543210';
  }

  function handleTrackOnMap() {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(deliveryAddress.compactAddress)}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  }

  function handleHelp() {
    window.location.href = 'tel:+911800123456';
  }

  function handleCancelOrder() {
    setCancelModalOpen(false);
    setIsCancelled(true);
    setStatusIndex((current) => Math.min(current, outForDeliveryIndex - 1));
  }

  const statusTone = getStatusTone();
  const confettiColors = ['#CC2222', '#2299DD', '#22C55E', '#F59E0B', '#E03030'];

  return (
    <>
      <main
        className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
          <motion.header
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.18 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push('/home')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1A1A2E] shadow-[0_10px_24px_rgba(26,26,46,0.05)]"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <p className="truncate text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                  Order #{orderId}
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">Tracking your grocery delivery in real time</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleHelp}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#2299DD] shadow-[0_10px_24px_rgba(26,26,46,0.05)]"
              aria-label="Get help"
            >
              <CircleHelp className="h-5 w-5" />
            </button>
          </motion.header>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.34,
              delay: shouldReduceMotion ? 0 : 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 overflow-hidden rounded-[30px] bg-white p-5 shadow-[0_18px_44px_rgba(26,26,46,0.06)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusTone.badgeClassName}`}>
                  {statusTone.badgeLabel}
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-[#6B7280]">{statusTone.eyebrow}</p>

                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`${isCancelled ? 'cancelled' : currentStage.key}-title`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: shouldReduceMotion ? 0.12 : 0.22 }}
                    className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]"
                  >
                    {statusTone.title}
                  </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${isCancelled ? 'cancelled' : currentStage.key}-eta`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: shouldReduceMotion ? 0.12 : 0.22 }}
                    className="mt-3 text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]"
                  >
                    {statusTone.eta}
                  </motion.p>
                </AnimatePresence>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#6B7280]">{statusTone.description}</p>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  {!isCancelled ? (
                    <>
                      <motion.span
                        className="absolute h-36 w-36 rounded-full bg-[#2299DD]/12"
                        animate={{ scale: [1, 1.18], opacity: [0.7, 0.1] }}
                        transition={{
                          duration: shouldReduceMotion ? 1.9 : 2.2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'easeOut',
                        }}
                      />
                      <motion.span
                        className="absolute h-28 w-28 rounded-full bg-[#2299DD]/14"
                        animate={{ scale: [1, 1.3], opacity: [0.55, 0] }}
                        transition={{
                          duration: shouldReduceMotion ? 1.5 : 1.8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'easeOut',
                          delay: 0.18,
                        }}
                      />
                    </>
                  ) : null}

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2299DD,#46AFE8)] text-[2.1rem] shadow-[0_18px_36px_rgba(34,153,221,0.24)]">
                    {statusTone.emoji}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.34,
              delay: shouldReduceMotion ? 0 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Order Timeline</h2>
                <p className="mt-1 text-sm text-[#6B7280]">Each milestone updates automatically as your order moves forward.</p>
              </div>

              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#2299DD]">
                <Truck className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6">
              {timelineStages.map((step, index) => (
                <TimelineStep
                  key={step.key}
                  label={step.label}
                  timestamp={step.timestamp}
                  isReached={index <= statusIndex}
                  visualState={getStepState(index)}
                  showConnector={index !== timelineStages.length - 1}
                  connectorDone={statusIndex === deliveredIndex ? index < deliveredIndex : index < statusIndex}
                  reducedMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </motion.section>

          <AnimatePresence>
            {partnerVisible ? (
              <motion.section
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: shouldReduceMotion ? 0.18 : 0.3,
                  delay: shouldReduceMotion ? 0 : 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-5 rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#CC2222,#E03030)] text-lg font-extrabold text-white shadow-[0_14px_26px_rgba(204,34,34,0.22)]">
                      RK
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#6B7280]">Your Delivery Partner</p>
                      <h3 className="mt-1 text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">Ravi Kumar</h3>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#FFF8E8] px-3 py-1 text-sm font-bold text-[#B7791F]">
                        <Star className="h-4 w-4 fill-current" />
                        4.8
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCallPartner}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[#2299DD] px-5 text-sm font-extrabold text-[#2299DD]"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </button>
                    <button
                      type="button"
                      onClick={handleTrackOnMap}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[#CC2222] px-5 text-sm font-extrabold text-[#CC2222]"
                    >
                      <Navigation className="h-4 w-4" />
                      Track on Map
                    </button>
                  </div>
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.34,
              delay: shouldReduceMotion ? 0 : 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]"
          >
            <button
              type="button"
              onClick={() => setDetailsOpen((current) => !current)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Order Details</h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in this order
                </p>
              </div>

              <motion.span animate={{ rotate: detailsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-5 w-5 text-[#2299DD]" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {detailsOpen ? (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.14 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="divide-y divide-gray-100 rounded-[24px] bg-[#F8FAFC] px-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 py-4 text-sm">
                        <div className="min-w-0">
                          <p className="font-bold text-[#1A1A2E]">{item.name}</p>
                          <p className="mt-1 text-[#6B7280]">
                            {item.weight} x {item.quantity}
                          </p>
                        </div>
                        <p className="shrink-0 font-extrabold text-[#1A1A2E]">{formatCurrency(item.lineTotal)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[24px] border border-gray-100 bg-white px-4 shadow-[0_10px_24px_rgba(26,26,46,0.03)]">
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
                    <div className="border-t-2 border-dashed border-gray-200 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[16px] font-extrabold text-[#1A1A2E]">Grand Total</span>
                        <span className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">
                          {formatCurrency(grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#EEF4FF] px-4 py-2 text-sm font-bold text-[#2299DD]">
                      {paymentBadge}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#FFF3F3] px-4 py-2 text-sm font-bold text-[#CC2222]">
                      {deliveryAddress.badge}
                    </span>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.section>

          <div className="mt-5 flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#CC2222]" />
              <div className="min-w-0">
                <p className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Delivery Address</p>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">{deliveryAddress.fullAddress}</p>
              </div>
            </div>

            {canCancel ? (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="self-start text-sm font-extrabold text-[#CC2222]"
              >
                Cancel Order
              </button>
            ) : null}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {cancelModalOpen ? (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 pb-4 pt-10 sm:items-center"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0.16 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-[28px] bg-white p-5 shadow-[0_24px_60px_rgba(26,26,46,0.16)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">Are you sure?</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                    Cancelling this order will release your delivery slot and stop further updates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#6B7280]"
                  aria-label="Close cancel dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-2 border-[#D1D5DB] text-sm font-extrabold text-[#1A1A2E]"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)]"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration ? (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-hidden bg-[#0F172A]/45"
          >
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                key={`confetti-${index}`}
                className="confetti-piece"
                style={
                  {
                    left: `${4 + ((index * 11) % 92)}%`,
                    animationDelay: `${(index % 8) * 0.08}s`,
                    animationDuration: `${2.4 + (index % 5) * 0.18}s`,
                    backgroundColor: confettiColors[index % confettiColors.length],
                  } as CSSProperties
                }
              />
            ))}

            <div className="flex min-h-screen items-center justify-center px-4 py-8">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: shouldReduceMotion ? 0.18 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white p-6 text-center shadow-[0_26px_70px_rgba(26,26,46,0.2)]"
              >
                <button
                  type="button"
                  onClick={() => setShowCelebration(false)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#6B7280]"
                  aria-label="Close celebration"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#16A34A,#22C55E)] text-white shadow-[0_22px_42px_rgba(22,163,74,0.24)]">
                  <Check className="h-10 w-10" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-[#16A34A]">Delivered</p>
                <h2 className="mt-3 text-[32px] font-extrabold tracking-[-0.05em] text-[#1A1A2E]">Order Delivered!</h2>
                <p className="mt-3 text-sm leading-6 text-[#6B7280]">
                  Your groceries have arrived. Thanks for shopping with Chahal Bros.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] bg-[#F8FAFC] px-4 py-4 text-left">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6B7280]">Order</p>
                    <p className="mt-2 text-lg font-extrabold text-[#1A1A2E]">#{orderId}</p>
                  </div>
                  <div className="rounded-[22px] bg-[#F8FAFC] px-4 py-4 text-left">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6B7280]">Paid</p>
                    <p className="mt-2 text-lg font-extrabold text-[#1A1A2E]">{formatCurrency(grandTotal)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/home')}
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-6 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)]"
                >
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .confetti-piece {
          position: absolute;
          top: -12%;
          height: 18px;
          width: 10px;
          border-radius: 999px;
          opacity: 0;
          animation-name: confettiFall;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: forwards;
        }

        @keyframes confettiFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -20px, 0) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(0, 115vh, 0) rotate(540deg);
          }
        }
      `}</style>
    </>
  );
}
