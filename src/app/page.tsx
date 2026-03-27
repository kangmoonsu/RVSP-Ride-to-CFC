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

      {/* Main Content Section */}
      <main className="grow flex flex-col items-center justify-center px-6 z-10 relative max-w-5xl mx-auto py-12 w-full">
        
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4 font-headline">
            Welcome to Church Rides
          </h2>
          <p className="text-on-surface-variant text-lg font-medium">
            Follow the directions below to manage your routes or reserve a ride for Sunday service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Driver Directions */}
          <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 flex flex-col relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">directions_car</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">Drivers: Create a Route</h3>
            <p className="text-on-surface-variant mb-6 text-sm">How to manage your capacity and pickups.</p>
            
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant/20 mb-8 grow">
              <ol className="space-y-4">
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                  <span><strong>Log in</strong> to your account and open the Driver Dashboard.</span>
                </li>
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                  <span>Click <strong>"Create Route"</strong> and set your vehicle capacity and starting location.</span>
                </li>
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
                  <span>Review map updates automatically adding nearby riders to your route.</span>
                </li>
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</span>
                  <span>On Sunday, select <strong>"Start Route"</strong> to track your real-time progress.</span>
                </li>
              </ol>
            </div>

            <Link 
              href="/login" 
              className="mt-auto w-full bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl shadow-sm hover:bg-primary-container hover:text-on-primary-container hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              Access Driver Dashboard
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>

          {/* Rider Directions */}
          <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 flex flex-col relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[28px]">person_raised_hand</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">Riders: Reserve a Ride</h3>
            <p className="text-on-surface-variant mb-6 text-sm">How to secure a seat for Sunday service.</p>
            
            <div className="bg-surface rounded-2xl p-5 border border-outline-variant/20 mb-8 flex-grow">
              <ol className="space-y-4">
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">1</span>
                  <span><strong>Log in</strong> your account and open the Rider Dashboard.</span>
                </li>
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">2</span>
                  <span>Submit a <strong>Ride Request</strong> by confirming your pickup address.</span>
                </li>
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">3</span>
                  <span>Wait for a driver to be assigned; you will be notified once confirmed.</span>
                </li>
                <li className="flex gap-3 text-on-surface-variant">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">4</span>
                  <span>View the <strong>Live Map</strong> on Sunday morning to see driver ETA.</span>
                </li>
              </ol>
            </div>

            <Link 
              href="/login" 
              className="mt-auto w-full bg-secondary text-on-secondary font-bold py-3.5 px-6 rounded-xl shadow-sm hover:bg-secondary-container hover:text-on-secondary-container hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              Access Rider Dashboard
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </div>

        </div>
        
        <div className="mt-12 text-center text-sm text-on-surface-variant bg-surface-container-low px-6 py-3 rounded-full border border-outline-variant/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          If you don't have an account yet, <Link href="/signup" className="text-primary font-bold hover:underline mx-1">Sign Up Here</Link> first.
        </div>

      </main>
    </div>
  );
}
