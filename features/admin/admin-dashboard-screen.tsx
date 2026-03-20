'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Bell,
  Boxes,
  Clock3,
  FolderTree,
  IndianRupee,
  LayoutDashboard,
  LineChart as LineChartIcon,
  LogOut,
  Menu,
  Package,
  PencilLine,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Target,
  Trash2,
  Truck,
  UploadCloud,
  UserCircle2,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
});

type AdminPageKey =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'partners'
  | 'promotions'
  | 'analytics'
  | 'settings';

type DashboardStat = {
  id: string;
  label: string;
  value: string;
  comparison: string;
  comparisonTone: 'positive' | 'neutral' | 'alert';
  icon: LucideIcon;
  borderColor: string;
  iconBg: string;
  iconColor: string;
};

type RevenuePoint = {
  day: string;
  revenue: number;
};

type OrderStatus = 'placed' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
type PaymentMethod = 'online' | 'cod';

type OrderLineItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderRecord = {
  id: string;
  customer: string;
  items: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  time: string;
  dateLabel: string;
  dateValue: string;
  address: string;
  paymentMethod: PaymentMethod;
  lineItems: OrderLineItem[];
};

type ProductVariant = {
  id: string;
  size: string;
  mrp: string;
  price: string;
};

type ProductRecord = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
  imageTone: string;
  accent: string;
  variants: ProductVariant[];
};

type ProductFormState = {
  id?: string;
  name: string;
  description: string;
  category: string;
  stock: string;
  inStock: boolean;
  variants: ProductVariant[];
};

const navItems: { id: AdminPageKey; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'partners', label: 'Delivery Partners', icon: Truck },
  { id: 'promotions', label: 'Promotions', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: LineChartIcon },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const dashboardStats: DashboardStat[] = [
  {
    id: 'orders',
    label: "Today's Orders",
    value: '47',
    comparison: '+12% from yesterday',
    comparisonTone: 'positive',
    icon: Package,
    borderColor: '#2299DD',
    iconBg: '#EAF4FF',
    iconColor: '#2299DD',
  },
  {
    id: 'revenue',
    label: "Today's Revenue",
    value: '\u20B924,580',
    comparison: '+8% from yesterday',
    comparisonTone: 'positive',
    icon: IndianRupee,
    borderColor: '#16A34A',
    iconBg: '#ECFDF3',
    iconColor: '#16A34A',
  },
  {
    id: 'partners',
    label: 'Active Delivery Partners',
    value: '5/8',
    comparison: 'online right now',
    comparisonTone: 'neutral',
    icon: Truck,
    borderColor: '#F59E0B',
    iconBg: '#FFF7E8',
    iconColor: '#D97706',
  },
  {
    id: 'pending',
    label: 'Pending Orders',
    value: '12',
    comparison: 'Needs quick action',
    comparisonTone: 'alert',
    icon: Clock3,
    borderColor: '#CC2222',
    iconBg: '#FFF1F1',
    iconColor: '#CC2222',
  },
];

const initialOrders: OrderRecord[] = [
  {
    id: 'CB2024001',
    customer: 'Priya Sharma',
    items: 'Aashirvaad Atta, India Gate Rice',
    itemsCount: 5,
    total: 1006,
    status: 'out_for_delivery',
    time: '2:45 PM',
    dateLabel: 'Mar 20, 2026',
    dateValue: '2026-03-20',
    address: 'House 123, Sarabha Nagar, Near Gurudwara, Ludhiana',
    paymentMethod: 'online',
    lineItems: [
      { name: 'Aashirvaad Atta 5kg', quantity: 1, price: 240 },
      { name: 'India Gate Rice 5kg', quantity: 1, price: 420 },
      { name: 'Fortune Oil 1L', quantity: 2, price: 270 },
      { name: 'Tata Salt 1kg', quantity: 1, price: 28 },
    ],
  },
  {
    id: 'CB2024002',
    customer: 'Rohit Bansal',
    items: 'Tata Salt, Fortune Oil',
    itemsCount: 4,
    total: 612,
    status: 'confirmed',
    time: '2:12 PM',
    dateLabel: 'Mar 20, 2026',
    dateValue: '2026-03-20',
    address: 'Model Town Extension, Ludhiana',
    paymentMethod: 'cod',
    lineItems: [
      { name: 'Fortune Oil 1L', quantity: 2, price: 270 },
      { name: 'Tata Salt 1kg', quantity: 2, price: 56 },
      { name: 'Parle-G Biscuits', quantity: 2, price: 160 },
      { name: 'Sugar 5kg', quantity: 1, price: 126 },
    ],
  },
  {
    id: 'CB2023998',
    customer: 'Simran Kaur',
    items: 'Chana Dal, Mustard Oil',
    itemsCount: 3,
    total: 684,
    status: 'delivered',
    time: '1:30 PM',
    dateLabel: 'Mar 19, 2026',
    dateValue: '2026-03-19',
    address: 'Civil Lines, Ludhiana',
    paymentMethod: 'cod',
    lineItems: [
      { name: 'Chana Dal 1kg', quantity: 2, price: 184 },
      { name: 'Mustard Oil 1L', quantity: 2, price: 350 },
      { name: 'Parle-G Biscuits', quantity: 1, price: 80 },
      { name: 'GST & fees', quantity: 1, price: 70 },
    ],
  },
  {
    id: 'CB2023994',
    customer: 'Aman Verma',
    items: 'Amul Butter, Parle-G',
    itemsCount: 4,
    total: 447,
    status: 'placed',
    time: '12:54 PM',
    dateLabel: 'Mar 19, 2026',
    dateValue: '2026-03-19',
    address: 'Dugri Phase 2, Ludhiana',
    paymentMethod: 'online',
    lineItems: [
      { name: 'Amul Butter 500g', quantity: 1, price: 270 },
      { name: 'Parle-G Biscuits', quantity: 1, price: 80 },
      { name: 'Tata Salt 1kg', quantity: 1, price: 28 },
      { name: 'Fortune Oil 1L', quantity: 1, price: 69 },
    ],
  },
  {
    id: 'CB2023989',
    customer: 'Neha Arora',
    items: 'Sugar, Mustard Oil',
    itemsCount: 2,
    total: 312,
    status: 'cancelled',
    time: '11:18 AM',
    dateLabel: 'Mar 18, 2026',
    dateValue: '2026-03-18',
    address: 'Pakhowal Road, Ludhiana',
    paymentMethod: 'online',
    lineItems: [
      { name: 'Sugar 5kg', quantity: 1, price: 225 },
      { name: 'Mustard Oil 1L', quantity: 1, price: 175 },
    ],
  },
  {
    id: 'CB2023987',
    customer: 'Karan Mehta',
    items: 'India Gate Rice, Tata Salt',
    itemsCount: 6,
    total: 1180,
    status: 'delivered',
    time: '10:42 AM',
    dateLabel: 'Mar 18, 2026',
    dateValue: '2026-03-18',
    address: 'BRS Nagar, Ludhiana',
    paymentMethod: 'cod',
    lineItems: [
      { name: 'India Gate Rice 5kg', quantity: 2, price: 840 },
      { name: 'Tata Salt 1kg', quantity: 2, price: 56 },
      { name: 'Aashirvaad Atta 5kg', quantity: 1, price: 240 },
    ],
  },
  {
    id: 'CB2023982',
    customer: 'Ishita Jain',
    items: 'Aashirvaad Atta, Fortune Oil',
    itemsCount: 4,
    total: 728,
    status: 'out_for_delivery',
    time: '9:58 AM',
    dateLabel: 'Mar 17, 2026',
    dateValue: '2026-03-17',
    address: 'Haibowal Kalan, Ludhiana',
    paymentMethod: 'online',
    lineItems: [
      { name: 'Aashirvaad Atta 5kg', quantity: 2, price: 480 },
      { name: 'Fortune Oil 1L', quantity: 1, price: 135 },
      { name: 'Tata Salt 1kg', quantity: 1, price: 28 },
      { name: 'Amul Butter 500g', quantity: 1, price: 85 },
    ],
  },
];

const initialProducts: ProductRecord[] = [
  {
    id: 'prod-atta',
    name: 'Aashirvaad Atta',
    description: 'Premium whole wheat flour for everyday cooking.',
    category: 'Atta & Flour',
    price: 240,
    stock: 82,
    inStock: true,
    imageTone: 'from-[#FFF1E6] via-[#FFE3CC] to-[#FAD0B1]',
    accent: '#C67C2A',
    variants: [
      { id: 'v1', size: '5 kg', mrp: '280', price: '240' },
      { id: 'v2', size: '10 kg', mrp: '540', price: '499' },
    ],
  },
  {
    id: 'prod-rice',
    name: 'India Gate Basmati Rice',
    description: 'Long-grain basmati rice with rich aroma and texture.',
    category: 'Rice & Grains',
    price: 420,
    stock: 54,
    inStock: true,
    imageTone: 'from-[#E8F7FF] via-[#D8F1FF] to-[#C7E8FF]',
    accent: '#2299DD',
    variants: [{ id: 'v3', size: '5 kg', mrp: '480', price: '420' }],
  },
  {
    id: 'prod-oil',
    name: 'Fortune Oil',
    description: 'Light sunflower oil suited for daily frying and cooking.',
    category: 'Oils & Ghee',
    price: 135,
    stock: 18,
    inStock: true,
    imageTone: 'from-[#FFF4CC] via-[#FFE59A] to-[#FFD76F]',
    accent: '#D4A017',
    variants: [{ id: 'v4', size: '1 L', mrp: '160', price: '135' }],
  },
  {
    id: 'prod-salt',
    name: 'Tata Salt',
    description: 'Vacuum evaporated iodised salt in sealed packs.',
    category: 'Essentials',
    price: 28,
    stock: 0,
    inStock: false,
    imageTone: 'from-[#F5F7FA] via-[#E9EDF4] to-[#DFE5EF]',
    accent: '#6B7280',
    variants: [{ id: 'v5', size: '1 kg', mrp: '28', price: '28' }],
  },
];

const orderStatusMeta: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  placed: {
    label: 'Placed',
    className: 'bg-[#FFF7E8] text-[#B7791F]',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-[#EAF4FF] text-[#2299DD]',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    className: 'bg-[#F3E8FF] text-[#8B5CF6]',
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

const topSellingProducts = [
  { name: 'Aashirvaad Atta', units: 412 },
  { name: 'India Gate Rice', units: 368 },
  { name: 'Fortune Oil', units: 326 },
  { name: 'Tata Salt', units: 281 },
  { name: 'Parle-G Biscuits', units: 244 },
];

function formatCurrency(amount: number) {
  return `\u20B9${new Intl.NumberFormat('en-IN').format(amount)}`;
}

function buildRevenueData() {
  return Array.from({ length: 30 }, (_, index) => {
    const revenue = 15000 + ((index * 1739) % 9000) + (index % 4) * 1150 + (index % 7) * 320;

    return {
      day: `Mar ${index + 1}`,
      revenue,
    };
  });
}

function createBlankVariant(): ProductVariant {
  return {
    id: `variant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    size: '',
    mrp: '',
    price: '',
  };
}

function createEmptyProductForm(): ProductFormState {
  return {
    name: '',
    description: '',
    category: 'Atta & Flour',
    stock: '0',
    inStock: true,
    variants: [createBlankVariant()],
  };
}

function getProductStatusMeta(stock: number, inStock: boolean) {
  if (!inStock || stock === 0) {
    return {
      label: 'Out of Stock',
      className: 'bg-[#FFF1F1] text-[#CC2222]',
    };
  }

  if (stock <= 20) {
    return {
      label: 'Low Stock',
      className: 'bg-[#FFF7E8] text-[#B7791F]',
    };
  }

  return {
    label: 'Active',
    className: 'bg-[#ECFDF3] text-[#16A34A]',
  };
}

function OrderStatusPill({ status }: { status: OrderStatus }) {
  const meta = orderStatusMeta[status];

  return <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${meta.className}`}>{meta.label}</span>;
}

function SidebarNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
        active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {active ? <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#CC2222]" /> : null}
      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-[#CC2222]' : ''}`} />
      <span>{label}</span>
    </button>
  );
}

function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = stat.icon;

  return (
    <article
      className="rounded-[24px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]"
      style={{ borderLeft: `4px solid ${stat.borderColor}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#6B7280]">{stat.label}</p>
          <p className="mt-3 text-[30px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">{stat.value}</p>
          <p
            className={`mt-2 text-sm font-semibold ${
              stat.comparisonTone === 'positive'
                ? 'text-[#16A34A]'
                : stat.comparisonTone === 'alert'
                  ? 'text-[#CC2222]'
                  : 'text-[#6B7280]'
            }`}
          >
            {stat.comparison}
          </p>
        </div>

        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section className="rounded-[28px] bg-white p-8 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF1F1] text-[#CC2222]">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-[24px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">{description}</p>
    </section>
  );
}

type AdminDashboardPageProps = {
  initialPage?: AdminPageKey;
  showSidebar?: boolean;
};

export default function AdminDashboardPage({
  initialPage = 'dashboard',
  showSidebar = true,
}: AdminDashboardPageProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const revenueData = useMemo(() => buildRevenueData(), []);
  const router = useRouter();

  const [activePage, setActivePage] = useState<AdminPageKey>(initialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<'all' | OrderStatus>('all');
  const [ordersDateFrom, setOrdersDateFrom] = useState('');
  const [ordersDateTo, setOrdersDateTo] = useState('');
  const [productForm, setProductForm] = useState<ProductFormState>(createEmptyProductForm());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const currentNavItem = navItems.find((item) => item.id === activePage) ?? navItems[0];
  const categoryOptions = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category))).sort((left, right) => left.localeCompare(right))],
    [products],
  );
  const filteredProducts = useMemo(() => {
    const normalizedQuery = productSearch.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = productCategoryFilter === 'All' || product.category === productCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [productCategoryFilter, productSearch, products]);
  const filteredOrders = useMemo(() => {
    const normalizedQuery = ordersSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedQuery ||
        `${order.customer} ${order.id} ${order.address}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus = ordersStatusFilter === 'all' || order.status === ordersStatusFilter;
      const matchesFrom = !ordersDateFrom || order.dateValue >= ordersDateFrom;
      const matchesTo = !ordersDateTo || order.dateValue <= ordersDateTo;

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [orders, ordersDateFrom, ordersDateTo, ordersSearch, ordersStatusFilter]);
  const recentOrders = useMemo(() => orders.slice(0, 8), [orders]);

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    setSidebarOpen(false);
    if (activePage !== 'orders') {
      setSelectedOrder(null);
    }
    if (activePage !== 'products') {
      setProductModalOpen(false);
      resetProductForm();
    }
  }, [activePage]);

  useEffect(() => {
    if (!sidebarOpen && !selectedOrder && !productModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [productModalOpen, selectedOrder, sidebarOpen]);

  function resetProductForm() {
    setEditingProductId(null);
    setProductForm(createEmptyProductForm());
  }

  function openAddProductModal() {
    resetProductForm();
    setProductModalOpen(true);
  }

  function openEditProductModal(product: ProductRecord) {
    setEditingProductId(product.id);
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      stock: String(product.stock),
      inStock: product.inStock,
      variants: product.variants.map((variant) => ({ ...variant })),
    });
    setProductModalOpen(true);
  }

  function updateProductForm<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
    setProductForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateVariant(
    variantId: string,
    field: keyof ProductVariant,
    value: string,
  ) {
    setProductForm((current) => ({
      ...current,
      variants: current.variants.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant,
      ),
    }));
  }

  function addVariantRow() {
    setProductForm((current) => ({
      ...current,
      variants: [...current.variants, createBlankVariant()],
    }));
  }

  function removeVariantRow(variantId: string) {
    setProductForm((current) => ({
      ...current,
      variants: current.variants.length === 1 ? current.variants : current.variants.filter((variant) => variant.id !== variantId),
    }));
  }

  function handleSaveProduct() {
    const cleanedVariants = productForm.variants.filter(
      (variant) => variant.size.trim() || variant.price.trim() || variant.mrp.trim(),
    );
    const nextVariants = cleanedVariants.length > 0 ? cleanedVariants : [createBlankVariant()];
    const nextPrice = Number(nextVariants[0]?.price || 0);
    const nextStock = Number(productForm.stock || 0);

    const nextProduct: ProductRecord = {
      id: editingProductId ?? `prod-${Date.now()}`,
      name: productForm.name.trim() || 'Untitled Product',
      description: productForm.description.trim() || 'New product description',
      category: productForm.category,
      price: nextPrice,
      stock: nextStock,
      inStock: productForm.inStock && nextStock > 0,
      imageTone: 'from-[#FFE8E8] via-[#FFD1D1] to-[#FFB5B5]',
      accent: '#CC2222',
      variants: nextVariants,
    };

    setProducts((current) => {
      if (!editingProductId) {
        return [nextProduct, ...current];
      }

      return current.map((product) => (product.id === editingProductId ? nextProduct : product));
    });

    setProductModalOpen(false);
    resetProductForm();
  }

  function handleDeleteProduct(productId: string) {
    setProducts((current) => current.filter((product) => product.id !== productId));
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-xl font-black tracking-[-0.08em]">
            <span className="text-[#CC2222]">C</span>
            <span className="text-[#2299DD]">B</span>
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-[0.22em] text-white">CHAHAL BROS</p>
            <span className="mt-1 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/80">
              Admin
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              onClick={() => setActivePage(item.id)}
            />
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-white">Aman Chahal</p>
            <p className="mt-1 truncate text-xs text-gray-400">admin@chahalbros.in</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  const dashboardView = (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <article className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">Revenue — Last 30 Days</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Daily gross sales across all active delivery zones.</p>
            </div>
          </div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CC2222" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#CC2222" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${Math.round(Number(value) / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: '1px solid #EEF2F6',
                    boxShadow: '0 18px 36px rgba(26,26,46,0.08)',
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#CC2222"
                  strokeWidth={3}
                  fill="url(#adminRevenueFill)"
                  activeDot={{ r: 6, fill: '#CC2222', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">Top Selling Products</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Best movers by unit sales this month.</p>
          </div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingProducts} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={118}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#FFF6F6' }}
                  contentStyle={{
                    borderRadius: 16,
                    border: '1px solid #EEF2F6',
                    boxShadow: '0 18px 36px rgba(26,26,46,0.08)',
                  }}
                  formatter={(value) => [`${value} units`, 'Sold']}
                />
                <Bar dataKey="units" radius={[999, 999, 999, 999]} fill="#CC2222" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <article className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#1A1A2E]">Recent Orders</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Latest customer activity across the platform.</p>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('orders')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2299DD]"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-[22px] border border-gray-100 md:block">
          <table className="min-w-full text-left">
            <thead className="bg-[#F8FAFC] text-xs font-bold uppercase tracking-[0.18em] text-[#6B7280]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentOrders.map((order, index) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer transition hover:bg-[#FFF8F8] ${index % 2 === 0 ? 'bg-white' : 'bg-[#FCFDFE]'}`}
                >
                  <td className="px-4 py-4 font-extrabold text-[#1A1A2E]">{order.id}</td>
                  <td className="px-4 py-4 font-semibold text-[#1A1A2E]">{order.customer}</td>
                  <td className="px-4 py-4 text-[#6B7280]">{order.itemsCount} items</td>
                  <td className="px-4 py-4 font-bold text-[#1A1A2E]">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-4">
                    <OrderStatusPill status={order.status} />
                  </td>
                  <td className="px-4 py-4 text-[#6B7280]">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          {recentOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrder(order)}
              className="flex w-full flex-col gap-3 rounded-[22px] border border-gray-100 bg-[#FCFDFE] p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-extrabold text-[#1A1A2E]">{order.id}</p>
                <OrderStatusPill status={order.status} />
              </div>
              <p className="text-sm font-semibold text-[#1A1A2E]">{order.customer}</p>
              <div className="flex items-center justify-between gap-3 text-sm text-[#6B7280]">
                <span>{order.itemsCount} items</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </button>
          ))}
        </div>
      </article>
    </div>
  );

  const ordersView = (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr_0.6fr_0.6fr]">
          <label className="flex h-12 items-center gap-3 rounded-2xl bg-[#F5F7FA] px-4">
            <Search className="h-4 w-4 text-[#6B7280]" />
            <input
              value={ordersSearch}
              onChange={(event) => setOrdersSearch(event.target.value)}
              placeholder="Search customer or order"
              className="h-full w-full bg-transparent text-sm font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
            />
          </label>

          <select
            value={ordersStatusFilter}
            onChange={(event) => setOrdersStatusFilter(event.target.value as 'all' | OrderStatus)}
            className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#1A1A2E] outline-none"
          >
            <option value="all">All statuses</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={ordersDateFrom}
            onChange={(event) => setOrdersDateFrom(event.target.value)}
            className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#1A1A2E] outline-none"
          />

          <input
            type="date"
            value={ordersDateTo}
            onChange={(event) => setOrdersDateTo(event.target.value)}
            className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#1A1A2E] outline-none"
          />
        </div>
      </section>

      <article className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
        <div className="hidden overflow-hidden rounded-[22px] border border-gray-100 lg:block">
          <table className="min-w-full text-left">
            <thead className="bg-[#F8FAFC] text-xs font-bold uppercase tracking-[0.18em] text-[#6B7280]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer transition hover:bg-[#FFF8F8] ${index % 2 === 0 ? 'bg-white' : 'bg-[#FCFDFE]'}`}
                >
                  <td className="px-4 py-4 font-extrabold text-[#1A1A2E]">{order.id}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[#1A1A2E]">{order.customer}</p>
                    <p className="mt-1 text-xs text-[#6B7280]">{order.address}</p>
                  </td>
                  <td className="px-4 py-4 text-[#6B7280]">{order.itemsCount} items</td>
                  <td className="px-4 py-4 font-bold text-[#1A1A2E]">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-4">
                    <OrderStatusPill status={order.status} />
                  </td>
                  <td className="px-4 py-4 text-[#6B7280]">{order.time}</td>
                  <td className="px-4 py-4 text-[#6B7280]">{order.dateLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filteredOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrder(order)}
              className="w-full rounded-[22px] border border-gray-100 bg-[#FCFDFE] p-4 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-[#1A1A2E]">{order.id}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1A1A2E]">{order.customer}</p>
                </div>
                <OrderStatusPill status={order.status} />
              </div>
              <p className="mt-3 text-sm text-[#6B7280]">{order.address}</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#6B7280]">
                <span>{order.dateLabel}</span>
                <span className="font-bold text-[#1A1A2E]">{formatCurrency(order.total)}</span>
              </div>
            </button>
          ))}
        </div>
      </article>
    </div>
  );

  const productsView = (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-4 md:grid-cols-[1.3fr_0.7fr]">
            <label className="flex h-12 items-center gap-3 rounded-2xl bg-[#F5F7FA] px-4">
              <Search className="h-4 w-4 text-[#6B7280]" />
              <input
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                placeholder="Search products"
                className="h-full w-full bg-transparent text-sm font-medium text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
              />
            </label>

            <select
              value={productCategoryFilter}
              onChange={(event) => setProductCategoryFilter(event.target.value)}
              className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#1A1A2E] outline-none"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={openAddProductModal}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-5 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </section>

      <article className="rounded-[28px] bg-white p-5 shadow-[0_16px_40px_rgba(26,26,46,0.05)]">
        <div className="hidden overflow-hidden rounded-[22px] border border-gray-100 lg:block">
          <table className="min-w-full text-left">
            <thead className="bg-[#F8FAFC] text-xs font-bold uppercase tracking-[0.18em] text-[#6B7280]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.map((product, index) => {
                const statusMeta = getProductStatusMeta(product.stock, product.inStock);

                return (
                  <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FCFDFE]'}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${product.imageTone} text-lg font-black`} style={{ color: product.accent }}>
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1A1A2E]">{product.name}</p>
                          <p className="mt-1 text-xs text-[#6B7280]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#6B7280]">{product.category}</td>
                    <td className="px-4 py-4 font-bold text-[#1A1A2E]">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4 font-semibold text-[#1A1A2E]">{product.stock} units</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditProductModal(product)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F7FA] text-[#2299DD]"
                        >
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F1] text-[#CC2222]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {filteredProducts.map((product) => {
            const statusMeta = getProductStatusMeta(product.stock, product.inStock);

            return (
              <div key={product.id} className="rounded-[22px] border border-gray-100 bg-[#FCFDFE] p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${product.imageTone} text-lg font-black`} style={{ color: product.accent }}>
                    {product.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-[#1A1A2E]">{product.name}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{product.category}</p>
                    <p className="mt-3 text-sm font-bold text-[#1A1A2E]">{formatCurrency(product.price)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusMeta.className}`}>
                    {statusMeta.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => openEditProductModal(product)} className="text-sm font-bold text-[#2299DD]">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteProduct(product.id)} className="text-sm font-bold text-[#CC2222]">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );

  function renderCurrentView() {
    if (activePage === 'dashboard') {
      return dashboardView;
    }
    if (activePage === 'orders') {
      return ordersView;
    }
    if (activePage === 'products') {
      return productsView;
    }
    if (activePage === 'categories') {
      return (
        <PlaceholderPage
          title="Categories Workspace"
          description="Organize master categories, featured collections, and merchandising rules from one place. This section is ready for taxonomy controls and shelf sequencing."
          icon={FolderTree}
        />
      );
    }
    if (activePage === 'partners') {
      return (
        <PlaceholderPage
          title="Delivery Partner Control"
          description="Monitor rider availability, shift coverage, and on-road performance. This area can house live location, incentives, and slot assignment tools."
          icon={Truck}
        />
      );
    }
    if (activePage === 'promotions') {
      return (
        <PlaceholderPage
          title="Promotions Studio"
          description="Launch coupons, home banners, and first-order campaigns with margin guardrails. The dashboard shell is ready for a campaign builder next."
          icon={Target}
        />
      );
    }
    if (activePage === 'analytics') {
      return (
        <PlaceholderPage
          title="Analytics Reports"
          description="Track retention, average order value, category movement, and delivery speed in one place. This navigation state is wired and ready for deeper reporting."
          icon={LineChartIcon}
        />
      );
    }

    return (
      <PlaceholderPage
        title="Admin Settings"
        description="Manage permissions, notification rules, payment settings, and storefront defaults from this area. The page state is active and ready for configuration modules."
        icon={Settings}
      />
    );
  }

  const selectedOrderSubtotal = selectedOrder?.lineItems.reduce((total, item) => total + item.price, 0) ?? 0;
  const selectedOrderDeliveryFee = selectedOrderSubtotal >= 299 ? 0 : 25;
  const selectedOrderDelta = selectedOrder ? selectedOrder.total - (selectedOrderSubtotal + selectedOrderDeliveryFee) : 0;
  const productFormCategories = categoryOptions.filter((category) => category !== 'All');

  return (
    <div className={`${plusJakartaSans.className} min-h-screen bg-[#F5F7FA] text-[#1A1A2E]`}>
      <AnimatePresence>
        {showSidebar && sidebarOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-[#0F1020]/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#1A1A2E] shadow-[0_28px_60px_rgba(15,16,32,0.42)] lg:hidden"
              initial={shouldReduceMotion ? { opacity: 1 } : { x: -32, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: -32, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

        {showSidebar ? (
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] bg-[#1A1A2E] lg:block">
            {sidebarContent}
          </aside>
        ) : null}

      <div className={`min-h-screen ${showSidebar ? 'lg:pl-[260px]' : ''}`}>
        <header className="sticky top-0 z-20 border-b border-[#E6EBF2] bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {showSidebar ? (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#1A1A2E] lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
              ) : null}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9CA3AF]">Admin Console</p>
                <h1 className="mt-1 text-[26px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">
                  {currentNavItem.label}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#6B7280] transition hover:border-[#CC2222]/20 hover:text-[#CC2222]"
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#6B7280] transition hover:border-[#CC2222]/20 hover:text-[#CC2222]"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-[#CC2222]" />
              </button>

              <div className="hidden items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#1A1A2E]">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#1A1A2E]">Aman Chahal</p>
                  <p className="text-xs text-[#6B7280]">Super Admin</p>
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-[#1A1A2E] sm:hidden">
                <UserCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {renderCurrentView()}
        </main>
      </div>

      <AnimatePresence>
        {selectedOrder ? (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-[#0F1020]/46 p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.aside
              className="flex h-full w-full max-w-[560px] flex-col overflow-hidden bg-white shadow-[0_32px_70px_rgba(15,16,32,0.24)] sm:rounded-[30px]"
              initial={shouldReduceMotion ? { opacity: 1 } : { x: 48, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: 48, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9CA3AF]">Order Detail</p>
                  <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">
                    {selectedOrder.id}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <OrderStatusPill status={selectedOrder.status} />
                    <span className="rounded-full bg-[#F5F7FA] px-3 py-1 text-[12px] font-bold text-[#475569]">
                      {selectedOrder.dateLabel}
                    </span>
                    <span className="rounded-full bg-[#F5F7FA] px-3 py-1 text-[12px] font-bold text-[#475569]">
                      {selectedOrder.time}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#6B7280]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                <section className="rounded-[24px] border border-gray-100 bg-[#FCFDFE] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#6B7280]">Customer</p>
                      <h3 className="mt-1 text-lg font-extrabold text-[#1A1A2E]">{selectedOrder.customer}</h3>
                    </div>
                    <div className="rounded-full bg-[#FFF1F1] px-3 py-1 text-[12px] font-bold text-[#CC2222]">
                      {selectedOrder.paymentMethod === 'online' ? 'Paid online' : 'Cash on Delivery'}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#6B7280]">{selectedOrder.address}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">Items</p>
                      <p className="mt-2 text-lg font-extrabold text-[#1A1A2E]">{selectedOrder.itemsCount}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">Order Value</p>
                      <p className="mt-2 text-lg font-extrabold text-[#1A1A2E]">{formatCurrency(selectedOrder.total)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">Status</p>
                      <p className="mt-2 text-sm font-extrabold text-[#1A1A2E]">{orderStatusMeta[selectedOrder.status].label}</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-gray-100 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-extrabold text-[#1A1A2E]">Line Items</h3>
                    <span className="text-sm font-semibold text-[#6B7280]">{selectedOrder.items}</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {selectedOrder.lineItems.map((item) => (
                      <div key={`${selectedOrder.id}-${item.name}`} className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8FAFC] px-4 py-3">
                        <div>
                          <p className="font-bold text-[#1A1A2E]">{item.name}</p>
                          <p className="mt-1 text-xs text-[#6B7280]">Qty {item.quantity}</p>
                        </div>
                        <p className="text-sm font-extrabold text-[#1A1A2E]">{formatCurrency(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[24px] border border-gray-100 bg-white p-5">
                  <h3 className="text-lg font-extrabold text-[#1A1A2E]">Bill Summary</h3>

                  <div className="mt-4 space-y-3 text-sm text-[#475569]">
                    <div className="flex items-center justify-between">
                      <span>Items Total</span>
                      <span className="font-bold text-[#1A1A2E]">{formatCurrency(selectedOrderSubtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delivery Fee</span>
                      <span className={`font-bold ${selectedOrderDeliveryFee === 0 ? 'text-[#16A34A]' : 'text-[#1A1A2E]'}`}>
                        {selectedOrderDeliveryFee === 0 ? 'FREE' : formatCurrency(selectedOrderDeliveryFee)}
                      </span>
                    </div>
                    {selectedOrderDelta > 0 ? (
                      <div className="flex items-center justify-between">
                        <span>GST and Fees</span>
                        <span className="font-bold text-[#1A1A2E]">{formatCurrency(selectedOrderDelta)}</span>
                      </div>
                    ) : null}
                    {selectedOrderDelta < 0 ? (
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <span className="font-bold text-[#16A34A]">-{formatCurrency(Math.abs(selectedOrderDelta))}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 border-t border-dashed border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#1A1A2E]">Grand Total</span>
                      <span className="text-xl font-extrabold text-[#1A1A2E]">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </section>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {productModalOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1020]/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setProductModalOpen(false);
              resetProductForm();
            }}
          >
            <motion.form
              className="max-h-[92vh] w-full max-w-[880px] overflow-hidden rounded-[30px] bg-white shadow-[0_34px_80px_rgba(15,16,32,0.28)]"
              initial={shouldReduceMotion ? { opacity: 1 } : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              onSubmit={(event) => {
                event.preventDefault();
                handleSaveProduct();
              }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9CA3AF]">Product Editor</p>
                  <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.04em] text-[#1A1A2E]">
                    {editingProductId ? 'Edit Product' : 'Add Product'}
                  </h2>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    Manage catalog data, variants, pricing, and stock in one compact workflow.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProductModalOpen(false);
                    resetProductForm();
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#6B7280]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[calc(92vh-148px)] overflow-y-auto px-5 py-5 sm:px-6">
                <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                  <section className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-bold text-[#1A1A2E]">Product Name</span>
                        <input
                          value={productForm.name}
                          onChange={(event) => updateProductForm('name', event.target.value)}
                          placeholder="Aashirvaad Atta"
                          className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#1A1A2E] outline-none transition focus:border-[#CC2222]"
                        />
                      </label>

                      <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-bold text-[#1A1A2E]">Description</span>
                        <textarea
                          value={productForm.description}
                          onChange={(event) => updateProductForm('description', event.target.value)}
                          rows={4}
                          placeholder="Describe the product, sourcing, and shelf appeal."
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#1A1A2E] outline-none transition focus:border-[#CC2222]"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-bold text-[#1A1A2E]">Category</span>
                        <select
                          value={productForm.category}
                          onChange={(event) => updateProductForm('category', event.target.value)}
                          className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#1A1A2E] outline-none transition focus:border-[#CC2222]"
                        >
                          {productFormCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-sm font-bold text-[#1A1A2E]">Stock Quantity</span>
                        <input
                          value={productForm.stock}
                          onChange={(event) => updateProductForm('stock', event.target.value)}
                          placeholder="0"
                          inputMode="numeric"
                          className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#1A1A2E] outline-none transition focus:border-[#CC2222]"
                        />
                      </label>
                    </div>

                    <section className="rounded-[24px] border border-gray-100 bg-[#FCFDFE] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-extrabold text-[#1A1A2E]">Variants</h3>
                          <p className="mt-1 text-sm text-[#6B7280]">Add size-wise MRP and selling prices.</p>
                        </div>

                        <button
                          type="button"
                          onClick={addVariantRow}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#CC2222]/15 bg-[#FFF6F6] px-4 text-sm font-bold text-[#CC2222]"
                        >
                          <Plus className="h-4 w-4" />
                          Add Row
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        {productForm.variants.map((variant, index) => (
                          <div key={variant.id} className="grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 md:grid-cols-[1fr_120px_120px_auto]">
                            <input
                              value={variant.size}
                              onChange={(event) => updateVariant(variant.id, 'size', event.target.value)}
                              placeholder={`Variant ${index + 1} size`}
                              className="h-11 rounded-2xl border border-gray-200 px-4 text-sm font-medium text-[#1A1A2E] outline-none transition focus:border-[#CC2222]"
                            />
                            <input
                              value={variant.mrp}
                              onChange={(event) => updateVariant(variant.id, 'mrp', event.target.value)}
                              placeholder="MRP"
                              inputMode="numeric"
                              className="h-11 rounded-2xl border border-gray-200 px-4 text-sm font-medium text-[#1A1A2E] outline-none transition focus:border-[#CC2222]"
                            />
                            <input
                              value={variant.price}
                              onChange={(event) => updateVariant(variant.id, 'price', event.target.value)}
                              placeholder="Price"
                              inputMode="numeric"
                              className="h-11 rounded-2xl border border-gray-200 px-4 text-sm font-medium text-[#1A1A2E] outline-none transition focus:border-[#CC2222]"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantRow(variant.id)}
                              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#FFF1F1] px-4 text-sm font-bold text-[#CC2222]"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>

                  <section className="space-y-5">
                    <div className="rounded-[24px] border border-dashed border-[#CC2222]/25 bg-[#FFF8F8] p-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#CC2222] shadow-[0_12px_24px_rgba(204,34,34,0.08)]">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-extrabold text-[#1A1A2E]">Image Upload</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                        Drag a product image here or connect your media picker in this slot later.
                      </p>
                      <label className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-[#CC2222]/15 bg-white px-4 text-sm font-bold text-[#CC2222]">
                        Browse Image
                        <input type="file" className="hidden" />
                      </label>
                    </div>

                    <div className="rounded-[24px] border border-gray-100 bg-white p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-base font-extrabold text-[#1A1A2E]">Inventory Status</h3>
                          <p className="mt-1 text-sm text-[#6B7280]">Control storefront availability.</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => updateProductForm('inStock', !productForm.inStock)}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition ${
                            productForm.inStock ? 'bg-[#CC2222]' : 'bg-[#D1D5DB]'
                          }`}
                          aria-pressed={productForm.inStock}
                        >
                          <span
                            className={`h-6 w-6 rounded-full bg-white shadow-sm transition ${
                              productForm.inStock ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="mt-4 rounded-2xl bg-[#F8FAFC] p-4">
                        <p className="text-sm font-bold text-[#1A1A2E]">
                          {productForm.inStock ? 'Visible on storefront' : 'Hidden from storefront'}
                        </p>
                        <p className="mt-1 text-sm text-[#6B7280]">
                          Products marked out of stock stay editable here but will not show in customer purchase flows.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-gray-100 bg-white p-5">
                      <h3 className="text-base font-extrabold text-[#1A1A2E]">Quick Summary</h3>
                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-center justify-between text-[#6B7280]">
                          <span>Primary price</span>
                          <span className="font-bold text-[#1A1A2E]">
                            {formatCurrency(Number(productForm.variants[0]?.price || 0))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#6B7280]">
                          <span>Category</span>
                          <span className="font-bold text-[#1A1A2E]">{productForm.category}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#6B7280]">
                          <span>Variant count</span>
                          <span className="font-bold text-[#1A1A2E]">{productForm.variants.length}</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    setProductModalOpen(false);
                    resetProductForm();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-gray-200 px-5 text-sm font-bold text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#CC2222,#E03030)] px-6 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(204,34,34,0.24)]"
                >
                  Save Product
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
