// shop.js
// Handles the Shop page: search, category filter, price filter, sort,
// and rendering the product grid. Reads from products.js, never writes to it.

import { getAllProducts } from "./product-store.js";

// ---- Step 1: Grab elements, in the same order they appear in the HTML ----
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const sortSelect = document.getElementById("sort-select");
const productGrid = document.getElementById("product-grid");
const noResults = document.getElementById("no-results");

// ---- Step 2: Small helpers ----

// Turns 45000 into "₦45,000" — toLocaleString adds the comma grouping,
// we just prepend the currency symbol ourselves.
const formatPrice = (price) => `$${price.toLocaleString()}`;

// ---- Step 3: The three filter checks ----

const matchesSearch = (product, query) =>
  product.name.toLowerCase().includes(query.toLowerCase());

const matchesCategory = (product, category) =>
  category === "all" || product.category === category;

// Price tiers were fixed when we built the dropdown, so we check the
// product's price against each range by name.
const matchesPriceRange = (product, range) => {
  if (range === "all") return true;
  if (range === "under-10000") return product.price < 10000;
  if (range === "10000-40000")
    return product.price >= 10000 && product.price <= 40000;
  if (range === "40000-80000")
    return product.price > 40000 && product.price <= 80000;
  if (range === "above-80000") return product.price > 80000;
  return true;
};

// ---- Step 4: Combine all filters into one final list ----

const getFilteredProducts = () => {
  const query = searchInput.value;
  const category = categoryFilter.value;
  const priceRange = priceFilter.value;

  return getAllProducts().filter(
    (product) =>
      matchesSearch(product, query) &&
      matchesCategory(product, category) &&
      matchesPriceRange(product, priceRange),
  );
};

// ---- Step 5: Sorting ----

const sortProducts = (list, sortValue) => {
  // Copy the array first — .sort() mutates in place, and we never want
  // to accidentally reorder the original imported `products` array.
  const sorted = [...list];

  if (sortValue === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortValue === "name-asc") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
};

// ---- Step 6: Build one product card as an HTML string ----

const createProductCardHTML = (product) => {
  const stockBadge = !product.inStock
    ? `<span class="out-of-stock-badge">Out of Stock</span>`
    : "";

  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" />
      </a>
      <div class="product-card-body">
        ${stockBadge}
        <h3>${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <a href="product.html?id=${product.id}" class="btn btn-primary">
          View Details
        </a>
      </div>
    </div>
  `;
};

// ---- Step 7: Render the grid ----

const renderProducts = (list) => {
  // map() turns each product into an HTML string, join("") glues them
  // all into one block we can inject in a single step.
  productGrid.innerHTML = list.map(createProductCardHTML).join("");

  // Toggle the "no results" message based on whether anything matched.
  noResults.hidden = list.length > 0;
};

// ---- Step 8: The master function — filter, sort, render ----

const updateDisplay = () => {
  const filtered = getFilteredProducts();
  const sorted = sortProducts(filtered, sortSelect.value);
  renderProducts(sorted);
};

// ---- Step 9: Pre-select category if the user arrived from a Home link ----
// e.g. shop.html?category=wigs

const applyCategoryFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");

  if (categoryParam) {
    categoryFilter.value = categoryParam;
  }
};

// ---- Step 10: Wire everything up ----
searchInput.addEventListener("input", updateDisplay);
categoryFilter.addEventListener("change", updateDisplay);
priceFilter.addEventListener("change", updateDisplay);
sortSelect.addEventListener("change", updateDisplay);

applyCategoryFromURL();
updateDisplay();
