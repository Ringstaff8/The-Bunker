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

  const html = HtmlService
    .createTemplateFromFile("dashboard")
    .evaluate()
    .setWidth(1400)
    .setHeight(900);

  SpreadsheetApp
    .getUi()
    .showModalDialog(html, "🌪️ The Bunker Dashboard");

}


/**
 * Dashboard Statistics
 */
function getDashboardStats() {

  const products = getActiveProducts();

  const lowStock = getLowStockProducts();

  let inventoryValue = 0;

  let totalProducts = products.length;

  products.forEach(product => {

    inventoryValue += product.cost * product.onHand;

  });

  return {

    totalProducts: totalProducts,

    inventoryValue: inventoryValue,

    lowStock: lowStock.length,

    todaysSales: 0,

    todaysProfit: 0,

    promotionalToday: 0

  };

}