// my-orders.js
// Shows a logged-in customer's own order history — redirects to
// login.html if nobody's logged in, since this page has nothing to
// show otherwise.

const ordersGreeting = document.getElementById("orders-greeting");
const ordersEmpty = document.getElementById("orders-empty");
const ordersList = document.getElementById("orders-list");

const formatPrice = (price) => `$${price.toLocaleString()}`;

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const createOrderCardHTML = (order) => {
  const statusClass = order.handled ? "completed" : "processing";
  const statusLabel = order.handled ? "Completed" : "Processing";

  const itemRows = order.items
    .map(
      (item) => `
        <div class="order-item-row">
          <span>${item.name} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `,
    )
    .join("");

  return `
    <div class="order-card">
      <div class="order-card-top">
        <div>
          <p class="order-number">${order.orderNumber}</p>
          <p class="order-date">${formatDate(order.timestamp)}</p>
        </div>
        <span class="order-status ${statusClass}">${statusLabel}</span>
      </div>

      <div class="order-card-items">
        ${itemRows}
      </div>

      <div class="order-card-footer">
        <span>${order.paymentMethod}</span>
        <strong>${formatPrice(order.total)}</strong>
      </div>
    </div>
  `;
};

const init = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  ordersGreeting.textContent = `Hi ${currentUser.name.split(" ")[0]}, here's your order history.`;

  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

  // Only show orders placed with THIS customer's email — every other
  // customer's orders stay invisible to them.
  const myOrders = allOrders.filter(
    (order) => order.email.toLowerCase() === currentUser.email.toLowerCase(),
  );

  ordersEmpty.hidden = myOrders.length > 0;
  ordersList.innerHTML = myOrders.map(createOrderCardHTML).join("");
};

init();
