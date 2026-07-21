/**
 * ==========================================================
 * THE BUNKER
 * Menu.gs
 * Beta 1.0
 * ==========================================================
 */

function createBunkerMenu() {

  const ui = SpreadsheetApp.getUi();

  ui.createMenu("🌪️ The Bunker")

    // Main Screens
    .addItem("🏠 Dashboard", "showDashboard")
    .addItem("🛒 Ring Up Sale", "showSales")
    .addItem("🎁 Promotional Items", "showPromotional")

    .addSeparator()

    // Inventory
    .addSubMenu(
      ui.createMenu("📦 Inventory")
        .addItem("📋 Products", "showProductsMaintenance")
        .addItem("📥 Receive Inventory", "showReceiving")
        .addItem("📋 Physical Inventory Count", "showInventoryCount")
        .addItem("🔄 Inventory Adjustment", "showInventoryAdjustment")
    )

    .addSeparator()

  // Reports
.addSubMenu(
  ui.createMenu("📊 Reports")

    // Current Reports
    .addItem("💰 Sales Report", "showSalesReport")
    .addItem("📉 Low Stock Report", "showLowStockReport")
    .addItem("📋 Inventory Variance Report", "showInventoryVarianceReport")
    .addItem("📜 Transaction History Report", "showTransactionHistoryReport")

    .addSeparator()

    // Inventory Reports
    .addItem("💲 Inventory Valuation Report", "showInventoryValuationReport")
    .addItem("📋 Inventory Session History Report", "showInventorySessionHistoryReport")
    .addItem("🔄 Inventory Adjustment Report", "showInventoryAdjustmentReport")

    .addSeparator()

    // Financial Reports
    .addItem("📈 Profit Report", "showProfitReport")
    .addItem("🎁 Promotional History Report", "showPromotionalHistoryReport")

    .addSeparator()

    // Dashboard
    .addItem("📊 Reports Dashboard", "showReportsDashboard")
)

    // Development Tools
    .addSubMenu(
      ui.createMenu("🛠 Developer")
        .addItem("Initialize Bunker", "initializeBunker")
        .addItem("Open Dashboard", "testDashboard")
        .addItem("Open Sales", "testSales")
    )

    .addToUi();

}
/* ==========================================================
   PLACEHOLDER FUNCTIONS
   These prevent menu errors while Beta 1 is under construction.
   Replace them later with real implementations.
========================================================== */



function showPromotional() {

  SpreadsheetApp.getUi().alert("showPromotional() is running");

}

function showInventorySessionHistoryReport() {

  SpreadsheetApp.getUi().alert(
    "This report is temporarily unavailable while it is being rebuilt."
  );

}

/**
 * Opens the Product Maintenance window
 */
function showProducts() {

  const html = HtmlService
    .createTemplateFromFile("products")
    .evaluate()
    .setWidth(1100)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "📋 Product Maintenance"
  );

}

function showReports() {

  SpreadsheetApp.getUi().alert(
    "🚧 Reports\n\nComing in Beta 2."
  );

}

function showSettings() {

  SpreadsheetApp.getUi().alert(
    "🚧 Settings\n\nComing in Beta 2."
  );

}
function showReceiving() {

  SpreadsheetApp.getUi().alert(
    "🚧 Receive Inventory\n\nComing in Beta 0.8."
  );

}