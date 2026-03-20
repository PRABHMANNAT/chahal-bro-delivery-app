'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  House,
  IndianRupee,
  MapPin,
  Navigation,
  Package,
  Phone,
  Star,
  User,
} from 'lucide-react';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type PartnerTab = 'home' | 'active' | 'history' | 'profile';
type PaymentMethod = 'cod' | 'online';
type DeliveryStage = 'store_pickup' | 'picked_up' | 'out_for_delivery';
type BurstStage = 'picked_up' | 'out_for_delivery' | 'delivered' | null;

type OrderItem = {
  name: string;
  quantity: number;
};

type DeliveryOrder = {
  id: string;
  createdLabel: string;
  area: string;
  itemsCount: number;
  total: number;
  distanceKm: number;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  earned: number;
  items: OrderItem[];
  isNew?: boolean;
};

type HistoryEntry = {
  id: string;
  dateLabel: string;
  timeLabel: string;
  area: string;
  total: number;
  earned: number;
};

type NavItem = {
  id: PartnerTab;
  label: string;
  icon: typeof House;
};

const bottomNavItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'active', label: 'Active', icon: Navigation },
  { id: 'history', label: 'History', icon: Clock3 },
  { id: 'profile', label: 'Profile', icon: User },
];

const initialAvailableOrders: DeliveryOrder[] = [
  {
    id: 'CB2024015',
    createdLabel: '2 min ago',
    area: 'Sarabha Nagar',
    itemsCount: 5,
    total: 958,
    distanceKm: 2.3,
    customerName: 'Priya Sharma',
    phone: '+91 98765-43210',
    address: 'House 123, Sarabha Nagar, Near Gurudwara, Ludhiana',
    paymentMethod: 'cod',
    earned: 80,
    items: [
      { name: 'Aashirvaad Atta 5kg', quantity: 1 },
      { name: 'India Gate Rice 5kg', quantity: 1 },
      { name: 'Fortune Oil 1L', quantity: 2 },
      { name: 'Tata Salt 1kg', quantity: 1 },
    ],
  },
  {
    id: 'CB2024013',
    createdLabel: '4 min ago',
    area: 'Model Town',
    itemsCount: 4,
    total: 642,
    distanceKm: 1.7,
    customerName: 'Rohit Bansal',
    phone: '+91 98765-18240',
    address: 'Street 8, Model Town Extension, Ludhiana',
    paymentMethod: 'online',
    earned: 65,
    items: [
      { name: 'Fortune Oil 1L', quantity: 2 },
      { name: 'Parle-G Biscuits', quantity: 2 },
      { name: 'Sugar 5kg', quantity: 1 },
      { name: 'Tata Salt 1kg', quantity: 2 },
    ],
  },
  {
    id: 'CB2024012',
    createdLabel: '7 min ago',
    area: 'BRS Nagar',
    itemsCount: 6,
    total: 1180,
    distanceKm: 3.1,
    customerName: 'Karan Mehta',
    phone: '+91 99881-67211',
    address: 'Lane 3, BRS Nagar, Ludhiana',
    paymentMethod: 'online',
    earned: 90,
    items: [
      { name: 'India Gate Rice 5kg', quantity: 2 },
      { name: 'Aashirvaad Atta 5kg', quantity: 1 },
      { name: 'Tata Salt 1kg', quantity: 2 },
      { name: 'Amul Butter 500g', quantity: 1 },
    ],
  },
];

const incomingOrder: DeliveryOrder = {
  id: 'CB2024018',
  createdLabel: 'Just now',
  area: 'Civil Lines',
  itemsCount: 3,
  total: 504,
  distanceKm: 1.2,
  customerName: 'Simran Kaur',
  phone: '+91 98150-22118',
  address: 'House 89, Civil Lines, Near Rose Garden, Ludhiana',
  paymentMethod: 'online',
  earned: 60,
  items: [
    { name: 'Chana Dal 1kg', quantity: 2 },
    { name: 'Mustard Oil 1L', quantity: 1 },
    { name: 'Parle-G Biscuits', quantity: 2 },
  ],
  isNew: true,
};

const initialHistory: HistoryEntry[] = [
  { id: 'CB2024009', dateLabel: 'Mar 20, 2026', timeLabel: '10:45 AM', area: 'Haibowal Kalan', total: 742, earned: 75 },
  { id: 'CB2024006', dateLabel: 'Mar 20, 2026', timeLabel: '9:20 AM', area: 'Model Town', total: 628, earned: 68 },
  { id: 'CB2023988', dateLabel: 'Mar 19, 2026', timeLabel: '7:10 PM', area: 'Pakhowal Road', total: 860, earned: 82 },
  { id: 'CB2023981', dateLabel: 'Mar 19, 2026', timeLabel: '2:55 PM', area: 'Sarabha Nagar', total: 944, earned: 80 },
  { id: 'CB2023973', dateLabel: 'Mar 18, 2026', timeLabel: '8:30 PM', area: 'Dugri', total: 520, earned: 58 },
];

function formatCurrency(value: number) {
  return `₹${new Intl.NumberFormat('en-IN').format(value)}`;
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function buildMapLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function MiniBurst({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {[...Array(8)].map((_, index) => {
        const rotate = index * 45;
        const color = ['#22C55E', '#CC2222', '#2299DD', '#F59E0B'][index % 4];

        return (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ x: '-50%', y: '-50%', scale: 0.2, opacity: 0.95 }}
            animate={{
              x: ['-50%', `${Math.cos((rotate * Math.PI) / 180) * 26}px`],
              y: ['-50%', `${Math.sin((rotate * Math.PI) / 180) * 26}px`],
              opacity: [0.95, 0],
              scale: [0.4, 1.05],
            }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof Package;
  accent: string;
}) {
  return (
    <div className="rounded-[22px] bg-white p-3 shadow-[0_14px_30px_rgba(26,26,46,0.05)]">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">{label}</p>
      <p className="mt-1 text-[18px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">{value}</p>
    </div>
  );
}

function ProgressDone({
  label,
  showBurst,
}: {
  label: string;
  showBurst: boolean;
}) {
  return (
    <div className="relative flex items-center gap-3 rounded-[20px] bg-[#ECFDF3] px-4 py-3 text-[#15803D]">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#22C55E] text-white">
        <Check className="h-5 w-5" />
        <AnimatePresence>{showBurst ? <MiniBurst visible={showBurst} /> : null}</AnimatePresence>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#22C55E]">Done</p>
        <p className="text-sm font-extrabold">{label}</p>
      </div>
    </div>
  );
}

function BottomNavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition ${
        active ? 'text-[#CC2222]' : 'text-[#94A3B8]'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-[#CC2222]' : 'text-[#94A3B8]'}`} />
      <span className="text-[11px] font-bold">{item.label}</span>
    </button>
  );
}

type DeliveryPartnerPageProps = {
  initialTab?: PartnerTab;
  showBottomNav?: boolean;
};

export default function DeliveryPartnerPage({
  initialTab = 'home',
  showBottomNav = true,
}: DeliveryPartnerPageProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const timeoutsRef = useRef<number[]>([]);

  const [activeTab, setActiveTab] = useState<PartnerTab>(initialTab);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineNoticeVisible, setOfflineNoticeVisible] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>(initialAvailableOrders);
  const [claimingOrderId, setClaimingOrderId] = useState<string | null>(null);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryOrder | null>(null);
  const [deliveryStage, setDeliveryStage] = useState<DeliveryStage>('store_pickup');
  const [itemsExpanded, setItemsExpanded] = useState(true);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>(initialHistory);
  const [todayDeliveries, setTodayDeliveries] = useState(8);
  const [todayEarnings, setTodayEarnings] = useState(640);
  const [weeklyEarnings, setWeeklyEarnings] = useState(3200);
  const [monthlyEarnings, setMonthlyEarnings] = useState(12400);
  const [confirmDeliveredOpen, setConfirmDeliveredOpen] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [stepBurst, setStepBurst] = useState<BurstStage>(null);
  const [hasInjectedIncomingOrder, setHasInjectedIncomingOrder] = useState(false);

  const hasNewOrder = useMemo(() => availableOrders.some((order) => order.isNew), [availableOrders]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  function scheduleTimeout(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  }

  function triggerBurst(stage: BurstStage) {
    setStepBurst(stage);
    scheduleTimeout(() => {
      setStepBurst((current) => (current === stage ? null : current));
    }, 750);
  }

  useEffect(() => {
    if (!isOnline || activeDelivery || hasInjectedIncomingOrder) {
      return;
    }

    const incomingTimeout = window.setTimeout(() => {
      setAvailableOrders((current) => {
        if (current.some((order) => order.id === incomingOrder.id)) {
          return current;
        }

        return [incomingOrder, ...current];
      });
      setHasInjectedIncomingOrder(true);

      scheduleTimeout(() => {
        setAvailableOrders((current) =>
          current.map((order) => (order.id === incomingOrder.id ? { ...order, isNew: false } : order)),
        );
      }, 4200);
    }, 2400);

    return () => {
      window.clearTimeout(incomingTimeout);
    };
  }, [activeDelivery, hasInjectedIncomingOrder, isOnline]);

  function showToast(message: string) {
    setToastMessage(message);
    scheduleTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2400);
  }

  function handleToggleOnline() {
    setIsOnline((current) => {
      const next = !current;

      if (!next) {
        setOfflineNoticeVisible(true);
        scheduleTimeout(() => {
          setOfflineNoticeVisible(false);
        }, 2200);
      } else {
        setOfflineNoticeVisible(false);
      }

      return next;
    });
  }

  function handleClaimOrder(order: DeliveryOrder) {
    if (!isOnline || activeDelivery || claimingOrderId) {
      return;
    }

    setClaimingOrderId(order.id);

    scheduleTimeout(() => {
      setAvailableOrders((current) =>
        current
          .filter((entry) => entry.id !== order.id)
          .map((entry) => ({ ...entry, isNew: false })),
      );
      setActiveDelivery({ ...order, isNew: false });
      setDeliveryStage('store_pickup');
      setItemsExpanded(true);
      setClaimingOrderId(null);
      setActiveTab('active');
    }, 1000);
  }

  function advanceDeliveryStage() {
    if (!activeDelivery) {
      return;
    }

    if (deliveryStage === 'store_pickup') {
      setDeliveryStage('picked_up');
      triggerBurst('picked_up');
      return;
    }

    if (deliveryStage === 'picked_up') {
      setDeliveryStage('out_for_delivery');
      triggerBurst('out_for_delivery');
      return;
    }

    setConfirmDeliveredOpen(true);
  }

  function handleConfirmDelivered() {
    if (!activeDelivery) {
      return;
    }

    const deliveredOrder = activeDelivery;
    const now = new Date();

    setConfirmDeliveredOpen(false);
    setSuccessVisible(true);
    triggerBurst('delivered');

    scheduleTimeout(() => {
      setHistoryEntries((current) => [
        {
          id: deliveredOrder.id,
          dateLabel: formatDateLabel(now),
          timeLabel: formatTimeLabel(now),
          area: deliveredOrder.area,
          total: deliveredOrder.total,
          earned: deliveredOrder.earned,
        },
        ...current,
      ]);
      setTodayDeliveries((current) => current + 1);
      setTodayEarnings((current) => current + deliveredOrder.earned);
      setWeeklyEarnings((current) => current + deliveredOrder.earned);
      setMonthlyEarnings((current) => current + deliveredOrder.earned);
      setActiveDelivery(null);
      setDeliveryStage('store_pickup');
      setSuccessVisible(false);
      setActiveTab('home');
      showToast(`Delivery completed! +${formatCurrency(deliveredOrder.earned)} earned`);
    }, 1650);
  }

  const shouldShowActiveView = !!activeDelivery && (activeTab === 'active' || activeTab === 'home');

  const currentPrimaryAction = useMemo(() => {
    if (deliveryStage === 'store_pickup') {
      return {
        label: '\u{1F4E6} PICKED UP FROM STORE',
        className:
          'bg-[linear-gradient(135deg,#2299DD,#1B82C5)] text-white shadow-[0_20px_38px_rgba(34,153,221,0.28)]',
      };
    }

    if (deliveryStage === 'picked_up') {
      return {
        label: '\u{1F69A} OUT FOR DELIVERY',
        className:
          'bg-[linear-gradient(135deg,#2299DD,#1B82C5)] text-white shadow-[0_20px_38px_rgba(34,153,221,0.28)]',
      };
    }

    return {
      label: '\u2705 MARK AS DELIVERED',
      className:
        'bg-[linear-gradient(135deg,#22C55E,#18A34A)] text-white shadow-[0_20px_38px_rgba(34,197,94,0.26)]',
    };
  }, [deliveryStage]);

  const feedView = (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
            {'\u{1F514} Available Orders'}
          </h2>
          <span className="rounded-full bg-[#FFF1F1] px-3 py-1 text-xs font-bold text-[#CC2222]">
            {availableOrders.length}
          </span>
        </div>

        {hasNewOrder ? (
          <div className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-4 w-4 rounded-full bg-[#22C55E]" />
            <span className="absolute inline-flex h-4 w-4 rounded-full bg-[#22C55E] opacity-40 animate-ping" />
          </div>
        ) : null}
      </div>

      {!isOnline ? (
        <div className="rounded-[24px] border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
          <p className="text-[32px]">{'\u{1F4F4}'}</p>
          <p className="mt-3 text-lg font-extrabold text-[#1A1A2E]">Go online to receive orders</p>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            New requests, claim actions, and live assignment updates are paused while you are offline.
          </p>
        </div>
      ) : null}

      <AnimatePresence initial={false}>
        {availableOrders.map((order, index) => {
          const isClaimedByYou = claimingOrderId === order.id;
          const isLocked = !!claimingOrderId && claimingOrderId !== order.id;

          return (
            <motion.article
              key={order.id}
              layout
              initial={{
                opacity: 0,
                y: order.isNew ? -16 : 16,
                scale: order.isNew ? 0.98 : 1,
              }}
              animate={{
                opacity: isLocked ? 0.7 : 1,
                y: 0,
                scale: isClaimedByYou ? 0.98 : 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: -10,
                transition: { duration: shouldReduceMotion ? 0 : 0.26, ease: 'easeInOut' },
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.28,
                delay: shouldReduceMotion ? 0 : index * 0.06,
                ease: 'easeOut',
              }}
              className={`relative overflow-hidden rounded-[24px] border-l-4 bg-white p-4 shadow-[0_16px_34px_rgba(26,26,46,0.05)] ${
                isClaimedByYou ? 'border-l-[#22C55E] ring-2 ring-[#22C55E]/15' : 'border-l-[#F59E0B]'
              }`}
            >
              {order.isNew ? (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-[#ECFDF3] px-3 py-1 text-[11px] font-bold text-[#15803D]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                  </span>
                  New order
                </div>
              ) : null}

              {isClaimedByYou ? (
                <div className="absolute right-4 top-4 rounded-full bg-[#ECFDF3] px-3 py-1 text-[11px] font-bold text-[#15803D]">
                  Claimed by you!
                </div>
              ) : null}

              {isLocked ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/78 backdrop-blur-[2px]">
                  <p className="rounded-full bg-[#F1F5F9] px-4 py-2 text-sm font-bold text-[#64748B]">
                    Assigned to Ravi K.
                  </p>
                </div>
              ) : null}

              <div className="flex items-start justify-between gap-3 pr-24">
                <p className="text-[17px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                  Order #{order.id}
                </p>
                <span className="text-xs font-semibold text-[#94A3B8]">{order.createdLabel}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[17px] font-extrabold text-[#1A1A2E]">
                <MapPin className="h-4 w-4 text-[#CC2222]" />
                <span>{order.area}</span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#475569]">
                <span>{order.itemsCount} items</span>
                <span className="font-extrabold text-[#1A1A2E]">{formatCurrency(order.total)}</span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#64748B]">
                <Navigation className="h-4 w-4 text-[#2299DD]" />
                <span>{order.distanceKm.toFixed(1)} km away</span>
              </div>

              <motion.button
                type="button"
                whileTap={!isLocked && !isClaimedByYou && isOnline ? { scale: 0.95 } : undefined}
                onClick={() => handleClaimOrder(order)}
                disabled={isLocked || isClaimedByYou || !isOnline}
                className={`mt-4 flex h-14 w-full items-center justify-center rounded-[18px] px-4 text-sm font-extrabold tracking-[0.02em] transition ${
                  isClaimedByYou
                    ? 'bg-[#22C55E] text-white'
                    : isLocked || !isOnline
                      ? 'bg-[#E2E8F0] text-[#94A3B8]'
                      : 'bg-[#22C55E] text-white shadow-[0_18px_32px_rgba(34,197,94,0.22)]'
                }`}
              >
                {isClaimedByYou ? 'Claiming order...' : 'PICK THIS ORDER'}
              </motion.button>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </section>
  );

  const activeView = (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-[24px] bg-[#ECFDF3] px-4 py-3 text-[#15803D]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em]">{'\u{1F7E2} Active Delivery'}</p>
          <p className="mt-1 text-lg font-extrabold">Order #{activeDelivery?.id}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#22C55E]">Live</span>
      </div>

      <article className="rounded-[24px] bg-white p-4 shadow-[0_16px_34px_rgba(26,26,46,0.05)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#94A3B8]">Customer Info</p>
        <h2 className="mt-3 text-[24px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">
          {activeDelivery?.customerName}
        </h2>

        <a
          href={`tel:${activeDelivery?.phone ?? ''}`}
          className="mt-4 flex min-h-12 items-center gap-3 rounded-[18px] bg-[#F8FAFC] px-4 py-3 text-sm font-bold text-[#1A1A2E]"
        >
          <Phone className="h-4 w-4 text-[#2299DD]" />
          {activeDelivery?.phone}
        </a>

        <a
          href={buildMapLink(activeDelivery?.address ?? '')}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex min-h-12 items-start gap-3 rounded-[18px] bg-[#F8FAFC] px-4 py-3 text-sm font-medium leading-6 text-[#1A1A2E]"
        >
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#CC2222]" />
          <span>{activeDelivery?.address}</span>
        </a>

        <div className="mt-4 flex h-[150px] items-center justify-center rounded-[22px] bg-[#E2E8F0] text-[#64748B]">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <MapPin className="h-5 w-5 text-[#64748B]" />
            </div>
            <p className="text-sm font-semibold">Map preview</p>
          </div>
        </div>
      </article>

      <article className="rounded-[24px] bg-white p-4 shadow-[0_16px_34px_rgba(26,26,46,0.05)]">
        <button
          type="button"
          onClick={() => setItemsExpanded((current) => !current)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#94A3B8]">Order Items</p>
            <p className="mt-2 text-lg font-extrabold text-[#1A1A2E]">{activeDelivery?.itemsCount} items</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#64748B]">
            {itemsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {itemsExpanded ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {activeDelivery?.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-4 rounded-[18px] bg-[#F8FAFC] px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-[#1A1A2E]">
                      {item.name} {'\u00D7'} {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-[#64748B]">Total</span>
          <span className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
            {formatCurrency(activeDelivery?.total ?? 0)}
          </span>
        </div>

        <div
          className={`mt-4 rounded-[18px] px-4 py-3 text-sm font-extrabold ${
            activeDelivery?.paymentMethod === 'cod'
              ? 'bg-[#FFF7E8] text-[#B45309]'
              : 'bg-[#ECFDF3] text-[#15803D]'
          }`}
        >
          {activeDelivery?.paymentMethod === 'cod'
            ? `\u{1F4B5} Cash on Delivery - Collect ${formatCurrency(activeDelivery?.total ?? 0)}`
            : '\u{1F4B3} Paid Online'}
        </div>
      </article>

      <article className="rounded-[24px] bg-white p-4 shadow-[0_16px_34px_rgba(26,26,46,0.05)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#94A3B8]">Delivery Progress</p>

        <div className="mt-4 space-y-3">
          {(deliveryStage === 'picked_up' || deliveryStage === 'out_for_delivery') ? (
            <ProgressDone label="Picked Up" showBurst={stepBurst === 'picked_up'} />
          ) : null}

          {deliveryStage === 'out_for_delivery' ? (
            <ProgressDone label="Out for Delivery" showBurst={stepBurst === 'out_for_delivery'} />
          ) : null}

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={advanceDeliveryStage}
            className={`flex h-14 w-full items-center justify-center rounded-[18px] px-4 text-sm font-extrabold tracking-[0.02em] ${currentPrimaryAction.className}`}
          >
            {currentPrimaryAction.label}
          </motion.button>
        </div>
      </article>
    </section>
  );

  const emptyActiveView = (
    <section className="rounded-[24px] border border-dashed border-gray-300 bg-white px-5 py-10 text-center shadow-[0_16px_34px_rgba(26,26,46,0.04)]">
      <p className="text-[34px]">{'\u{1F9ED}'}</p>
      <p className="mt-4 text-xl font-extrabold text-[#1A1A2E]">No active delivery</p>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
        Claim an available order from Home to start the next delivery workflow.
      </p>
    </section>
  );

  const historyView = (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[24px] bg-white p-4 shadow-[0_16px_34px_rgba(26,26,46,0.05)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94A3B8]">This Week</p>
          <p className="mt-2 text-[24px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
            {formatCurrency(weeklyEarnings)}
          </p>
        </div>
        <div className="rounded-[24px] bg-white p-4 shadow-[0_16px_34px_rgba(26,26,46,0.05)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94A3B8]">This Month</p>
          <p className="mt-2 text-[24px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
            {formatCurrency(monthlyEarnings)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {historyEntries.map((entry, index) => (
          <motion.article
            key={`${entry.id}-${entry.timeLabel}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
              delay: shouldReduceMotion ? 0 : index * 0.04,
            }}
            className="rounded-[24px] bg-white p-4 shadow-[0_16px_34px_rgba(26,26,46,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-[#1A1A2E]">Order #{entry.id}</p>
                <p className="mt-1 text-sm text-[#64748B]">{entry.area}</p>
              </div>
              <span className="rounded-full bg-[#ECFDF3] px-3 py-1 text-[11px] font-bold text-[#15803D]">
                +{formatCurrency(entry.earned)} earned
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className="text-[#64748B]">
                {entry.dateLabel} {'\u2022'} {entry.timeLabel}
              </span>
              <span className="font-extrabold text-[#1A1A2E]">{formatCurrency(entry.total)}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );

  const profileView = (
    <section className="space-y-4">
      <article className="rounded-[24px] bg-white p-5 shadow-[0_16px_34px_rgba(26,26,46,0.05)]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#EEF6FF] text-[#2299DD]">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">Ravi Kumar</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Bike Rider {'\u2022'} PB10-AX-2214
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] bg-[#F8FAFC] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94A3B8]">Status</p>
            <p className={`mt-2 text-lg font-extrabold ${isOnline ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
          <div className="rounded-[20px] bg-[#F8FAFC] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94A3B8]">Rating</p>
            <p className="mt-2 text-lg font-extrabold text-[#1A1A2E]">{'4.8 \u2605'}</p>
          </div>
        </div>
      </article>

      <article className="rounded-[24px] bg-white p-5 shadow-[0_16px_34px_rgba(26,26,46,0.05)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#94A3B8]">Quick Info</p>
        <div className="mt-4 space-y-3 text-sm text-[#475569]">
          <div className="flex items-center justify-between rounded-[18px] bg-[#F8FAFC] px-4 py-3">
            <span>Shift window</span>
            <span className="font-extrabold text-[#1A1A2E]">8:00 AM - 8:00 PM</span>
          </div>
          <div className="flex items-center justify-between rounded-[18px] bg-[#F8FAFC] px-4 py-3">
            <span>Preferred zone</span>
            <span className="font-extrabold text-[#1A1A2E]">Ludhiana Central</span>
          </div>
          <div className="flex items-center justify-between rounded-[18px] bg-[#F8FAFC] px-4 py-3">
            <span>Payout method</span>
            <span className="font-extrabold text-[#1A1A2E]">Weekly bank transfer</span>
          </div>
        </div>
      </article>
    </section>
  );

  return (
    <div className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}>
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F9FC_18%,#F5F7FA_100%)] shadow-[0_0_0_1px_rgba(226,232,240,0.7)]">
        <div className="px-4 pb-28 pt-4 sm:px-5" style={{ minHeight: '100dvh' }}>
          <header className="sticky top-0 z-20 rounded-[28px] bg-white/85 px-4 py-4 shadow-[0_14px_30px_rgba(26,26,46,0.05)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#94A3B8]">Chahal Bros</p>
                <div className="mt-2 flex items-center gap-2">
                  <h1 className="text-[24px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">Delivery</h1>
                  <span className="rounded-full bg-[#EEF6FF] px-3 py-1 text-[11px] font-bold text-[#2299DD]">
                    Partner App
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleOnline}
                className="flex items-center gap-3 rounded-full bg-[#F5F7FA] px-3 py-2"
                aria-pressed={isOnline}
              >
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#94A3B8]">Status</p>
                  <p className={`text-sm font-extrabold ${isOnline ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
                <span
                  className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${
                    isOnline ? 'bg-[#22C55E]' : 'bg-[#CBD5E1]'
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-full bg-white shadow-[0_6px_16px_rgba(26,26,46,0.16)] transition ${
                      isOnline ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </span>
              </button>
            </div>
          </header>

          <AnimatePresence>
            {offlineNoticeVisible ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
                className="fixed left-1/2 top-4 z-40 w-[calc(100%-2rem)] max-w-[448px] -translate-x-1/2 rounded-[24px] border border-gray-200 bg-white px-4 py-3 shadow-[0_18px_36px_rgba(26,26,46,0.12)]"
              >
                <p className="text-sm font-extrabold text-[#1A1A2E]">You&apos;re offline.</p>
                <p className="mt-1 text-sm text-[#6B7280]">You won&apos;t receive new orders.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {(activeTab === 'home' || activeTab === 'active') && (
            <section className="mt-5 grid grid-cols-3 gap-3">
              <StatCard label="Today's Deliveries" value={String(todayDeliveries)} icon={Package} accent="#2299DD" />
              <StatCard label="Earnings" value={formatCurrency(todayEarnings)} icon={IndianRupee} accent="#22C55E" />
              <StatCard label="Avg Rating" value={'4.8 \u2605'} icon={Star} accent="#F59E0B" />
            </section>
          )}

          <div className="mt-5">
            {activeTab === 'home' && !activeDelivery ? feedView : null}
            {shouldShowActiveView ? activeView : null}
            {activeTab === 'active' && !activeDelivery ? emptyActiveView : null}
            {activeTab === 'history' ? historyView : null}
            {activeTab === 'profile' ? profileView : null}
          </div>
        </div>

        {showBottomNav ? (
          <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-gray-200 bg-white/96 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl sm:px-5">
            <div className="flex items-center gap-1 rounded-[24px] bg-[#F8FAFC] p-2">
              {bottomNavItems.map((item) => (
                <BottomNavButton
                  key={item.id}
                  item={item}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </div>
          </nav>
        ) : null}
      </div>

      <AnimatePresence>
        {confirmDeliveredOpen && activeDelivery ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-[#0F172A]/55 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              className="w-full max-w-[448px] rounded-[28px] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.28)]"
            >
              <p className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                Confirm delivery to {activeDelivery.customerName}?
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                Once confirmed, this order will move into your completed deliveries and earnings.
              </p>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={handleConfirmDelivered}
                  className="flex h-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#22C55E,#18A34A)] text-sm font-extrabold text-white shadow-[0_20px_38px_rgba(34,197,94,0.24)]"
                >
                  {'Yes, Delivered \u2705'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeliveredOpen(false)}
                  className="flex h-12 items-center justify-center rounded-[18px] border border-gray-200 text-sm font-bold text-[#475569]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {successVisible ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/58 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              className="relative w-full max-w-[380px] overflow-hidden rounded-[32px] bg-white px-6 py-8 text-center shadow-[0_28px_70px_rgba(15,23,42,0.32)]"
            >
              {[...Array(18)].map((_, index) => {
                const left = (index % 6) * 18 + 6;
                const color = ['#22C55E', '#CC2222', '#2299DD', '#F59E0B'][index % 4];

                return (
                  <motion.span
                    key={index}
                    className="absolute top-4 h-3 w-1.5 rounded-full"
                    style={{ left: `${left}%`, backgroundColor: color }}
                    initial={{ y: -20, rotate: 0, opacity: 0 }}
                    animate={{
                      y: [0, 190],
                      rotate: [0, index % 2 === 0 ? 160 : -160],
                      opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: (index % 6) * 0.03 }}
                  />
                );
              })}

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF3] text-[#22C55E]">
                <Check className="h-10 w-10" />
                <AnimatePresence>{stepBurst === 'delivered' ? <MiniBurst visible /> : null}</AnimatePresence>
              </div>
              <p className="mt-5 text-[26px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">Order Delivered!</p>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                Great run. Returning you to the available orders feed now.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
            className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[448px] -translate-x-1/2 rounded-[20px] bg-[#15803D] px-4 py-3 text-white shadow-[0_18px_34px_rgba(21,128,61,0.28)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/16">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-sm font-extrabold">{toastMessage}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
