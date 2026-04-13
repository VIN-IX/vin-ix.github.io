// Keeping products in an array makes it easy to reuse the same data in Admin and Checkout.
const products = [
    { id: 1, name: "Apple", price: 1.5 },
    { id: 2, name: "Orange Juice", price: 3.25 },
    { id: 3, name: "Bread", price: 2.75 }
];

const cart = [];
let productIdCounter = products.length + 1;

const newProductName = document.getElementById("newProductName");
const addProductButton = document.getElementById("addProductButton");
const adminAddStatus = document.getElementById("adminAddStatus");

const priceProductSelect = document.getElementById("priceProductSelect");
const priceInput = document.getElementById("priceInput");
const setPriceButton = document.getElementById("setPriceButton");
const adminPriceStatus = document.getElementById("adminPriceStatus");
const productList = document.getElementById("productList");

const newTransactionButton = document.getElementById("newTransactionButton");
const payButton = document.getElementById("payButton");
const checkoutStatus = document.getElementById("checkoutStatus");
const checkoutProductSelect = document.getElementById("checkoutProductSelect");
const selectedProductInfo = document.getElementById("selectedProductInfo");
const unitInput = document.getElementById("unitInput");
const clearUnitButton = document.getElementById("clearUnitButton");
const addToCartButton = document.getElementById("addToCartButton");
const cartList = document.getElementById("cartList");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTax = document.getElementById("checkoutTax");
const checkoutTotal = document.getElementById("checkoutTotal");
const receiptArea = document.getElementById("receiptArea");

function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

function showStatus(element, message, type) {
    element.textContent = message;
    element.className = "status";

    if (type) {
        element.classList.add(type);
    }
}

function populateProductDropdowns() {
    priceProductSelect.innerHTML = "";
    checkoutProductSelect.innerHTML = "";

    products.forEach(function (product) {
        const optionForPrice = document.createElement("option");
        optionForPrice.value = product.id;
        optionForPrice.textContent = product.name;
        priceProductSelect.appendChild(optionForPrice);

        const optionForCheckout = document.createElement("option");
        optionForCheckout.value = product.id;
        optionForCheckout.textContent = product.name + " - " + formatMoney(product.price) + " per unit";
        checkoutProductSelect.appendChild(optionForCheckout);
    });

    updateSelectedProductInfo();
}

function renderProductList() {
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = '<div class="mini-item muted">No products available yet.</div>';
        return;
    }

    products.forEach(function (product) {
        const item = document.createElement("div");
        item.className = "mini-item";
        item.innerHTML = `
      <strong>${product.name}</strong>
      <div class="muted">Price per unit: ${formatMoney(product.price)}</div>
    `;
        productList.appendChild(item);
    });
}

function getSelectedCheckoutProduct() {
    const selectedId = Number(checkoutProductSelect.value);
    return products.find(function (product) {
        return product.id === selectedId;
    });
}

function updateSelectedProductInfo() {
    const selectedProduct = getSelectedCheckoutProduct();

    if (!selectedProduct) {
        selectedProductInfo.textContent = "No product selected.";
        return;
    }

    selectedProductInfo.innerHTML = `
    <strong>${selectedProduct.name}</strong><br>
    Price per unit: ${formatMoney(selectedProduct.price)}
  `;
}

function calculateCartTotals() {
    let subtotal = 0;

    cart.forEach(function (item) {
        subtotal += item.lineTotal;
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return {
        subtotal: subtotal,
        tax: tax,
        total: total
    };
}

function renderCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = '<div class="mini-item muted">Cart is empty.</div>';
    } else {
        cart.forEach(function (item, index) {
            const cartItem = document.createElement("div");
            cartItem.className = "mini-item";
            cartItem.innerHTML = `
        <strong>${index + 1}. ${item.name}</strong>
        <div class="muted">${formatMoney(item.price)} × ${item.units} = ${formatMoney(item.lineTotal)}</div>
      `;
            cartList.appendChild(cartItem);
        });
    }

    const totals = calculateCartTotals();
    checkoutSubtotal.textContent = formatMoney(totals.subtotal);
    checkoutTax.textContent = formatMoney(totals.tax);
    checkoutTotal.textContent = formatMoney(totals.total);
}

function clearReceipt() {
    receiptArea.innerHTML = `
    <div class="empty-receipt">
      <div class="empty-receipt-message">
        No receipt yet.<br /><br />
        Ring up some items, click <strong>Pay</strong>, and the receipt will show here.
      </div>
    </div>
  `;
}
function renderReceipt() {
    const totals = calculateCartTotals();
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    let rows = "";

    cart.forEach(function (item) {
        rows += `
      <tr>
        <td>${item.name}</td>
        <td>${formatMoney(item.price)}</td>
        <td>${item.units}</td>
        <td>${formatMoney(item.lineTotal)}</td>
      </tr>
    `;
    });

    receiptArea.innerHTML = `
    <div class="receipt-title">Receipt</div>
    <div class="receipt-meta">
      Date: ${formattedDate}<br>
      Time: ${formattedTime}
    </div>

    <div class="receipt-divider"></div>

    <table class="receipt-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Units</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="receipt-divider"></div>

    <div class="receipt-total-line">
      <span>Subtotal:</span>
      <span>${formatMoney(totals.subtotal)}</span>
    </div>
    <div class="receipt-total-line">
      <span>Tax (5%):</span>
      <span>${formatMoney(totals.tax)}</span>
    </div>
    <div class="receipt-total-line grand">
      <span>Grand Total:</span>
      <span>${formatMoney(totals.total)}</span>
    </div>
  `;
}

function resetTransaction() {
    cart.length = 0;
    unitInput.value = "";
    renderCart();
    clearReceipt();
    showStatus(checkoutStatus, "Started a new transaction. Cart cleared, products kept.", "success");
}

addProductButton.addEventListener("click", function () {
    const name = newProductName.value.trim();

    if (name === "") {
        showStatus(adminAddStatus, "Enter a product name first.", "error");
        return;
    }

    const alreadyExists = products.some(function (product) {
        return product.name.toLowerCase() === name.toLowerCase();
    });

    if (alreadyExists) {
        showStatus(adminAddStatus, "That product already exists.", "error");
        return;
    }

    products.push({
        id: productIdCounter,
        name: name,
        price: 0
    });

    productIdCounter++;
    newProductName.value = "";
    populateProductDropdowns();
    renderProductList();
    showStatus(adminAddStatus, "Product added successfully.", "success");
});

setPriceButton.addEventListener("click", function () {
    const selectedId = Number(priceProductSelect.value);
    const newPrice = Number(priceInput.value);
    const product = products.find(function (item) {
        return item.id === selectedId;
    });

    if (!product) {
        showStatus(adminPriceStatus, "Select a product first.", "error");
        return;
    }

    if (priceInput.value === "" || isNaN(newPrice) || newPrice < 0) {
        showStatus(adminPriceStatus, "Enter a valid price.", "error");
        return;
    }

    product.price = newPrice;
    priceInput.value = "";
    populateProductDropdowns();
    renderProductList();
    showStatus(adminPriceStatus, product.name + " price updated.", "success");
});

checkoutProductSelect.addEventListener("change", updateSelectedProductInfo);

document.querySelectorAll(".unit-button").forEach(function (button) {
    button.addEventListener("click", function () {
        unitInput.value = button.dataset.unit;
    });
});

clearUnitButton.addEventListener("click", function () {
    unitInput.value = "";
});

addToCartButton.addEventListener("click", function () {
    const product = getSelectedCheckoutProduct();
    const units = Number(unitInput.value);

    if (!product) {
        showStatus(checkoutStatus, "Select a product before adding to cart.", "error");
        return;
    }

    if (product.price < 0 || isNaN(product.price)) {
        showStatus(checkoutStatus, "This product has an invalid price.", "error");
        return;
    }

    if (product.price === 0) {
        showStatus(checkoutStatus, "Set a price for this product before adding it.", "error");
        return;
    }

    if (units < 1 || units > 9 || isNaN(units)) {
        showStatus(checkoutStatus, "Choose a unit amount from 1 to 9.", "error");
        return;
    }

    // Each cart entry stores a snapshot of the current product info.
    // That way, even if the admin changes prices later, this transaction stays consistent.
    cart.push({
        name: product.name,
        price: product.price,
        units: units,
        lineTotal: product.price * units
    });

    renderCart();
    showStatus(checkoutStatus, product.name + " added to cart.", "success");
    unitInput.value = "";
});

payButton.addEventListener("click", function () {
    if (cart.length === 0) {
        showStatus(checkoutStatus, "Cart is empty. Add at least one item before paying.", "error");
        return;
    }

    renderReceipt();
    showStatus(checkoutStatus, "Payment received. Receipt generated.", "success");
});

newTransactionButton.addEventListener("click", resetTransaction);

populateProductDropdowns();
renderProductList();
renderCart();
clearReceipt();
