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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let inventoryValue = 0;
  let lowStock = 0;
  let todaysSales = 0;
  let todaysProfit = 0;

  products.forEach(product => {

    const cost = Number(product.cost) || 0;
    const onHand = Number(product.onHand) || 0;
    const reorder = Number(product.reorderLevel) || 0;

    inventoryValue += cost * onHand;

    if (onHand <= reorder) {
      lowStock++;
    }

  });

  transactions.forEach(row => {

    const transactionDate = new Date(row[2]);
    transactionDate.setHours(0, 0, 0, 0);

    if (transactionDate.getTime() === today.getTime()) {

      const quantity = Number(row[11]) || 0;
      const price = Number(row[13]) || 0;
      const profit = Number(row[14]) || 0;

      todaysSales += quantity * price;
      todaysProfit += profit;

    }

  });

  return {

    totalProducts: products.length,
    inventoryValue: inventoryValue,
    lowStock: lowStock,
    todaysSales: todaysSales,
    todaysProfit: todaysProfit,
    promotionalToday: 0

  };

}
