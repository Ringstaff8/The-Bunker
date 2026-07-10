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
        .addItem("📋 Products", "showProducts")
        .addItem("📥 Receive Inventory", "showReceiving")
        .addItem("🔄 Inventory Adjustment", "showInventoryAdjustment")
    )

    .addSeparator()

    // Analytics
    .addItem("📊 Reports", "showReports")
    .addItem("⚙️ Settings", "showSettings")

    .addSeparator()

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

  SpreadsheetApp.getUi().alert(
    "🚧 Promotional Items\n\nComing in Beta 2."
  );

}

function showProducts() {

  SpreadsheetApp.getUi().alert(
    "🚧 Product Management\n\nComing in Beta 2."
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