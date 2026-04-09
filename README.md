# 🚐 CFC Ride — Church Ride Coordination App

A mobile-first web application that connects **church members who need a ride** with **volunteer drivers**, coordinated by a church administrator. Built for [Convenant Fellowship Church (CFC)](https://www.cfchome.org/).

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, React Server Components) |
| **Language** | TypeScript 5 |
| **UI Styling** | Tailwind CSS v4 + Material Symbols Outlined (Google Icons) |
| **Auth & Database** | [Supabase](https://supabase.com) (PostgreSQL + Row-Level Security + Realtime) |
| **Email** | [Resend](https://resend.com) — booking confirmation emails |
| **Maps** | Google Maps JavaScript API (`@react-google-maps/api`) |
| **Hosting** | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions/              # Server Actions (all DB mutations live here)
│   │   ├── auth.ts           # login, signup, signOut, forgotPassword, OAuth
│   │   ├── bookings.ts       # createBooking, approveBooking, getRiderBookings
│   │   ├── profile.ts        # updateDisplayName, updatePasswordFromProfile
│   │   ├── routes.ts         # createDriverRoute, updateRouteBlueprintWithStops, deleteRoute
│   │   ├── runs.ts           # updateRunStatus, completeAndRecreateRun, checkOffStop, getActiveRuns
│   │   └── stops.ts          # stop management helpers
│   │
│   ├── auth/callback/        # Supabase OAuth redirect handler
│   ├── coordinator/          # Coordinator-only pages
│   │   ├── dashboard/        # Manage all routes, runs, driver assignments
│   │   └── routes/           # Create / view route detail
│   ├── driver/
│   │   ├── dashboard/        # Driver's assigned runs, passenger list, check-off stops
│   │   └── routes/
│   │       ├── new/          # Create a new route + first run
│   │       └── [id]/edit/    # Edit route stops, capacity, and next run date
│   ├── rider/
│   │   └── dashboard/        # Browse available rides, book seats, live run tracker
│   ├── profile/              # View/edit name & password (all roles)
│   ├── dashboard/            # Role-based redirect after login
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── layout.tsx            # Root layout (fonts, global metadata)
│   ├── globals.css           # Design tokens, Tailwind theme, utility classes
│   └── page.tsx              # Landing / home page
│
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx         # Mobile bottom navigation bar (role-aware)
│   │   └── MobileHeader.tsx      # Shared sticky top header
│   ├── Map/
│   │   ├── RouteMap.tsx              # Static/interactive route preview map
│   │   ├── LiveRiderStopsTracker.tsx # Realtime stop progress tracker (rider view)
│   │   ├── LiveDriverBroadcaster.tsx # GPS broadcast component (driver, disabled in beta)
│   │   ├── LiveRiderTracker.tsx      # GPS-based tracker (disabled in beta)
│   │   └── DynamicMap.tsx            # Dynamic import wrapper for Leaflet
│   ├── DriverRunActions.tsx      # Start Run / Complete Run buttons with modal
│   └── RiderDashboardRefresher.tsx  # Invisible Realtime client that auto-refreshes the rider page
│
├── types/
│   └── supabase.ts           # Auto-generated Supabase TypeScript types
│
└── utils/supabase/
    ├── client.ts             # Browser-side Supabase client
    ├── server.ts             # Server-side Supabase client (cookies)
    └── middleware.ts         # Session refresh middleware
```

---

## 👥 User Roles

There are **three roles** in this app:

| Role | Access |
|---|---|
| **Rider** | Browse available runs, book a seat, track live run progress |
| **Driver** | View assigned runs, manage passengers, start/complete runs, check off stops |
| **Coordinator** | Create routes, schedule runs, assign drivers, manage all bookings |

---

## 🙋 Rider Guide

### How to Sign Up
1. Go to the app and tap **Sign Up**.
2. Enter your **full name**, **email**, and a **password** (at least 6 characters).
3. Check your email and click the confirmation link.
4. Log in — you'll land on the **Rider Dashboard**.

### How to Book a Ride
1. On the **Rider Dashboard**, scroll to **Available Rides**.
2. Find the route and run date you want.
3. Select your **pickup stop** from the dropdown.
4. Check **"I need a return ride"** if you need a ride back after church.
5. Tap **Book Seat**.
6. Your booking will show as **Pending** until the driver approves it.

> **Note:** You can only have one active booking per route at a time. Once a run is completed and a new one is created, you can book the new one freely.

### How to Track Your Ride on the Day
1. Once the driver starts the run, a **"Your Ride is On the Way!"** banner will appear automatically at the top of your dashboard — no need to refresh.
2. Inside the banner, you'll see a **live stop-by-stop tracker** showing how far the driver is from your pickup stop.
   - 🟢 **Arriving Soon!** — The driver has passed all stops before yours and is heading to you.
   - **X stops away** — How many stops remain before yours.
   - **Driver has passed your stop** — The driver has checked off your stop.

### How to Manage Your Profile
1. Tap **Profile** in the bottom navigation bar.
2. You can:
   - Update your **display name**.
   - Change your **password** (if you signed up with email/password).
3. Tap the respective **Save** button to apply changes.

---

## 🚗 Driver Guide

### How to Sign In
Use the same login page as riders. If you've been assigned the **Driver** role by the coordinator, your bottom navigation will show driver-specific tabs.

### Your Dashboard
- **My Assigned Runs** — All upcoming and in-progress runs assigned to you by the coordinator.
- **My Routes** — Route blueprints you own (stops, capacity, schedule).

### How to Start a Run
1. On your dashboard, find the run scheduled for today under **My Assigned Runs**.
2. Tap **Start Run** — the run status changes to **In Progress** and riders are notified automatically.

### How to Check Off Stops
During a run, as you pick up passengers at each stop:
1. Find the stop in your run's **Stops & Passengers** list.
2. Tap **Check Off** next to the stop name.
3. The stop is marked as completed and riders tracking the run will see the update in real time.

### How to Approve a Passenger
When a rider books a seat, their status starts as **Pending**:
1. In your run's passenger list, find riders marked as **Pending**.
2. Tap **Approve** — the rider receives a confirmation email automatically.

### How to Complete a Run
1. After the last stop, tap **Complete Run**.
2. A prompt will ask: **"Automatically create this same route for next week?"**
   - Tap **Yes, schedule** — the app creates a new run 7 days ahead for riders to book.
   - Tap **No, just finish** — the run is marked complete with no follow-up run created.

### How to Edit Your Route
1. On your dashboard, scroll to **My Routes**.
2. Tap **Edit Route** on the route you want to update.
3. You can:
   - Add, remove, or reorder **pickup stops** (search by address or tap the map).
   - Update the **seat capacity**.
   - Change the **date and time** of the next scheduled run.
4. Tap **Save All Changes**.

### How to Create a New Route
1. Tap **New Route** (top right of **My Assigned Runs** or the bottom nav).
2. Enter a **route name**.
3. Add your **pickup stops** by searching for addresses. Drag the map pins to fine-tune locations.
4. Set the **seat capacity** and **departure date & time**.
5. Tap **Publish Route & Schedule Next Run**.

---

## 🗄 Database Overview (Supabase)

| Table | Purpose |
|---|---|
| `users` | Stores full_name, email, role for each registered user |
| `routes` | Route blueprints (name, stops, capacity, default driver) |
| `route_stops` | Individual stops belonging to a route (with lat/lng, order) |
| `route_runs` | A specific scheduled instance of a route on a given date |
| `ride_bookings` | A rider's booking for a specific run (status: pending → confirmed) |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Google Maps API key](https://developers.google.com/maps) with Maps JS + Places APIs enabled
- (Optional) A [Resend](https://resend.com) account for confirmation emails

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key   # optional — emails are simulated if missing
```

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deployment

This app is deployed on **Vercel**. To deploy your own instance:

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add all environment variables in the Vercel project settings.
4. Set the **Supabase Auth redirect URL** to `https://your-domain.com/auth/callback`.

---

*Built with ❤️ for CFC — making it easier for the church community to serve one another.*
