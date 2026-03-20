'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Package, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../../stores/cart-store';

const navItems = [
  { href: '/home', label: 'Home', icon: House, match: '/home' },
  { href: '/search', label: 'Search', icon: Search, match: '/search' },
  { href: '/cart', label: 'Cart', icon: ShoppingCart, match: '/cart' },
  { href: '/orders', label: 'Orders', icon: Package, match: '/orders' },
  { href: '/profile', label: 'Profile', icon: User, match: '/profile' },
];

export function CustomerBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/[0.96] shadow-[0_-12px_30px_rgba(26,26,46,0.08)] backdrop-blur-xl"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.45rem)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pb-1 pt-2 sm:px-6 lg:px-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.match}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex min-w-[58px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center"
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#CC2222]' : 'text-[#6B7280]'}`} />
                {item.href === '/cart' && totalItems > 0 ? (
                  <span className="absolute -right-2.5 -top-2 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#CC2222] px-1 text-[10px] font-extrabold text-white shadow-[0_10px_18px_rgba(204,34,34,0.24)]">
                    {totalItems}
                  </span>
                ) : null}
              </div>
              <span className={`text-[12px] font-semibold ${isActive ? 'text-[#CC2222]' : 'text-[#6B7280]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
