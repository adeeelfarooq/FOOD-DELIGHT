<div align="center">

#  Food Delight — Cross-Platform Food Ordering App

A full-stack food ordering application shipped **twice from one codebase** — a native mobile app built with **React Native / Expo**, and a fully responsive web app built with **Next.js** — both sharing the same Firebase backend for authentication, orders, and user data.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-f97316?style=for-the-badge&logo=vercel)](https://food-delight-liard.vercel.app/)
&nbsp;
[![Next.js](https://img.shields.io/badge/Next.js-13.5-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
&nbsp;
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
&nbsp;
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
&nbsp;
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Overview

Food Delight is a complete food-ordering experience — sign up, browse a menu, add items to a cart, check out, and track past orders — delivered natively on mobile **and** as a responsive web app, from a single shared project.

Rather than maintaining two disconnected codebases, the mobile (Expo/React Native) and web (Next.js App Router) clients live side by side and share the same authentication layer, Firestore data model, and cart logic — while each platform gets its own tailored UI layer built with the tools best suited to it (React Native `StyleSheet` + Moti on mobile, Tailwind CSS + shadcn/ui on web).

---

## ✨ Features

- **Authentication** — Email/password sign up & sign in via Firebase Auth, with persisted sessions (`AsyncStorage` on mobile, browser persistence on web)
- **Menu Browsing** — Searchable food catalogue with category filtering
- **Cart System** — Add/remove items, adjust quantities, live subtotal + delivery fee calculation, persisted across sessions
- **Order Placement** — Orders are written to Firestore with delivery address, contact info, and itemized line items
- **Order History** — Past orders list with status badges (Pending / Processing / Delivered / Cancelled) and a detail view per order
- **Profile Management** — Edit name/phone, manage delivery address and contact details from a dedicated Settings screen
- **Light/Dark Theme** — Full theme support on both platforms, toggleable from the header
- **Responsive Web Navigation** — Bottom tab bar on mobile-width viewports, icon nav bar on desktop — powered by the same route structure
- **Animated UI** — Staggered entrance animations (fade/slide/scale) on both platforms — Moti on React Native, custom CSS keyframes on web — for a consistent, polished feel across devices

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Web Framework | Next.js 13 (App Router) |
| Mobile Framework | React Native + Expo SDK 51 |
| Backend | Firebase (Authentication, Firestore) |
| Styling (Web) | Tailwind CSS + shadcn/ui (Radix UI primitives) |
| Styling (Mobile) | React Native `StyleSheet` + Moti (animations) |
| Forms & Validation | React Hook Form + Zod |
| Icons | Lucide React (web) · Expo Vector Icons (mobile) |
| Deployment | Vercel |

---

## 🏗️ Project Structure

```
Food Delight App/
├── app/                     # Next.js App Router — web routes
│   ├── home/                # Food listing + search
│   ├── food/[id]/           # Food detail page
│   ├── cart/                # Cart & checkout
│   ├── orders/[id]/         # Order history & detail
│   ├── order-confirmation/  # Post-checkout confirmation
│   ├── profile/, edit/      # Profile & profile editing
│   ├── settings/            # Delivery address & contact info
│   ├── signin/, signup/     # Auth screens
│   └── layout.js            # Root layout, providers, fonts
│
├── screens/                 # React Native screens (mobile equivalents)
├── navigation/              # React Navigation stack (mobile)
│
├── components/              # Web components (shadcn/ui + custom)
│   └── ui/                  # shadcn/ui primitives
│
├── context/                 # Shared state
│   ├── auth-context.js      # Web auth provider
│   ├── cart-context.js      # Web cart provider
│   └── AuthContext.js, CartContext.js  # Mobile equivalents
│
├── lib/
│   ├── firebase.js          # Web Firebase config
│   └── firebase.native.js   # Mobile Firebase config (AsyncStorage persistence)
│
└── App.js                   # React Native app entry point
```

> **Why two Firebase config files?** Firebase Auth persistence works differently on web (browser storage) vs. React Native (`AsyncStorage`), and bundling React Native's native modules into the Next.js webpack build breaks the web build. Splitting the config keeps each platform's bundle clean while sharing the same Firebase project and data.

---

## 🚀 Getting Started

**Prerequisites:** Node.js v18+, a Firebase project (Auth + Firestore enabled)

```bash
# Clone the repo
git clone https://github.com/adeeelfarooq/FOOD-DELIGHT.git
cd FOOD-DELIGHT

# Install dependencies
npm install
```

### Running the web app
```bash
npm run dev
```
Open `http://localhost:3000`

### Running the mobile app
```bash
npx expo start
```
Scan the QR code with Expo Go, or run on a simulator.

---

## 📌 Key Challenges Solved

**Shared codebase, incompatible bundlers** — React Native's source ships with Flow-typed syntax that Next.js's webpack build can't parse. Solved by splitting platform-specific modules (`firebase.js` / `firebase.native.js`, `auth-context.js` / `AuthContext.js`) so each bundler only ever sees the code it can actually compile.

**Disconnected toast state** — Multiple pages were importing a duplicated copy of the `useToast` hook, so calling `toast()` updated state nobody was listening to. Fixed by pointing every consumer at the single hook instance the `<Toaster />` component actually subscribes to.

**Desktop navigation gap** — The bottom tab bar was (intentionally) hidden above mobile breakpoints, but no equivalent existed for desktop, leaving Orders/Profile unreachable on wide viewports. Solved with a responsive icon nav in the header that only renders at `md:` and above, and hides whichever route is currently active.

**Real order placement** — Checkout originally generated a fake local order ID and never touched Firestore. Rebuilt to validate the user's saved delivery address, write a real order document, and route to a genuine order-confirmation screen using the returned document ID.

---

## 🌐 Live Demo

**[https://food-delight-liard.vercel.app/](https://food-delight-liard.vercel.app/)**

---

## 👤 Author

**Adeel Farooq**

[![GitHub](https://img.shields.io/badge/GitHub-adeeelfarooq-181717?style=flat&logo=github)](https://github.com/adeeelfarooq)
&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-adeeelfarooq-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/adeeelfarooq)

## ⭐ Show Your Support

If you found this project interesting, please consider giving it a **star** ⭐ — it means a lot!

---
