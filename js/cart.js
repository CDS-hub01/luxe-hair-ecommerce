// cart.js
// Handles the Cart page: reads the cart from localStorage, merges it
// with full product details, renders rows, and handles quantity
// changes / item removal — all through one delegated click listener.

import { getAllProducts } from "./product-store.js";

// ---- Step 1: Grab elements, in the same order they appear in the HTML ----
const emptyCartState = document.getElementById("empty-cart-state");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCount = document.getElementById("cart-count");

// ---- Step 2: Helpers ----

const formatPrice = (price) => `$${price.toLocaleString()}`;

// Reads the raw cart from localStorage — always returns an array,
// even if nothing has been saved there yet.
const getRawCart = () => JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Merges {id, quantity} entries with full product info. map() because
// we want ONE new array, same length, with each item transformed into
// a richer version of itself — not filtered down.
const getCartWithDetails = () => {
  const cart = getRawCart();

  return cart
    .map((cartItem) => {
      const product = getAllProducts().find((p) => p.id === cartItem.id);
      return product ? { ...product, quantity: cartItem.quantity } : null;
    })
    .filter((item) => item !== null);
};

// ---- Step 3: Cart badge (same pattern as script.js / product.js) ----

const updateCartBadgeCount = () => {
  const cart = getRawCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
};

// ---- Step 4: Render one cart row ----

const createCartItemHTML = (item) => `
  <div class="cart-item">
    <img src="${item.image}" alt="${item.name}" />

    <div class="cart-item-info">
      <h3>${item.name}</h3>
      <p>${formatPrice(item.price)} each</p>
    </div>

    <div class="cart-item-qty">
      <button data-action="decrease" data-id="${item.id}" type="button">−</button>
      <span>${item.quantity}</span>
      <button data-action="increase" data-id="${item.id}" type="button">+</button>
    </div>

    <p class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</p>

    <button class="remove-item-btn" data-action="remove" data-id="${item.id}" type="button">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
`;

// ---- Step 5: Totals ----

const calculateTotal = (cartItems) =>
  cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

const updateSummary = (cartItems) => {
  const total = calculateTotal(cartItems);
  cartSubtotal.textContent = formatPrice(total);
  cartTotal.textContent = formatPrice(total);
};

// ---- Step 6: Show empty state OR the cart contents ----

const toggleEmptyState = (isEmpty) => {
  emptyCartState.hidden = !isEmpty;
  cartItemsContainer.hidden = isEmpty;
  checkoutBtn.disabled = isEmpty;
};

// ---- Step 7: The master render function ----

const renderCart = () => {
  const cartItems = getCartWithDetails();

  toggleEmptyState(cartItems.length === 0);

  cartItemsContainer.innerHTML = cartItems.map(createCartItemHTML).join("");
  updateSummary(cartItems);
  updateCartBadgeCount();
};

// ---- Step 8: Quantity + removal logic ----

const updateQuantity = (id, change) => {
  const cart = getRawCart();
  const item = cart.find((cartItem) => cartItem.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity < 1) {
    // Dropping below 1 means "remove it" rather than showing 0.
    removeItem(id);
    return;
  }

  saveCart(cart);
  renderCart();
};

const removeItem = (id) => {
  const cart = getRawCart();
  // filter() keeps every item EXCEPT the one matching this id.
  const updatedCart = cart.filter((cartItem) => cartItem.id !== id);
  saveCart(updatedCart);
  renderCart();
};

// ---- Step 9: ONE delegated listener handles every button, even ones
// that don't exist yet at page load (they're created by renderCart) ----

const handleCartClick = (event) => {
  // closest() looks for the nearest ancestor (or the element itself)
  // matching this selector — lets us click the icon INSIDE a button
  // and still correctly detect the button itself.
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") updateQuantity(id, 1);
  if (action === "decrease") updateQuantity(id, -1);
  if (action === "remove") removeItem(id);
};

// ---- Step 10: Wire everything up ----
cartItemsContainer.addEventListener("click", handleCartClick);
checkoutBtn.addEventListener("click", () => {
  window.location.href = "checkout.html";
});

renderCart();
