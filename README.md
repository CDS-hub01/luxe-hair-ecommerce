# LUXE Hair — Premium Hair E-Commerce Website

A fully responsive, multi-page e-commerce website for a premium hair extensions and wig brand, built from scratch with vanilla HTML, CSS, and JavaScript (ES6+). No frameworks, no build tools, no backend — every feature (cart, accounts, checkout, admin dashboard) runs entirely in the browser.

Built as a capstone project to solidify core JavaScript fundamentals (DOM manipulation, array methods, events, localStorage, ES6 modules) before moving on to React.

---

## Overview

LUXE Hair is a storefront for hair bundles, wigs, closures, and hair care products. Customers can browse, search, filter, and sort products, create an account, build a cart, and check out through a multi-step flow with live validation and a calculated delivery fee. Store owners get a password-protected admin dashboard to view orders and messages, reply by email, and add new products with an uploaded image — all without touching a single line of code.

---

## Features

**Storefront**
- Responsive product grid with live search, category filter, price-range filter, and sort (price/name)
- Product detail pages with a quantity stepper, stock status, and related products
- Dark mode with a persistent preference, applied consistently across every page
- Slide-down mobile navigation menu with an animated hamburger-to-X icon

**Cart & Checkout**
- Cart persisted in `localStorage` — survives page reloads and navigation
- Checkout with real-time field validation (styled inline errors, not browser defaults)
- Delivery fee calculated from the typed city
- Payment method switcher (Card / Bank Transfer / Pay on Delivery) with input auto-formatting
- An order review step before the order is actually placed

**Accounts**
- Register / Login with saved user data in `localStorage`
- Checkout is gated behind login — guests are redirected to sign in first, then returned to checkout
- "My Orders" page showing a logged-in customer's own order history only

**Admin Dashboard**
- Password-protected login
- Orders tab — view full order details, reply to the customer by email, mark handled, delete
- Messages tab — same workflow for contact-form submissions
- Products tab — add a new product (with drag-and-drop or click-to-upload image) that immediately appears store-wide, or delete one you've added

---

## Built With

- **HTML5** — semantic markup across 10 pages
- **CSS3** — custom properties (design tokens), Flexbox, CSS Grid, mobile-first responsive breakpoints
- **JavaScript (ES6+)** — arrow functions, ES6 modules, array methods (`map`, `filter`, `reduce`, `find`, `some`, `every`), `localStorage`/`sessionStorage`, `FileReader`, event delegation
- **Font Awesome** — icon set (via CDN)

---

## File Structure

```
LUXE HAIR WEBSITE/
├── index.html            Home
├── shop.html              Shop (product grid, search/filter/sort)
├── product.html             Product detail
├── cart.html                  Cart
├── checkout.html                Checkout (validation, delivery fee, review step)
├── about.html                     About & Contact
├── login.html                       Login
├── register.html                      Register
├── my-orders.html                       Customer order history
├── admin.html                             Admin dashboard
│
├── css/
│   └── one stylesheet per page (self-contained, each includes
│       its own copy of shared nav/footer/variable rules)
│
└── js/
    ├── script.js          Shared: dark mode, hamburger menu, account nav, cart badge
    ├── products.js        The original product catalog (source of truth)
    ├── product-store.js   Merges products.js with any admin-added products
    └── one script per page handling that page's own logic
```

---

## Setup

No installation, no dependencies, no build step.

1. Clone or download this repository
2. Open the folder in VS Code (or any editor)
3. Run it with a local server — the **Live Server** VS Code extension is the easiest way, since the JavaScript uses ES6 modules (`import`/`export`), which most browsers block when opening an HTML file directly (`file://`) instead of through a server
4. Open `index.html` through Live Server

---

## Usage

- **Shopping:** browse from Home or Shop, use the search/filter/sort controls, click into any product for details, add to cart
- **Checking out:** add items to cart → "Proceed to Checkout" → log in or register if you haven't already → fill shipping details and payment method → review → confirm
- **Admin access:** go to `admin.html`, log in with the password `luxe2026` (change this in `admin.js` before using this in any real context)

---

## Customization

- **Colors:** every color is a CSS custom property defined at the top of each stylesheet (`--color-primary`, `--color-bg`, etc.) — change the value once per file to re-theme that page
- **Products:** edit the array in `js/products.js` directly, or use the admin dashboard's Products tab to add new ones without touching code
- **Admin password:** change the `ADMIN_PASSWORD` constant at the top of `admin.js`
- **Delivery fee logic:** adjust the city list and rates inside `calculateDeliveryFee()` in `checkout.js`

---

## Known Limitations

This project has no backend or database by design — it's a front-end learning project. A few things are intentionally simplified, and worth knowing before treating this as production-ready:

- **No real payment processing.** The checkout form collects payment details for realism but never sends them anywhere — nothing is actually charged.
- **No real email sending.** "Reply via Email" opens the browser's default mail app with a pre-filled message; it doesn't send anything automatically.
- **Data lives in `localStorage`, per browser.** Accounts, orders, messages, and admin-added products only exist on the device/browser they were created on — they don't sync across devices and aren't stored in any real database.
- **Passwords are stored in plain text** in `localStorage` for both customer accounts and the admin login. This is acceptable for a demo project only — never reuse this pattern for a real application handling real user data.

---

## Author

**Christian Dearson Sokari (CDS)**
200-level Computer Science student, University of Port Harcourt (UniPort)
Built as a vanilla JavaScript capstone project ahead of transitioning to React.
