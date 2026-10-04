// product.js
// Handles the Product Detail page: reads ?id= from the URL, displays
// that product's full details, handles quantity + add to cart, and
// shows related products from the same category.

import { getAllProducts } from "./product-store.js";

// ---- Step 1: Grab elements, in the same order they appear in the HTML ----
const breadcrumbProductName = document.getElementById(
  "breadcrumb-product-name",
);
const productImage = document.getElementById("product-image");
const productCategory = document.getElementById("product-category");
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productStock = document.getElementById("product-stock");
const productDescription = document.getElementById("product-description");
const decreaseQtyBtn = document.getElementById("decrease-qty-btn");
const quantityInput = document.getElementById("quantity-input");
const increaseQtyBtn = document.getElementById("increase-qty-btn");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const relatedProductsContainer = document.getElementById("related-products");
const cartCount = document.getElementById("cart-count");

// ---- Step 2: Helpers ----

const formatPrice = (price) => `$${price.toLocaleString()}`;

// Reads the numeric id from a URL like product.html?id=4
const getProductIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
};

// find() returns the FIRST item that matches, or undefined if none do —
// exactly what we want, since ids are unique (only one product can match).
const findProductById = (id) =>
  getAllProducts().find((product) => product.id === id);

// ---- Step 3: Render the main product detail ----

const renderProductDetail = (product) => {
  breadcrumbProductName.textContent = product.name;

  productImage.src = product.image;
  productImage.alt = product.name;

  productCategory.textContent = product.category;
  productName.textContent = product.name;
  productPrice.textContent = formatPrice(product.price);
  productDescription.textContent = product.description;

  // Ternary: stock badge text/class, and whether Add to Cart is clickable,
  // all depend on the same inStock value.
  productStock.textContent = product.inStock ? "In Stock" : "Out of Stock";
  productStock.className = product.inStock
    ? "stock-badge in-stock"
    : "stock-badge out-of-stock";

  addToCartBtn.disabled = !product.inStock;
};

// ---- Step 4: Quantity stepper ----

const updateQuantity = (change) => {
  const currentValue = parseInt(quantityInput.value, 10);
  const newValue = currentValue + change;

  // Never let quantity drop below 1.
  quantityInput.value = newValue < 1 ? 1 : newValue;
};

// ---- Step 5: Cart badge (duplicated here from script.js on purpose —
// product.js is a module and can't reach into script.js's variables
// directly, so each page's script keeps its own small copy of this) ----

const updateCartBadgeCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
};

// ---- Step 6: Add to cart ----

const addToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const quantityToAdd = parseInt(quantityInput.value, 10);

  // Check if this product is already in the cart.
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    cart.push({ id: product.id, quantity: quantityToAdd });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadgeCount();

  addToCartBtn.textContent = "Added!";
  setTimeout(() => {
    addToCartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to Cart`;
  }, 1200);
};

// ---- Step 7: Related products ----

const createRelatedCardHTML = (product) => `
  <div class="product-card">
    <a href="product.html?id=${product.id}">
      <img src="${product.image}" alt="${product.name}" />
    </a>
    <div class="product-card-body">
      <h3>${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
    </div>
  </div>
`;

const renderRelatedProducts = (currentProduct) => {
  const related = getAllProducts()
    .filter(
      (product) =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id,
    )
    .slice(0, 4);

  relatedProductsContainer.innerHTML = related
    .map(createRelatedCardHTML)
    .join("");
};

// ---- Step 8: Initialize the page ----

const init = () => {
  const productId = getProductIdFromURL();
  const product = findProductById(productId);

  // If someone visits with a missing/invalid id, send them back to Shop
  // instead of showing a broken empty page.
  if (!product) {
    window.location.href = "shop.html";
    return;
  }

  renderProductDetail(product);
  renderRelatedProducts(product);
  updateCartBadgeCount();

  decreaseQtyBtn.addEventListener("click", () => updateQuantity(-1));
  increaseQtyBtn.addEventListener("click", () => updateQuantity(1));
  addToCartBtn.addEventListener("click", () => addToCart(product));
};

init();
