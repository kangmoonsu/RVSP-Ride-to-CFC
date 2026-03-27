'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Role = 'rider' | 'driver' | 'coordinator';

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const navItems: Record<Role, NavItem[]> = {
  rider: [
    { label: 'Dashboard', icon: 'home', href: '/rider/dashboard' },
    { label: 'My Rides', icon: 'local_activity', href: '/rider/dashboard#bookings' },
    { label: 'Profile', icon: 'account_circle', href: '/dashboard' },
  ],
  driver: [
    { label: 'Dashboard', icon: 'home', href: '/driver/dashboard' },
    { label: 'Routes', icon: 'route', href: '/driver/dashboard#routes' },
    { label: 'New Route', icon: 'add_road', href: '/driver/routes/new' },
    { label: 'Profile', icon: 'account_circle', href: '/dashboard' },
  ],
  coordinator: [
    { label: 'Home', icon: 'home', href: '/coordinator/dashboard' },
    { label: 'Routes', icon: 'route', href: '/coordinator/dashboard#routes' },
    { label: 'Drivers', icon: 'person_pin', href: '/coordinator/dashboard#drivers' },
    { label: 'Profile', icon: 'account_circle', href: '/dashboard' },
  ],
};

export default function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navItems[role];

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-2xl border-t border-outline-variant/20 flex items-stretch safe-area-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('#')[0]));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[64px] transition-colors duration-200 ${
              isActive
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span
              className="material-symbols-outlined text-[26px] transition-all duration-200"
              style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isActive ? 'text-primary' : ''}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 w-12 h-0.5 bg-primary rounded-full" aria-hidden="true" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
