'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Boxes,
  LayoutDashboard,
  LineChart,
  LogOut,
  Settings,
  ShoppingCart,
  Truck,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '../../providers/auth-provider';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Boxes },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/delivery-partners', label: 'Delivery Partners', icon: Truck },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] bg-[#1A1A2E] lg:block">
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
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={`absolute inset-y-2 left-0 w-1 rounded-full ${isActive ? 'bg-[#CC2222]' : 'bg-transparent'}`} />
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#CC2222]' : 'text-gray-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
              <UserCircle2 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-white">{currentUser?.fullName ?? 'Admin'}</p>
              <p className="mt-1 truncate text-xs text-gray-400">{currentUser?.email ?? 'admin@chahalbros.in'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 text-sm font-bold text-white/80 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
