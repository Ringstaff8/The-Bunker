/**
 * ==========================================================
 * THE BUNKER
 * Reports.gs
 * Beta 1.0
 * ==========================================================
 */

/**
 * Opens the Reports screen.
 */
function showReports() {

  showDialog(
    "reports",
    "📊 Reports",
    1400,
    900
  );

}

function showInventoryVarianceReport() {

  showDialog(
    "inventoryVariance",
    "Inventory Variance Report",
    900,
    650
  );

}

function showLowStockReport() {

  showDialog(
    "lowStockReport",
    "Low Stock Report",
    1100,
    650
  );

}

function showTransactionHistoryReport() {

  showDialog(
    "transactionHistory",
    "Transaction History",
    1200,
    700
  );

}

function showSalesReport() {

  showDialog(
    "salesReport",
    "Sales Report",
    1100,
    700
  );

}

function showInventoryValuationReport() {

  showDialog(
    "inventoryValuation",
    "Inventory Valuation Report",
    1100,
    700
  );

}

function showInventorySessionHistoryReport() {

  showDialog(
    "inventorySessionHistory",
    "Inventory Session History Report",
    1100,
    700
  );

}

function showInventoryAdjustmentReport() {

  showDialog(
    "inventoryAdjustmentEntry",
    "Inventory Adjustment",
    1100,
    700
  );

}