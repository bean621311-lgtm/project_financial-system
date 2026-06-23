let currentAccount = "Individual";
function showLogin() {
    document.getElementById("aboutSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
}

function individualLogin() {

    let buttons = document.querySelectorAll(".tabs button");

    buttons[0].classList.add("active");
    buttons[1].classList.remove("active");

    alert("Individual Login Selected");
}

function businessLogin() {

    let buttons = document.querySelectorAll(".tabs button");

    buttons[1].classList.add("active");
    buttons[0].classList.remove("active");

    alert("Business Login Selected");
}


function checkPassword() {

    let password = document.getElementById("password").value;
    let strength = document.getElementById("strength");

    if (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    ) {

        strength.innerHTML = "✅ Strong Password";
        strength.style.color = "green";

    } else if (password.length >= 6) {

        strength.innerHTML = "⚠ Medium Password";
        strength.style.color = "orange";

    } else {

        strength.innerHTML = "❌ Weak Password";
        strength.style.color = "red";
    }
}



   


let sales = [];
let inventory = [];
let customers = [];
let suppliers = [];
let purchaseRecords = [];
let expenses = [];
let users = [];
let selectedInvoice = null;

function formatRs(amount) {
  return "Rs " + Number(amount || 0).toLocaleString("en-IN");
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showModule(name, el) {
  document.querySelectorAll(".module").forEach(module => {
    module.classList.remove("active-module");
  });

  document.getElementById(name + "Module").classList.add("active-module");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (el) el.classList.add("active");

  refreshAll();
}

function openModule(name) {
  const nav = [...document.querySelectorAll(".nav-item")].find(item =>
    item.textContent.toLowerCase().includes(name)
  );

  showModule(name, nav);
}

function getSaleTotal(sale) {
  return sale.quantity * sale.price;
}

function totalIncome() {
  return sales.reduce((sum, sale) => sum + getSaleTotal(sale), 0);
}

function totalExpenses() {
  return expenses.reduce((sum, item) => sum + item.amount, 0);
}

/* DASHBOARD */

function refreshDashboard() {
  setText("dashSales", formatRs(totalIncome()));
  setText("dashProfit", formatRs(totalIncome() - totalExpenses()));
  setText("dashInventory", inventory.length);
  setText("dashLowStock", inventory.filter(item => item.quantity <= 10).length);

  drawLineChart("dashboardChart", getMonthlyLabels(), getMonthlySalesValues(), "Rs");
}

/* SALES */

function refreshSales() {
  const income = totalIncome();

  setText("todaySales", formatRs(income));
  setText("weeklySales", formatRs(income));
  setText("monthlySales", formatRs(income));
  setText("totalOrders", sales.length);

  loadSalesTable();
  loadProductPerformance();
  drawLineChart("salesChart", getMonthlyLabels(), getMonthlySalesValues(), "Rs");
}

function addNewSale(e) {
  e.preventDefault();

  const sale = {
    invoice: "INV-" + String(Date.now()).slice(-6),
    product: saleProduct.value.trim(),
    customer: saleCustomer.value.trim(),
    quantity: Number(saleQuantity.value),
    price: Number(salePrice.value),
    payment: salePayment.value,
    date: new Date().toISOString().slice(0, 10)
  };

  sales.unshift(sale);
  selectedInvoice = sale;

  saleForm.reset();
  renderInvoice(sale);
  refreshAll();
}

function loadSalesTable(data = sales) {
  const table = document.getElementById("salesTable");
  if (!table) return;

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `<tr><td colspan="8">No sales added yet.</td></tr>`;
    return;
  }

  data.forEach(sale => {
    table.innerHTML += `
      <tr>
        <td>${sale.invoice}</td>
        <td>${sale.product}</td>
        <td>${sale.customer}</td>
        <td>${sale.quantity}</td>
        <td>${formatRs(getSaleTotal(sale))}</td>
        <td>${sale.payment}</td>
        <td>${sale.date}</td>
        <td><button onclick="generateInvoice('${sale.invoice}')">Invoice</button></td>
      </tr>
    `;
  });
}

function generateInvoice(invoiceId) {
  const sale = sales.find(item => item.invoice === invoiceId);
  if (!sale) return;

  selectedInvoice = sale;
  renderInvoice(sale);
}

function renderInvoice(sale) {
  const box = document.getElementById("invoiceBox");

  if (!sale) {
    box.innerHTML = "No invoice selected.";
    return;
  }

  box.innerHTML = `
    <h2>BizFlow Invoice</h2>
    <div class="invoice-row"><span>Invoice ID:</span><strong>${sale.invoice}</strong></div>
    <div class="invoice-row"><span>Date:</span><strong>${sale.date}</strong></div>
    <div class="invoice-row"><span>Customer:</span><strong>${sale.customer}</strong></div>
    <div class="invoice-row"><span>Product:</span><strong>${sale.product}</strong></div>
    <div class="invoice-row"><span>Quantity:</span><strong>${sale.quantity}</strong></div>
    <div class="invoice-row"><span>Price:</span><strong>${formatRs(sale.price)}</strong></div>
    <div class="invoice-row"><span>Payment:</span><strong>${sale.payment}</strong></div>
    <div class="invoice-total">Total: ${formatRs(getSaleTotal(sale))}</div>
  `;
}

function printInvoice() {
  if (!selectedInvoice) return alert("No invoice selected.");

  const printWindow = window.open("", "", "width=700,height=700");
  printWindow.document.write(`
    <body style="font-family:Arial;padding:30px">
      ${invoiceBox.innerHTML}
    </body>
  `);
  printWindow.print();
}

function downloadInvoice() {
  if (!selectedInvoice) return alert("No invoice selected.");

  const blob = new Blob([invoiceBox.innerText], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = selectedInvoice.invoice + ".txt";
  link.click();
}

function clearSales() {
  if (!confirm("Clear all sales?")) return;

  sales = [];
  selectedInvoice = null;
  invoiceBox.innerHTML = "No invoice selected.";
  refreshAll();
}

function loadProductPerformance() {
  const box = document.getElementById("productPerformance");
  if (!box) return;

  box.innerHTML = "";

  if (sales.length === 0) {
    box.innerHTML = `<div class="empty-message">No sales data yet.</div>`;
    return;
  }

  const totals = {};

  sales.forEach(sale => {
    totals[sale.product] = (totals[sale.product] || 0) + getSaleTotal(sale);
  });

  const max = Math.max(...Object.values(totals), 1);

  Object.keys(totals).forEach(product => {
    box.innerHTML += itemBar(product, formatRs(totals[product]), (totals[product] / max) * 100);
  });
}

/* INVENTORY */

function refreshInventory() {
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const value = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const lowStock = inventory.filter(item => item.quantity <= 10).length;

  setText("totalProducts", inventory.length);
  setText("totalStock", totalStock);
  setText("inventoryValue", formatRs(value));
  setText("lowStockCount", lowStock);

  loadProductTable();
  loadInventoryAlerts();
  loadMostSoldProducts();
  drawBarChart("stockChart", inventory.map(item => item.name), inventory.map(item => item.quantity), false);
}

function addProduct(e) {
  e.preventDefault();

  const product = {
    name: productName.value.trim(),
    code: "PRD-" + String(Date.now()).slice(-6),
    category: productCategory.value,
    quantity: Number(productQuantity.value),
    supplier: productSupplier.value.trim(),
    price: Number(productPrice.value)
  };

  inventory.unshift(product);
  productForm.reset();
  refreshAll();
}

function getStockStatus(item) {
  if (item.quantity === 0) return "Out of Stock";
  if (item.quantity <= 10) return "Low Stock";
  return "In Stock";
}

function getStockClass(item) {
  if (item.quantity === 0) return "out-stock";
  if (item.quantity <= 10) return "low-stock";
  return "in-stock";
}

function loadProductTable(data = inventory) {
  const table = document.getElementById("productTable");
  if (!table) return;

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No products added yet.</td></tr>`;
    return;
  }

  data.forEach(item => {
    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.code}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>${formatRs(item.price)}</td>
        <td>${item.supplier}</td>
        <td><span class="badge ${getStockClass(item)}">${getStockStatus(item)}</span></td>
      </tr>
    `;
  });
}

function loadInventoryAlerts() {
  const box = document.getElementById("inventoryAlerts");
  if (!box) return;

  const alerts = inventory.filter(item => item.quantity <= 10);
  box.innerHTML = "";

  if (alerts.length === 0) {
    box.innerHTML = `<div class="empty-message">No low stock alerts.</div>`;
    return;
  }

  alerts.forEach(item => {
    box.innerHTML += `
      <div class="alert-item">
        <div class="alert-row">
          <span>${item.name}</span>
          <strong>${item.quantity} left</strong>
        </div>
        <small>${item.name} only ${item.quantity} left</small>
      </div>
    `;
  });
}

function loadMostSoldProducts() {
  const box = document.getElementById("mostSoldProducts");
  if (!box) return;

  box.innerHTML = "";

  if (sales.length === 0) {
    box.innerHTML = `<div class="empty-message">No sold products yet.</div>`;
    return;
  }

  const sold = {};

  sales.forEach(sale => {
    sold[sale.product] = (sold[sale.product] || 0) + sale.quantity;
  });

  const max = Math.max(...Object.values(sold), 1);

  Object.keys(sold).forEach(product => {
    box.innerHTML += itemBar(product, sold[product] + " sold", (sold[product] / max) * 100);
  });
}

function filterInventory() {
  const search = inventorySearch.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = inventory.filter(item => {
    const searchMatch =
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.supplier.toLowerCase().includes(search);

    const categoryMatch = category === "All" || item.category === category;

    return searchMatch && categoryMatch;
  });

  loadProductTable(filtered);
}

function clearInventory() {
  if (!confirm("Clear all products?")) return;

  inventory = [];
  refreshAll();
}

/* EXPENSES */

function refreshExpenses() {
  setText("expenseTotal", formatRs(totalExpenses()));
  setText("expenseCount", expenses.length);

  const highest = expenses.length ? Math.max(...expenses.map(item => item.amount)) : 0;
  setText("highestExpense", formatRs(highest));

  const categories = [...new Set(expenses.map(item => item.category))];
  setText("expenseCategoryCount", categories.length);

  loadExpenseList();
}

function addExpense(e) {
  e.preventDefault();

  expenses.push({
    category: expenseCategory.value.trim(),
    amount: Number(expenseAmount.value)
  });

  expenseForm.reset();
  refreshAll();
}

function loadExpenseList() {
  const box = document.getElementById("expenseList");
  if (!box) return;

  box.innerHTML = "";

  if (expenses.length === 0) {
    box.innerHTML = `<div class="empty-message">No expenses added yet.</div>`;
    return;
  }

  const max = Math.max(...expenses.map(item => item.amount), 1);

  expenses.forEach(item => {
    box.innerHTML += itemBar(item.category, formatRs(item.amount), (item.amount / max) * 100, "#f75f5f");
  });
}

/* CUSTOMERS */

function refreshCustomers() {
  const totalPurchase = customers.reduce((sum, customer) => sum + getCustomerTotal(customer.name), 0);
  const loyal = customers.filter(customer => getCustomerTotal(customer.name) >= 3000).length;

  let top = "None";
  let topAmount = 0;

  customers.forEach(customer => {
    const amount = getCustomerTotal(customer.name);
    if (amount > topAmount) {
      topAmount = amount;
      top = customer.name;
    }
  });

  setText("totalCustomers", customers.length);
  setText("customerPurchases", formatRs(totalPurchase));
  setText("loyalCustomers", loyal);
  setText("topCustomer", top);

  loadCustomerTable();
  loadLoyaltyList();
  drawBarChart("customerChart", customers.map(item => item.name), customers.map(item => getCustomerTotal(item.name)), true);
}

function addCustomer(e) {
  e.preventDefault();

  customers.unshift({
    name: customerName.value.trim(),
    phone: customerPhone.value.trim(),
    email: customerEmail.value.trim(),
    address: customerAddress.value.trim()
  });

  customerForm.reset();
  refreshAll();
}

function getCustomerTotal(name) {
  return sales
    .filter(sale => sale.customer.toLowerCase() === name.toLowerCase())
    .reduce((sum, sale) => sum + getSaleTotal(sale), 0);
}

function loyaltyStatus(total) {
  if (total >= 10000) return "Gold Reward";
  if (total >= 3000) return "Silver Reward";
  return "New Customer";
}

function loyaltyClass(total) {
  if (total >= 10000) return "loyal";
  if (total >= 3000) return "medium-loyal";
  return "new-customer";
}

function loadCustomerTable(data = customers) {
  const table = document.getElementById("customerTable");
  if (!table) return;

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No customers added yet.</td></tr>`;
    return;
  }

  data.forEach(customer => {
    const total = getCustomerTotal(customer.name);

    table.innerHTML += `
      <tr>
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td>${customer.email}</td>
        <td>${customer.address}</td>
        <td>${formatRs(total)}</td>
        <td><span class="badge ${loyaltyClass(total)}">${loyaltyStatus(total)}</span></td>
        <td><button onclick="showPurchaseHistory('${customer.name}')">View</button></td>
      </tr>
    `;
  });
}

function showPurchaseHistory(name) {
  const purchases = sales.filter(sale => sale.customer.toLowerCase() === name.toLowerCase());
  const total = getCustomerTotal(name);

  let html = `<h2>${name}</h2>`;

  if (purchases.length === 0) {
    html += `<p>No purchases found.</p>`;
  } else {
    purchases.forEach(sale => {
      html += `
        <div class="history-row">
          <span>${sale.product} x ${sale.quantity}</span>
          <strong>${formatRs(getSaleTotal(sale))}</strong>
        </div>
      `;
    });
  }

  html += `<div class="history-total">Total Spending: ${formatRs(total)}</div>`;
  purchaseHistory.innerHTML = html;
}

function loadLoyaltyList() {
  const box = document.getElementById("loyaltyList");
  if (!box) return;

  box.innerHTML = "";

  if (customers.length === 0) {
    box.innerHTML = `<div class="empty-message">No customers added yet.</div>`;
    return;
  }

  customers.forEach(customer => {
    const total = getCustomerTotal(customer.name);
    box.innerHTML += itemBar(customer.name, loyaltyStatus(total), Math.min((total / 10000) * 100, 100));
  });
}

function filterCustomers() {
  const search = customerSearch.value.toLowerCase();

  const filtered = customers.filter(customer =>
    customer.name.toLowerCase().includes(search) ||
    customer.phone.toLowerCase().includes(search) ||
    customer.email.toLowerCase().includes(search) ||
    customer.address.toLowerCase().includes(search)
  );

  loadCustomerTable(filtered);
}

function clearCustomers() {
  if (!confirm("Clear all customers?")) return;

  customers = [];
  purchaseHistory.innerHTML = "Select customer to view history.";
  refreshAll();
}

/* SUPPLIERS */

function refreshSuppliers() {
  const totalCost = purchaseRecords.reduce((sum, item) => sum + item.cost, 0);
  const fast = suppliers.filter(item => item.performance === "Fast Delivery").length;
  const delayed = suppliers.filter(item => item.performance === "Delayed Delivery").length;

  setText("totalSuppliers", suppliers.length);
  setText("supplierPurchaseValue", formatRs(totalCost));
  setText("fastDeliveries", fast);
  setText("delayedDeliveries", delayed);

  loadSupplierTable();
  loadPurchaseRecords();
  loadSupplierPerformanceList();
}

function addSupplier(e) {
  e.preventDefault();

  suppliers.unshift({
    name: supplierName.value.trim(),
    phone: supplierPhone.value.trim(),
    email: supplierEmail.value.trim(),
    address: supplierAddress.value.trim(),
    products: supplierProducts.value.trim(),
    performance: supplierPerformance.value
  });

  supplierForm.reset();
  refreshAll();
}

function addPurchaseRecord(e) {
  e.preventDefault();

  purchaseRecords.unshift({
    supplier: recordSupplier.value.trim(),
    product: recordProduct.value.trim(),
    quantity: Number(recordQuantity.value),
    cost: Number(recordCost.value)
  });

  purchaseRecordForm.reset();
  refreshAll();
}

function performanceClass(performance) {
  return performance === "Fast Delivery" ? "fast-delivery" : "delayed-delivery";
}

function loadSupplierTable(data = suppliers) {
  const table = document.getElementById("supplierTable");
  if (!table) return;

  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No suppliers added yet.</td></tr>`;
    return;
  }

  data.forEach(supplier => {
    const records = purchaseRecords.filter(record =>
      record.supplier.toLowerCase() === supplier.name.toLowerCase()
    ).length;

    table.innerHTML += `
      <tr>
        <td>${supplier.name}</td>
        <td>${supplier.phone}</td>
        <td>${supplier.email}</td>
        <td>${supplier.address}</td>
        <td>${supplier.products}</td>
        <td><span class="badge ${performanceClass(supplier.performance)}">${supplier.performance}</span></td>
        <td>${records} records</td>
      </tr>
    `;
  });
}

function loadPurchaseRecords() {
  const box = document.getElementById("purchaseRecords");
  if (!box) return;

  box.innerHTML = "";

  if (purchaseRecords.length === 0) {
    box.innerHTML = `<div class="empty-message">No purchase records added yet.</div>`;
    return;
  }

  purchaseRecords.forEach(record => {
    box.innerHTML += `
      <div class="record-item">
        <div class="record-row">
          <span>${record.product}</span>
          <strong>${formatRs(record.cost)}</strong>
        </div>
        <small>Supplier: ${record.supplier} · Quantity: ${record.quantity}</small>
      </div>
    `;
  });
}

function loadSupplierPerformanceList() {
  const box = document.getElementById("supplierPerformanceList");
  if (!box) return;

  box.innerHTML = "";

  if (suppliers.length === 0) {
    box.innerHTML = `<div class="empty-message">No supplier performance data.</div>`;
    return;
  }

  suppliers.forEach(supplier => {
    const percent = supplier.performance === "Fast Delivery" ? 100 : 45;
    const color = supplier.performance === "Fast Delivery" ? "#22d3a5" : "#f75f5f";

    box.innerHTML += itemBar(supplier.name, supplier.performance, percent, color);
  });
}

function filterSuppliers() {
  const search = supplierSearch.value.toLowerCase();

  const filtered = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(search) ||
    supplier.phone.toLowerCase().includes(search) ||
    supplier.email.toLowerCase().includes(search) ||
    supplier.products.toLowerCase().includes(search)
  );

  loadSupplierTable(filtered);
}

function clearSuppliers() {
  if (!confirm("Clear all suppliers?")) return;

  suppliers = [];
  purchaseRecords = [];
  refreshAll();
}

/* REPORTS */

function refreshReports() {
  const income = totalIncome();
  const expense = totalExpenses();
  const profit = income - expense;
  const margin = income > 0 ? ((profit / income) * 100).toFixed(1) : 0;

  setText("reportIncome", formatRs(income));
  setText("plIncome", formatRs(income));
  setText("dailySalesReport", formatRs(income));
  setText("monthlySalesReport", formatRs(income));
  setText("yearlySalesReport", formatRs(income));

  setText("reportExpenses", formatRs(expense));
  setText("plExpenses", formatRs(expense));

  setText("reportProfit", formatRs(profit));
  setText("plProfit", formatRs(profit));
  setText("reportMargin", margin + "%");

  loadExpenseCategories();
  loadSpendingTrends();

  drawLineChart("revenueGrowthChart", getMonthlyLabels(), getMonthlySalesValues(), "Rs");
  drawLineChart("profitTrendChart", getMonthlyLabels(), getProfitValues(), "Rs");
}

function loadExpenseCategories() {
  const box = document.getElementById("expenseCategoryList");
  if (!box) return;

  box.innerHTML = "";

  if (expenses.length === 0) {
    box.innerHTML = `<div class="empty-message">No expense categories yet.</div>`;
    return;
  }

  const max = Math.max(...expenses.map(item => item.amount), 1);

  expenses.forEach(item => {
    box.innerHTML += itemBar(item.category, formatRs(item.amount), (item.amount / max) * 100, "#f75f5f");
  });
}

function loadSpendingTrends() {
  const box = document.getElementById("spendingTrendList");
  if (!box) return;

  if (expenses.length === 0) {
    box.innerHTML = `<div class="empty-message">No spending trends yet.</div>`;
    return;
  }

  const highest = expenses.reduce((a, b) => a.amount > b.amount ? a : b);

  box.innerHTML = `
    <div class="trend-item">
      <div class="trend-row">
        <span>Highest Expense</span>
        <strong>${highest.category}</strong>
      </div>
      <small>${highest.category} is currently the biggest expense.</small>
    </div>
  `;
}

function exportReportPDF() {
  window.print();
}

function exportReportExcel() {
  let csv = "Report Type,Amount\n";
  csv += "Total Income," + totalIncome() + "\n";
  csv += "Total Expenses," + totalExpenses() + "\n";
  csv += "Net Profit," + (totalIncome() - totalExpenses()) + "\n\n";

  csv += "Expense Category,Amount\n";
  expenses.forEach(item => {
    csv += item.category + "," + item.amount + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "financial-report.csv";
  link.click();
}

/* PREDICTION */

function refreshPrediction() {
  const income = totalIncome();

  if (sales.length === 0) {
    setText("nextPrediction", formatRs(0));
    setText("growthChance", "0%");
    setText("bestProduct", "None");
    setText("predictionSuggestion", "No Data");
    drawLineChart("predictionChart", getMonthlyLabels(), [0, 0, 0, 0, 0, 0], "Rs");
    return;
  }

  const predicted = income * 1.15;

  setText("nextPrediction", formatRs(predicted));
  setText("growthChance", "+15%");

  const sold = {};
  sales.forEach(sale => {
    sold[sale.product] = (sold[sale.product] || 0) + sale.quantity;
  });

  const best = Object.keys(sold).sort((a, b) => sold[b] - sold[a])[0] || "None";

  setText("bestProduct", best);
  setText("predictionSuggestion", "Restock");

  drawLineChart("predictionChart", ["Now", "Next"], [income, predicted], "Rs");
}

/* SETTINGS */

function setTheme(theme) {
  document.body.classList.toggle("light-mode", theme === "light");
  localStorage.setItem("theme", theme);
}

function saveSettings() {
  const settings = {
    profileName: profileName.value,
    profileEmail: profileEmail.value,
    businessName: businessName.value,
    businessAddress: businessAddress.value,
    lowStockNotify: lowStockNotify.checked,
    salesNotify: salesNotify.checked
  };

  localStorage.setItem("bizflowSettings", JSON.stringify(settings));
  alert("Settings saved.");
}

function addUser(e) {
  e.preventDefault();

  users.push({
    name: newUserName.value.trim(),
    role: newUserRole.value
  });

  userForm.reset();
  loadUsers();
}

function loadUsers() {
  const box = document.getElementById("userRoleList");
  if (!box) return;

  box.innerHTML = "";

  if (users.length === 0) {
    box.innerHTML = `<div class="empty-message">No users added yet.</div>`;
    return;
  }

  users.forEach(user => {
    const roleClass = user.role === "Admin" ? "fast-delivery" : "low-stock";

    box.innerHTML += `
      <div class="supplier-performance-item">
        <div class="supplier-performance-row">
          <span>${user.name}</span>
          <span class="badge ${roleClass}">${user.role}</span>
        </div>
      </div>
    `;
  });
}

/* CHART HELPERS */

function getMonthlyLabels() {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
}

function getMonthlySalesValues() {
  const values = [0, 0, 0, 0, 0, 0];

  sales.forEach(sale => {
    const month = new Date(sale.date).getMonth();
    if (month >= 0 && month < 6) {
      values[month] += getSaleTotal(sale);
    }
  });

  return values;
}

function getProfitValues() {
  const income = getMonthlySalesValues();
  const expenseShare = totalExpenses() / 6 || 0;

  return income.map(value => value - expenseShare);
}

function itemBar(left, right, percent, color = "#4f8ef7") {
  return `
    <div class="performance-item">
      <div class="performance-row">
        <span>${left}</span>
        <strong>${right}</strong>
      </div>
      <div class="bar">
        <div class="fill" style="width:${percent}%; background:${color};"></div>
      </div>
    </div>
  `;
}

function drawLineChart(id, labels, values, prefix) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const W = canvas.parentElement.offsetWidth;
  const H = 280;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const pad = { top: 30, right: 25, bottom: 40, left: 65 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...values, 1);

  function x(i) {
    return labels.length === 1 ? pad.left + chartW / 2 : pad.left + (i / (labels.length - 1)) * chartW;
  }

  function y(value) {
    return pad.top + chartH - (value / max) * chartH;
  }

  for (let i = 0; i <= 4; i++) {
    const gy = pad.top + (i / 4) * chartH;

    ctx.strokeStyle = "#262d3f";
    ctx.beginPath();
    ctx.moveTo(pad.left, gy);
    ctx.lineTo(pad.left + chartW, gy);
    ctx.stroke();

    ctx.fillStyle = "#7a82a0";
    ctx.font = "11px Arial";
    ctx.textAlign = "right";
    ctx.fillText(prefix + " " + Math.round((max - (i / 4) * max) / 1000) + "k", pad.left - 10, gy + 4);
  }

  ctx.beginPath();

  values.forEach((value, i) => {
    if (i === 0) ctx.moveTo(x(i), y(value));
    else ctx.lineTo(x(i), y(value));
  });

  ctx.strokeStyle = "#4f8ef7";
  ctx.lineWidth = 3;
  ctx.stroke();

  values.forEach((value, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(value), 5, 0, Math.PI * 2);
    ctx.fillStyle = "#4f8ef7";
    ctx.fill();

    ctx.fillStyle = "#7a82a0";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], x(i), H - 12);
  });
}

function drawBarChart(id, labels, values, isMoney) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const W = canvas.parentElement.offsetWidth;
  const H = 280;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  if (labels.length === 0) {
    ctx.fillStyle = "#7a82a0";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("No data yet", W / 2, H / 2);
    return;
  }

  const pad = { top: 30, right: 20, bottom: 55, left: 45 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...values, 1);
  const barW = chartW / labels.length - 18;

  values.forEach((value, i) => {
    const x = pad.left + i * (chartW / labels.length) + 9;
    const barH = (value / max) * chartH;
    const y = pad.top + chartH - barH;

    ctx.fillStyle = value <= 10 && !isMoney ? "#f75f5f" : "#4f8ef7";
    ctx.fillRect(x, y, barW, barH);

    ctx.fillStyle = "#7a82a0";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(labels[i].slice(0, 10), x + barW / 2, H - 25);

    ctx.fillStyle = "#e8eaf0";
    ctx.fillText(isMoney ? formatRs(value).replace("Rs ", "") : value, x + barW / 2, y - 6);
  });
}

/* SEARCH */

function setupSearch() {
  salesSearch.addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = sales.filter(sale =>
      sale.invoice.toLowerCase().includes(value) ||
      sale.product.toLowerCase().includes(value) ||
      sale.customer.toLowerCase().includes(value) ||
      sale.payment.toLowerCase().includes(value)
    );

    loadSalesTable(filtered);
  });

  inventorySearch.addEventListener("input", filterInventory);
  categoryFilter.addEventListener("change", filterInventory);
  customerSearch.addEventListener("input", filterCustomers);
  supplierSearch.addEventListener("input", filterSuppliers);
}

/* REFRESH ALL */

function refreshAll() {
  refreshDashboard();
  refreshSales();
  refreshInventory();
  refreshExpenses();
  refreshCustomers();
  refreshSuppliers();
  refreshReports();
  refreshPrediction();
  loadUsers();
}

/* INIT */

window.addEventListener("resize", refreshAll);

document.addEventListener("DOMContentLoaded", function () {
  saleForm.addEventListener("submit", addNewSale);
  productForm.addEventListener("submit", addProduct);
  expenseForm.addEventListener("submit", addExpense);
  customerForm.addEventListener("submit", addCustomer);
  supplierForm.addEventListener("submit", addSupplier);
  purchaseRecordForm.addEventListener("submit", addPurchaseRecord);
  userForm.addEventListener("submit", addUser);

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }

  setupSearch();
  refreshAll();
  renderInvoice(null);
});





