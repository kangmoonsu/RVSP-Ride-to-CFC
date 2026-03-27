import React from 'react';
import Link from 'next/link';
import { getRoutes } from '@/app/actions/routes';
import { signOut } from '@/app/actions/auth';
import BottomNav from '@/components/layout/BottomNav';

export default async function CoordinatorDashboard() {
  const routes = await getRoutes();

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* Mobile sticky header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/10"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Left: Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0 overflow-hidden">
          <span className="material-symbols-outlined text-on-primary-container text-[22px]" aria-hidden="true">person</span>
        </div>

        {/* Center: title */}
        <h1 className="flex-1 text-center text-base font-bold text-on-surface tracking-tight">
          Coordinator
        </h1>

        {/* Right: sign out */}
        <form action={signOut}>
          <button
            type="submit"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 transition-colors"
            aria-label="Sign out"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]" aria-hidden="true">logout</span>
          </button>
        </form>
      </header>

      {/* Page content */}
      <main
        className="flex-1 pt-14 px-4 max-w-2xl mx-auto w-full"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
      >

        {/* Greeting */}
        <div className="mt-5 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Coordinator Console</p>
          <h2 className="text-2xl font-extrabold text-primary font-headline">Peace be with you 🙏</h2>
          <p className="text-on-surface-variant text-sm mt-1">Here&apos;s the overview of this Sunday&apos;s transport services.</p>
        </div>

        {/* Stats — single column on mobile, side-by-side on sm+ */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-surface-container-low p-4 rounded-3xl flex flex-col gap-1 min-h-[120px] justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">System Reach</span>
              <div className="w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">diversity_3</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary leading-none">42</div>
              <div className="text-xs text-on-surface-variant font-medium">Riders</div>
            </div>
            <div className="flex items-center gap-1 text-primary text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">trending_up</span>
              12% vs last week
            </div>
          </div>

          <div className="bg-secondary-container p-4 rounded-3xl flex flex-col gap-1 min-h-[120px] justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-secondary-container">Fleet Status</span>
              <div className="w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">directions_bus</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary leading-none">12</div>
              <div className="text-xs text-on-secondary-container font-medium">Drivers</div>
            </div>
            <div className="flex items-center gap-1 text-primary text-[11px] font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              Active on grid
            </div>
          </div>
        </div>

        {/* Active Routes */}
        <section id="routes" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]" aria-hidden="true">route</span>
              Active Routes
            </h3>
            <Link
              href="/coordinator/routes/new"
              className="text-xs font-bold text-primary hover:underline underline-offset-2"
            >
              View All
            </Link>
          </div>

          {routes.length === 0 ? (
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 text-center">
              <p className="text-on-surface-variant text-sm">No routes yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {routes.map((route: any) => (
                <Link
                  key={route.id}
                  href={`/coordinator/routes/${route.id}`}
                  className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 shadow-sm hover:bg-surface-container transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[24px]" aria-hidden="true">route</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-on-surface truncate">{route.name}</h4>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">person</span>
                      {route.default_driver?.full_name || 'Unassigned'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${route.is_active ? 'bg-primary/10 text-primary' : 'bg-outline/10 text-outline'}`}>
                      {route.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-on-surface-variant" aria-hidden="true">
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions banner */}
        <div className="relative overflow-hidden bg-primary rounded-3xl p-5 flex items-center gap-4">
          <div className="flex-1 z-10">
            <h4 className="text-on-primary font-bold text-base mb-1">Coordinate with care.</h4>
            <p className="text-on-primary/70 text-xs">Every seat filled is a life connected.</p>
          </div>
          <Link
            href="/coordinator/routes/new"
            id="coordinator-create-route-fab"
            className="btn-active shrink-0 bg-surface-container-lowest text-primary px-4 py-2.5 rounded-full font-bold text-sm z-10 shadow-sm"
          >
            + New Route
          </Link>
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav role="coordinator" />
    </div>
  );
}
