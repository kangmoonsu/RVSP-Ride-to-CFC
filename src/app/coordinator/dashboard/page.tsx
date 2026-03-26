import React from 'react';
import Link from 'next/link';
import { getRoutes } from '@/app/actions/routes';

export default async function CoordinatorDashboard() {
  const routes = await getRoutes();
  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32 selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xl shadow-[0_12px_40px_hsla(168,100%,10%,0.06)] flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors duration-300 rounded-full">
            <span className="material-symbols-outlined text-teal-900 dark:text-teal-50" data-icon="menu">menu</span>
          </button>
          <h1 className="text-xl font-bold text-teal-900 dark:text-teal-50 font-manrope tracking-tight">Coordinator Console</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container shadow-sm border border-outline-variant/10">
            <img alt="Coordinator Profile" className="w-full h-full object-cover" data-alt="Portrait of a professional coordinator in a clean white studio with soft warm lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF_uXYXxdE3oD29NiuGnHyzrWM7OwKRxjJrgxrPECUyVkbb6MlcjVCWVoBHjGV_DrLAjFUNztS4mjGgbUPGt3ye1s5fKLZ2FU4zmKs2Rd-i3Rj1W9e3wLkSA1SJJxu9Sh5PAafhTpAX8cRYFgbiVSh1SaM7t8lsYyhyqAwxKF3Z2VRQvxqjzEFVyy33d6_eaKKClZ-RC28SWQ0YBRUCJ6WMv7QKdlq8_zRrUnt2UZn6EgtEN2xJgOTACJwJ3qNuEL9FgfP7vf0QyY"/>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {/* Welcome Header */}
        <section className="mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">Welcome back, Coordinator</h2>
          <p className="text-on-surface-variant font-medium text-lg max-w-2xl">Peace be with you. Here is the overview of today&apos;s sanctuary transport services.</p>
        </section>

        {/* Stats Overview: Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          <div className="md:col-span-7 bg-surface-container-low p-8 rounded-[2rem] flex flex-col justify-between min-h-[220px] transition-all hover:bg-surface-container-high group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-on-secondary-container font-bold uppercase tracking-widest text-xs mb-4 block">System Reach</span>
                <div className="text-6xl font-extrabold text-primary flex items-baseline gap-2">
                  42 <span className="text-xl font-medium text-on-surface-variant">Riders</span>
                </div>
              </div>
              <div className="p-4 bg-primary text-on-primary rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl" data-icon="diversity_3">diversity_3</span>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-primary font-semibold">
              <span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
              <span className="text-sm">12% more than last Sunday</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-secondary-container p-8 rounded-[2rem] flex flex-col justify-between min-h-[220px] transition-all hover:brightness-95 group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-on-secondary-container font-bold uppercase tracking-widest text-xs mb-4 block">Fleet Status</span>
                <div className="text-6xl font-extrabold text-primary flex items-baseline gap-2">
                  12 <span className="text-xl font-medium text-on-surface-variant">Drivers</span>
                </div>
              </div>
              <div className="p-4 bg-primary text-on-primary rounded-full shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl" data-icon="directions_bus">directions_bus</span>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-primary font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm">Currently active on grid</span>
            </div>
          </div>
        </div>

        {/* Active Routes Section */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="text-2xl font-bold text-primary">Active Routes</h3>
            <button className="text-primary font-bold text-sm hover:underline">View All Schedule</button>
          </div>

          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {routes.map((route: any) => (
              <div key={route.id} className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_4px_20px_hsla(168,100%,10%,0.03)] border border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-surface-container-low">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary-fixed overflow-hidden flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl" data-icon="route">route</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-on-surface">{route.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-on-surface-variant text-base" data-icon="person">person</span>
                      <span className="text-on-surface-variant text-sm font-medium">
                        Driver: {route.default_driver?.full_name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 px-2">
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-tighter font-bold text-stone-400 mb-1">Status</span>
                    <span className="text-xl font-extrabold text-primary">{route.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="h-10 w-px bg-outline-variant/30"></div>
                  <div className="flex flex-col items-end">
                    <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Open
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Placeholder/Decorative Card for Editorial Feel */}
            <div className="relative overflow-hidden group bg-primary h-48 rounded-[2rem] flex items-center px-12 mt-8">
              <div className="relative z-10">
                <h4 className="text-on-primary text-2xl font-bold max-w-xs mb-4">Coordinate a safe journey for every heart.</h4>
                <button className="bg-surface-container-lowest text-primary px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">View Analytics</button>
              </div>
              <img alt="Sanctuary Mood" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700" data-alt="Soft focused warm interior of a modern sanctuary with light streaming through high windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6_wdD_hjfAqRe9AJ3fmAyYAVcHxC1tS1JYiQpjVcAL1Tk93ZpIU83v6FFw6vNH1yrz8LqgaY3PgQsYKTglRdIivDIdAyFusOns0uEEGB56T15pLDT9TSIiAb2wP1ttESZow8xjkuD003qqnlEme0sDjULYdzzcEW4bpVWZ52SBK-aGcNRR3UDmg30MFSGvsaYNPwuzv6RVEttK0x7Ew4Q3CzlZe8x89pySk-c5iQ_d9kYgxBind_i7A7gHqpfypPjBSgJRA9mVS4"/>
            </div>

          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <Link href="/coordinator/routes/new" className="fixed bottom-28 right-8 z-50 bg-primary-container text-on-primary shadow-2xl flex items-center gap-3 px-6 py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-300">
        <span className="material-symbols-outlined" data-icon="add_road">add_road</span>
        <span className="font-bold text-sm uppercase tracking-widest">Create New Route</span>
      </Link>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-2xl shadow-[0_-12px_40px_hsla(168,100%,10%,0.06)] flex justify-around items-center px-4 pb-6 pt-3 rounded-t-[2rem]">
        {/* Home (Active) */}
        <a className="flex flex-col items-center justify-center text-teal-900 dark:text-teal-300 scale-110 group" href="#">
          <span className="material-symbols-outlined mb-1" data-icon="home" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest font-bold">Home</span>
        </a>
        {/* Routes */}
        <a className="flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 hover:text-teal-700 dark:hover:text-teal-200 transition-all" href="#">
          <span className="material-symbols-outlined mb-1" data-icon="route">route</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest font-bold">Routes</span>
        </a>
        {/* Drivers */}
        <a className="flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 hover:text-teal-700 dark:hover:text-teal-200 transition-all" href="#">
          <span className="material-symbols-outlined mb-1" data-icon="person_pin">person_pin</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest font-bold">Drivers</span>
        </a>
        {/* Profile */}
        <a className="flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 hover:text-teal-700 dark:hover:text-teal-200 transition-all" href="#">
          <span className="material-symbols-outlined mb-1" data-icon="account_circle">account_circle</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest font-bold">Profile</span>
        </a>
      </nav>
    </div>
  )
}
