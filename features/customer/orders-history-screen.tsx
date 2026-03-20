'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type PaymentMethod = 'online' | 'cod';
type OrderStatus = 'confirmed' | 'packing' | 'out_for_delivery' | 'delivered' | 'cancelled';
type OrderFilter = 'all' | 'active' | 'delivered' | 'cancelled';
type OrderHistoryItem = {
  id: string;
  dateLabel: string;
  status: OrderStatus;
  preview: string;
  total: number;
  itemCount: number;
  paymentMethod: PaymentMethod;
  cancelStage?: 'placed' | 'confirmed' | 'packing';
};

const filters: { id: OrderFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

const orders: OrderHistoryItem[] = [
  {
    id: 'CB2024001',
    dateLabel: 'Mar 20, 2026',
    status: 'out_for_delivery',
    preview: 'Aashirvaad Atta 5kg, India Gate Rice 5kg... +2 more',
    total: 1006,
    itemCount: 5,
    paymentMethod: 'online',
  },
  {
    id: 'CB2023994',
    dateLabel: 'Mar 18, 2026',
    status: 'packing',
    preview: 'Fortune Oil 1L, Tata Salt 1kg... +3 more',
    total: 612,
    itemCount: 6,
    paymentMethod: 'cod',
  },
  {
    id: 'CB2023988',
    dateLabel: 'Mar 15, 2026',
    status: 'delivered',
    preview: 'Aashirvaad Atta 5kg, India Gate Rice 5kg... +2 more',
    total: 958,
    itemCount: 4,
    paymentMethod: 'online',
  },
  {
    id: 'CB2023981',
    dateLabel: 'Mar 12, 2026',
    status: 'cancelled',
    preview: 'Sugar 5kg, Tata Salt 1kg... +1 more',
    total: 312,
    itemCount: 3,
    paymentMethod: 'online',
    cancelStage: 'confirmed',
  },
  {
    id: 'CB2023976',
    dateLabel: 'Mar 9, 2026',
    status: 'delivered',
    preview: 'Chana Dal 1kg, Mustard Oil 1L... +2 more',
    total: 684,
    itemCount: 4,
    paymentMethod: 'cod',
  },
  {
    id: 'CB2023969',
    dateLabel: 'Mar 6, 2026',
    status: 'confirmed',
    preview: 'Parle-G Biscuits 800g, Amul Butter 500g... +2 more',
    total: 447,
    itemCount: 4,
    paymentMethod: 'online',
  },
];

const statusMeta: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  confirmed: {
    label: 'Order Confirmed',
    className: 'bg-[#EAF4FF] text-[#2299DD]',
  },
  packing: {
    label: 'Being Packed',
    className: 'bg-[#EAF4FF] text-[#2299DD]',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    className: 'bg-[#EAF4FF] text-[#2299DD]',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-[#ECFDF3] text-[#16A34A]',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-[#FFF1F1] text-[#CC2222]',
  },
};

function formatCurrency(amount: number) {
  return `\u20B9${new Intl.NumberFormat('en-IN').format(amount)}`;
}

export default function OrdersHistoryPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');
  const [toastState, setToastState] = useState<{ id: number; message: string } | null>(null);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') {
      return orders;
    }

    if (activeFilter === 'active') {
      return orders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled');
    }

    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (!toastState) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastState(null);
    }, shouldReduceMotion ? 1500 : 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [shouldReduceMotion, toastState]);

  function buildOrderHref(order: OrderHistoryItem) {
    const params = new URLSearchParams({
      items: String(order.itemCount),
      payment: order.paymentMethod,
      total: String(order.total),
      status: order.status,
    });

    if (order.cancelStage) {
      params.set('stage', order.cancelStage);
    }

    return `/orders/${order.id}?${params.toString()}`;
  }

  function openOrder(order: OrderHistoryItem) {
    router.push(buildOrderHref(order));
  }

  function handleReorder() {
    setToastState({
      id: Date.now(),
      message: 'Items added to cart!',
    });
  }

  return (
    <>
      <main
        className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}
        style={{ minHeight: '100dvh' }}
      >
        <div className="mx-auto max-w-4xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
          <motion.header
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.18 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">My Orders</h1>
          </motion.header>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.18 : 0.34,
              delay: shouldReduceMotion ? 0 : 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 border-b border-black/6"
          >
            <div className="no-scrollbar flex gap-6 overflow-x-auto">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`relative whitespace-nowrap pb-3 text-[15px] font-bold transition ${
                      isActive ? 'text-[#CC2222]' : 'text-[#6B7280]'
                    }`}
                  >
                    {filter.label}
                    {isActive ? (
                      <motion.span
                        layoutId="orders-filter-underline"
                        className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#CC2222]"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </motion.section>

          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
              <motion.section
                key="empty-orders"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[58vh] flex-col items-center justify-center px-4 text-center"
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl shadow-[0_20px_42px_rgba(26,26,46,0.08)]">
                  {'\u{1F4E6}'}
                </div>
                <h2 className="mt-6 text-[24px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">No orders yet</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#6B7280]">
                  Start shopping to see your orders here.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/home')}
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-6 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)]"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.section>
            ) : (
              <motion.section
                key={activeFilter}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 space-y-3"
              >
                {filteredOrders.map((order, index) => (
                  <motion.article
                    key={order.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.16 : 0.26,
                      delay: shouldReduceMotion ? 0 : index * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    role="button"
                    tabIndex={0}
                    onClick={() => openOrder(order)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openOrder(order);
                      }
                    }}
                    className="cursor-pointer rounded-[24px] bg-white p-4 shadow-[0_14px_34px_rgba(26,26,46,0.05)] transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#1A1A2E]">Order #{order.id}</h2>
                      <p className="shrink-0 text-sm font-medium text-[#6B7280]">{order.dateLabel}</p>
                    </div>

                    <div className="mt-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusMeta[order.status].className}`}>
                        {statusMeta[order.status].label}
                      </span>
                    </div>

                    <p className="mt-3 truncate text-sm leading-6 text-[#6B7280]">{order.preview}</p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-[18px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">
                        {formatCurrency(order.total)}
                      </p>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleReorder();
                        }}
                        className="inline-flex h-10 items-center justify-center rounded-2xl border-2 border-[#CC2222] px-4 text-sm font-extrabold text-[#CC2222]"
                      >
                        Reorder
                      </button>
                    </div>
                  </motion.article>
                ))}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {toastState ? (
          <motion.div
            key={toastState.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0.14 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-[22px] bg-[#111827] px-4 py-3 text-white shadow-[0_24px_52px_rgba(17,24,39,0.28)]"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#16A34A] text-white">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-white">{toastState.message}</p>
                <p className="mt-1 text-xs text-white/70">Ready for quick checkout</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
