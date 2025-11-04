// ======================= ADD TO CART =======================
function addToCart(name, price, image) {
  // Ensure numeric price
  price = parseFloat(price);
  if (isNaN(price)) {
    console.error("Invalid price for:", name);
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${name} added to cart! 🛒`);
}

// ======================= UPDATE CART COUNT =======================
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}

// ======================= DISPLAY CART =======================
function displayCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tableBody = document.querySelector("#cart-table tbody");
  const totalPrice = document.getElementById("total-price");

  if (!tableBody || !totalPrice) return;

  tableBody.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Your cart is empty 🛍️</td></tr>`;
    totalPrice.textContent = "Total: Ksh 0";
    updateCartCount();
    return;
  }

  cart.forEach((item, index) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    const subtotal = price * qty;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td><img src="${item.image}" alt="${item.name}" width="60" style="border-radius:8px;"></td>
      <td>Ksh ${price.toLocaleString()}</td>
      <td>
        <input type="number" min="1" value="${qty}" 
          onchange="updateQuantity(${index}, this.value)" 
          style="width:60px;text-align:center;border:none;border-radius:5px;padding:5px;">
      </td>
      <td class="subtotal">Ksh ${subtotal.toLocaleString()}</td>
      <td>
        <button onclick="removeFromCart(${index})"
          style="background:#ff3b3b;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">
          Remove
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalPrice.textContent = `Total: Ksh ${total.toLocaleString()}`;
  updateCartCount();
}

// ======================= UPDATE QUANTITY =======================
function updateQuantity(index, newQty) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  newQty = parseInt(newQty);

  if (isNaN(newQty) || newQty <= 0) newQty = 1;
  if (!cart[index]) return;

  cart[index].quantity = newQty;
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

// ======================= REMOVE ITEM =======================
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

// ======================= CLEAR CART =======================
function clearCart() {
  localStorage.removeItem('cart');
  displayCart();
  updateCartCount();
}

// ======================= DISPLAY PRODUCTS =======================
function displayProducts() {
  const productContainer = document.querySelector(".product-grid");
  if (!productContainer || typeof products === "undefined") return;

  productContainer.innerHTML = "";

  products.forEach(product => {
    const price = parseFloat(product.price) || 0;
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Ksh ${price.toLocaleString()}</p>
      <button onclick="addToCart('${product.name}', ${price}, '${product.image}')">Add to Cart</button>
    `;

    productContainer.appendChild(card);
  });
}

// ======================= LOAD CHECKOUT PAGE =======================
function loadCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.querySelector('#checkout-table tbody');
  const totalElement = document.getElementById('checkout-total');

  if (!tbody || !totalElement) return;

  tbody.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    const subtotal = price * qty;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>Ksh ${price.toLocaleString()}</td>
      <td>${qty}</td>
      <td>Ksh ${subtotal.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });

  totalElement.textContent = `Total: Ksh ${total.toLocaleString()}`;
}

// ======================= INITIALIZE PAGES =======================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#cart-table")) displayCart();
  if (document.querySelector(".product-grid")) displayProducts();
  if (document.querySelector("#checkout-table")) loadCheckout();
  updateCartCount();
});
