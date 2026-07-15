/**
 * ==========================================================
 * THE BUNKER
 * Dashboard.gs
 * Beta 1.0
 * ==========================================================
 */

/**
 * Opens the Dashboard
 */
function showDashboard() {

  showDialog(
    "dashboard",
    "🌪️ The Bunker Dashboard",
    1400,
    900
  );

}


/**
 * Dashboard Statistics
 */

function getDashboardStats() {

  const products = getProducts();
const transactions = getTransactions();
const lowStockProducts = getLowStockReport();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

let inventoryValue = 0;
let lowStock = 0;
let todaysSales = 0;
let todaysProfit = 0;
let promotionalToday = 0;

  products.forEach(product => {

    const cost = Number(product.cost) || 0;
    const onHand = Number(product.onHand) || 0;
    const reorder = Number(product.reorderLevel) || 0;

    inventoryValue += cost * onHand;

  });
transactions.forEach(row => {

  const transactionDate = new Date(row[2]);
  transactionDate.setHours(0, 0, 0, 0);

  if (transactionDate.getTime() !== today.getTime()) {
    return;
  }

  const quantity = Number(row[11]) || 0;
  const price = Number(row[13]) || 0;
  const profit = Number(row[14]) || 0;

  const paymentType = String(row[15]).trim();

  if (paymentType === "Promotional") {

    promotionalToday += quantity;

  } else {

    todaysSales += quantity * price;
    todaysProfit += profit;

  }

});
const alerts = [];

if (lowStockProducts.length > 0) {
  alerts.push(`🔴 ${lowStockProducts.length} product(s) need reordered.`);
}

if (todaysSales === 0) {
  alerts.push("🟡 No sales have been recorded today.");
}

if (promotionalToday > 0) {
  alerts.push(`🔵 ${promotionalToday} promotional item(s) distributed today.`);
}

if (alerts.length === 0) {
  alerts.push("🟢 System operating normally.");
}


 return {
  totalProducts: products.length,
  inventoryValue: inventoryValue,
  lowStock: lowStockProducts.length,
  todaysSales: todaysSales,
  todaysProfit: todaysProfit,
  promotionalToday: promotionalToday,
  alerts: alerts
};

}
