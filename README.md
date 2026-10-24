# Trainity

> **Note:** This is a **demo/dummy project** — a full redesign of the previous Trainity interface. No real backend, no real payments, no real email. All data is stored in localStorage and resets on clear. Built to showcase the new UI/UX direction.

A free online learning platform for coding education — structured courses, real projects, built for everyone.

**Repository:** [github.com/Tuknwm/tuknwm-TrainityProject](https://github.com/Tuknwm/tuknwm-TrainityProject)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript
- **Styling:** Inline styles + Tailwind CSS (utility classes)
- **Auth:** Mock authentication via localStorage
- **Scroll:** Lenis smooth scroll
- **Font:** Plus Jakarta Sans

## Features

- Homepage with animated KineticGrid background
- Course catalog with YouTube thumbnail previews
- User dashboard — enrolled courses, purchase history
- Admin dashboard — manage courses, reviews, purchases
- Checkout with voucher system and payment method display
- Terminal-style login & register UI
- Animated SVG checkmark on success page
- Responsive layout

## Demo Accounts

| Role  | Email                  | Password     |
|-------|------------------------|--------------|
| Admin | admin@trainity.com     | password123  |
| User  | demo@trainity.com      | password123  |

> Registration is disabled in demo mode. Use the accounts above to explore.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.js              # Homepage
  auth/                # Login, Register, Forgot Password
  user/                # Dashboard, Courses, Checkout, Profile
  admin/               # Admin dashboard, Products, Reviews, Purchases
  produk/              # Course catalog & detail pages
  panduan/             # Guide page
components/
  AppNav.js            # Dashboard navbar
  NavAuthPopout.js     # Auth buttons (homepage navbar)
  KineticGrid.js       # Animated dot grid canvas
  HomeCourseList.js    # Course cards on homepage
  PageTransition.js    # Page fade animation
lib/
  mockAuth.js          # Auth context & session management
  mockStore.js         # Data store (localStorage-backed)
public/
  Logo/                # Trainity logo variants
  payment/             # Payment method SVG logos
  homepage/            # Homepage images
```
