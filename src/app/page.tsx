import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      {/* Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
           </div>
           <h1 className="text-2xl font-extrabold text-primary tracking-tight font-headline">Church Rides</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-on-surface-variant font-bold hover:text-primary transition-colors px-4 py-2">
            Log In
          </Link>
          <Link href="/signup" className="hidden sm:inline-flex bg-primary text-on-primary font-bold py-2.5 px-6 rounded-full shadow-md shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container hover:shadow-lg transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 z-10 text-center relative max-w-4xl mx-auto pb-20">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-secondary-container/50 text-on-secondary-container px-4 py-1.5 text-sm font-bold rounded-full mb-8 border border-secondary/10 shadow-sm animate-fade-in">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
          Routing Made Simple
        </div>

        {/* Hero Headline */}
        <h2 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6 font-headline">
          Sunday Service Rides, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Reimagined.</span>
        </h2>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Whether you need a ride to service or have extra seats in your car, Church Rides connects our community quickly and securely using dynamic GPS routing.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto bg-primary text-on-primary font-bold py-4 px-8 rounded-full shadow-xl shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            Join the Community
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">arrow_forward</span>
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto bg-surface-container-low text-on-surface font-bold py-4 px-8 rounded-full border border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            Sign In
          </Link>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full border-t border-outline-variant/20 pt-16">
          <div className="flex flex-col gap-3">
             <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-2">
               <span className="material-symbols-outlined text-[24px]">map</span>
             </div>
             <h3 className="text-xl font-bold text-on-surface">Dynamic GPS Routing</h3>
             <p className="text-on-surface-variant text-sm leading-relaxed">Smart mapping directs drivers to multiple stops effortlessly, reducing trip times.</p>
          </div>
          <div className="flex flex-col gap-3">
             <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-2">
               <span className="material-symbols-outlined text-[24px]">groups</span>
             </div>
             <h3 className="text-xl font-bold text-on-surface">Community Focused</h3>
             <p className="text-on-surface-variant text-sm leading-relaxed">Built for safety and connection, ensuring everyone gets to church safely.</p>
          </div>
          <div className="flex flex-col gap-3">
             <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-2">
               <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
             </div>
             <h3 className="text-xl font-bold text-on-surface">Live Tracking</h3>
             <p className="text-on-surface-variant text-sm leading-relaxed">Riders can track drivers approaching their stop in real-time, preventing missed pickups.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
