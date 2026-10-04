// script.js
// Runs on every page. Handles dark mode, the hamburger menu, the
// account link (desktop + mobile versions kept in sync), and keeping
// the cart badge count accurate no matter which page loads.

// ---- Step 1: Grab elements, in the same order they appear in the HTML ----
const navLinks = document.getElementById('nav-links');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeIcon = document.getElementById('dark-mode-icon');
const cartCount = document.getElementById('cart-count');
const hamburgerBtn = document.getElementById('hamburger-btn');
const hamburgerIcon = document.getElementById('hamburger-icon');

const accountLink = document.getElementById('account-link');
const accountLabel = document.getElementById('account-label');
const logoutBtn = document.getElementById('logout-btn');
const accountLinkMobile = document.getElementById('account-link-mobile');
const accountLabelMobile = document.getElementById('account-label-mobile');
const logoutBtnMobile = document.getElementById('logout-btn-mobile');

// ---- Step 2: Dark mode ----

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  darkModeIcon.className =
    theme === 'dark' ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
};

const initDarkMode = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
};

const toggleDarkMode = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};

// ---- Step 3: Hamburger menu ----

const toggleHamburgerMenu = (event) => {
  event.stopPropagation();
  navLinks.classList.toggle('open');

  const isOpen = navLinks.classList.contains('open');
  hamburgerIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
};

const closeMenuOnOutsideClick = (event) => {
  const clickedOutsideNav = !navLinks.contains(event.target);
  const clickedOutsideButton = !hamburgerBtn.contains(event.target);

  if (clickedOutsideNav && clickedOutsideButton) {
    navLinks.classList.remove('open');
    hamburgerIcon.className = 'fa-solid fa-bars';
  }
};

// ---- Step 4: Cart badge ----

const updateCartBadge = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
};

// ---- Step 5: Account link (desktop + mobile versions, kept in sync) ----

const updateAccountNav = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const firstName = currentUser ? currentUser.name.split(' ')[0] : 'Login';
  const targetPage = currentUser ? 'my-orders.html' : 'login.html';

  accountLink.href = targetPage;
  accountLabel.textContent = firstName;
  logoutBtn.hidden = !currentUser;

  accountLinkMobile.href = targetPage;
  accountLabelMobile.textContent = firstName;
  logoutBtnMobile.hidden = !currentUser;
};

const handleLogout = () => {
  localStorage.removeItem('currentUser');
  updateAccountNav();
  window.location.href = 'index.html';
};

// ---- Step 6: Wire everything up ----
darkModeToggle.addEventListener('click', toggleDarkMode);
hamburgerBtn.addEventListener('click', toggleHamburgerMenu);
document.addEventListener('click', closeMenuOnOutsideClick);
logoutBtn.addEventListener('click', handleLogout);
logoutBtnMobile.addEventListener('click', handleLogout);

initDarkMode();
updateCartBadge();
updateAccountNav();
