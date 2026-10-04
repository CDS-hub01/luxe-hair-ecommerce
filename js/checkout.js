// checkout.js
// Handles the Checkout page end-to-end: order summary with delivery
// fee, payment method switching, real-time field validation, an order
// review step, and simulating placing an order. No real payment is
// processed — this is front-end only.

import { getAllProducts } from "./product-store.js";

// ---- Step 1: Grab elements, in the same order they appear in the HTML ----
const cartCount = document.getElementById("cart-count");
const checkoutFormWrap = document.getElementById("checkout-form-wrap");
const checkoutForm = document.getElementById("checkout-form");

const fullNameInput = document.getElementById("full-name");
const checkoutEmailInput = document.getElementById("checkout-email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");

const paymentCard = document.getElementById("payment-card");
const paymentBank = document.getElementById("payment-bank");
const paymentPod = document.getElementById("payment-pod");

const cardFields = document.getElementById("card-fields");
const cardNameInput = document.getElementById("card-name");
const cardNumberInput = document.getElementById("card-number");
const cardExpiryInput = document.getElementById("card-expiry");
const cardCvvInput = document.getElementById("card-cvv");
const bankDetails = document.getElementById("bank-details");
const podNote = document.getElementById("pod-note");

const checkoutItems = document.getElementById("checkout-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutDeliveryFee = document.getElementById("checkout-delivery-fee");
const checkoutTotal = document.getElementById("checkout-total");

const orderReview = document.getElementById("order-review");
const reviewShipping = document.getElementById("review-shipping");
const reviewPayment = document.getElementById("review-payment");
const reviewItems = document.getElementById("review-items");
const reviewSubtotal = document.getElementById("review-subtotal");
const reviewDeliveryFee = document.getElementById("review-delivery-fee");
const reviewTotal = document.getElementById("review-total");
const editOrderBtn = document.getElementById("edit-order-btn");
const confirmOrderBtn = document.getElementById("confirm-order-btn");

const orderSuccess = document.getElementById("order-success");
const orderNumberDisplay = document.getElementById("order-number");

// Holds the order's details BETWEEN showing the review screen and the
// customer clicking "Confirm" — a plain variable is how we carry data
// across two separate clicks/functions, since each function's own
// local variables disappear once it finishes running.
let pendingOrder = null;

// ---- Step 2: Small helpers ----

const formatPrice = (price) => `$${price.toLocaleString()}`;

const getCartWithDetails = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  return cart
    .map((cartItem) => {
      const product = getAllProducts().find((p) => p.id === cartItem.id);
      return product ? { ...product, quantity: cartItem.quantity } : null;
    })
    .filter((item) => item !== null);
};

const updateCartBadgeCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
};

// ---- Step 3: If the cart is empty, there's nothing to check out ----

const redirectIfCartEmpty = () => {
  const cart = getCartWithDetails();
  if (cart.length === 0) {
    window.location.href = "shop.html";
  }
};

const redirectIfNotLoggedIn = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    // Remember where they were headed, so login.js/register.js can
    // send them straight back here after signing in.
    sessionStorage.setItem("redirectAfterAuth", "checkout.html");
    window.location.href = "login.html";
  }
};

const prefillFromAccount = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    fullNameInput.value = currentUser.name;
    checkoutEmailInput.value = currentUser.email;
  }
};

// ---- Step 4: Delivery fee, based on the typed city ----

const calculateDeliveryFee = (city) => {
  const normalizedCity = city.trim().toLowerCase();
  const nearbyAreas = ["port harcourt", "obio-akpor", "eleme"];
  return nearbyAreas.includes(normalizedCity) ? 1500 : 3000;
};

// ---- Step 5: Render the order summary (subtotal, delivery, total) ----

const renderOrderSummary = () => {
  const cartItems = getCartWithDetails();

  checkoutItems.innerHTML = cartItems
    .map(
      (item) => `
        <div class="checkout-line-item">
          <span>${item.name} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `,
    )
    .join("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = calculateDeliveryFee(cityInput.value);
  const total = subtotal + deliveryFee;

  checkoutSubtotal.textContent = formatPrice(subtotal);
  checkoutDeliveryFee.textContent = formatPrice(deliveryFee);
  checkoutTotal.textContent = formatPrice(total);
};

// ---- Step 6: Payment method switching ----

const togglePaymentFields = () => {
  cardFields.hidden = !paymentCard.checked;
  bankDetails.hidden = !paymentBank.checked;
  podNote.hidden = !paymentPod.checked;

  // Only require the card fields when Card is actually selected —
  // otherwise choosing Bank Transfer or Pay on Delivery would get
  // blocked by required fields the customer can't even see.
  const cardInputsRequired = paymentCard.checked;
  cardNameInput.required = cardInputsRequired;
  cardNumberInput.required = cardInputsRequired;
  cardExpiryInput.required = cardInputsRequired;
  cardCvvInput.required = cardInputsRequired;
};

// ---- Step 7: Input formatting as the user types ----

const formatCardNumber = () => {
  const digitsOnly = cardNumberInput.value.replace(/\D/g, "");
  const groups = digitsOnly.match(/.{1,4}/g) || [];
  cardNumberInput.value = groups.join(" ");
};

const formatExpiry = () => {
  const digitsOnly = cardExpiryInput.value.replace(/\D/g, "");
  if (digitsOnly.length >= 3) {
    cardExpiryInput.value = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
  } else {
    cardExpiryInput.value = digitsOnly;
  }
};

// ---- Step 8: Fake order number ----

const generateOrderNumber = () => {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `LUXE-${randomDigits}`;
};

// ---- Step 9: Field validation ----

const validators = {
  "full-name": (value) =>
    value.trim().length >= 2
      ? { valid: true }
      : { valid: false, message: "Please enter your full name." },

  "checkout-email": (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value)
      ? { valid: true }
      : { valid: false, message: "Please enter a valid email address." };
  },

  phone: (value) =>
    value.replace(/\D/g, "").length >= 7
      ? { valid: true }
      : { valid: false, message: "Please enter a valid phone number." },

  address: (value) =>
    value.trim().length >= 5
      ? { valid: true }
      : { valid: false, message: "Please enter your delivery address." },

  city: (value) =>
    value.trim().length >= 2
      ? { valid: true }
      : { valid: false, message: "Please enter your city." },

  "card-name": (value) =>
    value.trim().length >= 2
      ? { valid: true }
      : { valid: false, message: "Please enter the name on your card." },

  "card-number": (value) =>
    value.replace(/\s/g, "").length === 16
      ? { valid: true }
      : { valid: false, message: "Card number must be 16 digits." },

  "card-expiry": (value) =>
    /^\d{2}\/\d{2}$/.test(value)
      ? { valid: true }
      : { valid: false, message: "Use MM/YY format." },

  "card-cvv": (value) =>
    /^\d{3}$/.test(value)
      ? { valid: true }
      : { valid: false, message: "CVV must be 3 digits." },
};

const validateAndDisplay = (input) => {
  const validator = validators[input.id];
  if (!validator) return true;

  const result = validator(input.value);
  const errorSpan = document.getElementById(`error-${input.id}`);

  if (result.valid) {
    input.classList.remove("input-error");
    input.classList.add("input-valid");
    errorSpan.textContent = "";
    errorSpan.classList.remove("show");
  } else {
    input.classList.remove("input-valid");
    input.classList.add("input-error");
    errorSpan.textContent = result.message;
    errorSpan.classList.add("show");
  }

  return result.valid;
};

const markFieldTouched = (input) => {
  input.dataset.touched = "true";
};

const attachLiveValidation = (input) => {
  input.addEventListener("blur", () => {
    markFieldTouched(input);
    validateAndDisplay(input);
  });

  input.addEventListener("input", () => {
    if (input.dataset.touched === "true") {
      validateAndDisplay(input);
    }
  });
};

[
  fullNameInput,
  checkoutEmailInput,
  phoneInput,
  addressInput,
  cityInput,
  cardNameInput,
  cardNumberInput,
  cardExpiryInput,
  cardCvvInput,
].forEach(attachLiveValidation);

const validateForm = () => {
  const alwaysRequired = [
    fullNameInput,
    checkoutEmailInput,
    phoneInput,
    addressInput,
    cityInput,
  ];

  const cardRequired = paymentCard.checked
    ? [cardNameInput, cardNumberInput, cardExpiryInput, cardCvvInput]
    : [];

  const fieldsToCheck = [...alwaysRequired, ...cardRequired];

  const results = fieldsToCheck.map(validateAndDisplay);
  const allValid = results.every((result) => result === true);

  if (!allValid) {
    const firstInvalid = fieldsToCheck.find(
      (field) => !validateAndDisplay(field),
    );
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return allValid;
};

// ---- Step 10: Order review screen ----

const paymentMethodLabel = (method, cardNumberValue) => {
  if (method === "card") {
    const last4 = cardNumberValue.replace(/\s/g, "").slice(-4);
    return `Card ending in ${last4}`;
  }
  if (method === "bank") return "Bank Transfer";
  return "Pay on Delivery";
};

const showOrderReview = () => {
  const cartItems = getCartWithDetails();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = calculateDeliveryFee(cityInput.value);
  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();
  const paymentMethod = document.querySelector(
    'input[name="payment-method"]:checked',
  ).value;

  pendingOrder = {
    cartItems,
    subtotal,
    deliveryFee,
    total,
    orderNumber,
    paymentMethod,
  };

  reviewShipping.textContent = `${fullNameInput.value} — ${addressInput.value}, ${cityInput.value} — ${phoneInput.value} — ${checkoutEmailInput.value}`;
  reviewPayment.textContent = paymentMethodLabel(
    paymentMethod,
    cardNumberInput.value,
  );

  reviewItems.innerHTML = cartItems
    .map(
      (item) => `
        <div class="checkout-line-item">
          <span>${item.name} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `,
    )
    .join("");

  reviewSubtotal.textContent = formatPrice(subtotal);
  reviewDeliveryFee.textContent = formatPrice(deliveryFee);
  reviewTotal.textContent = formatPrice(total);

  checkoutFormWrap.hidden = true;
  orderReview.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleEditOrder = () => {
  orderReview.hidden = true;
  checkoutFormWrap.hidden = false;
};

// ---- Step 11: Saving + confirming the order ----

const saveOrder = (orderNumber, cartItems, subtotal, deliveryFee, total) => {
  const paymentMethod = document.querySelector(
    'input[name="payment-method"]:checked',
  ).value;

  const order = {
    orderNumber,
    name: fullNameInput.value,
    email: checkoutEmailInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    city: cityInput.value,
    paymentMethod,
    items: cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal,
    deliveryFee,
    total,
    timestamp: new Date().toISOString(),
    handled: false,
  };

  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  existingOrders.push(order);
  localStorage.setItem("orders", JSON.stringify(existingOrders));
};

const handleConfirmOrder = () => {
  const { cartItems, subtotal, deliveryFee, total, orderNumber } = pendingOrder;

  saveOrder(orderNumber, cartItems, subtotal, deliveryFee, total);

  localStorage.removeItem("cart");
  updateCartBadgeCount();
  checkoutForm.reset();

  orderNumberDisplay.textContent = orderNumber;
  orderReview.hidden = true;
  orderSuccess.hidden = false;
};

const handleReviewSubmit = (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  showOrderReview();
};

// ---- Step 12: Wire everything up ----
paymentCard.addEventListener("change", togglePaymentFields);
paymentBank.addEventListener("change", togglePaymentFields);
paymentPod.addEventListener("change", togglePaymentFields);
cardNumberInput.addEventListener("input", formatCardNumber);
cardExpiryInput.addEventListener("input", formatExpiry);
cityInput.addEventListener("blur", renderOrderSummary);
checkoutForm.addEventListener("submit", handleReviewSubmit);
editOrderBtn.addEventListener("click", handleEditOrder);
confirmOrderBtn.addEventListener("click", handleConfirmOrder);

redirectIfCartEmpty();
redirectIfNotLoggedIn();
prefillFromAccount();
renderOrderSummary();
updateCartBadgeCount();
togglePaymentFields();
