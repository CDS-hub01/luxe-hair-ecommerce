// product-store.js
// A single shared source of truth for "every product that exists" —
// combines the original hardcoded catalog (products.js) with any
// products the admin has added at runtime (saved in localStorage,
// since a browser can't actually rewrite products.js itself).
//
// shop.js, product.js, and cart.js all import getAllProducts() from
// here instead of importing `products` directly, so admin-added items
// show up everywhere automatically without touching those files again.

import { products } from './products.js';

export const getAllProducts = () => {
  const customProducts =
    JSON.parse(localStorage.getItem('customProducts')) || [];
  return [...products, ...customProducts];
};
