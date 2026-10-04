// admin.js
// Handles the Admin page: password gate, reading orders/messages/
// products from localStorage, tab switching, marking/deleting/emailing
// entries, and adding new products with an uploaded image.

import { getAllProducts } from "./product-store.js";

// ---- Step 1: Grab elements, in the same order they appear in the HTML ----
const loginGate = document.getElementById("login-gate");
const loginForm = document.getElementById("login-form");
const passwordInput = document.getElementById("password-input");
const loginError = document.getElementById("login-error");
const adminDashboard = document.getElementById("admin-dashboard");
const logoutBtn = document.getElementById("logout-btn");
const statOrders = document.getElementById("stat-orders");
const statMessages = document.getElementById("stat-messages");
const statRevenue = document.getElementById("stat-revenue");
const statProducts = document.getElementById("stat-products");
const tabOrdersBtn = document.getElementById("tab-orders-btn");
const tabMessagesBtn = document.getElementById("tab-messages-btn");
const tabProductsBtn = document.getElementById("tab-products-btn");
const ordersTab = document.getElementById("orders-tab");
const ordersEmpty = document.getElementById("orders-empty");
const ordersList = document.getElementById("orders-list");
const messagesTab = document.getElementById("messages-tab");
const messagesEmpty = document.getElementById("messages-empty");
const messagesList = document.getElementById("messages-list");
const productsTab = document.getElementById("products-tab");
const addProductForm = document.getElementById("add-product-form");
const productNameInput = document.getElementById("product-name");
const productCategoryInput = document.getElementById("product-category");
const productPriceInput = document.getElementById("product-price");
const productDescriptionInput = document.getElementById("product-description");
const productInStockInput = document.getElementById("product-instock");
const productsEmpty = document.getElementById("products-empty");
const productsList = document.getElementById("products-list");

// Image upload elements
const imageUploadBox = document.getElementById("image-upload-box");
const productImageInputFile = document.getElementById("product-image-input");
const selectImageBtn = document.getElementById("select-image-btn");
const changeImageBtn = document.getElementById("change-image-btn");
const uploadPlaceholder = document.getElementById("image-upload-placeholder");
const imagePreviewWrap = document.getElementById("image-preview-wrap");
const imagePreview = document.getElementById("image-preview");
const errorImageSpan = document.getElementById("error-product-image");

// Demo-only password — anyone who views this file can see it. This is
// NOT real security, just enough to keep the page from being obviously
// open to casual visitors, as agreed.
const ADMIN_PASSWORD = "luxe2026";

// Holds the currently selected image as a Data URL string — this is
// what actually gets saved as the product's "image" field on submit.
let selectedImageDataURL = null;

// ---- Step 2: Helpers ----

const formatPrice = (price) => `$${price.toLocaleString()}`;

const formatDate = (isoString) =>
  new Date(isoString).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getOrders = () => JSON.parse(localStorage.getItem("orders")) || [];
const getMessages = () => JSON.parse(localStorage.getItem("messages")) || [];

// ---- Step 3: Login ----

const handleLogin = (event) => {
  event.preventDefault();

  if (passwordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem("adminLoggedIn", "true");
    loginGate.hidden = true;
    adminDashboard.hidden = false;
    window.scrollTo(0, 0);
    renderDashboard();
  } else {
    loginError.hidden = false;
    passwordInput.value = "";
  }
};

const checkExistingSession = () => {
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    loginGate.hidden = true;
    adminDashboard.hidden = false;
    window.scrollTo(0, 0);
    renderDashboard();
  }
};

const handleLogout = () => {
  sessionStorage.removeItem("adminLoggedIn");
  adminDashboard.hidden = true;
  loginGate.hidden = false;
  passwordInput.value = "";
};

// ---- Step 4: Tabs ----

const switchTab = (tabName) => {
  const tabs = [
    { btn: tabOrdersBtn, panel: ordersTab, name: "orders" },
    { btn: tabMessagesBtn, panel: messagesTab, name: "messages" },
    { btn: tabProductsBtn, panel: productsTab, name: "products" },
  ];

  tabs.forEach(({ btn, panel, name }) => {
    const isActive = name === tabName;
    panel.hidden = !isActive;
    btn.classList.toggle("active", isActive);
  });
};

// ---- Step 5: Stats ----

const renderStats = () => {
  const orders = getOrders();
  const messages = getMessages();
  const revenue = orders.reduce((total, order) => total + order.total, 0);

  statOrders.textContent = orders.length;
  statMessages.textContent = messages.length;
  statRevenue.textContent = formatPrice(revenue);
  statProducts.textContent = getAllProducts().length;
};

// ---- Step 6: Order cards ----

const createOrderCardHTML = (order, index) => {
  const itemRows = order.items
    .map(
      (item) => `
        <div class="entry-item-row">
          <span>${item.name} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `,
    )
    .join("");

  return `
    <div class="entry-card ${order.handled ? "handled" : ""}">
      <div class="entry-top">
        <div>
          <p class="entry-name">${order.name}</p>
          <p class="entry-meta">${order.orderNumber} • ${formatDate(order.timestamp)}</p>
        </div>
        <span class="entry-badge ${order.handled ? "handled-badge" : ""}">
          ${order.handled ? "Handled" : "New"}
        </span>
      </div>

      <div class="entry-details">
        <strong>Email:</strong> ${order.email}<br />
        <strong>Phone:</strong> ${order.phone}<br />
        <strong>Address:</strong> ${order.address}, ${order.city}<br />
        <strong>Payment:</strong> ${order.paymentMethod}
      </div>

      <div class="entry-items">
        ${itemRows}
        <div class="entry-item-row entry-total">
          <span>Total</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </div>

      <div class="entry-actions">
        <button class="reply-btn" data-action="reply-order" data-index="${index}" type="button">
          <i class="fa-solid fa-envelope"></i> Reply via Email
        </button>
        <button class="handle-btn" data-action="handle-order" data-index="${index}" type="button">
          <i class="fa-solid fa-check"></i> ${order.handled ? "Mark New" : "Mark Handled"}
        </button>
        <button class="delete-btn" data-action="delete-order" data-index="${index}" type="button">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `;
};

const renderOrders = () => {
  const orders = getOrders();
  ordersEmpty.hidden = orders.length > 0;
  ordersList.innerHTML = orders.map(createOrderCardHTML).join("");
};

// ---- Step 7: Message cards ----

const createMessageCardHTML = (message, index) => `
  <div class="entry-card ${message.handled ? "handled" : ""}">
    <div class="entry-top">
      <div>
        <p class="entry-name">${message.name}</p>
        <p class="entry-meta">${message.email} • ${formatDate(message.timestamp)}</p>
      </div>
      <span class="entry-badge ${message.handled ? "handled-badge" : ""}">
        ${message.handled ? "Handled" : "New"}
      </span>
    </div>

    <p class="entry-message-text">"${message.message}"</p>

    <div class="entry-actions">
      <button class="reply-btn" data-action="reply-message" data-index="${index}" type="button">
        <i class="fa-solid fa-envelope"></i> Reply via Email
      </button>
      <button class="handle-btn" data-action="handle-message" data-index="${index}" type="button">
        <i class="fa-solid fa-check"></i> ${message.handled ? "Mark New" : "Mark Handled"}
      </button>
      <button class="delete-btn" data-action="delete-message" data-index="${index}" type="button">
        <i class="fa-solid fa-trash"></i> Delete
      </button>
    </div>
  </div>
`;

const renderMessages = () => {
  const messages = getMessages();
  messagesEmpty.hidden = messages.length > 0;
  messagesList.innerHTML = messages.map(createMessageCardHTML).join("");
};

// ---- Step 8: Image upload (click or drag-and-drop) ----

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

const showImagePreview = (dataURL) => {
  imagePreview.src = dataURL;
  uploadPlaceholder.hidden = true;
  imagePreviewWrap.hidden = false;
};

const resetImageUpload = () => {
  selectedImageDataURL = null;
  productImageInputFile.value = "";
  uploadPlaceholder.hidden = false;
  imagePreviewWrap.hidden = true;
};

// FileReader is the browser's built-in tool for reading a file's raw
// contents. readAsDataURL() converts an image into a long text string
// we can store in localStorage and use directly as an <img> src — no
// server needed.
const readImageFile = (file) => {
  const reader = new FileReader();

  reader.onload = () => {
    selectedImageDataURL = reader.result;
    showImagePreview(selectedImageDataURL);
  };

  reader.readAsDataURL(file);
};

const handleImageSelect = (file) => {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    errorImageSpan.textContent =
      "Please select an image file (PNG, JPG, or GIF).";
    errorImageSpan.classList.add("show");
    return;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    errorImageSpan.textContent = "Image must be under 4MB.";
    errorImageSpan.classList.add("show");
    return;
  }

  errorImageSpan.textContent = "";
  errorImageSpan.classList.remove("show");
  readImageFile(file);
};

// ---- Step 9: Custom products (admin-added, stored separately from products.js) ----

const getCustomProducts = () =>
  JSON.parse(localStorage.getItem("customProducts")) || [];

const saveCustomProducts = (products) => {
  localStorage.setItem("customProducts", JSON.stringify(products));
};

const createProductCardHTML = (product, index) => `
  <div class="entry-card">
    <div class="entry-product-top">
      <img src="${product.image}" alt="${product.name}" class="entry-product-image" />
      <div>
        <p class="entry-name">${product.name}</p>
        <p class="entry-meta">${product.category} • ${formatPrice(product.price)}</p>
      </div>
    </div>

    <div class="entry-actions">
      <button class="delete-btn" data-action="delete-product" data-index="${index}" type="button">
        <i class="fa-solid fa-trash"></i> Delete
      </button>
    </div>
  </div>
`;

const renderProducts = () => {
  const customProducts = getCustomProducts();
  productsEmpty.hidden = customProducts.length > 0;
  productsList.innerHTML = customProducts.map(createProductCardHTML).join("");
};

const deleteProduct = (index) => {
  const customProducts = getCustomProducts();
  customProducts.splice(index, 1);
  saveCustomProducts(customProducts);
  renderDashboard();
};

const handleAddProduct = (event) => {
  event.preventDefault();

  if (!selectedImageDataURL) {
    errorImageSpan.textContent = "Please select a product image.";
    errorImageSpan.classList.add("show");
    return;
  }

  const newProduct = {
    // Date.now() guarantees a unique id that can never collide with
    // your original 12 hardcoded products (ids 1–12).
    id: Date.now(),
    name: productNameInput.value,
    category: productCategoryInput.value,
    price: Number(productPriceInput.value),
    image: selectedImageDataURL,
    description: productDescriptionInput.value,
    inStock: productInStockInput.checked,
  };

  const customProducts = getCustomProducts();
  customProducts.push(newProduct);
  saveCustomProducts(customProducts);

  addProductForm.reset();
  productInStockInput.checked = true;
  resetImageUpload();
  renderDashboard();
};

// ---- Step 10: Actions (mark handled, delete, reply) ----

const toggleOrderHandled = (index) => {
  const orders = getOrders();
  orders[index].handled = !orders[index].handled;
  localStorage.setItem("orders", JSON.stringify(orders));
  renderDashboard();
};

const deleteOrder = (index) => {
  const orders = getOrders();
  orders.splice(index, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderDashboard();
};

const toggleMessageHandled = (index) => {
  const messages = getMessages();
  messages[index].handled = !messages[index].handled;
  localStorage.setItem("messages", JSON.stringify(messages));
  renderDashboard();
};

const deleteMessage = (index) => {
  const messages = getMessages();
  messages.splice(index, 1);
  localStorage.setItem("messages", JSON.stringify(messages));
  renderDashboard();
};

const replyByEmail = (email, subject, body) => {
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const tempLink = document.createElement("a");
  tempLink.href = mailtoLink;
  tempLink.click();
};

// ---- Step 11: ONE delegated listener per list ----

const handleOrdersClick = (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const orders = getOrders();
  const order = orders[index];

  if (button.dataset.action === "handle-order") toggleOrderHandled(index);
  if (button.dataset.action === "delete-order") deleteOrder(index);
  if (button.dataset.action === "reply-order") {
    replyByEmail(
      order.email,
      `Regarding your LUXE order ${order.orderNumber}`,
      `Hi ${order.name},\n\nThank you for your order (${order.orderNumber}).\n\n`,
    );
  }
};

const handleMessagesClick = (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const messages = getMessages();
  const message = messages[index];

  if (button.dataset.action === "handle-message") toggleMessageHandled(index);
  if (button.dataset.action === "delete-message") deleteMessage(index);
  if (button.dataset.action === "reply-message") {
    replyByEmail(
      message.email,
      "Re: Your message to LUXE",
      `Hi ${message.name},\n\nThanks for reaching out to LUXE.\n\n`,
    );
  }
};

const handleProductsClick = (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);

  if (button.dataset.action === "delete-product") deleteProduct(index);
};

// ---- Step 12: Render everything together ----

const renderDashboard = () => {
  renderStats();
  renderOrders();
  renderMessages();
  renderProducts();
};

// ---- Step 13: Wire everything up ----
loginForm.addEventListener("submit", handleLogin);
logoutBtn.addEventListener("click", handleLogout);
tabOrdersBtn.addEventListener("click", () => switchTab("orders"));
tabMessagesBtn.addEventListener("click", () => switchTab("messages"));
tabProductsBtn.addEventListener("click", () => switchTab("products"));
ordersList.addEventListener("click", handleOrdersClick);
messagesList.addEventListener("click", handleMessagesClick);
addProductForm.addEventListener("submit", handleAddProduct);
productsList.addEventListener("click", handleProductsClick);

selectImageBtn.addEventListener("click", () => productImageInputFile.click());
changeImageBtn.addEventListener("click", () => productImageInputFile.click());

productImageInputFile.addEventListener("change", () => {
  handleImageSelect(productImageInputFile.files[0]);
});

imageUploadBox.addEventListener("dragover", (event) => {
  event.preventDefault();
  imageUploadBox.classList.add("drag-over");
});

imageUploadBox.addEventListener("dragleave", () => {
  imageUploadBox.classList.remove("drag-over");
});

imageUploadBox.addEventListener("drop", (event) => {
  event.preventDefault();
  imageUploadBox.classList.remove("drag-over");
  handleImageSelect(event.dataTransfer.files[0]);
});

checkExistingSession();
