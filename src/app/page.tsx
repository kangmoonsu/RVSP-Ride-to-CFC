import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      {/* Navigation */}
      <header
        className="w-full px-5 py-4 flex justify-between items-center z-10"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[22px]" aria-hidden="true">directions_bus</span>
          </div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight font-headline">Church Rides</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            id="nav-login-link"
            className="text-on-surface-variant font-bold px-3 py-2 text-sm rounded-xl hover:bg-surface-container transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            id="nav-signup-link"
            className="bg-primary text-on-primary font-bold py-2 px-4 rounded-full text-sm shadow-md shadow-primary/20 hover:bg-primary-container hover:text-on-primary-container transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 py-6 z-10 max-w-lg mx-auto w-full">

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-3 font-headline leading-tight">
            Your ride to<br />Sunday service 🚐
          </h2>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
            Reserve a seat or manage your route — right from your phone.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4 w-full">

          {/* Driver Card */}
          <div
            id="drivers-card"
            className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 flex flex-col relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-[80px] pointer-events-none" aria-hidden="true" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[26px]" aria-hidden="true">directions_car</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Drivers</h3>
                <p className="text-on-surface-variant text-xs">Create and manage your route</p>
              </div>
            </div>

            <ol className="space-y-2.5 mb-5">
              {[
                'Log in and open the Driver Dashboard.',
                'Tap "Create Route" and set your capacity.',
                'Review and approve boarding riders.',
                'Tap "Start Route" on Sunday to go live.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-on-surface-variant text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <Link
              href="/login"
              id="driver-dashboard-link"
              className="btn-active w-full bg-primary text-on-primary font-bold py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              Driver Dashboard
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>

          {/* Rider Card */}
          <div
            id="riders-card"
            className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 flex flex-col relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/5 rounded-bl-[80px] pointer-events-none" aria-hidden="true" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[26px]" aria-hidden="true">person_raised_hand</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface font-headline">Riders</h3>
                <p className="text-on-surface-variant text-xs">Reserve your seat for Sunday</p>
              </div>
            </div>

            <ol className="space-y-2.5 mb-5">
              {[
                'Log in and open the Rider Dashboard.',
                'Select an available ride and your pickup stop.',
                'Wait for driver confirmation.',
                'Track the driver live on Sunday morning.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-on-surface-variant text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <Link
              href="/login"
              id="rider-dashboard-link"
              className="btn-active w-full bg-secondary text-on-secondary font-bold py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              Rider Dashboard
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* New user hint */}
        <div className="mt-5 text-center">
          <p className="text-sm text-on-surface-variant">
            No account yet?{' '}
            <Link href="/signup" id="home-signup-link" className="text-primary font-bold hover:underline underline-offset-2">
              Sign Up Here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
